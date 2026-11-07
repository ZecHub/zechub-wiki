#!/usr/bin/env python3
"""Bounded, outbound-only Zcash mainnet peer census (Python 3.11+)."""
import argparse
import asyncio
from collections import Counter, deque
from datetime import datetime, timezone
import hashlib
import ipaddress
import json
import os
from pathlib import Path
import re
import secrets
import socket
import struct
import tempfile
import time

MAGIC = bytes.fromhex('24e92764')
PROTOCOL = 170160  # NU6.3; see ZIP 204. Update with future network upgrades.
SEEDS = ('dnsseed.z.cash', 'dnsseed.str4d.xyz', 'mainnet.seeder.zfnd.org',
         'mainnet.is.yolo.money', 'mainnet.seeder.shieldedinfra.net', 'seeder.zec.rocks')
DEFAULT_OUTPUT = Path(__file__).resolve().parents[2] / 'public/data/zcash/nodecount.json'
MAX_PAYLOAD = 2 * 1024 * 1024


def checksum(data):
    return hashlib.sha256(hashlib.sha256(data).digest()).digest()[:4]


def message(command, payload=b''):
    return MAGIC + command.encode('ascii').ljust(12, b'\0') + struct.pack('<I', len(payload)) + checksum(payload) + payload


class Reader:
    def __init__(self, data):
        self.data, self.pos = data, 0

    def take(self, size):
        if self.pos + size > len(self.data):
            raise ValueError('truncated payload')
        value = self.data[self.pos:self.pos + size]
        self.pos += size
        return value

    def compact(self):
        tag = self.take(1)[0]
        if tag < 253:
            return tag
        size, minimum = {253: (2, 253), 254: (4, 65536), 255: (8, 4294967296)}[tag]
        value = int.from_bytes(self.take(size), 'little')
        if value < minimum:
            raise ValueError('noncanonical CompactSize')
        return value


def public_endpoint(host, port):
    ip = ipaddress.ip_address(host)
    if isinstance(ip, ipaddress.IPv6Address) and ip.ipv4_mapped:
        ip = ip.ipv4_mapped
    # No DNS supplied by peers, private/loopback/multicast/transition targets.
    if (not ip.is_global or ip.is_multicast or ip.is_reserved
            or (isinstance(ip, ipaddress.IPv6Address) and (ip.sixtofour or ip.teredo))
            or not 1 <= port <= 65535):
        return None
    return str(ip), port


def classify(agent):
    match = re.search(r'/(Zebra|MagicBean|zcashd):([^/\s()]+)', agent, re.I)
    if not match:
        return 'other', None
    return ('zebra' if match[1].lower() == 'zebra' else 'zcashd'), match[2]


def parse_version(data, nonce):
    r = Reader(data)
    protocol, services, _ = struct.unpack('<iQq', r.take(20))
    r.take(52)
    remote_nonce = struct.unpack('<Q', r.take(8))[0]
    size = r.compact()
    if size > 256 or remote_nonce == nonce or not 170002 <= protocol <= 170999:
        raise ValueError('invalid version')
    agent = r.take(size).decode('utf-8', errors='replace')
    height = struct.unpack('<i', r.take(4))[0]
    if len(data) - r.pos > 1 or (r.pos < len(data) and r.take(1)[0] not in (0, 1)):
        raise ValueError('invalid version suffix')
    implementation, version = classify(agent)
    return dict(user_agent=agent, implementation=implementation, version=version,
                protocol_version=protocol, services=services, height=height)


def parse_addresses(data, v2=False):
    r = Reader(data)
    count = r.compact()
    if count > 1000:
        raise ValueError('too many addresses')
    peers = []
    for _ in range(count):
        r.take(4)  # timestamp
        if v2:
            r.compact()  # services
            network = r.take(1)[0]
            size = r.compact()
            if size > 512:
                raise ValueError('oversized address')
            raw = r.take(size)
            expected = {1: 4, 2: 16, 4: 32, 5: 32, 6: 16}.get(network)
            if expected is not None and size != expected:
                raise ValueError('invalid address length')
        else:
            r.take(8)
            network, raw = 2, r.take(16)
        port = int.from_bytes(r.take(2), 'big')
        if network in (1, 2):
            endpoint = public_endpoint(str(ipaddress.ip_address(raw)), port)
            if endpoint:
                peers.append(endpoint)
    if r.pos != len(data):
        raise ValueError('trailing address data')
    return peers


def version_payload(endpoint, nonce):
    ip = ipaddress.ip_address(endpoint[0])
    packed = ip.packed if ip.version == 6 else b'\0' * 10 + b'\xff\xff' + ip.packed
    remote = struct.pack('<Q', 0) + packed + struct.pack('>H', endpoint[1])
    agent = b'/ZecHubCrawler:1.0.0/'
    return (struct.pack('<iQq', PROTOCOL, 0, int(time.time())) + remote + bytes(26)
            + struct.pack('<Q', nonce) + bytes([len(agent)]) + agent + struct.pack('<iB', 0, 0))


async def read_message(reader):
    header = await reader.readexactly(24)
    size = struct.unpack('<I', header[16:20])[0]
    command = header[4:16].split(b'\0', 1)[0]
    if (header[:4] != MAGIC or size > MAX_PAYLOAD or not command
            or any(c < 32 or c > 126 for c in command)
            or header[4:16] != command.ljust(12, b'\0')):
        raise ValueError('invalid message header')
    payload = await reader.readexactly(size)
    if checksum(payload) != header[20:24]:
        raise ValueError('invalid checksum')
    return command, payload


async def probe(endpoint, timeout):
    writer = None
    result, peers = None, []
    try:
        async with asyncio.timeout(timeout):
            reader, writer = await asyncio.open_connection(*endpoint)
            nonce = secrets.randbits(64)
            writer.write(message('version', version_payload(endpoint, nonce)))
            await writer.drain()
            command, payload = await read_message(reader)
            if command != b'version':
                raise ValueError('expected version')
            candidate = parse_version(payload, nonce)
            writer.write(message('verack'))
            await writer.drain()
            command, payload = await read_message(reader)
            if command != b'verack' or payload:
                raise ValueError('expected verack')
            result = dict(host=endpoint[0], port=endpoint[1], **candidate)
        async with asyncio.timeout(timeout):
            writer.write(message('getaddr'))
            await writer.drain()
            # Bounded even if a peer streams messages indefinitely.
            for _ in range(32):
                command, payload = await read_message(reader)
                if command == b'ping' and len(payload) == 8:
                    writer.write(message('pong', payload))
                    await writer.drain()
                elif command in (b'addr', b'addrv2'):
                    peers.extend(parse_addresses(payload, command == b'addrv2'))
                elif command == b'version':
                    raise ValueError('duplicate version')
    except (OSError, TimeoutError, ValueError, asyncio.IncompleteReadError):
        pass
    finally:
        if writer:
            writer.close()
            try:
                await asyncio.wait_for(writer.wait_closed(), 1)
            except (OSError, TimeoutError):
                pass
    # A completed handshake still counts if getaddr is unanswered.
    return result, peers


async def resolve_seed(seed, timeout):
    try:
        rows = await asyncio.wait_for(asyncio.get_running_loop().getaddrinfo(
            seed, 8233, type=socket.SOCK_STREAM), timeout)
        peers = {p for row in rows if (p := public_endpoint(row[4][0], row[4][1]))}
        return seed, sorted(peers)
    except (OSError, TimeoutError):
        return seed, []


async def crawl(seeds=SEEDS, concurrency=16, timeout=8, max_nodes=10000, duration=900):
    started = datetime.now(timezone.utc)
    seed_results = await asyncio.gather(*(resolve_seed(s, timeout) for s in seeds))
    queue = deque()
    seen, records = set(), []
    capped = False

    def enqueue(peers):
        nonlocal capped
        for endpoint in peers:
            if endpoint in seen:
                continue
            if len(seen) >= max_nodes:
                capped = True
                continue
            seen.add(endpoint)
            queue.append(endpoint)

    for _, peers in seed_results:
        enqueue(peers)
    attempted = 0
    timed_out = False
    try:
        async with asyncio.timeout(duration):
            while queue:
                batch = [queue.popleft() for _ in range(min(concurrency, len(queue)))]
                attempted += len(batch)
                for result, peers in await asyncio.gather(*(probe(p, timeout) for p in batch)):
                    if result:
                        records.append(result)
                    enqueue(peers)
    except TimeoutError:
        timed_out = True
    return dict(started_at=started.isoformat(), finished_at=datetime.now(timezone.utc).isoformat(),
                seeds={s: len(p) for s, p in seed_results}, attempted=attempted,
                discovered=len(seen), complete=not capped and not timed_out,
                limit_reached=capped, timed_out=timed_out,
                nodes=sorted(records, key=lambda n: (n['host'], n['port'])))


def daily_row(report):
    if not report['complete'] or not report['nodes'] or not any(report['seeds'].values()):
        raise ValueError('refusing to publish an empty, unseeded, or truncated census')
    counts = Counter(n['implementation'] for n in report['nodes'])
    agents = Counter(n['user_agent'] for n in report['nodes'])
    return dict(Date=datetime.fromisoformat(report['finished_at']).strftime('%m/%d/%Y'),
                nodecount=str(len(report['nodes'])),
                zebra=counts['zebra'], zcashd=counts['zcashd'], other=counts['other'],
                observed_at=report['finished_at'],
                user_agents=dict(sorted(agents.items())),
                attempted=report['attempted'], source='zechub-crawler-v1')


def atomic_json(path, value):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    fd, temp = tempfile.mkstemp(dir=path.parent, prefix=f'.{path.name}.')
    try:
        with os.fdopen(fd, 'w') as output:
            json.dump(value, output, indent=2, ensure_ascii=True)
            output.write('\n')
        os.replace(temp, path)
    finally:
        if os.path.exists(temp):
            os.unlink(temp)


def append_daily(path, row):
    # Refuse malformed input; never erase or fabricate historical rows.
    rows = json.loads(Path(path).read_text())
    if not isinstance(rows, list):
        raise ValueError('history must be an array')
    dates = [datetime.strptime(r['Date'], '%m/%d/%Y') for r in rows]
    date = datetime.strptime(row['Date'], '%m/%d/%Y')
    if dates and date <= max(dates):
        return False  # idempotent: first successful observation of a UTC day wins
    atomic_json(path, [*rows, row])
    return True


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--output', type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument('--report', type=Path, help='optional local per-peer report (contains public IP addresses)')
    parser.add_argument('--dry-run', action='store_true')
    parser.add_argument('--concurrency', type=int, default=16)
    parser.add_argument('--timeout', type=float, default=8)
    parser.add_argument('--max-nodes', type=int, default=10000)
    parser.add_argument('--duration', type=float, default=900)
    args = parser.parse_args()
    if not (1 <= args.concurrency <= 64 and args.timeout > 0 and args.max_nodes > 0 and args.duration > 0):
        parser.error('positive limits required; concurrency must be 1..64')
    report = asyncio.run(crawl(concurrency=args.concurrency, timeout=args.timeout,
                              max_nodes=args.max_nodes, duration=args.duration))
    if args.report:
        atomic_json(args.report, report)
    print(json.dumps({k: v for k, v in report.items() if k != 'nodes'}, indent=2))
    try:
        row = daily_row(report)
        print(json.dumps(row, indent=2))
        if not args.dry_run:
            print('Appended daily observation' if append_daily(args.output, row) else 'Day already recorded; unchanged')
    except ValueError as error:
        parser.exit(1, f'{error}\n')


if __name__ == '__main__':
    main()
