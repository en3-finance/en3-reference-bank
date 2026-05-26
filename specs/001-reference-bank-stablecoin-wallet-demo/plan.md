# Implementation Plan: Reference Bank Stablecoin Wallet Demo

**Branch**: `001-reference-bank-stablecoin-wallet-demo` | **Date**: 2026-05-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-reference-bank-stablecoin-wallet-demo/spec.md`

## Summary

Build a lightweight TypeScript pnpm workspace that runs a complete public reference bank
stablecoin wallet demo locally. The implementation includes a Vite React customer-facing
demo, a mock core banking API, a mock En3 sandbox API, shared state-machine logic, public
mock JSON data, and documentation for a 5-minute walkthrough. All custody, signing,
policy, risk, ledger, treasury, compliance, and webhook behavior is clearly labeled as
mock/sandbox/reference.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20+

**Primary Dependencies**: pnpm workspaces, Vite, React, Fastify, @fastify/cors, Vitest,
tsx, concurrently

**Storage**: Local JSON mock files under `mock/`; services load and mutate in-memory state
for the running demo and expose a reset endpoint

**Testing**: Vitest unit/integration tests for shared scenario state machine and mock API
flow

**Target Platform**: Local developer/reviewer machine running a browser and Node.js

**Project Type**: Web app plus two local mock API services in a monorepo workspace

**Performance Goals**: Start locally in under 30 seconds after dependencies are installed;
render the primary demo state in under 2 seconds on a typical laptop

**Constraints**: One documented local run command; no real funds; no real custody; no real
customer data; no real RPC URLs; no fake vendor integrations; no production-readiness claims

**Scale/Scope**: One complete reference scenario with a small number of mock users,
wallets, transactions, audit events, webhook events, and reconciliation records

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Public Truthfulness: PASS. Plan labels all behavior as public mock/sandbox/reference and
  avoids production, customer, regulatory, or vendor claims.
- Mock Data and No Real Funds: PASS. Only local JSON mock data and in-memory service state
  are used.
- Local Demo Operability: PASS. pnpm workspace will expose `pnpm dev` as the one-command
  local demo after install.
- Simple, Testable Reference Code: PASS. Shared state machine plus lightweight APIs/UI keep
  the implementation small and testable.
- Security Boundary and Private Systems: PASS. Signing, broadcast, policy, risk, ledger,
  treasury, reconciliation, and webhooks are modeled as mock/reference behavior only.

## Project Structure

### Documentation (this feature)

```text
specs/001-reference-bank-stablecoin-wallet-demo/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── mock-core-openapi.yaml
│   └── mock-en3-openapi.yaml
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/
├── customer-web/
│   ├── index.html
│   ├── package.json
│   ├── src/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── styles.css
│   ├── tsconfig.json
│   └── vite.config.ts
├── mock-bank-core/
│   ├── package.json
│   ├── src/server.ts
│   └── tsconfig.json
└── mock-en3-api/
    ├── package.json
    ├── src/server.ts
    └── tsconfig.json

packages/
└── shared/
    ├── package.json
    ├── src/
    │   ├── demo-state.ts
    │   ├── index.ts
    │   └── types.ts
    ├── tests/
    │   └── demo-state.test.ts
    └── tsconfig.json

mock/
├── core-banking/
│   ├── accounts.json
│   └── users.json
├── en3/
│   ├── audit-events.json
│   ├── transactions.json
│   ├── wallets.json
│   └── webhooks.json
└── reconciliation/
    └── report.json

docs/
├── architecture.md
├── demo-script.md
└── scenarios/
    ├── 01-create-user-wallet.md
    ├── 02-deposit-stablecoin.md
    ├── 03-send-payment-with-policy.md
    ├── 04-approve-high-risk-transaction.md
    └── 05-reconcile-payment.md
```

**Structure Decision**: Use a lightweight pnpm workspace because the repo needs a browser
demo, two mock services, and shared scenario logic without introducing production
infrastructure or unused modules.

## Phase 0: Research

See [research.md](research.md). All technical unknowns are resolved with conservative
choices that fit the public demo constraints.

## Phase 1: Design and Contracts

See [data-model.md](data-model.md), [contracts/mock-core-openapi.yaml](contracts/mock-core-openapi.yaml),
[contracts/mock-en3-openapi.yaml](contracts/mock-en3-openapi.yaml), and [quickstart.md](quickstart.md).
Contracts describe mock/sandbox APIs only.

## Post-Design Constitution Check

- Public Truthfulness: PASS. UI, README, docs, mock APIs, and sample responses will label
  private-domain concepts as mock/reference.
- Mock Data and No Real Funds: PASS. No service calls external payment networks or
  production infrastructure.
- Local Demo Operability: PASS. `pnpm install` plus `pnpm dev` is the planned local run
  path.
- Simple, Testable Reference Code: PASS. The shared package owns lifecycle rules and tests.
- Security Boundary and Private Systems: PASS. No secrets, real RPC URLs, or private
  deployment configs are planned.

## Complexity Tracking

No constitution violations or exceptional complexity are required.
