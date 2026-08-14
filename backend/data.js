export const productBrief = {
  name: "多源异构大数据处理与质量治理平台",
  tagline: "面向业务数据库、日志、文件和接口数据的一体化处理工作台",
  positioning:
    "围绕制造企业生产、采购、质量和设备数据的数据源接入、ETL 清洗、质量规则、血缘追踪、任务调度和治理审批构建独立产品，用于支撑生产日报、质量追溯、库存协同和经营分析。",
  roles: [
    { name: "平台管理员", goal: "维护租户、用户、角色、菜单和系统参数", scope: "全局配置、授权、审计查看" },
    { name: "数据工程师", goal: "接入数据源并编排处理任务", scope: "数据源、采集同步、工作流、任务重跑" },
    { name: "数据治理专员", goal: "维护质量规则、异常数据和资产目录", scope: "质量、异常、资产、血缘" },
    { name: "业务分析师", goal: "查看数据资产、指标报表和处理产物", scope: "资产查看、报表查看、文件下载" },
    { name: "运维工程师", goal: "监控调度队列、失败任务、容量和告警", scope: "调度、告警、系统监控" },
    { name: "审计员", goal: "追踪数据访问、导出和权限变更", scope: "只读审计、审计导出" }
  ]
};

export const summary = {
  projectName: "多源异构大数据处理与质量治理平台",
  environment: "多源数据处理 / V1.0",
  metrics: [
    { label: "今日生产明细", value: "1,286,437", trend: "+12.4%", status: "normal" },
    { label: "调度成功率", value: "98.7%", trend: "+1.8%", status: "normal" },
    { label: "质量规则通过率", value: "96.2%", trend: "-0.6%", status: "warning" },
    { label: "待处理告警", value: "7", trend: "3 高优先级", status: "danger" },
    { label: "登记数据资产", value: "428", trend: "+26 本周", status: "normal" },
    { label: "血缘关系", value: "1,936", trend: "字段级 1,284", status: "normal" }
  ],
  runtime: {
    api: "正常",
    scheduler: "正常",
    database: "正常",
    cache: "正常",
    objectStorage: "正常",
    workflowWorker: "正常"
  },
  throughput: [
    { time: "08:00", records: 142000, failed: 230 },
    { time: "10:00", records: 188000, failed: 198 },
    { time: "12:00", records: 201000, failed: 176 },
    { time: "14:00", records: 236000, failed: 244 },
    { time: "16:00", records: 219000, failed: 221 },
    { time: "18:00", records: 300400, failed: 316 }
  ],
  reportMetrics: [
    { name: "生产主题域日处理量", value: "82.4 万", owner: "生产分析组" },
    { name: "设备运行特征数", value: "126 项", owner: "设备数据组" },
    { name: "异常样本待复核", value: "431 条", owner: "质量治理组" },
    { name: "敏感资产下载", value: "12 次", owner: "审计组" }
  ]
};

export const coreFlow = [
  { id: "source", title: "登记业务数据源", detail: "保存数据库、文件、消息队列和接口数据的连接配置及负责人" },
  { id: "ingest", title: "配置采集/同步", detail: "全量、增量、断点续传、字段映射、目标写入策略" },
  { id: "transform", title: "清洗转换聚合", detail: "标准化、去重、空值处理、脱敏、聚合指标" },
  { id: "workflow", title: "编排工作流", detail: "DAG 节点、依赖、参数、版本、发布校验" },
  { id: "schedule", title: "调度运行", detail: "Cron、手动触发、补数、失败重试、节点日志" },
  { id: "quality", title: "质量与异常", detail: "质量规则、报告、异常样本、派单复核关闭" },
  { id: "asset", title: "资产与血缘", detail: "资产目录、标签、字段、上下游影响分析" },
  { id: "audit", title: "告警与审计", detail: "告警升级、文件下载、权限变更、操作留痕" }
];

export const modules = [
  { name: "数据源管理", status: "已演示", description: "关系库、消息队列、对象存储、API 数据源接入与连通性状态。" },
  { name: "采集任务", status: "已演示", description: "批量采集、API 拉取、Kafka 订阅、文件上传、增量字段配置。" },
  { name: "同步任务", status: "已演示", description: "全量同步、增量同步、断点续传、写入策略和同步校验。" },
  { name: "清洗转换聚合", status: "已演示", description: "字段标准化、类型转换、空值处理、去重、脱敏与指标聚合。" },
  { name: "工作流编排", status: "已演示", description: "可视化 DAG 画布、依赖关系、节点参数、发布版本。" },
  { name: "任务调度", status: "已演示", description: "Cron、手动触发、补数、暂停、终止、失败重试。" },
  { name: "数据质量", status: "已演示", description: "规则、阈值、质量分、异常字段、趋势和报告入口。" },
  { name: "异常数据", status: "已演示", description: "异常样本、问题池、派单、处理、复核、关闭。" },
  { name: "数据资产目录", status: "已演示", description: "表、字段、标签、分层、负责人、生命周期。" },
  { name: "血缘关系", status: "已演示", description: "表级血缘、字段级血缘、影响分析和上游追踪。" },
  { name: "权限审计", status: "已演示", description: "角色权限、数据范围、数据访问、导出和权限变更日志。" },
  { name: "操作中心", status: "已演示", description: "数据源接入申请、任务状态流转、报表生成和操作时间线。" }
];

export const pages = [
  { name: "总览看板", route: "#dashboard", purpose: "指标、吞吐、健康、待办与验收状态" },
  { name: "数据接入", route: "#sources", purpose: "数据源、采集任务、同步任务统一入口" },
  { name: "操作中心", route: "#operations", purpose: "可操作表单、状态流转、报表生成和操作留痕" },
  { name: "处理编排", route: "#pipeline", purpose: "清洗转换、DAG 编排、调度实例、失败重试" },
  { name: "质量治理", route: "#quality", purpose: "质量规则、质量报告、异常数据闭环" },
  { name: "资产血缘", route: "#assets", purpose: "资产目录、字段、标签、血缘关系" },
  { name: "告警审计", route: "#governance", purpose: "告警规则、通知、审计日志、权限矩阵" },
  { name: "验收清单", route: "#acceptance", purpose: "测试、部署、GitHub、里程碑和验收标准" }
];

export const dataSources = [
  { id: "ds-mes-postgres", name: "MES 生产库 PostgreSQL", type: "PostgreSQL", owner: "数据工程组", status: "connected", latency: "38ms", lastCheckedAt: "2026-06-05 09:20", relatedJobs: 6 },
  { id: "ds-wms-mysql", name: "WMS 仓储库 MySQL", type: "MySQL", owner: "供应链数据组", status: "connected", latency: "45ms", lastCheckedAt: "2026-06-05 09:18", relatedJobs: 4 },
  { id: "ds-device-kafka", name: "设备遥测 Kafka", type: "Kafka", owner: "平台运维组", status: "warning", latency: "消费延迟 12m", lastCheckedAt: "2026-06-05 09:15", relatedJobs: 3 },
  { id: "ds-qc-minio", name: "质检附件 MinIO", type: "S3/MinIO", owner: "质量数据组", status: "connected", latency: "31ms", lastCheckedAt: "2026-06-05 09:12", relatedJobs: 5 }
];

export const ingestJobs = [
  { id: "ingest-mes-production", name: "生产工单增量采集", source: "MES 生产库 PostgreSQL", target: "ods_production_order", mode: "incremental", schedule: "*/15 * * * *", status: "running", owner: "数据工程组" },
  { id: "ingest-device-event", name: "设备遥测事件订阅", source: "设备遥测 Kafka", target: "ods_device_event", mode: "stream", schedule: "always-on", status: "warning", owner: "平台运维组" },
  { id: "ingest-qc-file", name: "质检附件文件采集", source: "质检附件 MinIO", target: "ods_qc_attachment", mode: "batch", schedule: "0 1 * * *", status: "success", owner: "质量数据组" }
];

export const syncJobs = [
  { id: "sync-customer", name: "客户主数据同步", mode: "incremental", cursorField: "updated_at", cursorValue: "2026-06-05 08:55:00", writePolicy: "upsert", status: "success" },
  { id: "sync-product", name: "商品维表全量同步", mode: "full", cursorField: "-", cursorValue: "-", writePolicy: "truncate_insert", status: "success" },
  { id: "sync-payment", name: "支付流水断点恢复", mode: "incremental", cursorField: "pay_time", cursorValue: "2026-06-05 07:40:18", writePolicy: "append", status: "retrying" }
];

export const transforms = [
  { id: "tf-sale-clean", name: "POS 销售清洗标准化", input: "ods_pos_sale", output: "dwd_sale_clean", rules: ["空值处理", "金额类型转换", "门店编码映射"], status: "published" },
  { id: "tf-member-feature", name: "会员画像特征聚合", input: "ods_store_event", output: "dws_member_feature", rules: ["事件去重", "7日行为聚合", "敏感字段脱敏"], status: "published" },
  { id: "tf-factory-mart", name: "产线交付指标宽表聚合", input: "dwd_production_clean", output: "factory_mart.daily_summary", rules: ["车间聚合", "工单聚合", "停机扣减"], status: "draft" }
];

export const workflow = {
  id: "wf-factory-production-governance",
  name: "生产主题域治理工作流",
  version: "v0.5.0",
  status: "published",
  nodes: [
    { id: "n1", label: "生产工单采集", type: "采集", x: 6, y: 42, status: "success" },
    { id: "n2", label: "物料主数据同步", type: "同步", x: 26, y: 18, status: "success" },
    { id: "n3", label: "生产明细清洗", type: "清洗", x: 26, y: 62, status: "success" },
    { id: "n4", label: "产线指标聚合", type: "聚合", x: 48, y: 42, status: "running" },
    { id: "n5", label: "质量规则检测", type: "质量", x: 70, y: 42, status: "failed" },
    { id: "n6", label: "资产登记/血缘更新", type: "资产", x: 90, y: 42, status: "pending" }
  ],
  edges: [
    ["n1", "n3"],
    ["n2", "n4"],
    ["n3", "n4"],
    ["n4", "n5"],
    ["n5", "n6"]
  ]
};

export const workflows = [
  { id: "wf-factory-production-governance", name: "生产主题域治理工作流", version: "v0.5.0", status: "published", schedule: "0 2 * * *", nodes: 6, owner: "数据工程组" },
  { id: "wf-device-health", name: "设备运行状态增量构建", version: "v0.3.0", status: "published", schedule: "*/30 * * * *", nodes: 8, owner: "设备数据组" },
  { id: "wf-quality-sync", name: "数据质量巡检任务", version: "v0.2.0", status: "published", schedule: "0 */4 * * *", nodes: 4, owner: "质量治理组" }
];

export const jobInstances = [
  { id: "job-20260605-001", workflow: "生产主题域治理工作流", status: "success", duration: "18m 42s", startedAt: "2026-06-05 02:00", output: "factory_mart.daily_summary", retry: "无" },
  { id: "job-20260605-002", workflow: "设备运行状态增量构建", status: "running", duration: "11m 08s", startedAt: "2026-06-05 09:00", output: "device_mart.health_features", retry: "无" },
  { id: "job-20260605-003", workflow: "数据质量巡检任务", status: "failed", duration: "03m 16s", startedAt: "2026-06-05 08:00", output: "quality/report/20260605-0800", retry: "可重跑失败节点" },
  { id: "job-20260605-004", workflow: "支付流水断点恢复", status: "retrying", duration: "06m 33s", startedAt: "2026-06-05 08:40", output: "ods_payment", retry: "第 2/3 次" }
];

export const qualityRules = [
  { id: "qr-order-null", name: "订单主键非空", target: "ods_order.id", type: "not_null", threshold: "0", status: "enabled" },
  { id: "qr-user-phone", name: "手机号格式校验", target: "dim_user.phone", type: "regex", threshold: ">= 99%", status: "enabled" },
  { id: "qr-sales-drift", name: "销售额波动阈值", target: "sales_mart.amount", type: "variance", threshold: "<= 15%", status: "enabled" },
  { id: "qr-ref-integrity", name: "订单客户引用完整性", target: "dwd_order_clean.customer_id", type: "reference", threshold: ">= 99.5%", status: "enabled" }
];

export const qualityReport = {
  id: "quality-report-20260605",
  score: 96.2,
  passedRules: 28,
  failedRules: 2,
  warningRules: 3,
  trend: [
    { day: "06-01", score: 97.6 },
    { day: "06-02", score: 96.8 },
    { day: "06-03", score: 97.1 },
    { day: "06-04", score: 95.9 },
    { day: "06-05", score: 96.2 }
  ],
  samples: [
    { field: "dim_user.phone", failedCount: 412, owner: "业务分析组", status: "待确认", reason: "格式不符合手机号规则" },
    { field: "sales_mart.amount", failedCount: 19, owner: "数据工程组", status: "处理中", reason: "日环比波动超过 15%" }
  ]
};

export const abnormalRecords = [
  { id: "abn-001", asset: "dim_user", field: "phone", count: 412, assignee: "业务分析组", status: "待确认", action: "核对源系统格式" },
  { id: "abn-002", asset: "sales_mart.daily_summary", field: "amount", count: 19, assignee: "数据工程组", status: "处理中", action: "检查退款抵扣规则" },
  { id: "abn-003", asset: "ods_payment", field: "pay_time", count: 7, assignee: "平台运维组", status: "复核中", action: "确认断点恢复批次" }
];

export const assets = [
  { id: "asset-ods-order", name: "ods_order", layer: "ODS", type: "table", owner: "数据工程组", fields: 42, sensitivity: "内部", status: "active" },
  { id: "asset-dwd-order", name: "dwd_order_clean", layer: "DWD", type: "table", owner: "数据工程组", fields: 56, sensitivity: "敏感", status: "active" },
  { id: "asset-dws-user", name: "dws_user_feature", layer: "DWS", type: "table", owner: "算法数据组", fields: 126, sensitivity: "敏感", status: "active" },
  { id: "asset-sales", name: "sales_mart.daily_summary", layer: "ADS", type: "table", owner: "业务分析组", fields: 31, sensitivity: "内部", status: "active" }
];

export const lineage = {
  nodes: [
    { id: "erp", label: "ERP MySQL", group: "source" },
    { id: "ods_order", label: "ods_order", group: "ods" },
    { id: "dwd_order", label: "dwd_order_clean", group: "dwd" },
    { id: "sales_mart", label: "sales_mart.daily_summary", group: "ads" },
    { id: "quality", label: "质量报告", group: "governance" }
  ],
  edges: [
    ["erp", "ods_order", "采集"],
    ["ods_order", "dwd_order", "清洗"],
    ["dwd_order", "sales_mart", "聚合"],
    ["sales_mart", "quality", "检测"]
  ]
};

export const permissionMatrix = [
  { feature: "数据源新增/编辑", admin: "读写", engineer: "读写", analyst: "无", ops: "只读", governance: "只读", auditor: "只读" },
  { feature: "工作流发布", admin: "读写", engineer: "读写", analyst: "无", ops: "只读", governance: "只读", auditor: "只读" },
  { feature: "失败任务重跑", admin: "读写", engineer: "读写", analyst: "无", ops: "读写", governance: "只读", auditor: "只读" },
  { feature: "质量异常关闭", admin: "读写", engineer: "只读", analyst: "只读", ops: "只读", governance: "读写", auditor: "只读" },
  { feature: "敏感文件下载", admin: "读写", engineer: "审批后", analyst: "审批后", ops: "审批后", governance: "审批后", auditor: "只读" },
  { feature: "权限变更审计", admin: "只读", engineer: "无", analyst: "无", ops: "无", governance: "只读", auditor: "只读" }
];

export const files = [
  { id: "file-quality-report", name: "质量巡检报告-20260605.xlsx", type: "质量报告", size: "1.8 MB", owner: "质量治理组", policy: "敏感下载审计" },
  { id: "file-task-log", name: "job-20260605-003.log", type: "任务日志", size: "420 KB", owner: "平台运维组", policy: "7 天保留" },
  { id: "file-lineage", name: "sales_mart_lineage.json", type: "血缘快照", size: "86 KB", owner: "数据工程组", policy: "版本保留" },
  { id: "file-acceptance", name: "验收清单-v1.0.0.xlsx", type: "验收附件", size: "220 KB", owner: "项目组", policy: "长期归档" }
];

export const alerts = [
  { id: "alert-001", level: "high", title: "Kafka 消费延迟超过阈值", source: "实时事件 Kafka", status: "open", assignee: "平台运维组", rule: "延迟超过 10 分钟" },
  { id: "alert-002", level: "medium", title: "数据质量通过率低于 97%", source: "质量巡检任务", status: "acknowledged", assignee: "质量治理组", rule: "质量分 < 97" },
  { id: "alert-003", level: "low", title: "对象存储容量达到 72%", source: "MinIO", status: "open", assignee: "平台运维组", rule: "容量 > 70%" },
  { id: "alert-004", level: "high", title: "敏感资产批量下载", source: "文件资产库", status: "open", assignee: "审计组", rule: "10 分钟内下载超过 5 个敏感文件" }
];

export const auditLogs = [
  { id: "audit-001", actor: "admin", action: "发布工作流", resource: "销售主题域治理工作流", result: "success", createdAt: "2026-06-05 08:45" },
  { id: "audit-002", actor: "data_engineer", action: "重跑任务实例", resource: "job-20260605-003", result: "success", createdAt: "2026-06-05 08:52" },
  { id: "audit-003", actor: "auditor", action: "导出审计日志", resource: "sys_audit_log", result: "success", createdAt: "2026-06-05 09:01" },
  { id: "audit-004", actor: "analyst", action: "下载敏感质量报告", resource: "质量巡检报告-20260605.xlsx", result: "success", createdAt: "2026-06-05 09:08" }
];

export const acceptanceChecklist = [
  { item: "项目定位、角色、核心流程已独立定义", owner: "产品", status: "done" },
  { item: "数据源、采集、同步、清洗转换、编排、调度已可视化演示", owner: "前端/后端", status: "done" },
  { item: "任务状态、失败重试、质量报告、异常数据已展示", owner: "工程", status: "done" },
  { item: "可操作表单、任务状态流转、报表生成中心已实现", owner: "产品/前端", status: "done" },
  { item: "资产目录、血缘关系、权限审计已展示", owner: "治理", status: "done" },
  { item: "Git/GitHub、测试、部署、验收、里程碑文档已落盘", owner: "项目经理", status: "done" },
  { item: "本地 API 冒烟测试通过", owner: "测试", status: "done" }
];

export const acceptanceCenter = {
  readiness: [
    { id: "build", label: "静态构建", value: "通过", detail: "dist 产物已生成，可固定端口预览", status: "done" },
    { id: "api", label: "接口冒烟", value: "通过", detail: "核心 20+ 接口与健康检查返回正常", status: "done" },
    { id: "visual", label: "视觉验收", value: "通过", detail: "桌面端与 390px 移动端无横向溢出", status: "done" },
    { id: "docs", label: "验收材料", value: "待归档", detail: "补齐 2026-06-13 本地验证记录后可关闭", status: "warning" }
  ],
  releaseGates: [
    { name: "构建与启动入口", owner: "工程", status: "done", detail: "npm start、build、preview 均存在，固定端口契约已定义" },
    { name: "核心业务闭环", owner: "产品/前端", status: "done", detail: "接入、编排、质量、资产、审计、验收中心均有页面入口" },
    { name: "交互可操作性", owner: "前端", status: "done", detail: "接入申请、任务状态流转、报表生成均可在本地触发并反馈" },
    { name: "验收材料归档", owner: "项目经理", status: "warning", detail: "需要同步本轮验证记录与 README 链接，避免入口失效" }
  ],
  materials: [
    { name: "本地运行手册", path: "/docs/local-runbook.md", owner: "工程", updatedAt: "2026-06-13", note: "启动方式、固定地址、停止服务说明" },
    { name: "测试计划", path: "/docs/test/test-plan.md", owner: "测试", updatedAt: "2026-06-05", note: "测试范围、命令与预期结果" },
    { name: "本地验证记录", path: "/docs/test/local-verification-2026-06-13.md", owner: "测试", updatedAt: "2026-06-13", note: "本轮构建、冒烟、视觉与风险结论" },
    { name: "验收标准", path: "/docs/acceptance/acceptance-criteria.md", owner: "产品", updatedAt: "2026-06-05", note: "验收口径、边界与退出条件" }
  ],
  risks: [
    { title: "演示数据未持久化", level: "medium", owner: "前端", detail: "接入申请、状态流转和报表生成仅在当前会话内保留。", action: "README 与验收记录中明确标注为 MVP 约束。" },
    { title: "未接入真实调度引擎", level: "medium", owner: "后端", detail: "任务实例与工作流状态来自内置演示数据。", action: "下一阶段接入真实执行器或增加模拟回放脚本。" },
    { title: "权限规则为展示态", level: "low", owner: "产品/后端", detail: "权限矩阵可查看，但未接真实登录鉴权。", action: "后续补 SSO、角色权限校验与审计存储。" }
  ]
};
