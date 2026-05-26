# Scenario 05: Reconcile Payment

After settlement, the mock reconciliation report links the core-banking account, sandbox
wallet, transaction, and audit events.

Demo path:

1. Open the reconciliation panel in the web demo.
2. Confirm `recon_001` has a matched item for `account_001`, `wallet_001`, and
   `txn_send_001`.
3. Submit and approve another mock payment.
4. Confirm a new matched reconciliation item is added in memory.
5. Review webhook `reconciliation.updated`.

Boundary:

- Reconciliation is local reference logic.
- No production ledger, treasury, settlement network, or accounting system is included.
