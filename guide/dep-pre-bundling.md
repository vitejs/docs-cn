# 依赖预构建 {#dependency-pre-bundling}

当你首次启动 `vite` 时，你可能会注意到打印出了以下信息：

```
Pre-bundling dependencies: （正在预构建依赖：）
  react
  react-dom
(this will be run only when your dependencies or config have changed)（这将只会在你的依赖或配置发生变化时执行）
```

## 原因 {#the-why}

这就是 Vite 执行时所做的“依赖预构建”。这个过程有两个目的:

1. **CommonJS 和 UMD 兼容性:** 开发阶段中，Vite 的开发服务器将所有代码视为原生 ES 模块。因此，Vite 必须先将作为 CommonJS 或 UMD 发布的依赖项转换为 ESM。

   当转换 CommonJS 依赖时，Vite 会执行智能导入分析，这样即使导出是动态分配的（如 React），按名导入也会符合预期效果：

   ```js
   // 符合预期
   import React, { useState } from 'react'
   ```

2. **性能：** Vite 将有许多内部模块的 ESM 依赖关系转换为单个模块，以提高后续页面加载性能。

   一些包将它们的 ES 模块构建作为许多单独的文件相互导入。例如，[`lodash-es` 有超过 600 个内置模块](https://unpkg.com/browse/lodash-es/)！当我们执行 `import { debounce } from 'lodash-es'` 时，浏览器同时发出 600 多个 HTTP 请求！尽管服务器在处理这些请求时没有问题，但大量的请求会在浏览器端造成网络拥塞，导致页面的加载速度相当慢。

   通过预构建 `lodash-es` 成为一个模块，我们就只需要一个 HTTP 请求了！

::: tip 注意
依赖预构建仅会在开发模式下应用，并会使用 `esbuild` 将依赖转为 ESM 模块。在生产构建中则会使用 `@rollup/plugin-commonjs`。
:::

## 自动依赖搜寻 {#automatic-dependency-discovery}

如果没有找到相应的缓存，Vite 将抓取你的源码，并自动寻找引入的依赖项（即 "bare import"，表示期望从 `node_modules` 解析），并将这些依赖项作为预构建包的入口点。预构建通过 `esbuild` 执行，所以它通常非常快。

在服务器已经启动之后，如果遇到一个新的依赖关系导入，而这个依赖关系还没有在缓存中，Vite 将重新运行依赖构建进程并重新加载页面。

## Monorepo 和链接依赖 {#monorepos-and-linked-dependencies}

在一个 monorepo 启动中，该仓库中的某个包可能会成为另一个包的依赖。Vite 会自动侦测没有从 `node_modules` 解析的依赖项，并将链接的依赖视为源码。它不会尝试打包被链接的依赖，而是会分析被链接依赖的依赖列表。

然而，这需要被链接的依赖被导出为 ESM 格式。如果不是，那么你可以在配置里将此依赖添加到 [`optimizeDeps.include`](/config/dep-optimization-options.md#optimizedeps-include) 和 [`build.commonjsOptions.include`](/config/build-options.md#build-commonjsoptions) 这两项中。

```js
export default defineConfig({
  optimizeDeps: {
    include: ['linked-dep']
  },
  build: {
    commonjsOptions: {
      include: [/linked-dep/, /node_modules/]
    }
  }
})
```

当这个被链接的依赖发生变更后，在重启开发服务器时在命令中带上 `--force` 选项让所有更改生效。

::: warning 重复删除
由于对链接依赖的解析方式不同，传递性的依赖项可能会不正确地进行重复数据删除，而造成运行时的问题。如果你偶然发现了这个问题，请使用 `npm pack` 来修复它。
:::

## 自定义行为 {#customizing-the-behavior}

默认的依赖项发现为启发式可能并不总是可取的。在你想要显式地从列表中包含/排除依赖项的情况下, 请使用 [`optimizeDeps` 配置项](/config/dep-optimization-options.md)。

当你遇到不能直接在源码中发现的 import 时，`optimizeDeps.include` 或 `optimizeDeps.exclude` 就是典型的用例。例如，import 可能是插件转换的结果。这意味着 Vite 无法在初始扫描时发现 import —— 它只能在浏览器请求文件时转换后才能发现。这将导致服务器在启动后立即重新打包。

`include` 和 `exclude` 都可以用来处理这个问题。如果依赖项很大（包含很多内部模块）或者是 CommonJS，那么你应该包含它；如果依赖项很小，并且已经是有效的 ESM，则可以排除它，让浏览器直接加载它。

## 缓存 {#caching}

### 文件系统缓存 {#file-system-cache}

Vite 会将预构建的依赖缓存到 `node_modules/.vite`。它根据几个源来决定是否需要重新运行预构建步骤:

- `package.json` 中的 `dependencies` 列表
- 包管理器的 lockfile，例如 `package-lock.json`, `yarn.lock`，或者 `pnpm-lock.yaml`
- 可能在 `vite.config.js` 相关字段中配置过的

只有在上述其中一项发生更改时，才需要重新运行预构建。

如果出于某些原因，你想要强制 Vite 重新构建依赖，你可以用 `--force` 命令行选项启动开发服务器，或者手动删除 `node_modules/.vite` 目录。

### 浏览器缓存 {#browser-cache}

解析后的依赖请求会以 HTTP 头 `max-age=31536000,immutable` 强缓存，以提高在开发时的页面重载性能。一旦被缓存，这些请求将永远不会再到达开发服务器。如果安装了不同的版本（这反映在包管理器的 lockfile 中），则附加的版本 query 会自动使它们失效。如果你想通过本地编辑来调试依赖项，你可以:

1. 通过浏览器调试工具的 Network 选项卡暂时禁用缓存；
2. 重启 Vite dev server，并添加 `--force` 命令以重新构建依赖；
3. 重新载入页面。
