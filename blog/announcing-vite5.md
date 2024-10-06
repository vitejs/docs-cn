---
title: Vite 5.0 is out!
author:
  name: The Vite Team
date: 2023-11-16
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 5
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite5.png
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite5
  - - meta
    - property: og:description
      content: Vite 5 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

# Vite 5.0 发布了！{#vite-5-0-is-out}

_2023年11月16日_

![Vite 5公告封面图片](/og-image-announcing-vite5.png)

Vite 4 发布了将近一年，它为生态系统奠定了坚实的基础。每周的 npm 下载量从250万增加到了750万，因为项目不断在共享基础设施上构建。各种框架不断创新，除了 [Astro](https://astro.build/)、[Nuxt](https://nuxt.com/)、[SvelteKit](https://kit.svelte.dev/)、[Solid Start](https://www.solidjs.com/blog/introducing-solidstart)、[Qwik City](https://qwik.builder.io/qwikcity/overview/) 等等之外，我们看到新的框架加入并使生态系统变得更加强大。[RedwoodJS](https://redwoodjs.com/) 和 [Remix](https://remix.run/) 转向 Vite 为 React 生态系统的进一步采用铺平了道路。[Vitest](https://vitest.dev) 的增长速度甚至比 Vite 还要快。其团队一直在努力工作，并将很快 [发布 Vitest 1.0](https://github.com/vitest-dev/vitest/issues/3596)。当与其他工具一起使用时，如 [Storybook](https://storybook.js.org)、[Nx](https://nx.dev) 和 [Playwright](https://playwright.dev)，Vite 的故事不断改善，环境也是如此，Vite 的开发在 [Deno](https://deno.com) 和 [Bun](https://bun.sh) 中都可以工作。

一个月前，我们举办了第二届 [ViteConf](https://viteconf.org/23/replay)，由 [StackBlitz](https://stackblitz.com) 主办。像去年一样，生态系统中的大多数项目聚在一起分享想法，并保持连接以持续扩展共同体。我们也看到新的组件补充了元框架工具包，比如 [Volar](https://volarjs.dev/) 和 [Nitro](https://nitro.unjs.io/)。Rollup 团队在同一天发布了 [Rollup 4](https://rollupjs.org)，这是去年 Lukas 开创的传统。

六个月前，Vite 4.3 [发布了](./announcing-vite4.md)。这个版本显著改善了开发服务器的性能。但是，还有很大的改进空间。在 ViteConf 上，[Evan You 揭示了 Vite 的长期计划，即着手开发 Rolldown](https://www.youtube.com/watch?v=hrdwQHoAp0M)，这是 Rollup 的 Rust 版本，具有兼容的 API。一旦准备就绪，我们打算在 Vite Core 中使用它，以执行 Rollup 和 esbuild 的任务。这将意味着构建性能的提升（随着我们将 Vite 本身的性能敏感部分转移到 Rust，开发性能也将在以后提升），以及减少开发和构建之间的不一致性。Rolldown 目前处于早期阶段，团队正准备在年底之前开源代码库。敬请期待！

今天，我们在 Vite 的道路上又迈出了一个重要的里程碑。Vite [团队](/team)、[贡献者](https://github.com/vitejs/vite/graphs/contributors) 和生态系统合作伙伴，很高兴地宣布发布 Vite 5。Vite 现在使用 [Rollup 4](https://github.com/vitejs/vite/pull/14508)，这已经是构建性能的重大提升。而且还有一些新选项可以改进你的开发服务器性能。

Vite 5 的重点是清理 API（删除已弃用的功能）并简化几个功能，解决了长期存在的问题，例如切换 `define` 以使用正确的 AST 替换而不是正则表达式。我们还在继续采取措施未来证明 Vite（现在需要 Node.js 18+，并且已经 [弃用了 CJS Node API](/guide/migration#deprecate-cjs-node-api)）。

快速链接：

- [文档](/)
- [迁移指南](/guide/migration)
- [变更日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16)

其他语言的文档：

- [简体中文](https://cn.vite.dev/)
- [日本語](https://ja.vite.dev/)
- [Español](https://es.vite.dev/)
- [Português](https://pt.vite.dev/)
- [한국어](https://ko.vite.dev/)
- [Deutsch](https://de.vite.dev/)（新增翻译！）

如果你是 Vite 的新用户，我们建议你先阅读 [入门指南](/guide/) 和 [功能](/guide/features) 指南。

我们感谢超过 [850 位对 Vite Core 作出贡献的贡献者](https://github.com/vitejs/vite/graphs/contributors)，以及 Vite 插件、集成、工具和翻译的维护者和贡献者，他们帮助我们达到了这一里程碑。我们鼓励你参与进来，继续与我们一起改进 Vite。你可以在我们的 [贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md) 中了解更多信息。要开始，我们建议你 [处理问题](https://github.com/vitejs/vite/issues)，[审查 PR](https://github.com/vitejs/vite/pulls)，基于开放的问题发送失败的测试 PR，并在 [讨论](https://github.com/vitejs/vite/discussions) 和 Vite Land 的 [帮助论坛](https://discord.com/channels/804011606160703521/1019670660856942652) 中帮助其他人。你会在这个过程中学到很多，并顺利地进一步为项目做出贡献。如果你有疑问，请加入我们的 [Discord 社区](http://chat.vite.dev/)，并在 [#contributing 频道](https://discord.com/channels/804011606160703521/804439875226173480) 上打个招呼。

要保持最新，请关注我们在 [X](https://twitter.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite) 上的动态。

##  使用 Vite 5 快速开始 {#quick-start-with-vite-5}

使用 `pnpm create vite` 来创建一个 Vite 项目，并选择你喜欢的框架，或者通过在线的模板使用 [vite.new](https://vite.new/) 来体验 Vite 5。你也可以运行 `pnpm create vite-extra` 来获取其他框架和运行时的模板（如 Solid、Deno、SSR 和库的起始模板）。当你在 `Others` 选项下运行 `create vite` 时，`create vite-extra` 的模板也是可用的。

请注意，Vite 起始模板旨在用作测试 Vite 与不同框架的沙盒。在构建下一个项目时，我们建议使用每个框架推荐的起始模板。一些框架现在在 `create vite` 中也重定向到它们的起始模板（Vue 的 `create-vue` 和 `Nuxt 3`，以及 Svelte 的 `SvelteKit`）。

## Node.js 支持 {#node-js-support}

Vite 不再支持已达到 EOL 的 Node.js 14 / 16 / 17 / 19。现在需要 Node.js 18 / 20+。

## 性能方面 {#performance}

除了 Rollup 4 的构建性能改进之外，现在还有一个新指南，帮助你识别和修复常见的性能问题，网址为 [https://vite.dev/guide/performance](/guide/performance)。

Vite 5 还引入了 [server.warmup](/guide/performance.html#warm-up-frequently-used-files)，这是一个新功能，用于改善启动时间。它允许你定义一个模块列表，在服务器启动时应预先转换。当使用 [`--open` 或 `server.open`](/config/server-options.html#server-open) 时，Vite 还将自动预热你的应用程序的入口点或提供的要打开的 URL。

## 主要变化 {#main-changes}

- [Vite is now powered by Rollup 4](/guide/migration#rollup-4)
- [The CJS Node API has been deprecated](/guide/migration#deprecate-cjs-node-api)
- [Rework `define` and `import.meta.env.*` replacement strategy](/guide/migration#rework-define-and-import-meta-env-replacement-strategy)
- [SSR externalized modules value now matches production](/guide/migration#ssr-externalized-modules-value-now-matches-production)
- [`worker.plugins` is now a function](/guide/migration#worker-plugins-is-now-a-function)
- [Allow path containing `.` to fallback to index.html](/guide/migration#allow-path-containing-to-fallback-to-index-html)
- [Align dev and preview HTML serving behavior](/guide/migration#align-dev-and-preview-html-serving-behaviour)
- [Manifest files are now generated in `.vite` directory by default](/guide/migration#manifest-files-are-now-generated-in-vite-directory-by-default)
- [CLI shortcuts require an additional `Enter` press](/guide/migration#cli-shortcuts-require-an-additional-enter-press)
- [Update `experimentalDecorators` and `useDefineForClassFields` TypeScript behavior](/guide/migration#update-experimentaldecorators-and-usedefineforclassfields-typescript-behaviour)
- [Remove `--https` flag and `https: true`](/guide/migration#remove-https-flag-and-https-true)
- [Remove `resolvePackageEntry` and `resolvePackageData` APIs](/guide/migration#remove-resolvepackageentry-and-resolvepackagedata-apis)
- [Removes previously deprecated APIs](/guide/migration#removed-deprecated-apis)
- [Read more about advanced changes affecting plugin and tool authors](/guide/migration#advanced)

## 迁移到 Vite 5 {#migrating-to-vite-5}

我们与生态系统合作伙伴合作，确保平稳迁移到这个新的主要版本。再次感谢 [vite-ecosystem-ci](https://www.youtube.com/watch?v=7L4I4lDzO48)，它对我们进行更大胆的改变并避免回退起到了关键作用。我们很高兴看到其他生态系统采用类似的方案，以改善其项目与下游维护者之间的协作。

对于大多数项目来说，升级到 Vite 5 应该是直截了当的。但我们建议在升级之前查看 [详细的迁移指南](/guide/migration)。

你可以在 [Vite 5 变更日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md#500-2023-11-16) 中找到对 Vite 核心的全面变更列表。

## 致谢 {#acknowledgments}

Vite 5 是我们社区的贡献者、下游维护者、插件作者和 [Vite 团队](/team) 长时间工作的结果。特别感谢 [Bjorn Lu](https://twitter.com/bluwyoo) 在这个主要版本的发布过程中的领导。

我们还要感谢个人和公司对 Vite 开发的赞助。[StackBlitz](https://stackblitz.com/)、[Nuxt Labs](https://nuxtlabs.com/) 和 [Astro](https://astro.build/) 继续通过雇佣 Vite 团队成员来投资 Vite。向 [Vite](https://github.com/sponsors/vitejs)、[Vite 的 Open Collective](https://opencollective.com/vite) 和 [Evan You](https://github.com/sponsors/yyx990803) 的赞助者表示感谢。特别感谢 [Remix](https://remix.run/) 成为金牌赞助商，并在转向 Vite 后回馈社区。
