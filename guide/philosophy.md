# 项目理念 {#project-philosophy}

## 精简且可扩展的核心 {#lean-extendable-core}

Vite 并不打算覆盖每个用户的所有使用场景。Vite 旨在开箱即用地支持构建 Web 应用最常见的模式，但 [Vite 核心包](https://github.com/vitejs/vite)必须保持精简，并维持较小的 API 表面积，从而让项目能够长期维护。这一目标得益于 [Vite 基于 Rollup 的插件系统](./api-plugin.md)。能够通过外部插件实现的功能通常不会加入 Vite 核心。[vite-plugin-pwa](https://vite-pwa-org.netlify.app/) 很好地展示了 Vite 核心之外可以实现的强大功能，此外还有许多[维护良好的插件](https://github.com/vitejs/awesome-vite#plugins)可以满足不同需求。Vite 与 Rollup 项目紧密合作，尽可能确保插件既可用于纯 Rollup 项目，也可用于 Vite 项目，并在可能时将所需扩展贡献到上游插件 API。

## 推动现代 Web 开发 {#pushing-the-modern-web}

Vite 提供了一系列推动编写现代代码的特定功能。例如：

- 源代码必须采用 ESM 形式编写；对于非 ESM 的依赖项，为了正常工作，需要[预先将其打包为 ESM](./dep-pre-bundling)。
- 建议使用 [`new Worker` 语法](./features#web-workers)编写 Web Worker，以遵循现代标准。
- 在浏览器环境中不能直接使用 Node.js 模块。

新增功能时，我们会遵循这些模式来构建具有前瞻性的 API；因此这些 API 不一定始终与其他构建工具兼容。

## 旨在高性能的实用方案 {#a-pragmatic-approach-to-performance}

Vite 从[诞生之初](./why.md)就一直专注于性能。其开发服务器架构让 HMR 在项目规模增长时仍能保持高速。Vite 使用 [esbuild](https://esbuild.github.io/) 和 [SWC](https://github.com/vitejs/vite-plugin-react-swc) 等原生工具处理计算密集型任务，同时将其余代码保留在 JavaScript 中，以兼顾速度和灵活性。在需要时，框架插件会使用 [Babel](https://babeljs.io/) 编译用户代码。构建阶段使用 [Rollup](https://rollupjs.org/)，此时产物体积以及使用广泛插件生态的能力比单纯的速度更重要。Vite 会继续在内部演进，在新库出现时适时采用，以改善开发体验，同时保持 API 稳定。

## 基于 Vite 构建框架 {#building-frameworks-on-top-of-vite}

尽管用户可以直接使用 Vite，但它作为框架构建工具时尤其出色。Vite 核心与框架无关，同时为各个 UI 框架提供了成熟插件。它的 [JavaScript API](./api-javascript.md) 让应用框架作者能够利用 Vite 功能，为用户创建定制化体验。Vite 包含对 [SSR 基础功能](./ssr.md)的支持；这些功能通常由更高层工具提供，但也是构建现代 Web 框架的基础。Vite 插件则提供了跨框架共享能力，完善了整个方案。Vite 也很适合与 [Ruby](https://vite-ruby.netlify.app/) 和 [Laravel](https://laravel.com/docs/10.x/vite) 等[后端框架](./backend-integration.md)结合使用。

## 活跃的生态系统 {#an-active-ecosystem}

Vite 的发展是一个由框架和插件维护者、用户以及 Vite 团队共同协作的过程。我们鼓励采用 Vite 的项目积极参与 Vite 核心开发。我们借助 [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) 等工具与生态系统中的主要项目紧密合作，在每次发布时尽量减少回归问题。该工具允许我们在选定的 PR 上运行使用 Vite 的主要项目的 CI，并清晰了解生态系统对新版本的反应。我们力求在问题影响用户前修复回归，并让项目能在新版本发布后尽快完成升级。如果你正在使用 Vite，欢迎加入 [Vite Discord 社区](https://chat.vite.dev)，一同参与项目的发展。
