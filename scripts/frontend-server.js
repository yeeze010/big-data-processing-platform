import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { loadPorts, listenFixed } from "./ports.js";

const ports = loadPorts();
const apiBaseUrl = process.env.API_BASE_URL || ports.apiBaseUrl;
const host = process.env.HOST || "127.0.0.1";
const commandPreview = process.argv.includes("--preview");
const mimeTypes = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8", ".png": "image/png", ".md": "text/markdown; charset=utf-8"
};

function proxyApi(request, response, targetBaseUrl) {
  const target = new URL(request.url || "/", targetBaseUrl);
  const proxyRequest = fetch(target, {
    method: request.method,
    headers: { ...request.headers, host: target.host },
    body: request.method === "GET" || request.method === "HEAD" ? undefined : request,
    duplex: "half"
  });
  proxyRequest.then(async (proxyResponse) => {
    response.writeHead(proxyResponse.status, Object.fromEntries(proxyResponse.headers.entries()));
    response.end(Buffer.from(await proxyResponse.arrayBuffer()));
  }).catch((error) => {
    response.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
    response.end(JSON.stringify({ code: 502, message: `API proxy failed: ${error.message}`, data: null }));
  });
}

function serveStatic(response, pathname, root, preview) {
  const safePath = pathname === "/" ? "/index.html" : pathname;
  const projectRoot = process.cwd();
  const staticRoot = safePath.startsWith("/docs/") || safePath.startsWith("/deliverables/") ? projectRoot : root;
  const filePath = normalize(join(staticRoot, safePath));
  const target = filePath.startsWith(staticRoot) && existsSync(filePath) && statSync(filePath).isFile() ? filePath : join(root, "index.html");
  response.writeHead(200, {
    "Content-Type": mimeTypes[extname(target)] || "application/octet-stream",
    "Cache-Control": preview ? "public, max-age=60" : "no-store"
  });
  createReadStream(target).pipe(response);
}

export function createFrontendServer(options = {}) {
  const preview = options.preview ?? commandPreview;
  const root = join(process.cwd(), preview ? "dist" : "frontend");
  const targetApiBaseUrl = options.apiBaseUrl || apiBaseUrl;
  return createServer((request, response) => {
    const url = new URL(request.url || "/", "http://localhost");
    if (url.pathname.startsWith("/api/")) {
      proxyApi(request, response, targetApiBaseUrl);
      return;
    }
    serveStatic(response, url.pathname, root, preview);
  });
}

if (process.argv[1] && process.argv[1].endsWith("frontend-server.js")) {
  const preview = commandPreview;
  const port = preview ? ports.previewPort : ports.webPort;
  const label = preview ? "Preview" : "Frontend";
  const server = createFrontendServer();
  listenFixed(server, port, label, host)
    .then(() => console.log(`${label} running at http://${host}:${port} -> API ${apiBaseUrl}`))
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
