# Vite 5 中文文档审校问题汇总

审校范围：`vitejs/docs-cn:5.x-stable` 全站文档、主题与部署配置

参考原文：<https://github.com/vitejs/vite/tree/v5/docs>

上游基线：`vitejs/vite:v5`，最终提交 `adce3c22c64cc9d44cc8f45cc92b543e3e4bf385`（Vite 5.4.21）

说明：以下问题均已在本分支直接修复。每条包含位置、问题描述、修改结果和英文 commit 描述。

## config/server-options.md

### 1. `config/server-options.md:44`、`config/server-options.md:150`、`config/server-options.md:353`

- 问题描述：分支基线缺少上游 V5 后期回补的 `server.allowedHosts`、受限 CORS 默认值及 `server.fs.deny` 不过滤 public 目录的安全说明，会让中文读者得到过时或不完整的服务器安全行为。
- 修改建议：已按最终 V5 原文补充允许主机规则、DNS 重绑定警告、回环来源 CORS 正则、任意来源风险警告及 public 目录例外说明。
- English commit description: `docs(config): backport final Vite 5 server security guidance`

## config/preview-options.md

### 2. `config/preview-options.md:20`、`config/preview-options.md:83`

- 问题描述：缺少 `preview.allowedHosts`，且 `preview.cors` 仍声称默认允许任意来源；首次补译时还曾将上游类型 `string | true` 误写为 `string[] | true`。
- 修改建议：已补充 `preview.allowedHosts` 并采用上游类型，将 `preview.cors` 改为继承并链接 `server.cors` 的最终 V5 说明。
- English commit description: `docs(config): align preview host and CORS options with Vite 5`

## guide/backend-integration.md

### 3. `guide/backend-integration.md:18`

- 问题描述：在 Vite 5 收紧开发服务器 CORS 默认值后，后端集成示例若不声明后端来源，浏览器集成可能直接失败。
- 修改建议：已按上游回补在 `server.cors.origin` 中配置后端来源的中文示例。
- English commit description: `docs(guide): add backend origin to the CORS example`

## blog/announcing-vite5-1.md

### 4. `blog/announcing-vite5-1.md:28`

- 问题描述：Vite 5.1 发布文章此前整篇保留英文，且一度混入只适用于 Vite 6 的 Environment API 死链，不符合 V5 中文历史站的版本边界。
- 修改建议：已依据最终 `vite/v5` 原文完成全文翻译，恢复 Vite 运行时 API 指南链接，并将更新日志和贡献指南固定到上游 `v5` 分支。
- English commit description: `docs(blog): translate the Vite 5.1 release announcement`

## releases.md

### 5. `releases.md:1`

- 问题描述：发布策略页此前整页为英文，且更新日志和迁移指南指向会持续变化的最新文档。
- 修改建议：已完整翻译发布周期、支持范围、语义化版本边缘情况、预发布、弃用和实验性功能，并将版本相关链接固定到 V5。
- English commit description: `docs(releases): translate and pin the Vite 5 release policy`

## guide/migration-from-v2.md

### 6. `guide/migration-from-v2.md:44`、`guide/migration-from-v2.md:145`、`guide/migration-from-v3.md:69`

- 问题描述：迁移页仍使用失效的 `vitejs.dev`、`v2.vitejs.dev` 和指向中文最新版的旧地址，无法稳定表达 V2/V3 历史上下文。
- 修改建议：已改用 `v2.vite.dev`、`v3.vite.dev`，并让已有的中文历史迁移页使用站内链接。
- English commit description: `docs(migration): repair historical version links`

## .vitepress/config.ts

### 7. `.vitepress/config.ts:6`、`.vitepress/config.ts:84`、`.vitepress/theme/components/OldDocument.vue:4`

- 问题描述：原配置面向中文最新版域名和 `main` 分支，不具备 V5 独立部署所需的站点身份、搜索隔离、canonical URL、sitemap、版本导航及历史版本提示。
- 修改建议：已统一使用 `https://v5.cn.vite.dev`，将编辑链接固定到 `5.x-stable`，启用本地搜索和 sitemap，并在所有页面顶部显示 Vite 5 历史版本提示。
- English commit description: `docs(site): configure the standalone Vite 5 Chinese deployment`

## .vitepress/theme/components/landing/

### 8. `.vitepress/theme/components/landing/5. sponsor-section/SponsorSection.vue:57`、`public/voidzero.svg:1`

- 问题描述：移植后的最终 V5 首页缺少运行时引用的 VoidZero 标志，部署后会出现静态资源 404；标志图片也缺少替代文本。
- 修改建议：已补齐本地 SVG 资源、中文替代文本和外部链接安全属性，并完成新版首页其他可见文本的中文化。
- English commit description: `docs(theme): restore and localize Vite 5 landing assets`

## .vitepress/theme/index.ts

### 9. `.vitepress/theme/index.ts:13`、`.vitepress/theme/components/landing/4. community-section/CommunitySection.vue:56`、`public/favicon.ico`

- 问题描述：真实浏览器验收发现 WwAds 在新域名环境返回 HTTP 400，两张 Twitter CDN 社区头像返回 HTTP 404，浏览器默认 favicon 请求也返回 404，导致文档页和首页出现控制台错误或破图。
- 修改建议：已从历史站布局中移除不稳定的第三方广告注入，失效头像改用上游本地占位图，并补充本地 favicon；官方赞助商侧栏继续保留。
- English commit description: `docs(theme): eliminate runtime errors from unstable external assets`

## 验证说明

- `pnpm build` 已通过 VitePress 的全站死链检查、客户端和服务端打包、页面渲染以及 sitemap 生成。
- `docs-proofreader/scripts/check_links.py` 已用于本次修改文件的链接抽取。该脚本不解析 VitePress 根路径、无扩展名路由和模板示例，因此其 `/guide/...`、`/config/...` 及模板资源结果属于假阳性，最终以内建 VitePress 死链检查为准。
- `https://v5.vite.dev`、`https://cn.vite.dev`、`https://chat.vite.dev` 和上游 V5 文档树均返回 HTTP 200（Discord 链接正常重定向）。
