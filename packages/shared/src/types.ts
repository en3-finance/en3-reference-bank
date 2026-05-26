export type CustomerStatus = "active" | "inactive";
export type AccountStatus = "active" | "frozen" | "closed";
export type WalletStatus = "active" | "pending" | "closed";
export type TransactionType = "deposit" | "outgoing_payment";
export type TransactionStatus =
  | "deposit_detected"
  | "credited"
  | "submitted"
  | "simulated"
  | "approval_required"
  | "approved"
  | "mock_signed"
  | "mock_broadcast"
  | "settled"
  | "rejected";
export type RiskLevel = "low" | "medium" | "high";
export type AuditActor = "customer" | "admin_ref_ops" | "mock-bank-core" | "mock-en3" | string;
export type WebhookDeliveryStatus = "queued" | "delivered" | "failed";
export type ReconciliationStatus = "matched" | "pending" | "unmatched";

export interface MockCustomer {
  id: string;
  displayName: string;
  segment: string;
  country: string;
  status: CustomerStatus;
  createdAt: string;
  mockDataNotice: string;
}

export interface MockCoreAccount {
  id: string;
  userId: string;
  label: string;
  currency: string;
  balance: string;
  status: AccountStatus;
  mockDataNotice: string;
}

export interface SandboxWallet {
  id: string;
  userId: string;
  asset: "USDC" | string;
  network: string;
  depositAddress: string;
  balance: string;
  status: WalletStatus;
  createdAt: string;
  mockDataNotice: string;
}

export interface TransactionTimelineEntry {
  state: TransactionStatus;
  at: string;
  summary: string;
}

export interface TransactionSimulation {
  status: "passed" | "failed";
  estimatedNetworkFee: string;
  result: string;
}

export interface PolicyDecision {
  required: boolean;
  riskLevel: RiskLevel;
  thresholdAmount: string;
  reasons: string[];
}

export interface TransactionApproval {
  status: "approved";
  adminId: string;
  approvedAt: string;
  note: string;
}

export interface MockExecution {
  signedAt: string;
  broadcastAt: string;
  settledAt: string;
  mockTxHash: string;
}

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  asset: "USDC" | string;
  amount: string;
  status: TransactionStatus;
  source?: string;
  destinationAddress?: string;
  destinationLabel?: string;
  simulation?: TransactionSimulation;
  policy?: PolicyDecision;
  approval?: TransactionApproval;
  mockExecution?: MockExecution;
  timeline: TransactionTimelineEntry[];
}

export interface AuditEvent {
  id: string;
  action: string;
  actor: AuditActor;
  resourceType: string;
  resourceId: string;
  summary: string;
  createdAt: string;
}

export interface WebhookEvent {
  id: string;
  type: string;
  resourceId: string;
  deliveryStatus: WebhookDeliveryStatus;
  createdAt: string;
  payload: Record<string, unknown>;
}

export interface ReconciliationItem {
  coreBankingAccountId: string;
  walletId: string;
  transactionId: string;
  auditEventIds: string[];
  asset: "USDC" | string;
  amount: string;
  status: ReconciliationStatus;
  settledAt?: string;
  mockDataNotice: string;
}

export interface ReconciliationReport {
  reportId: string;
  date: string;
  summary: {
    matched: number;
    pending: number;
    unmatched: number;
    totalAmount: string;
    asset: "USDC" | string;
  };
  items: ReconciliationItem[];
}

export interface DemoState {
  customers: MockCustomer[];
  accounts: MockCoreAccount[];
  wallets: SandboxWallet[];
  transactions: Transaction[];
  auditEvents: AuditEvent[];
  webhookEvents: WebhookEvent[];
  reconciliationReport: ReconciliationReport;
}

export interface SubmitPaymentInput {
  walletId: string;
  amount: string;
  destinationAddress: string;
  destinationLabel?: string;
}

export interface ApprovePaymentInput {
  transactionId: string;
  adminId?: string;
}

export interface DemoHealth {
  service: string;
  status: "ok";
  mode: "mock";
  noRealFunds: true;
}
