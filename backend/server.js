import { createServer as createHttpServer } from "node:http";
import { fileURLToPath } from "node:url";
import { loadPorts, listenFixed } from "../scripts/ports.js";
import {
  abnormalRecords,
  acceptanceChecklist,
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

function routeApi(request, response, pathname) {
  if (pathname === "/api/ops/health") {
    sendJson(request, response, {
      status: "UP",
      service: "big-data-processing-platform",
      checks: summary.runtime,
      checkedAt: new Date().toISOString()
    });
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
    "/api/acceptance/checklist": acceptanceChecklist
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
  return createHttpServer((request, response) => {
    try {
      const url = new URL(request.url || "/", "http://localhost");
      if (request.method === "OPTIONS" && url.pathname.startsWith("/api/")) {
        response.writeHead(204, corsHeaders(request));
        response.end();
        return;
      }
      if (routeApi(request, response, url.pathname)) return;
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
