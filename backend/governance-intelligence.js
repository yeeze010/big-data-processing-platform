export const users = [
  { id: "U-001", role: "admin", username: "admin", password: "admin123", name: "平台管理员" },
  { id: "U-002", role: "engineer", username: "engineer", password: "engineer123", name: "数据工程师" },
  { id: "U-003", role: "analyst", username: "analyst", password: "analyst123", name: "数据分析师" },
  { id: "U-004", role: "governance", username: "governor", password: "governor123", name: "数据治理专员" },
  { id: "U-005", role: "ops", username: "ops", password: "ops123", name: "运维工程师" },
  { id: "U-006", role: "auditor", username: "auditor", password: "auditor123", name: "审计员" }
];

export const rolePermissions = {
  admin: ["source:manage", "job:manage", "quality:manage", "lineage:view", "audit:view", "query:approve"],
  engineer: ["source:manage", "job:manage", "quality:view", "lineage:view"],
  analyst: ["asset:view", "query:estimate", "report:view"],
  governance: ["quality:manage", "lineage:view", "sensitive:review", "audit:view"],
  ops: ["job:rerun", "alert:manage", "lineage:view"],
  auditor: ["audit:view", "lineage:view", "sensitive:view"]
};

const fieldProfiles = [
  { asset: "dim_user", field: "phone", category: "mobile", sensitivity: "P2", confidence: 0.98, sample: "138****9120", action: "导出时默认脱敏" },
  { asset: "dim_user", field: "id_card", category: "id_card", sensitivity: "P3", confidence: 0.96, sample: "320***********2218", action: "禁止明文下载" },
  { asset: "dwd_order_clean", field: "amount", category: "financial", sensitivity: "P1", confidence: 0.88, sample: "1280.50", action: "按部门授权查看" },
  { asset: "dws_user_feature", field: "address", category: "address", sensitivity: "P2", confidence: 0.91, sample: "上海市***路", action: "报表聚合后展示" }
];

const qualityDimensions = [
  { dimension: "完整性", score: 94, issueCount: 412, suggestion: "补充 dim_user.phone 源端格式校验。" },
  { dimension: "唯一性", score: 99, issueCount: 12, suggestion: "保留订单主键去重规则。" },
  { dimension: "准确性", score: 93, issueCount: 19, suggestion: "复核退款抵扣规则导致的销售额波动。" },
  { dimension: "及时性", score: 97, issueCount: 7, suggestion: "支付流水同步任务保持断点续传。" },
  { dimension: "波动性", score: 90, issueCount: 31, suggestion: "对销售额环比超过 15% 的分区开启二次抽检。" }
];

const lineageGraph = {
  erp: ["ods_order"],
  ods_order: ["dwd_order_clean"],
  dwd_order_clean: ["sales_mart.daily_summary"],
  "sales_mart.daily_summary": ["quality-report", "finance-dashboard"],
  dim_user: ["dws_user_feature", "customer-profile-report"],
  dws_user_feature: ["recommendation-model", "customer-profile-report"]
};

export function authenticate({ role, username, password }) {
  const user = users.find((candidate) =>
    candidate.role === role &&
    candidate.username === username &&
    candidate.password === password
  );
  if (!user) return null;
  return {
    id: user.id,
    role: user.role,
    username: user.username,
    name: user.name,
    permissions: rolePermissions[user.role] ?? []
  };
}

export function buildLineageImpact(assetId = "ods_order") {
  const visited = new Set();
  const queue = [{ id: assetId, depth: 0, path: [assetId] }];
  const impacted = [];
  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current.id)) continue;
    visited.add(current.id);
    if (current.id !== assetId) impacted.push(current);
    for (const next of lineageGraph[current.id] ?? []) {
      queue.push({ id: next, depth: current.depth + 1, path: [...current.path, next] });
    }
  }
  return {
    assetId,
    impactedCount: impacted.length,
    impactedAssets: impacted,
    recommendation: impacted.length > 0
      ? "建议暂停下游导出任务，并通知对应资产负责人复核。"
      : "当前资产没有登记下游影响范围。"
  };
}

export function buildQualityScore() {
  const score = qualityDimensions.reduce((sum, item) => sum + item.score, 0) / qualityDimensions.length;
  return {
    dataset: "sales_mart.daily_summary",
    score,
    level: score >= 95 ? "healthy" : score >= 90 ? "watch" : "risk",
    dimensions: qualityDimensions,
    alerts: qualityDimensions
      .filter((item) => item.score < 95)
      .map((item) => ({ dimension: item.dimension, message: item.suggestion }))
  };
}

export function diagnoseEtlFailure(body = {}) {
  const message = `${body.errorMessage ?? ""} ${body.lastLog ?? ""}`.toLowerCase();
  const reasons = [
    { key: "connection", label: "数据源连接失败", match: ["timeout", "connection", "econnreset"], action: "检查数据源网络、账号有效期和连接池配置。" },
    { key: "schema", label: "字段结构变更", match: ["column", "schema", "字段", "unknown"], action: "重新探查源表字段，并生成映射变更审批。" },
    { key: "format", label: "数据格式异常", match: ["parse", "invalid", "format", "json"], action: "抽样异常记录，补充格式清洗规则。" },
    { key: "resource", label: "计算资源不足", match: ["memory", "cpu", "quota", "disk"], action: "提高任务资源配额或拆分分区执行。" }
  ];
  const hit = reasons.find((reason) => reason.match.some((word) => message.includes(word))) ?? reasons[2];
  return {
    jobId: body.jobId ?? "job-unknown",
    reasonCode: hit.key,
    reason: hit.label,
    confidence: hit.key === "format" && !message ? 0.62 : 0.86,
    rerunAdvice: hit.action,
    repairTask: {
      title: `修复任务：${hit.label}`,
      assigneeRole: hit.key === "resource" ? "ops" : "engineer",
      priority: hit.key === "schema" ? "P0" : "P1"
    }
  };
}

export function estimateQueryCost(body = {}) {
  const sql = `${body.sql ?? ""}`.toLowerCase();
  const hasPartition = /where\s+.*(dt|date|day)\s*[=<>]/.test(sql);
  const hasLimit = /\blimit\s+\d+/.test(sql);
  const joinCount = (sql.match(/\bjoin\b/g) ?? []).length;
  const fullScanRisk = sql.includes("select *") && !hasPartition;
  const estimatedRows = fullScanRisk ? 86000000 : hasPartition ? 3200000 : 18000000;
  const costScore = Math.min(100, Math.round(estimatedRows / 1000000 + joinCount * 12 + (hasLimit ? 0 : 8)));
  return {
    estimatedRows,
    costScore,
    level: costScore >= 80 ? "high" : costScore >= 40 ? "medium" : "low",
    requiresApproval: costScore >= 80,
    suggestions: [
      !hasPartition ? "增加日期或分区过滤条件。" : null,
      sql.includes("select *") ? "只选择业务需要的字段，避免 select *。" : null,
      joinCount >= 2 ? "检查多表 join 是否可以使用宽表或预聚合资产。" : null,
      !hasLimit ? "探索性查询建议先加 limit。" : null
    ].filter(Boolean)
  };
}

export function listSensitiveFields() {
  return {
    detectedCount: fieldProfiles.length,
    fields: fieldProfiles,
    exportPolicy: "P2 及以上字段导出需要审批，P3 字段默认禁止明文下载。"
  };
}
