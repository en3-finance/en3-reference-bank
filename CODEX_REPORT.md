# CODEX_REPORT

## Summary

Converted the public reference bank demo into the SandBank end-to-end demo. The repository now runs in public mock mode without private platform code, and includes a live sandbox mode hook through `EN3_API_BASE_URL`.

Status: public reference / sandbox artifact. This repository is intended to document and demonstrate the En3 integration surface. Production cryptography, signing orchestration, policy enforcement, risk logic, ledger infrastructure, treasury execution, and customer deployments are private by design.

## Implemented

- Added SandBank Spec Kit artifacts under `specs/001-sandbank-demo/`.
- Added SandBank runbooks and architecture docs.
- Added `mock/sandbank/scenario.json`.
- Added `scripts/run-sandbank-demo.*` and `pnpm sandbank:demo`.
- Aligned the shared state machine, UI, fixtures, and webhook/audit records to canonical public statuses and events.
- Kept all SandBank customers, accounts, addresses, payments, audit events, webhooks, and reconciliation data synthetic.
- Preserved public/private boundaries: no private platform imports, keys, RPC URLs, custody, signer orchestration, policy engine internals, production ledger, or treasury execution.

## Validation

- `pnpm install --frozen-lockfile`
- `pnpm sandbank:demo`
- `pnpm test` - 1 file, 10 tests passed
- `pnpm typecheck`
- `pnpm build`
- `pnpm validate:forbidden`
- `pnpm validate:secrets`
- Deprecated public event scan for old internal event names and legacy mock-signing tokens: no runtime matches

## Branch

- Branch: `feat/sandbank-demo`
- Push target: `origin/feat/sandbank-demo`

## REPORT_TO_PASTE_IN_CHAT

Implemented the SandBank public reference-bank demo on `feat/sandbank-demo`.

The repo now has a one-command mock CLI (`pnpm sandbank:demo`), SandBank docs/runbooks, `mock/sandbank/` data, canonical status/event vocabulary, and a web/customer demo backed by mock core banking and mock En3 APIs. Live sandbox mode is documented through `EN3_API_BASE_URL` and imports no private platform code.

Validation passed:
- `pnpm sandbank:demo`
- `pnpm test`
- `pnpm typecheck`
- `pnpm build`
- `pnpm validate:forbidden`
- `pnpm validate:secrets`
