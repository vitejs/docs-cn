# 从 v6 迁移 {#migration-from-v6}

## Node.js 支持 {#node-js-support}

Vite 不再支持已结束生命周期（EOL）的 Node.js 18。现在需要使用 Node.js 20.19+ 或 22.12+。

## 浏览器兼容性目标变更 {#default-browser-target-change}

`build.target` 的默认浏览器值已更新为较新的浏览器版本。

- Chrome 87 → 107  
- Edge 88 → 107  
- Firefox 78 → 104  
- Safari 14.0 → 16.0  

这些浏览器版本符合 [Baseline](https://web-platform-dx.github.io/web-features/) 在 2025-05-01 时定义的“广泛可用”功能集标准。换句话说，它们的发布日期都在 2022-11-01 之前。

在 Vite 5 中，默认目标名为 `'modules'`，但现在该选项已不再可用。取而代之的是引入了一个新的默认目标 `'baseline-widely-available'`。

## 总体变化 {#general-changes}

### 移除了 Sass 旧版 API 支持 {#removed-sass-old-api-support}

如计划所述，Sass 旧版 API 的支持已被移除。Vite 现在仅支持现代 API。你可以移除 `css.preprocessorOptions.sass.api` 和 `css.preprocessorOptions.scss.api` 配置选项。

## 移除了已弃用的功能 {#removed-deprecated-features}

- `splitVendorChunkPlugin`（在 v5.2.7 中弃用）  
  - 该插件最初是为了方便迁移到 Vite v2.9 而提供的。  
  - 如有需要，可以使用 `build.rollupOptions.output.manualChunks` 选项来控制分块行为。
- `transformIndexHtml` 的 hook 级别 `enforce` / `transform`（在 v4.0.0 中弃用）  
  - 此更改是为了与 [Rollup 的对象型 hooks](https://rollupjs.org/plugin-development/#build-hooks:~:text=Instead%20of%20a%20function%2C%20hooks%20can%20also%20be%20objects.) 接口保持一致。  
  - 应使用 `order` 替代 `enforce`，使用 `handler` 替代 `transform`。

## 进阶 {#advanced}

还有其他一些只影响少数用户的破坏性更改。

- [[#19979] chore: declare version range for peer dependencies](https://github.com/vitejs/vite/pull/19979)
  - 为 CSS 预处理器指定了 peerDependencies 的版本范围。
- [[#20013] refactor: remove no-op `legacy.proxySsrExternalModules`](https://github.com/vitejs/vite/pull/20013)
  - `legacy.proxySsrExternalModules` 属性自 Vite 6 起已无实际作用，现已移除。
- [[#19985] refactor!: remove deprecated no-op type only properties](https://github.com/vitejs/vite/pull/19985)
  - 以下未使用的属性现已移除：`ModuleRunnerOptions.root`、`ViteDevServer._importGlobMap`、`ResolvePluginOptions.isFromTsImporter`、`ResolvePluginOptions.getDepsOptimizer`、`ResolvePluginOptions.shouldExternalize`、`ResolvePluginOptions.ssrConfig`
- [[#19986] refactor: remove deprecated env api properties](https://github.com/vitejs/vite/pull/19986)
  - 这些属性从一开始就被标记为弃用，现已移除。
- [[#19987] refactor!: remove deprecated `HotBroadcaster` related types](https://github.com/vitejs/vite/pull/19987)
  - 这些类型是作为现已弃用的 Runtime API 的一部分引入的，现已被移除：`HMRBroadcaster`、`HMRBroadcasterClient`、`ServerHMRChannel`、`HMRChannel`。
- [[#19996] fix(ssr)!: don't access `Object` variable in ssr transformed code](https://github.com/vitejs/vite/pull/19996)
  - `__vite_ssr_exportName__` 现在是模块运行时上下文中的必需字段。
- [[#20045] fix: treat all `optimizeDeps.entries` values as globs](https://github.com/vitejs/vite/pull/20045)
  - `optimizeDeps.entries` 不再接收字面量字符串路径，而是始终接收 glob 模式。
- [[#20222] feat: apply some middlewares before `configureServer` hook](https://github.com/vitejs/vite/pull/20222), [[#20224] feat: apply some middlewares before `configurePreviewServer` hook](https://github.com/vitejs/vite/pull/20224)
  - 某些中间件现在会在 `configureServer` / `configurePreviewServer` 钩子之前被应用。请注意，如果你不希望某个路由应用 [`server.cors`](../config/server-options.md#server-cors) / [`preview.cors`](../config/preview-options.md#preview-cors) 配置，请务必从响应中移除相关的请求头。

## 从 v5 迁移 {#migration-from-v5}

请先查阅 Vite v6 文档中的 [从 v5 迁移指南](https://v6.vite.dev/guide/migration.html)（[中文版](/guide/migration-from-v5.md)），了解如何将你的应用迁移到 Vite 6 所需的变更，然后再继续执行本页中的相关更改。
