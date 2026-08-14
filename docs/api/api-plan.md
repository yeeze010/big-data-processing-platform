# API 接口规划

## 1. 通用规范

接口统一使用 REST 风格，返回结构：

```json
{
  "code": 0,
  "message": "ok",
  "data": {},
  "traceId": "trace-..."
}
```

分页参数：

- `pageNum`
- `pageSize`
- `sort`

错误码：

| code | 含义 |
|---|---|
| 0 | 成功 |
| 400 | 参数错误 |
| 401 | 未登录 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 状态冲突 |
| 500 | 系统异常 |

## 2. 接口清单

| 方法 | 路径 | 说明 | 优先级 |
|---|---|---|---|
| POST | /api/auth/login | 登录并签发 Token | P0 |
| POST | /api/auth/logout | 退出并失效会话 | P0 |
| GET | /api/dashboard/summary | 总览指标 | P0 |
| GET/POST/PUT/DELETE | /api/data-sources | 数据源管理 | P0 |
| POST | /api/data-sources/{id}/test | 连通性测试 | P0 |
| GET/POST/PUT/DELETE | /api/ingest-jobs | 采集任务管理 | P0 |
| POST | /api/ingest-jobs/{id}/run | 手动触发采集 | P0 |
| GET/POST/PUT/DELETE | /api/sync-jobs | 同步任务管理 | P0 |
| POST | /api/sync-jobs/{id}/resume | 从断点恢复同步 | P0 |
| GET/POST/PUT/DELETE | /api/transform-tasks | 清洗转换聚合任务 | P0 |
| POST | /api/transform-tasks/{id}/preview | 预览转换结果 | P1 |
| GET/POST/PUT/DELETE | /api/workflows | 工作流定义 | P0 |
| POST | /api/workflows/{id}/validate | DAG 校验 | P0 |
| POST | /api/workflows/{id}/publish | 发布工作流 | P0 |
| POST | /api/workflows/{id}/trigger | 触发工作流 | P0 |
| GET | /api/job-instances | 任务实例列表 | P0 |
| GET | /api/job-instances/{id}/logs | 实例日志 | P0 |
| POST | /api/job-instances/{id}/retry | 重跑失败实例或节点 | P0 |
| POST | /api/job-instances/{id}/cancel | 终止实例 | P0 |
| GET/POST/PUT/DELETE | /api/quality-rules | 质量规则管理 | P0 |
| GET | /api/quality-runs/{id}/report | 质量报告 | P0 |
| GET/POST/PUT | /api/abnormal-records | 异常数据问题池 | P1 |
| GET/POST/PUT/DELETE | /api/data-assets | 数据资产目录 | P0 |
| GET | /api/data-assets/{id}/lineage | 血缘关系 | P1 |
| GET | /api/lineage/impact | 影响分析 | P1 |
| GET/POST/DELETE | /api/files | 文件资产上传、查询、删除 | P1 |
| GET | /api/files/{id}/download-url | 生成临时下载链接 | P1 |
| GET/POST/PUT | /api/alerts | 告警查询、确认、关闭 | P0 |
| GET/POST/PUT/DELETE | /api/users | 用户管理 | P0 |
| GET/POST/PUT/DELETE | /api/roles | 角色授权 | P0 |
| GET | /api/audit-logs | 审计日志查询 | P0 |
| GET | /api/ops/health | 健康检查 | P0 |

## 3. 关键请求示例

### 创建采集任务

```json
{
  "name": "ERP 订单日增量采集",
  "sourceId": "ds-mysql-erp",
  "targetType": "table",
  "targetRef": "ods_order",
  "mode": "incremental",
  "incrementalField": "updated_at",
  "fieldMapping": [
    { "source": "order_id", "target": "id" },
    { "source": "amount", "target": "amount" }
  ],
  "preCheckRules": ["source_connected", "target_writable"]
}
```

### 发布工作流

```json
{
  "version": "v0.3.0",
  "dag": {
    "nodes": [
      { "key": "ingest_order", "type": "ingest" },
      { "key": "clean_order", "type": "transform" },
      { "key": "quality_order", "type": "quality" }
    ],
    "edges": [
      { "from": "ingest_order", "to": "clean_order" },
      { "from": "clean_order", "to": "quality_order" }
    ]
  }
}
```
