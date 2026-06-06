import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { loadPorts } from "../scripts/ports.js";

const ports = loadPorts();
const processes = [
  spawn(process.execPath, ["backend/server.js"], { stdio: ["ignore", "pipe", "pipe"] }),
  spawn(process.execPath, ["scripts/frontend-server.js"], { stdio: ["ignore", "pipe", "pipe"] }),
  spawn(process.execPath, ["scripts/frontend-server.js", "--preview"], { stdio: ["ignore", "pipe", "pipe"] })
];

function waitForOutput(child, expected) {
  return new Promise((resolve, reject) => {
    let output = "";
    const timer = setTimeout(() => reject(new Error(`Timed out waiting for: ${expected}\n${output}`)), 8000);
    const collect = (chunk) => {
      output += chunk.toString();
      if (output.includes(expected)) {
        clearTimeout(timer);
        resolve();
      }
    };
    child.stdout.on("data", collect);
    child.stderr.on("data", collect);
    child.once("exit", (code) => {
      clearTimeout(timer);
      reject(new Error(`Process exited with ${code}: ${output}`));
    });
  });
}

try {
  await Promise.all([
    waitForOutput(processes[0], `API running at http://127.0.0.1:${ports.apiPort}`),
    waitForOutput(processes[1], `Frontend running at http://127.0.0.1:${ports.webPort}`),
    waitForOutput(processes[2], `Preview running at http://127.0.0.1:${ports.previewPort}`)
  ]);

  const [web, api, preview, proxied] = await Promise.all([
    fetch(`http://127.0.0.1:${ports.webPort}/`),
    fetch(`http://127.0.0.1:${ports.apiPort}/api/ops/health`),
    fetch(`http://127.0.0.1:${ports.previewPort}/`),
    fetch(`http://127.0.0.1:${ports.webPort}/api/ops/health`)
  ]);
  assert.equal(web.status, 200);
  assert.equal(api.status, 200);
  assert.equal(preview.status, 200);
  assert.equal(proxied.status, 200);
  console.log("Fixed startup services passed on 5214, 6214 and 8214");
} finally {
  for (const child of processes) child.kill();
}
