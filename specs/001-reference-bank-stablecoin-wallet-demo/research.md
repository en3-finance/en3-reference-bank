# Research: Reference Bank Stablecoin Wallet Demo

## Decision: Use a pnpm TypeScript Workspace

**Rationale**: The feature needs a browser UI, two local mock APIs, and shared lifecycle
logic. pnpm workspaces keep these pieces installable and runnable with one command while
avoiding a heavier framework.

**Alternatives considered**:

- Single static HTML page: simpler, but weaker for API and webhook demonstration.
- Full-stack framework: unnecessary for a mock/reference repo and adds deployment opinions.

## Decision: Use Vite + React for the Customer Demo

**Rationale**: Vite gives a fast local dev loop and React is a familiar choice for a public
reference UI. The UI can remain dense and demo-oriented instead of becoming a marketing
page.

**Alternatives considered**:

- Next.js: more production and deployment surface than needed.
- Plain DOM code: fewer dependencies, but less maintainable once timeline and forms are
  added.

## Decision: Use Fastify for Mock APIs

**Rationale**: Fastify is lightweight, TypeScript-friendly, and sufficient for mock core
banking and mock En3 sandbox endpoints.

**Alternatives considered**:

- Express: also viable, but Fastify has strong JSON ergonomics with small setup.
- JSON Server: quick for static data, but awkward for policy simulation and lifecycle
  transitions.

## Decision: Keep State in Local JSON Seeds plus In-Memory Runtime State

**Rationale**: Public reviewers should be able to inspect mock data directly while services
can mutate a clean in-memory copy during a demo. A reset endpoint restores the seed state.

**Alternatives considered**:

- Persisting writes back to JSON files: convenient but creates noisy diffs during demos.
- SQLite: unnecessary for a small reference lifecycle.

## Decision: Centralize Lifecycle Rules in `packages/shared`

**Rationale**: The API and tests need one source of truth for balances, simulation, approval,
mock signing, mock broadcast, settlement, reconciliation, audit events, and webhooks.

**Alternatives considered**:

- Put logic only in the API service: would make tests and UI contracts harder to reuse.
- Split many domain packages: unnecessary for a demo-sized codebase.
