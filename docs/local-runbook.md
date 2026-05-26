# Local Runbook

## Prerequisites

- Node.js 20+
- pnpm 9+

## Public Mock CLI

```bash
pnpm install
pnpm sandbank:demo
```

Expected output includes:

- SandBank customer
- Wallet status
- Deposit address
- Transaction simulation
- Approval requirement
- Approval action
- Settlement
- Reconciliation report
- Audit timeline
- Webhook timeline

## Web Demo

```bash
pnpm dev
```

Open `http://localhost:5173`. If that port is occupied, Vite will print the alternate URL.

## Validation

```bash
pnpm test
pnpm build
pnpm validate:forbidden
pnpm validate:secrets
```

The forbidden scan fails if deprecated internal event names appear in runtime public artifacts.

## Reset

Use the UI reset button or:

```bash
curl -X POST http://localhost:4101/demo/reset
```
