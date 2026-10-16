# Zcash mainnet node census

Discovers peers from the Zcash DNS seeders and the peer-exchange address
books, handshakes with each one, and records which implementation is behind
it (Zebra, zcashd, or other).

The result feeds `public/data/zcash/nodecount.json` and the Node Count chart.

## What the number means — and what it does not

**The count is reachable public endpoints from wherever the crawler ran.**
It is not the size of the Zcash network, and the two must not be read as the
same thing.

A node that is behind NAT, behind a firewall, configured with `-listen=0`, or
only reachable over IPv6 does not answer and is not counted. Neither does a
node that refuses the connection because the crawler's IP is on an abuse list.

This is not a theoretical caveat. Measured on 16 Oct 2026 from a datacenter
host, the same crawler against a 155-address candidate pool reached **10**
peers. Historical rows in `nodecount.json` sit between 50 and 394. That gap is
a difference in vantage point, not a collapse of the network — a residential
or cloud-runner egress reaches far more peers than one datacenter IP does.

So: treat a sudden change in the series as a question about the crawler's
network position first, and a question about the Zcash network second.

## Requirements

- Python 3.8+ — stdlib only, no `pip install`
- `dig` on `PATH` (part of `dnsutils` / `bind-utils`)

## Run it

```bash
# Full census, human-readable output on stdout
python3 scripts/node-crawler/crawler.py

# Write the census document, and append a dated row to the chart data
python3 scripts/node-crawler/crawler.py \
  --out /tmp/census.json \
  --append public/data/zcash/nodecount.json \
  --date 10/18/2026
```

Useful flags:

| Flag | Default | Purpose |
|------|---------|---------|
| `--max-peers` | 400 | Cap on addresses probed per stage |
| `--workers` | 24 | Concurrent handshakes |
| `--timeout` | 8.0 | Per-peer socket timeout, seconds |
| `--minimum` | 10 | Refuse to publish below this many answering peers |
| `--no-pex` | off | Skip the peer-exchange stage |
| `--resolvers` | public set | DNS resolvers to fan the seeders out over |
| `-v` | off | Debug logging, per-peer failure reasons |

## How it finds peers

1. **DNS seeders.** Each seeder returns a *sample* of its address book, and
   the sample is keyed to the resolver that asked. One resolver against one
   seeder returned 34 addresses on 16 Oct 2026; the same seeders queried
   across 18 public resolvers returned 155. The crawler fans out by default
   for that reason — querying one resolver caps the census for no reason.
2. **Peer exchange.** Peers that complete a handshake are asked for their
   address book (`getaddr`), which reaches addresses the seeders do not
   return.
3. **Handshake.** Each candidate gets a `version` message and must reply with
   its own `version`, which carries the user agent the classification reads.

## Implementation buckets

| User agent prefix | Bucket |
|---|---|
| `/Zebra:` | `zebra` |
| `/MagicBean:`, `/Satoshi:` | `zcashd` |
| anything else (`/Zakura:`, …) | `other` |

`other` is not noise. Zakura is a real mainnet implementation and folding it
into either of the other two would misreport the network. A user agent that
does not parse is `unknown`, which keeps it out of all three buckets rather
than guessing.

## Refusing to publish a bad census

A census that reached almost nothing is a failure of the crawler's own
network position, not a change in the network. Publishing it would put a false
cliff in the chart, so the crawler refuses and exits non-zero when either:

- fewer than `--minimum` peers answered (default 10), or
- every answering peer classified as `unknown`.

The scheduled workflow surfaces that as a failed run instead of a silent bad
row.

## Data format

`nodecount.json` is an array of dated rows. Rows written before this crawler
carry only `Date` and `nodecount`; the crawler adds the per-implementation
breakdown and preserves the older rows untouched.

```json
{
  "Date": "10/18/2026",
  "nodecount": "141",
  "zebra": "130",
  "zcashd": "0",
  "other": "11"
}
```

Re-running for a date that is already present replaces that row instead of
appending a duplicate, so a retry is idempotent.

`--out` writes a fuller document — every peer with its user agent, protocol
version and start height, plus the probe counts — for inspection.

## Tests

```bash
python3 -m unittest discover -s scripts/node-crawler -p 'test_*.py' -v
```

No install step: the crawler is stdlib-only by design so that a fresh clone,
a container, and the CI runner all execute the same code path.