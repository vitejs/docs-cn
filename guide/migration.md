# 从 v5 迁移 {#migration-from-v5}

## 环境 API {#environment-api}

作为新的实验性 [环境 API](/guide/api-environment.md) 的一部分，我们进行了大规模的内部重构。Vite 6 努力避免引入破坏性的变更，以确保大多数项目能够快速升级到新的主要版本。我们会等待大部分的生态系统迁移并稳定后，再开始推荐使用新的 API。可能会有一些边缘情况，但这些应该只会影响到框架和工具的底层使用。我们已经与生态系统中的维护者合作，在发布前减轻了这些差异。如果你发现了回退性问题，请 [新建 issue](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml)。

由于 Vite 的实现发生了改变，一些内部的 API 已经被移除了。如果你依赖于其中的某一个，那么请创建一个 [feature request](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml)。

## Vite Runtime API {#vite-runtime-api}

实验性的 Vite Runtime API 已经演变为模块运行器 API（Module Runner API），这是作为新的实验性 [环境 API](/guide/api-environment) 的一部分，在 Vite 6 中发布。鉴于这个功能是实验性的，所以在 Vite 5.1 中引入的先前 API 的移除并不是一个破坏性的更改，但是用户在迁移到 Vite 6 的过程中，需要将他们的使用方式更新为与模块运行器相等的方式。

## 总体变化 {#general-changes}

### JSON stringify

在 Vite 5 中，当设置 [`json.stringify: true`](/config/shared-options#json-stringify) 时，[`json.namedExports`](/config/shared-options#json-namedexports) 会被禁用。

从 Vite 6 开始，即使设置了 `json.stringify: true`，`json.namedExports` 也不会被禁用。如果希望实现以前的行为，可以设置 `json.namedExports: false`。

Vite 6 还为 `json.stringify` 引入了一个新的默认值，即 `'auto'`，它只会对大型 JSON 文件进行字符串化处理。要禁用此行为，请设置 `json.stringify: false`。

### postcss-load-config

[`postcss-load-config`](https://npmjs.com/package/postcss-load-config) 已从 v4 更新至 v6。现在需要 [`tsx`](https://www.npmjs.com/package/tsx) 或 [`jiti`](https://www.npmjs.com/package/jiti) 来加载 TypeScript postcss 配置文件，而非 [`ts-node`](https://www.npmjs.com/package/ts-node)。此外，现在需要 [`yaml`](https://www.npmjs.com/package/yaml) 来加​​载 YAML postcss 配置文件。

### Sass 现在默认使用现代 API {#sass-now-uses-modern-api-by-default}

在 Vite 5 中，Sass 默认使用传统 API。Vite 5.4 增加了对现代 API 的支持。

从 Vite 6 开始，Sass 默认使用现代 API。如果想继续使用传统 API，可以设置 [`css.preprocessorOptions.sass.api: 'legacy'` / `css.preprocessorOptions.scss.api: 'legacy'`](/config/shared-options#css-preprocessoroptions)。但请注意，传统 API 支持将在 Vite 7 中移除。

要迁移到现代 API，请参阅 [Sass 文档](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/)。

## 进阶 {#advanced}

还有其他一些只影响少数用户的破坏性更改。

- [[#15637] fix!: default `build.cssMinify` to `'esbuild'` for SSR](https://github.com/vitejs/vite/pull/15637)
  - [`build.cssMinify`](/config/build-options#build-cssminify) 现在即使是 SSR 版本也默认为启用。
- [[#18209] refactor!: bump minimal terser version to 5.16.0](https://github.com/vitejs/vite/pull/18209)
  - [`build.minify: 'terser'`](/config/build-options#build-minify) 所支持的最小 terser 版本从 5.4.0 提升至 5.16.0
- [[#18231] chore(deps): update dependency @rollup/plugin-commonjs to v28](https://github.com/vitejs/vite/pull/18231)
  - [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires) 现在默认为 `true`（之前为 `'auto'`)。
- [[#18243] chore(deps)!: migrate `fast-glob` to `tinyglobby`](https://github.com/vitejs/vite/pull/18243)
  - globs 中不再支持范围大括号 (`{01..03}` ⇒ `['01', '02', '03']`) 和递增大括号 (`{2..8..2}` ⇒ `['2', '4', '6', '8']`) 。

## 从 v4 迁移 {#migration-from-v4}

在 Vite v5 文档中查看 [从 v4 迁移指南](https://v4.vite.dev/guide/migration.html)（[中文版](/guide/migration-from-v4)），了解如何将你的应用迁移到 Vite v5，然后再处理本页中所提及的变化。
