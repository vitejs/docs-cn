# 项目理念 {#project-philosophy}

## 精简且可扩展的核心 {#lean-extendable-core}

Vite 的目标不在于满足所有用户的每一个使用场景。Vite 旨在开箱即用地支持构建 Web 应用的最常见的模式，但 [Vite 核心包](https://github.com/vitejs/vite) 必须保持精简并拥有较小的 API 接口，以保证项目长期维护的可行性。这一目标之所以可能实现，得益于 [Vite 基于 Rollup 的插件系统](./api-plugin.md) 。可以作为外部插件实现的功能通常不会添加到 Vite 核心中。 [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) 是一个很好的示例，展示了 Vite 核心之外能实现的强大功能，并且有许多 [维护良好的插件](https://github.com/vitejs/awesome-vite#plugins) 来满足您的需求。Vite 与 Rollup 项目紧密合作，确保插件在尽可能多的情况下既可用于纯 Rollup 项目，也可用于 Vite 项目，并努力将必要的扩展推送到上游 Plugin API 中。

## 推动现代 Web 开发 {#pushing-the-modern-web}

Vite 提供了一系列推动编写现代代码的特定功能。例如：

- 源代码必须采用 ESM 形式编写；对于非 ESM 的依赖项，为了使其正常工作，需要 [预先将其打包为 ESM](./dep-pre-bundling)。
- 建议使用 [`new Worker` 语法](./features#web-workers) 来编写 Web Workers，以遵循现代标准。
- 在浏览器环境下，不能直接使用 Node.js 模块。

在新增特性时，会遵循这些模式来构建一个具备前瞻性的 API，但请注意，这样的API可能并不总是与其它构建工具兼容。

## 旨在高性能的实用解决方案 {#a-pragmatic-approach-to-performance}

Vite 自其诞生之初（详见：[为什么选 Vite](./why.md)）就一直致力于性能优化。其开发服务器架构设计确保了随着项目规模扩大，模块热替换（HMR）仍能保持高速运行。Vite 采用类似 [esbuild](https://esbuild.github.io/) 和 [SWC](https://github.com/vitejs/vite-plugin-react-swc) 这样的原生工具处理复杂的任务，同时将其他部分代码保留在 JavaScript 中，以实现速度与灵活性之间的平衡。在需要时，框架插件会利用 [Babel](https://babeljs.io/) 来编译用户代码。构建阶段，Vite 当前使用的是 [Rollup](https://rollupjs.org/) ，此时包体积大小以及能够接入广泛生态系统的插件比原始速度更重要。Vite 将持续内部改进和发展，在新库出现时适时采用以提升开发者体验（DX），同时保持 API 的稳定性。

## 基于 Vite 构建框架 {#building-frameworks-on-top-of-vite}

尽管 Vite 可以直接供用户使用，但它尤其适合作为创建框架的工具。Vite 核心本身不特定于任何框架，但针对每个 UI 框架都提供了完善的插件支持。其 [JS API](./api-javascript.md) 允许应用框架作者利用 Vite 特性为他们的用户提供定制化的体验。Vite 包含了对 [SSR 基础功能](./ssr.md) 的支持，这些功能通常在更高级别的工具中出现，但对于构建现代 Web 框架至关重要。Vite 插件通过提供一种跨框架共享的方式，使整体方案更为完备。此外，当与诸如 [Ruby](https://vite-ruby.netlify.app/) 和 [Laravel](https://laravel.com/docs/10.x/vite) 等 [后端框架](./backend-integration.md) 结合使用时，Vite 也是一个绝佳选择。

## 活跃的生态系统 {#an-active-ecosystem}

Vite 的发展是一个由框架和插件维护者、用户以及 Vite 团队共同协作的过程。我们鼓励当项目采用 Vite 时，也可以积极参与 Vite 核心开发。我们借助如 [vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci) 等工具与生态中的主要项目紧密合作，在每次发布时尽量减少回归问题。该工具允许我们在选定的 PR 上运行使用 Vite 的主要项目的 CI，并让我们清晰了解生态系统对新版本发布的反应情况。我们力求在问题影响到用户之前修复回归问题，确保项目能够尽快更新至最新版本。如果您正在使用 Vite，我们诚邀您加入 [Vite Discord 频道](https://chat.vite.dev) ，一同参与项目的发展。
