# 性能 {#performance}

虽然 Vite 默认运行速度很快，但随着项目需求的增长，性能问题可能会悄然出现。本指南旨在帮助您识别并修复常见的性能问题，例如：

- 服务器启动慢
- 页面加载慢
- 构建慢

## 检查浏览器设置 {#review-your-browser-setup}

有些浏览器插件可能会干涉请求，对于大型应用，特别是在使用浏览器开发工具时，可能会拖慢启动和刷新速度。我们建议在这种情况下，使用 Vite 的开发服务器时，创建一个专门用于开发且不含插件的配置，或者切换到无痕模式。无痕模式的速度也应该比没有插件的常规模式更快。

Vite 开发服务器对预打包的依赖项进行了强缓存，同时对源代码实现快速的 304 响应。如果在浏览器的开发者工具打开的情况下关闭缓存，可能会大幅影响启动速度和全页刷新的时间。因此，在使用 Vite 服务器的时候，请确保没有启用 "禁用缓存" 功能。

## 审核配置的 Vite 插件 {#audit-configured-vite-plugins}

Vite 的内部和官方插件已经优化，以在提供与更广泛的生态系统兼容性的同时做尽可能少的工作。例如，代码转换在开发中使用正则表达式，但在构建中进行完整解析以确保正确性。

然而，社区插件的性能是 Vite 无法控制的，这可能会影响开发者的体验。在使用额外的 Vite 插件时，有一些事情可以注意：

1. 只在特定情况下，大型依赖项应动态导入，以减少Node.js的启动时间。重构示例：[vite-plugin-react#212](https://github.com/vitejs/vite-plugin-react/pull/212) 和 [vite-plugin-pwa#224](https://github.com/vite-pwa/vite-plugin-pwa/pull/244)。

2. `buildStart`，`config`，和 `configResolved` 钩子不应运行过长的时间和进行大量的操作。这些钩子会在开发服务器启动期间等待，这会延迟可以在浏览器中访问站点的时间。

3. `resolveId`，`load`，和 `transform` 钩子可能会导致一些文件加载速度比其他文件慢。虽然有时无法避免，但仍值得检查可能的优化区域。例如，检查 `code` 是否包含特定关键字，或 `id` 是否匹配特定扩展名，然后再进行完整的转换。

   转换文件所需的时间越长，加载站点时在浏览器中的请求瀑布图就会越明显。

   你可以使用 `vite --debug plugin-transform` 或 [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) 检查转换文件所需的时间。请注意，由于异步操作往往提供不准确的时间，应将这些数字视为粗略的估计，但它仍应揭示消耗很大的操作。

::: tip 性能分析
可以运行 `vite --profile`，访问站点，并在终端中按 `p + enter` 来记录一个 `.cpuprofile`。然后可以使用像 [speedscope](https://www.speedscope.app) 这样的工具来检查配置文件并识别瓶颈。也可以 [分享配置文件](https://chat.vite.dev) 给 Vite 团队，帮助我们识别性能问题。
:::

## 减少解析操作 {#reduce-resolve-operations}

当经常遇到最糟糕的情况时，解析导入路径可能是一项昂贵的操作。例如，Vite 支持通过 [`resolve.extensions`](/config/shared-options.md#resolve-extensions) 选项“猜测”导入路径，该选项默认为 `['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json']`。

当您尝试使用 `import './Component'` 导入 `./Component.jsx` 时，Vite 将运行以下步骤来解析它：

1. 检查 `./Component` 是否存在，不存在。
2. 检查 `./Component.mjs` 是否存在，不存在。
3. 检查 `./Component.js` 是否存在，不存在。
4. 检查 `./Component.mts` 是否存在，不存在。
5. 检查 `./Component.ts` 是否存在，不存在。
6. 检查 `./Component.jsx` 是否存在，存在！

如上所示，解析一个导入路径需要进行 6 次文件系统检查。您的隐式导入越多，解析路径所需的时间就越多。

因此，通常最好明确您的导入路径，例如 `import './Component.jsx'`。也可以缩小 `resolve.extensions` 的列表以减少一般的文件系统检查，但必须确保它也适用于 `node_modules` 中的文件。

如果你是插件作者，请确保只在需要时调用 [`this.resolve`](https://rollupjs.org/plugin-development/#this-resolve) 以减少上述检查的次数。

::: tip TypeScript
如果你正在使用 TypeScript，启用 `tsconfig.json` 中的 `compilerOptions` 的 `"moduleResolution": "Bundler"` 和 `"allowImportingTsExtensions": true` 以直接在代码中使用 `.ts` 和 `.tsx` 扩展名。
:::

## 避免使用桶文件 {#avoid-barrel-files}

桶文件（barrel files）是重新导出同一目录下其他文件 API 的文件。例如：

```js [src/utils/index.js]
export * from './color.js'
export * from './dom.js'
export * from './slash.js'
```

当你只导入一个单独的 API，例如 `import { slash } from './utils'`，需要获取和转换桶文件中的所有文件，因为它们可能包含 `slash` API，也可能包含在初始化时运行的其他副作用。这意味着在初始页面加载时，你加载的文件比所需的要更多，导致页面加载速度变慢。

如果可能的话，你应该尽量避免使用桶文件（barrel files），直接导入单独的 API，例如 `import { slash } from './utils/slash.js'`。你可以阅读 [issue #8237](https://github.com/vitejs/vite/issues/8237) 了解更多信息。

## 预热常用文件 {#warm-up-frequently-used-files}

Vite 开发服务器只转换浏览器请求的文件，这使得它能够快速启动，并且只对使用的文件执行转换。如果预计某些文件将被短时间内请求，也可以预先转换。然而，如果某些文件的转换时间比其他文件长，仍然可能发生请求瀑布。例如：

给定一个导入图，左边的文件导入右边的文件：

```
main.js -> BigComponent.vue -> big-utils.js -> large-data.json
```

导入关系只有在文件转换后才能知道。如果 `BigComponent.vue` 需要一些时间来转换，`big-utils.js` 就必须等待它的轮次，依此类推。即使内置了预先转换，这也会导致内部瀑布。

Vite 允许预热你确定频繁使用的文件，例如 `big-utils.js`，可以使用 [`server.warmup`](/config/server-options.md#server-warmup) 选项。这样，当请求时，`big-utils.js` 将准备好并被缓存，以便立即提供服务。

你可以通过运行 `vite --debug transform` 并检查日志来找到频繁使用的文件：

```bash
vite:transform 28.72ms /@vite/client +1ms
vite:transform 62.95ms /src/components/BigComponent.vue +1ms
vite:transform 102.54ms /src/utils/big-utils.js +1ms
```

```js [vite.config.js]
export default defineConfig({
  server: {
    warmup: {
      clientFiles: [
        './src/components/BigComponent.vue',
        './src/utils/big-utils.js',
      ],
    },
  },
})
```

请注意，只应该预热频繁使用的文件，以免在启动时过载 Vite 开发服务器。查看 [`server.warmup`](/config/server-options.md#server-warmup) 选项以获取更多信息。

使用 [`--open` 或 `server.open`](/config/server-options.html#server-open) 也可以提供性能提升，因为 Vite 将自动预热你的应用的入口起点或被提供的要打开的 URL。

## 使用更少或更原生化的工具链 {#use-lesser-or-native-tooling}

保持 Vite 如此之快的关键在于减少源文件（JS/TS/CSS）的工作量。

精简工作的例子：

- 使用 CSS 而不是 Sass/Less/Stylus（可以由 PostCSS 处理嵌套）
- 不要使用 `@vitejs/plugin-react-refresh`，而是使用 React Fast Refresh 的原生支持。
- 当使用 `@vitejs/plugin-react` 时，避免配置 Babel 选项，这样它就会在构建期间跳过转换（只使用 esbuild）。

使用更原生化工具链的例子：

使用更原生化的工具链往往会带来更大的安装大小，因此在启动新的 Vite 项目时不是默认的。但对于较大的应用程序来说，这可能是值得的。

- 尝试实验性的 [LightningCSS](https://github.com/vitejs/vite/discussions/13835)
- 使用 [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc) 代替 `@vitejs/plugin-react`。
