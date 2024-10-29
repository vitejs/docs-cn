# 从 v2 迁移 {#migration-from-v2}

## Node 支持 {#node-support}

Vite 不再支持 Node 12 / 13 / 15，因为上述版本已经进入了 EOL 阶段。现在你必须使用 Node 14.18+ / 16+ 版本。

## 现代浏览器基准线变化 {#modern-browser-baseline-change}

生产构建打包时会假定目标支持现代 JavaScript。默认情况下，Vite 的目标是支持 [原生 ES 模块](https://caniuse.com/es6-module)、[原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 以及 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) 的浏览器：

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

### 开发服务器变化 {#dev-server-changes}

Vite 的默认开发服务器端口号现在改为了 5173。你可以使用 [`server.port`](../config/server-options.md#server-port) 将其设置为 3000。

Vite 的默认开发服务器主机地址现在改为了 `localhost`。在 Vite v2，Vite 默认监听的是 `127.0.0.1`。Node.js 在 v17 版本以下通常会解析 `localhost` 到 `127.0.0.1`，因此对这些版本，主机地址并未变更。若明确需要，对于 Node.js v17 版本以上，你可以使用 [`server.host`](../config/server-options.md#server-host)、将其设置为 `127.0.0.1`。

请注意，现在 Vite v3 会打印出正确的主机地址。这意味着使用 `localhost` 时 Vite 可能会打印 `127.0.0.1` 作为正在监听的地址。你可以设置 [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) 来避免这一表现。查看 [`server.host`](../config/server-options.md#server-host) 了解详情。

### SSR Changes {#ssr-changes}

Vite v3 默认在 SSR 构建时使用 ESM 格式。当使用 ESM 时，[SSR 外部化的启发式方法](/guide/ssr.html#ssr-externals) 将不再需要。默认情况下所有的依赖都将被外部化。你可以使用 [`ssr.noExternal`](../config/ssr-options.md#ssrnoexternal) 来控制哪些依赖需要被包含进 SSR 的打包产物中。

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
- `import.meta.glob` 的 key 现在是相对于当前模块。

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

### 自动生成 https 证书 {#automatic-https-certificate-generation}

当使用 `https` 时需要一个合法可用的证书。在 Vite v2 中，如果没有配置证书，Vite 会自动生成和缓存一个自签名的证书。
从 Vite v3 开始，我们推荐手动创建你自己的证书。如果你仍想要使用 v2 中的自动生成，该功能可以通过添加 [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) 到项目插件中来实现。

```js
import basicSsl from '@vitejs/plugin-basic-ssl'
export default {
  plugins: [basicSsl()]
}
```

## 实验性 {#experimental}

### 在构建阶段使用 esbuild 依赖优化

在 v3 版本下，Vite 允许在构建阶段使用 esbuild 进行依赖优化。如果开启此项，那么它将消除 v2 版本中存在的最明显的开发与构建最终产物之间的区别。[`@rollupjs/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) 在此处不再需要，因为 esbuild 会将纯 CommonJS 依赖转换为 ESM。

如果你想尝试该构建策略，你可以使用 `optimizeDeps.disabled: false`（在 v3 中默认是 `disabled: 'build'`）。`@rollup/plugin-commonjs`
可以通过设置 `build.commonjsOptions: { include: [] }` 来移除。

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

## 从 v1 迁移 {#migration-from-v1}

在 Vite v2 文档中查看 [从 v1 迁移指南](https://v2.vite.dev/guide/migration.html)（[中文版](/guide/migration-from-v1)），了解如何将你的应用迁移到 Vite v2，然后再处理本页中所提及的变化。
