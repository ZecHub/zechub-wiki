import asyncio
import json
from pathlib import Path
import struct
import tempfile
import unittest
from unittest.mock import AsyncMock, patch

import crawler as c


def address(ip=b'\x08\x08\x08\x08', port=8233):
    return bytes(12) + b'\0' * 10 + b'\xff\xff' + ip + struct.pack('>H', port)


def report():
    return dict(complete=True, seeds={'seed': 1}, finished_at='2026-10-14T12:00:00+00:00',
                attempted=4, nodes=[dict(implementation='zebra', user_agent='/Zebra:6.0.0/')])


class ProtocolTests(unittest.TestCase):
    def test_classification(self):
        for agent, expected in [('/Zebra:6.0.0/', ('zebra', '6.0.0')),
                                ('/MagicBean:6.11.0/', ('zcashd', '6.11.0')),
                                ('/zcashd:6.0/', ('zcashd', '6.0')),
                                ('/NotZebra:1/', ('other', None))]:
            self.assertEqual(c.classify(agent), expected)

    def test_private_and_special_addresses(self):
        for ip in ['127.0.0.1', '10.0.0.1', '169.254.169.254', '::1', 'fc00::1',
                   '::ffff:127.0.0.1', '224.0.0.1', '2002:0808:0808::1']:
            self.assertIsNone(c.public_endpoint(ip, 8233), ip)
        self.assertEqual(c.public_endpoint('::ffff:8.8.8.8', 8233), ('8.8.8.8', 8233))
        self.assertIsNone(c.public_endpoint('8.8.8.8', 0))

    def test_addr_filter_and_bounds(self):
        self.assertEqual(c.parse_addresses(b'\x02' + address() + address(b'\x7f\0\0\x01')),
                         [('8.8.8.8', 8233)])
        for raw in [b'\xfd\xe9\x03', b'\xfd\x01\x00', b'\x01' + address()[:-1], b'\0extra']:
            with self.assertRaises(ValueError):
                c.parse_addresses(raw)

    def test_addrv2(self):
        entry = bytes(4) + b'\x01\x01\x04' + b'\x08\x08\x08\x08' + struct.pack('>H', 8233)
        self.assertEqual(c.parse_addresses(b'\x01' + entry, True), [('8.8.8.8', 8233)])
        with self.assertRaises(ValueError):
            c.parse_addresses(b'\x01' + bytes(4) + b'\x01\x01\x01\x08\x20\x29', True)

    def test_version_validation(self):
        payload = c.version_payload(('8.8.8.8', 8233), 123)
        self.assertEqual(c.parse_version(payload, 456)['protocol_version'], c.PROTOCOL)
        for bad in [payload[:-3], payload + b'extra', payload[:-1] + b'\x02']:
            with self.assertRaises(ValueError):
                c.parse_version(bad, 456)
        with self.assertRaises(ValueError):
            c.parse_version(payload, 123)

    def test_daily_write_idempotence_and_preservation(self):
        row = c.daily_row(report())
        self.assertEqual(sum(row[k] for k in ('zebra', 'zcashd', 'other')), int(row['nodecount']))
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'history.json'
            old = [{'Date': '07/04/2026', 'nodecount': '102'}]
            path.write_text(json.dumps(old))
            self.assertTrue(c.append_daily(path, row))
            original = path.read_bytes()
            self.assertFalse(c.append_daily(path, row))
            self.assertEqual(path.read_bytes(), original)
            self.assertEqual(json.loads(original)[:-1], old)
            path.write_text('invalid')
            with self.assertRaises(ValueError):
                c.append_daily(path, row)
            self.assertEqual(path.read_text(), 'invalid')

    def test_no_empty_or_partial_publication(self):
        for changes in [{'complete': False}, {'nodes': []}, {'seeds': {'seed': 0}}]:
            with self.assertRaises(ValueError):
                c.daily_row(dict(report(), **changes))


class NetworkTests(unittest.IsolatedAsyncioTestCase):
    async def test_bad_frames(self):
        for frame in [b'NOPE' + c.message('verack')[4:], c.message('verack')[:20] + b'fail',
                      c.MAGIC + b'version'.ljust(12, b'\0') + struct.pack('<I', c.MAX_PAYLOAD + 1) + bytes(4)]:
            reader = asyncio.StreamReader()
            reader.feed_data(frame)
            reader.feed_eof()
            with self.assertRaises(ValueError):
                await c.read_message(reader)

    async def test_handshake_ping_and_peer_exchange(self):
        observed = []
        async def peer(reader, writer):
            try:
                observed.append((await c.read_message(reader))[0])
                version = c.version_payload(('8.8.8.8', 8233), 1)
                writer.write(c.message('version', version) + c.message('verack'))
                await writer.drain()
                observed.append((await c.read_message(reader))[0])
                observed.append((await c.read_message(reader))[0])
                writer.write(c.message('ping', b'12345678'))
                await writer.drain()
                self.assertEqual(await c.read_message(reader), (b'pong', b'12345678'))
                writer.write(c.message('addr', b'\x01' + address()))
                await writer.drain()
            finally:
                writer.close()
                await writer.wait_closed()
        server = await asyncio.start_server(peer, '127.0.0.1', 0)
        async with server:
            result, peers = await c.probe(('127.0.0.1', server.sockets[0].getsockname()[1]), 1)
        self.assertIsNotNone(result)
        self.assertEqual(peers, [('8.8.8.8', 8233)])
        self.assertEqual(observed, [b'version', b'verack', b'getaddr'])

    async def test_unresponsive_peer_is_bounded(self):
        async def peer(reader, writer):
            await reader.read()
            writer.close()
            await writer.wait_closed()
        server = await asyncio.start_server(peer, '127.0.0.1', 0)
        async with server:
            self.assertEqual(await c.probe(('127.0.0.1', server.sockets[0].getsockname()[1]), .05), (None, []))

    async def test_discovery_deduplicates_and_follows_exchange(self):
        a, b = ('8.8.8.8', 8233), ('1.1.1.1', 8233)
        async def probe(endpoint, timeout):
            return dict(host=endpoint[0], port=endpoint[1]), [a, b]
        with patch.object(c, 'resolve_seed', AsyncMock(return_value=('seed', [a, a]))), \
             patch.object(c, 'probe', side_effect=probe) as mock:
            result = await c.crawl(seeds=['seed'])
            self.assertEqual(result['attempted'], 2)
            self.assertEqual(mock.call_count, 2)
            self.assertTrue(result['complete'])
            limited = await c.crawl(seeds=['seed'], max_nodes=1)
            self.assertFalse(limited['complete'])
            self.assertTrue(limited['limit_reached'])

    async def test_run_timeout_is_incomplete(self):
        async def slow(*args):
            await asyncio.sleep(1)
        with patch.object(c, 'resolve_seed', AsyncMock(return_value=('seed', [('8.8.8.8', 8233)]))), \
             patch.object(c, 'probe', side_effect=slow):
            result = await c.crawl(seeds=['seed'], duration=.01)
            self.assertFalse(result['complete'])
            self.assertTrue(result['timed_out'])


if __name__ == '__main__':
    unittest.main()
