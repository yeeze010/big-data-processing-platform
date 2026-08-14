# 系统架构设计

## 1. 总体架构

平台采用前后端分离的企业后台架构：

- 前端：管理后台、DAG 编排画布、资产目录、质量报告、告警审计。
- API 层：认证鉴权、REST 接口、统一响应、审计拦截。
- 业务服务层：数据源、采集同步、清洗转换、工作流、调度、质量、资产、血缘、文件、告警、审计。
- 执行适配层：Spring Batch、本地执行器、Spark/Flink/Kubernetes 预留。
- 基础设施：PostgreSQL、Redis、MinIO、Nginx、Docker。

## 2. 工程骨架

当前 MVP 以零依赖 Node.js API 和静态前端验证业务结构。后续可演进为：

```text
frontend/
  src/
    pages/
    components/
    services/
    stores/
backend/
  src/main/java/
    interfaces/
    application/
    domain/
    infrastructure/
deploy/
  docker-compose.yml
  nginx.conf
docs/
  architecture/
  requirements/
  design/
  api/
  test/
  deployment/
  acceptance/
```

## 3. 服务边界

| 服务 | 责任 |
|---|---|
| Auth Service | 登录、Token、会话、密码策略 |
| Permission Service | 用户、角色、菜单、数据范围 |
| Data Source Service | 数据源配置、连通测试、凭据引用 |
| Ingestion Service | 采集任务、文件上传、API 拉取、Kafka 订阅 |
| Sync Service | 全量/增量同步、断点续传、写入策略 |
| Transform Service | 清洗、转换、聚合、规则执行 |
| Workflow Service | DAG、版本、发布、依赖校验 |
| Scheduler Service | Cron、触发、补数、失败重试、暂停终止 |
| Quality Service | 质量规则、检测、报告、异常样本 |
| Asset Service | 数据资产目录、标签、生命周期、搜索 |
| Lineage Service | 表级/字段级血缘、影响分析 |
| File Service | MinIO 文件、版本、授权、下载链接 |
| Alert Service | 告警规则、通知、确认、关闭、升级 |
| Audit Service | 登录、操作、数据访问、导出、权限变更 |

## 4. 数据处理链路

1. 连接源系统，保存元数据和凭据引用。
2. 创建采集或同步任务，配置目标存储。
3. 清洗转换节点对字段进行标准化、脱敏、去重和类型转换。
4. 聚合节点生成主题域宽表或指标表。
5. 质量节点执行非空、唯一、枚举、范围、波动、引用完整性规则。
6. 资产服务登记产物，血缘服务记录来源、转换和目标关系。
7. 告警和审计服务记录链路中的异常与关键操作。

## 5. 可靠性设计

- 任务实例状态机：`pending -> running -> success/failed/canceled/retrying`。
- 失败重试：支持最大重试次数、退避间隔、只重跑失败节点。
- 幂等控制：任务触发使用请求幂等键，节点输出使用版本号。
- 日志归档：节点日志写入对象存储，数据库仅保存索引和摘要。
- 断点续传：同步任务保存游标、批次号、目标提交位置。
- 调度隔离：不同项目空间支持并发配额和队列优先级。

## 6. 安全设计

- API 接口统一认证，P0 操作必须鉴权和审计。
- 数据范围权限按项目空间、数据源、资产标签和敏感等级控制。
- 凭据以密文或外部 Secret 引用保存。
- 文件下载使用短期链接，敏感文件强制审计。
- 审计日志不可由普通管理员删除。

## 7. 图示文件

- 架构图：`docs/architecture/platform-architecture.svg`
- 核心流程图：`docs/architecture/core-business-flow.svg`
