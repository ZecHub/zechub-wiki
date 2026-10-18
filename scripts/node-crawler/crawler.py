#!/usr/bin/env python3
"""Zcash mainnet node census — discover peers, count implementations.

Stdlib only (no pip install), so the scheduled workflow and a fresh clone run
it the same way.

Discovery is two-stage: the DNS seeders give the first generation, then a
`getaddr` on every peer that answers hands back the address book each node
already keeps, which is how the census reaches past the seeds.

The count is reachable public endpoints, not the whole network. Nodes behind
NAT, a firewall, or `-listen=0` never answer and are not in the number. The
README states that limit; do not present the figure as a network total.

Usage:
    python3 crawler.py --out /tmp/census.json
    python3 crawler.py --append public/data/zcash/nodecount.json --date 10/18/2026
"""

from __future__ import annotations

import argparse
import hashlib
import ipaddress
import json
import logging
import os
import random
import re
import socket
import struct
import subprocess
import sys
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone

LOG = logging.getLogger("node-crawler")

# Wire protocol constants. Zcash forked Bitcoin's P2P framing and kept the
# message names; only the magic bytes and the port differ.
MAGIC_MAINNET = bytes.fromhex("24e92764")
PROTOCOL_VERSION = 170_100
PORT = 8233
DEFAULT_SEEDERS = (
    "dnsseed.z.cash",
    "dnsseed.str4d.xyz",
    "mainnet.seeder.zfnd.org",
    "dnsseed.zcashrouter.org",
    "mainnet.is.yolo.money",
)
UA_RE = re.compile(r"^/([^:/]+):([^/]*)/?")
ZEBRA_UA = {"zebra"}
ZCASHD_UA = {"magicbean", "satoshi"}


# --------------------------------------------------------------------------
# Wire format
# --------------------------------------------------------------------------

def _frame(command: str, payload: bytes, magic: bytes = MAGIC_MAINNET) -> bytes:
    checksum = hashlib.sha256(hashlib.sha256(payload).digest()).digest()[:4]
    return (
        magic
        + command.encode("ascii").ljust(12, b"\x00")
        + struct.pack("<I", len(payload))
        + checksum
        + payload
    )


def _net_addr(ip: str = "0.0.0.0", port: int = 0, services: int = 0) -> bytes:
    """26-byte network address: services, IPv6-mapped IPv4, big-endian port."""
    return (
        struct.pack("<Q", services)
        + b"\x00" * 10
        + b"\xff\xff"
        + socket.inet_aton(ip)
        + struct.pack(">H", port)
    )


def version_payload() -> bytes:
    now = int(time.time())
    ua = b"/zc-node-census:1.0/"
    return (
        struct.pack("<i", PROTOCOL_VERSION)
        + struct.pack("<Q", 0)  # services: we accept nothing, we only listen
        + struct.pack("<q", now)
        + _net_addr()
        + _net_addr()
        + struct.pack("<Q", random.getrandbits(64))
        + bytes([len(ua)])
        + ua
        + struct.pack("<i", 0)  # start height: unknown
        + b"\x00"  # relay: no
    )


def _read_exact(sock: socket.socket, count: int) -> bytes:
    buf = b""
    while len(buf) < count:
        chunk = sock.recv(count - len(buf))
        if not chunk:
            raise ConnectionError("peer closed the connection mid-message")
        buf += chunk
    return buf


def read_message(sock: socket.socket, magic: bytes = MAGIC_MAINNET) -> tuple[str, bytes]:
    header = _read_exact(sock, 24)
    if header[:4] != magic:
        raise ConnectionError("wrong network magic in the response")
    command = header[4:16].rstrip(b"\x00").decode("ascii", "replace")
    length = struct.unpack("<I", header[16:20])[0]
    if length > 4 * 1024 * 1024:
        raise ConnectionError(f"oversized message ({length} bytes)")
    return command, _read_exact(sock, length) if length else b""


def read_varint(payload: bytes, offset: int) -> tuple[int, int]:
    prefix = payload[offset]
    if prefix < 0xFD:
        return prefix, offset + 1
    if prefix == 0xFD:
        return struct.unpack_from("<H", payload, offset + 1)[0], offset + 3
    if prefix == 0xFE:
        return struct.unpack_from("<I", payload, offset + 1)[0], offset + 5
    return struct.unpack_from("<Q", payload, offset + 1)[0], offset + 9


def parse_version(payload: bytes) -> dict:
    """Pull version, user agent and start height out of a version message."""
    if len(payload) < 80:
        raise ValueError("version payload too short")
    protocol = struct.unpack_from("<i", payload, 0)[0]
    # version(4) services(8) timestamp(8) addr_recv(26) addr_from(26) nonce(8)
    offset = 4 + 8 + 8 + 26 + 26 + 8
    ua_len, offset = read_varint(payload, offset)
    user_agent = payload[offset : offset + ua_len].decode("utf-8", "replace")
    offset += ua_len
    start_height = struct.unpack_from("<i", payload, offset)[0] if len(payload) >= offset + 4 else None
    return {"protocol": protocol, "user_agent": user_agent, "start_height": start_height}


def parse_addr(payload: bytes, limit: int = 1000) -> list[tuple[str, int]]:
    """Read the addr message: varint count, then 30-byte entries.

    Entry layout follows Bitcoin/Zcash: time(4) services(8) ip(16) port(2).
    The IP starts at +12, not +8 — services is a 64-bit field.
    """
    count, offset = read_varint(payload, 0)
    out: list[tuple[str, int]] = []
    for _ in range(min(count, limit)):
        if len(payload) < offset + 30:
            break
        raw = payload[offset + 12 : offset + 28]
        port = struct.unpack_from(">H", payload, offset + 28)[0]
        offset += 30
        try:
            addr = ipaddress.ip_address(raw)
        except ValueError:
            continue
        # An IPv4 peer arrives IPv6-mapped (::ffff:a.b.c.d). Strip to the real
        # IPv4 address rather than emitting the hex remainder as text.
        if isinstance(addr, ipaddress.IPv6Address) and addr.ipv4_mapped is not None:
            addr = addr.ipv4_mapped
        out.append((str(addr), port))
    return out


def classify(user_agent: str) -> str:
    """Map a user agent onto the implementation bucket the chart plots."""
    match = UA_RE.match(user_agent or "")
    if not match:
        return "unknown"
    name = match.group(1).lower()
    if name in ZEBRA_UA:
        return "zebra"
    if name in ZCASHD_UA:
        return "zcashd"
    return "other"


def ua_version(user_agent: str) -> str:
    match = UA_RE.match(user_agent or "")
    return match.group(2) if match else ""


# --------------------------------------------------------------------------
# Discovery
# --------------------------------------------------------------------------

PUBLIC_RESOLVERS = (
    "1.1.1.1",
    "1.0.0.1",
    "8.8.8.8",
    "8.8.4.4",
    "9.9.9.9",
    "149.112.112.112",
    "208.67.222.222",
    "208.67.220.220",
    "64.6.64.6",
    "64.6.65.6",
    "94.140.14.14",
    "94.140.15.15",
    "185.228.168.9",
    "76.76.2.0",
    "156.154.70.1",
    "77.88.8.8",
    "84.200.69.80",
    "8.26.56.26",
)


def _dig(seeder: str, resolver: str | None, timeout: float) -> set[str]:
    command = ["dig", "+short", f"+time={int(max(1, timeout))}", "+tries=1", "A", seeder]
    if resolver:
        command.insert(1, "@" + resolver)
    try:
        proc = subprocess.run(command, capture_output=True, text=True, timeout=timeout + 5)
    except (subprocess.TimeoutExpired, FileNotFoundError):
        return set()
    return {
        token.strip()
        for token in proc.stdout.split()
        if re.fullmatch(r"\d{1,3}(?:\.\d{1,3}){3}", token.strip())
    }


def resolve_seeders(
    seeders=DEFAULT_SEEDERS,
    timeout: float = 15.0,
    resolvers=None,
    rounds: int = 2,
) -> list[str]:
    """Collect candidates from every seeder, through several resolvers.

    The seeders hand out a *sample* of their address book per query, and the
    sample is keyed to the asking resolver. One resolver against one seeder
    returned 34 addresses; the same seeders across the public resolvers
    returned 145. Querying a single resolver caps the census for no reason, so
    the default fans out.
    """
    from concurrent.futures import ThreadPoolExecutor

    resolvers = list(resolvers) if resolvers else list(PUBLIC_RESOLVERS)
    found: set[str] = set()
    for _ in range(max(1, rounds)):
        jobs = [(seeder, resolver) for seeder in seeders for resolver in resolvers]
        with ThreadPoolExecutor(max_workers=32) as pool:
            for got in pool.map(lambda job: _dig(job[0], job[1], timeout), jobs):
                found |= got

    # Fall back to the system resolver when dig is missing (minimal container)
    # — worse coverage than the fan-out, but better than zero candidates.
    if not found:
        for seeder in seeders:
            try:
                for info in socket.getaddrinfo(seeder, None, socket.AF_INET):
                    found.add(info[4][0])
            except socket.gaierror:
                continue
    LOG.info("seeders returned %d unique candidate addresses", len(found))
    return sorted(found)


@dataclass
class Census:
    """Running tally. `peers` is keyed by ip so a node that answers twice
    (direct probe plus a PEX announcement) is only counted once."""

    peers: dict[str, dict] = field(default_factory=dict)
    probed: int = 0
    connected: int = 0
    errors: dict[str, int] = field(default_factory=dict)

    def record(self, ip: str, info: dict) -> None:
        impl = classify(info["user_agent"])
        self.peers[ip] = {
            "ip": ip,
            "implementation": impl,
            "user_agent": info["user_agent"],
            "version": ua_version(info["user_agent"]),
            "protocol": info["protocol"],
            "start_height": info.get("start_height"),
            "source": info.get("source", "direct"),
        }

    def counts(self) -> dict[str, int]:
        tally = {"zebra": 0, "zcashd": 0, "other": 0, "unknown": 0}
        for peer in self.peers.values():
            tally[peer["implementation"]] += 1
        return tally

    @property
    def total(self) -> int:
        """Peers that answered. Not the network size — see README limits."""
        return len(self.peers)


def probe(ip: str, timeout: float = 8.0, source: str = "direct") -> dict | None:
    """Handshake with one peer. Returns its version info, or None."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    try:
        sock.connect((ip, PORT))
        sock.sendall(_frame("version", version_payload()))
        deadline = time.monotonic() + timeout
        # The peer replies version, then often verack; either proves the node.
        while time.monotonic() < deadline:
            command, payload = read_message(sock)
            if command == "version":
                info = parse_version(payload)
                info["source"] = source
                return info
            if command in ("ping", "alert"):
                continue
    except (socket.timeout, ConnectionError, OSError, ValueError) as exc:
        LOG.debug("%s: %s", ip, exc)
        return None
    finally:
        sock.close()
    return None


def request_addrs(ip: str, timeout: float = 8.0, limit: int = 1000) -> list[tuple[str, int]]:
    """Ask one peer for its address book. This is what makes the census
    broader than the seeders alone."""
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(timeout)
    addrs: list[tuple[str, int]] = []
    try:
        sock.connect((ip, PORT))
        sock.sendall(_frame("version", version_payload()))
        # Finish the handshake before asking, otherwise the peer ignores getaddr.
        deadline = time.monotonic() + timeout
        saw_version = False
        while time.monotonic() < deadline and not saw_version:
            command, _ = read_message(sock)
            if command == "version":
                saw_version = True
        if not saw_version:
            return []
        sock.sendall(_frame("verack", b""))
        sock.sendall(_frame("getaddr", b""))
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            try:
                command, payload = read_message(sock)
            except (socket.timeout, ConnectionError):
                break
            if command == "addr":
                addrs.extend(parse_addr(payload, limit))
                if len(addrs) >= limit:
                    break
            elif command == "ping":
                try:
                    sock.sendall(_frame("pong", payload))
                except OSError:
                    break
    except (socket.timeout, ConnectionError, OSError, ValueError) as exc:
        LOG.debug("getaddr %s: %s", ip, exc)
    finally:
        sock.close()
    # Only mainnet-port entries can be census targets.
    seen: list[tuple[str, int]] = []
    for addr, addr_port in addrs:
        if addr_port == PORT and (addr, addr_port) not in seen:
            seen.append((addr, addr_port))
    return seen


def census_with_pex(
    seeders=DEFAULT_SEEDERS,
    max_peers: int = 400,
    workers: int = 24,
    timeout: float = 8.0,
    pex: bool = True,
    resolvers=None,
) -> Census:
    """Probe the seeders, then probe what their peers' address books add.

    The futures carry the address they were submitted with, so a PEX result is
    recorded under its own IP rather than the peer that announced it.
    """
    from concurrent.futures import ThreadPoolExecutor, as_completed

    census = Census()
    candidates = resolve_seeders(seeders, resolvers=resolvers)
    if not candidates:
        return census

    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(probe, ip, timeout): ip for ip in candidates[:max_peers]}
        for future in as_completed(futures):
            ip = futures[future]
            census.probed += 1
            try:
                info = future.result()
            except Exception as exc:
                census.errors["worker"] = census.errors.get("worker", 0) + 1
                LOG.debug("worker failed: %s", exc)
                continue
            if info:
                census.connected += 1
                census.record(ip, info)

    responders = list(census.peers)[:40]
    extra: set[str] = set()
    if pex and responders:
        with ThreadPoolExecutor(max_workers=min(12, len(responders))) as pool:
            futures = [pool.submit(request_addrs, ip, timeout) for ip in responders]
            for future in as_completed(futures):
                try:
                    for addr, _ in future.result():
                        if addr not in census.peers and addr not in extra:
                            extra.add(addr)
                except Exception:
                    continue
    extra_list = list(extra)[:max_peers]
    LOG.info("peer exchange suggested %d new addresses", len(extra_list))
    if extra_list:
        with ThreadPoolExecutor(max_workers=workers) as pool:
            futures = {pool.submit(probe, ip, timeout): ip for ip in extra_list}
            for future in as_completed(futures):
                ip = futures[future]
                census.probed += 1
                try:
                    info = future.result()
                except Exception:
                    continue
                if info:
                    info["source"] = "pex"
                    census.connected += 1
                    census.record(ip, info)
    return census


# --------------------------------------------------------------------------
# Output
# --------------------------------------------------------------------------

def to_census_document(census: Census, when: datetime | None = None) -> dict:
    when = when or datetime.now(timezone.utc)
    counts = census.counts()
    return {
        "generated_at": when.strftime("%Y-%m-%dT%H:%M:%SZ"),
        "port": PORT,
        "seeds_probed": census.probed,
        "peers_answered": census.total,
        "counts": counts,
        "total": census.total,
        "peers": sorted(census.peers.values(), key=lambda p: p["ip"]),
    }


def guard_result(document: dict, minimum: int) -> None:
    """A census that reached almost nothing is a network failure on our side,
    not a shrinking network. Refuse to publish it."""
    if document["peers_answered"] < minimum:
        raise SystemExit(
            f"refusing to publish: only {document['peers_answered']} peers answered "
            f"(minimum {minimum}). This looks like blocked egress or a bad seeder list, "
            f"not a real network change."
        )
    if document["counts"]["zebra"] + document["counts"]["zcashd"] + document["counts"]["other"] == 0:
        raise SystemExit("refusing to publish: every peer classified as unknown")


def load_history(path: str) -> list[dict]:
    if not os.path.exists(path):
        return []
    with open(path, encoding="utf-8") as handle:
        data = json.load(handle)
    if not isinstance(data, list):
        raise SystemExit(f"{path}: expected a JSON array, got {type(data).__name__}")
    return data


def append_row(path: str, row: dict) -> list[dict]:
    """Append one dated row, replacing any row with the same date so a re-run
    on the same day stays idempotent instead of stacking duplicates."""
    rows = load_history(path)
    rows = [existing for existing in rows if existing.get("Date") != row["Date"]]
    rows.append(row)
    with open(path, "w", encoding="utf-8") as handle:
        json.dump(rows, handle, indent=2)
        handle.write("\n")
    return rows


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", help="write the full census document here")
    parser.add_argument("--append", help="append a dated row to this nodecount.json")
    parser.add_argument("--date", help="row date, MM/DD/YYYY (default: today UTC)")
    parser.add_argument("--max-peers", type=int, default=400)
    parser.add_argument("--workers", type=int, default=24)
    parser.add_argument("--timeout", type=float, default=8.0)
    parser.add_argument("--minimum", type=int, default=10,
                        help="refuse to publish below this many answering peers")
    parser.add_argument("--no-pex", action="store_true", help="skip peer exchange")
    parser.add_argument("--seeders", default=",".join(DEFAULT_SEEDERS))
    parser.add_argument("--resolvers", default="",
                        help="comma-separated DNS resolvers; default fans out over the public set")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args(argv)

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
    )

    seeders = [s.strip() for s in args.seeders.split(",") if s.strip()]
    resolvers = [r.strip() for r in args.resolvers.split(",") if r.strip()] or None
    started = time.monotonic()
    census = census_with_pex(
        seeders=seeders,
        resolvers=resolvers,
        max_peers=args.max_peers,
        workers=args.workers,
        timeout=args.timeout,
        pex=not args.no_pex,
    )
    document = to_census_document(census)
    document["duration_seconds"] = round(time.monotonic() - started, 1)

    LOG.info(
        "census: %d answered of %d probed — zebra=%d zcashd=%d other=%d",
        document["peers_answered"], document["seeds_probed"],
        document["counts"]["zebra"], document["counts"]["zcashd"], document["counts"]["other"],
    )

    guard_result(document, args.minimum)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as handle:
            json.dump(document, handle, indent=2)
            handle.write("\n")
        LOG.info("wrote %s", args.out)

    if args.append:
        stamp = args.date or datetime.now(timezone.utc).strftime("%m/%d/%Y")
        row = {
            "Date": stamp,
            "nodecount": str(document["total"]),
            "zebra": str(document["counts"]["zebra"]),
            "zcashd": str(document["counts"]["zcashd"]),
            "other": str(document["counts"]["other"]),
        }
        rows = append_row(args.append, row)
        LOG.info("appended %s to %s (%d rows)", row, args.append, len(rows))

    if not args.out and not args.append:
        print(json.dumps(document, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())