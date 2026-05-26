# SandBank En3 Demo

Status: public mock / sandbox artifact. SandBank is a synthetic end-to-end demo showing how a bank or fintech could use En3-style sandbox APIs to launch a stablecoin wallet product.

Public boundary: this repository does not contain private platform code, production custody, real keys, real RPC URLs, private internals, real customer data, partner context, fundraising or M&A context, ADI/grant context, or strategic acquirer claims. All customers, accounts, wallets, addresses, transactions, audit events, webhook events, and reconciliation records are synthetic.

## What This Repo Demonstrates

1. A synthetic SandBank customer exists in mock core banking.
2. A sandbox wallet is created or displayed for the customer.
3. A sandbox deposit address is issued.
4. A stablecoin deposit is detected in mock form.
5. The wallet balance is updated in mock state.
6. An outgoing payment is submitted.
7. The transaction is simulated.
8. Policy requires approval for a high amount or risky mock destination.
9. Admin approval is recorded.
10. The transaction moves through mock signing and mock broadcast states.
11. The transaction settles in the mock lifecycle.
12. Reconciliation links the core account, wallet, transaction, and audit events.
13. Audit events record the lifecycle.
14. Webhook events show outbound notifications.

## One-Command Demo

```bash
pnpm install
pnpm sandbank:demo
```

The CLI prints the SandBank customer, wallet status, deposit address, transaction simulation, approval requirement, approval action, settlement, reconciliation report, audit timeline, and webhook timeline.

## Web App

```bash
pnpm dev
```

Open `http://localhost:5173`.

Local services:

- Customer web demo: `http://localhost:5173`
- Mock core banking API: `http://localhost:4100`
- Mock En3 sandbox API: `http://localhost:4101`

Useful checks:

```bash
curl http://localhost:4100/customers
curl http://localhost:4101/demo/state
curl http://localhost:4101/reconciliation/report
```

## Live Sandbox Mode

Set `EN3_API_BASE_URL` to point the CLI or web proxy at a live sandbox-compatible API:

```bash
EN3_API_BASE_URL=https://sandbox.example.invalid pnpm sandbank:demo
EN3_API_BASE_URL=https://sandbox.example.invalid pnpm dev
```

The live path uses HTTP JSON only and imports no private platform code.

## Validation

```bash
pnpm test
pnpm build
pnpm validate:forbidden
pnpm validate:secrets
```

Deprecated internal event names are excluded from runtime public artifacts.

## Documentation

- [SandBank demo script](docs/sandbank-demo-script.md)
- [SandBank architecture](docs/sandbank-architecture.md)
- [Local runbook](docs/local-runbook.md)
- [Live sandbox mode](docs/live-sandbox-mode.md)
- [Spec Kit plan](specs/001-sandbank-demo/plan.md)

## Project Layout

```text
apps/customer-web      Vite React demo UI
apps/mock-bank-core    Local mock core-banking API
apps/mock-en3-api      Local mock En3 sandbox API
packages/shared        Scenario state machine, statuses/events, types, and tests
mock/sandbank          Public synthetic SandBank scenario
mock/                  Supporting public mock seed data
scripts/               SandBank demo runners
docs/                  Architecture and runbooks
specs/                 Spec Kit artifacts
```

## Related Public En3 Repositories

- [en3-api-spec](https://github.com/en3-finance/en3-api-spec)
- [en3-wallet-sdk](https://github.com/en3-finance/en3-wallet-sdk)

## Boundaries

This repository intentionally excludes production cryptography, MPC/TSS, signing orchestration, policy enforcement, risk logic, ledger infrastructure, treasury execution, customer deployments, private endpoints, real RPC URLs, vendor integrations, and compliance certifications. Any production deployment options described by En3 are outside this public demo unless explicitly implemented in this repository.
