import assert from "node:assert/strict";
import { once } from "node:events";
import { createServer } from "../backend/server.js";

const server = createServer();
server.listen(0);
await once(server, "listening");

const { port } = server.address();
const baseUrl = `http://127.0.0.1:${port}`;

async function request(path) {
  const response = await fetch(`${baseUrl}${path}`);
  assert.equal(response.status, 200, `${path} should return 200`);
  const payload = await response.json();
  assert.equal(payload.code, 0, `${path} should use success envelope`);
  return payload.data;
}

try {
  const health = await request("/api/ops/health");
  assert.equal(health.status, "UP");

  const summary = await request("/api/dashboard/summary");
  assert.ok(summary.metrics.length >= 4);
  assert.ok(summary.throughput.length >= 4);

  const dataSources = await request("/api/data-sources");
  assert.ok(dataSources.some((item) => item.type === "Kafka"));

  const workflows = await request("/api/workflows");
  assert.ok(workflows.some((item) => item.status === "published"));

  const jobs = await request("/api/job-instances");
  assert.ok(jobs.some((item) => item.status === "failed"));

  const quality = await request("/api/quality-runs/latest/report");
  assert.ok(quality.score > 0);

  const alerts = await request("/api/alerts");
  assert.ok(alerts.length >= 1);

  const auditLogs = await request("/api/audit-logs");
  assert.ok(auditLogs.length >= 1);

  console.log("API smoke tests passed");
} finally {
  server.close();
}
