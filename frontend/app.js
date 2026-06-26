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
  acceptance: "/api/acceptance/checklist",
  acceptanceCenter: "/api/acceptance/center"
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
  generatedReports: [],
  workflow: null
};

async function getData(path) {
  const response = await fetch(path);
  const payload = await response.json();
  if (!response.ok || payload.code !== 0) throw new Error(payload.message || `请求失败：${path}`);
  return payload.data;
}

function badge(value, key = value) {
  return `<span class="status-pill ${statusClass[key] || ""}">${statusText[value] || value}</span>`;
}

function card(title, body, meta = "", status = "") {
  return `<article class="mini-card"><div><strong>${title}</strong>${status ? badge(status) : ""}</div><p>${body}</p>${meta ? `<small>${meta}</small>` : ""}</article>`;
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 3200);
}

function nowText() {
  return new Date().toLocaleString("zh-CN", { hour12: false });
}

function setActiveNavByHash(hash) {
  document.querySelectorAll("#mainNav a").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}

function closeNavPanel() {
  const sidebar = document.querySelector(".sidebar");
  const toggle = document.querySelector("#navToggle");
  sidebar.classList.remove("nav-open");
  toggle.setAttribute("aria-expanded", "false");
}

function renderNav(pages) {
  document.querySelector("#mainNav").innerHTML = pages.map((page) => `
    <a href="${page.route}" data-route="${page.route}">
      <strong>${page.name}</strong>
      <small>${page.purpose}</small>
    </a>
  `).join("");

  const currentHash = window.location.hash || pages[0]?.route || "#dashboard";
  setActiveNavByHash(currentHash);

  document.querySelectorAll("#mainNav a").forEach((link) => {
    link.addEventListener("click", () => {
      setActiveNavByHash(link.getAttribute("href"));
      if (window.innerWidth <= 980) closeNavPanel();
    });
  });
}

function renderMetrics(summary) {
  document.querySelector("#metricsGrid").innerHTML = summary.metrics.map((item) => `
    <article class="metric">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <small class="${statusClass[item.status]}">${item.trend}</small>
    </article>
  `).join("");
}

function renderFocusCards(reportMetrics = []) {
  document.querySelector("#focusCards").innerHTML = reportMetrics.map((item) => `
    <article class="focus-card">
      <span>${item.owner}</span>
      <strong>${item.value}</strong>
      <p>${item.name}</p>
    </article>
  `).join("");
}

function renderReadinessCards(readiness = []) {
  document.querySelector("#readinessCards").innerHTML = readiness.map((item) => `
    <article class="readiness-card">
      <span>${item.label}</span>
      <strong>${item.value}</strong>
      <p>${item.detail}</p>
      ${badge(item.status, item.status)}
    </article>
  `).join("");
}

function renderRuntime(runtime) {
  document.querySelector("#runtimeList").innerHTML = Object.entries(runtime).map(([name, value]) => `
    <li><span>${name}</span>${badge(value, "normal")}</li>
  `).join("");
}

function renderThroughput(points) {
  const max = Math.max(...points.map((item) => item.records));
  document.querySelector("#throughputChart").innerHTML = points.map((item) => {
    const height = Math.max(18, Math.round((item.records / max) * 180));
    const failed = Math.max(3, Math.round((item.failed / max) * 180));
    return `
      <div class="bar" title="${item.time}：${item.records.toLocaleString()} 条，失败 ${item.failed} 条">
        <div class="bar-stack" style="height:${height}px"><i style="height:${failed}px"></i></div>
        <span>${item.time}</span>
        <small>${item.records.toLocaleString()}</small>
      </div>
    `;
  }).join("");
}

function renderCoreFlow(flow) {
  document.querySelector("#coreFlow").innerHTML = flow.map((item, index) => `
    <article>
      <b>${String(index + 1).padStart(2, "0")}</b>
      <strong>${item.title}</strong>
      <p>${item.detail}</p>
    </article>
  `).join("");
}

function renderWorkflow(workflow) {
  state.workflow = workflow;
  document.querySelector("#workflowVersion").textContent = `${workflow.name} / ${workflow.version}`;

  const nodes = workflow.nodes.map((node) => `
    <button
      class="workflow-node ${statusClass[node.status] || ""}"
      style="left:${node.x}%;top:${node.y}%;"
      type="button"
      data-node="${node.id}"
      aria-label="${node.label}，${statusText[node.status] || node.status}"
    >
      <strong>${node.label}</strong>
      <span>${node.type}</span>
      ${badge(node.status)}
    </button>
  `).join("");

  const edges = workflow.edges.map(([from, to]) => {
    const source = workflow.nodes.find((item) => item.id === from);
    const target = workflow.nodes.find((item) => item.id === to);
    return `<line x1="${source.x + 5}%" y1="${source.y + 6}%" x2="${target.x + 2}%" y2="${target.y + 6}%" />`;
  }).join("");

  document.querySelector("#workflowCanvas").innerHTML = `<svg aria-hidden="true">${edges}</svg>${nodes}`;
  document.querySelectorAll(".workflow-node").forEach((button) => {
    button.addEventListener("click", () => inspectNode(button.dataset.node));
  });
}

function inspectNode(nodeId) {
  const node = state.workflow.nodes.find((item) => item.id === nodeId);
  const upstream = state.workflow.edges.filter(([, to]) => to === nodeId).length;
  const downstream = state.workflow.edges.filter(([from]) => from === nodeId).length;
  document.querySelectorAll(".workflow-node").forEach((item) => {
    item.classList.toggle("selected", item.dataset.node === nodeId);
  });
  document.querySelector("#nodeInspector").innerHTML = `
    <span>节点检查器</span>
    <strong>${node.label} / ${statusText[node.status]}</strong>
    <p>${node.type}节点，上游 ${upstream} 个，下游 ${downstream} 个。点击其他节点切换查看对象。</p>
  `;
}

function renderDataSources(rows) {
  document.querySelector("#dataSourcesTable").innerHTML = rows.map((row) => `
    <tr data-search="${row.name} ${row.type} ${row.owner}">
      <td><strong>${row.name}</strong><small>${row.id}</small></td>
      <td>${row.type}</td>
      <td>${row.owner}</td>
      <td>${badge(row.status)}</td>
      <td>${row.latency}</td>
      <td>${row.relatedJobs} 个任务</td>
    </tr>
  `).join("");
}

function renderIngestJobs(rows) {
  document.querySelector("#ingestJobs").innerHTML = rows.map((row) => {
    return card(row.name, `${row.source} -> ${row.target}`, `${row.mode} / ${row.schedule} / ${row.owner}`, row.status);
  }).join("");
}

function renderSyncJobs(rows) {
  document.querySelector("#syncJobs").innerHTML = rows.map((row) => {
    return card(row.name, `${row.mode} / ${row.writePolicy}`, `游标：${row.cursorField} ${row.cursorValue}`, row.status);
  }).join("");
}

function renderTransforms(rows) {
  document.querySelector("#transforms").innerHTML = rows.map((row) => {
    return card(row.name, `${row.input} -> ${row.output}`, row.rules.join("、"), row.status);
  }).join("");
}

function renderJobInstances(rows) {
  const filter = document.querySelector("#jobStatusFilter")?.value || "all";
  const visible = filter === "all" ? rows : rows.filter((row) => row.status === filter);
  document.querySelector("#jobCount").textContent = `${visible.length} 个实例`;
  document.querySelector("#jobInstancesTable").innerHTML = visible.map((row) => `
    <tr data-search="${row.id} ${row.workflow} ${row.output}">
      <td><small>${row.id}</small></td>
      <td>${row.workflow}</td>
      <td>${badge(row.status)}</td>
      <td>${row.startedAt}</td>
      <td>${row.duration}</td>
      <td>${row.output}</td>
      <td>${row.retry}</td>
    </tr>
  `).join("");
  renderJobActionOptions(rows);
}

function renderJobActionOptions(rows) {
  const select = document.querySelector("#jobActionInstance");
  const previous = select.value;
  select.innerHTML = rows.map((row) => `<option value="${row.id}">${row.id} / ${statusText[row.status]}</option>`).join("");
  if (rows.some((row) => row.id === previous)) select.value = previous;
}

function renderQuality(rules, report, abnormal) {
  document.querySelector("#qualityScore").textContent = `得分 ${report.score} / 失败 ${report.failedRules} / 预警 ${report.warningRules}`;
  document.querySelector("#qualityTrend").innerHTML = report.trend.map((item) => `
    <div><span style="height:${Math.round(item.score * 1.5)}px"></span><small>${item.day}</small><b>${item.score}</b></div>
  `).join("");
  document.querySelector("#qualitySamples").innerHTML = report.samples.map((item) => `
    <li><span>${item.field}<small>${item.reason}</small></span><strong>${item.failedCount} 条</strong><em>${item.status}</em></li>
  `).join("");
  document.querySelector("#qualityRules").innerHTML = rules.map((row) => {
    return card(row.name, `${row.target} / ${row.type}`, `阈值：${row.threshold}`, row.status);
  }).join("");
  document.querySelector("#abnormalRecords").innerHTML = abnormal.map((row) => {
    return card(`${row.asset}.${row.field}`, `${row.count} 条异常 / ${row.assignee}`, row.action, row.status);
  }).join("");
}

function renderAssets(rows) {
  document.querySelector("#assetCards").innerHTML = rows.map((row) => `
    <article class="asset-card" data-search="${row.name} ${row.owner}">
      <span>${row.layer}</span>
      <strong>${row.name}</strong>
      <p>${row.type} / ${row.fields} 字段 / ${row.owner}</p>
      ${badge(row.sensitivity, row.sensitivity === "敏感" ? "warning" : "normal")}
    </article>
  `).join("");
}

function renderLineage(graph) {
  const positions = {
    erp: [8, 45],
    ods_order: [28, 45],
    dwd_order: [49, 45],
    sales_mart: [71, 45],
    quality: [91, 45]
  };
  const edges = graph.edges.map(([from, to, label]) => {
    const source = positions[from];
    const target = positions[to];
    return `<line x1="${source[0] + 4}%" y1="${source[1] + 4}%" x2="${target[0]}%" y2="${target[1] + 4}%"></line><text x="${(source[0] + target[0]) / 2 + 2}%" y="${source[1] - 2}%">${label}</text>`;
  }).join("");
  const nodes = graph.nodes.map((node) => {
    return `<div class="lineage-node ${node.group}" style="left:${positions[node.id][0]}%;top:${positions[node.id][1]}%;">${node.label}</div>`;
  }).join("");
  document.querySelector("#lineageGraph").innerHTML = `<svg>${edges}</svg>${nodes}`;
}

function renderGovernance(alerts, files, audit, permissions) {
  document.querySelector("#alertList").innerHTML = alerts.map((row) => {
    return card(row.title, `${row.source} / ${row.rule}`, `${row.assignee} / ${statusText[row.status] || row.status}`, row.level);
  }).join("");
  document.querySelector("#fileList").innerHTML = files.map((row) => {
    return card(row.name, `${row.type} / ${row.size}`, `${row.owner} / ${row.policy}`);
  }).join("");
  document.querySelector("#auditList").innerHTML = audit.map((row) => {
    return card(`${row.actor}：${row.action}`, row.resource, `${row.result} / ${row.createdAt}`);
  }).join("");
  document.querySelector("#permissionTable").innerHTML = permissions.map((row) => `
    <tr><td>${row.feature}</td><td>${row.admin}</td><td>${row.engineer}</td><td>${row.analyst}</td><td>${row.ops}</td><td>${row.governance}</td><td>${row.auditor}</td></tr>
  `).join("");
}

function renderAcceptance(rows) {
  document.querySelector("#acceptanceChecklist").innerHTML = rows.map((row) => `
    <li>${badge(row.status)}<span>${row.item}</span><strong>${row.owner}</strong></li>
  `).join("");
}

function renderReleaseGates(rows = []) {
  document.querySelector("#releaseGates").innerHTML = rows.map((row, index) => `
    <article class="gate-card">
      <div>
        <span>${String(index + 1).padStart(2, "0")} / ${row.owner}</span>
        ${badge(row.status, row.status)}
      </div>
      <strong>${row.name}</strong>
      <p>${row.detail}</p>
    </article>
  `).join("");
}

function renderAcceptanceMaterials(rows = []) {
  document.querySelector("#acceptanceMaterials").innerHTML = rows.map((row) => `
    <a class="material-card" href="${row.path}">
      <span>${row.updatedAt}</span>
      <strong>${row.name}</strong>
      <p>${row.note}</p>
      <small>${row.owner}</small>
    </a>
  `).join("");
}

function renderAcceptanceRisks(rows = []) {
  document.querySelector("#acceptanceRisks").innerHTML = rows.map((row) => `
    <article class="risk-card">
      <div>
        <strong>${row.title}</strong>
        ${badge(row.level, row.level)}
      </div>
      <p>${row.detail}</p>
      <small>${row.owner} / ${row.action}</small>
    </article>
  `).join("");
}

function renderSourceRequests() {
  document.querySelector("#sourceRequestList").innerHTML = state.sourceRequests.length
    ? state.sourceRequests.map((row) => card(row.name, `${row.type} / ${row.owner}`, `${row.createdAt} / ${row.note}`, row.status)).join("")
    : `<p class="empty-state">暂无新的接入申请。</p>`;
}

function renderOperationTimeline() {
  document.querySelector("#operationTimeline").innerHTML = state.operationEvents.length
    ? state.operationEvents.slice(0, 5).map((event) => `
        <article><time>${event.time}</time><strong>${event.title}</strong><p>${event.detail}</p></article>
      `).join("")
    : `<p class="empty-state">暂无操作记录。</p>`;
}

function renderGeneratedReports() {
  document.querySelector("#generatedReports").innerHTML = state.generatedReports.length
    ? state.generatedReports.map((row) => card(row.name, `${row.period} / ${row.format}`, `${row.createdAt} / ${row.policy}`, "done")).join("")
    : `<p class="empty-state">暂无本地生成报表。</p>`;
}

function bindInteractions() {
  document.querySelector("#densityButton").addEventListener("click", (event) => {
    const active = document.body.classList.toggle("compact");
    event.currentTarget.setAttribute("aria-pressed", String(active));
    event.currentTarget.textContent = active ? "舒适视图" : "紧凑视图";
  });

  document.querySelector("#jobStatusFilter").addEventListener("change", () => renderJobInstances(state.jobs));

  document.querySelector("#globalSearch").addEventListener("input", (event) => {
    const keyword = event.target.value.trim().toLowerCase();
    document.querySelectorAll("[data-search]").forEach((item) => {
      item.hidden = Boolean(keyword) && !item.dataset.search.toLowerCase().includes(keyword);
    });
  });

  document.querySelector("#sourceRequestForm").addEventListener("submit", (event) => {
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
    showToast(`已提交接入申请：${source.name}`);
  });

  document.querySelector("#taskTransitionForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const job = state.jobs.find((item) => item.id === form.get("jobId"));
    const transitions = {
      retry: { status: "retrying", retry: "手动重试 1/3", title: "已进入重试队列" },
      pause: { status: "pending", retry: "调度暂停，等待恢复", title: "已暂停调度" },
      success: { status: "success", retry: "人工确认完成", title: "已确认成功" }
    };
    const change = transitions[form.get("jobAction")];
    Object.assign(job, change);
    state.operationEvents = [{
      time: nowText(),
      title: `${change.title}：${job.id}`,
      detail: `${job.workflow}，原因：${form.get("jobReason").trim()}`
    }, ...state.operationEvents];
    renderJobInstances(state.jobs);
    renderOperationTimeline();
    event.currentTarget.reset();
    showToast(change.title);
  });

  document.querySelector("#reportCenterForm").addEventListener("submit", (event) => {
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
    showToast(`报表已生成：${report.name}`);
  });

  document.querySelector("#navToggle").addEventListener("click", (event) => {
    const sidebar = document.querySelector(".sidebar");
    const active = sidebar.classList.toggle("nav-open");
    event.currentTarget.setAttribute("aria-expanded", String(active));
  });

  window.addEventListener("hashchange", () => {
    setActiveNavByHash(window.location.hash || "#dashboard");
  });

  window.matchMedia("(min-width: 981px)").addEventListener("change", (event) => {
    if (event.matches) closeNavPanel();
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
    acceptance,
    acceptanceCenter
  ] = await Promise.all([
    api.brief,
    api.pages,
    api.flow,
    api.health,
    api.summary,
    api.sources,
    api.ingest,
    api.sync,
    api.transforms,
    api.workflow,
    api.jobs,
    api.rules,
    api.report,
    api.abnormal,
    api.assets,
    api.lineage,
    api.permissions,
    api.files,
    api.alerts,
    api.audit,
    api.acceptance,
    api.acceptanceCenter
  ].map(getData));

  document.querySelector("#productPositioning").textContent = brief.positioning;
  document.querySelector("#healthBadge").textContent = health.status === "UP" ? "系统正常" : "系统异常";
  document.querySelector("#healthBadge").className = `status-pill ${health.status === "UP" ? "status-normal" : "status-danger"}`;

  state.sources = [...sources];
  state.jobs = [...jobs];

  renderNav(pages);
  renderMetrics(summary);
  renderFocusCards(summary.reportMetrics);
  renderReadinessCards(acceptanceCenter.readiness);
  renderRuntime(summary.runtime);
  renderThroughput(summary.throughput);
  renderCoreFlow(flow);
  renderWorkflow(workflow);
  renderJobInstances(state.jobs);
  renderTransforms(transforms);
  renderQuality(rules, report, abnormal);
  renderAssets(assets);
  renderLineage(lineage);
  renderDataSources(state.sources);
  renderIngestJobs(ingest);
  renderSyncJobs(sync);
  renderGovernance(alerts, files, audit, permissions);
  renderAcceptance(acceptance);
  renderReleaseGates(acceptanceCenter.releaseGates);
  renderAcceptanceMaterials(acceptanceCenter.materials);
  renderAcceptanceRisks(acceptanceCenter.risks);
  renderSourceRequests();
  renderOperationTimeline();
  renderGeneratedReports();
  inspectNode(workflow.nodes.find((node) => node.status === "failed")?.id || workflow.nodes[0].id);
}

document.querySelector("#refreshButton").addEventListener("click", async (event) => {
  event.currentTarget.disabled = true;
  event.currentTarget.textContent = "刷新中";
  try {
    await loadApp();
    showToast("运行数据已刷新");
  } catch (error) {
    showToast(error.message);
  } finally {
    event.currentTarget.disabled = false;
    event.currentTarget.textContent = "刷新运行数据";
  }
});

bindInteractions();
loadApp().catch((error) => showToast(error.message));
