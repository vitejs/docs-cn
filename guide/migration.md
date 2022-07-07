# 从 v2 迁移 {#migration-from-v2}

## Node 支持 {#node-support}

Vite 不再支持 Node v12，因为它已经进入了 EOL 阶段。现在你必须使用 Node 14.18+ 及以上版本。

## 现代浏览器基准线变化 {#modern-browser-baseline-change}

生产构建打包时加会假定目标支持现代 JavaScript。默认情况下，Vite 的目标是支持 [原生 ES 模块](https://caniuse.com/es6-module)、[原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 以及 [`import.meta`](https://caniuse.com/mdn-javascript_statements_import_meta) 的浏览器：

- Chrome >=87
- Firefox >=78
- Safari >=13
- Edge >=88

一小部分用户需要 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)，它会自动生成兼容性 chunk 以及相应的 ES 语言功能的 polyfill。

## 配置选项变化 {#config-options-changes}

- 下列在 v2 当中我们已经标记为弃用选项，现在已经被移除：

  - `alias`（改为了 [`resolve.alias`](../config/shared-options.md#resolve-alias)）
  - `dedupe`（改为了 [`resolve.dedupe`](../config/shared-options.md#resolve-dedupe)）
  - `build.base`（改为了 [`base`](../config/shared-options.md#base)）
  - `build.brotliSize`（改为了 [`build.reportCompressedSize`](../config/build-options.md#build-reportcompressedsize)）
  - `build.cleanCssOptions`（Vite 现在使用 esbuild 来做 CSS 最小化压缩）
  - `build.polyfillDynamicImport`（在没有支持动态导入的浏览器中，使用 [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)）
  - `optimizeDeps.keepNames`（改为了 [`optimizeDeps.esbuildOptions.keepNames`](../config/dep-optimization-options.md#optimizedeps-esbuildoptions)）

## 架构变更和兼容选项 {#achitecture-changes-and-legacy-options}

这一小节描述了 Vite v3 中最大的架构变更。在项目从 v2 迁移、遇到兼容性问题时，可以使用新添加的兼容选项来恢复到 Vite v2 策略。

:::warning
这些选项曾被标记为实验性，如今已经废弃。它们可能将在 v3 后续版本中被移除，因此使用它们时请固定 Vite 版本。

- `legacy.buildRollupPluginCommonjs`
- `legacy.buildSsrCjsExternalHeuristics`

:::

## 开发服务器变化 {#dev-server-changes}

Vite 的默认开发服务器端口号现在改为了 5173。你可以使用 [`server.port`](../config/server-options.md#server-port) 将其设置为 3000。

Vite 的默认开发服务器主机地址现在改为了 `localhost`。你可以使用 [`server.host`](../config/server-options.md#server-host) 将其设置为 `127.0.0.1`。

## 构建变化 {#build-changes}

在 v3 版本中，Vite 使用 esbuild 来默认优化依赖。这样做的效果是消除了 v2 版中存在的开发和生产环境之间最显著的差异之一。因为 esbuild 将 CJS 格式转换为了 ESM 格式，因此我们不再使用 [`@rollupjs/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) 了。

若想要回到 v2 的策略，你可以使用 `legacy.buildRollupPluginCommonjs`。

## SSR Changes {#ssr-changes}

Vite v3 默认在 SSR 构建时使用 ESM 格式。当使用 ESM 时，[SSR 外部化的启发式方法](https://vitejs.dev/guide/ssr.html#ssr-externals) 将不再需要。默认情况下所有的依赖都将被外部化。你可以使用 [`ssr.noExternal`](../config/ssr-options.md#ssrnoexternal) 来控制哪些依赖需要被包含进 SSR 的打包产物中。

如果你无法在你的 SSR 项目中使用 ESM，你可以设置 `ssr.format: 'cjs'` 来生成一个 CJS 格式的产物。在这种情况下，会使用和 Vite v2 相同的外部化策略。

同样 [`build.rollupOptions.output.inlineDynamicImports`](https://rollupjs.org/guide/en/#outputinlinedynamicimports) 现在在 `ssr.target` 是 `node` 时，也默认置为了 `false`。`inlineDynamicImports` 它会改变执行顺序，并且 node 构建不需要打包到单个文件。

## 其他一般性变化 {#general-changes}

- SSR 和库模式中将会根据语法格式和包的类型，为输出的 JS 文件提供一个更合理的文件扩展名（`js`、`mjs` 或是 `cjs`）。
- Terser 现在是一个可选依赖。如果你使用的是 `build.minify: 'terser'`，你需要手动安装它：
  ```
  npm add -D terser
  ```

### `import.meta.glob` {#importmetaglob}

- [原始 `import.meta.glob`](features.md#glob-import-as) 从 `{ assert: { type: 'raw' }}` 迁移为 `{ as: 'raw' }`
- `import.meta.glob` 的 key 现在是相对与当前模块。

  ```diff
  // 文件：/foo/index.js
  const modules = import.meta.glob('../foo/*.js')

  // 转换为：
  const modules = {
  -  '../foo/bar.js': () => {}
  +  './bar.js': () => {}
  }
  ```

- 当在 `import.meta.glob` 中使用别名（alias）时，键值总是绝对路径。
- `import.meta.globEager` 已经弃用，请使用 `import.meta.glob('*', { eager: true })` 来代替。

### WebAssembly 支持 {#webassembly-support}

`import init from 'example.wasm'` 语法被弃用，以防止将来与 ["WASM 的 ESM 集成"](https://github.com/WebAssembly/esm-integration) 冲突。

你可以使用 `?init` 参数，和之前的行为类似：

```diff
-import init from 'example.wasm'
+import init from 'example.wasm?init'

-init().then((exports) => {
+init().then(({ exports }) => {
  exports.test()
})
```

<<<<<<< HEAD
## 进阶 {#advanced}
=======
### Automatic https certificate generation

A valid certificate is needed when using `https`. In Vite v2, if no certificate was configured, a self-signed certificate was automatically created and cached.
Since Vite v3, we recommend manually creating your certificates. If you still want to use the automatic generation from v2, this feature can be enabled back by adding [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) to the project plugins.

```js
import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
  plugins: [basicSsl()]
}
```

## Advanced
>>>>>>> 702edf8282ee31bc390a0ce77c75f77d8cf82404

下列改动仅会影响到插件/工具的作者：

- [[#5868] refactor: remove deprecated api for 3.0](https://github.com/vitejs/vite/pull/5868)
  - `printHttpServerUrls` 被移除
  - `server.app`、`server.transformWithEsbuild` 被移除
  - `import.meta.hot.acceptDeps` 被移除
- [[#6901] fix: sequential injection of tags in transformIndexHtml](https://github.com/vitejs/vite/pull/6901)
  - `transformIndexHtml` 现在会从更早的插件处获取到正确的内容，因此，现在注入的标签的顺序与预期的一样。
- [[#7995] chore: do not fixStacktrace](https://github.com/vitejs/vite/pull/7995)
  - `ssrLoadModule` 的 `fixStacktrace` 选项现在默认为 `false`
- [[#8178] feat!: migrate to ESM](https://github.com/vitejs/vite/pull/8178)
  - `formatPostcssSourceMap` 现在是异步的
  - `resolvePackageEntry`、`resolvePackageData` 在 CJS 构建中将不再可用（需要在 CJS 中使用动态导入）
- [[#8626] refactor: type client maps](https://github.com/vitejs/vite/pull/8626)
  - `import.meta.hot.accept` 的回调函数类型现在更严格了。现在是 `(mod: (Record<string, any> & { [Symbol.toStringTag]: 'Module' }) | undefined) => void`（之前是 `(mod: any) => void`）。

此外，还有其他一些只影响少数用户的破坏性变化。

- [[#5018] feat: enable `generatedCode: 'es2015'` for rollup build](https://github.com/vitejs/vite/pull/5018)
  - 转义到 ES5 现在是必要的，即使用户代码仅含 ES5。
- [[#7877] fix: vite client types](https://github.com/vitejs/vite/pull/7877)
  - `/// <reference lib="dom" />` 已从 `vite/client.d.ts` 中移除。必须在 `tsconfig.json` 使用 `{ "lib": ["dom"] }` 或 `{ "lib": ["webworker"] }`。
- [[#8090] feat: preserve process env vars in lib build](https://github.com/vitejs/vite/pull/8090)
  - `process.env.*` 现在在库模式下是被保留的了。
- [[#8280] feat: non-blocking esbuild optimization at build time](https://github.com/vitejs/vite/pull/8280)
  - `server.force` 选项现已移除，改为了直接的 `force` 选项。
- [[#8550] fix: dont handle sigterm in middleware mode](https://github.com/vitejs/vite/pull/8550)
  - 当以中间件模式运行时，Vite 不再在 `SIGTERM` 强制杀进程。
- [[#8647] feat: print resolved address for localhost](https://github.com/vitejs/vite/pull/8647)
  - `server.printUrls` 和 `previewServer.printUrls` 现在是异步的了。

## 从 v1 迁移 {#migration-from-v1}

在 Vite v2 文档中查看 [Migration from v1 Guide](https://v2.vitejs.dev/guide/migration.html)（[中文版](https://cn.vitejs.dev/guide/migration-from-v1.html)），了解如何将你的应用迁移到 Vite v2，然后再处理本页中所提及的变化。
