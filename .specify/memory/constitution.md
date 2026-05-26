<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles: template placeholders -> En3 Reference Bank demo principles
Added sections: Reference Demo Constraints; Development Workflow and Quality Gates
Removed sections: none
Templates requiring updates:
- ✅ .specify/templates/plan-template.md reviewed; no template update required for this feature
- ✅ .specify/templates/spec-template.md reviewed; no template update required for this feature
- ✅ .specify/templates/tasks-template.md reviewed; no template update required for this feature
- ✅ .specify/templates/commands/*.md not present; installed skills and extension commands reviewed instead
Follow-up TODOs: none
-->
# En3 Reference Bank Constitution

## Core Principles

### I. Public Truthfulness
All public code, documentation, sample data, and demo copy MUST describe only what this
repository implements. The project MUST NOT claim production readiness, audited MPC/TSS,
regulatory approval, live customers, pilots, bank partnerships, compliance certifications,
vendor integrations, fundraising details, private partner names, or private deployment context.
Rationale: this repository is a public reference artifact and must remain accurate under
external diligence.

### II. Mock Data and No Real Funds
Every customer, account, wallet, transaction, address, webhook, audit event, reconciliation
entry, and risk signal in this repository MUST be mock or sandbox data. The demo MUST NOT
move real funds, hold real custody, use real customer data, connect to production RPC URLs,
or expose private infrastructure. Rationale: the public demo illustrates flows without
creating financial, privacy, or custody risk.

### III. Local Demo Operability
The primary demo MUST run locally with one command when practical, and the README MUST
document that command. A reviewer MUST be able to understand the bank or fintech stablecoin
wallet scenario in 5 minutes using the README, demo script, UI, and mock data. Rationale:
the repository is intended for partner, diligence, and product-review walkthroughs.

### IV. Simple, Testable Reference Code
Implementation MUST prefer small, working, testable MVPs over broad unfinished scaffolds.
Shared behavior and scenario state transitions MUST have focused tests where practical.
Empty fake modules, decorative architecture, and unused abstractions MUST NOT be added.
Rationale: the repository should be easy to run, inspect, and adapt.

### V. Security Boundary and Private Systems
Production cryptography, signing orchestration, policy enforcement, risk logic, ledger
infrastructure, treasury execution, and customer deployments MUST remain private by design.
Public interfaces MAY model these concepts only as clearly labeled mock, sandbox, or
reference behavior. The repository MUST include or preserve SECURITY.md and MUST avoid
committing secrets, access tokens, private keys, internal endpoints, or deployment configs.
Rationale: En3 public repositories expose integration concepts, not private control-plane
or custody implementation.

## Reference Demo Constraints

- The demo MUST present bank-grade Wallet-as-a-Service concepts through API-first sandbox
  interfaces, reference web/mobile-facing flows, SDK/API/webhook concepts, wallet
  orchestration, and a wallet control-plane lifecycle.
- Payment operations concepts such as stablecoin deposits, treasury, ledger,
  reconciliation, sweeping, simulation, signing, and broadcast MUST be mock/reference
  behavior only.
- Compliance-readiness concepts such as KYT, sanctions, and address-risk checks MUST be
  interface-level mock signals only; fake vendor integrations MUST NOT be claimed.
- Deployment flexibility MAY be described as SaaS, hybrid, on-prem signer, bank-hosted key
  share, or BYO custody/HSM options, but the public repository MUST NOT imply those private
  deployments are implemented here.

## Development Workflow and Quality Gates

- Inspect the existing repository before making changes and preserve useful existing files.
- Maintain Spec Kit artifacts for each feature: spec.md, plan.md, tasks.md, and contracts
  where relevant.
- Add or update README and scenario documentation when user-facing behavior changes.
- Add lightweight CI only when it is likely to pass in a public clone.
- Run available tests, builds, and a basic secret scan before commit.
- Mark mock/sandbox/reference behavior explicitly in UI copy, docs, API responses, and
  sample data.

## Governance

This constitution supersedes conflicting guidance in feature specs, plans, tasks, and code
comments. Amendments require a documented Sync Impact Report, semantic version update, and
review of affected Spec Kit templates and runtime guidance. Versioning follows:

- MAJOR: removes or redefines a core principle in a backward-incompatible way.
- MINOR: adds a principle or materially expands governance.
- PATCH: clarifies language without changing governance intent.

Every feature plan MUST include a constitution check, and implementation MUST resolve
constitution violations before completion. If a principle must change, update this file in a
separate explicit constitution amendment before changing feature artifacts.

**Version**: 1.0.0 | **Ratified**: 2026-05-26 | **Last Amended**: 2026-05-26
