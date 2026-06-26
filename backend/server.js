import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { loadPorts, listenFixed } from "../scripts/ports.js";
import {
  authenticate,
  buildLineageImpact,
  buildQualityScore,
  diagnoseEtlFailure,
  estimateQueryCost,
  listSensitiveFields
} from "./governance-intelligence.js";
import {
  abnormalRecords,
  acceptanceChecklist,
  acceptanceCenter,
  alerts,
  assets,
  auditLogs,
  coreFlow,
  dataSources,
  files,
  ingestJobs,
  jobInstances,
  lineage,
  modules,
  pages,
  permissionMatrix,
  productBrief,
  qualityReport,
  qualityRules,
  summary,
  syncJobs,
  transforms,
  workflow,
  workflows
} from "./data.js";

const ports = loadPorts();
const host = process.env.HOST || "127.0.0.1";
const allowedOrigins = new Set([
  `http://127.0.0.1:${ports.webPort}`,
  `http://localhost:${ports.webPort}`,
  `http://127.0.0.1:${ports.previewPort}`,
  `http://localhost:${ports.previewPort}`
]);

function corsHeaders(request) {
  const origin = request.headers.origin;
  return origin && allowedOrigins.has(origin) ? {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Vary": "Origin"
  } : {};
}

function sendJson(request, response, data, statusCode = 200) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...corsHeaders(request)
  });
  response.end(JSON.stringify({ code: 0, message: "ok", data, traceId: `trace-${Date.now()}` }));
}

function sendNotFound(request, response) {
  response.writeHead(404, { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(request) });
  response.end(JSON.stringify({ code: 404, message: "not found", data: null, traceId: `trace-${Date.now()}` }));
}

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function routeApi(request, response, pathname, url) {
  if (pathname === "/api/ops/health" || pathname === "/api/health") {
    sendJson(request, response, {
      status: "UP",
      service: "big-data-processing-platform",
      checks: summary.runtime,
      checkedAt: new Date().toISOString()
    });
    return true;
  }

  if (request.method === "POST" && pathname === "/api/auth/login") {
    try {
      const user = authenticate(await readJson(request));
      if (!user) {
        sendJson(request, response, { success: false, message: "角色、用户名或密码不匹配。" }, 401);
        return true;
      }
      sendJson(request, response, { success: true, user });
      return true;
    } catch (error) {
      sendJson(request, response, { success: false, message: `登录请求格式错误：${error.message}` }, 400);
      return true;
    }
  }

  if (request.method === "GET" && pathname === "/api/governance/lineage-impact") {
    sendJson(request, response, buildLineageImpact(url.searchParams.get("asset") || "ods_order"));
    return true;
  }

  if (request.method === "GET" && pathname === "/api/governance/data-quality-score") {
    sendJson(request, response, buildQualityScore());
    return true;
  }

  if (request.method === "GET" && pathname === "/api/governance/sensitive-fields") {
    sendJson(request, response, listSensitiveFields());
    return true;
  }

  if (request.method === "POST" && pathname === "/api/governance/etl-diagnostics") {
    sendJson(request, response, diagnoseEtlFailure(await readJson(request)));
    return true;
  }

  if (request.method === "POST" && pathname === "/api/governance/query-cost-estimate") {
    sendJson(request, response, estimateQueryCost(await readJson(request)));
    return true;
  }

  const routes = {
    "/api/product/brief": productBrief,
    "/api/product/flow": coreFlow,
    "/api/product/modules": modules,
    "/api/product/pages": pages,
    "/api/dashboard/summary": summary,
    "/api/data-sources": dataSources,
    "/api/ingest-jobs": ingestJobs,
    "/api/sync-jobs": syncJobs,
    "/api/transforms": transforms,
    "/api/workflow/canvas": workflow,
    "/api/workflows": workflows,
    "/api/job-instances": jobInstances,
    "/api/quality-rules": qualityRules,
    "/api/quality-runs/latest/report": qualityReport,
    "/api/abnormal-records": abnormalRecords,
    "/api/data-assets": assets,
    "/api/lineage": lineage,
    "/api/permissions/matrix": permissionMatrix,
    "/api/files": files,
    "/api/alerts": alerts,
    "/api/audit-logs": auditLogs,
    "/api/acceptance/checklist": acceptanceChecklist,
    "/api/acceptance/center": acceptanceCenter
  };

  if (Object.hasOwn(routes, pathname)) {
    sendJson(request, response, routes[pathname]);
    return true;
  }

  if (pathname.startsWith("/api/")) {
    sendNotFound(request, response);
    return true;
  }

  return false;
}

export function createServer() {
  return createHttpServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://localhost");
      if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
        response.writeHead(204, corsHeaders(request));
        response.end();
        return;
      }
      if (await routeApi(request, response, url.pathname, url)) return;
      sendNotFound(request, response);
    } catch (error) {
      response.writeHead(500, { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(request) });
      response.end(JSON.stringify({ code: 500, message: error.message, data: null, traceId: `trace-${Date.now()}` }));
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = createServer();
  listenFixed(server, ports.apiPort, "API", host)
    .then(() => console.log(`API running at http://${host}:${ports.apiPort}`))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
