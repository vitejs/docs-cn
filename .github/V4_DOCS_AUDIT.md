# Vite 4 中文文档审计报告

- 中文分支：`stable-4.x`
- 中文起点：`e5bdb9907847c878d70d7d78ee8aea6f7ea25abb`
- 中文起点日期：`2023-08-13`
- 上游引用：`vitejs/vite:v4/docs`
- 上游最终提交：`96567961a8fc41b231b8e679e2d007e49dc62387`
- Vite 4 最终发布提交：`9bfe2b1bc5d755cd7898d17147b9a1bb7f55fed2`
- 最终 Vite 版本：`4.5.14`
- 审计日期：`2026-08-08`
- 部署目标：`https://v4.cn.vite.dev`

## 内容差异与修复

### Vite 4 后期产品文档与安全说明

- 位置：`config/server-options.md`、`config/preview-options.md`、`config/ssr-options.md`、`guide/backend-integration.md`
- 上游变化：Vite 4 维护后期增加了 `server.allowedHosts`、`preview.allowedHosts`、受限 CORS 默认值、`server.fs.deny` 对 public 目录无效的说明，以及 SSR 解析条件配置。
- 中文分支原状态：中文起点缺少这些后期追加内容和相关安全警告。
- 处理结果：按 `vitejs/vite:v4` 最终语义补译配置类型、默认值、示例、DNS 重绑定和 CORS 风险说明，并补齐 `ssr.resolve.conditions` 与 `ssr.resolve.externalConditions`。
- 版本边界判断：内容均存在于 Vite 4 最终维护分支，不包含 Vite 5 专属功能。
- English commit description: `docs: backfill final Vite 4 configuration and security guidance`

### 缺失的中文正文

- 位置：`blog/announcing-vite3.md`、`blog/announcing-vite4.md`、`blog/announcing-vite4-3.md`、`guide/philosophy.md`、`releases.md`
- 问题：中文起点中存在整页或大段英文，发布策略页也未准确表达 Vite 4 的维护状态。
- 处理结果：完整翻译缺失正文，保留代码、专有名词、链接、标题层级和显式锚点，并将发布策略固定为 Vite 4 历史语境。
- 版本边界判断：翻译基于 Vite 4 最终文档；未采用最新版中文站或 Vite 5 之后的正文。
- English commit description: `docs: complete missing Chinese translations for the Vite 4 archive`

### 版本敏感链接与内部锚点

- 位置：`blog/`、`guide/`、`config/`、`plugins/index.md`、`releases.md`
- 问题：部分源码、CHANGELOG 和历史文档链接仍指向可移动分支或早期单页配置锚点；构建产物中有 21 个缺失锚点。
- 处理结果：V2、V3、V4 历史链接分别固定到对应历史站或上游版本分支；旧 `/config/` 锚点迁移到 `shared-options`、`server-options`、`build-options`；修正 HMR 与依赖优化锚点。
- 版本边界判断：仅修复目标版本资源定位和失效链接，不改变 Vite 4 行为说明。
- English commit description: `docs: pin Vite 4 links and repair archived documentation anchors`

### 历史站身份、部署和搜索

- 位置：`.vitepress/config.ts`、`.vitepress/buildEnd.config.ts`、`CNAME`、`public/_headers`、`public/_redirects`、`vercel.json`
- 问题：中文起点仍按主站身份构建，缺少独立 canonical、OG、sitemap、RSS、搜索、缓存和重定向配置。
- 处理结果：配置 `v4.cn.vite.dev` 自引用 canonical 与 Open Graph、本地搜索、`zh-CN` RSS、sitemap、`stable-4.x` 编辑链接、V4/V3/V2/最新版导航、缓存响应头和托管平台 clean URL 规则。
- 版本边界判断：最新版中文站只作为明确标注的导航入口，不作为历史页 canonical 或内容来源。
- English commit description: `docs: configure the standalone Vite 4 Chinese archive site`

### 历史提示和旧主题中文化

- 位置：`.vitepress/theme/components/OldDocument.vue`、`.vitepress/theme/components/HomeSponsors.vue`、`.vitepress/theme/composables/sponsor.ts`、`.vitepress/theme/styles/vars.css`
- 问题：所有页面缺少历史版本提示；VitePress `1.0.0-beta.7` 硬编码了若干英文界面、无障碍和代码控件标签。
- 处理结果：增加响应式历史提示栏；中文化搜索、移动导航、外观、侧栏、目录、永久链接、代码复制、页脚导航、提示块和赞助等级等固定 UI 文案。
- 版本边界判断：保留 Vite 4 最终主题结构和外部赞助服务，仅增加中文站身份与旧主题兼容层。
- English commit description: `docs: localize the legacy VitePress theme and add archive notice`

### 工具链和构建兼容

- 位置：`package.json`、`pnpm-lock.yaml`、`.vitepress/`、`scripts/build.mjs`
- 问题：原依赖范围和旧构建辅助脚本不能稳定代表最终 Vite 4 站点。
- 处理结果：固定 Vite `4.5.14`、VitePress `1.0.0-beta.7`、pnpm `8.6.11`，重新生成锁文件，并移除已不再引用的旧 Markdown 和构建辅助代码。
- 版本边界判断：调整只服务于可重复构建和当前 Node.js 环境兼容，不引入新版 Vite 产品功能。
- English commit description: `build: pin the Vite 4 documentation toolchain`

## 验证结果

- 分支：`git branch --show-current` 返回 `stable-4.x`。
- 构建：`corepack pnpm build` 通过，客户端、服务端、页面渲染和 sitemap 生成均成功。
- 死链接：使用标准 HTML 解析器检查 38 个生成页面、1504 个内部链接和锚点，缺失数为 0。
- 产物：sitemap 含 37 个公开 URL；RSS 含 4 篇文章且语言为 `zh-CN`；`_headers`、`_redirects`、`remix.svg` 均存在；未生成 `README.html`。
- 元数据：首页为 `lang="zh-CN"`，canonical、`og:url`、`og:image` 均使用 `https://v4.cn.vite.dev`。
- 桌面端：验证首页完整滚动、普通指南、配置页深层锚点、历史提示、版本和语言菜单；无布局遮挡或图片加载失败。
- 移动端：在 390 x 844 视口验证首页完整滚动、指南页、折叠菜单、历史提示和页脚；文本正常换行，无重叠。
- 搜索：本地搜索 `allowedHosts` 返回 server 与 preview 配置；搜索 `externalConditions` 返回 SSR 配置和指南。
- 深层锚点：`/config/server-options#server-allowedhosts` 正确定位到目标标题。
- 控制台和网络：生产预览为 0 错误、0 警告；已加载请求中无 4xx/5xx。
- 运行时服务：`https://sponsors.vuejs.org/vite.json` 返回 200，Carbon Ads 正常加载，因此均保留。
- 外部关键链接：`https://v4.vite.dev`、`https://cn.vite.dev`、上游 V4 文档树和 CHANGELOG 返回 200；`https://chat.vite.dev` 正常返回 Discord 永久重定向，当前网络未能继续连接 Discord。
- 浏览器工具：Codex 内置浏览器控制接口在当前会话不可用，改用 Playwright CLI 驱动真实 Chromium 完成同等桌面和移动端验收。
- 工作区：`git diff --check` 通过；未执行暂存、提交、推送或创建 PR。

## 已知例外

- 用户指定并沿用仓库现有约定 `stable-4.x`，未采用模板示例中的 `4.x-stable`。
- 相对上游 `docs` 树有意保留中文站构建文件：`.vitepress/buildEnd.config.ts`、`.vitepress/theme/custom.css`、`package.json`、`pnpm-lock.yaml`。
- `guide/migration-from-v1.md` 与 `guide/migration-from-v2.md` 作为中文历史迁移资料保留；它们不属于 Vite 4 最终上游页面清单，但不引入后续版本内容。
- 赞助商名单和 Carbon Ads 属于持续更新的外部服务，其品牌名和广告内容不作为中文正文翻译；运行时接口和资源已验证可用。
- `.vitepress/cache`、`.vitepress/dist` 和 Playwright 会话产物均为本地验证产物，未纳入 Git 变更。
