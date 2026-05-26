# CODEX Report: Reference Bank Stablecoin Wallet Demo

## 1. Spec Kit Artifacts Created

- `.specify/memory/constitution.md`
- `specs/001-reference-bank-stablecoin-wallet-demo/spec.md`
- `specs/001-reference-bank-stablecoin-wallet-demo/checklists/requirements.md`
- `specs/001-reference-bank-stablecoin-wallet-demo/plan.md`
- `specs/001-reference-bank-stablecoin-wallet-demo/research.md`
- `specs/001-reference-bank-stablecoin-wallet-demo/data-model.md`
- `specs/001-reference-bank-stablecoin-wallet-demo/contracts/mock-core-openapi.yaml`
- `specs/001-reference-bank-stablecoin-wallet-demo/contracts/mock-en3-openapi.yaml`
- `specs/001-reference-bank-stablecoin-wallet-demo/quickstart.md`
- `specs/001-reference-bank-stablecoin-wallet-demo/tasks.md`

Spec Kit analysis found no critical or high issues. One low plan/contracts consistency issue
was corrected before implementation.

## 2. What Was Implemented

- Lightweight pnpm TypeScript workspace with:
  - `apps/customer-web`: Vite React reference demo UI
  - `apps/mock-bank-core`: Fastify mock core-banking API
  - `apps/mock-en3-api`: Fastify mock En3 sandbox API
  - `packages/shared`: lifecycle state machine, types, and Vitest tests
- Complete mock data for customers, accounts, wallets, transactions, audit events,
  webhook events, and reconciliation.
- Customer-facing demo UI with customer list, wallet status, deposit address, outgoing
  payment form, policy/risk state, transaction timeline, reconciliation, audit events, and
  webhook events.
- Mock API endpoints for customers, accounts, wallet creation, payment submission,
  approval, reset, audit events, webhooks, and reconciliation.
- README with one-command local run instructions, Mermaid architecture diagram, 5-minute
  demo script, mock/sandbox disclaimer, and related En3 repo links.
- Expanded docs for architecture and all five scenario walkthroughs.
- Lightweight GitHub Actions workflow for install, test, and build.

## 3. What Was Intentionally Left Mock/Private

- No real funds.
- No real custody, MPC/TSS, HSM, key share, or signer orchestration.
- No production policy enforcement, risk logic, sanctions, KYT, address-risk vendor, or
  compliance certification.
- No real ledger, treasury execution, sweeping, reconciliation infrastructure, RPC URL, or
  settlement network.
- No live customers, bank partnerships, pilots, regulatory approvals, private endpoints, or
  internal deployment configuration.

## 4. Tests/Builds Run

- `pnpm install` passed.
- `pnpm test` passed: 1 test file, 9 tests.
- `pnpm build` passed across shared package, mock APIs, and customer web app.
- `pnpm dev` started local services:
  - Mock core banking API: `http://localhost:4100`
  - Mock En3 API: `http://localhost:4101`
  - Customer web app: `http://localhost:5174` in this environment because `5173` was already in use
- Verified local endpoints with `curl`:
  - `GET /customers`
  - `GET /health`
  - `GET /demo/state`
  - `GET /reconciliation/report`
  - `POST /transactions`
  - `POST /transactions/{id}/approve`
  - `POST /demo/reset`
- Browser smoke check via Playwright was attempted but local Chrome startup failed with a
  snap profile timeout. HTTP and build validation succeeded.
- Secret scan:
  - Exact requested pattern scan only matched false positives in required high-risk
    scenario file names.
  - Credential-boundary scan returned no hits.

## 5. Risks/Caveats

- Runtime state is in memory and resets on service restart or `POST /demo/reset`.
- Shared seed data is mirrored in TypeScript and JSON for demo readability; future changes
  should keep both aligned.
- UI talks to local mock services only. It is not an SDK contract test for private En3
  production systems.
- The current test suite covers the state machine; endpoint-level tests could be added if
  this demo grows.

## 6. Next 5 Tasks

1. Add endpoint-level tests for Fastify routes using injected requests.
2. Add a small mock admin view or route focused only on approval queue review.
3. Add optional mobile screenshots to the README after browser tooling is stable.
4. Add a mock webhook delivery log with retry/failure examples.
5. Add scripted demo reset and replay commands for recorded walkthroughs.

## REPORT_TO_PASTE_IN_CHAT

Implemented `001-reference-bank-stablecoin-wallet-demo` as the main public En3 reference
bank stablecoin wallet demo. It uses Spec Kit artifacts, a pnpm TypeScript workspace,
Vite React customer UI, mock core banking API, mock En3 sandbox API, shared lifecycle state
machine, expanded mock data, docs, tests, and CI.

Everything is clearly mock/sandbox/reference: no real funds, custody, signing, policy
enforcement, risk/vendor integrations, ledger, treasury, customer data, production RPCs, or
bank/regulatory claims.

Validation run: `pnpm install`, `pnpm test`, `pnpm build`, local `pnpm dev`, curl checks for
mock APIs, payment submit/approval/reset, and secret scans. Tests passed: 9. Build passed.
The local dev server is running in this environment at `http://localhost:5174` because
`5173` was already occupied; mock APIs are on `4100` and `4101`.
