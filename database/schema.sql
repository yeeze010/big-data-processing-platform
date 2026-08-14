CREATE TABLE roles (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(32) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(80) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  real_name VARCHAR(80) NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'active',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
  user_id BIGINT NOT NULL REFERENCES users(id),
  role_id BIGINT NOT NULL REFERENCES roles(id),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE role_permissions (
  role_id BIGINT NOT NULL REFERENCES roles(id),
  permission_id BIGINT NOT NULL REFERENCES permissions(id),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE data_sources (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  source_type VARCHAR(48) NOT NULL,
  connection_status VARCHAR(32) NOT NULL DEFAULT 'unknown',
  owner_id BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE data_assets (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(120) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  layer VARCHAR(32) NOT NULL,
  asset_type VARCHAR(32) NOT NULL,
  owner_id BIGINT REFERENCES users(id),
  sensitivity_level VARCHAR(24) NOT NULL DEFAULT 'internal',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE data_asset_fields (
  id BIGSERIAL PRIMARY KEY,
  asset_id BIGINT NOT NULL REFERENCES data_assets(id) ON DELETE CASCADE,
  field_name VARCHAR(120) NOT NULL,
  data_type VARCHAR(80) NOT NULL,
  sensitivity_level VARCHAR(24) NOT NULL DEFAULT 'internal',
  sensitivity_category VARCHAR(64),
  detection_confidence NUMERIC(5, 4),
  masking_policy VARCHAR(160),
  UNIQUE (asset_id, field_name)
);

CREATE TABLE data_lineage_edges (
  id BIGSERIAL PRIMARY KEY,
  upstream_asset_id BIGINT NOT NULL REFERENCES data_assets(id),
  downstream_asset_id BIGINT NOT NULL REFERENCES data_assets(id),
  relation_type VARCHAR(48) NOT NULL,
  transform_job_id BIGINT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (upstream_asset_id, downstream_asset_id, relation_type)
);

CREATE TABLE etl_jobs (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  owner_id BIGINT REFERENCES users(id),
  schedule_expr VARCHAR(80),
  status VARCHAR(32) NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE etl_job_runs (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT NOT NULL REFERENCES etl_jobs(id),
  status VARCHAR(32) NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  error_message TEXT,
  last_log TEXT
);

CREATE TABLE etl_failure_diagnostics (
  id BIGSERIAL PRIMARY KEY,
  job_run_id BIGINT NOT NULL REFERENCES etl_job_runs(id),
  reason_code VARCHAR(64) NOT NULL,
  reason TEXT NOT NULL,
  confidence NUMERIC(5, 4) NOT NULL,
  rerun_advice TEXT NOT NULL,
  repair_task_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE data_quality_reports (
  id BIGSERIAL PRIMARY KEY,
  asset_id BIGINT NOT NULL REFERENCES data_assets(id),
  score NUMERIC(6, 2) NOT NULL,
  level VARCHAR(24) NOT NULL,
  dimensions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  alerts_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_by BIGINT REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE query_cost_estimates (
  id BIGSERIAL PRIMARY KEY,
  requester_id BIGINT REFERENCES users(id),
  sql_text TEXT NOT NULL,
  estimated_rows BIGINT NOT NULL,
  cost_score INTEGER NOT NULL,
  level VARCHAR(24) NOT NULL,
  requires_approval BOOLEAN NOT NULL DEFAULT FALSE,
  suggestions_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE query_approval_records (
  id BIGSERIAL PRIMARY KEY,
  estimate_id BIGINT NOT NULL REFERENCES query_cost_estimates(id),
  approver_id BIGINT REFERENCES users(id),
  decision VARCHAR(24) NOT NULL,
  reason TEXT,
  decided_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id BIGSERIAL PRIMARY KEY,
  actor_id BIGINT REFERENCES users(id),
  action VARCHAR(120) NOT NULL,
  resource_type VARCHAR(80) NOT NULL,
  resource_id VARCHAR(120) NOT NULL,
  detail_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_data_assets_layer ON data_assets(layer);
CREATE INDEX idx_data_asset_fields_asset_id ON data_asset_fields(asset_id);
CREATE INDEX idx_lineage_upstream ON data_lineage_edges(upstream_asset_id);
CREATE INDEX idx_lineage_downstream ON data_lineage_edges(downstream_asset_id);
CREATE INDEX idx_etl_job_runs_job_id ON etl_job_runs(job_id);
CREATE INDEX idx_quality_reports_asset_id ON data_quality_reports(asset_id);
CREATE INDEX idx_query_cost_requester ON query_cost_estimates(requester_id);
