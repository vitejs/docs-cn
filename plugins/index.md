# 插件 {#plugins}

:::tip 注意
Vite 旨在为常见的 web 开发工作提供开箱即用的支持。在搜索一个 Vite 或 Rollup 兼容插件之前，请先查看 [功能指引](../guide/features.md)。很多场景下，在 Rollup 项目中需要添加插件，而在 Vite 中已经内建支持了。
:::

请查看 [使用插件](../guide/using-plugins) 一章了解更多插件使用方式。

## 官方插件 {#official-plugins}

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) {#vitejs-plugin-vue}

- 提供 Vue 3 单文件组件支持。

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) {#vitejs-plugin-vue-jsx}

- 提供 Vue 3 JSX 支持（通过 [专用的 Babel 转换插件](https://github.com/vuejs/jsx-next)）。

### [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2) {#vitejs-plugin-vue2}

- 提供对 Vue 2.7 的单文件组件支持。

### [@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx) {#vitejs-plugin-vue2-jsx}

- 提供对 Vue 2.7 JSX 对支持（通过 [dedicated Babel transform](https://github.com/vuejs/jsx-vue2/)）。

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) {#vitejs-plugin-react}

- 使用 esbuild 和 Babel，以较小的软件包占用空间和使用 Babel 转换管道的灵活性实现快速 HMR。如果没有额外的 Babel 插件，在构建过程中只能使用 esbuild。

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) {#vitejs-plugin-react-swc}

- 在开发时会将 Babel 替换为 SWC。在构建时，若使用了插件则会使用 SWC+esbuild，若没有使用插件则仅会用到 esbuild。对不需要非标准 React 扩展的大型项目，冷启动和模块热替换（HMR）将会有显著提升。

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) {#vitejs-plugin-legacy}

- 为打包后的文件提供传统浏览器兼容性支持。

## 社区插件 {#community-plugins}

查看 [awesome-vite](https://github.com/vitejs/awesome-vite#plugins) - 你也可以通过 PR 的方式将你的插件添加到此列表中。

## Rollup 插件 {#rollup-plugins}

[Vite 插件](../guide/api-plugin) 是 Rollup 插件接口的一种扩展。查看 [Rollup 插件兼容性章节](../guide/api-plugin#rollup-plugin-compatibility) 获取更多信息。
