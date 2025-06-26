# 从 v5 迁移 {#migration-from-v5}

## 环境 API {#environment-api}

作为新的实验性 [环境 API](/guide/api-environment.md) 的一部分，我们进行了大规模的内部重构。Vite 6 努力避免引入破坏性的变更，以确保大多数项目能够快速升级到新的主要版本。我们会等待大部分的生态系统迁移并稳定后，再开始推荐使用新的 API。可能会有一些边缘情况，但这些应该只会影响到框架和工具的底层使用。我们已经与生态系统中的维护者合作，在发布前减轻了这些差异。如果你发现了回退性问题，请 [新建 issue](https://github.com/vitejs/vite/issues/new?assignees=&labels=pending+triage&projects=&template=bug_report.yml)。

由于 Vite 的实现发生了改变，一些内部的 API 已经被移除了。如果你依赖于其中的某一个，那么请创建一个 [feature request](https://github.com/vitejs/vite/issues/new?assignees=&labels=enhancement%3A+pending+triage&projects=&template=feature_request.yml)。

## Vite Runtime API {#vite-runtime-api}

实验性的 Vite Runtime API 已经演变为模块运行器 API（Module Runner API），这是作为新的实验性 [环境 API](/guide/api-environment) 的一部分，在 Vite 6 中发布。鉴于这个功能是实验性的，所以在 Vite 5.1 中引入的先前 API 的移除并不是一个破坏性的更改，但是用户在迁移到 Vite 6 的过程中，需要将他们的使用方式更新为与模块运行器相等的方式。

## 总体变化 {#general-changes}

### `resolve.conditions` 的默认值 {#default-value-for-resolve-conditions}

此更改不会影响未配置 [`resolve.conditions`](/config/shared-options#resolve-conditions) / [`ssr.resolve.conditions`](/config/ssr-options#ssr-resolve-conditions) / [`ssr.resolve.externalConditions`](/config/ssr-options#ssr-resolve-externalconditions) 的用户。

在 Vite 5 中，`resolve.conditions` 的默认值是 `[]`，某些条件是内部添加的。`ssr.resolve.conditions` 的默认值是 `resolve.conditions` 的值。

从 Vite 6 开始，部分条件不再在内部添加，需要包含在配置值中。
不再在内部添加的条件为

- `resolve.conditions` 是 `['module', 'browser', 'development|production']`
- `ssr.resolve.conditions` 是 `['module', 'node', 'development|production']`

这些选项的默认值会更新为相应的值，`ssr.resolve.conditions` 不再使用 `resolve.conditions` 作为默认值。请注意，`development|production`是一个特殊变量，会根据 `process.env.NODE_ENV` 的值被替换为 `production` 或 `development`。这些默认值从 `vite` 导出为 `defaultClientConditions` 和 `defaultServerConditions`。

如果为 `resolve.conditions` 或 `ssr.resolve.conditions` 指定了自定义值，则需要更新该值以包含新条件。
例如，如果先前为 `resolve.conditions` 指定了 `['custom']`，那么现在就需要指定 `['custom', ...defaultClientConditions]`。

### JSON stringify

在 Vite 5 中，当设置 [`json.stringify: true`](/config/shared-options#json-stringify) 时，[`json.namedExports`](/config/shared-options#json-namedexports) 会被禁用。

从 Vite 6 开始，即使设置了 `json.stringify: true`，`json.namedExports` 也不会被禁用。如果希望实现以前的行为，可以设置 `json.namedExports: false`。

Vite 6 还为 `json.stringify` 引入了一个新的默认值，即 `'auto'`，它只会对大型 JSON 文件进行字符串化处理。要禁用此行为，请设置 `json.stringify: false`。

### 在 HTML 元素中扩展对资源引用的支持 {#extended-support-of-asset-references-in-html-elements}

在 Vite 5 中，只有少数支持的 HTML 元素能够引用由 Vite 处理和打包的资源，如`<link href>`、`<img src>` 等。

Vite 6 扩展了对更多 HTML 元素的支持。完整列表请参见 [HTML 功能介绍](/guide/features.html#html) 文档。

要在某些元素上选择不进行 HTML 处理，可以在元素上添加 `vite-ignore` 属性。

### postcss-load-config

[`postcss-load-config`](https://npmjs.com/package/postcss-load-config) 已从 v4 更新至 v6。现在需要 [`tsx`](https://www.npmjs.com/package/tsx) 或 [`jiti`](https://www.npmjs.com/package/jiti) 来加载 TypeScript postcss 配置文件，而非 [`ts-node`](https://www.npmjs.com/package/ts-node)。此外，现在需要 [`yaml`](https://www.npmjs.com/package/yaml) 来加​​载 YAML postcss 配置文件。

### Sass 现在默认使用现代 API {#sass-now-uses-modern-api-by-default}

在 Vite 5 中，Sass 默认使用传统 API。Vite 5.4 增加了对现代 API 的支持。

从 Vite 6 开始，Sass 默认使用现代 API。如果想继续使用传统 API，可以设置 [`css.preprocessorOptions.sass.api: 'legacy'` / `css.preprocessorOptions.scss.api: 'legacy'`](/config/shared-options#css-preprocessoroptions)。但请注意，传统 API 支持将在 Vite 7 中移除。

要迁移到现代 API，请参阅 [Sass 文档](https://sass-lang.com/documentation/breaking-changes/legacy-js-api/)。

### 在 library 模式下自定义 CSS 输出文件名 {#customize-css-output-file-name-in-library-mode}

在 Vite 5 中，library 模式下的 CSS 输出文件名始终是 `style.css`，无法通过 Vite 配置轻松更改。

从 Vite 6 开始，默认文件名将使用 `package.json` 中的 `"name"`，与 JS 输出文件类似。如果 [`build.lib.fileName`](/config/build-options.md#build-lib) 设置为字符串，该值也将用于 CSS 输出文件名。要明确设置不同的 CSS 文件名，可以使用新的 [`build.lib.cssFileName`](/config/build-options.md#build-lib) 进行配置。

迁移时，如果您依赖于 `style.css` 文件名，则应根据软件包名称将对该文件的引用更新为新名称。例如:

```json [package.json]
{
  "name": "my-lib",
  "exports": {
    "./style.css": "./dist/style.css" // [!code --]
    "./style.css": "./dist/my-lib.css" // [!code ++]
  }
}
```

如果你更喜欢像在 Vite 5 中那样使用 `style.css`，可以设置 `build.lib.cssFileName: 'style'`。

## 进阶 {#advanced}

还有其他一些只影响少数用户的破坏性更改。

- [[#17922] fix(css)!: remove default import in ssr dev](https://github.com/vitejs/vite/pull/17922)
  - 对 CSS 文件默认导入的支持在 Vite 4 中[已被弃用](https://v4.vite.dev/guide/migration.html#importing-css-as-a-string)，并在 Vite 5 中被移除，但在 SSR 开发模式中仍被无意支持。现在该支持已被移除。
- [[#15637] fix!: default `build.cssMinify` to `'esbuild'` for SSR](https://github.com/vitejs/vite/pull/15637)
  - [`build.cssMinify`](/config/build-options#build-cssminify) 现在即使是 SSR 版本也默认为启用。
- [[#18070] feat!: proxy bypass with WebSocket](https://github.com/vitejs/vite/pull/18070)
  - `server.proxy[path].bypass` 现在用于 WebSocket 升级请求，在这种情况下，`res` 参数将是 `undefined`。
- [[#18209] refactor!: bump minimal terser version to 5.16.0](https://github.com/vitejs/vite/pull/18209)
  - [`build.minify: 'terser'`](/config/build-options#build-minify) 所支持的最小 terser 版本从 5.4.0 提升至 5.16.0
- [[#18231] chore(deps): update dependency @rollup/plugin-commonjs to v28](https://github.com/vitejs/vite/pull/18231)
  - [`commonjsOptions.strictRequires`](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#strictrequires) 现在默认为 `true`（之前为 `'auto'`）。
    - 这可能会导致包的大小增大，但会使构建更加确定。
    - 如果将 CommonJS 文件指定为入口点，则可能需要额外的步骤。阅读 [commonjs plugin 文档](https://github.com/rollup/plugins/blob/master/packages/commonjs/README.md#using-commonjs-files-as-entry-points) 了解更多详情.
- [[#18243] chore(deps)!: migrate `fast-glob` to `tinyglobby`](https://github.com/vitejs/vite/pull/18243)
  - globs 中不再支持范围大括号 (`{01..03}` ⇒ `['01', '02', '03']`) 和递增大括号 (`{2..8..2}` ⇒ `['2', '4', '6', '8']`) 。
- [[#18395] feat(resolve)!: allow removing conditions](https://github.com/vitejs/vite/pull/18395)
  - 此 PR 不仅引入了上文提到的 " `resolve.conditions` 的默认值" 这一破坏性变更，还使得在 SSR 中，`resolve.mainFields` 不能用于无外部化依赖关系。如果您正在使用 `resolve.mainFields`，并希望将其应用于 SSR 中的无外部化依赖关系，您可以使用 [`ssr.resolve.mainFields`](/config/ssr-options#ssr-resolve-mainfields)。
- [[#18493] refactor!: remove fs.cachedChecks option](https://github.com/vitejs/vite/pull/18493)
  - 由于在缓存文件夹中写入文件并立即导入时会出现边缘情况，因此删除了这一选择优化。
- ~~[[#18697] fix(deps)!: update dependency dotenv-expand to v12](https://github.com/vitejs/vite/pull/18697)~~
  - ~~插值中使用的变量应在插值之前声明。更多详情，请参阅 [`dotenv-expand` changelog](https://github.com/motdotla/dotenv-expand/blob/v12.0.1/CHANGELOG.md#1200-2024-11-16)。~~ 此重大变化已在 v6.1.0 中恢复。
- [[#16471] feat: v6 - Environment API](https://github.com/vitejs/vite/pull/16471)

  - 对仅 SSR 模块的更新不再触发客户端的页面重载。要恢复以前的行为，可使用自定义 Vite 插件：
    <details>
    <summary>点击展开示例</summary>

    ```ts twoslash
    import type { Plugin, EnvironmentModuleNode } from 'vite'

    function hmrReload(): Plugin {
      return {
        name: 'hmr-reload',
        enforce: 'post',
        hotUpdate: {
          order: 'post',
          handler({ modules, server, timestamp }) {
            if (this.environment.name !== 'ssr') return

            let hasSsrOnlyModules = false

            const invalidatedModules = new Set<EnvironmentModuleNode>()
            for (const mod of modules) {
              if (mod.id == null) continue
              const clientModule =
                server.environments.client.moduleGraph.getModuleById(mod.id)
              if (clientModule != null) continue

              this.environment.moduleGraph.invalidateModule(
                mod,
                invalidatedModules,
                timestamp,
                true,
              )
              hasSsrOnlyModules = true
            }

            if (hasSsrOnlyModules) {
              server.ws.send({ type: 'full-reload' })
              return []
            }
          },
        },
      }
    }
    ```

    </details>

## 从 v4 迁移 {#migration-from-v4}

在 Vite v5 文档中查看 [从 v4 迁移指南](https://v5.vite.dev/guide/migration.html)（[中文版](/guide/migration-from-v4)），了解如何将你的应用迁移到 Vite v5，然后再处理本页中所提及的变化。
