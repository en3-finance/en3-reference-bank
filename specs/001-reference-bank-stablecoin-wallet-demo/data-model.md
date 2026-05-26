# Data Model: Reference Bank Stablecoin Wallet Demo

## MockCustomer

- `id`: stable public sample id, for example `user_001`
- `displayName`: mock customer name
- `segment`: mock customer type such as retail or SME
- `country`: sample country code
- `status`: `active` or `inactive`

Relationships: Owns zero or more `MockCoreAccount` records and zero or more
`SandboxWallet` records.

## MockCoreAccount

- `id`: stable account id
- `userId`: related `MockCustomer.id`
- `currency`: fiat account currency
- `balance`: display balance for context only
- `status`: `active`, `frozen`, or `closed`

Relationships: Referenced by reconciliation entries.

## SandboxWallet

- `id`: sandbox wallet id
- `userId`: related `MockCustomer.id`
- `asset`: stablecoin asset such as `USDC`
- `network`: sandbox network label
- `depositAddress`: mock deposit address
- `balance`: credited mock wallet balance
- `status`: `active`, `pending`, or `closed`

State rules: A wallet can receive deposits and outgoing payments only while `active`.

## Transaction

- `id`: transaction id
- `walletId`: related `SandboxWallet.id`
- `type`: `deposit` or `outgoing_payment`
- `asset`: stablecoin asset
- `amount`: decimal string
- `destinationAddress`: present for outgoing payments
- `status`: lifecycle state
- `simulation`: mock simulation result
- `policy`: mock policy decision
- `approval`: optional admin approval data
- `timeline`: ordered transaction lifecycle entries

State rules:

```text
draft -> simulated -> approval_required -> approved -> mock_signed -> mock_broadcast -> settled
draft -> simulated -> rejected
deposit_detected -> credited -> settled
```

Outgoing payments above `10000.00` or to a destination with risky mock address-risk state
must enter `approval_required`.

## PolicyDecision

- `required`: boolean
- `reasons`: list of mock policy reasons
- `riskLevel`: `low`, `medium`, or `high`
- `thresholdAmount`: decimal string for the demo policy threshold

## AuditEvent

- `id`: audit event id
- `action`: lifecycle action name
- `actor`: `customer`, `admin`, `system`, or `mock-en3`
- `resourceType`: entity type
- `resourceId`: entity id
- `summary`: short explanation
- `createdAt`: ISO timestamp

## WebhookEvent

- `id`: webhook id
- `type`: event type
- `resourceId`: related transaction or wallet id
- `deliveryStatus`: `queued`, `delivered`, or `failed`
- `payload`: mock event payload
- `createdAt`: ISO timestamp

## ReconciliationReport

- `reportId`: report id
- `date`: report date
- `items`: reconciliation rows
- `summary`: totals by match status

Each reconciliation row links a mock core account, wallet, transaction, amount, status,
and related audit event ids.
