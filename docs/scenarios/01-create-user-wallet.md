# Scenario 01: Create User Wallet

The bank already has a mock customer in `mock/core-banking/users.json` and a mock account
in `mock/core-banking/accounts.json`.

Demo path:

1. The web demo loads customers from the mock core banking API.
2. The selected customer is `user_001`.
3. The mock En3 API returns the active sandbox wallet `wallet_001`.
4. If a customer has no wallet, `POST /wallets` creates a sandbox wallet in memory and
   records a mock audit and webhook event.

Boundary:

- The wallet is a reference record only.
- No real custody, key management, or signing infrastructure is included.
