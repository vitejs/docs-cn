# 从 v6 迁移 {#migration-from-v6}

## Node.js 支持 {#nodejs-support}

Vite 不再支持 Node.js 18，该版本已结束官方支持。现在需要 Node.js 20.19+ / 22.12+。

## 默认浏览器目标变更 {#default-browser-target-change}

默认浏览器目标值 `build.target` 已更新为较新的浏览器。

- Chrome 87 → 107
- Edge 88 → 107 
- Firefox 78 → 104
- Safari 14.0 → 16.0

这些浏览器版本与截至 2025-05-01 的 [Baseline](https://web-platform-dx.github.io/web-features/) Widely Available 功能集一致。换句话说，它们都是在 2022 年 11 月 1 日之前发布的。

在 Vite 5 中，默认目标名为 `'modules'`，但这不再可用。取而代之的是引入了新的默认目标 `'baseline-widely-available'`。

## 总体变化 {#general-changes}

### 移除 Sass 旧版 API 支持 {#removed-sass-legacy-api-support}

按照计划，对 Sass 旧版 API 的支持已被移除。Vite 现在仅支持现代 API。您可以移除 `css.preprocessorOptions.sass.api` / `css.preprocessorOptions.scss.api` 选项。

## 移除已弃用功能 {#removed-deprecated-features}

- `splitVendorChunkPlugin`（在 v5.2.7 中弃用）
  - 此插件最初是为了简化迁移到 Vite v2.9 而提供的。
  - 如果需要控制分块行为，可以使用 `build.rollupOptions.output.manualChunks` 选项。
- `transformIndexHtml` 的钩子 `enforce` / `transform`（在 v4.0.0 中弃用）
  - 这个变更是为了使接口与 [Rollup 的对象钩子](https://rollupjs.org/plugin-development/#build-hooks:~:text=Instead%20of%20a%20function%2C%20hooks%20can%20also%20be%20objects.) 保持一致。
  - 应该使用 `order` 替代 `enforce`，使用 `handler` 替代 `transform`。

## 进阶 {#advanced}

还有其他一些重大更改，这些更改仅影响少数用户。

- [[#19979] chore: declare version range for peer dependencies](https://github.com/vitejs/vite/pull/19979)
  - 为 CSS 预处理器指定了对等依赖的版本范围。
- [[#20013] refactor: remove no-op `legacy.proxySsrExternalModules`](https://github.com/vitejs/vite/pull/20013)
  - 自 Vite 6 起，`legacy.proxySsrExternalModules` 属性已无效果。现已移除。
- [[#19985] refactor!: remove deprecated no-op type only properties](https://github.com/vitejs/vite/pull/19985)
  - 以下未使用的属性现已移除：`ModuleRunnerOptions.root`、`ViteDevServer._importGlobMap`、`ResolvePluginOptions.isFromTsImporter`、`ResolvePluginOptions.getDepsOptimizer`、`ResolvePluginOptions.shouldExternalize`、`ResolvePluginOptions.ssrConfig`
- [[#19986] refactor: remove deprecated env api properties](https://github.com/vitejs/vite/pull/19986)
  - 这些属性从一开始就被弃用。现已移除。
- [[#19987] refactor!: remove deprecated `HotBroadcaster` related types](https://github.com/vitejs/vite/pull/19987)
  - 这些类型是作为现已弃用的 Runtime API 的一部分引入的。现已移除：`HMRBroadcaster`、`HMRBroadcasterClient`、`ServerHMRChannel`、`HMRChannel`
- [[#19996] fix(ssr)!: don't access `Object` variable in ssr transformed code](https://github.com/vitejs/vite/pull/19996)
  - Module Runner 运行时上下文现在需要 `__vite_ssr_exportName__`。
- [[#20045] fix: treat all `optimizeDeps.entries` values as globs](https://github.com/vitejs/vite/pull/20045)
  - `optimizeDeps.entries` 现在不接收文字字符串路径。相反，它始终接收 glob。
- [[#20222] feat: apply some middlewares before `configureServer` hook](https://github.com/vitejs/vite/pull/20222), [[#20224] feat: apply some middlewares before `configurePreviewServer` hook](https://github.com/vitejs/vite/pull/20224)
  - 一些中间件现在在 `configureServer` / `configurePreviewServer` 钩子之前应用。请注意，如果您不希望某个特定路由应用 [`server.cors`](/config/server-options#server-cors) / [`preview.cors`](/config/preview-options#preview-cors) 选项，请确保从响应中移除相关头信息。

## 从 v5 迁移 {#migration-from-v5}

查看 Vite v6 文档中的[从 v5 迁移指南](https://v6.vite.dev/guide/migration.html)，了解如何将你的应用迁移到 Vite 6，然后再处理本页中提及的变更。