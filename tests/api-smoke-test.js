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

async function post(path, body, expectedStatus = 200) {
  const response = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  assert.equal(response.status, expectedStatus, `${path} should return ${expectedStatus}`);
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

  const brief = await request("/api/product/brief");
  assert.equal(brief.name, "华东零售集团数据湖处理平台");
  assert.ok(brief.roles.length >= 6);

  const flow = await request("/api/product/flow");
  assert.ok(flow.some((item) => item.title === "编排工作流"));

  const pages = await request("/api/product/pages");
  assert.ok(pages.some((item) => item.route === "#operations"));

  const dataSources = await request("/api/data-sources");
  assert.ok(dataSources.some((item) => item.type === "Kafka"));

  const ingestJobs = await request("/api/ingest-jobs");
  assert.ok(ingestJobs.some((item) => item.mode === "stream"));

  const syncJobs = await request("/api/sync-jobs");
  assert.ok(syncJobs.some((item) => item.status === "retrying"));

  const transforms = await request("/api/transforms");
  assert.ok(transforms.some((item) => item.rules.includes("敏感字段脱敏")));

  const workflowCanvas = await request("/api/workflow/canvas");
  assert.ok(workflowCanvas.nodes.length >= 6);

  const workflows = await request("/api/workflows");
  assert.ok(workflows.some((item) => item.status === "published"));

  const jobs = await request("/api/job-instances");
  assert.ok(jobs.some((item) => item.status === "failed"));

  const quality = await request("/api/quality-runs/latest/report");
  assert.ok(quality.score > 0);

  const abnormalRecords = await request("/api/abnormal-records");
  assert.ok(abnormalRecords.length >= 1);

  const assets = await request("/api/data-assets");
  assert.ok(assets.some((item) => item.layer === "ADS"));

  const lineage = await request("/api/lineage");
  assert.ok(lineage.edges.length >= 1);

  const permissions = await request("/api/permissions/matrix");
  assert.ok(permissions.some((item) => item.feature === "失败任务重跑"));

  const files = await request("/api/files");
  assert.ok(files.some((item) => item.policy.includes("审计")));

  const alerts = await request("/api/alerts");
  assert.ok(alerts.length >= 1);

  const auditLogs = await request("/api/audit-logs");
  assert.ok(auditLogs.length >= 1);

  const acceptance = await request("/api/acceptance/checklist");
  assert.ok(acceptance.every((item) => item.status === "done"));

  const acceptanceCenter = await request("/api/acceptance/center");
  assert.ok(acceptanceCenter.readiness.length >= 4);
  assert.ok(acceptanceCenter.releaseGates.some((item) => item.status === "warning"));
  assert.ok(acceptanceCenter.materials.some((item) => item.path.includes("local-verification-2026-06-13")));
  assert.ok(acceptanceCenter.risks.length >= 3);

  const login = await post("/api/auth/login", { role: "engineer", username: "engineer", password: "engineer123" });
  assert.equal(login.success, true);
  assert.equal(login.user.role, "engineer");

  const deniedLogin = await post("/api/auth/login", { role: "analyst", username: "engineer", password: "engineer123" }, 401);
  assert.equal(deniedLogin.success, false);

  const qualityScore = await request("/api/governance/data-quality-score");
  assert.ok(qualityScore.score >= 90);
  assert.ok(qualityScore.alerts.length >= 1);

  const lineageImpact = await request("/api/governance/lineage-impact?asset=ods_order");
  assert.ok(lineageImpact.impactedCount >= 2);

  const sensitiveFields = await request("/api/governance/sensitive-fields");
  assert.ok(sensitiveFields.detectedCount >= 4);

  const etlDiagnosis = await post("/api/governance/etl-diagnostics", {
    jobId: "job-20260625-001",
    errorMessage: "unknown column customer_level"
  });
  assert.equal(etlDiagnosis.reasonCode, "schema");
  assert.equal(etlDiagnosis.repairTask.assigneeRole, "engineer");

  const queryCost = await post("/api/governance/query-cost-estimate", {
    sql: "select * from sales_mart.daily_summary join dim_user on id = user_id"
  });
  assert.equal(queryCost.requiresApproval, true);
  assert.equal(queryCost.level, "high");

  console.log("API smoke tests passed");
} finally {
  server.close();
}
