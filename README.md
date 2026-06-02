# 企业级大数据处理平台

面向数据工程师、数据分析师、运维工程师和审计人员的大数据处理平台 MVP。当前版本实现了可运行的后台 API、静态管理端界面、验收资料入口和 Git/GitHub 协作规范。

## 当前能力

- 总览看板：处理量、任务成功率、质量通过率、待处理告警、资源状态。
- 数据源管理：展示 PostgreSQL、MySQL、Kafka、MinIO 等接入状态。
- 调度编排：展示 DAG 工作流、运行实例、耗时、失败重试入口。
- 数据质量：展示规则、最近检测结果、质量报告入口。
- 告警与审计：展示告警事件、审计日志和系统健康检查。
- 交付物归档：保留 `deliverables/` 中的建设方案、图表、排期表和验收清单。

## 快速启动

```powershell
npm start
```

如果 PowerShell 提示 `npm.ps1 cannot be loaded`，使用：

```powershell
npm.cmd start
```

默认访问：

- 前端：`http://localhost:4173`
- 健康检查：`http://localhost:4173/api/ops/health`
- 总览 API：`http://localhost:4173/api/dashboard/summary`

如需换端口：

```powershell
$env:PORT=4180; npm start
```

## 测试

```powershell
npm test
```

PowerShell 执行策略受限时使用：

```powershell
npm.cmd test
```

测试会启动本地服务并验证核心 API：健康检查、总览、数据源、工作流、任务实例、质量报告、告警和审计日志。

## 目录结构

```text
backend/                 Node.js API 服务
frontend/                静态管理端界面
tests/                   API 冒烟测试
docs/                    Git/GitHub 协作与验收文档
deliverables/            已生成的项目交付资料
.github/                 Issue、PR、CI 配置
```

## 分支策略

- `main`：稳定验收分支。
- `develop`：开发集成分支。
- `feature/*`：功能开发。
- `fix/*`：缺陷修复。
- `release/*`：验收发布。
- `hotfix/*`：生产紧急修复。

详见 [Git 与 GitHub 版本管理方案](docs/git-github-version-plan.md)。
