# 依赖优化选项 {#dep-optimization-options}

- **相关内容：** [依赖预构建](/guide/dep-pre-bundling)

除非另有说明，本节中的选项仅适用于依赖优化器，该优化器仅在开发环境中使用。

## optimizeDeps.entries

- **类型：** `string | string[]`

默认情况下，Vite 会抓取你的 `index.html` 来检测需要预构建的依赖项（忽略了`node_modules`、`build.outDir`、`__tests__` 和 `coverage`）。如果指定了 `build.rollupOptions.input`，Vite 将转而去抓取这些入口点。

如果这两者都不合你意，则可以使用此选项指定自定义条目——该值需要遵循 [tinyglobby 模式](https://github.com/SuperchupuDev/tinyglobby) ，或者是相对于 Vite 项目根目录的匹配模式数组。当显式声明了 `optimizeDeps.entries` 时默认只有 `node_modules` 和 `build.outDir` 文件夹会被忽略。如果还需忽略其他文件夹，你可以在模式列表中使用以 `!` 为前缀的、用来匹配忽略项的模式。如果你不想忽略 `node_modules` 和 `build.outDir`，你可以选择直接使用字符串路径（不使用 tinyglobby 模式）。

## optimizeDeps.exclude {#optimizedeps-exclude}

- **类型：** `string[]`

在预构建中强制排除的依赖项。

:::warning CommonJS
CommonJS 的依赖不应该排除在优化外。如果一个 ESM 依赖被排除在优化外，但是却有一个嵌套的 CommonJS 依赖，则应该为该 CommonJS 依赖添加 `optimizeDeps.include`。例如：

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['esm-dep > cjs-dep'],
  },
})
```

:::

## optimizeDeps.include {#optimizedeps-include}

- **类型：** `string[]`

默认情况下，不在 `node_modules` 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包。

**实验性：** 如果你使用的是一个有很多深层导入的库，你也可以指定一个尾部的 glob 模式来一次性地预构建所有深层导入。这将避免在使用新的深层导入时不断地预构建。可以在此 [提供反馈](https://github.com/vitejs/vite/discussions/15833)。例如：

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```

## optimizeDeps.esbuildOptions {#optimizedeps-esbuild-options}

- **类型：** [`Omit`](https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys)`<`[`EsbuildBuildOptions`](https://esbuild.github.io/api/#general-options)`,
| 'bundle'
| 'entryPoints'
| 'external'
| 'write'
| 'watch'
| 'outdir'
| 'outfile'
| 'outbase'
| 'outExtension'
| 'metafile'>`

在依赖扫描和优化过程中传递给 esbuild 的选项。

某些选项进行了省略，因为修改它们与 Vite 的优化方案并不兼容。

- 忽略了 `external` 选项，请使用 Vite 的 `optimizeDeps.exclude` 选项
- `plugins` 与 Vite 的 dep 插件合并

## optimizeDeps.force {#optimizedeps-force}

- **类型：** `boolean`

设置为 `true` 可以强制依赖预构建，而忽略之前已经缓存过的、已经优化过的依赖。

## optimizeDeps.holdUntilCrawlEnd

- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/15834)
- **类型：** `boolean`
- **默认：** `true`

当该功能被启用时，系统会在冷启动时保持第一个优化的依赖结果，直到所有的静态导入都被检索完毕。这样可以避免因为发现新的依赖项而触发新的公共 chunk 生成，从而需要刷新整个页面。如果通过扫描和在 `include` 中明确定义的方式能找到所有的依赖项，那么最好关闭这个功能，这样浏览器可以并行处理更多的请求。

## optimizeDeps.disabled {#optimizedeps-disabled}

- **已废弃**
- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/13839)
- **类型：** `boolean | 'build' | 'dev'`
- **默认：** `'build'`

此选项已被弃用。从 Vite 5.1 版本开始，构建过程中对依赖项的预打包已经被移除。将 `optimizeDeps.disabled` 设置为 `true` 或 `'dev'` 将会禁用优化器，配置为 `false` 或 `'build'` 将会在开发模式下启用优化器。

如果你想完全禁用优化器，可以设置 `optimizeDeps.noDiscovery: true` 来禁止自动发现依赖项，并保持 `optimizeDeps.include` 未定义或为空。

:::warning
在构建过程中优化依赖项是一个 **实验性** 的功能。尝试这种策略的项目也会使用 `build.commonjsOptions: { include: [] }` 来移除 `@rollup/plugin-commonjs`。如果你这样做，将会有一个警告提示你在打包时需要重新启用它，以支持仅使用 CJS 的包。
:::

## optimizeDeps.needsInterop

- **实验性**
- **类型:** `string[]`

当导入这些依赖项时，会强制 ESM 转换。Vite 能够正确检测到依赖项是否需要转换处理（interop），因此通常不需要使用此选项。然而，不同的依赖项组合可能导致其中一些包以不同方式预构建。将这些包添加到 `needsInterop` 中可以通过避免重新加载整个页面、加快冷启动速度。如果某个依赖项符合此情况，Vite 将抛出警告，建议你在配置中添加该包名。
