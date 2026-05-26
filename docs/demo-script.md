# Demo Script

Target duration: 5 minutes.

1. Start the demo with `pnpm dev` and open `http://localhost:5173`.
2. Select `Maya Reference` in the customer list.
3. Show the active sandbox wallet, `USDC` balance, and mock deposit address.
4. Point out the deposit timeline: detected, credited, settled.
5. Submit the default outgoing payment of `11000.00 USDC` to the risky mock destination.
6. Show the policy state: approval required because the amount is above the sandbox
   threshold and the destination has mock address risk.
7. Click `Approve mock transaction`.
8. Show the lifecycle states: approved, mock signed, mock broadcast, settled.
9. Open reconciliation and show the matched core account, wallet, transaction, amount, and
   audit references.
10. Review the audit trail and webhook events.
11. Click reset to return to the seeded mock scenario.

Talk track:

- This is bank-grade Wallet-as-a-Service in reference form: core customer, wallet
  orchestration, policy controls, approvals, audit, webhooks, and reconciliation.
- Every value is mock. There are no real funds, no real custody, no production signing, no
  live compliance vendor, and no real bank customer data.
- Private production systems such as signer orchestration, ledger, treasury execution, and
  customer deployment patterns are intentionally outside this public repository.
