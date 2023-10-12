# SSR 选项 {#ssr-options}

## ssr.external {#ssr-external}

- **类型:** `string[]`
- **相关：** [SSR 外部化](/guide/ssr#ssr-externals)

列出的是要为 SSR 强制外部化的依赖。

## ssr.noExternal {#ssr-noexternal}

- **类型：** `string | RegExp | (string | RegExp)[] | true`
- **相关：** [SSR 外部化](/guide/ssr#ssr-externals)

列出的是防止被 SSR 外部化依赖项。如果设为 `true`，将没有依赖被外部化。

## ssr.target {#ssr-target}

- **类型：** `'node' | 'webworker'`
- **默认：** `node`

SSR 服务器的构建目标。

## ssr.resolve.conditions {#ssr-resolve-conditions}

- **类型：** `string[]`
- **相关：** [解析条件](./shared-options.md#resolve-conditions)

默认为根 [`resolve.conditions`](./shared-options.md#resolve-conditions)。

这些条件用于插件管道，并且仅在 SSR 构建期间影响非外部化依赖项。使用 `ssr.resolve.externalConditions` 影响外部化导入。

## ssr.resolve.externalConditions {#ssr-resolve-externalConditions}

- **类型：** `string[]`
- **相关：** `[]`

在 SSR 导入（包括 `ssrLoadModule`）外部化依赖项期间使用的条件。
