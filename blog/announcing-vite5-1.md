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
      content: Vite 5.1 发布公告
  - - meta
    - property: og:image
      content: https://v5.cn.vite.dev/og-image-announcing-vite5-1.png
  - - meta
    - property: og:url
      content: https://v5.cn.vite.dev/blog/announcing-vite5-1
  - - meta
    - property: og:description
      content: Vite 5.1 发布公告
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.1 正式发布！

_2024 年 2 月 8 日_

![Vite 5.1 发布封面图片](/og-image-announcing-vite5-1.png)

去年 11 月，Vite 5 [正式发布](./announcing-vite5.md)，推动 Vite 及其生态系统再次实现重大飞跃。几周前，Vite 的 npm 周下载量突破 1000 万，仓库贡献者也达到 900 位。今天，我们很高兴地宣布 Vite 5.1 正式发布。

快速链接：[文档](/)、[更新日志](https://github.com/vitejs/vite/blob/v5/packages/vite/CHANGELOG.md#510-2024-02-08)

在 StackBlitz 中在线体验 Vite 5.1：[vanilla](https://vite.new/vanilla-ts)、[vue](https://vite.new/vue-ts)、[react](https://vite.new/react-ts)、[preact](https://vite.new/preact-ts)、[lit](https://vite.new/lit-ts)、[svelte](https://vite.new/svelte-ts)、[solid](https://vite.new/solid-ts)、[qwik](https://vite.new/qwik-ts)。

如果你刚开始接触 Vite，建议先阅读[快速上手](/guide/)和[功能](/guide/features)指南。

若想及时了解最新动态，请在 [X](https://x.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite) 上关注我们。

## Vite 运行时 API

Vite 5.1 对新的 Vite 运行时 API 提供了实验性支持。它可以先使用 Vite 插件处理任意代码，再运行处理后的代码。它与 `server.ssrLoadModule` 的区别在于，运行时实现与服务器相互解耦。这让库和框架作者能够自行实现服务器与运行时之间的通信层。这个新 API 稳定后，计划用来取代 Vite 现有的 SSR 原语。

新 API 带来了许多优势：

- 支持 SSR 过程中的 HMR。
- 它与服务器解耦，因此一台服务器可以供任意数量的客户端使用。每个客户端都有自己的模块缓存，通信方式也不受限制，可以使用消息通道、fetch 调用、直接函数调用或 WebSocket。
- 它不依赖任何 Node.js、Bun 或 Deno 内置 API，因此可以在任意环境中运行。
- 它很容易与具有自有代码执行机制的工具集成。例如，你可以提供一个使用 `eval` 而非 `new AsyncFunction` 的运行器。

这个想法最初[由 Pooya Parsa 提出](https://github.com/nuxt/vite/pull/201)，随后由 [Anthony Fu](https://github.com/antfu) 实现为 [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme) 软件包，为 [Nuxt 3 开发环境 SSR](https://antfu.me/posts/dev-ssr-on-nuxt)提供支持，后来也成为 [Vitest](https://vitest.dev) 的基础。因此，vite-node 的总体思路已经经过相当长时间的实践检验。这个新 API 是 [Vladimir Sheremet](https://github.com/sheremet-va) 对该思路的全新迭代。他此前已经在 Vitest 中重新实现过 vite-node，并将积累的经验用于把更强大、更灵活的 API 加入 Vite Core。这个 PR 历时一年完成，你可以[在这里查看它的演进过程以及与生态系统维护者的讨论](https://github.com/vitejs/vite/issues/12165)。

阅读 [Vite 运行时 API 指南](/guide/api-vite-runtime)了解更多信息，并[向我们提供反馈](https://github.com/vitejs/vite/discussions/15774)。

## 功能

### 改进对 `.css?url` 的支持

现在，以 URL 形式导入 CSS 文件的功能可以稳定、正确地工作。这也是 Remix 迁移到 Vite 所剩的最后一个障碍。参见 [#15259](https://github.com/vitejs/vite/issues/15259)。

### `build.assetsInlineLimit` 现在支持回调函数

用户现在可以[提供一个回调函数](/config/build-options#build-assetsinlinelimit)，通过返回布尔值决定是否内联特定资源。返回 `undefined` 时则应用默认逻辑。参见 [#15366](https://github.com/vitejs/vite/issues/15366)。

### 改进循环导入的 HMR

在 Vite 5.0 中，循环导入内被接受的模块总会触发整页重新加载，即使客户端能够正常处理它们。现在这一限制已经放宽，HMR 可以直接应用；如果 HMR 过程中发生任何错误，页面仍会重新加载。参见 [#15118](https://github.com/vitejs/vite/issues/15118)。

### 支持使用 `ssr.external: true` 外部化所有 SSR 软件包

一直以来，Vite 会外部化除链接软件包之外的所有软件包。这个新选项可以强制外部化包括链接软件包在内的所有软件包。在 monorepo 测试中需要模拟所有软件包均被外部化的常规场景，或者使用 `ssrLoadModule` 加载任意文件、无需考虑 HMR 并希望始终外部化软件包时，这个选项会很有帮助。参见 [#10939](https://github.com/vitejs/vite/issues/10939)。

### 预览服务器暴露 `close` 方法

预览服务器现在暴露了 `close` 方法，可以正确关闭服务器及所有已打开的套接字连接。参见 [#15630](https://github.com/vitejs/vite/issues/15630)。

## 性能改进

Vite 的每个版本都在持续提速，Vite 5.1 也包含大量性能改进。我们使用 [vite-dev-server-perf](https://github.com/yyx990803/vite-dev-server-perf) 测量了从 Vite 4.0 起各个次版本加载 1 万个模块（深度为 25 层的树）所需的时间。这个基准测试很适合衡量 Vite 无打包方案的效果。每个模块都是一个很小的 TypeScript 文件，包含一个计数器并导入树中的其他文件，因此它主要衡量分别请求各个模块所需的时间。在搭载 M1 Max 的设备上，Vite 4.0 加载 1 万个模块需要 8 秒。我们在 [Vite 4.3 的性能专项工作](./announcing-vite4-3.md)中取得突破，将时间缩短到 6.35 秒。Vite 5.1 再次实现性能跃升，现在只需 5.35 秒便可提供这 1 万个模块。

![Vite 加载 1 万个模块所需时间的变化](/vite5-1-10K-modules-loading-time.png)

以下基准测试结果来自无头 Puppeteer，很适合用于版本间比较，但并不代表用户实际感受到的时间。在 Chrome 无痕窗口中运行同样的 1 万个模块时，结果如下：

| 1 万个模块       | Vite 5.0 | Vite 5.1 |
| ---------------- | :------: | :------: |
| 加载时间         |  2892ms  |  2765ms  |
| 加载时间（缓存） |  2778ms  |  2477ms  |
| 完整重新加载     |  2003ms  |  1878ms  |
| 完整重新加载（缓存） | 1682ms | 1604ms |

### 在线程中运行 CSS 预处理器

Vite 现在支持选择在线程中运行 CSS 预处理器。可以通过 `css.preprocessorMaxWorkers: true` 启用此功能。对于 Vuetify 2 项目，这项功能让开发服务器启动时间缩短了 40%。PR 中还提供了[其他配置的性能对比](https://github.com/vitejs/vite/pull/13584#issuecomment-1678827918)。参见 [#13584](https://github.com/vitejs/vite/issues/13584)，并欢迎[提供反馈](https://github.com/vitejs/vite/discussions/15835)。

### 改善服务器冷启动的新选项

可以设置 `optimizeDeps.holdUntilCrawlEnd: false`，切换到一种新的依赖优化策略，它可能有助于改善大型项目的性能。我们正考虑在未来将其设为默认策略。欢迎[提供反馈](https://github.com/vitejs/vite/discussions/15834)。参见 [#15244](https://github.com/vitejs/vite/issues/15244)。

### 使用缓存检查加快解析

现在默认启用 `fs.cachedChecks` 优化。在 Windows 中，它让 `tryFsResolve` 的速度提高了约 14 倍，并使三角形基准测试中的 ID 整体解析速度提高了约 5 倍。参见 [#15704](https://github.com/vitejs/vite/issues/15704)。

### 内部性能改进

开发服务器还获得了多项渐进式性能提升：新增中间件以便在出现 304 时提前结束处理（[#15586](https://github.com/vitejs/vite/issues/15586)）；避免在热路径中调用 `parseRequest`（[#15617](https://github.com/vitejs/vite/issues/15617)）；现在还会正确地延迟加载 Rollup（[#15621](https://github.com/vitejs/vite/issues/15621)）。

## 弃用

我们继续尽可能缩小 Vite 的 API 表面积，让项目能够长期保持可维护性。

### 弃用 `import.meta.glob` 的 `as` 选项

相关标准已经转向 [Import Attributes](https://github.com/tc39/proposal-import-attributes)，但目前我们不打算用新选项取代 `as`，而是建议用户改用 `query`。参见 [#14420](https://github.com/vitejs/vite/issues/14420)。

### 移除实验性的构建时预打包

Vite 3 中加入的实验性功能“构建时预打包”现已移除。随着 Rollup 4 改用原生解析器，以及 Rolldown 的持续开发，这项功能在性能和开发、构建一致性方面的理由已经不再成立。我们希望继续改善开发与构建的一致性，并认为使用 Rolldown 同时完成“开发时预打包”和“生产构建”是更好的方向。Rolldown 还可能以远比依赖预打包更高效的方式实现构建缓存。参见 [#15184](https://github.com/vitejs/vite/issues/15184)。

## 参与贡献

我们感谢为 Vite Core 作出贡献的 [900 位贡献者](https://github.com/vitejs/vite/graphs/contributors)，以及持续推动生态发展的插件、集成、工具和翻译维护者。如果你喜欢 Vite，欢迎参与并帮助我们。请阅读[贡献指南](https://github.com/vitejs/vite/blob/v5/CONTRIBUTING.md)，参与[处理 issue](https://github.com/vitejs/vite/issues)、[审查 PR](https://github.com/vitejs/vite/pulls)、在 [GitHub Discussions](https://github.com/vitejs/vite/discussions) 中回答问题，并在 [Vite Land](https://chat.vite.dev) 中帮助其他社区成员。

## 致谢

Vite 5.1 的发布离不开社区贡献者和生态系统维护者，也离不开 [Vite 团队](/team)。特别感谢支持 Vite 开发的个人和公司：感谢 [StackBlitz](https://stackblitz.com/)、[Nuxt Labs](https://nuxtlabs.com/) 和 [Astro](https://astro.build) 聘用 Vite 团队成员，也感谢 [Vite GitHub Sponsors](https://github.com/sponsors/vitejs)、[Vite Open Collective](https://opencollective.com/vite) 和 [Evan You 的 GitHub Sponsors](https://github.com/sponsors/yyx990803)上的赞助者。
