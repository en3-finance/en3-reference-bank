import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import test from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

test("reference bank demo runs end to end", async () => {
  const { stdout } = await execFileAsync("node", ["src/demo.mjs"], {
    cwd: new URL("..", import.meta.url)
  });
  const result = JSON.parse(stdout);

  assert.equal(result.scenario, "bank-stablecoin-wallet");
  assert.equal(result.outgoingPayment.status, "settled");
  assert.equal(result.outgoingPayment.policyResult, "approval_required");
  assert.equal(result.reconciliation.status, "matched");
  assert.ok(result.lifecycle.includes("transaction.requires_approval"));
  assert.ok(result.lifecycle.includes("audit.event_recorded"));
});
