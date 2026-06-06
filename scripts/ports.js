import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const portsFile = join(process.cwd(), ".env.ports");

export function loadPorts() {
  if (!existsSync(portsFile)) {
    throw new Error(`Missing required port configuration: ${portsFile}`);
  }

  const values = {};
  for (const rawLine of readFileSync(portsFile, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const separator = line.indexOf("=");
    if (separator < 1) continue;
    values[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }

  const ports = {
    projectName: values.PROJECT_NAME || "big-data-processing-platform",
    webPort: Number(values.WEB_PORT),
    apiPort: Number(values.API_PORT),
    previewPort: Number(values.PREVIEW_PORT),
    apiBaseUrl: values.VITE_API_BASE_URL || `http://127.0.0.1:${values.API_PORT}`
  };

  for (const [key, value] of Object.entries({ webPort: ports.webPort, apiPort: ports.apiPort, previewPort: ports.previewPort })) {
    if (!Number.isInteger(value) || value < 1 || value > 65535) {
      throw new Error(`Invalid ${key} in .env.ports`);
    }
  }

  if (new Set([ports.webPort, ports.apiPort, ports.previewPort]).size !== 3) {
    throw new Error("WEB_PORT, API_PORT and PREVIEW_PORT must be different");
  }
  return ports;
}

export function listenFixed(server, port, label, host = "127.0.0.1") {
  return new Promise((resolve, reject) => {
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE") {
        reject(new Error(`${label} port ${port} is already in use; automatic port switching is disabled`));
        return;
      }
      reject(error);
    });
    server.listen(port, host, resolve);
  });
}
