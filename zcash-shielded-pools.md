# Zcash Shielded Pools

Zcash achieves robust financial privacy by utilizing cryptographic shielded pools that break the public link between senders, receivers, and transaction amounts.

## Evolution of Shielded Pools
* **Sapling:** Introduced high-performance zk-SNARKs, making mobile shielded transactions practical and efficient.
* **Orchard:** The latest pool utilizing Halo 2 zero-knowledge proofs, which removes the requirement for a trusted setup and improves scalability.

## How Privacy is Maintained
Transactions entering a shielded pool use cryptographic commitments and nullifiers. This allows the network to verify that a transaction is valid without revealing any details about who is transacting or how much is being sent.
