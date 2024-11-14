# Plugins {#plugins}

:::tip Note
Vite aims to provide out-of-the-box support for common web development tasks. Before searching for a Vite or Rollup compatible plugin, please check the [Feature Guide](../guide/features.md). In many cases, plugins that need to be added in a Rollup project are already supported natively in Vite.
:::

Please check the [Using Plugins](../guide/using-plugins) section to learn more about how to use plugins.

## Official Plugins {#official-plugins}

### [@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) {#vitejs-plugin-vue}

- Provides support for Vue 3 single-file components.

### [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) {#vitejs-plugin-vue-jsx}

- Provides support for Vue 3 JSX (via [dedicated Babel transform plugin](https://github.com/vuejs/jsx-next)).

### [@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2) {#vitejs-plugin-vue2}

- Provides support for Vue 2.7 single-file components.

### [@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx) {#vitejs-plugin-vue2-jsx}

- Provides support for Vue 2.7 JSX (via [dedicated Babel transform](https://github.com/vuejs/jsx-vue2/)).

### [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) {#vitejs-plugin-react}

- Uses esbuild and Babel to achieve fast HMR with a small bundle size and the flexibility of the Babel transform pipeline. If no additional Babel plugins are used, only esbuild will be used during the build process.

### [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) {#vitejs-plugin-react-swc}

- Replaces Babel with SWC during development. During the build process, if the plugin is used, SWC+esbuild will be used; if the plugin is not used, only esbuild will be used. For large projects that do not require non-standard React extensions, cold start and hot module replacement (HMR) will see significant improvements.

### [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) {#vitejs-plugin-legacy}

- Provides compatibility support for legacy browsers for the bundled files.

## Community Plugins {#community-plugins}

Check out [awesome-vite](https://github.com/vitejs/awesome-vite#plugins) - you can also add your plugin to this list via a PR.

## Rollup Plugins {#rollup-plugins}

[Vite plugins](../guide/api-plugin) are an extension of the Rollup plugin interface. Check out the [Rollup Plugin Compatibility section](../guide/api-plugin#rollup-plugin-compatibility) for more information.
