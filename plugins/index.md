# 插件 {#plugins}

:::tip 注意
Vite 旨在为常见的 web 开发工作提供开箱即用的支持。在搜索一个 Vite 或 Rollup 兼容插件之前，请先查看 [功能指引](../guide/features.md)。很多场景下，在 Rollup 项目中需要添加插件，而在 Vite 中已经内建支持了。
:::

请查看 [使用插件](../guide/using-plugins) 一章了解更多插件使用方式。

## 官方插件 {#official-plugins}

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) {#vitejs-plugin-vue}

提供 Vue 3 单文件组件支持。

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) {#vitejs-plugin-vue-jsx}

提供 Vue 3 JSX 支持（通过 [专用的 Babel 转换插件](https://github.com/vuejs/babel-plugin-jsx)).

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) {#vitejs-plugin-react}

使用 [Oxc 转换器](https://oxc.rs/docs/guide/usage/transformer) and [Babel](https://babeljs.io/)，以较小的软件包占用空间和使用 Babel 转换管道的灵活性实现快速 HMR。如果没有额外的 Babel 插件，在构建过程中只能使用 Oxc 转换器

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react-swc)

在开发时会将 Babel 替换为 [SWC](https://swc.rs/)。在生产环境构建期间，若使用了插件则会使用 SWC+Oxc 转换器，若没有使用插件则仅会用到 Oxc 转换器。对于需要自定义插件的大型项目，如果该插件在 SWC 中也可用，冷启动和模块热替换（HMR）将会有显著提升。

### [@vitejs/plugin-rsc](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc)

Vite 通过该插件支持 [React Server Components (RSC)](https://react.dev/reference/rsc/server-components)。它利用 [Environment API](/guide/api-environment) 提供底层原语，React 框架可以使用这些原语来集成 RSC 功能。你可以通过以下方式尝试一个最小的独立 RSC 应用程序：

```bash
npm create vite@latest -- --template rsc
```

阅读[插件文档](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-rsc)了解更多详情。

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)

为打包后的文件提供传统浏览器兼容性支持。

## 社区插件 {#community-plugins}

<<<<<<< HEAD
查看 [awesome-vite](https://github.com/vitejs/awesome-vite#plugins) - 你也可以通过 PR 的方式将你的插件添加到此列表中。
=======
Check out [Vite Plugin Registry](https://registry.vite.dev/plugins) for the list of plugins published to npm.
>>>>>>> 01530fe744d94fe3f372c6ce2d799335a74d047b

## Rolldown Builtin Plugins {#rolldown-builtin-plugins}

Vite 在底层使用 [Rolldown](https://rolldown.rs/)，它为常见用例提供了一些内置插件。

阅读 [Rolldown 内置插件章节](https://rolldown.rs/builtin-plugins/) 了解更多信息。

<<<<<<< HEAD
## Rollup 插件 {#rollup-plugins}

[Vite 插件](../guide/api-plugin) 是 Rollup 插件接口的一种扩展。查看 [Rollup 插件兼容性章节](../guide/api-plugin#rollup-plugin-compatibility) 获取更多信息。
=======
## Rolldown / Rollup Plugins

[Vite plugins](../guide/api-plugin) are an extension of Rollup's plugin interface. Check out the [Rollup Plugin Compatibility section](../guide/api-plugin#rolldown-plugin-compatibility) for more information.
>>>>>>> 01530fe744d94fe3f372c6ce2d799335a74d047b
