# 大数据处理平台

这是一个面向数据工程、数据治理、数据分析和平台运维团队的独立产品原型。当前版本已经实现可运行的本地可视化系统：Node.js API 服务、静态前端工作台、业务演示数据、接口冒烟测试和项目文档入口。

系统不是标题模板，而是围绕“大数据处理平台”业务独立设计的信息架构和交互界面，覆盖数据源接入、采集任务、同步任务、清洗转换聚合、工作流编排、任务调度、失败重试、数据质量、异常数据、数据资产目录、血缘关系、权限审计、告警通知、附件管理和验收清单。

## 当前能力

- 总览工作台：展示数据源、运行任务、质量分、告警、失败重试、资产数量等核心指标。
- 数据源与采集：展示数据库、消息队列、对象存储、API 等数据源及采集任务状态。
- 同步与转换：展示离线同步、实时同步、清洗、转换、聚合任务及运行实例。
- 操作中心：提供数据源接入申请、任务状态流转、统计报表生成三类可操作表单。
- 数据流画布：用可视化节点呈现数据源到 ODS、DWD、DWS、ADS 和质量校验的链路。
- 任务调度：展示调度周期、运行状态、耗时、重试次数和负责人。
- 数据质量：展示质量规则、最近检测报告、趋势、样本异常和处置状态。
- 数据资产与血缘：展示资产目录、分层、负责人、敏感等级和上下游依赖。
- 权限与审计：展示角色权限矩阵、审计日志、告警通知和附件材料。
- 验收闭环：在页面内呈现验收清单，并在 `docs/` 中沉淀规范和计划。

## 快速启动

```powershell
npm.cmd start
```

默认访问地址：

- 前端入口：`http://127.0.0.1:4173`
- 健康检查：`http://127.0.0.1:4173/api/ops/health`
- 总览 API：`http://127.0.0.1:4173/api/dashboard/summary`

如果 `4173` 已被占用，服务会自动尝试后续端口，并在终端输出实际地址。也可以指定端口：

```powershell
$env:PORT=4180
npm.cmd start
```

## 本地验证

```powershell
npm.cmd test
```

测试会启动本地服务并验证核心接口：健康检查、项目定位、业务流程、数据源、采集任务、同步任务、转换任务、工作流画布、任务实例、质量报告、异常数据、数据资产、血缘关系、权限矩阵、附件、告警、审计日志和验收清单。

静态前端构建：

```powershell
npm.cmd run build
```

构建会验证控制台关键结构和交互代码，并输出静态产物到 `dist/`。

浏览器视觉验证：

```powershell
npm.cmd run test:visual
```

视觉验证使用 Playwright 检查桌面端和移动端布局、工作流节点检查器、任务状态筛选、紧凑视图、控制台错误和横向溢出。视觉测试需要本机安装 Playwright 或可用的 Chrome / Edge。

## 入口文件

- 前端页面：[frontend/index.html](frontend/index.html)
- 前端逻辑：[frontend/app.js](frontend/app.js)
- 前端样式：[frontend/styles.css](frontend/styles.css)
- 后端服务：[backend/server.js](backend/server.js)
- 演示数据：[backend/data.js](backend/data.js)
- API 冒烟测试：[tests/api-smoke-test.js](tests/api-smoke-test.js)
- 静态构建检查：[tests/build-static.js](tests/build-static.js)
- 浏览器视觉检查：[tests/visual-qa.js](tests/visual-qa.js)
- 文档索引：[docs/index.md](docs/index.md)

## 目录结构

```text
backend/                 Node.js API 服务与演示数据
frontend/                可视化工作台页面、交互和样式
tests/                   本地 API 冒烟测试
docs/                    需求、架构、设计、API、测试、部署、验收文档
deliverables/            已生成的项目交付材料
.github/                 Issue、PR、CI 配置
```

## 文档入口

完整功能结构、接口规划、权限矩阵、测试部署和验收材料见 [docs/index.md](docs/index.md)。
