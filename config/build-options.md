# 构建选项 {#build-options}

除非另有说明，本节中的选项仅适用于构建。

## build.target

- **类型：** `string | string[]`
- **默认：** `'baseline-widely-available'`
- **相关内容：** [浏览器兼容性](/guide/build#browser-compatibility)

最终软件包的浏览器兼容性目标。默认值是 Vite 的一个特殊值 `'baseline-widely-available'`，该值针对的是包含在 2026 年 1 月 1 日广泛可用的 [Baseline](https://web-platform-dx.github.io/web-features/) 中的浏览器。具体来说，它是 `['chrome111', 'edge111', 'firefox114', 'safari16.4']`。

另一个特殊值是 `'esnext'` —— 即假设有原生动态导入支持，并只执行最低限度的转译。

转换过程将会由 Oxc Transformer 执行，并且此值应该是一个合法的 [Oxc Transformer 目标选项](https://oxc.rs/docs/guide/usage/transformer/lowering#target)。自定义目标也可以是一个 ES 版本（例如：`es2015`）、一个浏览器版本（例如：`chrome58`）或是多个目标组成的一个数组。

注意：如果代码包含不能被 `Oxc` 安全地编译的特性，那么构建将会输出警告。查看 [Oxc 文档](https://oxc.rs/docs/guide/usage/transformer/lowering#warnings) 获取更多细节。

## build.modulePreload {#build-modulepreload}

- **类型：** `boolean | { polyfill?: boolean, resolveDependencies?: ResolveModulePreloadDependenciesFn }`
- **默认值：** `{ polyfill: true }`

默认情况下，一个 [模块预加载 polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill) 会被自动注入。该 polyfill 会自动注入到每个 `index.html` 入口的的代理模块中。如果构建通过 `build.rollupOptions.input` 被配置为了使用非 HTML 入口的形式，那么必须要在你的自定义入口中手动引入该 polyfill：

```js
import 'vite/modulepreload-polyfill'
```

注意：此 polyfill **不适用于** [Library 模式](/guide/build#library-mode)。如果你需要支持不支持动态引入的浏览器，你应该避免在你的库中使用此选项。

此 polyfill 可以通过 `{ polyfill: false }` 来禁用。

每个动态导入要预加载的块列表将由 Vite 计算。默认情况下，在载入这些依赖时，会使用一个包含 `base` 的绝对路径。如果 `base` 是相对路径（`''` 或者 `'./'`），解析时则会使用 `import.meta.url`，以避免出现依赖于最终部署基路径的绝对路径。

目前有一个实验性功能支持使用 `resolveDependencies` 函数对依赖项列表及其路径进行细粒度控制。可以在这里 [提供反馈](https://github.com/vitejs/vite/discussions/13841)。它期望接收一个 `ResolveModulePreloadDependenciesFn` 类型的函数:

```ts
type ResolveModulePreloadDependenciesFn = (
  url: string,
  deps: string[],
  context: {
    hostId: string
    hostType: 'html' | 'js'
  },
) => string[]
```

`resolveDependencies` 函数会在每次动态导入时被调用，并包含其依赖的 chunk 列表。同时，它也会在入口 HTML 文件中导入每个 chunk 时被调用。你可以返回一个新的依赖数组，其中可以过滤掉或注入更多的依赖，或修改它们的路径。`deps` 路径是相对于 `build.outDir` 的。返回值应是对于 `build.outDir` 的相对路径。

```js twoslash
/** @type {import('vite').UserConfig} */
const config = {
  // prettier-ignore
  build: {
// ---cut-before---
modulePreload: {
  resolveDependencies: (filename, deps, { hostId, hostType }) => {
    return deps.filter(condition)
  },
},
// ---cut-after---
  },
}
```

解析得到的依赖路径可以再在之后使用 [`experimental.renderBuiltUrl`](../guide/build.md#advanced-base-options) 更改。

## build.polyfillModulePreload {#build-polyfillmodulepreload}

- **类型：** `boolean`
- **默认：** `true`
- **已废弃** 请使用 `build.modulePreload.polyfill` 替代

是否自动注入一个 [模块预加载 polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill)。

## build.outDir {#build-outdir}

- **类型：** `string`
- **默认：** `dist`

指定输出路径（相对于 [项目根目录](/guide/#index-html-and-project-root)).

## build.assetsDir {#build-assetsdir}

- **类型：** `string`
- **默认：** `assets`

指定生成静态资源的存放路径（相对于 `build.outDir`）。在 [库模式](/guide/build#library-mode) 下不能使用。

## build.assetsInlineLimit {#build-assetsinlinelimit}

- **类型：** `number` | `((filePath: string, content: Buffer) => boolean | undefined)`
- **默认：** `4096` (4 KiB)

小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 `0` 可以完全禁用此项。

如果传入了一个回调函数，可以通过返回一个布尔值来选择是否加入。如果没有返回任何内容，那么就会应用默认的逻辑。

Git LFS 占位符会自动排除在内联之外，因为它们不包含其所表示的文件的内容。

:::tip 注意
如果你指定了 `build.lib`，那么 `build.assetsInlineLimit` 将被忽略，无论文件大小或是否为 Git LFS 占位符，资源都会被内联。
:::

## build.cssCodeSplit {#build-csscodesplit}

- **类型：** `boolean`
- **默认：** `true`

启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在其被加载时一并获取。

如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。

::: tip 注意
如果指定了 `build.lib`，`build.cssCodeSplit` 会默认为 `false`。
:::

## build.cssTarget {#build-csstarget}

- **类型：** `string | string[]`
- **默认值：** 与 [`build.target`](#build-target) 一致

此选项允许用户为 CSS 的压缩设置一个不同的浏览器 target，此处的 target 并非是用于 JavaScript 转写目标。

应只在针对非主流浏览器时使用。
最直观的示例是当你要兼容的场景是安卓微信中的 webview 时，它支持大多数现代的 JavaScript 功能，但并不支持 [CSS 中的 `#RGBA` 十六进制颜色符号](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors)。
这种情况下，你需要将 `build.cssTarget` 设置为 `chrome61`，以防止 vite 将 `rgba()` 颜色转化为 `#RGBA` 十六进制符号的形式。

## build.cssMinify {#build-cssminify}

- **类型：** `boolean | 'lightningcss' | 'esbuild'`
- **默认：** 对于客户端，与 [`build.minify`](#build-minify) 相同；对于 SSR，为 `'lightningcss'`

此选项允许用户覆盖 CSS 最小化压缩的配置，而不是使用默认的 `build.minify`，这样你就可以单独配置 JS 和 CSS 的最小压缩方式。Vite 默认使用 [Lightning CSS](https://lightningcss.dev/minification.html) 来压缩 CSS。可以通过 [`css.lightningcss`](./shared-options.md#css-lightningcss) 进行配置。将此选项设置为 `'esbuild'` 可以改用 esbuild 进行压缩。

当设置为 `'esbuild'` 时，必须安装 esbuild。

```sh
npm add -D esbuild
```

## build.sourcemap {#build-sourcemap}

- **类型：** `boolean | 'inline' | 'hidden'`
- **默认：** `false`

构建后是否生成 source map 文件。如果为 `true`，将会创建一个独立的 source map 文件。如果为 `'inline'`，source map 将作为一个 data URI 附加在输出文件中。`'hidden'` 的工作原理与 `true` 相似，只是 bundle 文件中相应的注释将不被保留。

## build.rolldownOptions {#build-rolldownoptions}

- **类型：** [`RolldownOptions`](https://rolldown.rs/reference/)

直接自定义底层 Rolldown 包。这与从 Rolldown 配置文件导出的选项相同，并将与 Vite 的内部 Rolldown 选项合并。更多详情请参阅 [Rolldown 选项文档](https://rolldown.rs/reference/)。

## build.rollupOptions {#build-rollupoptions}

- **类型：** `RolldownOptions`
- **已弃用**

此选项是 `build.rolldownOptions` 选项的别名。请使用 `build.rolldownOptions` 选项代替。

## build.dynamicImportVarsOptions {#build-dynamicimportvarsoptions}

- **类型：** `{ include?: string | RegExp | (string | RegExp)[], exclude?: string | RegExp | (string | RegExp)[] }`
- **相关内容：** [Dynamic Import](/guide/features#dynamic-import)

是否转换带有变量的动态导入。

## build.lib {#build-lib}

- **类型：** `{ entry: string | string[] | { [entryAlias: string]: string }, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat, entryName: string) => string), cssFileName?: string }`
- **相关内容：** [库模式](/guide/build#library-mode)

以库的形式构建。`entry` 是必需的，因为库不能使用 HTML 作为入口。`name` 是暴露的全局变量，当 `formats` 包括 `'umd'` 或 `'iife'` 时必须使用。默认的 `formats` 为 `['es'、'umd']`，如果使用多个入口，则为 `['es'、'cjs']`。

`fileName` 是软件包输出文件的名称，默认为 `package.json` 中的 `"name"`。它也可以定义为以 `format` 和 `entryName` 为参数的函数，并返回文件名。

如果软件包导入了 CSS，`cssFileName` 可用于指定 CSS 输出文件的名称。如果设置为字符串，则默认值与 `fileName` 相同，否则也会返回到 `package.json` 中的 `"name"`。

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: ['src/main.js'],
      fileName: (format, entryName) => `my-lib-${entryName}.${format}.js`,
      cssFileName: 'my-lib-style',
    },
  },
})
```

## build.license {#build-license}

- **类型：** `boolean | { fileName?: string }`
- **默认：** `false`
- **相关：** [许可证](/guide/features#license)

当设置为 `true` 时，构建过程将生成一个 `.vite/license.md` 文件，其中包含所有打包依赖项的许可证信息。

如果传入了 `fileName` 参数，它将被用作相对于 `outDir` 的许可证文件名。如果文件名以 `.json` 结尾，则会生成原始的 JSON 元数据，并可以用于进一步处理。例如：

```json
[
  {
    "name": "dep-1",
    "version": "1.2.3",
    "identifier": "CC0-1.0",
    "text": "CC0 1.0 Universal\n\n..."
  },
  {
    "name": "dep-2",
    "version": "4.5.6",
    "identifier": "MIT",
    "text": "MIT License\n\n..."
  }
]
```

::: tip

如果您想在构建的代码中引用许可证文件，可以使用 [`build.rolldownOptions.output.postBanner`](https://rolldown.rs/reference/OutputOptions.postBanner#postbanner) 在文件顶部插入注释。例如：

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    license: true,
    rolldownOptions: {
      output: {
        postBanner:
          '/* See licenses of bundled dependencies at https://example.com/license.md */',
      },
    },
  },
})
```

:::

## build.manifest {#build-manifest}

- **类型：** `boolean | string`
- **默认：** `false`
- **相关内容：** [后端集成](/guide/backend-integration)

是否生成一个 manifest 文件，包含了没有被 hash 过的资源文件名和 hash 后版本的映射，然后服务器框架可使用该映射来呈现正确的资源引入链接。

当值为字符串时，将用作相对于 `build.outDir` 的 manifest 文件路径。设置为 `true` 时，路径将是 `.vite/manifest.json`。

<<<<<<< HEAD
## build.ssrManifest {#build-ssrmanifest}
=======
If you are writing a plugin and need to inspect each output chunk or asset's related CSS and static assets during the build, you can also use [`viteMetadata` output bundle metadata API](/guide/api-plugin#output-bundle-metadata).

## build.ssrManifest
>>>>>>> bcd4136efdc98fd45cc22968c91383d8f5024f12

- **类型：** `boolean | string`
- **默认值：** `false`
- **相关链接：** [服务端渲染](/guide/ssr)

是否生成 SSR 的 manifest 文件，以确定生产中的样式链接与资源预加载指令。

当值为字符串时，将用作相对于 `build.outDir` 的 manifest 文件路径。设置为 `true` 时，路径将是 `.vite/ssr-manifest.json`。

## build.ssr {#build-ssr}

- **类型：** `boolean | string`
- **默认值：** `false`
- **相关链接：** [服务端渲染](/guide/ssr)

生成面向 SSR 的构建。此选项的值可以是字符串，用于直接定义 SSR 的入口，也可以为 `true`，但这需要通过设置 `rollupOptions.input` 来指定 SSR 的入口。

## build.emitAssets

- **类型：** `boolean`
- **默认：** `false`

在非客户端的构建过程中，静态资源并不会被输出，因为我们默认它们会作为客户端构建的一部分被输出。这个选项允许框架在其他环境的构建中强制输出这些资源。而将这些资源合并起来则是框架在构建后步骤中的责任。

## build.ssrEmitAssets

- **类型：** `boolean`
- **默认：** `false`

在 SSR 构建期间，静态资源不会被输出，因为它们通常被认为是客户端构建的一部分。这个选项允许框架强制在客户端和 SSR 构建中都输出它们。将静态资源在构建后合并是框架的责任。一旦环境 API 稳定，这个选项将被 `build.emitAssets` 替代。

## build.minify {#build-minify}

- **类型：** `boolean | 'oxc' | 'terser' | 'esbuild'`
- **默认：** 客户端构建默认为`'oxc'`，SSR构建默认为 `false`

设置为 `false` 可以禁用最小化混淆，或是用来指定使用哪种混淆器。默认使用 [Oxc Minifier](https://oxc.rs/docs/guide/usage/minifier)，它比 terser 快 30~90 倍，但压缩率仅差 0.5~2%。[基准测试](https://github.com/privatenumber/minification-benchmarks)

`build.minify: 'esbuild'` 已弃用，将在未来版本中移除。

注意，在 lib 模式下使用 `'es'` 时，`build.minify` 选项不会缩减空格，因为会移除掉 pure 标注，导致破坏 tree-shaking。

当设置为 `'esbuild'` 或 `'terser'` 时，必须分别安装 esbuild 或 Terser。

```sh
npm add -D esbuild
npm add -D terser
```

## build.terserOptions {#build-terseroptions}

- **类型：** `TerserOptions`

传递给 Terser 的更多 [minify 选项](https://terser.org/docs/api-reference#minify-options)。

此外，你还可以传递一个 `maxWorkers: number` 选项来指定最大的工作线程数。默认为 CPU 核心数减 1。

## build.write {#build-write}

- **类型：** `boolean`
- **默认：** `true`

设置为 `false` 来禁用将构建后的文件写入磁盘。这常用于 [编程式地调用 `build()`](/guide/api-javascript#build) 在写入磁盘之前，需要对构建后的文件进行进一步处理。

## build.emptyOutDir {#build-emptyoutdir}

- **类型：** `boolean`
- **默认：** 若 `outDir` 在 `root` 目录下，则为 `true`

默认情况下，若 `outDir` 在 `root` 目录下，则 Vite 会在构建时清空该目录。若 `outDir` 在根目录之外则会抛出一个警告避免意外删除掉重要的文件。可以设置该选项来关闭这个警告。该功能也可以通过命令行参数 `--emptyOutDir` 来使用。

## build.copyPublicDir {#build-copypublicdir}

- **类型：** `boolean`
- **默认：** `true`

默认情况下，Vite 会在构建阶段将 `publicDir` 目录中的所有文件复制到 `outDir` 目录中。可以通过设置该选项为 `false` 来禁用该行为。

## build.reportCompressedSize {#build-reportcompressedsize}

- **类型：** `boolean`
- **默认：** `true`

启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。

## build.chunkSizeWarningLimit {#build-chunksizewarninglimit}

- **类型：** `number`
- **默认：** `500`

规定触发警告的 chunk 大小。（以 kB 为单位）。它将与未压缩的 chunk 大小进行比较，因为 [JavaScript 大小本身与执行时间相关](https://v8.dev/blog/cost-of-javascript-2019)。

## build.watch {#build-watch}

- **类型：** [`WatcherOptions`](https://rolldown.rs/reference/InputOptions.watch)`| null`
- **默认：** `null`

设置为 `{}` 则会启用 rollup 的监听器。对于只在构建阶段或者集成流程使用的插件很常用。

::: warning 在 Windows Linux 子系统（WSL）上使用 Vite

某些情况下 WSL2 的文件系统监听可能无法正常工作。
查看 [`server.watch`](./server-options.md#server-watch) 了解更多细节。

:::
