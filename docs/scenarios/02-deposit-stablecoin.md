# Scenario 02: Deposit Stablecoin

The product displays a sandbox deposit address from `mock/en3/wallets.json`. A seeded mock
deposit event in `mock/en3/transactions.json` credits the wallet balance.

Demo path:

1. Show deposit address `0x2222222222222222222222222222222222222222`.
2. Open the transaction timeline for `txn_deposit_001`.
3. Confirm the lifecycle states: deposit detected, credited, settled.
4. Review audit events `deposit.detected` and `wallet.balance_credited`.
5. Review webhook `deposit.settled`.

Boundary:

- The deposit is not detected from a real chain.
- The address is mock data and must not be used for funds.
