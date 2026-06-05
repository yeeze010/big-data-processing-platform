import { createReadStream, existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer as createHttpServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
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

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const projectRoot = normalize(join(__dirname, ".."));
const frontendRoot = join(projectRoot, "frontend");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".md": "text/markdown; charset=utf-8"
};

function sendJson(response, data, statusCode = 200) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  });
  response.end(JSON.stringify({ code: 0, message: "ok", data, traceId: `trace-${Date.now()}` }));
}

function sendNotFound(response) {
  response.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify({ code: 404, message: "not found", data: null, traceId: `trace-${Date.now()}` }));
}

function routeApi(response, pathname) {
  if (pathname === "/api/ops/health") {
    sendJson(response, {
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
    sendJson(response, routes[pathname]);
    return true;
  }

  if (pathname.startsWith("/api/")) {
    sendNotFound(response);
    return true;
  }

  return false;
}

async function serveStatic(response, pathname) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const root = safePath.startsWith("/deliverables/") || safePath.startsWith("/docs/") ? projectRoot : frontendRoot;
  const filePath = normalize(join(root, safePath));

  if (!filePath.startsWith(root) || !existsSync(filePath) || !statSync(filePath).isFile()) {
    const indexHtml = await readFile(join(frontendRoot, "index.html"), "utf8");
    response.writeHead(200, { "Content-Type": mimeTypes[".html"] });
    response.end(indexHtml);
    return;
  }

  response.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
  createReadStream(filePath).pipe(response);
}

export function createServer() {
  return createHttpServer(async (request, response) => {
    try {
      const url = new URL(request.url || "/", "http://localhost");
      if (routeApi(response, url.pathname)) return;
      await serveStatic(response, url.pathname);
    } catch (error) {
      response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ code: 500, message: error.message, data: null, traceId: `trace-${Date.now()}` }));
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const startPort = Number(process.env.PORT || 4173);
  const maxAttempts = 20;

  function listen(port, attempt = 1) {
    const server = createServer();
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE" && attempt < maxAttempts) {
        listen(port + 1, attempt + 1);
        return;
      }

      console.error(`Unable to start server on port ${port}: ${error.message}`);
      process.exitCode = 1;
    });

    server.listen(port, "127.0.0.1", () => {
      console.log(`Big data processing platform running at http://127.0.0.1:${port}`);
    });
  }

  listen(startPort);
}
