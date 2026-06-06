import assert from "node:assert/strict";
import { createServer as createHttpServer } from "node:http";
import { readFile } from "node:fs/promises";
import { createServer as createApiServer } from "../backend/server.js";
import { createFrontendServer } from "../scripts/frontend-server.js";
import { listenFixed, loadPorts } from "../scripts/ports.js";

const ports = loadPorts();
assert.deepEqual(
  { web: ports.webPort, api: ports.apiPort, preview: ports.previewPort },
  { web: 5214, api: 8214, preview: 6214 }
);
const compose = await readFile("docker-compose.yml", "utf8");
for (const mapping of ["5214:5214", "6214:6214", "8214:8214"]) {
  assert.ok(compose.includes(mapping), `docker-compose.yml missing ${mapping}`);
}
assert.equal((compose.match(/HOST: 0\.0\.0\.0/g) || []).length, 3);

const api = createApiServer();
const web = createFrontendServer();
const preview = createFrontendServer({ preview: true });
await listenFixed(api, ports.apiPort, "API");
await listenFixed(web, ports.webPort, "Frontend");
await listenFixed(preview, ports.previewPort, "Preview");

try {
  const health = await fetch(`http://127.0.0.1:${ports.webPort}/api/ops/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).data.status, "UP");
  assert.equal((await fetch(`http://127.0.0.1:${ports.apiPort}/`)).status, 404);
  assert.equal((await fetch(`http://127.0.0.1:${ports.previewPort}/`)).status, 200);

  const cors = await fetch(`http://127.0.0.1:${ports.apiPort}/api/ops/health`, {
    headers: { Origin: `http://127.0.0.1:${ports.webPort}` }
  });
  assert.equal(cors.headers.get("access-control-allow-origin"), `http://127.0.0.1:${ports.webPort}`);
  const previewCors = await fetch(`http://127.0.0.1:${ports.apiPort}/api/ops/health`, {
    headers: { Origin: `http://127.0.0.1:${ports.previewPort}` }
  });
  assert.equal(previewCors.headers.get("access-control-allow-origin"), `http://127.0.0.1:${ports.previewPort}`);
  const deniedCors = await fetch(`http://127.0.0.1:${ports.apiPort}/api/ops/health`, {
    headers: { Origin: "http://127.0.0.1:9999" }
  });
  assert.equal(deniedCors.headers.get("access-control-allow-origin"), null);

  const occupied = createHttpServer();
  await assert.rejects(() => listenFixed(occupied, ports.webPort, "Conflict test"), /already in use/);
  occupied.close();
  console.log("Fixed ports, proxy, CORS and conflict behavior passed");
} finally {
  api.close();
  web.close();
  preview.close();
}
