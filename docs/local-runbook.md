# 本地运行手册

## 启动

```powershell
cd F:\软件开发\big-data-processing-platform
npm.cmd start
```

服务端口由根目录 `.env.ports` 固定分配，禁止自动换端口。端口被占用时必须释放冲突进程后重新启动。

## 验证入口

- 前端首页：`http://127.0.0.1:5214`
- API 健康检查：`http://127.0.0.1:8214/api/ops/health`
- 前端代理健康检查：`http://127.0.0.1:5214/api/ops/health`
- 构建预览：`http://127.0.0.1:6214`

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
Get-NetTCPConnection -LocalPort 5214,6214,8214 -State Listen
Stop-Process -Id <PID>
```
