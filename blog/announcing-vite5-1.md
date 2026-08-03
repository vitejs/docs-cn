---
title: Vite 5.1 正式发布！
author:
  name: Vite 团队
date: 2024-02-08
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Vite 5.1 正式发布
  - - meta
    - property: og:image
      content: https://v6.cn.vite.dev/og-image-announcing-vite5-1.png
  - - meta
    - property: og:url
      content: https://v6.cn.vite.dev/blog/announcing-vite5-1
  - - meta
    - property: og:description
      content: Vite 5.1 发布公告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.1 正式发布！

_2024 年 2 月 8 日_

![Vite 5.1 发布封面图](/og-image-announcing-vite5-1.png)

Vite 5 于去年 11 月[正式发布](./announcing-vite5.md)，再次推动了 Vite 及其生态系统向前迈进。几周前，我们庆祝了 npm 周下载量突破 1000 万，以及 Vite 仓库贡献者达到 900 人。今天，我们很高兴宣布 Vite 5.1 正式发布。

快速链接：[文档](/)、[变更日志](https://github.com/vitejs/vite/blob/v6/packages/vite/CHANGELOG.md#510-2024-02-08)

其他语言的文档：[简体中文](/)、[日本語](https://ja.vite.dev/)、[Español](https://es.vite.dev/)、[Português](https://pt.vite.dev/)、[한국어](https://ko.vite.dev/)、[Deutsch](https://de.vite.dev/)

在 StackBlitz 中在线体验 Vite 5.1：[vanilla](https://vite.new/vanilla-ts)、[vue](https://vite.new/vue-ts)、[react](https://vite.new/react-ts)、[preact](https://vite.new/preact-ts)、[lit](https://vite.new/lit-ts)、[svelte](https://vite.new/svelte-ts)、[solid](https://vite.new/solid-ts)、[qwik](https://vite.new/qwik-ts)。

如果你刚开始使用 Vite，建议先阅读[开始](/guide/)和[功能](/guide/features)指南。

要及时了解最新动态，请在 [X](https://x.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite) 上关注我们。

## Vite 运行时 API

Vite 5.1 为新的 Vite 运行时 API 添加了实验性支持。它可以先通过 Vite 插件处理任意代码，再运行处理结果。它与 `server.ssrLoadModule` 不同，因为运行时实现与服务器彼此解耦，库和框架作者因而可以自行实现服务器与运行时之间的通信层。此 API 稳定后，计划用来替代 Vite 现有的 SSR 原语。

新 API 带来了许多优势：

- 在 SSR 期间支持 HMR。
- 与服务器解耦，因此使用同一服务器的客户端数量不受限制。每个客户端都有自己的模块缓存，并且可以自由选择消息通道、fetch 调用、直接函数调用或 WebSocket 等通信方式。
- 不依赖 Node、Bun 或 Deno 的内建 API，因此可以在任何环境中运行。
- 容易与拥有自定义代码执行机制的工具集成，例如可以提供使用 `eval` 而不是 `new AsyncFunction` 的 runner。

最初的想法[由 Pooya Parsa 提出](https://github.com/nuxt/vite/pull/201)，随后 [Anthony Fu](https://github.com/antfu) 将其实现为 [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme) 包，用来[驱动 Nuxt 3 开发阶段的 SSR](https://antfu.me/posts/dev-ssr-on-nuxt)，后来也成为 [Vitest](https://vitest.dev) 的基础。因此，vite-node 的总体思路已经经过了相当长时间的实际检验。这一版 API 由 [Vladimir Sheremet](https://github.com/sheremet-va) 重新迭代。他此前已在 Vitest 中重新实现 vite-node，并将相关经验用于把 API 进一步增强，以更强大、更灵活的形式加入 Vite Core。这个 PR 历时一年完成，你可以在[这里](https://github.com/vitejs/vite/issues/12165)查看其演进过程以及与生态维护者的讨论。

::: info
Vite 运行时 API 后来演变为模块运行器 API，并作为[环境 API](/guide/api-environment)的一部分在 Vite 6 中发布。
:::

## 功能

### 改进对 `.css?url` 的支持

现在可以稳定、正确地将 CSS 文件作为 URL 导入。这是 Remix 迁移到 Vite 时最后一个尚未解决的障碍。参见 [#15259](https://github.com/vitejs/vite/issues/15259)。

### `build.assetsInlineLimit` 现在支持回调

用户现在可以[提供一个回调](/config/build-options.html#build-assetsinlinelimit)，通过返回布尔值来决定是否内联特定资源。返回 `undefined` 时则使用默认逻辑。参见 [#15366](https://github.com/vitejs/vite/issues/15366)。

### 改进循环导入的 HMR

在 Vite 5.0 中，即使循环导入中被接受的模块能够在客户端正常处理，也总会触发完整页面重载。现在这一行为有所放宽，允许正常应用 HMR；只有在 HMR 期间发生错误时才会重新加载页面。参见 [#15118](https://github.com/vitejs/vite/issues/15118)。

### 支持通过 `ssr.external: true` 外部化所有 SSR 包

过去，Vite 会外部化除链接包以外的所有包。新选项可以强制外部化包括链接包在内的所有包。这在 monorepo 测试中很有用，因为可以模拟所有包都被外部化的常见场景；使用 `ssrLoadModule` 加载任意文件而不关心 HMR 时，也可以始终外部化依赖。参见 [#10939](https://github.com/vitejs/vite/issues/10939)。

### 预览服务器暴露 `close` 方法

预览服务器现在暴露 `close` 方法，可正确关闭服务器及所有已经打开的 socket 连接。参见 [#15630](https://github.com/vitejs/vite/issues/15630)。

## 性能改进

Vite 的每个版本都在变得更快，Vite 5.1 也包含了大量性能提升。我们使用 [vite-dev-server-perf](https://github.com/yyx990803/vite-dev-server-perf)，测量了从 Vite 4.0 开始各个次要版本加载 1 万个模块的时间，模块树深度为 25 层。这是一项很适合衡量 Vite 免打包方案效果的基准测试。每个模块都是一个很小的 TypeScript 文件，包含一个计数器并导入树中的其他文件，因此测试主要衡量请求各个独立模块所需的时间。在 Vite 4.0 中，M1 Max 加载 1 万个模块需要 8 秒。在专注性能的 [Vite 4.3](./announcing-vite4-3.md) 中，我们取得突破，将时间缩短到 6.35 秒。Vite 5.1 再次实现性能跃升，现在只需 5.35 秒即可提供这 1 万个模块。

![Vite 加载 1 万个模块所需时间的变化](/vite5-1-10K-modules-loading-time.png)

上述基准结果运行在无头 Puppeteer 中，适合比较不同版本，但并不等同于用户实际感受到的时间。在 Chrome 无痕窗口中运行同样的 1 万个模块，结果如下：

| 1 万个模块       | Vite 5.0 | Vite 5.1 |
| ---------------- | :------: | :------: |
| 加载时间         |  2892ms  |  2765ms  |
| 加载时间（缓存） |  2778ms  |  2477ms  |
| 完整重载         |  2003ms  |  1878ms  |
| 完整重载（缓存） |  1682ms  |  1604ms  |

### 在线程中运行 CSS 预处理器

Vite 现在可以选择在线程中运行 CSS 预处理器。通过 [`css.preprocessorMaxWorkers: true`](/config/shared-options.html#css-preprocessormaxworkers) 即可启用。对于一个 Vuetify 2 项目，启用此功能后开发启动时间缩短了 40%。PR 中还有[其他配置的性能对比](https://github.com/vitejs/vite/pull/13584#issuecomment-1678827918)。参见 [#13584](https://github.com/vitejs/vite/issues/13584)，也欢迎[提供反馈](https://github.com/vitejs/vite/discussions/15835)。

### 改善服务器冷启动的新选项

设置 `optimizeDeps.holdUntilCrawlEnd: false` 可以切换到一种新的依赖优化策略，可能有助于改善大型项目的表现。我们正在考虑未来将其设为默认策略。欢迎[提供反馈](https://github.com/vitejs/vite/discussions/15834)。参见 [#15244](https://github.com/vitejs/vite/issues/15244)。

### 通过缓存检查加快解析

`fs.cachedChecks` 优化现在默认启用。在 Windows 上，它使 `tryFsResolve` 加快约 14 倍，并在三角形基准测试中让 ID 解析整体加快约 5 倍。参见 [#15704](https://github.com/vitejs/vite/issues/15704)。

### 内部性能改进

开发服务器还获得了多项渐进式性能提升：新增中间件以短路 304 响应（[#15586](https://github.com/vitejs/vite/issues/15586)）；避免在热点路径中调用 `parseRequest`（[#15617](https://github.com/vitejs/vite/issues/15617)）；现在会正确地延迟加载 Rollup（[#15621](https://github.com/vitejs/vite/issues/15621)）。

## 弃用

为了让项目能够长期维护，我们会在可行的情况下继续缩小 Vite 的 API 表面积。

### 弃用 `import.meta.glob` 的 `as` 选项

标准已经转向 [Import Attributes](https://github.com/tc39/proposal-import-attributes)，但我们目前不打算用新选项替代 `as`，而是建议用户切换到 `query`。参见 [#14420](https://github.com/vitejs/vite/issues/14420)。

### 移除实验性的构建时预打包

构建时预打包是 Vite 3 中加入的实验性功能，现已移除。随着 Rollup 4 将解析器切换为原生实现，以及 Rolldown 的持续开发，这项功能在性能以及开发与构建一致性方面的价值已经不再成立。我们希望继续改善开发与构建的一致性，并认为让 Rolldown 同时承担“开发时预打包”和“生产构建”是更好的长期方向。Rolldown 也可能实现一种比依赖预打包更适合构建阶段的高效缓存方式。参见 [#15184](https://github.com/vitejs/vite/issues/15184)。

## 参与贡献

我们感谢 [900 位 Vite Core 贡献者](https://github.com/vitejs/vite/graphs/contributors)，也感谢不断推动生态向前的插件、集成、工具和翻译维护者。如果你喜欢 Vite，欢迎参与并帮助我们。请查看[贡献指南](https://github.com/vitejs/vite/blob/v6/CONTRIBUTING.md)，参与 [issue 分类](https://github.com/vitejs/vite/issues)、[PR 审查](https://github.com/vitejs/vite/pulls)，在 [GitHub Discussions](https://github.com/vitejs/vite/discussions) 中回答问题，或在 [Vite Land](https://chat.vite.dev) 中帮助其他社区成员。

## 致谢

Vite 5.1 的发布离不开社区贡献者、生态维护者和 [Vite 团队](/team)。我们也要感谢赞助 Vite 开发的个人和公司：感谢 [StackBlitz](https://stackblitz.com/)、[Nuxt Labs](https://nuxtlabs.com/) 和 [Astro](https://astro.build) 聘请 Vite 团队成员，也感谢 [Vite GitHub Sponsors](https://github.com/sponsors/vitejs)、[Vite Open Collective](https://opencollective.com/vite) 和 [Evan You GitHub Sponsors](https://github.com/sponsors/yyx990803) 上的赞助者。
