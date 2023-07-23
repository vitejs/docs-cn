# 依赖优化选项 {#dep-optimization-options}

- **相关内容：** [依赖预构建](/guide/dep-pre-bundling)

## optimizeDeps.entries {#optimizedeps-entries}

- **类型：** `string | string[]`

默认情况下，Vite 会抓取你的 `index.html` 来检测需要预构建的依赖项（忽略了`node_modules`、`build.outDir`、`__tests__` 和 `coverage`）。如果指定了 `build.rollupOptions.input`，Vite 将转而去抓取这些入口点。

如果这两者都不合你意，则可以使用此选项指定自定义条目——该值需要遵循 [fast-glob 模式](https://github.com/mrmlnc/fast-glob#basic-syntax) ，或者是相对于 Vite 项目根目录的匹配模式数组。当显式声明了 `optimizeDeps.entries` 时默认只有 `node_modules` 和 `build.outDir` 文件夹会被忽略。如果还需忽略其他文件夹，你可以在模式列表中使用以 `!` 为前缀的、用来匹配忽略项的模式。

## optimizeDeps.exclude {#optimizedeps-exclude}

- **类型：** `string[]`

在预构建中强制排除的依赖项。

:::warning CommonJS
CommonJS 的依赖不应该排除在优化外。如果一个 ESM 依赖被排除在优化外，但是却有一个嵌套的 CommonJS 依赖，则应该为该 CommonJS 依赖添加 `optimizeDeps.include`。例如：

```js
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

**实验性：** 如果你使用的是一个有很多深层导入的库，你也可以指定一个尾部的 glob 模式来一次性地预构建所有深层导入。这将避免在使用新的深层导入时不断地预构建。例如：

```js
export default defineConfig({
  optimizeDeps: {
    include: ['my-lib/components/**/*.vue'],
  },
})
```

## optimizeDeps.esbuildOptions {#optimizedeps-esbuild-options}

- **类型：** [`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)

在依赖扫描和优化过程中传递给 esbuild 的选项。

某些选项进行了省略，因为修改它们与 Vite 的优化方案并不兼容。

- 忽略了 `external` 选项，请使用 Vite 的 `optimizeDeps.exclude` 选项
- `plugins` 与 Vite 的 dep 插件合并

## optimizeDeps.force {#optimizedeps-force}

- **类型：** `boolean`

设置为 `true` 可以强制依赖预构建，而忽略之前已经缓存过的、已经优化过的依赖。

## optimizeDeps.disabled {#optimizedeps-disabled}

- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/13839)
- **类型：** `boolean | 'build' | 'dev'`
- **默认：** `'build'`

禁用依赖优化，值为 `true` 将在构建和开发期间均禁用优化器。传 `'build'` 或 `'dev'` 将仅在其中一种模式下禁用优化器。默认情况下，仅在开发阶段启用依赖优化。

:::warning
在构建模式下依赖优化是 **实验性** 的。如果开启此项，那么它将消除开发与构建最终产物之间的最明显的区别之一。[`@rollup/plugin-commonjs`](https://github.com/rollup/plugins/tree/master/packages/commonjs) 在此处将不再需要，因为 esbuild 会将纯 CJS 依赖转换为 ESM。

如果你想尝试该构建策略，你可以使用 `optimizeDeps.disabled: false`。`@rollup/plugin-commonjs` 可以通过设置 `build.commonjsOptions: { include: [] }` 来移除。
:::

## optimizeDeps.needsInterop

- **实验性**
- **类型:** `string[]`

当导入这些依赖项时，会强制 ESM 转换。Vite 能够正确检测到依赖项是否需要转换处理（interop），因此通常不需要使用此选项。然而，不同的依赖项组合可能导致其中一些包以不同方式预构建。将这些包添加到 `needsInterop` 中可以通过避免重新加载整个页面、加快冷启动速度。如果某个依赖项符合此情况，Vite 将抛出警告，建议你在配置中添加该包名。
