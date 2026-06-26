import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { createServer as createApiServer } from "../backend/server.js";
import { createFrontendServer } from "../scripts/frontend-server.js";

async function loadChromium() {
  try {
    return (await import("playwright")).chromium;
  } catch {
    const pnpmRoot = join(homedir(), ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", ".pnpm");
    if (!existsSync(pnpmRoot)) throw new Error("Playwright is unavailable. Install playwright to run visual QA.");
    const packageDir = (await readdir(pnpmRoot)).find((name) => name.startsWith("playwright-core@"));
    if (!packageDir) throw new Error("playwright-core is unavailable. Install playwright to run visual QA.");
    const entry = join(pnpmRoot, packageDir, "node_modules", "playwright-core", "index.mjs");
    return (await import(pathToFileURL(entry).href)).chromium;
  }
}

const chromium = await loadChromium();
const browserCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"
];
const executablePath = browserCandidates.find(existsSync);
const apiServer = createApiServer();
await new Promise((resolve, reject) => {
  apiServer.once("error", reject);
  apiServer.listen(0, "127.0.0.1", resolve);
});
const apiPort = apiServer.address().port;
const frontendServer = createFrontendServer({ apiBaseUrl: `http://127.0.0.1:${apiPort}` });
await new Promise((resolve, reject) => {
  frontendServer.once("error", reject);
  frontendServer.listen(0, "127.0.0.1", resolve);
});
const baseUrl = `http://127.0.0.1:${frontendServer.address().port}`;
const outputDir = "tests/screenshots";
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true, executablePath });
const errors = [];

try {
  const desktop = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  desktop.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await desktop.goto(baseUrl, { waitUntil: "networkidle" });
  await desktop.screenshot({ path: `${outputDir}/console-desktop.png`, fullPage: true });
  await desktop.screenshot({ path: `${outputDir}/console-desktop-viewport.png` });

  assert.equal(await desktop.locator("h1").textContent(), "运行控制中心");
  assert.ok(await desktop.locator(".workflow-node").count() >= 6);
  assert.ok(await desktop.locator(".metric").count() >= 6);
  assert.ok(await desktop.locator(".lineage-node").count() >= 5);
  assert.ok(await desktop.locator(".readiness-card").count() >= 4);
  assert.ok(await desktop.locator(".gate-card").count() >= 4);

  await desktop.locator(".workflow-node").filter({ hasText: "质量规则检测" }).click();
  assert.ok((await desktop.locator("#nodeInspector").innerText()).includes("质量规则检测"));

  await desktop.locator("#jobStatusFilter").selectOption("failed");
  assert.equal(await desktop.locator("#jobInstancesTable tr").count(), 1);

  await desktop.locator("#densityButton").click();
  assert.equal(await desktop.locator("body").getAttribute("class"), "compact");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(baseUrl, { waitUntil: "networkidle" });
  await mobile.screenshot({ path: `${outputDir}/console-mobile.png`, fullPage: true });
  await mobile.screenshot({ path: `${outputDir}/console-mobile-viewport.png` });
  assert.equal(await mobile.locator("h1").textContent(), "运行控制中心");
  assert.ok(await mobile.locator("#mainNav a").count() >= 7);
  assert.ok(await mobile.locator(".readiness-card").count() >= 4);
  assert.equal(await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true);

  assert.deepEqual(errors, []);
  console.log(`Visual QA passed: ${baseUrl}`);
} finally {
  await browser.close();
  apiServer.close();
  frontendServer.close();
}
