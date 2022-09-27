# 插件 {#plugins}

:::tip 注意
Vite 旨在为常见的 web 开发工作提供开箱即用的支持。在搜索一个 Vite 或 Rollup 兼容插件之前，请先查看 [功能指引](../guide/features.md)。很多场景下，在 Rollup 项目中需要添加插件，而在 Vite 中已经内建支持了。
:::

请查看 [使用插件](../guide/using-plugins) 一章了解更多插件使用方式。

## 官方插件 {#official-plugins}

### [@vitejs/plugin-vue](https://github.com/vitejs/vite/tree/main/packages/plugin-vue) {#vitejsplugin-vue}

- 提供 Vue 3 单文件组件支持。

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite/tree/main/packages/plugin-vue-jsx) {#vitejsplugin-vue-jsx}

- 提供 Vue 3 JSX 支持（通过 [专用的 Babel 转换插件](https://github.com/vuejs/jsx-next)）。

### [@vitejs/plugin-react](https://github.com/vitejs/vite/tree/main/packages/plugin-react) {#vitejsplugin-react}

- 提供完整的 React 支持。

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) {#vitejsplugin-legacy}

- 为打包后的文件提供传统浏览器兼容性支持。

## 社区插件 {#community-plugins}

查看 [awesome-vite](https://github.com/vitejs/awesome-vite#plugins) - 你也可以通过 PR 的方式将你的插件添加到此列表中。

## Rollup 插件 {#rollup-plugins}

[Vite 插件](../guide/api-plugin) 是 Rollup 插件接口的一种扩展。查看 [Rollup 插件兼容性章节](../guide/api-plugin#rollup-plugin-compatibility) 获取更多信息。
