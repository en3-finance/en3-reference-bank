# SandBank Demo Script

Use this for a 5-minute public walkthrough.

1. Run `pnpm sandbank:demo` and read the public boundary statement.
2. Show the synthetic SandBank customer: `Maya SandBank`.
3. Show the wallet status, USDC balance, network, and deposit address.
4. Walk through the deposit timeline: submitted, simulated, settled.
5. Show the outgoing payment simulation and explain that no real network call occurs.
6. Show the approval requirement caused by the high amount and mock risky destination.
7. Show the approval action by `sandbank_ops`.
8. Show mock signing, mock broadcast, settlement, and the mock transaction hash.
9. Show the reconciliation report linking account, wallet, transaction, and audit references.
10. Show the audit timeline and webhook timeline.

Boundary line to say explicitly: SandBank is synthetic public demo data. It contains no production custody, real keys, real RPC, private platform code, partner context, or real customer data.
