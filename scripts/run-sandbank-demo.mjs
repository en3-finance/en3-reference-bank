#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const baseUrl = process.env.EN3_API_BASE_URL;

async function main() {
  const state = baseUrl ? await loadLiveSandboxState(baseUrl) : await loadMockState();
  const customer = state.customer || state.customers[0];
  const wallet = state.wallet || state.wallets.find((item) => item.userId === customer.id) || state.wallets[0];
  const deposit = state.deposit || state.transactions?.find((item) => item.type === "deposit");
  const outgoing = state.outgoingPayment || state.transactions.find((item) => item.type === "outgoing_payment");
  const auditEvents = state.auditEvents || [];
  const webhookEvents = state.webhookEvents || state.webhooks.map((type, index) => ({ id: `wh_${index + 1}`, type, deliveryStatus: "delivered" }));

  console.log("SandBank public boundary");
  console.log("Synthetic demo data only. No production custody, real keys, real RPC, private platform code, partner context, or real customer data.");
  console.log("");
  console.log(`Mode: ${baseUrl ? `live sandbox (${baseUrl})` : "public mock"}`);
  console.log(`SandBank customer: ${customer.displayName} (${customer.id}, ${customer.segment}, ${customer.country})`);
  console.log(`Wallet status: ${wallet.status} ${wallet.asset} on ${wallet.network}; balance ${wallet.balance}`);
  console.log(`Deposit address: ${wallet.depositAddress}`);
  console.log(`Transaction simulation: ${outgoing.simulation.status} - ${outgoing.simulation.result}`);
  console.log(`Approval requirement: ${outgoing.policy.required ? "required" : "not required"} (${outgoing.policy.reasons.join(", ") || "low risk"})`);
  console.log(`Approval action: ${outgoing.approval.status} by ${outgoing.approval.adminId} at ${outgoing.approval.approvedAt}`);
  console.log(`Settlement: ${outgoing.status} at ${outgoing.mockExecution.settledAt}; mock hash ${outgoing.mockExecution.mockTxHash}`);
  const reconciliation = state.reconciliationReport || state.reconciliation;
  const matched = reconciliation.summary?.matched || (reconciliation.status === "matched" ? 1 : 0);
  const totalAmount = reconciliation.summary?.totalAmount || reconciliation.totalAmount;
  const asset = reconciliation.summary?.asset || reconciliation.asset;
  console.log(`Reconciliation report: ${reconciliation.reportId}; ${matched} matched; total ${totalAmount} ${asset}`);
  console.log("");
  console.log("Deposit timeline:");
  for (const entry of deposit?.timeline || []) {
    console.log(`- ${entry.state}: ${entry.summary || ""}`);
  }
  console.log("");
  console.log("Audit timeline:");
  for (const event of auditEvents) {
    console.log(`- ${event.action}: ${event.summary}`);
  }
  console.log("");
  console.log("Webhook timeline:");
  for (const event of webhookEvents) {
    console.log(`- ${event.type}: ${event.deliveryStatus}`);
  }
}

async function loadMockState() {
  const file = path.join(root, "mock", "sandbank", "scenario.json");
  const content = await readFile(file, "utf8");
  return JSON.parse(content);
}

async function loadLiveSandboxState(url) {
  const normalized = url.replace(/\/$/, "");
  const candidates = [`${normalized}/demo/state`, `${normalized}/v1/demo/state`];
  for (const candidate of candidates) {
    try {
      const response = await fetch(candidate, { headers: { accept: "application/json" } });
      if (response.ok) {
        const payload = await response.json();
        return payload.data || payload;
      }
    } catch {
      // Try the next public sandbox-compatible endpoint shape.
    }
  }
  throw new Error("EN3_API_BASE_URL did not expose /demo/state or /v1/demo/state JSON.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : "SandBank demo failed.");
  process.exit(1);
});
