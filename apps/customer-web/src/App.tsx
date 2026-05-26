import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  RefreshCw,
  Send,
  ShieldCheck,
  WalletCards,
  Webhook
} from "lucide-react";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import type { DemoState, MockCustomer, Transaction } from "@en3-reference-bank/shared";

const DEFAULT_PAYMENT = {
  amount: "11000.00",
  destinationAddress: "0x9999999999999999999999999999999999999999"
};

interface CoreCustomersResponse {
  data: MockCustomer[];
}

interface En3StateResponse {
  data: DemoState;
}

export function App() {
  const [customers, setCustomers] = useState<MockCustomer[]>([]);
  const [state, setState] = useState<DemoState | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState("user_001");
  const [amount, setAmount] = useState(DEFAULT_PAYMENT.amount);
  const [destinationAddress, setDestinationAddress] = useState(DEFAULT_PAYMENT.destinationAddress);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function loadDemoState() {
    setError(null);
    const [customerResponse, stateResponse] = await Promise.all([
      fetch("/core/customers"),
      fetch("/en3/demo/state")
    ]);

    if (!customerResponse.ok || !stateResponse.ok) {
      throw new Error("Mock services are not available.");
    }

    const customerJson = (await customerResponse.json()) as CoreCustomersResponse;
    const stateJson = (await stateResponse.json()) as En3StateResponse;
    setCustomers(customerJson.data);
    setState(stateJson.data);
  }

  useEffect(() => {
    loadDemoState().catch((requestError: Error) => setError(requestError.message));
  }, []);

  const selectedCustomer = customers.find((customer) => customer.id === selectedCustomerId) || customers[0];
  const selectedWallet = state?.wallets.find((wallet) => wallet.userId === selectedCustomer?.id) || state?.wallets[0];
  const walletTransactions = useMemo(
    () => state?.transactions.filter((transaction) => transaction.walletId === selectedWallet?.id) || [],
    [state, selectedWallet?.id]
  );
  const outgoingTransactions = walletTransactions.filter((transaction) => transaction.type === "outgoing_payment");
  const activeTransaction = outgoingTransactions.at(-1) || walletTransactions.at(-1);
  const pendingApproval = outgoingTransactions.find((transaction) => transaction.status === "approval_required");

  async function submitPayment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedWallet) return;

    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/en3/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          walletId: selectedWallet.id,
          amount,
          destinationAddress,
          destinationLabel: "Mock supplier payout address"
        })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Payment submission failed in mock API.");
      }
      setState(payload.state);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Payment submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function approvePayment(transactionId: string) {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/en3/transactions/${transactionId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId: "admin_ref_ops" })
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Approval failed in mock API.");
      }
      setState(payload.state);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Approval failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function resetDemo() {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/en3/demo/reset", { method: "POST" });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.message || "Reset failed in mock API.");
      }
      setState(payload.data);
      setAmount(DEFAULT_PAYMENT.amount);
      setDestinationAddress(DEFAULT_PAYMENT.destinationAddress);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Reset failed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!state) {
    return (
      <main className="appShell loadingShell">
        <div className="loadingPanel">
          <RefreshCw aria-hidden="true" className="spin" />
          <span>{error || "Loading mock reference demo..."}</span>
        </div>
      </main>
    );
  }

  return (
    <main className="appShell">
      <header className="topbar">
        <div>
          <p className="eyebrow">En3 Reference Bank</p>
          <h1>Stablecoin wallet sandbox</h1>
        </div>
        <div className="topActions">
          <span className="badge">Mock data</span>
          <span className="badge">No real funds</span>
          <button className="iconButton" type="button" onClick={resetDemo} disabled={isSubmitting} aria-label="Reset demo">
            <RefreshCw aria-hidden="true" />
          </button>
        </div>
      </header>

      {error ? <div className="errorBanner">{error}</div> : null}

      <section className="summaryBand" aria-label="Reference scenario summary">
        <Metric label="Wallet balance" value={`${selectedWallet?.balance || "0.00"} ${selectedWallet?.asset || "USDC"}`} />
        <Metric label="Deposit address" value={shortAddress(selectedWallet?.depositAddress)} mono />
        <Metric label="Policy state" value={policyLabel(activeTransaction)} />
        <Metric label="Reconciliation" value={state.reconciliationReport.summary.matched.toString().padStart(2, "0") + " matched"} />
      </section>

      <div className="layoutGrid">
        <aside className="panel sidebarPanel">
          <PanelTitle icon={<WalletCards />} title="Customers" />
          <div className="customerList">
            {customers.map((customer) => (
              <button
                className={customer.id === selectedCustomer?.id ? "customerItem active" : "customerItem"}
                key={customer.id}
                onClick={() => setSelectedCustomerId(customer.id)}
                type="button"
              >
                <span>{customer.displayName}</span>
                <small>{customer.segment.toUpperCase()} / {customer.country}</small>
              </button>
            ))}
          </div>
          <div className="noticeBlock">Public sample customers only. This demo does not contain real bank data.</div>
        </aside>

        <section className="panel walletPanel">
          <PanelTitle icon={<ShieldCheck />} title="Wallet status" />
          <dl className="definitionGrid">
            <div>
              <dt>Customer</dt>
              <dd>{selectedCustomer?.displayName}</dd>
            </div>
            <div>
              <dt>Wallet</dt>
              <dd>{selectedWallet?.id}</dd>
            </div>
            <div>
              <dt>Network</dt>
              <dd>{selectedWallet?.network}</dd>
            </div>
            <div>
              <dt>Address</dt>
              <dd className="monoWrap">{selectedWallet?.depositAddress}</dd>
            </div>
          </dl>
        </section>

        <section className="panel paymentPanel">
          <PanelTitle icon={<Send />} title="Outgoing payment" />
          <form className="paymentForm" onSubmit={submitPayment}>
            <label>
              <span>Amount</span>
              <input value={amount} onChange={(event) => setAmount(event.target.value)} inputMode="decimal" />
            </label>
            <label>
              <span>Destination</span>
              <input value={destinationAddress} onChange={(event) => setDestinationAddress(event.target.value)} />
            </label>
            <button className="primaryButton" type="submit" disabled={isSubmitting}>
              <Send aria-hidden="true" />
              Submit mock payment
            </button>
          </form>

          <div className="policyBox">
            <div className="policyHeader">
              <AlertTriangle aria-hidden="true" />
              <span>{policyLabel(activeTransaction)}</span>
            </div>
            <p>{policyReasons(activeTransaction)}</p>
            {pendingApproval ? (
              <button className="secondaryButton" type="button" onClick={() => approvePayment(pendingApproval.id)} disabled={isSubmitting}>
                <CheckCircle2 aria-hidden="true" />
                Approve mock transaction
              </button>
            ) : null}
          </div>
        </section>

        <section className="panel timelinePanel">
          <PanelTitle icon={<Clock3 />} title="Transaction timeline" />
          <ol className="timeline">
            {(activeTransaction?.timeline || []).map((entry, index) => (
              <li key={`${entry.state}-${entry.at}-${index}`}>
                <span className="timelineDot" />
                <div>
                  <strong>{humanize(entry.state)}</strong>
                  <small>{formatTime(entry.at)}</small>
                  <p>{entry.summary}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="panel reconPanel">
          <PanelTitle icon={<CheckCircle2 />} title="Reconciliation" />
          <div className="reconSummary">
            <span>{state.reconciliationReport.reportId}</span>
            <strong>{state.reconciliationReport.summary.totalAmount} {state.reconciliationReport.summary.asset}</strong>
          </div>
          <div className="tableScroller">
            <table>
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Transaction</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {state.reconciliationReport.items.map((item) => (
                  <tr key={item.transactionId}>
                    <td>{item.coreBankingAccountId}</td>
                    <td>{item.transactionId}</td>
                    <td>{item.amount} {item.asset}</td>
                    <td><span className="statusPill">{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="panel auditPanel">
          <PanelTitle icon={<ShieldCheck />} title="Audit trail" />
          <div className="eventList">
            {state.auditEvents.slice(-8).map((event) => (
              <article key={event.id} className="eventRow">
                <span>{event.action}</span>
                <small>{event.actor} / {formatTime(event.createdAt)}</small>
                <p>{event.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="panel webhookPanel">
          <PanelTitle icon={<Webhook />} title="Webhooks" />
          <div className="eventList">
            {state.webhookEvents.slice(-6).map((event) => (
              <article key={event.id} className="webhookRow">
                <span>{event.type}</span>
                <ArrowRight aria-hidden="true" />
                <small>{event.deliveryStatus}</small>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function PanelTitle({ icon, title }: { icon: ReactNode; title: string }) {
  return (
    <div className="panelTitle">
      <span className="panelIcon">{icon}</span>
      <h2>{title}</h2>
    </div>
  );
}

function Metric({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <article className="metric">
      <span>{label}</span>
      <strong className={mono ? "monoWrap" : undefined}>{value}</strong>
    </article>
  );
}

function policyLabel(transaction?: Transaction) {
  if (!transaction?.policy) return "Deposit lifecycle";
  if (transaction.status === "approval_required") return "Approval required";
  if (transaction.status === "rejected") return "Rejected";
  if (transaction.status === "settled" && transaction.policy.required) return "Approved and settled";
  if (transaction.status === "settled") return "Auto-settled";
  return humanize(transaction.status);
}

function policyReasons(transaction?: Transaction) {
  if (!transaction?.policy) return "Deposit and wallet events are mock sandbox records.";
  if (transaction.status === "rejected") return transaction.simulation?.result || "Rejected by mock simulation.";
  if (transaction.policy.reasons.length === 0) return "No approval required for this mock payment.";
  return transaction.policy.reasons.map(humanize).join(", ");
}

function shortAddress(address?: string) {
  if (!address) return "Not issued";
  return `${address.slice(0, 8)}...${address.slice(-6)}`;
}

function humanize(value: string) {
  return value.replaceAll("_", " ");
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
