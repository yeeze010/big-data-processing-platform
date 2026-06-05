# 大数据处理平台文档索引

本目录沉淀《大数据处理平台》的产品、架构、设计、接口、测试、部署、验收和工程规范。当前实现已经从规划文档推进到可运行的本地可视化系统，前端入口为 `frontend/index.html`，后端入口为 `backend/server.js`。

## 需求

- [项目定位、角色、核心流程与功能模块](requirements/product-scope.md)
- [权限矩阵](requirements/permission-matrix.md)

## 架构

- [系统架构设计](architecture/system-architecture.md)
- [数据模型设计](architecture/data-model.md)
- [平台架构图 SVG](architecture/platform-architecture.svg)
- [平台架构图 PNG](architecture/platform-architecture@2x.png)
- [核心业务流程图 SVG](architecture/core-business-flow.svg)
- [核心业务流程图 PNG](architecture/core-business-flow@2x.png)

## 设计

- [前端与交互设计说明](design/frontend-ux.md)

## API

- [API 接口规划](api/api-plan.md)

## 测试

- [测试计划](test/test-plan.md)
- [本地验证记录 2026-06-05](test/local-verification-2026-06-05.md)

## 部署

- [部署方案](deployment/deployment-plan.md)
- [本地运行手册](local-runbook.md)

## 验收

- [验收标准](acceptance/acceptance-criteria.md)
- [里程碑计划](acceptance/milestones.md)
- [文档与实现覆盖矩阵](acceptance/document-coverage.md)
- [当前实现基线](acceptance/implementation-baseline.md)
- [本轮迭代摘要](acceptance/iteration-summary-2026-06-05.md)

## Git 与 GitHub

- [Git 与 GitHub 工程规范](github-engineering-standard.md)
- [Git 与 GitHub 版本管理方案](git-github-version-plan.md)

## 可运行系统入口

- 前端页面：`frontend/index.html`
- 前端逻辑：`frontend/app.js`
- 前端样式：`frontend/styles.css`
- 后端服务：`backend/server.js`
- 演示数据：`backend/data.js`
- 冒烟测试：`tests/api-smoke-test.js`

当前页面结构包含：总览看板、数据接入、操作中心与状态流转、处理编排、质量治理、资产血缘、告警审计、验收清单。

启动方式：

```powershell
npm.cmd start
```

验证方式：

```powershell
npm.cmd test
```
