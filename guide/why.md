# 为什么选 Vite {#why-vite}

随着 Web 应用的规模与复杂度不断攀升，构建工具也越来越难以跟上节奏。在大型项目上工作的开发者们深知其苦：开发服务器启动极慢、热更新迟缓、生产构建耗时漫长。一代又一代的构建工具在前人的基础上持续改进，但这些问题始终未能彻底解决。

Vite 正是为此而生。它并非对现有方案的小修小补，而是重新思考了开发阶段应该如何提供代码服务。此后，Vite 历经多个主要版本的迭代，每一次都在适应生态的新能力：从利用浏览器原生的 ES 模块，到采用全面基于 Rust 的工具链。

如今，众多框架和工具都以 Vite 为基础。其架构设计旨在随 Web 平台不断演进，而非绑定于某一特定方案，使其成为你可以长期依赖的基石。

## 起源 {#the-origins}

Vite 诞生之初，浏览器刚刚获得了对 [ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)（ESM）的广泛支持。ESM 允许浏览器直接加载 JavaScript 文件，无需工具事先将它们打包成单个文件。而传统的构建工具（通常称为 _打包器_）会在浏览器展示任何内容之前，将整个应用预先处理一遍。应用越大，等待的时间就越长。

Vite 采用了一种截然不同的方式，将工作拆分为两部分：

- **依赖**（几乎不会变动的库）：使用快速的原生工具 [预构建](./dep-pre-bundling.md) 一次，即可随时就绪。
- **源码**（频繁变动的应用代码）：通过原生 ESM 按需提供。浏览器只加载当前页面所需的内容，Vite 则在请求时对每个文件进行转换。

这意味着无论应用规模多大，开发服务器的启动几乎都是即时的。当你修改某个文件时，Vite 通过原生 ESM 的 [模块热替换](./features.md#hot-module-replacement)（HMR）只更新浏览器中的对应模块，无需整页刷新，也无需等待重新构建。

<script setup>
import bundlerSvg from '../images/bundler.svg?raw'
import esmSvg from '../images/esm.svg?raw'
</script>
<svg-image :svg="bundlerSvg" />

_在基于打包器的开发服务器中，整个应用会在提供服务之前先完成打包。_

<svg-image :svg="esmSvg" />

_在基于 ESM 的开发服务器中，模块在浏览器请求时按需提供。_

Vite 并非第一个探索这种方式的工具。[Snowpack](https://www.snowpack.dev/) 开创了非打包式开发，并启发了 Vite 的依赖预构建；Preact 团队的 [WMR](https://github.com/preactjs/wmr) 启发了可同时用于开发与构建的通用插件 API；[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/) 影响了 Vite 1.0 的服务器架构。Vite 在这些思想的基础上继续前行。

尽管非打包的 ESM 在开发阶段运行良好，但由于嵌套导入会带来额外的网络往返，将其直接用于生产环境仍然低效。这也是 [为什么打包对于优化生产构建依然必要](https://rolldown.rs/in-depth/why-bundlers) 的原因。

## 与生态系统共同成长 {#growing-with-the-ecosystem}

随着 Vite 的成熟，各大框架开始将其作为构建层。其 [插件 API](./api-plugin.md) 基于 Rollup 的惯例，使框架无需绕过 Vite 内部机制就能自然集成。[Nuxt](https://nuxt.com/)、[SvelteKit](https://svelte.dev/docs/kit)、[Astro](https://astro.build/)、[React Router](https://reactrouter.com/)、[Analog](https://analogjs.org/)、[SolidStart](https://start.solidjs.com/) 等众多框架都选择了 Vite 作为基础。[Vitest](https://vitest.dev/) 和 [Storybook](https://storybook.js.org/) 等工具也在其之上构建，将 Vite 的影响力扩展到了应用打包之外。[Laravel](https://laravel.com/docs/vite) 和 [Ruby on Rails](https://vite-ruby.netlify.app/) 等后端框架也集成了 Vite 来处理前端资源流水线。

这种增长并非单向的。生态系统塑造了 Vite，正如 Vite 塑造了生态系统。Vite 团队运行着 [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)，对每一次 Vite 变更都会测试生态中的主要项目。生态系统的健康不是事后才考虑的问题，而是发布流程的一部分。

## 统一的工具链 {#a-unified-toolchain}

Vite 最初在底层依赖两个独立的工具：[esbuild](https://esbuild.github.io/) 负责开发阶段的快速编译，[Rollup](https://rollupjs.org/) 负责生产构建中的深度优化。这套方案可行，但维护两条流水线带来了不一致性：不同的转换行为、各自独立的插件系统，以及越来越多的粘合代码来保持两者对齐。

[Rolldown](https://rolldown.rs/) 的出现将二者统一为一个打包器：用 Rust 编写以获得原生速度，并与生态系统已依赖的同一套插件 API 兼容。它使用 [Oxc](https://oxc.rs/) 进行解析、转换和压缩。这赋予了 Vite 一条端到端的工具链，其中构建工具、打包器和编译器共同维护，作为一个整体协同演进。

最终的结果是一条从开发到 [生产](./build.md) 的统一流水线。迁移过程经过了精心设计：先发布了 [技术预览版](https://voidzero.dev/posts/announcing-rolldown-vite)，让早期用户验证变更；生态系统 CI 尽早捕获兼容性问题；兼容层则保留了现有配置的支持。

## Vite 的未来方向 {#where-vite-is-heading}

Vite 的架构仍在持续演进，以下几个方向正在塑造其未来：

- **完整打包模式**：非打包的 ESM 在 Vite 创建之初是正确的权衡，因为彼时没有任何工具既足够快速，又具备开发阶段打包所需的 HMR 和插件能力。Rolldown 改变了这一局面。由于超大型代码库可能因大量未打包的网络请求而导致页面加载缓慢，团队正在探索一种开发服务器以类似生产环境方式打包代码的模式，以降低网络开销。

- **Environment API**：不再将 "客户端" 和 "SSR" 视为仅有的两种构建目标，[Environment API](./api-environment-instances.md) 允许框架定义自定义环境（边缘运行时、Service Worker 及其他部署目标），每个环境都有各自的模块解析和执行规则。随着代码运行位置与方式不断多样化，Vite 的模型也随之扩展。

- **与 JavaScript 同步演进**：Oxc 和 Rolldown 与 Vite 紧密协作，新的语言特性和标准可以在整个工具链中快速采用，无需等待上游依赖。

Vite 的目标不是成为终极工具，而是成为一个能够随 Web 平台持续演进、与构建在其上的开发者共同成长的工具。
