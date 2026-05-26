import cors from "@fastify/cors";
import Fastify from "fastify";
import {
  approveOutgoingPayment,
  createReferenceDemoState,
  createServiceHealth,
  ensureWalletForCustomer,
  submitOutgoingPayment,
  type DemoState
} from "@en3-reference-bank/shared";

const port = Number(process.env.MOCK_EN3_API_PORT || 4101);

interface WalletCreateBody {
  userId: string;
}

interface PaymentCreateBody {
  walletId: string;
  amount: string;
  destinationAddress: string;
  destinationLabel?: string;
}

interface ApprovalBody {
  adminId?: string;
}

export function buildMockEn3ApiServer(initialState?: DemoState) {
  const server = Fastify({ logger: false });
  let state = initialState || createReferenceDemoState();

  server.register(cors, { origin: true });

  server.setErrorHandler((error, _request, reply) => {
    const message = error instanceof Error ? error.message : "Mock En3 API request failed.";
    reply.code(400).send({
      error: "mock_en3_error",
      message,
      mock: true
    });
  });

  server.get("/health", async () => createServiceHealth("mock-en3-api"));

  server.get("/demo/state", async () => ({
    data: state,
    mock: true,
    disclaimer: "Mock En3 sandbox state only; no real funds, custody, signing, or network broadcast."
  }));

  server.post("/demo/reset", async () => {
    state = createReferenceDemoState();
    return {
      data: state,
      mock: true,
      message: "In-memory mock state reset to SandBank scenario."
    };
  });

  server.get("/wallets", async () => ({
    data: state.wallets,
    mock: true
  }));

  server.post<{ Body: WalletCreateBody }>("/wallets", async (request) => {
    const wallet = ensureWalletForCustomer(state, request.body.userId);
    return {
      data: wallet,
      mock: true,
      disclaimer: "Sandbox wallet reference only; no real custody."
    };
  });

  server.get("/transactions", async () => ({
    data: state.transactions,
    mock: true
  }));

  server.post<{ Body: PaymentCreateBody }>("/transactions", async (request, reply) => {
    const transaction = submitOutgoingPayment(state, request.body);
    return reply.code(201).send({
      data: transaction,
      state,
      mock: true,
      disclaimer: "Mock transaction lifecycle only; no real signing or broadcast."
    });
  });

  server.post<{ Params: { transactionId: string }; Body: ApprovalBody }>("/transactions/:transactionId/approve", async (request) => {
    const transaction = approveOutgoingPayment(state, {
      transactionId: request.params.transactionId,
      adminId: request.body?.adminId
    });

    return {
      data: transaction,
      state,
      mock: true,
      disclaimer: "Mock approval and settlement only; no real custody operation."
    };
  });

  server.get("/audit-events", async () => ({
    data: state.auditEvents,
    mock: true
  }));

  server.get("/webhooks", async () => ({
    data: state.webhookEvents,
    mock: true
  }));

  server.get("/reconciliation/report", async () => ({
    data: state.reconciliationReport,
    mock: true,
    disclaimer: "Mock reconciliation report only; no production ledger."
  }));

  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = buildMockEn3ApiServer();
  server.listen({ port, host: "0.0.0.0" }).then(() => {
    console.log(`mock-en3-api listening on http://localhost:${port}`);
  });
}
