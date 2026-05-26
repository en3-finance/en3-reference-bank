# Scenario 04: Approve High-Risk Transaction

An operations admin approves a transaction that is blocked by the mock sandbox policy.

Demo path:

1. Submit a payment that enters `requires_approval`.
2. Click `Approve mock transaction`.
3. Confirm the lifecycle advances through `approved`, `signing`, `signed`, `broadcast`, and
   `settled`.
4. Confirm the wallet balance is reduced by the payment amount.
5. Review audit events for approval, signing, broadcast, settlement, and
   reconciliation update.

Boundary:

- Approval is a mock control-plane event.
- Mock signing and mock broadcast do not perform custody actions or network calls.
