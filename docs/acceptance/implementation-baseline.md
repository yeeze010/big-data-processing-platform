# 当前实现基线（2026-06-05）

## 1. 目的

本文用于区分 `big-data-processing-platform` 当前已经落地、可运行、可验证的能力，以及后续需要接入真实存储和执行引擎后才能进入生产验收的能力。

## 2. 已实现并可本地验证

### 2.1 后端 API

当前 `backend/server.js` 提供以下演示接口：

| 路径 | 状态 | 说明 |
|---|---|---|
| `/api/ops/health` | 已实现 | 服务健康检查 |
| `/api/product/brief` | 已实现 | 项目定位与用户角色 |
| `/api/product/flow` | 已实现 | 核心业务流程 |
| `/api/product/modules` | 已实现 | 功能模块 |
| `/api/product/pages` | 已实现 | 页面清单 |
| `/api/dashboard/summary` | 已实现 | 总览指标、吞吐、服务状态、报表指标 |
| `/api/data-sources` | 已实现 | 数据源列表与连通状态 |
| `/api/ingest-jobs` | 已实现 | 采集任务 |
| `/api/sync-jobs` | 已实现 | 同步任务、断点与写入策略 |
| `/api/transforms` | 已实现 | 清洗、转换、聚合任务 |
| `/api/workflow/canvas` | 已实现 | DAG 画布节点与边 |
| `/api/workflows` | 已实现 | 工作流定义 |
| `/api/job-instances` | 已实现 | 任务实例、状态和失败重试 |
| `/api/quality-rules` | 已实现 | 数据质量规则 |
| `/api/quality-runs/latest/report` | 已实现 | 最新质量报告 |
| `/api/abnormal-records` | 已实现 | 异常数据问题池 |
| `/api/data-assets` | 已实现 | 数据资产目录 |
| `/api/lineage` | 已实现 | 血缘关系 |
| `/api/permissions/matrix` | 已实现 | 权限矩阵 |
| `/api/files` | 已实现 | 文件附件管理 |
| `/api/alerts` | 已实现 | 告警规则与告警事件 |
| `/api/audit-logs` | 已实现 | 权限审计和操作日志 |
| `/api/acceptance/checklist` | 已实现 | 验收清单 |

### 2.2 前端可视化系统

当前 `frontend/` 是 Cursor 可直接查看的静态单页系统，已实现：

| 区域 | 状态 | 说明 |
|---|---|---|
| 总览看板 | 已实现 | 指标卡、吞吐图、服务健康、核心流程 |
| 数据接入 | 已实现 | 数据源、采集任务、同步任务 |
| 操作中心与状态流转 | 已实现 | 数据源接入申请、任务状态流转、统计报表生成 |
| 处理编排与调度 | 已实现 | 清洗转换聚合、DAG 画布、任务实例、失败重试 |
| 数据质量与异常数据 | 已实现 | 质量规则、质量报告、质量趋势、异常问题池 |
| 数据资产目录与血缘关系 | 已实现 | 资产卡片、血缘关系图 |
| 告警、文件附件与权限审计 | 已实现 | 告警规则、文件策略、审计日志、权限矩阵 |
| 验收清单与工程规范 | 已实现 | 验收清单和文档入口 |

### 2.3 工程规范

当前仓库已具备：

- `README.md`
- `.github/ISSUE_TEMPLATE/bug.md`
- `.github/ISSUE_TEMPLATE/requirement.md`
- `.github/pull_request_template.md`
- `.github/workflows/ci.yml`
- `docs/github-engineering-standard.md`
- `docs/git-github-version-plan.md`
- `docs/acceptance/document-coverage.md`

## 3. 尚未生产化的能力

以下能力已经在界面和 API 中完成可视化演示，但尚未接入真实数据库、任务执行器和权限系统：

- 真实登录、Token、会话失效。
- 用户、角色、数据范围的持久化授权。
- 数据源真实连通性测试和凭据加密存储。
- 采集、同步、清洗转换任务的真实执行。
- Spark/Flink/Kubernetes 执行适配。
- 文件上传、下载短期链接和对象存储生命周期。
- 告警通知真实投递到邮件、Webhook 或站内信。

## 4. 当前验收口径

本阶段适合作为“独立产品 MVP 可视化系统 + 示例 API + 工程文档基线”验收：

1. 可启动本地服务。
2. 可访问可视化管理台。
3. 可查看多源异构大数据处理与质量治理平台独立信息架构。
4. 可演示数据源、采集、同步、转换、编排、调度、质量、异常、资产、血缘、审计和验收清单。
5. 自动化冒烟测试覆盖核心接口。
