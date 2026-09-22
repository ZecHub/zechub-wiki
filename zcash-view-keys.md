---
title: "Zcash View Keys"
date: 2026-09-22
draft: false
categories: ["Zcash Tech"]
tags: ["zcash", "view-keys", "privacy", "zechub"]
---

# Zcash View Keys

View keys in Zcash allow users to share transaction visibility with third parties—such as auditors, tax services, or trusted friends—without exposing their private spending keys or compromising their overall wallet security.

## Overview of Zcash Keys

Zcash uses a selective disclosure key model for shielded transactions (Sapling and Orchard pools):
* **Spending Key:** Grants full control over funds, allowing you to both view balances and spend or transfer Zcash.
* **Full Viewing Key:** Allows you to view all incoming and outgoing transactions and balances for the associated shielded address, but does not allow spending.
* **Incoming Viewing Key:** Limited strictly to viewing incoming transactions.

## Use Cases

1. **Auditing and Tax Compliance:** Share a viewing key with an accountant or tax software to track capital gains without handing over control of your assets.
2. **Crowdfunding and Transparency:** Allow donors or community members to verify funds received into a transparent or shielded initiative.

## Security Best Practices

* Never share your **Spending Key** when you only intend to grant viewing or auditing access.
* Keep your viewing keys secure, as they still reveal transaction amounts and memo fields to anyone who possesses them.
