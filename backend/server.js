import { createReadStream, existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { createServer as createHttpServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import {
  alerts,
  auditLogs,
  dataSources,
  files,
  jobInstances,
  qualityReport,
  qualityRules,
  summary,
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
  ".png": "image/png"
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

function routeApi(request, response, pathname) {
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
    "/api/dashboard/summary": summary,
    "/api/data-sources": dataSources,
    "/api/workflows": workflows,
    "/api/job-instances": jobInstances,
    "/api/quality-rules": qualityRules,
    "/api/quality-runs/latest/report": qualityReport,
    "/api/files": files,
    "/api/alerts": alerts,
    "/api/audit-logs": auditLogs
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
  const roots = safePath.startsWith("/deliverables/") ? [projectRoot] : [frontendRoot];
  const filePath = normalize(join(roots[0], safePath));

  if (!filePath.startsWith(roots[0]) || !existsSync(filePath) || !statSync(filePath).isFile()) {
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
      if (routeApi(request, response, url.pathname)) return;
      await serveStatic(response, url.pathname);
    } catch (error) {
      response.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
      response.end(JSON.stringify({ code: 500, message: error.message, data: null, traceId: `trace-${Date.now()}` }));
    }
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  createServer().listen(port, () => {
    console.log(`Big data processing platform running at http://localhost:${port}`);
  });
}
