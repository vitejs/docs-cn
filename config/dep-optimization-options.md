# 依赖优化选项 {#dep-optimization-options}

- **相关内容：** [依赖预构建](/guide/dep-pre-bundling)

## optimizeDeps.entries {#optimizedeps-entries}

- **类型：** `string | string[]`

默认情况下，Vite 会抓取你的 `index.html` 来检测需要预构建的依赖项（忽略了`node_modules`、`build.outDir`、`__tests__` 和 `coverage`）。如果指定了 `build.rollupOptions.input`，Vite 将转而去抓取这些入口点。

<<<<<<< HEAD
如果这两者都不合你意，则可以使用此选项指定自定义条目——该值需要遵循 [fast-glob 模式](https://github.com/mrmlnc/fast-glob#basic-syntax) ，或者是相对于 Vite 项目根目录的匹配模式数组。当显式声明了 `optimizeDeps.entries` 时默认只有 `node_modules` 和 `build.outDir` 文件夹会被忽略。如果还需忽略其他文件夹，你可以在模式列表中使用以 `!` 为前缀的、用来匹配忽略项的模式。
=======
If neither of these fit your needs, you can specify custom entries using this option - the value should be a [fast-glob pattern](https://github.com/mrmlnc/fast-glob#basic-syntax) or array of patterns that are relative from Vite project root. This will overwrite default entries inference. Only `node_modules` and `build.outDir` folders will be ignored by default when `optimizeDeps.entries` is explicitly defined. If other folders need to be ignored, you can use an ignore pattern as part of the entries list, marked with an initial `!`.
>>>>>>> 4c3c535737097c413012b753ec436c6f469c4182

## optimizeDeps.exclude {#optimizedeps-exclude}

- **类型：** `string[]`

在预构建中强制排除的依赖项。

:::warning CommonJS
CommonJS 的依赖不应该排除在优化外。如果一个 ESM 依赖被排除在优化外，但是却有一个嵌套的 CommonJS 依赖，则应该为该 CommonJS 依赖添加 `optimizeDeps.include`。例如：

```js
export default defineConfig({
  optimizeDeps: {
    include: ['esm-dep > cjs-dep']
  }
})
```

:::

## optimizeDeps.include {#optimizedeps-include}

- **类型：** `string[]`

默认情况下，不在 `node_modules` 中的，链接的包不会被预构建。使用此选项可强制预构建链接的包。

## optimizeDeps.esbuildOptions {#optimizedeps-esbuildoptions}

- **类型：** [`EsbuildBuildOptions`](https://esbuild.github.io/api/#simple-options)

在部署扫描和优化过程中传递给 esbuild 的选项。

某些选项进行了省略，因为修改它们与 Vite 的优化方案并不兼容。

- 忽略了 `external` 选项，请使用 Vite 的 `optimizeDeps.exclude` 选项
- `plugins` 与 Vite 的 dep 插件合并

## optimizeDeps.force {#optimizedeps-force}

- **类型：** `boolean`

设置为 `true` 可以强制依赖预构建，而忽略之前已经缓存过的、已经优化过的依赖。
