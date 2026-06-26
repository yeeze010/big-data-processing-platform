import assert from "node:assert/strict";
import { cp, mkdir, readFile, rm } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const frontend = join(root, "frontend");
const dist = join(root, "dist");

const [html, css, js] = await Promise.all([
  readFile(join(frontend, "index.html"), "utf8"),
  readFile(join(frontend, "styles.css"), "utf8"),
  readFile(join(frontend, "app.js"), "utf8")
]);

for (const marker of ["workflowCanvas", "jobStatusFilter", "qualityTrend", "lineageGraph", "releaseGates", "acceptanceMaterials", "acceptanceRisks", "toast"]) {
  assert.ok(html.includes(marker), `frontend/index.html missing ${marker}`);
}
for (const marker of ["renderWorkflow", "inspectNode", "renderQuality", "renderLineage", "renderReleaseGates", "renderAcceptanceMaterials", "bindInteractions"]) {
  assert.ok(js.includes(marker), `frontend/app.js missing ${marker}`);
}
for (const marker of [".command-layout", ".workflow-canvas", ".quality-grid", ".lineage-graph", ".readiness-grid", ".gate-card", "@media"]) {
  assert.ok(css.includes(marker), `frontend/styles.css missing ${marker}`);
}

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await cp(frontend, dist, { recursive: true });
console.log("Static frontend build passed: dist/");
