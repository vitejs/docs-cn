# Vite 4 官方中文文档

这是 Vite 4 最终稳定版本（`4.5.14`）的历史中文文档分支，部署目标为 [v4.cn.vite.dev](https://v4.cn.vite.dev)。最新版本的中文文档请访问 [cn.vite.dev](https://cn.vite.dev)。

## 分支维护策略

- 本分支只跟踪上游 [`vitejs/vite` 的 `v4` 分支文档](https://github.com/vitejs/vite/tree/v4/docs)。
- 不要从上游 `main` 或本仓库 `main` 同步功能文档，以免引入 Vite 5 及更高版本的内容。
- Vite 4 的最终上游基线是 `vite@4.5.14`，上游分支提交为 `96567961a8fc41b231b8e679e2d007e49dc62387`。
- 安全修复、失效链接和不改变 Vite 4 行为的翻译修正可以继续回补到本分支。

## 本地开发

需要 Node.js 14.18、16 或更高版本，并使用仓库声明的 pnpm 版本。

```bash
corepack pnpm install
corepack pnpm dev
```

开发服务器默认运行在 `http://localhost:5174/`。

## 构建

```bash
corepack pnpm build
```

构建产物位于 `.vitepress/dist`。站点启用了无扩展名 URL、V4 独立站内搜索、sitemap、RSS、canonical URL 和历史版本提示。

## 参与贡献

本仓库只处理中文翻译和中文站点问题。如果建议会影响所有语言版本，请在 [Vite 上游仓库](https://github.com/vitejs/vite/issues)提出。Vite 使用问题可前往 [GitHub Discussions](https://github.com/vitejs/vite/discussions)或 [Vite Land](https://chat.vite.dev)。

## 许可证

中文文档采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 许可。
