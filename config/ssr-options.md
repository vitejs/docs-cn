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
- **默认：** `['module', 'node', 'development|production']`（当 `ssr.target === 'webworker'` 时为 `['module', 'browser', 'development|production']`）
- **相关：** [解析情景](./shared-options.md#resolve-conditions)

这些条件会在插件管道中使用，并且只会影响 SSR 构建期间的非外部化依赖项。使用 `ssr.resolve.externalConditions` 来影响外部化导入。

## ssr.resolve.externalConditions {#ssr-resolve-externalconditions}

- **类型：** `string[]`
- **默认：** `['node']`

<<<<<<< HEAD
在 SSR 导入（包括 `ssrLoadModule`）外部化依赖项时使用的条件。
=======
Conditions that are used during ssr import (including `ssrLoadModule`) of externalized direct dependencies (external dependencies imported by Vite).

:::tip

When using this option, make sure to run Node with [`--conditions` flag](https://nodejs.org/docs/latest/api/cli.html#-c-condition---conditionscondition) with the same values in both dev and build to get a consistent behavior.

For example, when setting `['node', 'custom']`, you should run `NODE_OPTIONS='--conditions custom' vite` in dev and `NODE_OPTIONS="--conditions custom" node ./dist/server.js` after build.

:::
>>>>>>> 388d49971e1d2fcd40ca1b4495e2618f0e85218c
