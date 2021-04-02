---
sidebar: false
---

<<<<<<< HEAD
# Vite 2.0 发布了
=======
# Announcing Vite 2.0 {#announcing-vite-20}
>>>>>>> dev

<p style="text-align:center">
  <img src="/logo.svg" style="height:200px">
</p>

Vite 2.0 正式发布了！

Vite（法语意思是 “快”，发音为 `/vit/`，类似 veet）是一种全新的前端构建工具。你可以把它理解为一个开箱即用的开发服务器 + 打包工具的组合，但是更轻更快。Vite 利用浏览器 [原生的 ES 模块支持](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 和用编译到原生的语言开发的工具（如 [esbuild](https://esbuild.github.io/)）来提供一个快速且现代的开发体验。

Vite 有多快？在 Repl.it 上从零启动 [一个基于 Vite 的 React 应用](https://twitter.com/amasad/status/1355379680275128321)，浏览器页面加载完毕的时候，CRA（`create-react-app`）甚至还没有装完依赖。

如果你还没听说过 Vite 到底是什么，可以到 [这里](https://cn.vitejs.dev/guide/why.html) 了解一下项目的设计初衷。如果你想要了解 Vite 跟其它一些类似的工具有什么区别，可以参考这里的 [对比](https://cn.vitejs.dev/guide/comparisons.html)。

<<<<<<< HEAD
## 2.0 带来了什么
=======
## What's New in 2.0 {#whats-new-in-20}
>>>>>>> dev

Vite 1.0 虽然之前进入了 RC 阶段，但在发布之前我们决定进行一次彻底的重构来解决一些设计缺陷。所以 Vite 2.0 其实是 Vite 的第一个稳定版本。2.0 带来了大量的改进：

<<<<<<< HEAD
### 多框架支持
=======
### Framework Agnostic Core {#framework-agnostic-core}
>>>>>>> dev

设计 Vite 的初衷只是一个 [探索性的原型项目来更好的支持 Vue 单文件组件](https://github.com/vuejs/vue-dev-server)。Vite 1 在此基础上继续增加了 HMR 支持。

但 2.0 基于之前的经验提供了一个更稳定灵活的内部架构，从而可以完全通过插件机制来支持任意框架。现在 Vite 提供 [官方的 Vue, React, Preact, Lit Element 项目模版](https://github.com/vitejs/vite/tree/main/packages/create-app)，而 Svelte 社区也在开发 Vite 整合方案。

<<<<<<< HEAD
### 全新插件机制和 API
=======
### New Plugin Format and API {#new-plugin-format-and-api}
>>>>>>> dev

Vite 2.0 受 [WMR](https://github.com/preactjs/wmr) 的启发采用了基于 Rollup 插件 API 的设计。[很多 Rollup 插件可以跟 Vite 直接兼容](https://vite-rollup-plugins.patak.dev/)。插件可以在使用 Rollup 插件钩子之外使用一些额外的 Vite 特有的 API 来处理一些打包中不存在的需求，比如区分开发 vs 打包，或是自定义的热更新处理。

Vite 的 [JS API](https://vitejs.dev/guide/api-javascript.html) 也得到了大幅改进 - 已经有不少用户在开发基于 Vite 的上层框架，Nuxt 团队也已经在 Nuxt 3 中验证了初步整合的可行性。

<<<<<<< HEAD
### 基于 esbuild 的依赖预打包
=======
### esbuild Powered Dep Pre-Bundling {#esbuild-powered-dep-pre-bundling}
>>>>>>> dev

由于 Vite 是一个基于原生 ESM 的开发服务器，在启动时我们需要通过依赖预打包来达成两个目的：

<<<<<<< HEAD
1. 减少模块/请求数量；
2. 支持 CommonJS 依赖。预打包只有在依赖变动时才需要执行，但在有大量依赖的项目中，每次执行还是可能会需要很长时间。Vite 之前是使用 Rollup 来执行这个过程，在 2.0 中我们切换到了 esbuild，使这个过程加快了几十倍。冷启动一个之前需要将近 30 秒预打包的项目现在只需要不到两秒！从 webpack 或其它打包工具迁移到 Vite 应该也会有类似的速度改善。
=======
### First-class CSS Support {#first-class-css-support}
>>>>>>> dev

### 更好的 CSS 支持

Vite 将 CSS 看作模块系统中的一等公民，并且内置了一下支持：

<<<<<<< HEAD
- **强化路径解析**：CSS 中的 @import 和 url() 路径都通过 Vite 的路径解析器来解析，从而支持 alias 和 npm 依赖。
=======
### Server-Side Rendering (SSR) Support {#server-side-rendering-ssr-support}
>>>>>>> dev

- **自动 URL 改写**：所有 url() 路径都会被自动改写从而确保在开发和构建中都指向正确的文件路径。

- **CSS 代码分割**：构建时每一个被分割的 JS 文件都会自动生成一个对应的 CSS 文件，并且两个文件会被自动并行按需加载。

<<<<<<< HEAD
### 服务端渲染（SSR）支持
=======
### Opt-in Legacy Browser Support {#opt-in-legacy-browser-support}
>>>>>>> dev

Vite 2.0 提供 [实验性的 SSR 支持](https://vitejs.dev/guide/ssr.html)。Vite 提供一个灵活的 API 来在 Node.js 中高效率地直接加载 ESM 源码（并且同样有精准的更新而不需要打包）。提供 CommonJS 版本的依赖会在 SSR 时自动被跳过转换直接加载。生产环境下，服务器可以和 Vite 完全解耦。基于 Vite SSR 的架构也可以很方便的做静态预渲染（SSG)。

<<<<<<< HEAD
Vite SSR 会作为一个底层功能，而我们期待看到更高层级的框架在此基础上的应用。
=======
## Give it a Try! {#give-it-a-try}
>>>>>>> dev

### 旧浏览器支持

Vite 默认只支持原生支持 ESM 的现代浏览器，但可以通过官方的 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 来支持旧浏览器。legacy 插件会自动额外生成一个针对旧浏览器的包，并且在 html 中插入根据浏览器 ESM 支持来选择性加载对应包的代码（类似 vue-cli 的 modern mode）。

## 尝试一下！

功能很多，但是试一下其实很简单。只需要一分钟，用以下命令就可以迅速搭起一个基于 vite 的项目（确保你的 Node.js 版本 >=12）：

```bash
npm init @vitejs/app
```

接下来你可以：

- 阅读 [指引文档](https://vitejs.dev/guide/) 了解 Vite 提供了哪些开箱即用的功能
- 在 [GitHub](https://github.com/vitejs/vite) 上访问源码
- 在 [Twitter](https://twitter.com/vite_js) 上关注最新进展
- 或与其他 Vite 用户在 [Discord](http://chat.vitejs.dev/) 上一起讨论
