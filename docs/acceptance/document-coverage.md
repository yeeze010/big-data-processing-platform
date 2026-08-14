# 文档与实现覆盖矩阵

本文件用于核对当前仓库是否已经覆盖《多源异构大数据处理与质量治理平台》的产品规划、工程骨架、可运行实现、测试验证和验收材料。

## 1. 委托要求与落盘位置

| 委托要求 | 落盘位置 |
|---|---|
| 项目定位 | `docs/requirements/product-scope.md`、`README.md`、`backend/data.js` |
| 用户角色 | `docs/requirements/product-scope.md`、`backend/data.js` |
| 核心业务流程 | `docs/requirements/product-scope.md`、`docs/architecture/core-business-flow.svg`、`frontend/index.html` |
| 功能模块 | `docs/requirements/product-scope.md`、`backend/data.js`、`frontend/app.js` |
| 页面清单 | `docs/requirements/product-scope.md`、`docs/design/frontend-ux.md`、`frontend/index.html` |
| 数据模型 | `docs/architecture/data-model.md`、`backend/data.js` |
| 接口规划 | `docs/api/api-plan.md`、`backend/server.js` |
| 权限矩阵 | `docs/requirements/permission-matrix.md`、`/api/permissions/matrix`、前端“权限与审计”区 |
| 报表指标 | `docs/requirements/product-scope.md`、`/api/dashboard/summary`、前端总览与质量趋势图 |
| 告警规则 | `docs/requirements/product-scope.md`、`/api/alerts`、前端告警列表 |
| 文件附件管理 | `docs/requirements/product-scope.md`、`/api/files`、前端附件列表 |
| 可操作表单与状态流转 | `frontend/index.html`、`frontend/app.js`、前端“操作中心与状态流转” |
| Git/GitHub 工程规范 | `docs/github-engineering-standard.md`、`docs/git-github-version-plan.md`、`.github/` |
| 测试计划 | `docs/test/test-plan.md`、`tests/api-smoke-test.js` |
| 部署方案 | `docs/deployment/deployment-plan.md`、`docs/local-runbook.md` |
| 验收标准 | `docs/acceptance/acceptance-criteria.md`、前端验收清单 |
| 里程碑计划 | `docs/acceptance/milestones.md` |

## 2. 业务实现覆盖

| 业务能力 | 实现位置 |
|---|---|
| 数据源 | `/api/data-sources`、前端“数据源与采集” |
| 采集任务 | `/api/ingest-jobs`、前端采集任务卡片 |
| 同步任务 | `/api/sync-jobs`、前端同步任务卡片 |
| 清洗转换聚合 | `/api/transforms`、前端转换与聚合卡片 |
| 工作流编排 | `/api/workflow/canvas`、前端数据流画布 |
| 任务调度 | `/api/job-instances`、前端任务实例表 |
| 失败重试 | `backend/data.js` 中任务实例的 `retryCount`、`maxRetries`、前端任务状态 |
| 状态流转 | 前端操作中心 `taskTransitionForm`，支持重跑失败节点、暂停调度、人工确认成功 |
| 数据质量 | `/api/quality-rules`、`/api/quality-runs/latest/report`、前端质量报告 |
| 异常数据 | `/api/abnormal-records`、前端异常样本列表 |
| 数据资产目录 | `/api/data-assets`、前端资产目录卡片 |
| 血缘关系 | `/api/lineage`、前端血缘关系图 |
| 权限审计 | `/api/permissions/matrix`、`/api/audit-logs`、前端权限与审计区 |

## 3. 标准目录检查

以下目录已经建立并有内容落盘：

- `docs/architecture/`
- `docs/requirements/`
- `docs/design/`
- `docs/api/`
- `docs/test/`
- `docs/deployment/`
- `docs/acceptance/`

## 4. 可运行系统检查

| 检查项 | 状态 |
|---|---|
| 前端入口 `frontend/index.html` | 已实现 |
| 前端交互 `frontend/app.js` | 已实现 |
| 前端样式 `frontend/styles.css` | 已实现 |
| 后端入口 `backend/server.js` | 已实现 |
| 演示数据 `backend/data.js` | 已实现 |
| API 冒烟测试 `tests/api-smoke-test.js` | 已实现 |
| 本地验证记录 | `docs/test/local-verification-2026-06-05.md` |

## 5. 当前判断

- 文档骨架完整，覆盖产品、架构、设计、接口、测试、部署、验收和 Git/GitHub 工程规范。
- 可视化系统已经落地，支持本地启动和 API 冒烟测试。
- 本轮重点已经从“补文档目录”推进到“独立产品可运行原型”。
- 下一阶段建议接入真实存储、登录鉴权、任务执行器和图表组件库。
