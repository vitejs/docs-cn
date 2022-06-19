# 从 v2 迁移 {#migration-from-v2}

## Node 支持 {#node-support}

Vite 不再支持 Node v12，因为它已经进入了 EOL 阶段。现在你必须使用 Node 14.6 及以上版本。

## 现代浏览器基准线变化 {#modern-browser-baseline-change}

生产构建打包时加会假定目标支持现代 JavaScript。默认情况下，Vite 的目标是支持 [原生 ES 模块](https://caniuse.com/es6-module)、[原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 以及 [`import.meta`](https://caniuse.com/mdn-javascript_statements_import_meta) 的浏览器：

- Chrome >=87
- Firefox >=78
- Safari >=13
- Edge >=88

一小部分用户需要 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)，它会自动生成兼容性 chunk 以及相应的 ES 语言功能的 polyfill。

## 配置选项变化 {#config-options-changes}

- 下列在 v2 当中我们已经标记为弃用选项，现在已经被移除：

<<<<<<< HEAD
  - `alias`（改为了 [`resolve.alias`](../config/shared-options.md#resolvealias)）
  - `dedupe`（改为了 [`resolve.dedupe`](../config/shared-options.md#resolvededupe)）
  - `build.base`（改为了 [`base`](../config/shared-options.md#base)）
  - `build.brotliSize`（改为了 [`build.reportCompressedSize`](../config/build-options.md#build-reportcompressedsize)）
  - `build.cleanCssOptions`（Vite 现在使用 esbuild 来做 CSS 最小化压缩）
  - `build.polyfillDynamicImport`（在没有支持动态导入的浏览器中，使用 [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)）
  - `optimizeDeps.keepNames`（改为了 [`optimizeDeps.esbuildOptions.keepNames`](../config/dep-optimization-options.md#optimizedepsesbuildoptions)）

## 开发服务器变化 {#dev-server-changes}
=======
  - `alias` (switch to [`resolve.alias`](../config/shared-options.md#resolve-alias))
  - `dedupe` (switch to [`resolve.dedupe`](../config/shared-options.md#resolve-dedupe))
  - `build.base` (switch to [`base`](../config/shared-options.md#base))
  - `build.brotliSize` (switch to [`build.reportCompressedSize`](../config/build-options.md#build-reportcompressedsize))
  - `build.cleanCssOptions` (Vite now uses esbuild for CSS minification)
  - `build.polyfillDynamicImport` (use [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) for browsers without dynamic import support)
  - `optimizeDeps.keepNames` (switch to [`optimizeDeps.esbuildOptions.keepNames`](../config/dep-optimization-options.md#optimizedeps-esbuildoptions))

## Achitecture changes and legacy Options

This section describes the biggest architecture changes in Vite v3. To allow projects to migrate from v2 in case of a compat issue, legacy options have been added to revert to the Vite v2 strategies.

:::warning
These options are marked as experimental and deprecated. They may be removed in a future v3 minor without respecting semver. Please pin the Vite version when using them.

- `legacy.devDepsScanner`
- `legacy.buildRollupPluginCommonjs`
- `legacy.buildSsrCjsExternalHeuristics`

:::

### Dev Server Changes
>>>>>>> 5cf38dcf77e6a093e6e8e15d63de1e81c9c0ba08

Vite 的默认开发服务器端口号现在改为了 5173。你可以使用 [`server.port`](../config/server-options.md#server-port) 将其设置为 3000。

Vite 的默认开发服务器主机地址现在改为了 `localhost`。你可以使用 [`server.host`](../config/server-options.md#server-host) 将其设置为 `127.0.0.1`。

Vite 使用 esbuild 优化了依赖关系，以将仅提供 CJS 格式的依赖转换成 ESM 格式，并减少浏览器需要请求的模块数量。在 v3 中，检索和批处理依赖的默认策略已经改变。Vite 不再使用 esbuild 预扫描用户代码，以获得冷启动时的初始依赖性列表。取而代之的是将第一次运行依赖性优化推迟到加载时每个导入的用户模块都得到处理之后。

<<<<<<< HEAD
若想要回到 v2 的策略，你可以使用 [`optimizeDeps.devScan`](../config/dep-optimization-options.md#optimizedepsdevscan)。

## 构建变化 {#build-changes}
=======
To get back the v2 strategy, you can use `legacy.devDepsScanner`.

### Build Changes
>>>>>>> 5cf38dcf77e6a093e6e8e15d63de1e81c9c0ba08

在 v3 版本中，Vite 使用 esbuild 来默认优化依赖。这样做的效果是消除了 v2 版中存在的开发和生产环境之间最显著的差异之一。因为 esbuild 将 CJS 格式转换为了 ESM 格式，因此我们不再使用 [`@rollupjs/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) 了。

<<<<<<< HEAD
若想要回到 v2 的策略，你可以使用 [`optimizeDeps.disabled: 'build'`](../config/dep-optimization-options.md#optimizedepsdisabled)。

## SSR Changes {#ssr-changes}

Vite v3 默认在 SSR 构建时使用 ESM 格式。当使用 ESM 时，[SSR 外部化的启发式方法](https://vitejs.dev/guide/ssr.html#ssr-externals) 将不再需要。默认情况下所有的依赖都将被外部化。你可以使用 [`ssr.noExternal`](../config/ssr-options.md#ssrnoexternal) 来控制哪些依赖需要被包含进 SSR 的打包产物中。

如果你无法在你的 SSR 项目中使用 ESM，你可以设置 `ssr.format: 'cjs'` 来生成一个 CJS 格式的产物。在这种情况下，会使用和 Vite v2 相同的外部化策略。
=======
If you need to get back to the v2 strategy, you can use `legacy.buildRollupPluginCommonjs`.

### SSR Changes

Vite v3 uses ESM for the SSR build by default. When using ESM, the [SSR externalization heuristics](https://vitejs.dev/guide/ssr.html#ssr-externals) are no longer needed. By default, all dependencies are externalized. You can use [`ssr.noExternal`](../config/ssr-options.md#ssr-noexternal) to control what dependencies to include in the SSR bundle.

If using ESM for SSR isn't possible in your project, you can set `legacy.buildSsrCjsExternalHeuristics` to generate a CJS bundle using the same externalization strategy of Vite v2.

Also [`build.rollupOptions.output.inlineDynamicImports`](https://rollupjs.org/guide/en/#outputinlinedynamicimports) now defaults to `false` when `ssr.target` is `'node'`. `inlineDynamicImports` changes execution order and bundling to a single file is not needed for node builds.
>>>>>>> 5cf38dcf77e6a093e6e8e15d63de1e81c9c0ba08

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

-init().then((instance) => {
+init().then(({ exports }) => {
  exports.test()
})
```

## 进阶 {#advanced}

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

此外，还有其他一些只影响少数用户的破坏性变化。

- [[#5018] feat: enable `generatedCode: 'es2015'` for rollup build](https://github.com/vitejs/vite/pull/5018)
  - 转义到 ES5 现在是必要的，即使用户代码仅含 ES5。
- [[#7877] fix: vite client types](https://github.com/vitejs/vite/pull/7877)
  - `/// <reference lib="dom" />` 已从 `vite/client.d.ts` 中移除。必须在 `tsconfig.json` 使用 `{ "lib": ["dom"] }` 或 `{ "lib": ["webworker"] }`。
- [[#8090] feat: preserve process env vars in lib build](https://github.com/vitejs/vite/pull/8090)
  - `process.env.*` 现在在库模式下是被保留的了。
- [[#8280] feat: non-blocking esbuild optimization at build time](https://github.com/vitejs/vite/pull/8280)
<<<<<<< HEAD
  - `server.force` 选项现已移除，改为了直接的 `force` 选项。
=======
  - `server.force` option was removed in favor of `optimizeDeps.force` option.
>>>>>>> 5cf38dcf77e6a093e6e8e15d63de1e81c9c0ba08
- [[#8550] fix: dont handle sigterm in middleware mode](https://github.com/vitejs/vite/pull/8550)
  - 当以中间件模式运行时，Vite 不再在 `SIGTERM` 强制杀进程。

## 从 v1 迁移 {#migration-from-v1}

在 Vite v2 文档中查看 [Migration from v1 Guide](https://v2.vitejs.dev/guide/migration.html)（[中文版](https://cn.vitejs.dev/guide/migration-from-v1.html)），了解如何将你的应用迁移到 Vite v2，然后再处理本页中所提及的变化。
