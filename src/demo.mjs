import { readFile } from "node:fs/promises";

async function readJson(path) {
  const text = await readFile(new URL(path, import.meta.url), "utf8");
  return JSON.parse(text);
}

function requireItem(items, predicate, label) {
  const item = items.find(predicate);
  if (!item) {
    throw new Error(`Missing demo item: ${label}`);
  }
  return item;
}

const [users, accounts, wallets, transactions, report, auditEvents] = await Promise.all([
  readJson("../mock/core-banking/users.json"),
  readJson("../mock/core-banking/accounts.json"),
  readJson("../mock/en3/wallets.json"),
  readJson("../mock/en3/transactions.json"),
  readJson("../mock/reconciliation/report.json"),
  readJson("../mock/en3/audit-events.json")
]);

const user = requireItem(users, (item) => item.id === "user_001", "core user");
const account = requireItem(accounts, (item) => item.userId === user.id, "core account");
const wallet = requireItem(wallets, (item) => item.ownerId === user.id || item.userId === user.id, "En3 wallet");
const deposit = requireItem(transactions, (item) => item.type === "deposit", "deposit transaction");
const outgoing = requireItem(transactions, (item) => item.type === "withdrawal", "outgoing payment");

const lifecycle = [
  "customer.exists",
  "wallet.created",
  "address.created",
  "deposit.settled",
  "transaction.submitted",
  "transaction.simulated",
  "transaction.requires_approval",
  "transaction.approved",
  "transaction.broadcast",
  "transaction.settled",
  "reconciliation.report_updated",
  "audit.event_recorded"
];

const result = {
  scenario: "bank-stablecoin-wallet",
  customer: {
    id: user.id,
    coreBankingAccountId: account.id
  },
  wallet: {
    id: wallet.id,
    network: wallet.network,
    depositAddress: wallet.depositAddress
  },
  deposit: {
    id: deposit.id,
    amount: deposit.amount,
    status: deposit.status
  },
  outgoingPayment: {
    id: outgoing.id,
    amount: outgoing.amount,
    status: outgoing.status,
    policyResult: outgoing.policyResult
  },
  reconciliation: {
    id: report.id,
    status: report.status,
    itemCount: report.itemCount
  },
  auditEventCount: auditEvents.length,
  lifecycle
};

console.log(JSON.stringify(result, null, 2));
