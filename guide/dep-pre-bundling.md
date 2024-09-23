# 依赖预构建 {#dependency-pre-bundling}

当你首次启动 `vite` 时，Vite 在本地加载你的站点之前预构建了项目依赖。默认情况下，它是自动且透明地完成的。

## 原因 {#the-why}

这就是 Vite 执行时所做的“依赖预构建”。这个过程有两个目的:

1. **CommonJS 和 UMD 兼容性:** 在开发阶段中，Vite 的开发服务器将所有代码视为原生 ES 模块。因此，Vite 必须先将以 CommonJS 或 UMD 形式提供的依赖项转换为 ES 模块。

   在转换 CommonJS 依赖项时，Vite 会进行智能导入分析，这样即使模块的导出是动态分配的（例如 React），具名导入（named imports）也能正常工作：

   ```js
   // 符合预期
   import React, { useState } from 'react'
   ```

2. **性能：** 为了提高后续页面的加载性能，Vite将那些具有许多内部模块的 ESM 依赖项转换为单个模块。

   有些包将它们的 ES 模块构建为许多单独的文件，彼此导入。例如，[`lodash-es` 有超过 600 个内置模块](https://unpkg.com/browse/lodash-es/)！当我们执行 `import { debounce } from 'lodash-es'` 时，浏览器同时发出 600 多个 HTTP 请求！即使服务器能够轻松处理它们，但大量请求会导致浏览器端的网络拥塞，使页面加载变得明显缓慢。

   通过将 `lodash-es` 预构建成单个模块，现在我们只需要一个HTTP请求！

::: tip 注意
依赖预构建仅适用于开发模式，并使用 `esbuild` 将依赖项转换为 ES 模块。在生产构建中，将使用 `@rollup/plugin-commonjs`。
:::

## 自动依赖搜寻 {#automatic-dependency-discovery}

如果没有找到现有的缓存，Vite 会扫描您的源代码，并自动寻找引入的依赖项（即 "bare import"，表示期望从 `node_modules` 中解析），并将这些依赖项作为预构建的入口点。预打包使用 `esbuild` 执行，因此通常速度非常快。

在服务器已经启动后，如果遇到尚未在缓存中的新依赖项导入，则 Vite 将重新运行依赖项构建过程，并在需要时重新加载页面。

## Monorepo 和链接依赖 {#monorepos-and-linked-dependencies}

在一个 monorepo 启动中，该仓库中的某个包可能会成为另一个包的依赖。Vite 会自动侦测没有从 `node_modules` 解析的依赖项，并将链接的依赖视为源码。它不会尝试打包被链接的依赖，而是会分析被链接依赖的依赖列表。

然而，这需要被链接的依赖被导出为 ESM 格式。如果不是，那么你可以在配置里将此依赖添加到 [`optimizeDeps.include`](/config/dep-optimization-options.md#optimizedeps-include) 和 [`build.commonjsOptions.include`](/config/build-options.md#build-commonjsoptions) 这两项中。

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig({
  optimizeDeps: {
    include: ['linked-dep'],
  },
  build: {
    commonjsOptions: {
      include: [/linked-dep/, /node_modules/],
    },
  },
})
```

当对链接的依赖进行更改时，请使用 `--force` 命令行选项重新启动开发服务器，以使更改生效。

## 自定义行为 {#customizing-the-behavior}

有时候默认的依赖启发式算法（discovery heuristics）可能并不总是理想的。如果您想要明确地包含或排除依赖项，可以使用 [`optimizeDeps` 配置项](/config/dep-optimization-options.md) 来进行设置。

`optimizeDeps.include` 或 `optimizeDeps.exclude` 的一个典型使用场景，是当 Vite 在源码中无法直接发现 import 的时候。例如，import 可能是插件转换的结果。这意味着 Vite 无法在初始扫描时发现 import —— 只能在文件被浏览器请求并转换后才能发现。这将导致服务器在启动后立即重新打包。

`include` 和 `exclude` 都可以用来处理这个问题。如果依赖项很大（包含很多内部模块）或者是 CommonJS，那么你应该包含它；如果依赖项很小，并且已经是有效的 ESM，则可以排除它，让浏览器直接加载它。

你可以通过 [`optimizeDeps.esbuildOptions` 选项](/config/dep-optimization-options.md#optimizedeps-esbuildoptions) 进一步自定义 esbuild。例如，添加一个 esbuild 插件来处理依赖项中的特殊文件，或者更改 [build `target`](https://esbuild.github.io/api/#target)。

## 缓存 {#caching}

### 文件系统缓存 {#file-system-cache}

Vite 将预构建的依赖项缓存到 `node_modules/.vite` 中。它会基于以下几个来源来决定是否需要重新运行预构建步骤：

- 包管理器的锁文件内容，例如 `package-lock.json`，`yarn.lock`，`pnpm-lock.yaml`，或者 `bun.lockb`；
- 补丁文件夹的修改时间；
- `vite.config.js` 中的相关字段；
- `NODE_ENV` 的值。

只有在上述其中一项发生更改时，才需要重新运行预构建。

如果出于某些原因你想要强制 Vite 重新构建依赖项，你可以在启动开发服务器时指定 `--force` 选项，或手动删除 `node_modules/.vite` 缓存目录。

### 浏览器缓存 {#browser-cache}

已预构建的依赖请求使用 HTTP 头 `max-age=31536000, immutable` 进行强缓存，以提高开发期间页面重新加载的性能。一旦被缓存，这些请求将永远不会再次访问开发服务器。如果安装了不同版本的依赖项（这反映在包管理器的 lockfile 中），则会通过附加版本查询自动失效。如果你想通过本地编辑来调试依赖项，您可以：

1. 通过浏览器开发工具的 Network 选项卡暂时禁用缓存；
2. 重启 Vite 开发服务器指定 `--force` 选项，来重新构建依赖项;
3. 重新载入页面。
