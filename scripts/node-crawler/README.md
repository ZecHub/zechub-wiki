# Open Zcash node crawler

This dependency-free Python 3.11+ crawler discovers mainnet TCP peers from DNS
seeds, exchanges `version`/`verack`, then asks each peer for addresses with
`getaddr`. It follows public IPv4/IPv6 addresses, deduplicating normalized IP +
port pairs. It never downloads blocks, relays transactions, or listens publicly.

## Run locally

From the repository root, on a host with working DNS and outbound peer TCP access:

```sh
python3 scripts/node-crawler/crawler.py --dry-run --report /tmp/zcash-node-report.json
python3 scripts/node-crawler/crawler.py
python3 -m unittest discover -s scripts/node-crawler -v
```

The first command leaves dashboard data untouched and writes a local per-peer
report: IP, port, full user agent, parsed implementation/version, protocol version,
services, and advertised height. The second appends today's observation to
`public/data/zcash/nodecount.json`. No node, wallet, API key, or Python package
installation is needed. Do not commit per-peer reports; the dashboard publishes
aggregate counts and user-agent frequencies only. Raw reports can be kept locally
for auditing/debugging.

Defaults: 16 concurrent connections, 8 seconds each for handshake and address
collection, at most 10,000 discovered endpoints, and a 15-minute crawl budget.
Use `--concurrency`, `--timeout`, `--max-nodes`, and `--duration` to tune these.
Each endpoint is attempted once per run; each connection sends `getaddr` once.
Peer message sizes, message counts, CompactSize encoding, checksums, network
magic, and address counts are validated. Private, loopback, multicast, reserved,
and IPv6 transition addresses are excluded before connecting. DNS failures are
isolated by seed; IPv6 failures do not stop IPv4 discovery.

An empty, unseeded, or limit-truncated run exits nonzero without modifying history.
A completed handshake counts even when a peer does not answer `getaddr`. If the
budget is exhausted, inspect the report and rerun with larger limits. A run with
some unreachable peers is normal; `complete` means the discovered queue was
processed within configured limits, not that all network nodes were discovered.

## Data contract and interpretation

Existing `Date` (`MM/DD/YYYY`) and string `nodecount` fields are preserved. New
observations add numeric `zebra`, `zcashd`, and `other` counts, whose sum equals
`nodecount`, plus UTC `observed_at`, `attempted`, `source`, and `user_agents`
frequency metadata. `/Zebra:.../` is Zebra, `/MagicBean:.../` and `/zcashd:.../`
are zcashd; unrecognized agents are Other. The local report preserves each peer's
full agent and parsed version (null for unrecognized software).

This is a count of reachable **endpoints**, not unique machines or a complete
network census. One machine can expose several endpoints. NAT, firewalls, offline
peers, Tor/I2P-only nodes, crawler location, DNS answers, and address gossip affect
the result. User agents are self-reported and unauthenticated. Low but nonzero
counts can reflect impaired connectivity: review logs before interpreting sudden
changes. Old rows came from a different, undocumented collector; comparisons
across the collection-method change require care.

History is never backfilled or overwritten. The first successful observation on
a UTC date wins; repeat runs that day are no-ops. Writes use atomic replacement.
Do not run multiple local writers against the same file simultaneously. Historical
rows without a breakdown remain null in the chart, not zero. The dashboard shows
an explicit warning when its latest observation is more than three days old.

## Daily GitHub Action

`.github/workflows/node-census.yml` tests the crawler on relevant pull requests.
On the upstream main branch it runs daily at 03:23 UTC (08:53 IST), or manually
via **Actions → Zcash node census → Run workflow**. Only the scheduled/manual
census job receives `contents: write`; PR jobs cannot run the live crawler or
commit data. Scheduled execution is disabled in forks by the job condition.
Concurrency prevents overlapping runs. The job commits only `nodecount.json`,
rebases on current main, and fails visibly on a conflict or rejected push.

The repository must permit the workflow token to commit to main. If branch
protection prohibits this, maintainers should switch publication to their approved
data-update PR process; the workflow does not bypass protections. Check Actions
logs after merging and run one manual census before relying on the schedule.
GitHub can delay cron runs. Commits made with `GITHUB_TOKEN` do not trigger other
GitHub workflows; maintainers should verify how their hosting deployment consumes
these updates and use their existing deployment mechanism if needed.

## Protocol references and maintenance

- [ZIP 204](https://zips.z.cash/zip-0204): framing, handshake, DNS bootstrap,
  address exchange, network parameters.
- [Zebra network configuration](https://github.com/ZcashFoundation/zebra/blob/main/zebra-network/src/config.rs): seed sources.
- [Zebra releases](https://github.com/ZcashFoundation/zebra/releases): protocol upgrades.

The advertised protocol is 170160 (NU6.3), mainnet magic is `24e92764`, and seed
addresses use port 8233. Update `PROTOCOL` when future upgrades require it. The
crawler advertises zero services and disables transaction relay. It supports
legacy `addr` and can decode public IPv4/IPv6 `addrv2` entries, but does not send
Bitcoin's `sendaddrv2` message (Zcash uses its own negotiation). Unsupported
address networks are skipped. The code uses this repository's license.
