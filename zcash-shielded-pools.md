---
title: "Zcash Shielded Pools"
date: 2026-09-22
draft: false
categories: ["Zcash Tech"]
tags: ["zcash", "shielded-pools", "privacy", "zechub"]
---

# Zcash Shielded Pools

Shielded pools are cryptographic ledger compartments within Zcash that use zero-knowledge proofs (zk-SNARKs) to encrypt transaction amounts, sender addresses, and recipient addresses while ensuring consensus validity.

## Evolution of Shielded Pools

Zcash has upgraded its privacy technology across several protocol generations:
* **Sprout:** The initial shielded implementation utilizing zk-SNARKs, which required a trusted setup ceremony and featured high computational overhead for proving.
* **Sapling:** Introduced in 2018, Sapling drastically reduced memory and CPU requirements for generating shielded transactions, making mobile wallet support practical.
* **Orchard:** The modern shielding pool utilizing Halo 2 zero-knowledge proof technology, eliminating the need for a trusted setup ceremony and supporting advanced programmability.

## Key Benefits

1. **Financial Privacy:** Transactions remain completely confidential by default, shielding user balances and payment histories from public analysis.
2. **Fungibility:** Because shielded coins cannot be tainted by historical tracking, all units hold equal value and acceptance across the network.
