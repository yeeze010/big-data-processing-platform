# Git 与 GitHub 版本管理方案

## 本地 Git 初始化步骤

```powershell
git init
git branch -M main
git add .
git commit -m "chore: initialize big data processing platform"
git checkout -b develop
```

绑定远程仓库时将 `<org>` 替换为实际命名空间：

```powershell
git remote add origin https://github.com/<org>/big-data-processing-platform.git
git push -u origin main
git push -u origin develop
```

## 分支模型

| 分支 | 用途 | 合并目标 |
|---|---|---|
| main | 稳定验收版本 | 仅接收 release/hotfix |
| develop | 开发集成版本 | main |
| feature/* | 功能开发 | develop |
| fix/* | 缺陷修复 | develop |
| release/* | 验收封版 | main 与 develop |
| hotfix/* | 紧急修复 | main 与 develop |

## Commit Message 规范

- `feat:` 新功能
- `fix:` 修复问题
- `docs:` 文档变更
- `style:` 代码格式调整
- `refactor:` 重构
- `test:` 测试相关
- `chore:` 构建、配置、依赖、脚手架
- `ci:` CI/CD 配置
- `perf:` 性能优化
- `revert:` 回滚提交

示例：

```text
feat: add workflow dashboard
fix: resolve quality report loading failure
docs: update deployment guide
ci: add github actions workflow
```

## Git 与 GitHub 协作流程

1. 从 `develop` 创建 `feature/<module-name>`。
2. 完成功能开发并本地执行 `npm test`。
3. 提交并推送分支到 GitHub。
4. 创建 Pull Request 到 `develop`。
5. GitHub Actions 自动执行测试。
6. Review 通过后合并。
7. 阶段完成后创建 `release/v1.0.0`。
8. 验收通过后合并到 `main`。
9. 在 `main` 打 `v1.0.0` tag。
10. 创建 GitHub Release 并归档验收资料。

## PR 合并策略

- `feature/*` 与 `fix/*` 合并到 `develop` 使用 squash merge。
- `release/*` 合并到 `main` 使用 merge commit，保留验收分支上下文。
- CI 未通过、缺少测试说明、缺少验收截图或接口验证说明时不得合并。

## 回滚策略

- 未发布功能：在 PR 中 revert 对应提交。
- 已合并但未发布：从 `develop` 执行 `git revert <sha>`。
- 已发布版本：创建 `hotfix/<issue>`，修复后合并到 `main` 和 `develop`，发布补丁版本。

## Tag 版本规划

- `v0.1.0`：项目初始化与基础框架。
- `v0.3.0`：核心模块初版。
- `v0.5.0`：主要功能联调完成。
- `v0.8.0`：测试环境可演示版本。
- `v1.0.0`：正式验收版本。

## 验收版本封版流程

```powershell
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
npm test
git add .
git commit -m "chore: prepare v1.0.0 acceptance release"
git checkout main
git merge release/v1.0.0
git tag -a v1.0.0 -m "v1.0.0 acceptance release"
git push origin main
git push origin v1.0.0
```
