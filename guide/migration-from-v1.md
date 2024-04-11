# 从 v1 迁移 {#migration-from-v1}

## 配置项变化 {#config-options-change}

- 以下选项已被删除，应通过 [插件](./api-plugin) 实现：

  - `resolvers`
  - `transforms`
  - `indexHtmlTransforms`

- `jsx` 和 `enableEsbuild` 都已被删除，请使用新的 [`esbuild`](/config/#esbuild) 选项。

- [CSS 相关选项](/config/#css-modules) 都包含在 `css` 字段下。

- 所有 [用于构建的选项](/config/#build-options) 都包含在 `build` 字段下。

  - `rollupInputOptions` 和 `rollupOutputOptions` 已经被 [`build.rollupOptions`](/config/#build-rollupoptions) 替代。
  - `esbuildTarget` 变更为 [`build.target`](/config/#build-target)
  - `emitManifest` 变更为 [`build.manifest`](/config/#build-manifest)
  - 以下构建选项已经被移除，因为它们可以通过插件钩子或其他选项实现：
    - `entry`
    - `rollupDedupe`
    - `emitAssets`
    - `emitIndex`
    - `shouldPreload`
    - `configureBuild`

- 所有的 [server-specific options](/config/#server-options) 都包含在 `server` 字段下。

  - `hostname` 变更为 [`server.host`](/config/#server-host)。
  - `httpsOptions` 已被删除，[`server.https`](/config/#server-https) 可以直接接收选项对象。
  - `chokidarWatchOptions` 变更为 [`server.watch`](/config/#server-watch)。

- [`assetsInclude`](/config/#assetsinclude) 现在接收 `string | RegExp | (string | RegExp)[]` 而不是一个函数。

- 所有 Vue 特定选项都已移除；应将选项传递给 Vue 插件。

## 别名用法变化 {#alias-behavior-change}

[`alias`](/config/#resolve-alias) 现在会被传递给 `@rollup/plugin-alias` 并不再需要开始/结尾处的斜线了。此行为目前是一个直接替换，所以 1.0 风格的目录别名需要删除其结尾处的斜线：

```diff
- alias: { '/@foo/': path.resolve(__dirname, 'some-special-dir') }
+ alias: { '/@foo': path.resolve(__dirname, 'some-special-dir') }
```

另外，你可以对该选项使用 `[{ find: RegExp, replacement: string }]` 格式以求更精确的控制。

## Vue Support {#vue-support}

Vite 2.0 核心已经是框架无关的了。对 Vue 的支持目前详见 [`@vitejs/plugin-vue`](https://github.com/vitejs/vite/tree/main/packages/plugin-vue)。安装它并添加到 Vite 配置十分简单:

```js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
export default defineConfig({
  plugins: [vue()]
})
```

### 自定义块转换 {#custom-blocks-transforms}

一个自定义插件可以用来转换 Vue 自定义块，如下所示:

```ts
// vite.config.js
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
const vueI18nPlugin = {
  name: 'vue-i18n',
  transform(code, id) {
    if (!/vue&type=i18n/.test(id)) {
      return
    }
    if (/\.ya?ml$/.test(id)) {
      code = JSON.stringify(require('js-yaml').load(code.trim()))
    }
    return `export default Comp => {
      Comp.i18n = ${code}
    }`
  }
}
export default defineConfig({
  plugins: [vue(), vueI18nPlugin]
})
```

## React 支持 {#react-support}

现已支持 React Fast Refresh，详见 [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react)。

## HMR API 变化 {#hmr-api-change}

`import.meta.hot.acceptDeps()` 已经弃用。[`import.meta.hot.accept()`](./api-hmr#hot-accept-deps-cb) 现在可以接收一个或多个依赖。

## Manifest 格式变化 {#manifest-format-change}

构建清单现在使用以下格式:

```json
{
  "index.js": {
    "file": "assets/index.acaf2b48.js",
    "imports": [...]
  },
  "index.css": {
    "file": "assets/index.7b7dbd85.css",
  },
  "asset.png": {
    "file": "assets/asset.0ab0f9cd.png",
  }
}
```

对于入口 JS chunk，它还列出了它导入的 chunk，这些 chunk 可以用来渲染预加载指令。

## 致插件作者 {#for-plugin-authors}

Vite 2 使用了一套完全重定义的，扩展了 Rollup 插件的接口。请阅读新的 [插件开发指南](./api-plugin).

一些将 v1 插件迁移到 v2 的提示:

- `resolvers` -> 使用 [`resolveId`](https://rollupjs.org/guide/en/#resolveid) 钩子
- `transforms` -> 使用 [`transform`](https://rollupjs.org/guide/en/#transform) 钩子
- `indexHtmlTransforms` -> 使用 [`transformIndexHtml`](./api-plugin#transformindexhtml) 钩子
- 虚拟文件支持 -> 使用 [`resolveId`](https://rollupjs.org/guide/en/#resolveid) + [`load`](https://rollupjs.org/guide/en/#load) 钩子
- 添加 `alias`，`define` 或其他配置项 -> 使用 [`config`](./api-plugin#config) 钩子

由于大多数逻辑应通过插件钩子实现，而无需使用中间件，因此对中间件的需求大大减少。内部服务器应用现在看起来像旧版的 [connect](https://github.com/senchalabs/connect) 实例，而不是 Koa。
