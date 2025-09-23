# Zcash Shielded Metrics


## Basic Shielded Snapshots

```markdown
toCurl.sh                     - cURL bash wrapper that connects to a running zebra RPC server
tx_type.sh                    - heart of metrics, extracts relevant data from a zebra node using RPC's
getDailySnapshot.sh           - input number of blocks, creates an interval of blocks from the tip, finds all txids in that interval and extracts data using tx_type.sh
extractShieldedInfoII.sh      - finds current data/time, finds snapshot of shielded metrics for 1152 blocks ( ~ day worth ), and counts/exports shielded data into a .md file
```


## Shielded Currents

```markdown
toCurl.sh                     - cURL bash wrapper that connects to a running zebra RPC server
tx_type.sh                    - heart of metrics, extracts relevant data from a zebra node using RPC's
findTXsByTypeII.sh            - find txid's filtered by searchType input: < Transparent / Sapling / Orchard >
getTXfeeII.sh                 - get and display the fee of a given txid
txDetails.sh                  - zebrad getrawtransaction rpc wrapper
listTXs.sh                    - given an interval of blocks, outputs all txids
getBlockCount.sh              - gets the current height of the zcash blockchain
extractTransferTXs.sh         - gets "transfer tx's" for transparent, shieldedOutputs for sapling, and actions for orchard pools
getDateFromBlock.sh           - outputs date given a block
extractSupplyInfo.sh          - Extract shielded supply from zebrad
transparentCurrent.sh         - given an interval of blocks, export txid's that involve the transparent pool
saplingCurrent.sh             - given an interval of blocks, export txid's that involve the sapling pool
saplingCurrentIn.sh           - given an interval of blocks, export txid's that involve moving into the sapling pool
saplingCurrentOut.sh          - given an interval of blocks, export txid's that involve moving out of the sapling pool
orchardCurrent.sh             - given an interval of blocks, export txid's that involve the orchard pool
orchardCurrentIn.sh           - given an interval of blocks, export txid's that involve moving into the orchard pool
orchardCurrentOut.sh          - given an interval of blocks, export txid's that involve moving out of the orchard pool
```

