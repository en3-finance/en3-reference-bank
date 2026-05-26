# Security Policy

Do not report vulnerabilities through public issues. Do not disclose security-sensitive findings publicly.

SandBank is a public mock / sandbox demo. Production custody, signing infrastructure, policy enforcement, risk logic, ledger infrastructure, treasury execution, and customer deployments are not contained in this repository.

This repository contains documentation, mock contracts, sandbox examples, synthetic data, and reference interfaces only. It must not include private keys, seed phrases, access tokens, production API hosts, real RPC URLs, customer data, internal deployment configuration, or real infrastructure details.

Before publishing changes, run:

```bash
pnpm validate:forbidden
pnpm validate:secrets
```

Contact the En3 team through existing security channels while a dedicated public security contact is being finalized.
