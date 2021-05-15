# 比较 {#comparisons-with-other-no-bundler-solutions}

## Snowpack {#snowpack}

[Snowpack](https://www.snowpack.dev/) 也是一个与 Vite 十分类似的非构建式原生 ESM 开发服务器。除了不同的实现细节外，这两个项目在技术上比传统工具有很多共同优势。Vite 的依赖预绑定也受到了 Snowpack v1（现在是 [`esinstall`](https://github.com/snowpackjs/snowpack/tree/main/esinstall)）的启发。这两个项目之间的一些主要区别是：

**生产构建**

Snowpack 的默认构建输出是未打包的：它将每个文件转换为单独的构建模块，然后将这些模块提供给执行实际绑定的不同“优化器”。这么做的好处是，你可以选择不同终端打包器，以适应不同需求（例如 webpack, Rollup，甚至是 ESbuild），缺点是体验有些支离破碎 —— 例如，`esbuild` 优化器仍然是不稳定的，Rollup 优化器也不是官方维护，而不同的优化器又有不同的输出和配置。

为了提供更流畅的体验，Vite 选择了与单个打包器（Rollup）进行更深入的集成。Vite 还支持一套 [通用插件 API](./api-plugin) 扩展了 Rollup 的插件接口，开发和构建两种模式都适用。

Vite 支持广泛的功能，构建过程也集成度更高，以下功能目前在 Snowpack 构建优化器中不可用：

- [多页面应用支持](./build#multi-page-app)
- [库模式](./build#library-mode)
- [自动分割 CSS 代码](./features#css-code-splitting)
- [预优化的异步 chunk 加载](./features#async-chunk-loading-optimization)
- [对动态导入自动 polyfill](./features#dynamic-import-polyfill)
- 官方 [兼容模式插件](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 打包为现代/传统两种产物，并根据浏览器支持自动交付正确的版本。

**更快的依赖预构建**

Vite 使用 [esbuild](https://esbuild.github.io/) 而不是 Rollup 来进行依赖预构建。这为开发服务器冷启动和依赖项失活的重新构建方面带来了显著的性能改进。

**Monorepo 支持**

Vite 能够支持 monorepo，我们已经有用户成功地将 Vite 基于 monorepo 模式，与 Yarn, Yarn 2 和 PNPM 使用。

**CSS 预处理器支持**

Vite 为 Sass and Less 提供了更精细化的支持，包括改进 `@import` 解析（可使用别名与 npm 依赖）和 [提供 `url()` 内联引入与变基](./features#import-inlining-and-rebasing)。

**Vue 第一优先级支持**

Vite 最初是作为 [Vue.js](https://vuejs.org/) 开发工具的未来基础而创建的。尽管 Vite 2.0 版本完全不依赖于任何框架，但官方 Vue 插件仍然对 Vue 的单文件组件格式提供了一流的支持，涵盖了所有高级特性，如模板资源引用解析、`<script setup>`，`<style module>`，自定义块等等。除此之外，Vite 还对 Vue 单文件组件提供了细粒度的 HMR。举个例子，更新一个单文件组件的 `<template>` 或 `<style>` 会执行不重置其状态的热更新。

## WMR {#wmr}

Preact 团队的 [WMR](https://github.com/preactjs/wmr) 提供了类似的特性集，而 Vite 2.0 对 Rollup 插件接口的支持正是受到了它的启发。

WMR 主要是为了 [Preact](https://preactjs.com/) 项目而设计，并为其提供了集成度更高的功能，比如预渲染。就使用范围而言，它更加贴合于 Preact 框架，与 Preact 本身一样强调紧凑的大小。如果你正在使用 Preact，那么 WMR 可能会提供更好的体验。

## @web/dev-server {#webdev-server}

[@web/dev-server](https://modern-web.dev/docs/dev-server/overview/)（曾经是 `es-dev-server`）是一个伟大的项目，基于 koa 的 Vite 1.0 开发服务器就是受到了它的启发。

`@web/dev-server` 适用范围不是很广。它并未提供官方的框架集成，并且需要为生产构建手动设置 Rollup 配置。然而，它的父项目确实提供了一组优秀的 Rollup 插件。

总的来说，与 `@web/dev-server` 相比，Vite 是一个更注重自身/更高层面的工具，旨在提供开箱即用的工作流。话虽如此，但 `@web/dev-server` 这个项目群包含了许多其他的优秀工具，也可以使 Vite 用户受益。
