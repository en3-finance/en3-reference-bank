# Scenario 03: Send Payment With Policy

The customer submits a mock outgoing stablecoin payment. The shared lifecycle logic
simulates the transaction before any approval, mock signing, or mock settlement.

Demo path:

1. Keep the default amount `11000.00 USDC`.
2. Keep the default risky mock destination ending in repeated `9` values.
3. Submit the payment.
4. Confirm the transaction enters `approval_required`.
5. Confirm policy reasons include `amount_above_sandbox_threshold` and
   `mock_address_risk_high`.

Boundary:

- Policy and risk are mock reference decisions.
- No sanctions, KYT, address-risk vendor, RPC, signing, or broadcast integration is called.
