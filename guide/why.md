# 为什么选 Vite {#why-vite}

## 现实问题 {#the-problems}

在浏览器支持 ES 模块之前，JavaScript 并没有提供原生机制让开发者以模块化的方式进行开发。这也正是我们对 “打包” 这个概念熟悉的原因：使用工具抓取、处理并将我们的源码模块串联成可以在浏览器中运行的文件。

时过境迁，我们见证了诸如 [webpack](https://webpack.js.org/)、[Rollup](https://rollupjs.org) 和 [Parcel](https://parceljs.org/) 等工具的变迁，它们极大地改善了前端开发者的开发体验。

然而，当我们开始构建越来越大型的应用时，需要处理的 JavaScript 代码量也呈指数级增长。包含数千个模块的大型项目相当普遍。基于 JavaScript 开发的工具就会开始遇到性能瓶颈：通常需要很长时间（甚至是几分钟！）才能启动开发服务器，即使使用模块热替换（HMR），文件修改后的效果也需要几秒钟才能在浏览器中反映出来。如此循环往复，迟钝的反馈会极大地影响开发者的开发效率和幸福感。

Vite 旨在利用生态系统中的新进展解决上述问题：浏览器开始原生支持 ES 模块，且越来越多 JavaScript 工具使用编译型语言编写。

### 缓慢的服务器启动 {#slow-server-start}

当冷启动开发服务器时，基于打包器的方式启动必须优先抓取并构建你的整个应用，然后才能提供服务。

Vite 通过在一开始将应用中的模块区分为 **依赖** 和 **源码** 两类，改进了开发服务器启动时间。

- **依赖** 大多为在开发时不会变动的纯 JavaScript。一些较大的依赖（例如有上百个模块的组件库）处理的代价也很高。依赖也通常会存在多种模块化格式（例如 ESM 或者 CommonJS）。

  Vite 将会使用 [esbuild](https://esbuild.github.io/) [预构建依赖](./dep-pre-bundling)。esbuild 使用 Go 编写，并且比以 JavaScript 编写的打包器预构建依赖快 10-100 倍。

- **源码** 通常包含一些并非直接是 JavaScript 的文件，需要转换（例如 JSX，CSS 或者 Vue/Svelte 组件），时常会被编辑。同时，并不是所有的源码都需要同时被加载（例如基于路由拆分的代码模块）。

  Vite 以 [原生 ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 方式提供源码。这实际上是让浏览器接管了打包程序的部分工作：Vite 只需要在浏览器请求源码时进行转换并按需提供源码。根据情景动态导入代码，即只在当前屏幕上实际使用时才会被处理。

<script setup>
import bundlerSvg from '../images/bundler.svg?raw'
import esmSvg from '../images/esm.svg?raw'
</script>
<svg-image :svg="bundlerSvg" />
<svg-image :svg="esmSvg" />

### 缓慢的更新 {#slow-updates}

基于打包启动时，当源文件被修改后，重新构建整个包是低效的，原因显而易见：更新速度会随着应用体积的增加而线性下降。

一些打包器的开发服务器将构建内容存入内存，这样它们只需要在文件更改时使模块图的一部分失活<sup>[[1]](#footnote-1)</sup>，但它也仍需要整个重新构建并重载页面。这样代价很高，并且重新加载页面会消除应用的当前状态，所以打包器支持了动态模块热替换（HMR）：允许一个模块 “热替换” 它自己，而不会影响页面其余部分。这大大改进了开发体验 —— 然而，在实践中我们发现，即使采用了 HMR 模式，其热更新速度也会随着应用规模的增长而显著下降。

在 Vite 中，HMR 是在原生 ESM 上执行的。当编辑一个文件时，Vite 只需要精确地使已编辑的模块与其最近的 HMR 边界之间的链失活<sup>[[1]](#footnote-1)</sup>（大多数时候只是模块本身），使得无论应用大小如何，HMR 始终能保持快速更新。

Vite 同时利用 HTTP 头来加速整个页面的重新加载（再次让浏览器为我们做更多事情）：源码模块的请求会根据 `304 Not Modified` 进行协商缓存，而依赖模块请求则会通过 `Cache-Control: max-age=31536000,immutable` 进行强缓存，因此一旦被缓存它们将不需要再次请求。

一旦你体验到 Vite 的神速，你是否愿意再忍受像曾经那样使用打包器开发就要打上一个大大的问号了。

## 为什么生产环境仍需打包 {#why-bundle-for-production}

尽管原生 ESM 现在得到了广泛支持，但由于嵌套导入会导致额外的网络往返，在生产环境中发布未打包的 ESM 仍然效率低下（即使使用 HTTP/2）。为了在生产环境中获得最佳的加载性能，最好还是将代码进行 tree-shaking、懒加载和 chunk 分割（以获得更好的缓存）。

要确保开发服务器和生产环境构建之间的最优输出和行为一致并不容易。所以 Vite 附带了一套 [构建优化](./features#build-optimizations) 的 [构建命令](./build)，开箱即用。

### 为何不用 ESBuild 打包？ {#why-not-bundle-with-esbuild}

虽然 Vite 利用 esbuild [在开发中预打包一些依赖](./dep-pre-bundling.md)，但 Vite 不会在生产构建中使用 esbuild 作为打包工具。

Vite 目前的插件 API 与使用 `esbuild` 作为打包器并不兼容。尽管 `esbuild` 速度更快，但 Vite 采用了 Rollup 灵活的插件 API 和基础建设，这对 Vite 在生态中的成功起到了重要作用。目前来看，我们认为 Rollup 提供了更好的性能与灵活性方面的权衡。

Rollup 已经开始着手改进性能，[在 v4 中将其解析器切换到 SWC](https://github.com/rollup/rollup/pull/5073)。同时还有一个正在进行中的工作，即构建一个名为 Rolldown 的 Rust 版本的 Rollup。一旦 Rolldown 准备就绪，它就可以在 Vite 中取代 Rollup 和 esbuild，显著提高构建性能，并消除开发和构建之间的不一致性。你可以观看 [Evan You 在 ViteConf 2023 的主题演讲](https://youtu.be/hrdwQHoAp0M) 了解更多细节。

## Vite 与 X 的区别是？ {#how-is-vite-different-from-x}

你可以查看 [比较](./comparisons) 章节获取更多细节，了解 Vite 与同类工具的异同。

<small class="cn-footnote">
<br/>
<strong class="title">译者注</strong>
<a id="footnote-1"></a>[1] 暂以意译方式呈现。
</small>
