import { spawn } from "node:child_process";
import { loadPorts } from "./ports.js";

const ports = loadPorts();
const children = [
  spawn(process.execPath, ["backend/server.js"], { stdio: "inherit", env: process.env }),
  spawn(process.execPath, ["scripts/frontend-server.js"], { stdio: "inherit", env: process.env })
];

console.log(`Starting ${ports.projectName}: frontend http://127.0.0.1:${ports.webPort}, API http://127.0.0.1:${ports.apiPort}`);

let stopping = false;
function stop(exitCode = 0) {
  if (stopping) return;
  stopping = true;
  for (const child of children) {
    if (!child.killed) child.kill();
  }
  process.exitCode = exitCode;
}

for (const child of children) {
  child.on("exit", (code) => {
    if (!stopping) stop(code || 1);
  });
}
process.on("SIGINT", () => stop(0));
process.on("SIGTERM", () => stop(0));
