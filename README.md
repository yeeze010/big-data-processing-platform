# 大数据处理平台

面向数据工程、数据治理、数据分析和平台运维团队的独立产品原型。当前仓库提供一套可本地运行的工程控制台，包括 Node.js API、静态前端工作台、可操作表单、状态流转、统计报表、资产血缘、质量治理和验收中心。

本项目不是通用标题模板页，而是围绕“大数据处理平台”的真实业务结构组织信息架构，覆盖数据源接入、采集同步、清洗转换聚合、工作流编排、任务调度、失败重试、数据质量、异常数据、资产目录、血缘分析、权限审计、告警通知和验收闭环。

## 当前能力

- 运行控制中心：展示今日处理记录、任务成功率、质量通过率、待处理告警、资产登记量和血缘关系数量。
- 实时数据流：用可视化 DAG 展示销售主题域从采集、同步、清洗、聚合到质量检测和资产登记的处理链路。
- 调度监控：查看任务实例、状态筛选、失败重试、暂停调度和人工确认成功。
- 数据接入：查看数据源、采集任务、同步任务，并提交新的接入申请。
- 质量治理：查看质量规则、质量趋势、异常数据问题池和待处理样本。
- 资产血缘：查看资产目录、敏感等级、负责人和端到端血缘关系。
- 告警与审计：查看告警事件、文件附件、审计日志和角色权限矩阵。
- 操作中心：生成任务运行日报、质量报告、异常处置清单、血缘影响分析和权限审计报告。
- 验收中心：汇总测试、部署、文档和工程资料入口。

## 快速启动

```powershell
npm.cmd start
```

固定端口由根目录 `.env.ports` 分配，端口冲突时启动会直接失败，不会自动换端口。

- 前端：`http://127.0.0.1:5214`
- API：`http://127.0.0.1:8214`
- 预览：`http://127.0.0.1:6214`
- 前端代理健康检查：`http://127.0.0.1:5214/api/ops/health`
- API 健康检查：`http://127.0.0.1:8214/api/ops/health`

单独启动：

```powershell
npm.cmd run start:api
npm.cmd run start:web
```

构建并预览：

```powershell
npm.cmd run build
npm.cmd run preview
```

## 测试命令

```powershell
npm.cmd test
npm.cmd run test:ports
npm.cmd run test:startup
npm.cmd run test:visual
```

说明：

- `npm.cmd test`：API 冒烟测试。
- `npm.cmd run test:ports`：固定端口、代理和 CORS 契约检查。
- `npm.cmd run test:startup`：真实启动前端、预览和 API 三个服务后进行访问验证。
- `npm.cmd run test:visual`：使用 Playwright 检查桌面端与 390px 移动端布局、控制台错误和横向溢出。

## 本轮验收状态

2026-06-13 已完成一轮前端重构与视觉验收：

- 重做首屏结构，增加“今日重点”和“验收入口”，强化信息层级。
- 将移动端主导航改为折叠面板，避免导航占满首屏。
- 新增页面内“验收闸口”“发布闸口”“交付材料”“剩余风险”，让测试与文档闭环可直接浏览。
- 保留现有业务页、表单、状态流转和可视化链路。
- 本地构建、API 冒烟测试和视觉测试全部通过。

详细记录见：

- [运行手册](/F:/软件开发/big-data-processing-platform/docs/local-runbook.md)
- [本轮本地验收记录](/F:/软件开发/big-data-processing-platform/docs/test/local-verification-2026-06-13.md)

## 项目结构

```text
backend/                 Node.js API 服务与演示数据
frontend/                工程控制台页面、交互和样式
tests/                   构建、启动、接口与视觉验收脚本
docs/                    需求、架构、部署、测试与验收文档
deliverables/            交付材料、图表和文档包
scripts/                 本地启动和端口管理脚本
```

## 入口文件

- [前端页面](/F:/软件开发/big-data-processing-platform/frontend/index.html)
- [前端逻辑](/F:/软件开发/big-data-processing-platform/frontend/app.js)
- [前端样式](/F:/软件开发/big-data-processing-platform/frontend/styles.css)
- [后端服务](/F:/软件开发/big-data-processing-platform/backend/server.js)
- [演示数据](/F:/软件开发/big-data-processing-platform/backend/data.js)
- [API 冒烟测试](/F:/软件开发/big-data-processing-platform/tests/api-smoke-test.js)
- [视觉验收脚本](/F:/软件开发/big-data-processing-platform/tests/visual-qa.js)
- [文档索引](/F:/软件开发/big-data-processing-platform/docs/index.md)
