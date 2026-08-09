# Vite 3 中文文档审校问题汇总

审校范围：`stable-3.x` 当前工作树中的 Vite 3 产品文档、主题及部署配置

参考原文：<https://github.com/vitejs/vite/tree/v3/docs>（最终文档提交 `0114c871a0b3f946267f878f166fded7e430e68a`）

说明：当前分支已经补齐审计发现的阻断项，并通过构建与浏览器复核。以下保留问题、修改建议和处理结果作为审计记录。

- 中文分支：`stable-3.x`
- 中文起点：`707680c2382910f1df41e489a23ea1f95808f96c`
- 中文起点日期：`2022-10-12`
- 中文起点的上游同步源：`f248e6510ba332256d4e87ffda589ab64c6ac3d4`
- 上游引用：`vitejs/vite:v3/docs`
- 上游最终提交：`0114c871a0b3f946267f878f166fded7e430e68a`
- Vite 3 最终发布提交：`45b8644543f1adfb9c02bf88461278d9f7119642`
- 最终 Vite 版本：`3.2.11`
- 审计日期：`2026-08-09`
- 部署目标：`https://v3.cn.vite.dev`

## 审计结论

当前工作树已补齐 Vite 3 维护期内容，页面清单、历史版本提示、中文站身份和构建配置均符合归档站要求。审计发现的 2 项版本完整性问题已经修复并通过重新构建与浏览器验证；该分支可以作为 Vite v3 最终版中文文档直接部署。

## guide/api-javascript.md

### 1. `guide/api-javascript.md:120-124`

- 问题描述：审计时 `ViteDevServer` 接口在 `ssrFixStacktrace` 后直接进入 `listen`，缺少上游 Vite 3 最终文档新增的 `reloadModule(module: ModuleNode): Promise<void>` 方法及其 HMR 行为说明。该 API 来自 Vite 3 维护分支提交 `832801153`，不是 Vite 4 内容；遗漏会使 JavaScript API 文档与 Vite 3.2.11 的公开接口不一致。
- 修改建议：在 `ssrFixStacktrace(e: Error): void` 与 `listen(...)` 之间补译上游 `vite/v3:docs/guide/api-javascript.md` 中的完整 JSDoc 和 `reloadModule(module: ModuleNode): Promise<void>` 类型签名。
- 处理结果：已补充完整中文说明和类型签名；构建产物与浏览器渲染结果均包含该 API。
- English commit description: `docs(api): document reloadModule in the ViteDevServer interface`

## blog/announcing-vite3.md

### 2. `blog/announcing-vite3.md:244`

- 问题描述：审计时发布公告将 `@vitejs/plugin-vue-jsx` 的历史源码链接改为 `vitejs/vite-plugin-vue` 的 `main` 分支。该地址当前可访问，但会随最新版插件继续变化，不能稳定代表 Vite 3 发布时的源码；同一段中的 `plugin-legacy` 以及站内其他 `plugin-vue-jsx` 链接均已固定到 `vitejs/vite:v3`，此处不一致。
- 修改建议：将链接改为 `https://github.com/vitejs/vite/tree/v3/packages/plugin-vue-jsx`，与上游 Vite 3 最终文档和本仓库其他版本敏感链接保持一致。
- 处理结果：链接已固定到 `vitejs/vite:v3`，HTTP 检查返回 200，浏览器中的最终 `href` 与预期一致。
- English commit description: `docs(blog): pin the plugin-vue-jsx link to Vite 3`

## 内容差异与修复

### Vite 3 维护期文档补充

- 位置：`guide/api-hmr.md`、`guide/env-and-mode.md`、`config/build-options.md`、`guide/why.md`
- 上游变化：Vite 3 在基线后增加 `vite:afterUpdate` HMR 事件、`dotenv-expand` 的变量展开与 `$` 转义说明、实验性 `build.copyPublicDir` 选项，并修订 esbuild 的说明措辞。
- 中文分支原状态：缺少前三项后期追加语义。
- 处理结果：按 `vitejs/vite:v3` 最终文档逐项补译，保留类型、默认值、代码示例与实验性标记。
- 版本边界判断：全部内容来自 Vite 3 维护分支；未引入 Vite 4 的 API 或迁移说明。
- English commit description: `docs: backfill final Vite 3 maintenance documentation`

### 缺失的中文正文与版本敏感链接

- 位置：`blog/announcing-vite3.md`，以及 `blog/`、`guide/`、`config/`、`plugins/` 中指向上游源码的链接。
- 问题：Vite 3 发布公告含有整篇英文正文；多个插件、演练场、类型定义和 CHANGELOG 链接仍指向可移动的 `main` 分支。
- 处理结果：迁入已审计的 Vite 3 中文公告译文，并将版本敏感的 `vitejs/vite` 链接固定为 `v3`；旧 `vitejs.dev` 产品文档链接固定为 `v3.vite.dev`。
- 版本边界判断：改动只还原 Vite 3 发布语境，不引入后续版本功能。
- English commit description: `docs: complete the Vite 3 release announcement and pin archive links`

### 历史站身份、部署和搜索

- 位置：`.vitepress/config.ts`、`.vitepress/buildEnd.config.ts`、`CNAME`、`public/_headers`、`public/_redirects`、`vercel.json`
- 问题：中文起点仍按主站身份构建，缺少历史站自引用 canonical、Open Graph、sitemap、RSS、独立搜索、缓存与重定向规则。
- 处理结果：配置 `v3.cn.vite.dev` 的 canonical、OG、sitemap、`zh-CN` RSS、本地搜索、`stable-3.x` 编辑链接、版本导航、Clean URL 和缓存响应头；旧 `v3.cn.vitejs.dev` 永久重定向到新域名。
- 版本边界判断：最新中文站只作为明确标注的导航入口，不作为历史页 canonical 或内容来源。
- English commit description: `docs: configure the standalone Vite 3 Chinese archive site`

### 历史提示与旧主题中文化

- 位置：`.vitepress/theme/components/OldDocument.vue`、`.vitepress/theme/index.ts`
- 问题：Vite 3 最终上游文档新增旧版本提示，中文基线中没有该组件；旧 VitePress 主题仍会显示少量英文无障碍和工具控件文案。
- 处理结果：增加响应式中文历史提示栏，并在主题挂载时中文化跳转链接、导航、目录、外观、搜索、代码复制和永久链接等控件文案。
- 版本边界判断：保留 Vite 3 最终主题结构，仅增加中文站身份与旧主题兼容层。
- English commit description: `docs: localize the legacy VitePress theme and add archive notice`

### 工具链和构建兼容

- 位置：`package.json`、`pnpm-lock.yaml`、`index.md`
- 问题：原始 VitePress alpha 工具链不能提供模板所需的独立 sitemap、RSS 和本地搜索；首页仍含已移除的动态发布标签脚本。
- 处理结果：固定 Vite `3.2.11`、VitePress `1.0.0-beta.7` 和 pnpm `8.6.11`，使用 pnpm 重新生成锁文件，并移除未使用的动态发布标签脚本。
- 版本边界判断：工具链调整只服务于可重复构建和历史站功能，不改变 Vite 3 产品文档语义。
- English commit description: `build: pin the Vite 3 documentation toolchain`

## 验证结果

- 分支：`git branch --show-current` 返回 `stable-3.x`。
- 上游基线：`vite/v3` 最终文档 SHA 为 `0114c871a0b3f946267f878f166fded7e430e68a`；Vite 最终版本为 `3.2.11`。
- 构建：`corepack pnpm build` 通过，客户端、服务端、页面渲染和 sitemap 生成成功。
- 产物：生成 `sitemap.xml`、`blog.rss`、`_headers` 和 `_redirects`；`README.md` 未生成公开页面。
- 元数据：首页使用 `lang="zh-CN"`，canonical、`og:url` 和 `og:image` 均使用 `https://v3.cn.vite.dev`。
- 内容：构建产物包含 `vite:afterUpdate` 和 `build.copyPublicDir`；`dotenv-expand` 说明已进入搜索索引。
- 外部关键链接：`https://v3.vite.dev`、`https://cn.vite.dev`、上游 V3 文档树和 V3 CHANGELOG 均返回 200；`https://chat.vite.dev` 返回 Discord 永久重定向。
- 工作区：未执行暂存、提交、推送或创建 PR。

### 最终复核（2026-08-08）

- `corepack pnpm build` 通过；最终产物包含客户端/服务端构建、页面渲染与 sitemap 生成。
- 对 `.vitepress/dist` 的 32 个 HTML 页面执行内部链接和锚点扫描：695 条站内文档链接、190 条静态资源链接，缺失页面或锚点为 0。
- 已修正 Vite 2 遗留的单页配置参考链接，使其指向 Vite 3 拆分后的 `build-options`、`shared-options` 和 `server-options` 页面；同时修正 `hot.on` 与 `hot.send` 的 HMR 锚点。
- 生产产物复核：`lang="zh-CN"`、canonical、`og:url`、`og:image`、sitemap hostname 和 RSS `language` 均为 `v3.cn.vite.dev`/`zh-CN`；`README.html` 未生成；`_headers`、`_redirects` 与 `favicon.ico` 均存在。
- 桌面端浏览器：历史版本提示、中文搜索、本地索引结果与 `build.copyPublicDir` 深层锚点均通过；开发服务器控制台为 0 errors / 0 warnings。
- 移动端（390x844）：历史提示、移动端导航、中文外观控制和 V3 英文语言入口均可用；页面内容与赞助商资源正常显示。
- 本地预览与交互式开发验证：`http://127.0.0.1:4174/`。
- `git diff --check` 通过；未发现指向 `vitejs/vite` 的 `main` 分支链接，也未发现遗留的 `https://vitejs.dev` 文档链接。

### 上线复核（2026-08-09）

- `corepack pnpm build` 通过；客户端/服务端打包、页面渲染和 sitemap 生成成功。
- `.vitepress/dist/guide/api-javascript.html` 包含 `server.moduleGraph` 说明和 `reloadModule(module: ModuleNode): Promise<void>` 签名。
- `.vitepress/dist/blog/announcing-vite3.html` 中的 `plugin-vue-jsx` 链接固定为 `https://github.com/vitejs/vite/tree/v3/packages/plugin-vue-jsx`，目标返回 200。
- 真实浏览器复核 JavaScript API 页面和 Vite 3 发布公告，历史版本提示、中文主题及新增内容正常渲染，控制台为 0 errors / 0 warnings。
- `git diff --check` 通过；未发现指向 `vitejs/vite` 的 `main` 分支链接或遗留的 `https://vitejs.dev` 文档链接。
- 结论：当前 `stable-3.x` 工作树可以作为 Vite `3.2.11` 最终版中文文档直接部署。

## 已知例外

- 用户指定并沿用仓库既有约定 `stable-3.x`，未采用模板示例中的 `3.x-stable`。
- 相对上游 `docs` 树有意保留中文站构建文件：`.vitepress/buildEnd.config.ts`、`.vitepress/theme/custom.css`、`package.json` 和 `pnpm-lock.yaml`。
- `guide/migration-from-v1.md` 与 `images/webify-configuration.png` 是中文站历史资料，不属于 Vite 3 最终上游页面清单；它们不引入后续版本内容。
- `.playwright-cli`、`.vitepress/cache` 与空的 `output` 目录均为本地验证产物，已在本次审计后删除；前两类易误提交产物已加入 `.gitignore`。`.vitepress/dist` 是已忽略的正式构建产物，本次保留供本地预览和部署复核使用。
