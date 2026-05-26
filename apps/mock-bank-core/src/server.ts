import cors from "@fastify/cors";
import Fastify from "fastify";
import { createReferenceDemoState, createServiceHealth } from "@en3-reference-bank/shared";

const port = Number(process.env.MOCK_BANK_CORE_PORT || 4100);

export function buildMockBankCoreServer() {
  const server = Fastify({ logger: false });
  const state = createReferenceDemoState();

  server.register(cors, { origin: true });

  server.get("/health", async () => createServiceHealth("mock-bank-core"));

  server.get("/customers", async () => ({
    data: state.customers,
    mock: true,
    disclaimer: "Public mock core-banking customers only; no real customer data."
  }));

  server.get<{ Params: { userId: string } }>("/customers/:userId", async (request, reply) => {
    const customer = state.customers.find((item) => item.id === request.params.userId);
    if (!customer) {
      return reply.code(404).send({
        error: "mock_customer_not_found",
        message: "The requested mock customer does not exist."
      });
    }

    return {
      data: customer,
      accounts: state.accounts.filter((account) => account.userId === customer.id),
      mock: true
    };
  });

  server.get<{ Querystring: { userId?: string } }>("/accounts", async (request) => {
    const accounts = request.query.userId
      ? state.accounts.filter((account) => account.userId === request.query.userId)
      : state.accounts;

    return {
      data: accounts,
      mock: true,
      disclaimer: "Public mock core-banking accounts only."
    };
  });

  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const server = buildMockBankCoreServer();
  server.listen({ port, host: "0.0.0.0" }).then(() => {
    console.log(`mock-bank-core listening on http://localhost:${port}`);
  });
}
