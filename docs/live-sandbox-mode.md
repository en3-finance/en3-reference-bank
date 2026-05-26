# Live Sandbox Mode

Live sandbox mode is opt-in and uses `EN3_API_BASE_URL`. It does not import private platform code.

## CLI

```bash
EN3_API_BASE_URL=https://sandbox.example.invalid pnpm sandbank:demo
```

The CLI tries:

1. `${EN3_API_BASE_URL}/demo/state`
2. `${EN3_API_BASE_URL}/v1/demo/state`

The endpoint may return either a raw demo state object or `{ "data": <demo state> }`.

## Web App

```bash
EN3_API_BASE_URL=https://sandbox.example.invalid pnpm dev
```

The Vite dev server proxies `/en3/*` requests to `EN3_API_BASE_URL`. Mock core banking remains local unless separately replaced.

## Boundary

Do not commit sandbox credentials, bearer tokens, private endpoints, real RPC URLs, real keys, or customer data. Live sandbox mode is for public sandbox-compatible APIs only.
