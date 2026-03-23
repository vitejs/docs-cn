# 为什么选 Vite {#why-vite}

<<<<<<< HEAD
## 现实问题 {#the-problems}

在浏览器支持 ES 模块之前，JavaScript 并没有提供原生机制让开发者以模块化的方式进行开发。这也正是我们对 “打包” 这个概念熟悉的原因：使用工具抓取、处理并将我们的源码模块串联成可以在浏览器中运行的文件。

时过境迁，我们见证了诸如 [webpack](https://webpack.js.org/)、[Rollup](https://cn.rollupjs.org) 和 [Parcel](https://parceljs.org/) 等工具的变迁，它们极大地改善了前端开发者的开发体验。

然而，当我们开始构建越来越大型的应用时，需要处理的 JavaScript 代码量也呈指数级增长。包含数千个模块的大型项目相当普遍。基于 JavaScript 开发的工具就会开始遇到性能瓶颈：通常需要很长时间（甚至是几分钟！）才能启动开发服务器，即使使用模块热替换（HMR），文件修改后的效果也需要几秒钟才能在浏览器中反映出来。如此循环往复，迟钝的反馈会极大地影响开发者的开发效率和幸福感。

Vite 旨在利用生态系统中的新进展解决上述问题：浏览器开始原生支持 ES 模块，且越来越多 JavaScript 工具使用编译型语言编写。

### 缓慢的服务器启动 {#slow-server-start}

当冷启动开发服务器时，基于打包器的方式启动必须优先抓取并构建你的整个应用，然后才能提供服务。

Vite 通过在一开始将应用中的模块区分为 **依赖** 和 **源码** 两类，改进了开发服务器启动时间。

- **依赖** 大多为在开发时不会变动的纯 JavaScript。一些较大的依赖（例如有上百个模块的组件库）处理的代价也很高。依赖也通常会存在多种模块化格式（例如 ESM 或者 CommonJS）。

  Vite 将会使用 [esbuild](https://esbuild.github.io/) [预构建依赖](./dep-pre-bundling.md)。esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。

- **源码** 通常包含一些并非直接是 JavaScript 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载（例如基于路由拆分的代码模块）。

  Vite 以 [原生 ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据条件动态导入代码，即只在当前屏幕上实际使用时才会被处理。
=======
As web applications have grown in size and complexity, the tools used to build them have struggled to keep up. Developers working on large projects have experienced painfully slow dev server startups, sluggish hot updates, and long production build times. Each generation of build tooling has improved on the last, but these problems have persisted.

Vite was created to address this. Rather than incrementally improving existing approaches, it rethought how code should be served during development. Since then, Vite has evolved through multiple major versions, each time adapting to new capabilities in the ecosystem: from leveraging native ES modules in the browser, to adopting a fully Rust-powered toolchain.

Today, Vite powers many frameworks and tools. Its architecture is designed to evolve with the web platform rather than lock into any single approach, making it a foundation you can build on for the long term.

## The Origins

When Vite was first created, browsers had just gained wide support for [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) (ESM), a way to load JavaScript files directly, without needing a tool to bundle them into a single file first. Traditional build tools (often called _bundlers_) would process your entire application upfront before anything could be shown in the browser. The larger the app, the longer you waited.

Vite took a different approach. It split the work into two parts:

- **Dependencies** (libraries that rarely change) are [pre-bundled](./dep-pre-bundling.md) once using fast native tooling, so they're ready instantly.
- **Source code** (your application code that changes frequently) is served on-demand over native ESM. The browser loads only what it needs for the current page, and Vite transforms each file as it's requested.

This meant dev server startup was nearly instant, regardless of application size. When you edited a file, Vite used [Hot Module Replacement](./features.md#hot-module-replacement) (HMR) over native ESM to update just that module in the browser, without a full page reload or waiting for a rebuild.
>>>>>>> 68671e35e504eda64caa7f43b4016d5d7879f070

<script setup>
import bundlerSvg from '../images/bundler.svg?raw'
import esmSvg from '../images/esm.svg?raw'
</script>
<svg-image :svg="bundlerSvg" />

_In a bundle-based dev server, the entire application is bundled before it can be served._

<svg-image :svg="esmSvg" />

<<<<<<< HEAD
### 缓慢的更新 {#slow-updates}

基于打包启动时，当源文件被修改后，重新构建整个包是低效的，原因显而易见：更新速度会随着应用体积的增加而线性下降。

一些打包器的开发服务器将构建内容存入内存，这样它们只需要在文件更改时使模块图的一部分失活，但它也仍需要整个重新构建并重载页面。这样代价很高，并且重新加载页面会消除应用的当前状态，所以打包器支持了动态模块热替换（HMR）：允许一个模块 “热替换” 它自己，而不会影响页面其余部分。这大大改进了开发体验 —— 然而，在实践中我们发现，即使采用了 HMR 模式，其热更新速度也会随着应用规模的增长而显著下降。

在 Vite 中，HMR 是在原生 ESM 上执行的。当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活（大多数时候只是模块本身），使得无论应用大小如何，HMR 始终能保持快速更新。

Vite 同时利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：源码模块的请求会根据 `304 Not Modified` 进行协商缓存，而依赖模块请求则会通过 `Cache-Control: max-age=31536000,immutable` 进行强缓存，因此一旦被缓存它们将不需要再次请求。

一旦你体验到 Vite 的神速，你可能再也不想回到曾经的打包开发方式了。

## 为什么生产环境仍需打包 {#why-bundle-for-production}

尽管原生 ESM 现在得到了广泛支持，但由于嵌套导入会导致额外的网络往返，在生产环境中发布未打包的 ESM 仍然效率低下（即使使用 HTTP/2）。为了在生产环境中获得最佳的加载性能，最好还是将代码进行 tree-shaking、懒加载和 chunk 分割（以获得更好的缓存）。

要确保开发服务器和生产环境构建之间的最优输出和行为一致并不容易。所以 Vite 附带了一套 [构建优化](./features.md#build-optimizations) 的 [构建命令](./build.md)，开箱即用。

### 为何不用 ESBuild 打包？ {#why-not-bundle-with-esbuild}

虽然 Vite 利用 esbuild [在开发中预打包一些依赖](./dep-pre-bundling.md)，但 Vite 不会在生产构建中使用 esbuild 作为打包工具。

Vite 目前的插件 API 与使用 `esbuild` 作为打包器并不兼容。尽管 `esbuild` 速度更快，但 Vite 采用了 Rollup 灵活的插件 API 和基础建设，这对 Vite 在生态中的成功起到了重要作用。目前来看，我们认为 Rollup 提供了更好的性能与灵活性方面的权衡。

Rollup 已经开始着手改进性能，[在 v4 中将其解析器切换到 SWC](https://github.com/rollup/rollup/pull/5073)。同时还有一个正在进行中的工作，即构建一个名为 Rolldown 的 Rust 版本的 Rollup。一旦 Rolldown 准备就绪，它就可以在 Vite 中取代 Rollup 和 esbuild，显著提高构建性能，并消除开发和构建之间的不一致性。你可以观看 [Evan You 在 ViteConf 2023 的主题演讲](https://youtu.be/hrdwQHoAp0M) 了解更多细节。

## Vite 与其他免打包构建工具的关系是什么？{#how-vite-relates-to-other-unbundled-build-tools}

Preact 团队的 [WMR](https://github.com/preactjs/wmr) 旨在提供类似的功能集。Vite 用于开发和构建的通用 Rollup 插件 API 就是受其启发。WMR 已经不再维护。Preact 团队现在推荐使用 Vite 和 [@preactjs/preset-vite](https://github.com/preactjs/preset-vite)。

[Snowpack](https://www.snowpack.dev/) 也是一个免打包的原生 ESM 开发服务器，与 Vite 的职责非常相似。Vite 的依赖预打包也受到了 Snowpack v1（现在是 [`esinstall`](https://github.com/snowpackjs/snowpack/tree/main/esinstall)）的启发。Snowpack 已经不再维护。Snowpack 团队现在正在研究由 Vite 驱动的静态网站构建器 [Astro](https://astro.build/)。

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/)（以前是 `es-dev-server`）是一个伟大的项目，Vite 1.0 的基于 Koa 的服务器设置就是受其启发。`@web` 这个项目正在积极维护，并包含许多其他优秀的工具，这些工具也可能对 Vite 用户有所帮助。
=======
_In an ESM-based dev server, modules are served on-demand as the browser requests them._

Vite was not the first tool to explore this approach. [Snowpack](https://www.snowpack.dev/) pioneered unbundled development and inspired Vite's dependency pre-bundling. [WMR](https://github.com/preactjs/wmr) by the Preact team inspired the universal plugin API that works in both dev and build. [@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) influenced Vite 1.0's server architecture. Vite built on these ideas and carried them forward.

Even though unbundled ESM works well during development, shipping it in production is still inefficient due to additional network round trips from nested imports. That's [why bundling is still necessary](https://rolldown.rs/in-depth/why-bundlers) for optimized production builds.

## Growing with the Ecosystem

As Vite matured, frameworks began adopting it as their build layer. Its [plugin API](./api-plugin.md), based on Rollup's conventions, made integration natural without requiring frameworks to work around Vite's internals. [Nuxt](https://nuxt.com/), [SvelteKit](https://svelte.dev/docs/kit), [Astro](https://astro.build/), [React Router](https://reactrouter.com/), [Analog](https://analogjs.org/), [SolidStart](https://start.solidjs.com/), and others chose Vite as their foundation. Tools like [Vitest](https://vitest.dev/) and [Storybook](https://storybook.js.org/) built on it too, extending Vite's reach beyond app bundling. Backend frameworks like [Laravel](https://laravel.com/docs/vite) and [Ruby on Rails](https://vite-ruby.netlify.app/) integrated Vite for their frontend asset pipelines.

This growth was not one-directional. The ecosystem shaped Vite as much as Vite shaped the ecosystem. The Vite team runs [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci), which tests major ecosystem projects against every Vite change. Ecosystem health is not an afterthought. It is part of the release process.

## A Unified Toolchain

Vite originally relied on two separate tools under the hood: [esbuild](https://esbuild.github.io/) for fast compilation during development, and [Rollup](https://rollupjs.org/) for thorough optimization in production builds. This worked, but maintaining two pipelines introduced inconsistencies: different transformation behaviors, separate plugin systems, and growing glue code to keep them aligned.

[Rolldown](https://rolldown.rs/) was built to unify both into a single bundler: written in Rust for native speed, and compatible with the same plugin API the ecosystem already relied on. It uses [Oxc](https://oxc.rs/) for parsing, transforming, and minifying. This gives Vite an end-to-end toolchain where the build tool, bundler, and compiler are maintained together and evolve as a unit.

The result is one consistent pipeline from development to [production](./build.md). The migration was done carefully: a [technical preview](https://voidzero.dev/posts/announcing-rolldown-vite) shipped first so early adopters could validate the change, ecosystem CI caught compatibility issues early, and a compatibility layer preserved existing configurations.

## Where Vite is Heading

Vite's architecture continues to evolve. Several efforts are shaping its future:

- **Full bundle mode**: Unbundled ESM was the right tradeoff when Vite was created because no tool was both fast enough and had the HMR and plugin capabilities needed to bundle during dev. Rolldown changes that. Since exceptionally large codebases can experience slow page loads due to the high number of unbundled network requests, the team is exploring a mode where the dev server bundles code similarly to production, reducing network overhead.

- **Environment API**: Instead of treating "client" and "SSR" as the only two build targets, the [Environment API](./api-environment-instances.md) lets frameworks define custom environments (edge runtimes, service workers, and other deployment targets), each with their own module resolution and execution rules. As where and how code runs continues to diversify, Vite's model expands with it.

- **Evolving with JavaScript**: With Oxc and Rolldown closely collaborating with Vite, new language features and standards can be adopted quickly across the entire toolchain, without waiting on upstream dependencies.

Vite's goal is not to be the final tool, but to be one that keeps evolving with the web platform, and with the developers building on it.
>>>>>>> 68671e35e504eda64caa7f43b4016d5d7879f070
