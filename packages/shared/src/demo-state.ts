import type {
  ApprovePaymentInput,
  AuditEvent,
  DemoState,
  ReconciliationItem,
  SandboxWallet,
  SubmitPaymentInput,
  Transaction,
  TransactionStatus,
  TransactionTimelineEntry,
  WebhookEvent
} from "./types";

const POLICY_THRESHOLD = 10000;
const DEFAULT_ASSET = "USDC";
const DEFAULT_NETWORK = "sandbox-base-sepolia";

export function createReferenceDemoState(): DemoState {
  return clone({
    customers: [
      {
        id: "user_001",
        displayName: "Maya SandBank",
        segment: "retail",
        country: "AE",
        status: "active",
        createdAt: "2026-05-25T09:00:00Z",
        mockDataNotice: "Public synthetic SandBank customer for En3 demo only."
      },
      {
        id: "user_002",
        displayName: "Harbor Market Trading",
        segment: "sme",
        country: "SA",
        status: "active",
        createdAt: "2026-05-25T09:05:00Z",
        mockDataNotice: "Public synthetic SandBank customer for En3 demo only."
      }
    ],
    accounts: [
      {
        id: "account_001",
        userId: "user_001",
        label: "SandBank USD Account",
        currency: "USD",
        balance: "50000.00",
        status: "active",
        mockDataNotice: "Public mock core-banking account."
      },
      {
        id: "account_002",
        userId: "user_002",
        label: "SandBank Operating Account",
        currency: "USD",
        balance: "125000.00",
        status: "active",
        mockDataNotice: "Public mock core-banking account."
      }
    ],
    wallets: [
      {
        id: "wallet_001",
        userId: "user_001",
        asset: DEFAULT_ASSET,
        network: DEFAULT_NETWORK,
        depositAddress: "0x2222222222222222222222222222222222222222",
        balance: "12500.00",
        status: "active",
        createdAt: "2026-05-25T11:00:00Z",
        mockDataNotice: "Sandbox wallet reference only; no real custody."
      }
    ],
    transactions: [
      {
        id: "txn_deposit_001",
        walletId: "wallet_001",
        type: "deposit",
        asset: DEFAULT_ASSET,
        amount: "25000.00",
        status: "settled",
        source: "mock_chain_event",
        timeline: [
          step("submitted", "2026-05-25T11:08:00Z", "Mock stablecoin deposit notification submitted for sandbox address."),
          step("simulated", "2026-05-25T11:08:30Z", "Deposit acceptance simulated in mock state."),
          step("settled", "2026-05-25T11:09:00Z", "Deposit settled in the SandBank mock lifecycle.")
        ]
      },
      {
        id: "txn_send_001",
        walletId: "wallet_001",
        type: "outgoing_payment",
        asset: DEFAULT_ASSET,
        amount: "12500.00",
        destinationAddress: "0x9999999999999999999999999999999999999999",
        destinationLabel: "Mock supplier payout address",
        status: "settled",
        simulation: {
          status: "passed",
          estimatedNetworkFee: "0.42",
          result: "Mock simulation passed; no real network call was made."
        },
        policy: {
          required: true,
          riskLevel: "high",
          decision: "review_required",
          thresholdAmount: "10000.00",
          reasons: ["amount_above_sandbox_threshold", "mock_address_risk_high"]
        },
        approval: {
          status: "approved",
          adminId: "sandbank_ops",
          approvedAt: "2026-05-25T12:15:00Z",
          note: "Approved in mock operations console for demo."
        },
        mockExecution: {
          signedAt: "2026-05-25T12:16:00Z",
          broadcastAt: "2026-05-25T12:16:20Z",
          settledAt: "2026-05-25T12:17:00Z",
          mockTxHash: "0xmock000000000000000000000000000000000000000000000000000000000001"
        },
        timeline: [
          step("submitted", "2026-05-25T12:10:00Z", "Customer submitted a mock outgoing stablecoin payment."),
          step("simulated", "2026-05-25T12:10:03Z", "Transaction simulation completed in sandbox demo logic."),
          step("requires_approval", "2026-05-25T12:10:04Z", "Policy required SandBank operations approval for high amount and risky mock destination."),
          step("approved", "2026-05-25T12:15:00Z", "Mock operations admin approved the payment."),
          step("signing", "2026-05-25T12:15:45Z", "Mock signing workflow started; no custody operation occurred."),
          step("signed", "2026-05-25T12:16:00Z", "Mock signed transaction recorded; no private key material exists."),
          step("broadcast", "2026-05-25T12:16:20Z", "Mock broadcast recorded; no real network broadcast occurred."),
          step("settled", "2026-05-25T12:17:00Z", "Outgoing payment settled in the mock lifecycle.")
        ]
      }
    ],
    auditEvents: referenceAuditEvents(),
    webhookEvents: referenceWebhookEvents(),
    reconciliationReport: {
      reportId: "recon_001",
      date: "2026-05-25",
      summary: {
        matched: 1,
        pending: 0,
        exception: 0,
        totalAmount: "12500.00",
        asset: DEFAULT_ASSET
      },
      items: [
        {
          coreBankingAccountId: "account_001",
          walletId: "wallet_001",
          transactionId: "txn_send_001",
          auditEventIds: ["audit_005", "audit_007", "audit_010", "audit_011"],
          asset: DEFAULT_ASSET,
          amount: "12500.00",
          status: "matched",
          settledAt: "2026-05-25T12:17:00Z",
          mockDataNotice: "SandBank reconciliation demo only; no production ledger."
        }
      ]
    }
  });
}

export function cloneState(state: DemoState): DemoState {
  return clone(state);
}

export function ensureWalletForCustomer(state: DemoState, userId: string): SandboxWallet {
  const customer = state.customers.find((item) => item.id === userId && item.status === "active");
  if (!customer) {
    throw new Error(`Mock customer ${userId} was not found or is inactive.`);
  }

  const existing = state.wallets.find((wallet) => wallet.userId === userId && wallet.status === "active");
  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  const wallet: SandboxWallet = {
    id: nextId("wallet", state.wallets.length + 1),
    userId,
    asset: DEFAULT_ASSET,
    network: DEFAULT_NETWORK,
    depositAddress: `0x${(state.wallets.length + 3).toString().repeat(40).slice(0, 40)}`,
    balance: "0.00",
    status: "active",
    createdAt: now,
    mockDataNotice: "Sandbox wallet reference only; no real custody."
  };

  state.wallets.push(wallet);
  addAudit(state, "wallet.created", "mock-bank-core", "wallet", wallet.id, "Sandbox wallet created for SandBank customer.", now);
  addAudit(state, "address.created", "mock-en3", "wallet", wallet.id, "USDC sandbox deposit address issued.", now);
  addWebhook(state, "wallet.created", wallet.id, { walletId: wallet.id, userId, sandbox: true }, now);
  addWebhook(state, "address.created", wallet.id, { walletId: wallet.id, depositAddress: wallet.depositAddress, sandbox: true }, now);
  return wallet;
}

export function submitOutgoingPayment(state: DemoState, input: SubmitPaymentInput): Transaction {
  const wallet = getActiveWallet(state, input.walletId);
  const amount = parseAmount(input.amount);
  const now = new Date().toISOString();
  const transactionId = nextId("txn_send", state.transactions.filter((item) => item.type === "outgoing_payment").length + 1);

  const transaction: Transaction = {
    id: transactionId,
    walletId: wallet.id,
    type: "outgoing_payment",
    asset: wallet.asset,
    amount: formatAmount(amount),
    destinationAddress: input.destinationAddress,
    destinationLabel: input.destinationLabel || "Mock destination address",
    status: "simulated",
    simulation: {
      status: "passed",
      estimatedNetworkFee: "0.42",
      result: "Mock simulation passed; no real network call was made."
    },
    policy: simulatePolicy(amount, input.destinationAddress),
    timeline: [
      step("submitted", now, "Customer submitted a mock outgoing stablecoin payment."),
      step("simulated", now, "Transaction simulation completed in sandbox demo logic.")
    ]
  };

  if (amount > parseAmount(wallet.balance)) {
    transaction.status = "failed";
    transaction.simulation = {
      status: "failed",
      estimatedNetworkFee: "0.00",
      result: "Mock simulation failed the payment because the sandbox balance is insufficient."
    };
    transaction.timeline.push(step("failed", now, "Payment failed because the mock wallet balance is insufficient."));
    state.transactions.push(transaction);
    addAudit(state, "transaction.failed", "mock-en3", "transaction", transaction.id, "Payment failed for insufficient mock balance.", now);
    addWebhook(state, "transaction.failed", transaction.id, { transactionId: transaction.id, sandbox: true }, now);
    return transaction;
  }

  state.transactions.push(transaction);
  addAudit(state, "transaction.submitted", "mock-en3", "transaction", transaction.id, "Outgoing payment submitted to sandbox demo logic.", now);
  addAudit(state, "transaction.simulated", "mock-en3", "transaction", transaction.id, "Outgoing payment simulation completed in sandbox logic.", now);

  if (transaction.policy?.required) {
    transaction.status = "requires_approval";
    transaction.timeline.push(step("requires_approval", now, "Policy required SandBank operations approval for mock transaction."));
    addAudit(state, "transaction.requires_approval", "mock-en3", "transaction", transaction.id, "Approval required by sandbox policy.", now);
    addWebhook(state, "transaction.requires_approval", transaction.id, {
      transactionId: transaction.id,
      reasons: transaction.policy.reasons,
      sandbox: true
    }, now);
    return transaction;
  }

  return settleTransaction(state, transaction, "mock-en3", now);
}

export function approveOutgoingPayment(state: DemoState, input: ApprovePaymentInput): Transaction {
  const transaction = state.transactions.find((item) => item.id === input.transactionId);
  if (!transaction) {
    throw new Error(`Mock transaction ${input.transactionId} was not found.`);
  }
  if (transaction.status !== "requires_approval") {
    throw new Error(`Mock transaction ${transaction.id} is not awaiting approval.`);
  }

  const now = new Date().toISOString();
  transaction.status = "approved";
  transaction.approval = {
    status: "approved",
    adminId: input.adminId || "sandbank_ops",
    approvedAt: now,
    note: "Approved in mock operations console for demo."
  };
  transaction.timeline.push(step("approved", now, "Mock operations admin approved the payment."));
  addAudit(state, "transaction.approved", transaction.approval.adminId, "transaction", transaction.id, "Mock admin approval recorded.", now);
  return settleTransaction(state, transaction, transaction.approval.adminId, now);
}

export function getScenarioSteps(state: DemoState): string[] {
  const wallet = state.wallets[0];
  const deposit = state.transactions.find((item) => item.type === "deposit");
  const outgoing = state.transactions.find((item) => item.type === "outgoing_payment");
  const auditActions = new Set(state.auditEvents.map((event) => event.action));
  const webhookTypes = new Set(state.webhookEvents.map((event) => event.type));

  return [
    state.customers.length > 0 ? "mock_customer_exists" : "",
    wallet ? "wallet_created" : "",
    wallet?.depositAddress ? "deposit_address_issued" : "",
    deposit ? "stablecoin_deposit_detected" : "",
    deposit?.timeline.some((item) => item.state === "simulated") ? "deposit_simulated" : "",
    outgoing ? "outgoing_payment_submitted" : "",
    outgoing?.simulation ? "transaction_simulated" : "",
    outgoing?.policy?.required ? "policy_requires_approval" : "",
    outgoing?.approval ? "admin_approval_recorded" : "",
    outgoing?.mockExecution?.signedAt ? "transaction_signed" : "",
    outgoing?.mockExecution?.broadcastAt ? "transaction_broadcast" : "",
    outgoing?.status === "settled" ? "transaction_settled" : "",
    state.reconciliationReport.items.length > 0 ? "reconciliation_updated" : "",
    auditActions.size > 0 && webhookTypes.size > 0 ? "audit_and_webhooks_recorded" : ""
  ].filter(Boolean);
}

export function createServiceHealth(service: string) {
  return {
    service,
    status: "ok" as const,
    mode: "mock" as const,
    noRealFunds: true as const
  };
}

function settleTransaction(state: DemoState, transaction: Transaction, actor: string, at: string): Transaction {
  const wallet = getActiveWallet(state, transaction.walletId);
  const amount = parseAmount(transaction.amount);

  wallet.balance = formatAmount(parseAmount(wallet.balance) - amount);
  transaction.status = "settled";
  transaction.mockExecution = {
    signedAt: at,
    broadcastAt: at,
    settledAt: at,
    mockTxHash: `0xmock${transaction.id.replace(/\D/g, "").padStart(60, "0")}`
  };
  transaction.timeline.push(
    step("signing", at, "Mock signing workflow started; no custody operation occurred."),
    step("signed", at, "Mock signed transaction recorded; no private key material exists."),
    step("broadcast", at, "Mock broadcast recorded; no real network broadcast occurred."),
    step("settled", at, "Outgoing payment settled in the mock lifecycle.")
  );

  addAudit(state, "transaction.signing", "mock-en3", "transaction", transaction.id, "Mock signing workflow started; no custody operation occurred.", at);
  addAudit(state, "transaction.signed", "mock-en3", "transaction", transaction.id, "Mock signed transaction recorded; no private key material exists.", at);
  addAudit(state, "transaction.broadcast", "mock-en3", "transaction", transaction.id, "Mock broadcast recorded; no real network call occurred.", at);
  const settledAudit = addAudit(state, "transaction.settled", "mock-en3", "transaction", transaction.id, "Mock outgoing payment settled.", at);
  addWebhook(state, "transaction.settled", transaction.id, {
    transactionId: transaction.id,
    mockTxHash: transaction.mockExecution.mockTxHash,
    sandbox: true
  }, at);
  upsertReconciliationItem(state, transaction, settledAudit.id, at);
  addAudit(state, "reconciliation.updated", actor, "reconciliation_report", state.reconciliationReport.reportId, "Mock reconciliation report updated.", at);

  return transaction;
}

function simulatePolicy(amount: number, destinationAddress: string) {
  const reasons: string[] = [];
  if (amount > POLICY_THRESHOLD) {
    reasons.push("amount_above_sandbox_threshold");
  }
  if (isRiskyDestination(destinationAddress)) {
    reasons.push("mock_address_risk_high");
  }

  return {
    required: reasons.length > 0,
    riskLevel: reasons.includes("mock_address_risk_high") ? "high" as const : reasons.length > 0 ? "medium" as const : "low" as const,
    decision: reasons.length > 0 ? "review_required" as const : "allow" as const,
    thresholdAmount: formatAmount(POLICY_THRESHOLD),
    reasons
  };
}

function isRiskyDestination(destinationAddress: string): boolean {
  return destinationAddress.toLowerCase().includes("9999") || destinationAddress.toLowerCase().endsWith("bad");
}

function getActiveWallet(state: DemoState, walletId: string): SandboxWallet {
  const wallet = state.wallets.find((item) => item.id === walletId && item.status === "active");
  if (!wallet) {
    throw new Error(`Active sandbox wallet ${walletId} was not found.`);
  }
  return wallet;
}

function upsertReconciliationItem(state: DemoState, transaction: Transaction, auditEventId: string, at: string): void {
  const wallet = getActiveWallet(state, transaction.walletId);
  const account = state.accounts.find((item) => item.userId === wallet.userId);
  if (!account) {
    return;
  }

  const existing = state.reconciliationReport.items.find((item) => item.transactionId === transaction.id);
  const item: ReconciliationItem = {
    coreBankingAccountId: account.id,
    walletId: wallet.id,
    transactionId: transaction.id,
    auditEventIds: existing ? [...new Set([...existing.auditEventIds, auditEventId])] : [auditEventId],
    asset: transaction.asset,
    amount: transaction.amount,
    status: "matched",
    settledAt: at,
    mockDataNotice: "SandBank reconciliation demo only; no production ledger."
  };

  if (existing) {
    Object.assign(existing, item);
  } else {
    state.reconciliationReport.items.push(item);
  }

  state.reconciliationReport.summary = {
    matched: state.reconciliationReport.items.filter((entry) => entry.status === "matched").length,
    pending: state.reconciliationReport.items.filter((entry) => entry.status === "pending").length,
    exception: state.reconciliationReport.items.filter((entry) => entry.status === "exception").length,
    totalAmount: formatAmount(state.reconciliationReport.items.reduce((sum, entry) => sum + parseAmount(entry.amount), 0)),
    asset: DEFAULT_ASSET
  };
}

function addAudit(
  state: DemoState,
  action: string,
  actor: string,
  resourceType: string,
  resourceId: string,
  summary: string,
  createdAt: string
): AuditEvent {
  const event: AuditEvent = {
    id: nextId("audit", state.auditEvents.length + 1),
    action,
    actor,
    resourceType,
    resourceId,
    summary,
    createdAt
  };
  state.auditEvents.push(event);
  return event;
}

function addWebhook(
  state: DemoState,
  type: string,
  resourceId: string,
  payload: Record<string, unknown>,
  createdAt: string
): WebhookEvent {
  const event: WebhookEvent = {
    id: nextId("wh", state.webhookEvents.length + 1),
    type,
    resourceId,
    deliveryStatus: "delivered",
    createdAt,
    payload
  };
  state.webhookEvents.push(event);
  return event;
}

function referenceAuditEvents(): AuditEvent[] {
  return [
    audit("audit_001", "organization.created", "mock-bank-core", "organization", "org_sandbank", "SandBank organization exists in the mock demo.", "2026-05-25T09:00:00Z"),
    audit("audit_002", "user.created", "mock-bank-core", "user", "user_001", "Synthetic SandBank customer exists in mock core banking.", "2026-05-25T09:00:01Z"),
    audit("audit_003", "wallet.created", "mock-bank-core", "wallet", "wallet_001", "Sandbox wallet created for SandBank customer.", "2026-05-25T11:00:00Z"),
    audit("audit_004", "address.created", "mock-en3", "wallet", "wallet_001", "USDC sandbox deposit address issued.", "2026-05-25T11:00:01Z"),
    audit("audit_004", "transaction.submitted", "mock-en3", "transaction", "txn_send_001", "Outgoing payment submitted to sandbox demo logic.", "2026-05-25T12:10:00Z"),
    audit("audit_005", "transaction.simulated", "mock-en3", "transaction", "txn_send_001", "Outgoing payment simulation completed in sandbox logic.", "2026-05-25T12:10:03Z"),
    audit("audit_006", "transaction.requires_approval", "mock-en3", "transaction", "txn_send_001", "Approval required for high amount and risky mock destination.", "2026-05-25T12:10:04Z"),
    audit("audit_007", "transaction.approved", "sandbank_ops", "transaction", "txn_send_001", "Mock admin approval recorded.", "2026-05-25T12:15:00Z"),
    audit("audit_008", "transaction.signing", "mock-en3", "transaction", "txn_send_001", "Mock signing workflow started; no custody operation occurred.", "2026-05-25T12:15:45Z"),
    audit("audit_009", "transaction.signed", "mock-en3", "transaction", "txn_send_001", "Mock signed transaction recorded; no private key material exists.", "2026-05-25T12:16:00Z"),
    audit("audit_012", "transaction.broadcast", "mock-en3", "transaction", "txn_send_001", "Mock broadcast recorded; no real network call occurred.", "2026-05-25T12:16:20Z"),
    audit("audit_010", "transaction.settled", "mock-en3", "transaction", "txn_send_001", "Mock outgoing payment settled.", "2026-05-25T12:17:00Z"),
    audit("audit_011", "reconciliation.updated", "mock-en3", "reconciliation_report", "recon_001", "Mock reconciliation report matched account, wallet, and transaction.", "2026-05-25T12:18:00Z"),
    audit("audit_013", "audit.event_created", "mock-en3", "audit_event", "audit_010", "Synthetic audit event created for public lifecycle visibility.", "2026-05-25T12:18:01Z")
  ];
}

function referenceWebhookEvents(): WebhookEvent[] {
  return [
    webhook("wh_001", "wallet.created", "wallet_001", "2026-05-25T11:00:01Z", { walletId: "wallet_001", userId: "user_001", sandbox: true }),
    webhook("wh_002", "address.created", "wallet_001", "2026-05-25T11:00:02Z", { walletId: "wallet_001", depositAddress: "0x2222222222222222222222222222222222222222", sandbox: true }),
    webhook("wh_003", "transaction.requires_approval", "txn_send_001", "2026-05-25T12:10:05Z", { transactionId: "txn_send_001", reasons: ["amount_above_sandbox_threshold", "mock_address_risk_high"], sandbox: true }),
    webhook("wh_004", "transaction.settled", "txn_send_001", "2026-05-25T12:17:02Z", { transactionId: "txn_send_001", mockTxHash: "0xmock000000000000000000000000000000000000000000000000000000000001", sandbox: true }),
    webhook("wh_005", "reconciliation.updated", "recon_001", "2026-05-25T12:18:01Z", { reportId: "recon_001", matchedItems: 1, sandbox: true })
  ];
}

function audit(id: string, action: string, actor: string, resourceType: string, resourceId: string, summary: string, createdAt: string): AuditEvent {
  return { id, action, actor, resourceType, resourceId, summary, createdAt };
}

function webhook(id: string, type: string, resourceId: string, createdAt: string, payload: Record<string, unknown>): WebhookEvent {
  return { id, type, resourceId, deliveryStatus: "delivered", createdAt, payload };
}

function step(state: TransactionStatus, at: string, summary: string): TransactionTimelineEntry {
  return { state, at, summary };
}

function nextId(prefix: string, nextNumber: number): string {
  return `${prefix}_${String(nextNumber).padStart(3, "0")}`;
}

function parseAmount(value: string): number {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new Error(`Invalid mock amount: ${value}`);
  }
  return amount;
}

function formatAmount(value: number): string {
  return value.toFixed(2);
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
