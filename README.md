# En3 Reference Bank

Status: public reference / sandbox artifact. This repository is intended to document and demonstrate the En3 integration surface. Production cryptography, signing orchestration, policy enforcement, risk logic, ledger infrastructure, treasury execution, and customer deployments are private by design.

## What This Repo Is

`en3-reference-bank` is an end-to-end reference implementation of a bank-grade stablecoin wallet product using En3 sandbox APIs and mock core banking.

## Who It Is For

This repo is for bank product teams, fintech engineers, payment operations teams, and diligence reviewers who need a concrete public flow without production custody or ledger code.

## What It Demonstrates

1. A bank customer exists in mock core banking.
2. An En3 wallet is created.
3. A deposit address is issued.
4. A stablecoin deposit is detected.
5. User balance is credited in mock data.
6. An outgoing payment is submitted.
7. The transaction is simulated and risk checked.
8. Approval is required.
9. An admin approves.
10. The transaction settles.
11. A reconciliation report is updated.
12. An audit trail records the lifecycle.

## Run The Demo

```bash
npm start
```

The demo is dependency-free. It reads local mock data and prints the canonical lifecycle summary: customer -> wallet -> deposit address -> outgoing payment -> simulation -> approval -> settlement -> reconciliation -> audit trail.

## Intentionally Out Of Scope

No production custody, signing, policy enforcement, ledger logic, risk logic, treasury execution, customer deployment, compliance vendor integration, private endpoint, or production infrastructure is included.

## Docs

- [Architecture](docs/architecture.md)
- [Demo script](docs/demo-script.md)
- [Scenario 01: create user wallet](docs/scenarios/01-create-user-wallet.md)
- [Scenario 02: deposit stablecoin](docs/scenarios/02-deposit-stablecoin.md)
- [Scenario 03: send payment with policy](docs/scenarios/03-send-payment-with-policy.md)
- Scenario 04: approval review.
- [Scenario 05: reconcile payment](docs/scenarios/05-reconcile-payment.md)

## Related En3 Repositories

- `en3-docs`
- `en3-api-spec`
- `en3-wallet-sdk`
- `en3-admin-console`
- `en3-web-wallet`
- `en3-mobile-wallet`
- `en3-chain-integrations`
