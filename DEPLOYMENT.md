# 创建 DEPLOYMENT.md 文件并写入内容
@"
# 历史版本文档部署指南

本文档记录 Vite 中文文档（docs-cn）历史版本的部署流程和维护规范。

## 分支与域名映射

| 分支 | 部署域名 | 维护状态 |
|------|----------|----------|
| `stable-5.x` | https://v5.cn.vite.dev | ✅ 已维护 |
| `stable-6.x` | https://v6.cn.vite.dev | ✅ 已维护 |
| `stable-7.x` | https://v7.cn.vite.dev | ✅ 已维护 |
| `main` | https://cn.vite.dev | 主站 |

## 部署触发机制

每次向上述分支推送代码时，应自动触发 Cloudflare Pages 重新部署。

### 当前状态（待完成）
- 等待 Vite 核心团队配置 Cloudflare DNS 映射（参考 Issue #23151）
- DNS 配置完成后，分支推送将自动触发部署

### 建议的自动化方案
建议在 `.github/workflows/deploy-history.yml` 中配置：

\`\`\`yaml
name: Deploy Historical Docs
on:
  push:
    branches:
      - stable-5.x
      - stable-6.x
      - stable-7.x
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - run: pnpm install
      - run: pnpm run docs:build
      # 添加 Cloudflare Pages 部署步骤
\`\`\`

## 手动部署步骤（备用方案）

如果自动化流程尚未就绪，可通过以下步骤手动部署：

1. 确保当前分支已合并最新的翻译更新
2. 本地构建验证：
   \`\`\`bash
   pnpm install
   pnpm run docs:build
   \`\`\`
3. 联系 Vite 核心团队（@bluwy / @sapphi-red）触发 Cloudflare 部署

## 历史版本维护规范

1. **翻译更新**：当主站（`main` 分支）有重要文档更新时，评估是否需要反向移植到历史版本
2. **版本覆盖范围**：目前覆盖 v5、v6、v7，不再维护更早版本
3. **文档管理员**：如有部署问题，可在 Vite Land Discord 的 `#docs` 频道联系

## 相关链接

- 原始 Issue：https://github.com/vitejs/vite/issues/23151
- 关联 PR：https://github.com/vitejs/vite/pull/23154
- Vite Land Discord：https://chat.vite.dev
"@ | Out-File -FilePath DEPLOYMENT.md -Encoding utf8