# Feature Specification: SandBank Public End-to-End Demo

**Feature Branch**: `feat/sandbank-demo`

**Created**: 2026-05-26

**Status**: Draft

**Input**: User description: "Make this the main public SandBank end-to-end demo. It must not depend on private platform code. It may use en3-wallet-sdk, en3-api-spec, mock API mode, and live sandbox mode via EN3_API_BASE_URL."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Run Public Mock Demo (Priority: P1)

A public reviewer can run the SandBank demo locally with synthetic data and see the full customer, wallet, deposit, payment, approval, settlement, reconciliation, audit, and webhook flow without private platform code.

**Why this priority**: This is the main public demo path and must work from a public clone.

**Independent Test**: Run the documented one-command mock demo and verify the output includes the SandBank customer, wallet status, deposit address, transaction simulation, approval requirement, approval action, settlement, reconciliation report, audit timeline, and webhook timeline.

**Acceptance Scenarios**:

1. **Given** the repository is cloned, **When** the reviewer runs the mock demo command, **Then** the full synthetic SandBank lifecycle is printed.
2. **Given** the web app is running, **When** the reviewer opens the UI, **Then** it displays the public boundary statement and synthetic lifecycle state.
3. **Given** the lifecycle includes audit and webhook entries, **When** the reviewer inspects event names, **Then** only shared canonical public events are used.

---

### User Story 2 - Use Live Sandbox Mode (Priority: P2)

An engineer can point the demo at a live En3 sandbox-compatible API by setting `EN3_API_BASE_URL` without importing private code or checking in credentials.

**Why this priority**: The demo must bridge public mock mode and live sandbox evaluation while preserving the public boundary.

**Independent Test**: Set `EN3_API_BASE_URL` to a sandbox base URL and run the CLI or web dev server; verify requests go to the configured base URL.

**Acceptance Scenarios**:

1. **Given** `EN3_API_BASE_URL` is unset, **When** the demo runs, **Then** it uses public mock mode.
2. **Given** `EN3_API_BASE_URL` is set, **When** the CLI runs, **Then** it fetches sandbox state from that URL and prints the same lifecycle fields.
3. **Given** `EN3_API_BASE_URL` is set for the web dev server, **When** the UI calls `/en3/*`, **Then** Vite proxies those calls to the configured sandbox base URL.

---

### User Story 3 - Validate Public Boundary (Priority: P3)

A maintainer can validate that the public demo excludes forbidden events, obvious secrets, private internals, real keys/RPCs, and non-public strategic context before pushing.

**Why this priority**: Public safety and truthfulness are release blockers.

**Independent Test**: Run tests, build, forbidden scan, and secret scan before commit and push.

**Acceptance Scenarios**:

1. **Given** code and docs have changed, **When** validation runs, **Then** tests and build pass.
2. **Given** public event names are scanned, **When** validation runs, **Then** deprecated internal event names are absent.
3. **Given** obvious secret patterns are scanned, **When** validation runs, **Then** no checked-in secrets are found.

### Edge Cases

- If `EN3_API_BASE_URL` does not expose a compatible state endpoint, the CLI exits with a clear error.
- If a mock payment exceeds the synthetic balance, the lifecycle records a failed state and leaves the wallet balance unchanged.
- If a destination is marked risky or the amount exceeds the threshold, approval is required before settlement.
- If a customer has an existing active wallet, the demo reuses it.
- If the repository is scanned for forbidden events, report files may mention the forbidden names only as validation context, not as public events.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The demo MUST provide a public mock mode that runs without private platform code.
- **FR-002**: The demo MUST provide live sandbox mode through `EN3_API_BASE_URL` without private imports.
- **FR-003**: The demo MUST include a public boundary statement in docs and UI.
- **FR-004**: The demo MUST use synthetic customer, account, wallet, transaction, audit, webhook, and reconciliation data.
- **FR-005**: The demo MUST output SandBank customer, wallet status, deposit address, transaction simulation, approval requirement, approval action, settlement, reconciliation report, audit timeline, and webhook timeline.
- **FR-006**: The demo MUST use shared canonical public statuses and event names.
- **FR-007**: The demo MUST NOT use deprecated internal event names in public runtime artifacts.
- **FR-008**: The demo MUST NOT include production custody, real keys, real RPC URLs, private internals, partner/fundraising/M&A/ADI/grant context, or strategic acquirer claims.
- **FR-009**: Documentation MUST include SandBank demo script, architecture, local runbook, and live sandbox mode.
- **FR-010**: Validation MUST include one-command local demo, tests, build when the web app exists, forbidden scan, and secret scan.

### Key Entities *(include if feature involves data)*

- **SandBank Customer**: Synthetic customer displayed in public mock and live sandbox-compatible output.
- **Sandbox Wallet**: Wallet status, asset, network, balance, and deposit address.
- **Transaction**: Deposit or outgoing payment with simulation, policy, approval, mock execution, and settlement state.
- **Audit Event**: Canonical public lifecycle event.
- **Webhook Event**: Canonical public notification event.
- **Reconciliation Report**: Synthetic match between account, wallet, transaction, and audit references.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: `pnpm sandbank:demo` prints the required full lifecycle in mock mode.
- **SC-002**: `EN3_API_BASE_URL=<url> pnpm sandbank:demo` attempts live sandbox mode without private imports.
- **SC-003**: `pnpm test` and `pnpm build` pass.
- **SC-004**: The forbidden public event scan returns no matches outside validation/report context.
- **SC-005**: The public boundary statement appears in README, docs, and UI.

## Assumptions

- Live sandbox APIs expose a demo-compatible state endpoint at `/demo/state` or `/v1/demo/state`.
- The existing public TypeScript workspace remains the implementation base.
- `en3-wallet-sdk` and `en3-api-spec` may be referenced publicly but are not required runtime dependencies for mock mode.
