# 数据模型设计

## 1. 设计约定

- 主键统一使用 `id`。
- 所有业务表包含 `created_at`、`updated_at`、`created_by`、`updated_by`、`deleted_at`。
- 高频查询字段建立组合索引。
- 状态字段使用字典表或枚举约束。
- JSON 配置字段用于灵活扩展，但关键查询字段需要冗余为普通列。

## 2. 核心表

| 表名 | 中文名 | 关键字段 |
|---|---|---|
| sys_user | 用户 | username, password_hash, display_name, status, dept_id |
| sys_role | 角色 | code, name, status |
| sys_user_role | 用户角色 | user_id, role_id |
| sys_permission | 权限 | parent_id, code, type, route_path, sort_no |
| sys_audit_log | 审计日志 | user_id, action, resource_type, resource_id, result, created_at |
| data_source | 数据源 | name, type, host, port, database_name, credential_ref, status, owner_id |
| ingest_job | 采集任务 | name, source_id, target_type, target_ref, mode, schedule_cron, status |
| sync_job | 同步任务 | source_id, target_ref, sync_mode, cursor_field, cursor_value, write_policy |
| transform_task | 清洗转换任务 | name, input_ref, output_ref, transform_json, owner_id, status |
| workflow | 工作流定义 | name, version, dag_json, status, owner_id, published_at |
| workflow_node | 工作流节点 | workflow_id, node_key, node_type, config_json, retry_policy |
| schedule_plan | 调度计划 | workflow_id, trigger_type, cron_expr, enabled, next_fire_at |
| job_instance | 任务实例 | workflow_id, trigger_type, status, started_at, ended_at, duration_ms |
| job_step_log | 节点日志 | instance_id, node_key, status, log_uri, metrics_json |
| quality_rule | 质量规则 | name, rule_type, target_table, target_field, threshold_json |
| quality_run | 质量检测结果 | rule_id, job_instance_id, status, score, failed_count, report_uri |
| abnormal_record | 异常数据 | quality_run_id, asset_id, sample_json, reason, status, assignee_id |
| data_asset | 数据资产 | name, type, layer, owner_id, sensitivity_level, lifecycle_status |
| data_asset_field | 资产字段 | asset_id, field_name, field_type, description, sensitivity_level |
| lineage_relation | 血缘关系 | source_asset_id, source_field, target_asset_id, target_field, workflow_id |
| file_asset | 文件资产 | bucket, object_key, file_name, file_size, content_type, version, tags_json |
| alert_rule | 告警规则 | name, scene, condition_json, level, enabled |
| alert_event | 告警事件 | level, source_type, source_id, title, content, status, assignee_id |
| notification | 通知记录 | user_id, channel, title, content, read_at |

## 3. 状态枚举

| 对象 | 状态 |
|---|---|
| 数据源 | draft, connected, warning, disconnected, disabled |
| 工作流 | draft, published, offline, archived |
| 任务实例 | pending, running, success, failed, canceled, retrying |
| 质量结果 | passed, failed, warning |
| 异常数据 | open, assigned, processing, reviewed, closed |
| 告警事件 | open, acknowledged, escalated, closed |
| 文件资产 | active, expired, archived, deleted |

## 4. 血缘关系

血缘关系记录表级与字段级两类：

- 表级：`source_asset_id -> target_asset_id`。
- 字段级：`source_asset_id.source_field -> target_asset_id.target_field`。
- 来源：工作流发布时从 DAG 节点配置解析，任务运行后用实际输入输出校正。
- 影响分析：当上游资产变更字段、质量下降或数据源不可用时，查询下游资产与工作流。
