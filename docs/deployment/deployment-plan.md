# 部署方案

## 1. 环境划分

| 环境 | 用途 | 部署方式 |
|---|---|---|
| dev | 本地开发 | Node 静态服务 / Docker Compose |
| test | 测试联调 | Docker Compose |
| staging | 验收演示 | Docker Compose 或 Kubernetes |
| prod | 生产运行 | Kubernetes 推荐 |

## 2. 服务清单

| 服务 | 说明 |
|---|---|
| frontend | 管理后台静态资源 |
| backend-api | REST API 服务 |
| postgresql | 业务数据库 |
| redis | 缓存、幂等键、分布式锁 |
| minio | 文件资产、日志、报告 |
| nginx | TLS、静态资源、反向代理、限流 |
| scheduler-worker | 调度与任务执行 |

## 3. 配置项

| 变量 | 说明 |
|---|---|
| PORT | 本地服务端口 |
| JWT_SECRET | Token 签名密钥 |
| DATABASE_URL | PostgreSQL 连接 |
| REDIS_URL | Redis 连接 |
| MINIO_ENDPOINT | 对象存储地址 |
| MINIO_ACCESS_KEY | 对象存储访问键 |
| MINIO_SECRET_KEY | 对象存储密钥 |

## 4. 发布流程

1. 从 `develop` 创建 `release/v1.0.0`。
2. 执行自动化测试和接口回归。
3. 构建前端静态资源和后端镜像。
4. 执行数据库迁移。
5. 部署到 staging。
6. 执行验收测试和演示。
7. 合并到 `main` 并打 `v1.0.0` tag。
8. 创建 GitHub Release。
9. 归档部署包、测试报告、验收截图和回滚说明。

## 5. 回滚策略

- 前端静态资源保留最近 3 个版本。
- 后端镜像按 tag 回滚。
- 数据库迁移必须提供回滚脚本或风险说明。
- 配置变更通过环境变量版本化记录。

## 6. 运维监控

- 健康检查：`/api/ops/health`。
- 监控项：API 延迟、错误率、任务队列长度、失败率、数据库连接、Redis 命中率、MinIO 容量。
- 日志：应用日志、任务节点日志、审计日志分开存储。
- 告警：任务失败、服务不可用、容量超阈值、质量阈值、敏感导出。
