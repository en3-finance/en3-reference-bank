# Tasks: SandBank Public End-to-End Demo

**Input**: Design documents from `/specs/001-sandbank-demo/`

**Prerequisites**: plan.md, spec.md

**Tests**: Tests are required for lifecycle and canonical public event boundaries.

**Organization**: Tasks are grouped by user story to enable independent implementation and validation.

## Phase 1: Setup (Shared Infrastructure)

- [X] T001 Create or update `specs/001-sandbank-demo/spec.md`, `specs/001-sandbank-demo/plan.md`, and `specs/001-sandbank-demo/tasks.md`
- [X] T002 Update `AGENTS.md` to reference `specs/001-sandbank-demo/plan.md`

---

## Phase 2: Foundational (Blocking Prerequisites)

- [X] T003 Add canonical public statuses/events and forbidden event constants in `packages/shared/src/types.ts` and `packages/shared/src/index.ts`
- [X] T004 Update shared SandBank synthetic lifecycle copy in `packages/shared/src/demo-state.ts`
- [X] T005 Add `mock/sandbank/scenario.json` with the complete synthetic public lifecycle
- [X] T006 Add canonical event boundary tests in `packages/shared/tests/demo-state.test.ts`

---

## Phase 3: User Story 1 - Run Public Mock Demo (Priority: P1)

**Goal**: Public reviewers can run and inspect the full SandBank lifecycle without private code.

**Independent Test**: Run `pnpm sandbank:demo` and verify the required lifecycle output fields.

- [X] T007 [US1] Add `scripts/run-sandbank-demo.mjs`, `scripts/run-sandbank-demo.sh`, and `scripts/run-sandbank-demo.ps1`
- [X] T008 [US1] Add root `sandbank:demo` script in `package.json`
- [X] T009 [US1] Update UI title, boundary statement, and SandBank labels in `apps/customer-web/src/App.tsx`, `apps/customer-web/src/styles.css`, and `apps/customer-web/index.html`

---

## Phase 4: User Story 2 - Use Live Sandbox Mode (Priority: P2)

**Goal**: Engineers can point the demo at a live sandbox-compatible API with `EN3_API_BASE_URL`.

**Independent Test**: Run `EN3_API_BASE_URL=<url> pnpm sandbank:demo` or `EN3_API_BASE_URL=<url> pnpm dev` and verify sandbox routing.

- [X] T010 [US2] Implement CLI live sandbox fetch behavior in `scripts/run-sandbank-demo.mjs`
- [X] T011 [US2] Add Vite proxy support for `EN3_API_BASE_URL` in `apps/customer-web/vite.config.ts`
- [X] T012 [US2] Document live sandbox mode in `docs/live-sandbox-mode.md`

---

## Phase 5: User Story 3 - Validate Public Boundary (Priority: P3)

**Goal**: Maintainers can validate public safety before push.

**Independent Test**: Run tests, build, forbidden scan, secret scan, and inspect docs.

- [X] T013 [US3] Add forbidden and secret scan scripts in `package.json`
- [X] T014 [US3] Add/update `docs/sandbank-demo-script.md`, `docs/sandbank-architecture.md`, `docs/local-runbook.md`, and README
- [X] T015 [US3] Update `CODEX_REPORT.md` with validation results and final report block

---

## Dependencies & Execution Order

Setup precedes foundational work. User Story 1 and User Story 2 depend on the SandBank dataset and runner. User Story 3 depends on implementation and docs.

## Implementation Strategy

Complete the public mock CLI and UI boundary first, then add live sandbox routing and validation/reporting.
