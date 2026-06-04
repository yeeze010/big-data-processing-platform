# Git 与 GitHub 工程规范

## 1. 当前上下文

GitHub 账号：`yeeze010`。当前项目尚未绑定远程仓库，建议仓库名：

```text
big-data-processing-platform
```

远程仓库地址模板：

```text
https://github.com/yeeze010/big-data-processing-platform.git
```

## 2. 分支策略

| 分支 | 说明 |
|---|---|
| main | 稳定验收分支，只接收 release/hotfix |
| develop | 开发集成分支 |
| feature/* | 功能开发 |
| fix/* | 缺陷修复 |
| release/* | 验收封版 |
| hotfix/* | 紧急修复 |

## 3. Issue 标签

| 标签 | 用途 |
|---|---|
| requirement | 需求 |
| frontend | 前端 |
| backend | 后端 |
| bug | 缺陷 |
| test | 测试 |
| deploy | 部署 |
| acceptance | 验收 |
| security | 安全 |
| data-governance | 数据治理 |

## 4. PR 规则

每个 PR 必须包含：

- 功能说明。
- 测试说明。
- 截图或接口验证说明。
- 风险和回滚方式。
- 关联 Issue。

合并要求：

- CI 通过。
- 至少 1 人 Review。
- P0 功能必须有测试或验收说明。
- 不允许直接向 `main` 推送功能代码。

## 5. GitHub Actions

当前已提供 `.github/workflows/ci.yml`。后续建议扩展：

- lint
- unit test
- API smoke test
- frontend build
- docker image build
- dependency audit
- deploy staging

## 6. Release 规范

| 版本 | 含义 |
|---|---|
| v0.1.0 | 项目初始化与基础框架 |
| v0.3.0 | 核心模块初版 |
| v0.5.0 | 主要功能联调完成 |
| v0.8.0 | 测试环境可演示版本 |
| v1.0.0 | 正式验收版本 |

Release 附件：

- 部署包或镜像 tag。
- 测试报告。
- 验收清单。
- 变更说明。
- 回滚说明。

## 7. 远程绑定命令

```powershell
git remote add origin https://github.com/yeeze010/big-data-processing-platform.git
git push -u origin main
git push -u origin develop
```
