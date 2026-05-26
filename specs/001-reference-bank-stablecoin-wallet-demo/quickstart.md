# Quickstart: Reference Bank Stablecoin Wallet Demo

## Prerequisites

- Node.js 20+
- pnpm 9+

## Run Locally

```bash
pnpm install
pnpm dev
```

Open the customer web app at `http://localhost:5173`.

Local services:

- Mock core banking API: `http://localhost:4100`
- Mock En3 sandbox API: `http://localhost:4101`

## Verify the Scenario

```bash
curl http://localhost:4100/customers
curl http://localhost:4101/demo/state
curl http://localhost:4101/reconciliation/report
```

To reset the in-memory demo state:

```bash
curl -X POST http://localhost:4101/demo/reset
```

## Demo Path

1. Select the reference customer.
2. Review the active sandbox wallet and mock deposit address.
3. Inspect the mock USDC deposit lifecycle.
4. Submit a high-amount outgoing payment or replay the seeded payment.
5. Review the simulated policy result and approval requirement.
6. Approve the transaction as a mock operations admin.
7. Inspect mock signing, mock broadcast, settlement, reconciliation, audit events, and
   webhook events.

No real funds, custody, customer data, vendor integrations, or production infrastructure
are used.
