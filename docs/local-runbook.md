# 本地运行手册

## 启动方式

在仓库根目录执行：

```powershell
cd F:\软件开发\big-data-processing-platform
npm.cmd start
```

如需拆分启动：

```powershell
npm.cmd run start:api
npm.cmd run start:web
```

如需查看构建产物：

```powershell
npm.cmd run build
npm.cmd run preview
```

## 固定访问地址

- 前端工作台：`http://127.0.0.1:5214`
- API：`http://127.0.0.1:8214`
- 预览站点：`http://127.0.0.1:6214`
- 前端代理健康检查：`http://127.0.0.1:5214/api/ops/health`
- API 健康检查：`http://127.0.0.1:8214/api/ops/health`

端口由 `.env.ports` 固定分配。任一端口被占用时，启动过程必须失败，不允许自动切换端口。

## 本地验证命令

```powershell
npm.cmd test
npm.cmd run test:ports
npm.cmd run test:startup
npm.cmd run test:visual
```

预期结果：

- `npm.cmd test` 输出 `API smoke tests passed`
- `npm.cmd run test:ports` 验证前端、预览和 API 固定端口契约
- `npm.cmd run test:startup` 验证三类服务可以真实启动并返回可访问内容
- `npm.cmd run test:visual` 验证桌面端和 390px 移动端页面无横向溢出、无控制台错误、核心节点和表单可见

## 核心验收点

- 首页首屏呈现“运行控制中心”“今日重点”“验收入口”和关键指标卡。
- 首页首屏呈现“运行控制中心”“今日重点”“验收闸口”和关键指标卡。
- 移动端导航折叠，默认不占满首屏。
- 工作流画布、任务实例、质量趋势、资产血缘和验收中心均能正常渲染。
- 操作中心存在“发布闸口”，验收中心存在“交付材料”“剩余风险”。
- `sourceRequestForm`、`taskTransitionForm`、`reportCenterForm` 三个表单可操作。
- `/api/ops/health` 返回 `status: UP`。

## 停止服务

在启动服务的终端按 `Ctrl+C`。

如需按端口查找并结束进程：

```powershell
Get-NetTCPConnection -LocalPort 5214,6214,8214 -State Listen
Stop-Process -Id <PID>
```
