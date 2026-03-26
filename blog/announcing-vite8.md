---
title: Vite 8.0 is out!
author:
  name: The Vite Team
date: 2026-03-12
sidebar: false
head:
  - - meta
    - property: og:type
      content: website
  - - meta
    - property: og:title
      content: Announcing Vite 8
  - - meta
    - property: og:image
      content: https://vite.dev/og-image-announcing-vite8.webp
  - - meta
    - property: og:url
      content: https://vite.dev/blog/announcing-vite8
  - - meta
    - property: og:description
      content: Vite 8 Release Announcement
  - - meta
    - name: twitter:card
      content: summary_large_image
---

<<<<<<< HEAD
# Vite 8.0 发布了！{#vite-8-0-is-out}

_2026年3月12日_

![Vite 8 Announcement Cover Image](/og-image-announcing-vite8.webp)

今天，我们很高兴地宣布 Vite 8 正式发布了！当 Vite 首次推出时，我们做出了一个务实的选择：在开发期间使用 esbuild 进行快速编译，而在生产构建中使用 Rollup 进行优化。这个选择多年来一直为我们服务。我们非常感谢 Rollup 和 esbuild 的维护者。没有他们，Vite 不可能成功。今天，它终于统一了：Vite 8 使用 [Rolldown](https://rolldown.rs/) 作为其单一、统一、基于 Rust 的打包工具，提供高达 10-30 倍的构建速度，同时保持完整的插件兼容性。这是自 Vite 2 以来最重要的架构变化。

Vite 现在每周被下载 6500 万次，生态系统继续随着每个版本的增长而增长。为了帮助开发者导航不断扩展的插件生态系统，我们还推出了 [registry.vite.dev](https://registry.vite.dev)，一个可搜索的插件目录，收集 Vite、Rolldown 和 Rollup 的插件数据，每日从 npm 收集。

快速链接：

- [英文文档](https://vite.dev)
- 翻译版本：[简体中文](/)、[日本語](https://ja.vite.dev/)、[Español](https://es.vite.dev/)、[Português](https://pt.vite.dev/)、[한국어](https://ko.vite.dev/)、[Deutsch](https://de.vite.dev/)、[فارسی](https://fa.vite.dev/)
- [迁移指南](/guide/migration)
- [GitHub 变更日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

可通过 [vite.new](https://vite.new) 在线体验 Vite 8 或使用你喜欢的框架运行 `pnpm create vite` 搭建一个 Vite 应用。更多详情请参见 [入门指南](/guide/)。

我们邀请你帮助我们改进 Vite（加入超过 [1.2K 贡献者到 Vite Core](https://github.com/vitejs/vite/graphs/contributors)），我们的依赖，或插件和生态系统中的项目。更多详情请参见我们的 [贡献指南](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md)。一个很好的开始方式是 [分类问题](https://github.com/vitejs/vite/issues)，[审查 PR](https://github.com/vitejs/vite/pulls)，基于开放问题发送测试 PR，并在 [Discussions](https://github.com/vitejs/vite/discussions) 或 Vite Land 的 [帮助论坛](https://discord.com/channels/804011606160703521/1019670660856942652) 中支持其他人。如果你有任何问题，加入我们的 [Discord 社区](https://chat.vite.dev) 并在 [#contributing 频道](https://discord.com/channels/804011606160703521/804439875226173480) 与我们交谈。

保持更新并与构建在 Vite 之上的其他人保持联系，通过在 [Bluesky](https://bsky.app/profile/vite.dev)、[X](https://twitter.com/vite_js) 或 [Mastodon](https://webtoo.ls/@vite) 上关注我们。

## 由 Rolldown 驱动的 Vite {#the-rolldown-powered-vite}

### 问题 {#the-problem}

Vite 最早的版本依赖于两个独立的打包工具来满足不同的需求。[esbuild](https://esbuild.github.io/) 在开发期间进行快速编译（依赖预打包和 TypeScript/JSX 转换），使得开发体验感觉非常即时。[Rollup](https://rollupjs.org/) 处理生产构建、分块和优化，其丰富的插件 API 支撑了整个 Vite 插件生态系统。

这种双打包工具的方法为 Vite 服务了多年。它让我们能够专注于开发者体验和协调，而不是重新发明解析和打包。但它也带来了一些权衡。两个独立的转换管道意味着两个独立的插件系统，以及越来越多的粘合代码需要保持两个管道同步。不一致的模块处理边缘情况随着时间的推移积累起来，每个管道中的对齐修复都可能引入另一个管道中的不一致。

### 解决方案 {#the-solution}

[Rolldown](https://rolldown.rs/) 是一个由 [VoidZero](https://voidzero.dev) 团队构建的基于 Rust 的打包工具，旨在直接解决这些挑战。它设计了三个目标：

- **性能:** 用 Rust 编写，Rolldown 运行速度与原生应用相当。在基准测试中，它比 Rollup [快 10-30 倍](https://github.com/rolldown/benchmarks)，与 esbuild 的性能水平相匹配。
- **兼容性:** Rolldown 支持与 Rollup 和 Vite 相同的插件 API。大多数现有的 Vite 插件在 Vite 8 中可以开箱即用。
- **高级功能:** 一个统一的打包工具解锁了双打包工具设置中难以或不可能的功能，包括全量打包模式、更灵活的分块拆分、模块级持久缓存和模块联邦支持。

### 走向稳定的旅程 {#the-journey-to-stable}

Rolldown 的迁移是经过深思熟虑和社区驱动的。首先，一个单独的 [`rolldown-vite`](https://voidzero.dev/posts/announcing-rolldown-vite) 包作为技术预览发布，允许早期采用者测试 Rolldown 的集成，而不会影响 Vite 的稳定版本。早期采用者的反馈非常有价值。他们通过各种规模和形状的真实项目代码库推动集成，发现了边缘情况和兼容性问题，我们可以在更广泛的发布前解决这些问题。我们还建立了一个专门的 CI 套件，验证关键的 Vite 插件和框架与新的打包工具的兼容性，早期发现回归问题并建立对迁移路径的信心。

在 2025 年 12 月，我们发布了 [Vite 8 beta](/blog/announcing-vite8-beta)，Rolldown 完全集成。在 beta 阶段，Rolldown 本身从 beta 发展到发布候选版本，持续的改进由 Vite 社区的测试和反馈驱动。

### 实际项目中的性能 {#real-world-performance}

在 `rolldown-vite` 的预览和 beta 阶段，几家公司报告了生产构建时间的显著减少：

- **Linear:** 生产构建时间从 46 秒减少到 6 秒
- **Ramp:** 57% 构建时间减少
- **Mercedes-Benz.io:** 高达 38% 的构建时间减少
- **Beehiiv:** 64% 构建时间减少

对于大型项目，影响尤其明显，我们预计随着 Rolldown 的不断发展，还会有进一步的改进。

### 统一的工具链 {#a-unified-toolchain}

在 Vite 8 中，Vite 成为了端到端工具链的入口，由密切合作的团队维护：构建工具（Vite）、打包工具（Rolldown）和编译器（[Oxc](https://oxc.rs/)）。这种一致性确保了整个技术栈的行为一致性，从解析到转换和压缩。它还意味着我们可以快速采用新的语言规范，因为 JavaScript 在不断发展。通过跨层集成，我们可以追求以前无法实现的各种优化，例如利用 Oxc 的语义分析来改进 Rolldown 中的 tree-shaking 操作。

### 对社区的感谢 {#thank-you-to-the-community}

如果没有更广泛的社区，这一切都不可能实现。我们想要向框架团队（[SvelteKit](https://svelte.dev/docs/kit/introduction)、[React Router](https://reactrouter.com/)、[Storybook](https://storybook.js.org/)、[Astro](https://astro.build/)、[Nuxt](https://nuxt.com/) 等）表示衷心的感谢，他们早期测试了 `rolldown-vite`，提交了详细的错误报告，并与我们合作解决兼容性问题。我们同样感激每一位尝试 beta 版的开发者，分享了他们的构建时间改进，并报告了帮助我们完善这个版本的各种粗糙边缘。你们在真实项目上测试迁移的意愿帮助我们使迁移到 Rolldown 变得更加平滑和可靠。

## Node.js 版本要求 {#node-js-support}

Vite 8 要求 Node.js 20.19+、22.12+，与 Vite 7 相同。这些范围确保 Node.js 默认支持 `require(esm)`，而不需要通过 flags 启用，允许 Vite 作为 ESM-only 包分发。

## 新增功能 {#additional-features}

除了 Rolldown 集成之外，Vite 8 还包括几个值得注意的功能：

- **内置 tsconfig `paths` 支持:** 开发者可以通过将 [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths) 设置为 `true` 来启用 TypeScript 路径别名解析。这会有一些性能成本，并且默认未启用。

- **`emitDecoratorMetadata` 支持:** Vite 8 现在内置了对 TypeScript [`emitDecoratorMetadata` 选项](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata) 的自动支持，无需外部插件。更多详情请参见 [功能](/guide/features.md#emitdecoratormetadata) 页面。

- **Wasm SSR 支持:** [`.wasm?init` 导入](/guide/features#webassembly) 现在能在 SSR 环境中工作，将 Vite 的 WebAssembly 功能扩展到服务器端渲染。

- **浏览器控制台转发:** Vite 8 可以将浏览器控制台日志和错误转发到开发服务器终端。这在使用 code agent 时特别有用，因为运行时客户端错误可以在 CLI 输出中可见。通过 [`server.forwardConsole`](/config/server-options.md#server-forwardconsole) 启用，当检测到 code agent 时会自动激活。

## `@vitejs/plugin-react` v6 {#@vitejs/plugin-react-v6}

随着 Vite 8 的发布，我们发布了 `@vitejs/plugin-react` v6。插件使用 Oxc 进行 React Refresh 转换。Babel 不再是依赖项，安装体积更小。

对于需要 [React Compiler](https://react.dev/learn/react-compiler) 的项目，v6 提供了一个 `reactCompilerPreset` 助手，与 `@rolldown/plugin-babel` 配合使用，为你提供默认配置好的显式启用路径。

更多详情请参见 [发布说明](https://github.com/vitejs/vite-plugin-react/releases/tag/plugin-react%406.0.0)。

请注意，v5 仍然与 Vite 8 兼容，因此你可以在升级 Vite 后升级插件。

## 展望未来 {#looking-ahead}

Rolldown 集成打开了改进和优化的大门。以下是我们接下来要做的：

- **全打包模式** (实验性): 这个模式在开发期间捆绑模块，类似于生产构建。初步结果显示 3 倍更快的开发服务器启动，40% 更快的完全重新加载，以及 10 倍更少的网络请求。这对于大型项目来说尤其具有影响力，其中无捆绑的开发方法达到了扩展限制。

- [**原始抽象语法树传输**](https://github.com/oxc-project/oxc/issues/2409): 允许 JavaScript 插件以最小的序列化开销访问 Rust 生成的 AST，弥合 Rust 内部和 JS 插件代码之间的性能差距。

- [**原生魔法字符串转换**](https://rolldown.rs/in-depth/native-magic-string#native-magicstring): 启用自定义转换，其中逻辑在 JavaScript 中，但字符串操作计算在 Rust 中运行。

- **稳定环境 API**: 我们正在努力使环境 API 稳定。生态系统已经开始定期会议，以更好地协作。

## 安装大小 {#install-size}

我们想要透明地对待 Vite 安装大小的变化。Vite 8 本身比 Vite 7 大约大 15 MB。这来自两个主要来源：

- **~10 MB 来自 lightningcss**: 以前是一个可选的 peer 依赖项，lightningcss 现在是一个普通依赖项，提供更好的开箱即用的CSS 压缩。
- **~5 MB 来自 Rolldown**: Rolldown 二进制文件比 esbuild + Rollup 更大，主要是因为性能优化，更倾向于速度而不是二进制大小。

随着 Rolldown 逐渐成熟，我们将继续密切关注并努力减少安装大小。

## 迁移到 Vite 8 {#migrating-to-vite-8}

对于大多数项目，升级到 Vite 8 应该是一个顺利的过程。我们构建了一个兼容层，自动转换现有的 `esbuild` 和 `rollupOptions` 到它们的 Rolldown 和 Oxc 等价配置，因此许多项目可以在没有配置更改的情况下工作。

对于较大或更复杂的项目，我们建议采用渐进迁移路径：首先从 Vite 7 切换到 `rolldown-vite` 包，以隔离任何 Rolldown 特定问题，然后升级到 Vite 8。这种方法可以轻松识别任何问题是否来自打包工具变化或其他 Vite 8 变化。

请在升级前仔细阅读 [迁移指南](/guide/migration)。完整的变更列表在 [Vite 8 变更日志](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md) 中。

## 对 Rollup 和 esbuild 的感谢{#thank-you-to-rollup-and-esbuild}

当 Vite 迁移到 Rolldown 时，我们想要花一点时间表达我们对两个项目深深的感激之情，正是它们让 Vite 成为可能。

Rollup 自始至终都是 Vite 的生产打包工具。它的优雅插件 API 设计如此精心构思，以至于 Rolldown 将其作为自己的设计，而 Vite 的整个插件生态系统正是因为 Rollup 奠定的基础而存在。Rollup 架构的质量和思考方式塑造了 Vite 对扩展性的思考。感谢 [Rich Harris](https://github.com/Rich-Harris) 创建 Rollup，以及 [Lukas Taegert-Atkinson](https://github.com/lukastaegert) 和 Rollup 团队维护和推进它，使其对 Web 工具生态系统产生了如此深远的影响。

esbuild 从早期开始为 Vite 提供了令人惊叹的快速开发体验：依赖预打包、TypeScript 和 JSX 转换，完成时间以毫秒而不是数百毫秒。esbuild 证明了构建工具可以以数量级更快，它的速度设定了一个标杆，激励了一整代基于 Rust 和 Go 的工具。感谢 [Evan Wallace](https://github.com/evanw)，为我们展示了所有可能的东西。

如果没有这两个项目，Vite 今天就不会存在。即使我们继续使用 Rolldown，Rollup 和 esbuild 的影响也深深植根于 Vite 的 DNA 中，我们感激一切他们为生态系统所做的一切。你可以在我们的 [致谢](/acknowledgements) 页面了解更多关于 Vite 依赖的所有项目和人员。

## 致谢 {#acknowledgments}

Vite 8 由 [sapphi-red](https://github.com/sapphi-red) 和 [Vite 团队](/team) 领导，在贡献者、下游维护者和插件作者的广泛社区的帮助下。我们想要感谢 [Rolldown 团队](https://rolldown.rs/team) 在他们密切合作下使 Rolldown 驱动的 Vite 8 成为可能。我们特别感激每一位参与 `rolldown-vite` 预览和 Vite 8 beta 阶段的人。你们的测试、错误报告和反馈使 Rolldown 迁移成为可能，并塑造了这个我们引以为豪的版本。

Vite 由 [VoidZero](https://voidzero.dev) 提供，与 [Bolt](https://bolt.new/) 和 [NuxtLabs](https://nuxtlabs.com/) 合作。我们还要感谢我们在 [Vite 的 GitHub Sponsors](https://github.com/sponsors/vitejs) 和 [Vite 的 Open Collective](https://opencollective.com/vite) 的赞助商。
=======
# Vite 8.0 is out!

_March 12, 2026_

![Vite 8 Announcement Cover Image](/og-image-announcing-vite8.webp)

We're thrilled to announce the stable release of Vite 8! When Vite first launched, we made a pragmatic bet on two bundlers: esbuild for speed during development, and Rollup for optimized production builds. That bet served us well for years. We're very grateful to the Rollup and esbuild maintainers. Vite wouldn't have succeeded without them. Today, it resolves into one: Vite 8 ships with [Rolldown](https://rolldown.rs/) as its single, unified, Rust-based bundler, delivering up to 10-30x faster builds while maintaining full plugin compatibility. This is the most significant architectural change since Vite 2.

Vite is now being downloaded 65 million times a week, and the ecosystem continues to grow with every release. To help developers navigate the ever-expanding plugin landscape, we also launched [registry.vite.dev](https://registry.vite.dev), a searchable directory of plugins for Vite, Rolldown, and Rollup that collects plugin data from npm daily.

Quick links:

- [Docs](/)
- Translations: [简体中文](https://cn.vite.dev/), [日本語](https://ja.vite.dev/), [Español](https://es.vite.dev/), [Português](https://pt.vite.dev/), [한국어](https://ko.vite.dev/), [Deutsch](https://de.vite.dev/), [فارسی](https://fa.vite.dev/)
- [Migration Guide](/guide/migration)
- [GitHub Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md)

Play online with Vite 8 using [vite.new](https://vite.new) or scaffold a Vite app locally with your preferred framework running `pnpm create vite`. Check out the [Getting Started Guide](/guide/) for more information.

We invite you to help us improve Vite (joining the more than [1.2K contributors to Vite Core](https://github.com/vitejs/vite/graphs/contributors)), our dependencies, or plugins and projects in the ecosystem. Learn more at our [Contributing Guide](https://github.com/vitejs/vite/blob/main/CONTRIBUTING.md). A good way to get started is by [triaging issues](https://github.com/vitejs/vite/issues), [reviewing PRs](https://github.com/vitejs/vite/pulls), sending tests PRs based on open issues, and supporting others in [Discussions](https://github.com/vitejs/vite/discussions) or Vite Land's [help forum](https://discord.com/channels/804011606160703521/1019670660856942652). If you have questions, join our [Discord community](https://chat.vite.dev) and talk to us in the [#contributing channel](https://discord.com/channels/804011606160703521/804439875226173480).

Stay updated and connect with others building on top of Vite by following us on [Bluesky](https://bsky.app/profile/vite.dev), [X](https://twitter.com/vite_js), or [Mastodon](https://webtoo.ls/@vite).

## The Rolldown-Powered Vite

### The problem

Since its earliest versions, Vite relied on two separate bundlers to serve different needs. [esbuild](https://esbuild.github.io/) handled fast compilation during development (dependency pre-bundling and TypeScript/JSX transforms) that made the dev experience feel instant. [Rollup](https://rollupjs.org/) handled production bundling, chunking, and optimization, with its rich plugin API powering the entire Vite plugin ecosystem.

This dual-bundler approach served Vite well for years. It allowed us to focus on developer experience and orchestration rather than reinventing parsing and bundling from scratch. But it came with trade-offs. Two separate transformation pipelines meant two separate plugin systems, and an increasing amount of glue code needed to keep the two pipelines in sync. Edge cases around inconsistent module handling accumulated over time, and every alignment fix in one pipeline risked introducing differences in the other.

### The solution

[Rolldown](https://rolldown.rs/) is a Rust-based bundler built by the [VoidZero](https://voidzero.dev) team to address these challenges head-on. It was designed with three goals:

- **Performance:** Written in Rust, Rolldown operates at native speed. In benchmarks, it is [10-30x faster than Rollup](https://github.com/rolldown/benchmarks) matching esbuild's performance level.
- **Compatibility:** Rolldown supports the same plugin API as Rollup and Vite. Most existing Vite plugins work out of the box with Vite 8.
- **Advanced features:** A single unified bundler unlocks capabilities that were difficult or impossible with the dual-bundler setup, including full bundle mode, more flexible chunk splitting, module-level persistent caching, and Module Federation support.

### The journey to stable

The migration to Rolldown was deliberate and community-driven. First, a separate [`rolldown-vite`](https://voidzero.dev/posts/announcing-rolldown-vite) package was released as a technical preview, allowing early adopters to test Rolldown's integration without affecting the stable version of Vite. The feedback from those early adopters was invaluable. They pushed the integration through real-world codebases of every shape and size, surfacing edge cases and compatibility issues we could address before a wider release. We also set up a dedicated CI suite validating key Vite plugins and frameworks against the new bundler, catching regressions early and building confidence in the migration path.

In December 2025, we shipped the [Vite 8 beta](/blog/announcing-vite8-beta) with Rolldown fully integrated. During the beta period, Rolldown itself progressed from beta to a release candidate, with continuous improvements driven by the testing and feedback of the Vite community.

### Real-world performance

During the preview and beta phases of `rolldown-vite`, several companies reported measurable reductions in production build times:

- **Linear:** Production build times dropped from 46s to 6s
- **Ramp:** 57% build time reduction
- **Mercedes-Benz.io:** Up to 38% build time reduction
- **Beehiiv:** 64% build time reduction

For large projects, the impact can be especially noticeable, and we expect further improvements as Rolldown continues to evolve.

### A unified toolchain

With Vite 8, Vite becomes the entry point to an end-to-end toolchain with closely collaborating teams: the build tool (Vite), the bundler (Rolldown), and the compiler ([Oxc](https://oxc.rs/)). This alignment ensures consistent behavior across the entire stack, from parsing and resolving to transforming and minifying. It also means we can rapidly adopt new language specifications as JavaScript evolves. And by integrating deeply across layers, we can pursue optimizations that were previously out of reach, such as leveraging Oxc's semantic analysis for better tree-shaking in Rolldown.

### Thank you to the community

None of this would have been possible without the broader community. We want to extend our deep thanks to the framework teams ([SvelteKit](https://svelte.dev/docs/kit/introduction), [React Router](https://reactrouter.com/), [Storybook](https://storybook.js.org/), [Astro](https://astro.build/), [Nuxt](https://nuxt.com/), and many others) who tested `rolldown-vite` early, filed detailed bug reports, and worked with us to resolve compatibility issues. We are equally grateful to every developer who tried the beta, shared their build time improvements, and reported the rough edges that helped us polish this release. Your willingness to test the migration on real projects helped make the transition to Rolldown smoother and more reliable.

## Node.js Support

Vite 8 requires Node.js 20.19+, 22.12+, the same requirements as Vite 7. These ranges ensure Node.js supports `require(esm)` without a flag, allowing Vite to be distributed as ESM only.

## Additional Features

Beyond the Rolldown integration, Vite 8 includes several notable features:

- **Integrated Devtools:** Vite 8 ships [`devtools`](/config/shared-options#devtools) option to enable [Vite Devtools](https://devtools.vite.dev/), a developer tooling for debugging and analysis. Vite Devtools provide deeper insights into your Vite-powered projects directly from the dev server.

- **Built-in tsconfig `paths` support:** Developers can enable TypeScript path alias resolution by setting [`resolve.tsconfigPaths`](/config/shared-options.md#resolve-tsconfigpaths) to `true`. This has a small performance cost and is not enabled by default.

- **`emitDecoratorMetadata` support:** Vite 8 now has built-in automatic support for TypeScript's `emitDecoratorMetadata` option, removing the need for external plugins. See the [Features](/guide/features.md#emitdecoratormetadata) page for details.

- **Wasm SSR support:** [`.wasm?init` imports](/guide/features#webassembly) now work in SSR environments, expanding Vite's WebAssembly feature to server-side rendering.

- **Browser console forwarding:** Vite 8 can forward browser console logs and errors to the dev server terminal. This is especially useful when working with coding agents, as runtime client errors become visible in the CLI output. Enable it with [`server.forwardConsole`](/config/server-options.md#server-forwardconsole), which activates automatically when a coding agent is detected.

## `@vitejs/plugin-react` v6

Alongside Vite 8, we are releasing `@vitejs/plugin-react` v6. The plugin uses Oxc for React Refresh transform. Babel is no longer a dependency and the installation size is smaller.

For projects that need the [React Compiler](https://react.dev/learn/react-compiler), v6 provides a `reactCompilerPreset` helper that works with `@rolldown/plugin-babel`, giving you an explicit opt-in path without burdening the default setup.

See [the Release Notes](https://github.com/vitejs/vite-plugin-react/releases/tag/plugin-react%406.0.0) for more details.

Note that v5 still works with Vite 8, so you can upgrade the plugin after upgrading Vite.

## Looking Ahead

The Rolldown integration opens the door to improvements and optimizations. Here is what we are working on next:

- **Full Bundle Mode** (experimental): This mode bundles modules during development, similar to production builds. Preliminary results show 3x faster dev server startup, 40% faster full reloads, and 10x fewer network requests. This is especially impactful for large projects where the unbundled dev approach hits scaling limits.

- [**Raw AST transfer**](https://github.com/oxc-project/oxc/issues/2409): Allows JavaScript plugins to access the Rust-produced AST with minimal serialization overhead, bridging the performance gap between Rust internals and JS plugin code.

- [**Native MagicString transforms**](https://rolldown.rs/in-depth/native-magic-string#native-magicstring): Enables custom transforms where the logic lives in JavaScript but the string manipulation computation runs in Rust.

- **Stabilizing the Environment API**: We are working to make the Environment API stable. The ecosystem has started regular meetings to better collaborate together.

## Install Size

We want to be transparent about changes to Vite's install size. Vite 8 is approximately 15 MB larger than Vite 7 on its own. This comes from two main sources:

- **~10 MB from lightningcss**: Previously an optional peer dependency, lightningcss is now a normal dependency to provide better CSS minification out of the box.
- **~5 MB from Rolldown**: The Rolldown binary is larger than esbuild + Rollup mainly due to performance optimizations that favor speed over binary size.

We will continue monitoring and working to reduce install size as Rolldown matures.

## Migrating to Vite 8

For most projects, upgrading to Vite 8 should be a smooth process. We built a compatibility layer that auto-converts existing `esbuild` and `rollupOptions` configuration to their Rolldown and Oxc equivalents, so many projects will work without any config changes.

For larger or more complex projects, we recommend the gradual migration path: first switch from `vite` to the `rolldown-vite` package on Vite 7 to isolate any Rolldown-specific issues, then upgrade to Vite 8. This two-step approach makes it easy to identify whether any issues come from the bundler change or from other Vite 8 changes.

Please review the detailed [Migration Guide](/guide/migration) before upgrading. The complete list of changes is in the [Vite 8 Changelog](https://github.com/vitejs/vite/blob/main/packages/vite/CHANGELOG.md).

## Thank You, Rollup and esbuild

As Vite moves to Rolldown, we want to take a moment to express our deep gratitude to the two projects that made Vite possible.

Rollup has been Vite's production bundler since the very beginning. Its elegant plugin API design proved so well-conceived that Rolldown adopted it as its own, and Vite's entire plugin ecosystem exists because of the foundation Rollup laid. The quality and thoughtfulness of Rollup's architecture shaped how Vite thinks about extensibility. Thank you, [Rich Harris](https://github.com/Rich-Harris) for creating Rollup, and [Lukas Taegert-Atkinson](https://github.com/lukastaegert) and the Rollup team for maintaining and evolving it into something that has had such a lasting impact on the web tooling ecosystem.

esbuild powered Vite's remarkably fast development experience from its early days: dependency pre-bundling, TypeScript and JSX transforms that completed in milliseconds rather than hundreds. esbuild proved that build tools could be orders of magnitude faster, and its speed set the bar that inspired an entire generation of Rust and Go-based tooling. Thank you, [Evan Wallace](https://github.com/evanw), for showing all of us what was possible.

Without these two projects, Vite would not exist as it does today. Even as we move forward with Rolldown, the influence of Rollup and esbuild is deeply embedded in Vite's DNA, and we are grateful for everything they have given to the ecosystem. You can learn more about all the projects and people Vite depends on at our [Acknowledgements](/acknowledgements) page.

## Acknowledgments

Vite 8 was led by [sapphi-red](https://github.com/sapphi-red) and the [Vite Team](/team) with the help of the wide community of contributors, downstream maintainers, and plugin authors. We want to thank the [Rolldown team](https://rolldown.rs/team) for their close collaboration in making the Rolldown-powered Vite 8 possible. We are also especially grateful to everyone who participated in the `rolldown-vite` preview and the Vite 8 beta period. Your testing, bug reports, and feedback made the Rolldown migration possible and shaped this release into something we are proud of.

Vite is brought to you by [VoidZero](https://voidzero.dev), in partnership with [Bolt](https://bolt.new/) and [NuxtLabs](https://nuxtlabs.com/). We also want to thank our sponsors on [Vite's GitHub Sponsors](https://github.com/sponsors/vitejs) and [Vite's Open Collective](https://opencollective.com/vite).
>>>>>>> 9fa3be92938ceef543cd488d6659c387db8ca6b4
