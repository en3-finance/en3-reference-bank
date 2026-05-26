# Feature Specification: Reference Bank Stablecoin Wallet Demo

**Feature Branch**: `001-reference-bank-stablecoin-wallet-demo`

**Created**: 2026-05-26

**Status**: Draft

**Input**: User description: "Create the main public end-to-end demo showing how a bank or fintech could use En3 sandbox APIs to launch a stablecoin wallet product."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Walk Through the Wallet Lifecycle (Priority: P1)

A partner, fintech product lead, or diligence reviewer can open the reference demo and
understand how an existing mock bank customer receives an En3 wallet, a deposit address,
a stablecoin deposit, a credited balance, an outgoing payment, settlement, reconciliation,
audit events, and webhooks.

**Why this priority**: This is the core 5-minute narrative and the minimum viable public
demo.

**Independent Test**: Start the local demo, select the reference customer, and verify the
wallet, deposit, payment, reconciliation, audit trail, and webhook timeline are visible
without entering real credentials or using real funds.

**Acceptance Scenarios**:

1. **Given** a mock bank customer exists, **When** a reviewer opens the demo, **Then** the
   customer, linked wallet, deposit address, balance, and lifecycle timeline are visible.
2. **Given** a mock deposit event exists, **When** the reviewer inspects the wallet state,
   **Then** the balance reflects the credited stablecoin amount and the audit timeline
   includes the deposit event.
3. **Given** the outgoing payment has settled, **When** the reviewer opens reconciliation,
   **Then** the report links the core-banking account, wallet, transaction, and audit events.

---

### User Story 2 - Demonstrate Policy Review and Approval (Priority: P2)

An operations admin can see how a high-amount or risky-destination payment is simulated,
flagged for approval, approved in mock form, mock-signed, mock-broadcast, and settled.

**Why this priority**: Policy review is a central wallet control-plane concept and
distinguishes the demo from a simple wallet balance screen.

**Independent Test**: Submit or replay an outgoing payment above the sandbox threshold or
to a risky mock destination and verify that approval is required before the payment can
settle.

**Acceptance Scenarios**:

1. **Given** a payment exceeds the sandbox threshold, **When** it is submitted, **Then** the
   simulation marks approval as required and records the reason.
2. **Given** a payment is awaiting approval, **When** an admin approves it, **Then** the
   transaction lifecycle advances through mock signing, mock broadcast, and settlement.
3. **Given** a risky destination is selected, **When** the payment is simulated, **Then**
   the policy state explains the mock risk reason without claiming a live vendor check.

---

### User Story 3 - Inspect Sandbox Interfaces (Priority: P3)

An engineer can inspect mock En3 sandbox API endpoints, mock core banking data, webhook
events, and contracts to understand how a bank backend could integrate with the reference
flow.

**Why this priority**: The demo must be useful to technical evaluators after the first
product walkthrough.

**Independent Test**: Run the mock APIs locally and fetch the documented customers,
wallets, transactions, reconciliation, audit, and webhook endpoints using the quickstart
commands.

**Acceptance Scenarios**:

1. **Given** the mock API services are running, **When** an engineer requests customer and
   account data, **Then** the mock core banking service returns only sample data.
2. **Given** the mock En3 API service is running, **When** an engineer creates a wallet or
   submits a payment, **Then** the service returns sandbox lifecycle states and webhook
   events.
3. **Given** the engineer reads the contracts, **When** they compare them to the demo,
   **Then** endpoint behavior matches the documented mock interfaces.

### Edge Cases

- If a requested customer does not exist, the demo shows a clear mock-data error and no
  wallet is created.
- If a wallet already exists for a customer, the demo reuses the active sandbox wallet
  instead of creating duplicate wallets.
- If a payment amount exceeds the available mock balance, the transaction is rejected with
  an insufficient-balance state.
- If a payment amount is high or the destination is marked risky, the transaction remains
  blocked until a mock admin approval is recorded.
- If a transaction has not settled, reconciliation shows it as pending or unmatched.
- If mock data is reset, the demo returns to the documented reference scenario.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The demo MUST show an existing mock bank customer and mock core-banking
  account without using real customer data.
- **FR-002**: The demo MUST create or display an En3 sandbox wallet linked to the mock
  customer.
- **FR-003**: The demo MUST issue or display a sandbox deposit address for the wallet.
- **FR-004**: The demo MUST represent a mock stablecoin deposit event and credit the
  wallet balance.
- **FR-005**: Users MUST be able to submit or replay an outgoing stablecoin payment in
  mock form.
- **FR-006**: The demo MUST simulate each outgoing payment before approval, signing, or
  settlement.
- **FR-007**: The demo MUST require mock admin approval when the payment amount is high
  or the destination has a risky mock address-risk state.
- **FR-008**: The demo MUST record the admin approval decision in the transaction
  lifecycle and audit trail.
- **FR-009**: The demo MUST mark signing, broadcast, and settlement as mock/sandbox
  steps and MUST NOT claim real custody or real network execution.
- **FR-010**: The demo MUST update a reconciliation report that links the mock
  core-banking account, wallet, settled transaction, and audit references.
- **FR-011**: The demo MUST expose audit events for wallet creation, deposit credit,
  simulation, approval, mock signing, mock broadcast, settlement, and reconciliation.
- **FR-012**: The demo MUST show webhook events emitted across the lifecycle.
- **FR-013**: The demo MUST run locally with one documented command when dependencies are
  installed.
- **FR-014**: Documentation MUST include architecture, a 5-minute demo script, scenario
  walkthroughs, mock/sandbox disclaimers, and links to related En3 public repositories.
- **FR-015**: Tests MUST cover the scenario state machine or mock API flow.
- **FR-016**: Public copy MUST avoid claims of production readiness, live customers,
  audited MPC/TSS, regulatory approval, compliance certification, or real vendor
  integrations.

### Key Entities *(include if feature involves data)*

- **Mock Customer**: A public sample bank customer with id, display name, segment, country,
  and status.
- **Mock Core Account**: A public sample bank account reference linked to a mock customer.
- **Sandbox Wallet**: A wallet reference linked to a mock customer with asset, network,
  deposit address, balance, and status.
- **Transaction**: A deposit or outgoing payment with amount, asset, destination,
  lifecycle status, simulation result, policy result, approval, and mock settlement data.
- **Policy Decision**: A mock decision explaining whether approval is required and why.
- **Audit Event**: A timestamped lifecycle event with actor, action, resource, and summary.
- **Webhook Event**: A mock outbound notification with event type, resource id, payload,
  and delivery state.
- **Reconciliation Report**: A mock report linking bank account, wallet, transaction,
  audit event, amount, and match status.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: A new reviewer can complete the primary walkthrough in under 5 minutes
  using only the README, demo script, and local demo.
- **SC-002**: The local demo starts with one documented command after dependencies are
  installed.
- **SC-003**: The reference scenario covers all 14 lifecycle steps requested by the
  product narrative.
- **SC-004**: At least one automated test verifies the policy-gated payment lifecycle from
  submission through approval and settlement.
- **SC-005**: All visible data in the demo is clearly labeled as mock, sandbox, or
  reference data.
- **SC-006**: The repository contains no obvious secrets matching the required secret-scan
  patterns before commit.

## Assumptions

- The public demo is a reference implementation, not a production product.
- The initial implementation may use local JSON-backed mock state rather than persistent
  infrastructure.
- The customer-facing UI targets desktop browser demos first and remains responsive enough
  for common laptop and tablet screens.
- Mock En3 API responses are sufficient for this repository; live En3 services, real RPC
  URLs, custody, signing, ledger, treasury, KYT, sanctions, and address-risk integrations
  remain private or out of scope.
- Related En3 repositories may be referenced by name and public GitHub URL conventions, but
  this repo does not depend on them at runtime.
