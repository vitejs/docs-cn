---
title: Vite 5.1 is out!
author:
  name: The Vite Team
date: 2024-02-08
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 5.1
  - - meta
    - property: og:image
      content: https://vitejs.dev/og-image-announcing-vite5-1.png
  - - meta
    - property: og:url
      content: https://vitejs.dev/blog/announcing-vite5-1
  - - meta
    - property: og:description
      content: Vite 5.1 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image

---

#  Vite 5.1 发布啦！{#vite-5-1-is-out}

*2024年2月8日*

![Vite 5.1 发布公告封面图片](https://chat.openai.com/og-image-announcing-vite5-1.png)

Vite 5 上一个版本在去年11月发布，对于 Vite 和生态系统来说又是一次重大的飞跃。几周前，我们庆祝了每周有1000万次的 npm 下载量以及 Vite 仓库的 900 位贡献者。今天，我们很高兴地宣布 Vite 5.1 的发布。

快速链接: [文档](https://chat.openai.com/)，[更新日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#510-2024-02-08)

其他语言的文档: [简体中文](https://cn.vitejs.dev/)，[日本語](https://ja.vitejs.dev/)，[Español](https://es.vitejs.dev/)，[Português](https://pt.vitejs.dev/)，[한국어](https://ko.vitejs.dev/)，[Deutsch](https://de.vitejs.dev/)

在 StackBlitz 上在线尝试 Vite 5.1：[vanilla](https://vite.new/vanilla-ts)，[vue](https://vite.new/vue-ts)，[react](https://vite.new/react-ts)，[preact](https://vite.new/preact-ts)，[lit](https://vite.new/lit-ts)，[svelte](https://vite.new/svelte-ts)，[solid](https://vite.new/solid-ts)，[qwik](https://vite.new/qwik-ts)。

如果您是 Vite 的新手，我们建议先阅读 [入门指南](https://chat.openai.com/guide/) 和 [特性介绍](https://chat.openai.com/guide/features)。

想要及时了解最新信息，请关注我们在 [X](https://x.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite) 上的动态。

##  Vite 运行时 API {#vite-runtime-api}

Vite 5.1 增加了对新 Vite 运行时 API 的实验性支持。它允许通过先使用 Vite 插件处理任何代码来运行它。它与 `server.ssrLoadModule` 不同，因为运行时实现与服务器分离。这使得库和框架作者可以在服务器和运行时之间实现自己的通信层。一旦稳定下来，这个新 API 打算取代 Vite 当前的 SSR 原语。

新 API 带来了许多好处：

- 支持 SSR 期间的 HMR。
- 与服务器分离，因此单个服务器可以被多个客户端使用 - 每个客户端都有自己的模块缓存（您甚至可以按您想要的方式与其通信 - 使用消息通道/ fetch 调用/直接函数调用/ websocket）。
- 不依赖于任何 node/bun/deno 内置 API，因此可以在任何环境中运行。
- 它易于与具有自己运行代码机制的工具集成（例如，您可以提供一个运行器，以使用 `eval` 而不是 `new AsyncFunction`）。

最初的想法[由 Pooya Parsa 提出](https://github.com/nuxt/vite/pull/201)，由 [Anthony Fu](https://github.com/antfu) 实现为 [vite-node](https://github.com/vitest-dev/vitest/tree/main/packages/vite-node#readme) 包，用于 [驱动 Nuxt 3 Dev SSR](https://antfu.me/posts/dev-ssr-on-nuxt)，后来也作为 [Vitest](https://vitest.dev/) 的基础。因此，vite-node 的一般想法已经经过了相当长的时间的实战测试。这是由 [Vladimir Sheremet](https://github.com/sheremet-va) 进行的 API 的新迭代，他已经在 Vitest 中重新实现了 vite-node，并汲取了这些经验教训，使得在将其添加到 Vite 核心时 API 更加强大和灵活。这个 PR 历时一年，您可以在[这里](https://github.com/vitejs/vite/issues/12165)看到与生态系统维护者的演变和讨论。

在 [Vite 运行时 API 指南](https://chat.openai.com/guide/api-vite-runtime) 中了解更多信息，并[给我们反馈](https://github.com/vitejs/vite/discussions/15774)。

## 特性 {#features}

### 对 `.css?url` 的支持得到了改进

现在可以可靠且正确地将 CSS 文件作为 URL 导入。这是 Remix 切换到 Vite 的最后一个障碍。参见 ([#15259](https://github.com/vitejs/vite/issues/15259))。

### `build.assetsInlineLimit` 现在支持回调函数

用户现在可以[提供一个回调函数](https://chat.openai.com/config/build-options.html#build-assetsinlinelimit)，该函数返回一个布尔值，以选择特定资源是否进行内联。如果返回 `undefined`，则使用默认逻辑。参见 ([#15366](https://github.com/vitejs/vite/issues/15366))。

### 对循环引用的改进 HMR

在 Vite 5.0 中，循环引用中的已接受模块总是触发完整的页面重新加载，即使它们在客户端中可以很好地处理。现在放宽了这一限制，允许 HMR 在不进行完整页面重新加载的情况下应用，但如果在 HMR 过程中发生任何错误，页面将重新加载。参见 ([#15118](https://github.com/vitejs/vite/issues/15118))。

### 支持 `ssr.external: true` 以外部化所有 SSR 包

历史上，Vite 会将所有包外部化，除了已链接的包。这个新选项可以用来强制外部化所有包，包括已链接的包。在单体库存储库中的测试中，我们希望模拟所有包都外部化的常规情况，或者在使用 `ssrLoadModule` 加载任意文件时，我们总是希望外部化包，因为我们不关心 HMR。参见 ([#10939](https://github.com/vitejs/vite/issues/10939))。

### 在预览服务器中公开 `close` 方法

预览服务器现在公开了一个 `close` 方法，它将正确地撤销服务器，包括所有已打开的套接字连接。参见 ([#15630](https://github.com/vitejs/vite/issues/15630))。

## 性能改进 {#performance-improvements}

Vite 每个版本都在变得更快，而 Vite 5.1 中充满了性能改进。我们使用 [vite-dev-server-perf](https://github.com/yyx990803/vite-dev-server-perf) 对从 Vite 4.0 起的所有次要版本的 10K 个模块（25 层深度树）的加载时间进行了测量。这是一个很好的基准，用来衡量 Vite 无捆绑的方法的影响。每个模块都是一个带有计数器和对树中其他文件的导入的小 TypeScript 文件，因此主要测量的是执行请求的各个模块所需的时间。在 Vite 4.0 中，加载 10K 个模块在 M1 MAX 上花费了 8 秒。我们在 [Vite 4.3 中专注于性能](https://chat.openai.com/c/announcing-vite4-3.md)时取得了突破，我们能够在 6.35 秒内加载它们。在 Vite 5.1 中，我们设法再次提升了性能。Vite 现在在 5.35 秒内为这 10K 个模块提供服务。

![Vite 10K 模块加载时间进展](https://chat.openai.com/vite5-1-10K-modules-loading-time.png)

这个基准测试是在 Headless Puppeteer 上运行的，是比较版本的一个很好的方式。但它们不代表用户实际体验到的时间。当在 Chrome 的隐身窗口中运行相同的 10K 个模块时，我们有以下的表现：

| 10K Modules           | Vite 5.0 | Vite 5.1 |
| --------------------- | :------: | :------: |
| Loading time          |  2892ms  |  2765ms  |
| Loading time (cached) |  2778ms  |  2477ms  |
| Full reload           |  2003ms  |  1878ms  |
| Full reload (cached)  |  1682ms  |  1604ms  |

### 在线程中运行 CSS 预处理器 {#run-css-preprocessors-in-threads}

Vite 现在支持选择性地在线程中运行 CSS 预处理器。您可以使用 [`css.preprocessorMaxWorkers: true`](https://chat.openai.com/config/shared-options.html#css-preprocessormaxworkers) 启用它。对于一个 Vuetify 2 项目，在启用此功能后，开发启动时间减少了 40%。在 PR 中有其他设置的[性能比较](https://github.com/vitejs/vite/pull/13584#issuecomment-1678827918)。参见 ([#13584](https://github.com/vitejs/vite/issues/13584))。[提供反馈](https://github.com/vitejs/vite/discussions/15835)。

### 新选项来改善服务器冷启动 {#new-options-to-improve-server-cold-starts}

您可以设置 `optimizeDeps.holdUntilCrawlEnd: false` 来切换到一个在大型项目中可能有帮助的新的依赖项优化策略。我们正在考虑在未来默认切换到这种策略。[提供反馈](https://github.com/vitejs/vite/discussions/15834)。 ([#15244](https://github.com/vitejs/vite/issues/15244))

### 使用缓存检查加快解析速度 {#faster-resolving-with-cached-checks}

`fs.cachedChecks` 优化现在默认启用。在 Windows 上，`tryFsResolve` 使用它后快了约 ~14 倍，并且整体上在三角形基准中，解析 id 速度提高了约 ~5 倍。 ([#15704](https://github.com/vitejs/vite/issues/15704))

### 内部性能改进 {#internal-performance-improvements}

开发服务器有几个渐进性的性能提升。一个新的中间件可以在 304 上进行短路处理 ([#15586](https://github.com/vitejs/vite/issues/15586))。我们在热点路径中避免了 `parseRequest` ([#15617](https://github.com/vitejs/vite/issues/15617))。Rollup 现在被正确地延迟加载了 ([#15621](https://github.com/vitejs/vite/issues/15621))。

## 弃用项 {#deprecations}

我们继续尽可能减少 Vite 的 API 表面，以使项目能够长期维护。

### 弃用 `import.meta.glob` 中的 `as` 选项

标准已经迁移到了 [Import Attributes](https://github.com/tc39/proposal-import-attributes)，但我们目前没有计划用新选项替换 `as`。相反，建议用户切换到 `query`。参见 ([#14420](https://github.com/vitejs/vite/issues/14420))。

### 移除实验性的构建时预打包功能

Vite 3 中添加的实验性功能“构建时预打包”已被移除。随着 Rollup 4 切换其解析器为原生解析器，并且 Rolldown 正在开发中，这个功能的性能和开发与构建的一致性问题都不再有效。我们希望继续改进开发/构建的一致性，并且得出结论，使用 Rolldown 进行“开发期预打包”和“生产构建”是未来更好的选择。Rolldown 也可能实现一种在构建过程中比依赖项预打包更有效的缓存方式。参见 ([#15184](https://github.com/vitejs/vite/issues/15184))。

## 参与进来 {#get-Involved}

我们感谢 [Vite Core 的 900 名贡献者](https://github.com/vitejs/vite/graphs/contributors)，以及维护插件、集成、工具和翻译的人，他们不断推动着生态系统向前发展。如果您喜欢使用 Vite，我们邀请您参与并帮助我们。查看我们的 [贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)，并加入到 [问题的分类处理](https://github.com/vitejs/vite/issues)，[审查 PR](https://github.com/vitejs/vite/pulls)，在 [GitHub 讨论](https://github.com/vitejs/vite/discussions) 中回答问题，并在 [Vite Land](https://chat.vitejs.dev/) 社区帮助他人。

## 致谢 {#acknowledgments}

Vite 5.1 的成功离不开我们的贡献者社区、生态系统中的维护者以及 [Vite 团队](https://chat.openai.com/team)。特别感谢个人和公司对 Vite 开发的赞助支持。感谢 [StackBlitz](https://stackblitz.com/)、[Nuxt Labs](https://nuxtlabs.com/) 和 [Astro](https://astro.build/) 招聘了 Vite 团队成员。也感谢 [Vite 的 GitHub 赞助者](https://github.com/sponsors/vitejs)、[Vite 的 Open Collective](https://opencollective.com/vite) 和 [Evan You 的 GitHub 赞助者](https://github.com/sponsors/yyx990803)。
