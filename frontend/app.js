const statusClass = {
  normal: "status-normal",
  warning: "status-warning",
  danger: "status-danger",
  connected: "status-normal",
  running: "status-warning",
  success: "status-normal",
  failed: "status-danger",
  high: "status-danger",
  medium: "status-warning",
  low: "status-normal"
};

async function getData(path) {
  const response = await fetch(path);
  const payload = await response.json();
  if (!response.ok || payload.code !== 0) {
    throw new Error(payload.message || `Request failed: ${path}`);
  }
  return payload.data;
}

function badge(value, key = value) {
  return `<span class="status-pill ${statusClass[key] || ""}">${value}</span>`;
}

function renderMetrics(summary) {
  document.querySelector("#metricsGrid").innerHTML = summary.metrics
    .map(
      (item) => `
        <article class="metric">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
          <small class="${statusClass[item.status]}">${item.trend}</small>
        </article>
      `
    )
    .join("");
}

function renderRuntime(runtime) {
  document.querySelector("#runtimeList").innerHTML = Object.entries(runtime)
    .map(([name, value]) => `<li class="status-row"><span>${name}</span>${badge(value, "normal")}</li>`)
    .join("");
}

function renderThroughput(points) {
  const max = Math.max(...points.map((item) => item.records));
  document.querySelector("#throughputChart").innerHTML = points
    .map((item) => {
      const height = Math.max(12, Math.round((item.records / max) * 160));
      return `
        <div class="bar">
          <div class="bar-fill" style="height:${height}px" title="${item.records} 条"></div>
          <span>${item.time}</span>
        </div>
      `;
    })
    .join("");
}

function renderDataSources(rows) {
  document.querySelector("#dataSourcesTable").innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${row.name}</td>
          <td>${row.type}</td>
          <td>${row.owner}</td>
          <td>${badge(row.status === "connected" ? "已连接" : "需关注", row.status)}</td>
          <td>${row.lastCheckedAt}</td>
        </tr>
      `
    )
    .join("");
}

function renderWorkflows(rows) {
  document.querySelector("#workflowCards").innerHTML = rows
    .map(
      (row) => `
        <article class="card">
          <strong>${row.name}</strong>
          <p>${row.version} / ${row.nodes} 个节点 / ${row.schedule} / ${row.owner}</p>
        </article>
      `
    )
    .join("");
}

function renderJobs(rows) {
  document.querySelector("#jobList").innerHTML = rows
    .map(
      (row) => `
        <li>
          <strong>${row.workflow} ${badge(row.status, row.status)}</strong>
          <p>${row.id} / ${row.startedAt} / ${row.duration} / ${row.output}</p>
        </li>
      `
    )
    .join("");
}

function renderQualityRules(rows) {
  document.querySelector("#qualityRules").innerHTML = rows
    .map(
      (row) => `
        <article class="card">
          <strong>${row.name}</strong>
          <p>${row.target} / ${row.type} / ${row.threshold}</p>
        </article>
      `
    )
    .join("");
}

function renderQualityReport(report) {
  document.querySelector("#qualityScore").textContent = `得分 ${report.score}`;
  document.querySelector("#qualitySamples").innerHTML = report.samples
    .map((item) => `<li class="status-row"><span>${item.field}：${item.failedCount} 条异常</span><span>${item.status}</span></li>`)
    .join("");
}

function renderAlerts(rows) {
  document.querySelector("#alertList").innerHTML = rows
    .map(
      (row) => `
        <li>
          <strong>${row.title} ${badge(row.level, row.level)}</strong>
          <p>${row.source} / ${row.status} / ${row.assignee}</p>
        </li>
      `
    )
    .join("");
}

function renderAudit(rows) {
  document.querySelector("#auditList").innerHTML = rows
    .map(
      (row) => `
        <li>
          <strong>${row.actor}：${row.action}</strong>
          <p>${row.resource} / ${row.result} / ${row.createdAt}</p>
        </li>
      `
    )
    .join("");
}

async function loadDashboard() {
  const [health, summary, dataSources, workflows, jobs, rules, report, alerts, audit] = await Promise.all([
    getData("/api/ops/health"),
    getData("/api/dashboard/summary"),
    getData("/api/data-sources"),
    getData("/api/workflows"),
    getData("/api/job-instances"),
    getData("/api/quality-rules"),
    getData("/api/quality-runs/latest/report"),
    getData("/api/alerts"),
    getData("/api/audit-logs")
  ]);

  document.querySelector("#healthBadge").textContent = health.status === "UP" ? "系统正常" : "系统异常";
  document.querySelector("#healthBadge").className = `status-pill ${health.status === "UP" ? "status-normal" : "status-danger"}`;
  renderMetrics(summary);
  renderRuntime(summary.runtime);
  renderThroughput(summary.throughput);
  renderDataSources(dataSources);
  renderWorkflows(workflows);
  renderJobs(jobs);
  renderQualityRules(rules);
  renderQualityReport(report);
  renderAlerts(alerts);
  renderAudit(audit);
}

document.querySelector("#refreshButton").addEventListener("click", () => {
  loadDashboard().catch((error) => {
    document.querySelector("#healthBadge").textContent = error.message;
    document.querySelector("#healthBadge").className = "status-pill status-danger";
  });
});

loadDashboard();
