#!/usr/bin/env python3
"""Tests for the node census crawler.

Stdlib unittest only — `python3 -m unittest` runs these with no install step,
which is how the workflow invokes them.

The wire-format tests build their payloads from the protocol spec rather than
from recorded bytes, so they keep passing when the peer set changes. The two
recorded fixtures below are the only captured data, and they pin the parsing
that a live run cannot pin on demand.
"""

import json
import os
import struct
import sys
import tempfile
import unittest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import crawler  # noqa: E402


def build_version_payload(user_agent: str, protocol: int = 170_100, start_height: int = 3_000_000) -> bytes:
    """A version message shaped like a real peer's, for the parser."""
    ua = user_agent.encode()
    return (
        struct.pack("<i", protocol)
        + struct.pack("<Q", 1)
        + struct.pack("<q", 1_700_000_000)
        + crawler._net_addr("10.0.0.1", 8233, 1)
        + crawler._net_addr("10.0.0.2", 8233, 1)
        + struct.pack("<Q", 12345)
        + bytes([len(ua)])
        + ua
        + struct.pack("<i", start_height)
        + b"\x00"
    )


def build_addr_payload(entries) -> bytes:
    """An addr message. Entry: time(4) services(8) ip(16) port(2)."""
    import socket as _socket

    payload = bytes([len(entries)])  # count < 0xFD, so a one-byte varint
    for ip, port in entries:
        payload += struct.pack("<I", 1_700_000_000)
        payload += struct.pack("<Q", 1)
        payload += b"\x00" * 10 + b"\xff\xff" + _socket.inet_aton(ip)
        payload += struct.pack(">H", port)
    return payload


class TestVersionParsing(unittest.TestCase):
    def test_reads_user_agent_and_protocol(self):
        payload = build_version_payload("/Zebra:5.1.0/", protocol=170_150, start_height=2_500_000)
        info = crawler.parse_version(payload)
        self.assertEqual(info["user_agent"], "/Zebra:5.1.0/")
        self.assertEqual(info["protocol"], 170_150)
        self.assertEqual(info["start_height"], 2_500_000)

    def test_reads_a_long_user_agent_through_the_varint(self):
        ua = "/Zebra:6.4.2-modified/" + "x" * 200 + "/"
        info = crawler.parse_version(build_version_payload(ua))
        self.assertEqual(info["user_agent"], ua)

    def test_short_payload_is_rejected_rather_than_misread(self):
        with self.assertRaises(ValueError):
            crawler.parse_version(b"\x00" * 40)


class TestAddrParsing(unittest.TestCase):
    """The IP sits at +12, behind the 64-bit services field. Reading at +8
    silently yields a wrong address, which is why this is pinned."""

    def test_parses_entries_at_the_correct_offset(self):
        entries = [("192.0.2.10", 8233), ("198.51.100.7", 8233), ("203.0.113.4", 8233)]
        parsed = crawler.parse_addr(build_addr_payload(entries))
        self.assertEqual(parsed, entries)

    def test_a_services_field_of_one_does_not_shift_the_address(self):
        # services = 1 sets the low byte; if the parser read at +8 the address
        # would come out as ::0100:c000:020a-style garbage instead of 192.0.2.10.
        parsed = crawler.parse_addr(build_addr_payload([("192.0.2.10", 8233)]))
        self.assertEqual(parsed[0][0], "192.0.2.10")

    def test_truncated_final_entry_is_dropped_not_crashed_on(self):
        payload = build_addr_payload([("192.0.2.10", 8233), ("198.51.100.7", 8233)])
        parsed = crawler.parse_addr(payload[:-20])
        self.assertEqual(len(parsed), 1)

    def test_count_larger_than_the_body_stops_cleanly(self):
        payload = bytearray(build_addr_payload([("192.0.2.10", 8233)]))
        payload[0] = 50  # claim 50 entries, supply 1
        self.assertEqual(len(crawler.parse_addr(bytes(payload))), 1)


class TestClassification(unittest.TestCase):
    def test_zebra_variants(self):
        for ua in ("/Zebra:6.4.2/", "/Zebra:5.1.0/", "/zebra:1.0/"):
            self.assertEqual(crawler.classify(ua), "zebra", ua)

    def test_zcashd_variants(self):
        for ua in ("/MagicBean:5.4.1/", "/Satoshi:4.7.0/"):
            self.assertEqual(crawler.classify(ua), "zcashd", ua)

    def test_other_implementations_are_not_folded_into_the_known_two(self):
        # Zakura is a real mainnet peer seen on 16 Oct 2026; it must not be
        # counted as Zebra or zcashd.
        self.assertEqual(crawler.classify("/Zakura:1.6.0/"), "other")
        self.assertEqual(crawler.classify("/Zakura:1.5.0/"), "other")

    def test_unparseable_user_agent_is_unknown(self):
        self.assertEqual(crawler.classify(""), "unknown")
        self.assertEqual(crawler.classify("Zebra:1.0"), "unknown")

    def test_version_extraction(self):
        self.assertEqual(crawler.ua_version("/Zebra:6.4.2-modified/"), "6.4.2-modified")
        self.assertEqual(crawler.ua_version("nonsense"), "")


class TestCounts(unittest.TestCase):
    def _census(self):
        census = crawler.Census()
        for ip, ua in (
            ("192.0.2.1", "/Zebra:6.4.2/"),
            ("192.0.2.2", "/Zebra:5.1.0/"),
            ("192.0.2.3", "/Zakura:1.6.0/"),
        ):
            census.record(ip, {"user_agent": ua, "protocol": 170_150, "start_height": 1, "source": "direct"})
        return census

    def test_counts_land_in_the_right_bucket(self):
        counts = self._census().counts()
        self.assertEqual(counts["zebra"], 2)
        self.assertEqual(counts["other"], 1)
        self.assertEqual(counts["zcashd"], 0)

    def test_one_ip_is_counted_once_even_when_seen_twice(self):
        census = self._census()
        census.record("192.0.2.1", {"user_agent": "/Zebra:6.4.2/", "protocol": 170_150,
                                    "start_height": 1, "source": "pex"})
        self.assertEqual(len(census.peers), 3)
        self.assertEqual(census.counts()["zebra"], 2)

    def test_document_shape(self):
        doc = crawler.to_census_document(self._census())
        self.assertEqual(doc["total"], 3)
        self.assertEqual(doc["port"], 8233)
        self.assertIn("generated_at", doc)
        self.assertEqual(len(doc["peers"]), 3)


class TestPublishGuard(unittest.TestCase):
    """A census that reached almost nothing is our failure, not the network's.
    Publishing 'the network shrank to 2 nodes' would be a false claim."""

    def _doc(self, answered, zebra=1, other=0):
        return {
            "peers_answered": answered,
            "counts": {"zebra": zebra, "zcashd": 0, "other": other, "unknown": 0},
        }

    def test_below_minimum_is_refused(self):
        with self.assertRaises(SystemExit):
            crawler.guard_result(self._doc(answered=3), minimum=10)

    def test_all_unknown_is_refused(self):
        with self.assertRaises(SystemExit):
            crawler.guard_result(self._doc(answered=50, zebra=0, other=0), minimum=10)

    def test_a_healthy_census_passes(self):
        crawler.guard_result(self._doc(answered=50, zebra=40, other=10), minimum=10)


class TestHistoryAppend(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.path = os.path.join(self.tmp, "nodecount.json")

    def test_missing_file_reads_as_empty(self):
        self.assertEqual(crawler.load_history(self.path), [])

    def test_append_keeps_existing_rows_and_order(self):
        crawler.append_row(self.path, {"Date": "07/04/2026", "nodecount": "102"})
        rows = crawler.append_row(self.path, {"Date": "10/18/2026", "nodecount": "141",
                                              "zebra": "130", "zcashd": "0", "other": "11"})
        self.assertEqual([r["Date"] for r in rows], ["07/04/2026", "10/18/2026"])
        self.assertEqual(rows[-1]["nodecount"], "141")

    def test_same_date_twice_replaces_instead_of_duplicating(self):
        crawler.append_row(self.path, {"Date": "10/18/2026", "nodecount": "141"})
        rows = crawler.append_row(self.path, {"Date": "10/18/2026", "nodecount": "150"})
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["nodecount"], "150")

    def test_existing_legacy_rows_keep_only_their_two_keys(self):
        # Rows written before this crawler carry Date + nodecount and nothing
        # else; the append must not require the new keys to be present.
        with open(self.path, "w", encoding="utf-8") as handle:
            json.dump([{"Date": "11/17/2024", "nodecount": "85"}], handle)
        rows = crawler.append_row(self.path, {"Date": "10/18/2026", "nodecount": "141"})
        self.assertEqual(rows[0], {"Date": "11/17/2024", "nodecount": "85"})
        self.assertIn("nodecount", rows[1])

    def test_a_non_array_file_fails_loudly(self):
        with open(self.path, "w", encoding="utf-8") as handle:
            handle.write('{"Date": "oops"}')
        with self.assertRaises(SystemExit):
            crawler.load_history(self.path)


class TestFraming(unittest.TestCase):
    def test_frame_carries_the_mainnet_magic_and_a_checksum(self):
        frame = crawler._frame("getaddr", b"")
        self.assertEqual(frame[:4], crawler.MAGIC_MAINNET)
        self.assertEqual(frame[4:16].rstrip(b"\x00"), b"getaddr")
        self.assertEqual(struct.unpack("<I", frame[16:20])[0], 0)

    def test_net_addr_is_twenty_six_bytes_with_a_big_endian_port(self):
        blob = crawler._net_addr("192.0.2.10", 8233, 1)
        self.assertEqual(len(blob), 26)
        self.assertEqual(struct.unpack(">H", blob[24:26])[0], 8233)
        self.assertEqual(blob[20:24], bytes([192, 0, 2, 10]))


class TestSeederFanOut(unittest.TestCase):
    """One resolver sees one sample of a seeder's address book. Querying a
    single resolver measured 34 addresses where the fan-out measured 155, so
    the default must not collapse to one resolver."""

    def test_the_default_resolver_set_is_a_fan_out_not_a_single_host(self):
        self.assertGreater(len(crawler.PUBLIC_RESOLVERS), 1)
        self.assertEqual(len(set(crawler.PUBLIC_RESOLVERS)), len(crawler.PUBLIC_RESOLVERS))

    def test_resolution_unions_every_resolver_answer(self):
        answers = {
            ("dnsseed.z.cash", "1.1.1.1"): {"192.0.2.1", "192.0.2.2"},
            ("dnsseed.z.cash", "8.8.8.8"): {"192.0.2.3"},
            ("dnsseed.z.cash", "9.9.9.9"): set(),
        }

        def fake_dig(seeder, resolver, timeout):
            return answers.get((seeder, resolver), set())

        original = crawler._dig
        crawler._dig = fake_dig
        try:
            got = crawler.resolve_seeders(
                seeders=["dnsseed.z.cash"],
                resolvers=["1.1.1.1", "8.8.8.8", "9.9.9.9"],
                rounds=1,
            )
        finally:
            crawler._dig = original
        self.assertEqual(got, ["192.0.2.1", "192.0.2.2", "192.0.2.3"])

    def test_falls_back_to_the_system_resolver_when_dig_returns_nothing(self):
        """A container without dig must still produce candidates rather than
        silently census zero peers."""
        original_dig = crawler._dig
        original_gai = crawler.socket.getaddrinfo
        crawler._dig = lambda seeder, resolver, timeout: set()
        crawler.socket.getaddrinfo = lambda host, port, family=0: [
            (2, 1, 6, "", ("192.0.2.77", 0))
        ]
        try:
            got = crawler.resolve_seeders(
                seeders=["dnsseed.z.cash"], resolvers=["1.1.1.1"], rounds=1
            )
        finally:
            crawler._dig = original_dig
            crawler.socket.getaddrinfo = original_gai
        self.assertEqual(got, ["192.0.2.77"])

    def test_candidates_are_deduplicated_across_resolvers(self):
        original = crawler._dig
        crawler._dig = lambda seeder, resolver, timeout: {"192.0.2.9"}
        try:
            got = crawler.resolve_seeders(
                seeders=["a.example", "b.example"],
                resolvers=["1.1.1.1", "8.8.8.8"],
                rounds=1,
            )
        finally:
            crawler._dig = original
        self.assertEqual(got, ["192.0.2.9"])


if __name__ == "__main__":
    unittest.main(verbosity=2)