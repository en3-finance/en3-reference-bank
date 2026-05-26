# Tasks: Reference Bank Stablecoin Wallet Demo

**Input**: Design documents from `/specs/001-reference-bank-stablecoin-wallet-demo/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are required by FR-015 and SC-004. Write focused tests for the shared
scenario state machine and mock API flow before relying on the implementation.

**Organization**: Tasks are grouped by user story to enable independent implementation and
testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the lightweight TypeScript workspace and shared tooling.

- [X] T001 Create root pnpm workspace configuration in package.json, pnpm-workspace.yaml, tsconfig.base.json, and .gitignore
- [X] T002 [P] Create customer web package configuration in apps/customer-web/package.json, apps/customer-web/tsconfig.json, and apps/customer-web/vite.config.ts
- [X] T003 [P] Create mock core banking package configuration in apps/mock-bank-core/package.json and apps/mock-bank-core/tsconfig.json
- [X] T004 [P] Create mock En3 API package configuration in apps/mock-en3-api/package.json and apps/mock-en3-api/tsconfig.json
- [X] T005 [P] Create shared package configuration in packages/shared/package.json and packages/shared/tsconfig.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared mock data, lifecycle rules, and API foundations that all user stories use.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Update mock seed data in mock/core-banking/users.json, mock/core-banking/accounts.json, mock/en3/wallets.json, mock/en3/transactions.json, mock/en3/audit-events.json, mock/en3/webhooks.json, and mock/reconciliation/report.json
- [X] T007 [P] Implement shared TypeScript domain types in packages/shared/src/types.ts and packages/shared/src/index.ts
- [X] T008 Implement demo lifecycle state machine in packages/shared/src/demo-state.ts
- [X] T009 Write state machine tests for wallet, deposit, high-risk payment approval, settlement, reconciliation, audit, and webhooks in packages/shared/tests/demo-state.test.ts
- [X] T010 Implement mock core banking Fastify API in apps/mock-bank-core/src/server.ts
- [X] T011 Implement mock En3 Fastify API endpoints and reset behavior in apps/mock-en3-api/src/server.ts

**Checkpoint**: Foundation ready; user story implementation can now begin.

---

## Phase 3: User Story 1 - Walk Through the Wallet Lifecycle (Priority: P1) MVP

**Goal**: A reviewer can understand the full reference bank wallet lifecycle in under 5 minutes.

**Independent Test**: Run the local demo, select the reference customer, and verify wallet,
deposit, payment, reconciliation, audit, and webhook state are visible.

### Tests for User Story 1

- [X] T012 [P] [US1] Add mock API flow test coverage for the complete seeded lifecycle in packages/shared/tests/demo-state.test.ts

### Implementation for User Story 1

- [X] T013 [P] [US1] Create Vite React entry files in apps/customer-web/index.html, apps/customer-web/src/main.tsx, and apps/customer-web/src/App.tsx
- [X] T014 [US1] Implement wallet lifecycle dashboard, customer list, deposit address, transaction timeline, reconciliation, audit, and webhook panels in apps/customer-web/src/App.tsx
- [X] T015 [P] [US1] Implement responsive demo UI styling in apps/customer-web/src/styles.css
- [X] T016 [US1] Update architecture and demo walkthrough docs in docs/architecture.md and docs/demo-script.md

**Checkpoint**: User Story 1 is fully functional and independently demoable.

---

## Phase 4: User Story 2 - Demonstrate Policy Review and Approval (Priority: P2)

**Goal**: A reviewer can submit a high-amount or risky mock payment and see approval,
mock signing, mock broadcast, and settlement.

**Independent Test**: Submit a payment above the sandbox threshold or to a risky mock
destination and verify it requires approval before settling.

### Tests for User Story 2

- [X] T017 [P] [US2] Add state machine tests for insufficient balance, threshold approval, risky destination approval, and approval settlement in packages/shared/tests/demo-state.test.ts

### Implementation for User Story 2

- [X] T018 [US2] Implement outgoing payment submission and approval actions in packages/shared/src/demo-state.ts
- [X] T019 [US2] Expose payment submission and approval endpoints in apps/mock-en3-api/src/server.ts
- [X] T020 [US2] Add transaction form, policy/risk state, approval control, and lifecycle refresh in apps/customer-web/src/App.tsx
- [X] T021 [P] [US2] Update payment and approval scenario docs in docs/scenarios/03-send-payment-with-policy.md and docs/scenarios/04-approve-high-risk-transaction.md

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Inspect Sandbox Interfaces (Priority: P3)

**Goal**: An engineer can inspect local mock APIs, contracts, mock data, and quickstart
commands after the product walkthrough.

**Independent Test**: Run the APIs and fetch customers, accounts, wallets, transactions,
audit events, webhooks, and reconciliation report using documented commands.

### Tests for User Story 3

- [X] T022 [P] [US3] Add health and state endpoint expectations to packages/shared/tests/demo-state.test.ts

### Implementation for User Story 3

- [X] T023 [US3] Verify mock core and mock En3 API responses match specs/001-reference-bank-stablecoin-wallet-demo/contracts/mock-core-openapi.yaml and specs/001-reference-bank-stablecoin-wallet-demo/contracts/mock-en3-openapi.yaml
- [X] T024 [US3] Update quickstart and interface docs in specs/001-reference-bank-stablecoin-wallet-demo/quickstart.md and docs/scenarios/01-create-user-wallet.md
- [X] T025 [P] [US3] Update deposit and reconciliation scenario docs in docs/scenarios/02-deposit-stablecoin.md and docs/scenarios/05-reconcile-payment.md

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, CI, validation, secret scanning, and final report.

- [X] T026 Update README with mock/sandbox disclaimer, one-command local run instructions, Mermaid architecture diagram, 5-minute demo script, and related En3 repository links in README.md
- [X] T027 Preserve and update public security boundary guidance in SECURITY.md
- [X] T028 [P] Add lightweight GitHub Actions workflow for install, test, and build in .github/workflows/ci.yml
- [X] T029 Run pnpm install, pnpm test, pnpm build, and the required secret scan patterns from the repository root
- [X] T030 Create final implementation report in CODEX_REPORT.md
- [X] T031 Mark all completed tasks in specs/001-reference-bank-stablecoin-wallet-demo/tasks.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): no dependencies
- Foundational (Phase 2): depends on Setup completion and blocks all user stories
- User Story 1 (Phase 3): depends on Foundational
- User Story 2 (Phase 4): depends on Foundational and can reuse US1 UI surfaces
- User Story 3 (Phase 5): depends on Foundational and contracts
- Polish (Phase 6): depends on selected user stories being complete

### User Story Dependencies

- User Story 1 (P1): can start after Foundational; MVP demo path
- User Story 2 (P2): can start after Foundational; integrates with transaction form and approval UI
- User Story 3 (P3): can start after Foundational; validates local API interface story

### Parallel Opportunities

- T002-T005 can run in parallel after T001.
- T007 can run in parallel with mock-data expansion in T006.
- T012, T015, T017, T021, T022, T025, and T028 touch distinct files and are parallelizable when prerequisites are met.

---

## Parallel Example: User Story 1

```bash
Task: "T012 Add mock API flow test coverage for the complete seeded lifecycle in packages/shared/tests/demo-state.test.ts"
Task: "T015 Implement responsive demo UI styling in apps/customer-web/src/styles.css"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 shared mock data, lifecycle logic, tests, and mock APIs.
3. Complete Phase 3 dashboard and demo docs.
4. Validate with `pnpm test`, `pnpm build`, and local walkthrough.

### Incremental Delivery

1. Add User Story 1 for the 5-minute product walkthrough.
2. Add User Story 2 for policy-gated payment and approval.
3. Add User Story 3 for engineer-facing API inspection.
4. Finish README, SECURITY.md, CI, secret scan, and report.
