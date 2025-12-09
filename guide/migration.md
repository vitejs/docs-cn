# 从 v7 迁移 {#migration-from-v7}

## 浏览器兼容性目标变更 {#default-browser-target-change}

`build.target` 和 `'baseline-widely-available'` 的默认浏览器值已更新为较新的浏览器版本：

- Chrome 107 → 111
- Edge 107 → 111
- Firefox 104 → 114
- Safari 16.0 → 16.4

这些浏览器版本符合 [Baseline](https://web-platform-dx.github.io/web-features/) 在 2026-01-01 时定义的“广泛可用”功能集标准。换句话说，它们都是大约两年半前发布的。

## Rolldown {#rolldown}

Vite 8 使用基于 Rolldown 和 Oxc 的工具，而不是 esbuild 和 Rollup。

### 渐进式迁移 {#gradual-migration}

`rolldown-vite` 包实现了使用 Rolldown 的 Vite 7，但不包含其他 Vite 8 的变更。这可以作为迁移到 Vite 8 的中间步骤。请参阅 Vite 7 文档中的 [Rolldown 集成指南](https://v7.vite.dev/guide/rolldown) 了解如何从 Vite 7 切换到 `rolldown-vite`。

对于从 `rolldown-vite` 迁移到 Vite 8 的用户，你可以撤销 `package.json` 中的依赖变更并更新到 Vite 8：

```json
{
  "devDependencies": {
    "vite": "npm:rolldown-vite@7.2.2" // [!code --]
    "vite": "^8.0.0" // [!code ++]
  }
}
```

### 依赖优化器现在使用 Rolldown {#dependency-optimizer-now-uses-rolldown}

现在依赖优化使用 Rolldown 而不是 esbuild。Vite 仍然通过自动将 [`optimizeDeps.esbuildOptions`](/config/dep-optimization-options#optimizedeps-esbuildoptions) 转换为 [`optimizeDeps.rolldownOptions`](/config/dep-optimization-options#optimizedeps-rolldownoptions) 来支持向后兼容。`optimizeDeps.esbuildOptions` 现在已被弃用，将来会被移除，我们鼓励您迁移到 `optimizeDeps.rolldownOptions`。

以下选项会自动转换：

- [`esbuildOptions.minify`](https://esbuild.github.io/api/#minify) -> `rolldownOptions.output.minify`
- [`esbuildOptions.treeShaking`](https://esbuild.github.io/api/#tree-shaking) -> `rolldownOptions.treeshake`
- [`esbuildOptions.define`](https://esbuild.github.io/api/#define) -> `rolldownOptions.transform.define`
- [`esbuildOptions.loader`](https://esbuild.github.io/api/#loader) -> `rolldownOptions.moduleTypes`
- [`esbuildOptions.preserveSymlinks`](https://esbuild.github.io/api/#preserve-symlinks) -> `!rolldownOptions.resolve.symlinks`
- [`esbuildOptions.resolveExtensions`](https://esbuild.github.io/api/#resolve-extensions) -> `rolldownOptions.resolve.extensions`
- [`esbuildOptions.mainFields`](https://esbuild.github.io/api/#main-fields) -> `rolldownOptions.resolve.mainFields`
- [`esbuildOptions.conditions`](https://esbuild.github.io/api/#conditions) -> `rolldownOptions.resolve.conditionNames`
- [`esbuildOptions.keepNames`](https://esbuild.github.io/api/#keep-names) -> `rolldownOptions.output.keepNames`
- [`esbuildOptions.platform`](https://esbuild.github.io/api/#platform) -> `rolldownOptions.platform`
- [`esbuildOptions.plugins`](https://esbuild.github.io/plugins/) -> `rolldownOptions.plugins` (partial support)

<!-- TODO: add link to rolldownOptions.* -->

你可以从 `configResolved` 钩子中获取由兼容层设置的选项：

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.optimizeDeps.rolldownOptions)
  },
},
```

### 使用 Oxc 转换 JavaScript  {#javascript-transforms-by-oxc}

现在使用 Oxc 进行 JavaScript 转换，而不是 esbuild。Vite 仍然通过自动将 [`esbuild`](/config/shared-options#esbuild) 选项转换为 [`oxc`](/config/shared-options#oxc) 来支持向后兼容。`esbuild` 现在已被弃用，将来会被移除，我们鼓励您迁移到 `oxc`。

以下选项会自动转换：

- `esbuild.jsxInject` -> `oxc.jsxInject`
- `esbuild.include` -> `oxc.include`
- `esbuild.exclude` -> `oxc.exclude`
- [`esbuild.jsx`](https://esbuild.github.io/api/#jsx) -> [`oxc.jsx`](https://oxc.rs/docs/guide/usage/transformer/jsx)
  - `esbuild.jsx: 'preserve'` -> `oxc.jsx: 'preserve'`
  - `esbuild.jsx: 'automatic'` -> `oxc.jsx: { runtime: 'automatic' }`
    - [`esbuild.jsxImportSource`](https://esbuild.github.io/api/#jsx-import-source) -> `oxc.jsx.importSource`
  - `esbuild.jsx: 'transform'` -> `oxc.jsx: { runtime: 'classic' }`
    - [`esbuild.jsxFactory`](https://esbuild.github.io/api/#jsx-factory) -> `oxc.jsx.pragma`
    - [`esbuild.jsxFragment`](https://esbuild.github.io/api/#jsx-fragment) -> `oxc.jsx.pragmaFrag`
  - [`esbuild.jsxDev`](https://esbuild.github.io/api/#jsx-dev) -> `oxc.jsx.development`
  - [`esbuild.jsxSideEffects`](https://esbuild.github.io/api/#jsx-side-effects) -> `oxc.jsx.pure`
- [`esbuild.define`](https://esbuild.github.io/api/#define) -> [`oxc.define`](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define)
- [`esbuild.banner`](https://esbuild.github.io/api/#banner) -> 使用 transform 钩子的自定义插件
- [`esbuild.footer`](https://esbuild.github.io/api/#footer) -> 使用 transform 钩子的自定义插件

[`esbuild.supported`](https://esbuild.github.io/api/#supported) 选项不被 Oxc 支持。如果你需要这个选项，请查看 [oxc-project/oxc#15373](https://github.com/oxc-project/oxc/issues/15373)。

你可以从 `configResolved` 钩子中获取由兼容层设置的选项：

```js
const plugin = {
  name: 'log-config',
  configResolved(config) {
    console.log('options', config.oxc)
  },
},
```

<!-- TODO: add link to rolldownOptions.output.minify -->

目前，Oxc 转换器不支持降低原生装饰器，因为我们正在等待规范的进展，参见 ([oxc-project/oxc#9170](https://github.com/oxc-project/oxc/issues/9170))。

:::: details 降低原生装饰器的解决方法

目前你可以使用 [Babel](https://babeljs.io/) 或 [SWC](https://swc.rs/) 来降低原生装饰器。虽然 SWC 比 Babel 更快，但它**不支持 esbuild 支持的最新装饰器规范**。

自从装饰器规范达到第 3 阶段以来，已经更新了多次。每个工具支持的版本如下：

- `"2023-11"`（esbuild、TypeScript 5.4+ 和 Babel 支持此版本）
- `"2023-05"`（TypeScript 5.2+ 支持此版本）
- `"2023-01"`（TypeScript 5.0+ 支持此版本）
- `"2022-03"`（SWC 支持此版本）

请参阅 [Babel 装饰器版本指南](https://babeljs.io/docs/babel-plugin-proposal-decorators#version) 了解各版本之间的差异。

**使用 Babel:**

::: code-group

```bash [npm]
$ npm install -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Yarn]
$ yarn add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [pnpm]
$ pnpm add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Bun]
$ bun add -D @rollup/plugin-babel @babel/plugin-proposal-decorators
```

```bash [Deno]
$ deno add -D npm:@rollup/plugin-babel npm:@babel/plugin-proposal-decorators
```

:::

```ts [vite.config.ts]
import { defineConfig, withFilter } from 'vite'
import { babel } from '@rollup/plugin-babel'

export default defineConfig({
  plugins: [
    withFilter(
      babel({
        configFile: false,
        plugins: [
          ['@babel/plugin-proposal-decorators', { version: '2023-11' }],
        ],
      }),
      // Only run this transform if the file contains a decorator.
      { transform: { code: '@' } },
    ),
  ],
})
```

**使用 SWC:**

::: code-group

```bash [npm]
$ npm install -D @rollup/plugin-swc @swc/core
```

```bash [Yarn]
$ yarn add -D @rollup/plugin-swc @swc/core
```

```bash [pnpm]
$ pnpm add -D @rollup/plugin-swc @swc/core
```

```bash [Bun]
$ bun add -D @rollup/plugin-swc @swc/core
```

```bash [Deno]
$ deno add -D npm:@rollup/plugin-swc npm:@swc/core
```

:::

```js
import { defineConfig, withFilter } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    withFilter(
      swc({
        swc: {
          jsc: {
            parser: { decorators: true, decoratorsBeforeExport: true },
            // NOTE: SWC doesn't support the '2023-11' version yet.
            transform: { decoratorVersion: '2022-03' },
          },
        },
      }),
      // Only run this transform if the file contains a decorator.
      { transform: { code: '@' } },
    ),
  ],
})
```

::::

#### esbuild 回退机制 {#esbuild-fallbacks}

`esbuild` 不再被 Vite 直接使用，现在是一个可选依赖。如果你正在使用一个使用 `transformWithEsbuild` 函数的插件，你需要将 `esbuild` 安装为 `devDependency`。`transformWithEsbuild` 函数已被弃用，将来会被移除。我们建议迁移到新的 `transformWithOxc` 函数。

### 使用 Oxc 进行 JavaScript 压缩 {#javascript-minification-by-oxc}

现在使用 Oxc 压缩器进行 JavaScript 压缩，而不是 esbuild。你可以使用已弃用的 [`build.minify: 'esbuild'`](/config/build-options#build-minify) 选项切换回 esbuild。这个配置选项将来会被移除，你需要将 `esbuild` 安装为 `devDependency`，因为 Vite 不再直接依赖 esbuild。

如果你之前使用 `esbuild.minify*` 选项来控制压缩行为，现在可以改用 `build.rolldownOptions.output.minify`。如果你之前使用 `esbuild.drop` 选项，现在可以改用 [`build.rolldownOptions.output.minify.compress.drop*` 选项](https://oxc.rs/docs/guide/usage/minifier/dead-code-elimination)。

Oxc 不支持属性混淆及其相关选项（[`mangleProps`、`reserveProps`、`mangleQuoted`、`mangleCache`](https://esbuild.github.io/api/#mangle-props)）。如果你需要这些选项，请查看 [oxc-project/oxc#15375](https://github.com/oxc-project/oxc/issues/15375)。

esbuild 和 Oxc 压缩器对源代码做出了略微不同的假设。如果你怀疑压缩器导致了代码损坏，可以在此处比较这些假设：

- [esbuild 压缩假设](https://esbuild.github.io/api/#minify-considerations)
- [Oxc 压缩器假设](https://oxc.rs/docs/guide/usage/minifier.html#assumptions)

请报告你在 JavaScript 应用程序中发现的任何与压缩相关的问题。

### 使用 Lightning CSS 进行 CSS 压缩 {#css-minification-by-lightning-css}

现在默认使用 [Lightning CSS](https://lightningcss.dev/) 进行 CSS 压缩。你可以使用 [`build.cssMinify: 'esbuild'`](/config/build-options#build-minify) 选项切换回 esbuild。请注意，你需要将 `esbuild` 安装为 `devDependency`。

Lightning CSS 支持更好的语法降级，你的 CSS 包大小可能会略有增加。

### 一致的 CommonJS 互操作性 {#consistent-commonjs-interop}

现在以一致的方式处理来自 CommonJS (CJS) 模块的 `default` 导入。

如果符合以下条件之一，则 `default` 导入是被导入的 CJS 模块的 `module.exports` 值。否则，`default` 导入是被导入的 CJS 模块的 `module.exports.default` 值：

- 导入者是 `.mjs` 或 `.mts` 文件。
- 导入者最近的 `package.json` 文件中 `type` 字段设置为 `module`。
- 被导入的 CJS 模块的 `module.exports.__esModule` 值未设置为 true。

::: details 之前的行为

在开发环境中，如果符合以下条件之一，则 `default` 导入是被导入的 CJS 模块的 `module.exports` 值。否则，`default` 导入是被导入的 CJS 模块的 `module.exports.default` 值：

- _导入者包含在依赖优化中_ 且为 `.mjs` 或 `.mts` 文件。
- _导入者包含在依赖优化中_ 且导入者最近的 `package.json` 文件中 `type` 字段设置为 `module`。
- 被导入的 CJS 模块的 `module.exports.__esModule` 值未设置为 true。

在构建时，条件为：

- 被导入的 CJS 模块的 `module.exports.__esModule` 值未设置为 true。
- _`module.exports` 的 `default` 属性不存在_。

(假设 [`build.commonjsOptions.defaultIsModuleExports`](https://github.com/rollup/plugins/tree/master/packages/commonjs#defaultismoduleexports) 未从默认的 `'auto'` 更改)

:::

有关此问题的更多详细信息，请参阅 Rolldown 的文档：[CJS 模块中不明确的 `default` 导入 - 打包 CJS | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#ambiguous-default-import-from-cjs-modules)。

此更改可能会破坏一些现有的导入 CJS 模块的代码。你可以使用已弃用的 `legacy.inconsistentCjsInterop: true` 选项临时恢复之前的行为。如果你发现某个包受此更改影响，请向包作者报告或发送拉取请求。请确保链接上面的 Rolldown 文档，以便作者能够理解上下文。

### 使用格式嗅探移除模块解析 {#removed-module-resolution-using-format-sniffing}

当 `package.json` 中同时存在 `browser` 和 `module` 字段时，Vite 以前会根据文件内容来解析字段，并为浏览器选择 ESM 文件。引入这一机制是因为一些包使用 `module` 字段指向 Node.js 的 ESM 文件，而其他包使用 `browser` 字段指向浏览器的 UMD 文件。鉴于现代 `exports` 字段解决了这个问题并且现在被许多包采用，Vite 不再使用这种启发式方法，而是始终遵循 [`resolve.mainFields`](/config/shared-options#resolve-mainfields) 选项的顺序。如果你依赖此行为，可以使用 [`resolve.alias`](/config/shared-options#resolve-alias) 选项将字段映射到所需的文件，或使用包管理器应用补丁（例如 `patch-package`、`pnpm patch`）。

### 外部化模块的 Require 调用 {#require-calls-for-externalized-modules}

现在外部化模块的 `require` 调用会被保留为 `require` 调用，而不会被转换为 `import` 语句。这是为了保持 `require` 调用的语义。如果你想将它们转换为 `import` 语句，可以使用 Rolldown 内置的 `esmExternalRequirePlugin`，该插件由 `vite` 重新导出。

```js
import { defineConfig, esmExternalRequirePlugin } from 'vite'

export default defineConfig({
  // ...
  plugins: [
    esmExternalRequirePlugin({
      external: ['react', 'vue', /^node:/],
    }),
  ],
})
```

有关更多详细信息，请参阅 Rolldown 的文档：[`require` 外部模块 - 打包 CJS | Rolldown](https://rolldown.rs/in-depth/bundling-cjs#require-external-modules)。

### `import.meta.url` in UMD / IIFE {#import-meta-url-in-umd-iife}

在 UMD / IIFE 输出格式中不再对 `import.meta.url` 进行 polyfill。默认情况下它将被替换为 `undefined`。如果你更喜欢之前的行为，可以使用 `define` 选项配合 `build.rolldownOptions.output.intro` 选项。有关更多详细信息，请参阅 Rolldown 的文档：[知名的 `import.meta` 属性 - 非 ESM 输出格式 | Rolldown](https://rolldown.rs/in-depth/non-esm-output-formats#well-known-import-meta-properties)。

### 移除了 `build.rollupOptions.watch.chokidar` 选项 {#removed-build-rollupoptions-watch-chokidar-option}

`build.rollupOptions.watch.chokidar` 选项已被移除。请迁移到 `build.rolldownOptions.watch.notify` 选项。

<!-- TODO: add link to rolldownOptions.watch.notify -->

### 弃用 `build.rollupOptions.output.manualChunks` {#deprecate-build-rollupoptions-output-manualchunks}

`output.manualChunks` 选项已被弃用。Rolldown 提供了更灵活的 `advancedChunks` 选项。有关 `advancedChunks` 的更多详情，请参阅 Rolldown 的文档：[高级分块 - Rolldown](https://rolldown.rs/in-depth/advanced-chunks)。

<!-- TODO: add link to rolldownOptions.output.advancedChunks -->

### 模块类型支持和自动检测 {#module-type-support-and-auto-detection}

_此更改仅影响插件作者。_

Rolldown 对[模块类型](https://rolldown.rs/guide/notable-features#module-types)提供了实验性支持，类似于[esbuild 的 `loader` 选项](https://esbuild.github.io/api/#loader)。因此，Rolldown 会根据解析后的 ID 扩展名自动设置模块类型。如果你在 `load` 或 `transform` 钩子中将其他模块类型的内容转换为 JavaScript，你可能需要在返回值中添加 `moduleType: 'js'`：

```js
const plugin = {
  name: 'txt-loader',
  load(id) {
    if (id.endsWith('.txt')) {
      const content = fs.readFile(id, 'utf-8')
      return {
        code: `export default ${JSON.stringify(content)}`,
        moduleType: 'js', // [!code ++]
      }
    }
  },
}
```

### 其他相关弃用 {#other-related-deprecations}

以下选项已被弃用，将在未来被移除：

- `build.rollupOptions`：重命名为 `build.rolldownOptions`
- `worker.rollupOptions`：重命名为 `worker.rolldownOptions`
- `build.commonjsOptions`：现在无操作效果

## 总体变化 {#general-changes}

## 移除了已弃用的功能 {#removed-deprecated-features}

**_TODO：此更改尚未实现，但将在稳定版发布前实现。_**

## 进阶 {#advanced}

还有其他一些只影响少数用户的破坏性更改。

- **[TODO: 这将在稳定版发布前修复]** https://github.com/rolldown/rolldown/issues/5726 (affects nuxt, qwik)
- **[TODO: 这将在稳定版发布前修复]** https://github.com/rolldown/rolldown/issues/3403 (affects sveltekit)
- **[TODO: 这将在稳定版发布前修复]** 由于缺少预构建块输出功能([rolldown#4304](https://github.com/rolldown/rolldown/issues/4034))，旧版块现在作为资源文件而不是块文件输出。这意味着块相关选项不适用于旧版块，清单文件也不会将旧版块包含为块文件。
- **[TODO: 这将在稳定版发布前修复]** 解析器缓存在 Vitest 中破坏了一些边缘情况 ([rolldown-vite#466](https://github.com/vitejs/rolldown-vite/issues/466), [vitest#8754](https://github.com/vitest-dev/vitest/issues/8754#issuecomment-3441115032))
- **[TODO: 这将在稳定版发布前修复]** 解析器无法与 yarn pnp 配合使用 ([rolldown-vite#324](https://github.com/vitejs/rolldown-vite/issues/324), [rolldown-vite#392](https://github.com/vitejs/rolldown-vite/issues/392))
- **[TODO: 这将在稳定版发布前修复]** 原生插件排序问题 ([rolldown-vite#373](https://github.com/vitejs/rolldown-vite/issues/373))
- **[TODO: 这将在稳定版发布前修复]** `@vite-ignore` 注释边缘情况 ([rolldown-vite#426](https://github.com/vitejs/rolldown-vite/issues/426))
- **[TODO: 这将在稳定版发布前修复]** https://github.com/rolldown/rolldown/issues/3403
- [Extglobs](https://github.com/micromatch/picomatch/blob/master/README.md#extglobs) 尚未得到支持 ([rolldown-vite#365](https://github.com/vitejs/rolldown-vite/issues/365))
- `define` 不共享对象引用：当你传递一个对象作为 `define` 的值时，每个变量都会有一个单独的对象副本。详见 [Oxc 转换器文档](https://oxc.rs/docs/guide/usage/transformer/global-variable-replacement#define)。
- `bundle` 对象变更（`bundle` 是在 `generateBundle` / `writeBundle` 钩子中传递的对象，由 `build` 函数返回）：
  - 不支持赋值给 `bundle[foo]`。Rollup 也不鼓励这样做。请使用 `this.emitFile()` 代替。
  - 引用在钩子之间不共享 ([rolldown-vite#410](https://github.com/vitejs/rolldown-vite/issues/410))
  - `structuredClone(bundle)` 会出现 `DataCloneError: #<Object> could not be cloned` 错误。这不再被支持。请使用 `structuredClone({ ...bundle })` 来克隆。([rolldown-vite#128](https://github.com/vitejs/rolldown-vite/issues/128))
- Rollup 中的所有并行钩子现在都作为串行钩子工作。详见 [Rolldown 的文档](https://rolldown.rs/apis/plugin-api#sequential-hook-execution)。
- `"use strict";` 有时不会被注入。详见 [Rolldown 的文档](https://rolldown.rs/in-depth/directives)。
- 使用 plugin-legacy 转换到低于 ES5 的版本不受支持 ([rolldown-vite#452](https://github.com/vitejs/rolldown-vite/issues/452))
- 向 `build.target` 选项传递同一浏览器的多个版本现在会报错：esbuild 会选择最新的版本，这可能不是你的本意。
- Rolldown 缺少支持：以下功能不受 Rolldown 支持，Vite 也不再支持这些功能。
  - `build.rollupOptions.output.format: 'system'` ([rolldown#2387](https://github.com/rolldown/rolldown/issues/2387))
  - `build.rollupOptions.output.format: 'amd'` ([rolldown#2387](https://github.com/rolldown/rolldown/issues/2528))
  - 完整的 TypeScript 遗留命名空间支持 ([oxc-project/oxc#14227](https://github.com/oxc-project/oxc/issues/14227))
  - `shouldTransformCachedModule` 钩子 ([rolldown#4389](https://github.com/rolldown/rolldown/issues/4389))
  - `resolveImportMeta` 钩子 ([rolldown#1010](https://github.com/rolldown/rolldown/issues/1010))
  - `renderDynamicImport` 钩子 ([rolldown#4532](https://github.com/rolldown/rolldown/issues/4532))
  - `resolveFileUrl` 钩子
- `parseAst` / `parseAstAsync` 函数现在已被弃用，推荐使用功能更多的 `parse` / `parseAsync` 函数。

## 从 v6 迁移 {#migration-from-v6}

请先查阅 Vite v7 文档中的 [从 v6 迁移指南](https://v7.vite.dev/guide/migration)（[中文版](/guide/migration-from-v6.md)），了解如何将你的应用迁移到 Vite 7 所需的变更，然后再继续执行本页中的相关更改。
