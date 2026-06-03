# 本地运行手册

## 启动

```powershell
cd F:\软件开发\big-data-processing-platform
npm.cmd start
```

服务默认绑定 `127.0.0.1`，从 `4173` 端口启动。如果端口被占用，会自动尝试 `4174`、`4175` 等后续端口，终端会输出实际地址。

## 验证入口

- 前端首页：`http://127.0.0.1:4173`
- 健康检查：`http://127.0.0.1:4173/api/ops/health`
- 总览接口：`http://127.0.0.1:4173/api/dashboard/summary`

如果启动时输出的不是 `4173`，把上面的端口替换成实际端口。

## 测试

```powershell
npm.cmd test
```

期望输出：

```text
API smoke tests passed
```

## 核心验收点

- 首页能打开并显示“企业级大数据处理平台”。
- `/api/ops/health` 返回 `status: UP`。
- 总览、数据源、工作流、任务实例、质量报告、告警、审计日志接口均返回成功信封。
- 前端页面包含总览看板、数据源管理、任务编排与调度、数据质量、告警与审计、交付资料。

## 停止服务

在启动服务的终端按 `Ctrl+C`。如果是后台进程，可通过端口查找 PID 后停止：

```powershell
Get-NetTCPConnection -LocalPort 4173 -State Listen
Stop-Process -Id <PID>
```
