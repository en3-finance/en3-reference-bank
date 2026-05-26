import { describe, expect, it } from "vitest";
import {
  approveOutgoingPayment,
  createReferenceDemoState,
  createServiceHealth,
  ensureWalletForCustomer,
  getScenarioSteps,
  submitOutgoingPayment
} from "../src";

describe("reference demo state", () => {
  it("covers the complete 14-step reference lifecycle", () => {
    const state = createReferenceDemoState();

    expect(getScenarioSteps(state)).toEqual([
      "mock_customer_exists",
      "wallet_created",
      "deposit_address_issued",
      "stablecoin_deposit_detected",
      "balance_credited",
      "outgoing_payment_submitted",
      "transaction_simulated",
      "policy_requires_approval",
      "admin_approval_recorded",
      "transaction_mock_signed",
      "transaction_mock_broadcast",
      "transaction_settled",
      "reconciliation_updated",
      "audit_and_webhooks_recorded"
    ]);
  });

  it("reuses an existing sandbox wallet for the same mock customer", () => {
    const state = createReferenceDemoState();

    const wallet = ensureWalletForCustomer(state, "user_001");

    expect(wallet.id).toBe("wallet_001");
    expect(state.wallets).toHaveLength(1);
  });

  it("creates a sandbox wallet for a second mock customer without real custody claims", () => {
    const state = createReferenceDemoState();

    const wallet = ensureWalletForCustomer(state, "user_002");

    expect(wallet.userId).toBe("user_002");
    expect(wallet.mockDataNotice).toContain("no real custody");
    expect(state.auditEvents.at(-1)?.action).toBe("wallet.created");
    expect(state.webhookEvents.at(-1)?.type).toBe("wallet.created");
  });

  it("rejects an outgoing payment when the mock balance is insufficient", () => {
    const state = createReferenceDemoState();

    const transaction = submitOutgoingPayment(state, {
      walletId: "wallet_001",
      amount: "999999.00",
      destinationAddress: "0x3333333333333333333333333333333333333333"
    });

    expect(transaction.status).toBe("rejected");
    expect(transaction.simulation?.status).toBe("failed");
    expect(state.wallets[0].balance).toBe("12500.00");
  });

  it("requires approval for payments above the sandbox threshold", () => {
    const state = createReferenceDemoState();

    const transaction = submitOutgoingPayment(state, {
      walletId: "wallet_001",
      amount: "11000.00",
      destinationAddress: "0x3333333333333333333333333333333333333333"
    });

    expect(transaction.status).toBe("approval_required");
    expect(transaction.policy).toMatchObject({
      required: true,
      riskLevel: "medium"
    });
    expect(transaction.policy?.reasons).toContain("amount_above_sandbox_threshold");
  });

  it("requires approval for risky mock destinations", () => {
    const state = createReferenceDemoState();

    const transaction = submitOutgoingPayment(state, {
      walletId: "wallet_001",
      amount: "100.00",
      destinationAddress: "0x9999999999999999999999999999999999999999"
    });

    expect(transaction.status).toBe("approval_required");
    expect(transaction.policy?.riskLevel).toBe("high");
    expect(transaction.policy?.reasons).toContain("mock_address_risk_high");
  });

  it("records approval, mock signing, mock broadcast, settlement, reconciliation, audit, and webhooks", () => {
    const state = createReferenceDemoState();
    const transaction = submitOutgoingPayment(state, {
      walletId: "wallet_001",
      amount: "11000.00",
      destinationAddress: "0x3333333333333333333333333333333333333333"
    });

    const approved = approveOutgoingPayment(state, {
      transactionId: transaction.id,
      adminId: "admin_ref_ops"
    });

    expect(approved.status).toBe("settled");
    expect(approved.approval?.status).toBe("approved");
    expect(approved.mockExecution?.mockTxHash).toContain("0xmock");
    expect(approved.timeline.map((entry) => entry.state)).toEqual(
      expect.arrayContaining(["approved", "mock_signed", "mock_broadcast", "settled"])
    );
    expect(state.wallets[0].balance).toBe("1500.00");
    expect(state.reconciliationReport.items.some((item) => item.transactionId === transaction.id)).toBe(true);
    expect(state.auditEvents.some((event) => event.action === "transaction.approved")).toBe(true);
    expect(state.webhookEvents.some((event) => event.type === "transaction.settled")).toBe(true);
  });

  it("auto-settles a low-risk mock payment without admin approval", () => {
    const state = createReferenceDemoState();

    const transaction = submitOutgoingPayment(state, {
      walletId: "wallet_001",
      amount: "25.00",
      destinationAddress: "0x3333333333333333333333333333333333333333"
    });

    expect(transaction.policy?.required).toBe(false);
    expect(transaction.status).toBe("settled");
    expect(transaction.approval).toBeUndefined();
  });

  it("exposes explicit mock service health metadata", () => {
    expect(createServiceHealth("mock-en3-api")).toEqual({
      service: "mock-en3-api",
      status: "ok",
      mode: "mock",
      noRealFunds: true
    });
  });
});
