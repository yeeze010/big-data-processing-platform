const api = {
  brief: "/api/product/brief",
  flow: "/api/product/flow",
  pages: "/api/product/pages",
  summary: "/api/dashboard/summary",
  health: "/api/ops/health",
  sources: "/api/data-sources",
  ingest: "/api/ingest-jobs",
  sync: "/api/sync-jobs",
  transforms: "/api/transforms",
  workflow: "/api/workflow/canvas",
  jobs: "/api/job-instances",
  rules: "/api/quality-rules",
  report: "/api/quality-runs/latest/report",
  abnormal: "/api/abnormal-records",
  assets: "/api/data-assets",
  lineage: "/api/lineage",
  permissions: "/api/permissions/matrix",
  files: "/api/files",
  alerts: "/api/alerts",
  audit: "/api/audit-logs",
  acceptance: "/api/acceptance/checklist"
};

const statusText = {
  normal: "正常",
  warning: "关注",
  danger: "高风险",
  connected: "已连接",
  running: "运行中",
  success: "成功",
  failed: "失败",
  retrying: "重试中",
  pending: "等待",
  published: "已发布",
  draft: "草稿",
  enabled: "启用",
  high: "高",
  medium: "中",
  low: "低",
  open: "待处理",
  acknowledged: "已确认",
  done: "完成"
};

const statusClass = {
  normal: "status-normal",
  connected: "status-normal",
  success: "status-normal",
  published: "status-normal",
  enabled: "status-normal",
  done: "status-normal",
  low: "status-normal",
  warning: "status-warning",
  running: "status-warning",
  retrying: "status-warning",
  draft: "status-warning",
  medium: "status-warning",
  acknowledged: "status-warning",
  pending: "status-muted",
  danger: "status-danger",
  failed: "status-danger",
  high: "status-danger",
  open: "status-danger"
};

const state = {
  sources: [],
  jobs: [],
  sourceRequests: [],
  operationEvents: [],
  generatedReports: []
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
  return `<span class="status-pill ${statusClass[key] || ""}">${statusText[value] || value}</span>`;
}

function card(title, body, meta = "", status = "") {
  return `<article class="mini-card">
    <div>${status ? badge(status, status) : ""}<strong>${title}</strong></div>
    <p>${body}</p>
    ${meta ? `<small>${meta}</small>` : ""}
  </article>`;
}

function renderNav(pages) {
  document.querySelector("#mainNav").innerHTML = pages.map((page, index) => `<a href="${page.route}" class="${index === 0 ? "active" : ""}">${page.name}</a>`).join("");
  document.querySelectorAll("#mainNav a").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll("#mainNav a").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function renderMetrics(summary) {
  document.querySelector("#metricsGrid").innerHTML = summary.metrics
    .map((item) => `<article class="metric"><span>${item.label}</span><strong>${item.value}</strong><small class="${statusClass[item.status]}">${item.trend}</small></article>`)
    .join("");
}

function renderRuntime(runtime) {
  document.querySelector("#runtimeList").innerHTML = Object.entries(runtime)
    .map(([name, value]) => `<li><span>${name}</span>${badge(value, "normal")}</li>`)
    .join("");
}

function renderThroughput(points) {
  const max = Math.max(...points.map((item) => item.records));
  document.querySelector("#throughputChart").innerHTML = points
    .map((item) => {
      const height = Math.max(16, Math.round((item.records / max) * 180));
      const failHeight = Math.max(3, Math.round((item.failed / max) * 180));
      return `<div class="bar"><div class="bar-stack" style="height:${height}px"><i style="height:${failHeight}px"></i></div><span>${item.time}</span><small>${item.records.toLocaleString()}</small></div>`;
    })
    .join("");
}

function renderCoreFlow(flow) {
  document.querySelector("#coreFlow").innerHTML = flow.map((item, index) => `<article><b>${index + 1}</b><strong>${item.title}</strong><p>${item.detail}</p></article>`).join("");
}

function renderDataSources(rows) {
  document.querySelector("#dataSourcesTable").innerHTML = rows
    .map((row) => `<tr><td><strong>${row.name}</strong><small>${row.id}</small></td><td>${row.type}</td><td>${row.owner}</td><td>${badge(row.status, row.status)}</td><td>${row.latency}</td><td>${row.relatedJobs} 个任务</td></tr>`)
    .join("");
}

function renderSourceRequests() {
  const target = document.querySelector("#sourceRequestList");
  if (!target) return;
  target.innerHTML = state.sourceRequests.length
    ? state.sourceRequests.map((row) => card(row.name, `${row.type} / ${row.owner}`, `${row.createdAt} / ${row.note}`, row.status)).join("")
    : `<p class="empty-state">暂无新的接入申请。</p>`;
}

function renderIngestJobs(rows) {
  document.querySelector("#ingestJobs").innerHTML = rows.map((row) => card(row.name, `${row.source} -> ${row.target}`, `${row.mode} / ${row.schedule} / ${row.owner}`, row.status)).join("");
}

function renderSyncJobs(rows) {
  document.querySelector("#syncJobs").innerHTML = rows.map((row) => card(row.name, `${row.mode} / ${row.writePolicy}`, `游标：${row.cursorField} ${row.cursorValue}`, row.status)).join("");
}

function renderTransforms(rows) {
  document.querySelector("#transforms").innerHTML = rows.map((row) => card(row.name, `${row.input} -> ${row.output}`, row.rules.join("、"), row.status)).join("");
}

function renderWorkflow(workflow) {
  document.querySelector("#workflowVersion").textContent = `${workflow.name} / ${workflow.version}`;
  const nodes = workflow.nodes
    .map((node) => `<button class="workflow-node ${statusClass[node.status] || ""}" style="left:${node.x}%;top:${node.y}%;" type="button" data-node="${node.id}"><strong>${node.label}</strong><span>${node.type}</span>${badge(node.status, node.status)}</button>`)
    .join("");
  const edges = workflow.edges
    .map(([from, to]) => {
      const a = workflow.nodes.find((item) => item.id === from);
      const b = workflow.nodes.find((item) => item.id === to);
      return `<line x1="${a.x + 5}%" y1="${a.y + 6}%" x2="${b.x + 2}%" y2="${b.y + 6}%" />`;
    })
    .join("");
  document.querySelector("#workflowCanvas").innerHTML = `<svg aria-hidden="true">${edges}</svg>${nodes}`;
}

function renderJobInstances(rows) {
  document.querySelector("#jobInstancesTable").innerHTML = rows
    .map((row) => `<tr><td>${row.id}</td><td>${row.workflow}</td><td>${badge(row.status, row.status)}</td><td>${row.startedAt}</td><td>${row.duration}</td><td>${row.output}</td><td>${row.retry}</td></tr>`)
    .join("");
  renderJobActionOptions(rows);
}

function renderJobActionOptions(rows) {
  const select = document.querySelector("#jobActionInstance");
  if (!select) return;
  const currentValue = select.value;
  select.innerHTML = rows.map((row) => `<option value="${row.id}">${row.id} / ${row.workflow} / ${statusText[row.status] || row.status}</option>`).join("");
  if (currentValue && rows.some((row) => row.id === currentValue)) {
    select.value = currentValue;
  }
}

function renderQuality(rules, report, abnormal) {
  document.querySelector("#qualityScore").textContent = `得分 ${report.score} / 失败 ${report.failedRules} / 预警 ${report.warningRules}`;
  const max = 100;
  document.querySelector("#qualityTrend").innerHTML = report.trend.map((item) => `<div><span style="height:${Math.round((item.score / max) * 150)}px"></span><small>${item.day}</small><b>${item.score}</b></div>`).join("");
  document.querySelector("#qualitySamples").innerHTML = report.samples.map((item) => `<li><span>${item.field}<small>${item.reason}</small></span><strong>${item.failedCount} 条</strong><em>${item.status}</em></li>`).join("");
  document.querySelector("#qualityRules").innerHTML = rules.map((row) => card(row.name, `${row.target} / ${row.type}`, `阈值：${row.threshold}`, row.status)).join("");
  document.querySelector("#abnormalRecords").innerHTML = abnormal.map((row) => card(`${row.asset}.${row.field}`, `${row.count} 条异常 / ${row.assignee}`, row.action, row.status)).join("");
}

function renderAssets(rows) {
  document.querySelector("#assetCards").innerHTML = rows
    .map((row) => `<article class="asset-card"><span>${row.layer}</span><strong>${row.name}</strong><p>${row.type} / ${row.fields} 字段 / ${row.owner}</p>${badge(row.sensitivity, row.sensitivity === "敏感" ? "warning" : "normal")}</article>`)
    .join("");
}

function renderLineage(graph) {
  const positions = { erp: [4, 45], ods_order: [25, 45], dwd_order: [47, 45], sales_mart: [70, 45], quality: [90, 45] };
  const edges = graph.edges
    .map(([from, to, label]) => {
      const a = positions[from];
      const b = positions[to];
      return `<line x1="${a[0] + 4}%" y1="${a[1] + 4}%" x2="${b[0]}%" y2="${b[1] + 4}%"></line><text x="${(a[0] + b[0]) / 2 + 2}%" y="${a[1] - 2}%">${label}</text>`;
    })
    .join("");
  const nodes = graph.nodes.map((node) => `<div class="lineage-node ${node.group}" style="left:${positions[node.id][0]}%;top:${positions[node.id][1]}%;">${node.label}</div>`).join("");
  document.querySelector("#lineageGraph").innerHTML = `<svg>${edges}</svg>${nodes}`;
}

function renderGovernance(alerts, files, audit, permissions) {
  document.querySelector("#alertList").innerHTML = alerts.map((row) => card(row.title, `${row.source} / ${row.rule}`, `${row.assignee} / ${statusText[row.status] || row.status}`, row.level)).join("");
  document.querySelector("#fileList").innerHTML = files.map((row) => card(row.name, `${row.type} / ${row.size}`, `${row.owner} / ${row.policy}`)).join("");
  document.querySelector("#auditList").innerHTML = audit.map((row) => card(`${row.actor}：${row.action}`, row.resource, `${row.result} / ${row.createdAt}`)).join("");
  document.querySelector("#permissionTable").innerHTML = permissions
    .map((row) => `<tr><td>${row.feature}</td><td>${row.admin}</td><td>${row.engineer}</td><td>${row.analyst}</td><td>${row.ops}</td><td>${row.governance}</td><td>${row.auditor}</td></tr>`)
    .join("");
}

function renderAcceptance(rows) {
  document.querySelector("#acceptanceChecklist").innerHTML = rows.map((row) => `<li>${badge(row.status, row.status)}<span>${row.item}</span><strong>${row.owner}</strong></li>`).join("");
}

function renderOperationTimeline() {
  const target = document.querySelector("#operationTimeline");
  if (!target) return;
  target.innerHTML = state.operationEvents.length
    ? state.operationEvents.map((event) => `<article><time>${event.time}</time><strong>${event.title}</strong><p>${event.detail}</p></article>`).join("")
    : `<p class="empty-state">暂无操作记录，执行任务状态流转后会出现在这里。</p>`;
}

function renderGeneratedReports() {
  const target = document.querySelector("#generatedReports");
  if (!target) return;
  target.innerHTML = state.generatedReports.length
    ? state.generatedReports.map((row) => card(row.name, `${row.period} / ${row.format}`, `${row.createdAt} / ${row.policy}`, "done")).join("")
    : `<p class="empty-state">暂无本地生成报表。</p>`;
}

function nowText() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

function bindOperationForms() {
  document.querySelector("#sourceRequestForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const source = {
      id: `ds-local-${Date.now()}`,
      name: form.get("sourceName").trim(),
      type: form.get("sourceType"),
      owner: form.get("sourceOwner").trim(),
      status: "pending",
      latency: "待连通",
      relatedJobs: 0,
      createdAt: nowText(),
      note: "等待连通性测试与权限审批"
    };
    state.sources = [source, ...state.sources];
    state.sourceRequests = [source, ...state.sourceRequests];
    renderDataSources(state.sources);
    renderSourceRequests();
    event.currentTarget.reset();
  });

  document.querySelector("#taskTransitionForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const jobId = form.get("jobId");
    const action = form.get("jobAction");
    const reason = form.get("jobReason").trim();
    const job = state.jobs.find((item) => item.id === jobId);
    if (!job) return;

    const transitions = {
      retry: { status: "retrying", retry: "手动重试 1/3", title: "已进入重试队列" },
      pause: { status: "pending", retry: "调度暂停，等待恢复", title: "已暂停调度" },
      success: { status: "success", retry: "人工确认完成", title: "已人工确认成功" }
    };
    Object.assign(job, transitions[action]);
    state.operationEvents = [{
      time: nowText(),
      title: `${transitions[action].title}：${job.id}`,
      detail: `${job.workflow}，原因：${reason}`
    }, ...state.operationEvents];

    renderJobInstances(state.jobs);
    renderOperationTimeline();
    event.currentTarget.reset();
  });

  document.querySelector("#reportCenterForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const report = {
      name: form.get("reportType"),
      period: form.get("reportPeriod"),
      format: "xlsx",
      createdAt: nowText(),
      policy: "已登记到附件清单，保留 180 天"
    };
    state.generatedReports = [report, ...state.generatedReports];
    renderGeneratedReports();
  });
}

async function loadApp() {
  const [
    brief,
    pages,
    flow,
    health,
    summary,
    sources,
    ingest,
    sync,
    transforms,
    workflow,
    jobs,
    rules,
    report,
    abnormal,
    assets,
    lineage,
    permissions,
    files,
    alerts,
    audit,
    acceptance
  ] = await Promise.all([
    getData(api.brief),
    getData(api.pages),
    getData(api.flow),
    getData(api.health),
    getData(api.summary),
    getData(api.sources),
    getData(api.ingest),
    getData(api.sync),
    getData(api.transforms),
    getData(api.workflow),
    getData(api.jobs),
    getData(api.rules),
    getData(api.report),
    getData(api.abnormal),
    getData(api.assets),
    getData(api.lineage),
    getData(api.permissions),
    getData(api.files),
    getData(api.alerts),
    getData(api.audit),
    getData(api.acceptance)
  ]);

  document.querySelector("#productPositioning").textContent = brief.positioning;
  document.querySelector("#healthBadge").textContent = health.status === "UP" ? "系统正常" : "系统异常";
  document.querySelector("#healthBadge").className = `status-pill ${health.status === "UP" ? "status-normal" : "status-danger"}`;
  renderNav(pages);
  renderMetrics(summary);
  renderRuntime(summary.runtime);
  renderThroughput(summary.throughput);
  renderCoreFlow(flow);
  renderDataSources(sources);
  state.sources = [...sources];
  state.jobs = [...jobs];
  renderSourceRequests();
  renderOperationTimeline();
  renderGeneratedReports();
  renderIngestJobs(ingest);
  renderSyncJobs(sync);
  renderTransforms(transforms);
  renderWorkflow(workflow);
  renderJobInstances(jobs);
  renderQuality(rules, report, abnormal);
  renderAssets(assets);
  renderLineage(lineage);
  renderGovernance(alerts, files, audit, permissions);
  renderAcceptance(acceptance);
}

document.querySelector("#refreshButton").addEventListener("click", () => {
  loadApp().catch((error) => {
    document.querySelector("#healthBadge").textContent = error.message;
    document.querySelector("#healthBadge").className = "status-pill status-danger";
  });
});

loadApp();
bindOperationForms();
