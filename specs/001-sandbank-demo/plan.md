# Implementation Plan: SandBank Public End-to-End Demo

**Branch**: `feat/sandbank-demo` | **Date**: 2026-05-26 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-sandbank-demo/spec.md`

## Summary

Convert the existing public reference-bank workspace into the main SandBank end-to-end demo. Keep the lightweight TypeScript pnpm workspace, add SandBank-specific docs, synthetic mock data under `mock/sandbank/`, run scripts, canonical public event/status constants, and live sandbox routing through `EN3_API_BASE_URL`.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js 20+

**Primary Dependencies**: pnpm workspaces, Vite, React, Fastify, Vitest, tsx, concurrently

**Storage**: Checked-in synthetic JSON mock data plus in-memory mock API state

**Testing**: Vitest tests for shared lifecycle state and canonical event boundaries

**Target Platform**: Public developer/reviewer machine with Node.js and a browser

**Project Type**: Web app, mock APIs, shared package, and CLI runner

**Performance Goals**: Mock CLI returns in under 5 seconds; local web app starts in under 30 seconds after dependencies are installed

**Constraints**: No private platform code, no real funds, no production custody, no real keys/RPC, no private internals, no partner/fundraising/M&A/ADI/grant context, no strategic acquirer claims

**Scale/Scope**: One synthetic SandBank lifecycle covering customer, wallet, deposit, outgoing payment, approval, settlement, reconciliation, audit, and webhooks

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Public Truthfulness: PASS. All public behavior is labeled mock, sandbox, synthetic, or reference.
- Mock Data and No Real Funds: PASS. Only synthetic data and sandbox-compatible interfaces are used.
- Local Demo Operability: PASS. `pnpm sandbank:demo` and `pnpm dev` are documented.
- Simple, Testable Reference Code: PASS. The existing shared lifecycle remains the core test target.
- Security Boundary and Private Systems: PASS. Private custody, signing, risk, ledger, treasury, RPC, and deployment internals are excluded.

## Project Structure

### Documentation (this feature)

```text
specs/001-sandbank-demo/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/customer-web/
apps/mock-bank-core/
apps/mock-en3-api/
packages/shared/
mock/sandbank/
scripts/run-sandbank-demo.*
docs/sandbank-demo-script.md
docs/sandbank-architecture.md
docs/local-runbook.md
docs/live-sandbox-mode.md
```

**Structure Decision**: Preserve the existing workspace and add SandBank public-demo assets around it to avoid unnecessary churn.

## Phase 0: Research

- Decision: Keep mock mode local and dependency-light.
  Rationale: Public reviewers can run it from a clone without credentials or private services.
  Alternatives considered: Requiring a live API by default was rejected because it weakens public operability.

- Decision: Use `EN3_API_BASE_URL` as the only live sandbox switch.
  Rationale: It is explicit, easy to audit, and avoids private code imports.
  Alternatives considered: Private SDK or internal service imports were rejected.

- Decision: Maintain canonical event/status constants in the shared package.
  Rationale: Tests can enforce public event boundaries and avoid forbidden event names.
  Alternatives considered: Doc-only event lists were rejected because they are harder to validate.

## Phase 1: Design and Contracts

The demo exposes local mock HTTP interfaces already documented under the previous feature and a CLI output contract documented in `docs/local-runbook.md`. Live sandbox mode expects `/demo/state` or `/v1/demo/state` to return either a raw demo state object or `{ data: DemoState }`.

## Post-Design Constitution Check

- Public Truthfulness: PASS. Boundary statements are required in UI, README, and docs.
- Mock Data and No Real Funds: PASS. Seed data remains synthetic.
- Local Demo Operability: PASS. CLI and web run paths are documented.
- Simple, Testable Reference Code: PASS. Tests cover lifecycle and canonical events.
- Security Boundary and Private Systems: PASS. Validation includes forbidden and secret scans.

## Complexity Tracking

No constitution violations or exceptional complexity are required.
