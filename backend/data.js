export const summary = {
  projectName: "企业级大数据处理平台",
  environment: "MVP",
  metrics: [
    { label: "今日处理记录", value: "1,286,400", trend: "+12.4%", status: "normal" },
    { label: "任务成功率", value: "98.7%", trend: "+1.8%", status: "normal" },
    { label: "质量通过率", value: "96.2%", trend: "-0.6%", status: "warning" },
    { label: "待处理告警", value: "7", trend: "3 高优先级", status: "danger" }
  ],
  runtime: {
    api: "正常",
    scheduler: "正常",
    database: "正常",
    cache: "正常",
    objectStorage: "正常"
  },
  throughput: [
    { time: "08:00", records: 142000, failed: 230 },
    { time: "10:00", records: 188000, failed: 198 },
    { time: "12:00", records: 201000, failed: 176 },
    { time: "14:00", records: 236000, failed: 244 },
    { time: "16:00", records: 219000, failed: 221 },
    { time: "18:00", records: 300400, failed: 316 }
  ]
};

export const dataSources = [
  { id: "ds-postgres-core", name: "核心业务 PostgreSQL", type: "PostgreSQL", owner: "数据工程组", status: "connected", lastCheckedAt: "2026-06-02 18:20" },
  { id: "ds-mysql-erp", name: "ERP MySQL", type: "MySQL", owner: "业务分析组", status: "connected", lastCheckedAt: "2026-06-02 18:18" },
  { id: "ds-kafka-event", name: "实时事件 Kafka", type: "Kafka", owner: "平台运维组", status: "warning", lastCheckedAt: "2026-06-02 18:15" },
  { id: "ds-minio-files", name: "文件资产 MinIO", type: "S3/MinIO", owner: "数据工程组", status: "connected", lastCheckedAt: "2026-06-02 18:12" }
];

export const workflows = [
  { id: "wf-daily-sales", name: "销售主题域日批处理", version: "v0.3.0", status: "published", schedule: "0 2 * * *", nodes: 6, owner: "数据工程组" },
  { id: "wf-user-profile", name: "用户画像增量构建", version: "v0.2.1", status: "draft", schedule: "*/30 * * * *", nodes: 8, owner: "算法数据组" },
  { id: "wf-quality-sync", name: "数据质量巡检任务", version: "v0.1.5", status: "published", schedule: "0 */4 * * *", nodes: 4, owner: "质量治理组" }
];

export const jobInstances = [
  { id: "job-20260602-001", workflow: "销售主题域日批处理", status: "success", duration: "18m 42s", startedAt: "2026-06-02 02:00", output: "sales_mart.daily_summary" },
  { id: "job-20260602-002", workflow: "用户画像增量构建", status: "running", duration: "11m 08s", startedAt: "2026-06-02 18:00", output: "profile.user_features" },
  { id: "job-20260602-003", workflow: "数据质量巡检任务", status: "failed", duration: "03m 16s", startedAt: "2026-06-02 16:00", output: "quality/report/20260602-1600" }
];

export const qualityRules = [
  { id: "qr-order-null", name: "订单主键非空", target: "ods_order.id", type: "not_null", threshold: "0", status: "enabled" },
  { id: "qr-user-phone", name: "手机号格式校验", target: "dim_user.phone", type: "regex", threshold: ">= 99%", status: "enabled" },
  { id: "qr-sales-drift", name: "销售额波动阈值", target: "sales_mart.amount", type: "variance", threshold: "<= 15%", status: "enabled" }
];

export const qualityReport = {
  id: "quality-report-20260602",
  score: 96.2,
  passedRules: 28,
  failedRules: 2,
  samples: [
    { field: "dim_user.phone", failedCount: 412, owner: "业务分析组", status: "待确认" },
    { field: "sales_mart.amount", failedCount: 19, owner: "数据工程组", status: "处理中" }
  ]
};

export const files = [
  { id: "file-quality-report", name: "质量巡检报告-20260602.xlsx", type: "report", size: "1.8 MB", owner: "质量治理组" },
  { id: "file-task-log", name: "job-20260602-003.log", type: "log", size: "420 KB", owner: "平台运维组" },
  { id: "file-delivery-doc", name: "项目交付文档包.docx", type: "deliverable", size: "43 KB", owner: "项目组" }
];

export const alerts = [
  { id: "alert-001", level: "high", title: "Kafka 消费延迟超过阈值", source: "实时事件 Kafka", status: "open", assignee: "平台运维组" },
  { id: "alert-002", level: "medium", title: "数据质量通过率低于 97%", source: "质量巡检任务", status: "acknowledged", assignee: "质量治理组" },
  { id: "alert-003", level: "low", title: "对象存储容量达到 72%", source: "MinIO", status: "open", assignee: "平台运维组" }
];

export const auditLogs = [
  { id: "audit-001", actor: "admin", action: "发布工作流", resource: "销售主题域日批处理", result: "success", createdAt: "2026-06-02 17:45" },
  { id: "audit-002", actor: "data_engineer", action: "重跑任务实例", resource: "job-20260602-003", result: "success", createdAt: "2026-06-02 17:52" },
  { id: "audit-003", actor: "auditor", action: "导出审计日志", resource: "sys_audit_log", result: "success", createdAt: "2026-06-02 18:01" }
];
