# Vite 6 中文文档审计报告

- 中文分支：`6.x-stable`
- 中文起点：`6bd805216c563dd2340db65dd362f7c069c951be`
- 上游引用：`vitejs/vite:v6/docs`
- 上游最终提交：`bdb13d508ef196aba4e00be5f50a8b3f2609f3cf`
- 最终 Vite 版本：`6.4.3`
- 审计日期：`2026-08-03`
- 部署目标：`https://v6.cn.vite.dev`

## 基线判断

中文起点是 2025-05-14 合并 Vite 6 文档同步后的状态。其后的中文主线开始合入移除 Node.js 18、移除 Sass 旧 API、`buildApp` 等 Vite 7 破坏性变更，因此没有使用更晚的依赖切换提交作为起点。

上游 `v6` 分支当前最后提交为 2026-06-01 的 CI action 固定，最后一个 Vite 6 release 为 `v6.4.3`。本报告将该 SHA 作为不可变内容基线；若上游分支后续移动，需重新审计新增提交。

## 路径与内容审计

初始中文树包含 187 个跟踪文件，上游最终 `docs` 树包含 163 个文件。按相对路径比较，中文树仅缺少上游后来新增的 `.vitepress/theme/components/OldDocument.vue` 和部署文件 `public/_headers`；其余差异均为中文仓库的翻译、部署、维护或旧版迁移文件。

### 历史版本提示

- 上游变化：2025-08-09 为 Vite 6 文档加入全站旧版本提示。
- 中文分支原状态：缺少提示组件和 `layout-top` 插槽。
- 处理结果：加入本地化提示，链接到中文最新版，并保留响应式稳定高度、深色模式和键盘焦点样式。
- 版本边界判断：仅说明 Vite 6 的历史身份，不引入新版本功能。
- 建议 commit message：`docs(v6): add localized old-version banner`

### `guide/api-environment-runtimes.md`

- 上游变化：2026-04-06 在 Worker transport 示例中加入 `skipFsCheck: true`，说明 Worker 线程消息不暴露到网络。
- 中文分支原状态：示例缺少该安全相关选项。
- 处理结果：同步选项并翻译注释，保持代码行为与上游最终 Vite 6 文档一致。
- 版本边界判断：这是 Vite 6 安全修复的文档回补。
- 建议 commit message：`docs(v6): sync worker transport fs-check guidance`

### 历史站点身份与链接

- 上游变化：英文历史站使用 `v6.vite.dev`，中文历史站目标为 `v6.cn.vite.dev`。
- 中文分支原状态：canonical、OG、RSS、编辑链接、版本导航和若干源码链接仍指向最新版或 `main`。
- 处理结果：固定历史域名、`6.x-stable` 编辑链接、Vite `v6` 源码链接、独立本地搜索、sitemap、RSS、clean URL、重定向和缓存策略。
- 版本边界判断：仅固定站点身份和链接目标。
- 建议 commit message：`docs(v6): configure deployable historical site`

### 官方插件源码链接

- 上游变化：上游最终文档仍有若干官方插件链接指向各插件仓库的 `main` 分支。
- 中文分支原状态：Vue、React、React SWC、Vue 2、Basic SSL 和 Prefresh 插件源码会随当前开发分支移动。
- 处理结果：根据 Vite 6 生命周期末期的 npm 发布时间与 peer dependency 核对兼容版本，并将链接固定到对应发布提交：`plugin-vue 5.2.4`、`plugin-vue-jsx 4.2.0`、`plugin-react 4.5.0`、`plugin-react-swc 3.8.1`、`plugin-vue2 2.3.3`、`plugin-vue2-jsx 1.1.1`、`plugin-basic-ssl 2.0.0` 和 `@prefresh/vite 2.4.7`。
- 版本边界判断：避免历史文档未来跳转到只适用于 Vite 7 或更高版本的插件实现。
- 建议 commit message：`docs(v6): pin version-sensitive plugin source links`

### 历史发布文章翻译

- 上游变化：Vite 3、Vite 4、Vite 4.3 和 Vite 5.1 的发布文章在中文起点中仍保留整页英文正文。
- 中文分支原状态：页面路径完整，但不满足历史中文站的翻译完整性要求。
- 处理结果：完整翻译 `blog/announcing-vite3.md`、`blog/announcing-vite4.md`、`blog/announcing-vite4-3.md` 和 `blog/announcing-vite5-1.md`；同时本地化 Vite 2、Vite 5 和 Vite 6 发布文章中残留的日期、链接与 frontmatter 文案。
- 版本边界判断：保留目标文章的 Markdown 结构、代码、专有名词和 Vite 6 当时语义。
- 建议 commit message：`docs(v6): complete historical release translations`

### 主题运行时资源

- 上游变化：历史首页引用的两个 Twitter 头像已经失效，`wwads.cn` 广告脚本在真实浏览器中返回 HTTP 400 并抛出 JSON 解析异常。
- 中文分支原状态：首页出现两条图片加载错误，普通文档页出现第三方广告脚本控制台错误。
- 处理结果：将两张头像替换为同一作者的 GitHub 头像；移除动态 `WwAds` 组件及插槽，保留 `AsideSponsors` 静态赞助商内容。
- 版本边界判断：仅替换失效资源并移除已确认失败的第三方服务，不改变 Vite 6 产品文档。
- 建议 commit message：`fix(v6): replace failed runtime resources`

### 依赖

- 上游变化：最终 Vite 版本为 `6.4.3`。
- 中文分支原状态：`vite` 仍使用 `^6.3.0-beta.0`。
- 处理结果：将站点版本和 `vite` 依赖固定为 `6.4.3`，将其余文档工具固定到中文基线已经验证过的解析版本；使用仓库声明的 pnpm `9.6.0` 离线生成锁文件，并通过 `--frozen-lockfile` 安装验证。锁文件只更新直接 specifier、Vite `6.4.3` 及其所需的 `fdir 6.4.4`、`tinyglobby 0.2.13`，保留历史 Vue、Shiki 与 Algolia 依赖闭包。
- 版本边界判断：不升级到 Vite 7 或更高版本。
- 建议 commit message：`chore(v6): pin final Vite 6 toolchain`

## 已知例外

- 中文仓库保留 `CNAME`、`vercel.json`、`public/_headers`、`public/_redirects`、根目录 README、审计报告、翻译辅助脚本和中文站主题定制；这些文件不属于上游 `docs` 树。
- `guide/migration-from-v1.md` 至 `guide/migration-from-v4.md` 是中文站保留的旧版迁移入口，上游最终树没有同名文件。
- Vite 6 文档中关于“计划在 Vite 7 移除或稳定”的文字属于 Vite 6 当时的版本边界说明，予以保留。
- `config/server-options.md` 和 `guide/troubleshooting.md` 中 Vite 6 自身生成的错误消息示例仍包含 `https://vite.dev`，因为修改字符串会错误描述目标版本的实际运行时输出。
- VitePress 1.6.3 在当前 Node.js 24 环境中会触发 ESM cycle 错误，因此生产构建使用 Vite 6 engines 明确支持的 Node.js 20.19.5；未修改产品文档或升级历史工具链。
- 构建保留 VitePress 的大 chunk 警告；客户端、SSR、页面渲染和 sitemap 均成功完成，该警告不影响部署产物正确性。

## 验证结果

- 路径清单：上游最终 `docs` 树共 163 个路径，本地缺失 0 个；保留的额外路径均已在“已知例外”中分类。
- 翻译完整性：启发式正文扫描未发现整页或以英文为主的 Markdown 文档；Vite 3、4、4.3、5.1 发布文章已完整翻译。
- 版本敏感链接：未发现指向 `vitejs/vite` 的 `main` 链接；Vite 主仓库链接固定到 `v6`，官方插件源码固定到兼容 Vite 6 的不可变提交。
- 依赖：pnpm 9.6.0 `install --frozen-lockfile` 通过，共安装 311 个包，Vue 保持 `3.5.13`；`pnpm-workspace.yaml` 不存在。
- `git diff --check`：通过，仅有 Windows LF/CRLF 转换提示，没有空白错误。
- 生产构建和死链接：Node.js 20.19.5 下通过；客户端 bundle、SSR bundle、页面渲染、VitePress 内置死链接检查和 sitemap 生成均完成。
- 生成产物：`lang="zh-CN"`、title、历史站 canonical、`og:url`、`og:image`、RSS `zh-CN`、57 条历史域名 sitemap URL、`_headers`、`_redirects`、`llms.txt` 和 `llms-full.txt` 均正确；README 未生成页面且未进入 sitemap。
- 桌面端：1440×900 下首页、普通指南页、配置参考页、历史提示、版本菜单、语言菜单、侧栏、正文、页脚和编辑链接通过真实浏览器验收。
- 移动端：390×844 下首页与指南页首屏、完整滚动、页脚、导航和侧栏菜单正常；无水平溢出和失败图片，提示栏未遮挡导航或正文。
- 搜索：本地搜索分别以“环境 API”和“ModuleRunner”命中 Vite 6 内容。
- 深层锚点：`/guide/features#hot-module-replacement` 与 `/config/server-options#server-fs-strict` 的 hash、标题可见性和 120px `scroll-margin-top` 均通过。
- 键盘：历史提示链接和 “Skip to content” 链接具有可见焦点，后者可正确跳转到 `#VPContent`。
- 控制台和网络错误：首页完整滚动、普通指南页和配置页均为 0 条控制台错误；未发现失败图片或页面请求 4xx/5xx。
- 外部关键链接：英文 Vite 6 站、中文最新版、上游 Vite 6 文档树、CHANGELOG、贡献指南和社区聊天入口均返回 HTTP 200；固定后的插件源码链接也逐项验证。

## Git 操作范围

本次任务只创建并完善本地分支。未暂存、未提交、未推送，也未创建 PR。
