# SSR 选项 {#ssr-options}

除非另有说明，本节中的选项适用于开发和构建。

## ssr.external

- **类型:** `string[] | true`
- **相关：** [SSR 外部化](/guide/ssr#ssr-externals)

这个选项可以将指定的依赖项和它们传递的依赖项进行外部化，以供服务端渲染（SSR）使用。默认情况下，所有的依赖项都会被外部化，除了那些被链接的依赖项（为了HMR）。如果希望将这些软链接的依赖项也外部化，你可以将其名称传给这个选项。

如果这个选项设置为 `true`，那么所有的依赖项，包括被链接的依赖项，都将被外部化。

需要注意的是，如果在该选项明确列出了一些依赖项（使用 `string[]` 类型），那么其将始终被优先考虑，即使它们也在 `ssr.noExternal` 中被列出（无论使用何种类型）。

## ssr.noExternal {#ssr-noexternal}

- **类型：** `string | RegExp | (string | RegExp)[] | true`
- **相关：** [SSR 外部化](/guide/ssr#ssr-externals)

这个选项可以防止列出的依赖项在服务端渲染（SSR）时被外部化，这些依赖项将会在构建过程中被打包。默认情况下，只有软链接的依赖项不会被外部化（这是为了HMR）。如果你希望将软链接的依赖项也外部化，可以将其名称传给 `ssr.external` 选项。

如果这个选项设置为 `true`，那么没有任何依赖项会被外部化。然而，如果你在 `ssr.external` 中明确列出了一些依赖项（使用 `string[]` 类型），那么这些依赖项可以优先被外部化。如果设置了 `ssr.target: 'node'`，那么 Node.js 的内置模块也会被默认外部化。

需要注意的是，如果 `ssr.noExternal: true` 和 `ssr.external: true` 都被设置了，那么 `ssr.noExternal` 将优先生效，没有任何依赖项会被外部化。

## ssr.target

- **类型：** `'node' | 'webworker'`
- **默认：** `node`

SSR 服务器的构建目标。

## ssr.resolve.conditions {#ssr-resolve-conditions}

- **类型：** `string[]`
- **默认：** `['module', 'node', 'development|production']`(`defaultServerConditions`) (当 `ssr.target === 'webworker'` 时为 `['module', 'browser', 'development|production']` (`defaultClientConditions`) )
- **相关：** [解析情景](./shared-options.md#resolve-conditions)

这些条件会在插件管道中使用，并且只会影响 SSR 构建期间的非外部化依赖项。使用 `ssr.resolve.externalConditions` 来影响外部化导入。

## ssr.resolve.externalConditions {#ssr-resolve-externalconditions}

- **类型：** `string[]`
- **默认：** `['node']`

在对外部化的直接依赖项（由 Vite 导入的外部依赖项）进行 SSR 导入（包括 `ssrLoadModule`）期间所使用的条件。

:::tip

使用该选项时，请确保在开发和构建中使用 [`--conditions` flag](https://nodejs.org/docs/latest/api/cli.html#-c-condition---conditionscondition) 以相同的值运行 Node，以获得一致的行为。

例如，当设置 `['node', 'custom']` 时，应该在 dev 中运行 `NODE_OPTIONS='--conditions custom' vite`，在 build 后运行 `NODE_OPTIONS="--conditions custom" node ./dist/server.js`。

:::

## ssr.resolve.mainFields

- **类型：** `string[]`
- **默认：** `['module', 'jsnext:main', 'jsnext']`
  
在解析一个包的入口文件时，会尝试使用 `package.json` 中的字段列表。请注意，这些字段的优先级低于从条件导出解析的 `exports` 字段：如果能从 `exports` 字段成功解析出入口文件，那么 main 字段将会被忽略。此设置仅影响未外部化的依赖项。
