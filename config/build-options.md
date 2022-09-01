# 构建选项 {#build-options}

## build.target {#build-target}

- **类型：** `string | string[]`
- **默认：** `'modules'`
- **相关内容：** [浏览器兼容性](/guide/build#browser-compatibility)

设置最终构建的浏览器兼容目标。默认值是一个 Vite 特有的值——`'modules'`，这是指 [支持原生 ES 模块](https://caniuse.com/es6-module)、[原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 和 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) 的浏览器。

另一个特殊值是 “esnext” —— 即假设有原生动态导入支持，并且将会转译得尽可能小：

- 如果 [`build.minify`](#build-minify) 选项为 `'terser'`， `'esnext'` 将会强制降级为 `'es2019'`。
- 其他情况下将完全不会执行转译。

转换过程将会由 esbuild 执行，并且此值应该是一个合法的 [esbuild 目标选项](https://esbuild.github.io/api/#target)。自定义目标也可以是一个 ES 版本（例如：`es2015`）、一个浏览器版本（例如：`chrome58`）或是多个目标组成的一个数组。

注意：如果代码包含不能被 `esbuild` 安全地编译的特性，那么构建将会失败。查看 [esbuild 文档](https://esbuild.github.io/content-types/#javascript) 获取更多细节。

## build.polyfillModulePreload {#build-polyfillmodulepreload}

- **类型：** `boolean`
- **默认值：** `true`

用于决定是否自动注入 [module preload 的 polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill).

如果设置为 `true`，此 polyfill 会被自动注入到每个 `index.html` 入口的 proxy 模块中。如果是通过 `build.rollupOptions.input` 将构建配置为使用非 html 的自定义入口，那么则需要在你自定义入口中手动引入 polyfill：

```js
import 'vite/modulepreload-polyfill'
```

注意：此 polyfill **不适用于** [Library 模式](/guide/build#library-mode)。如果你需要支持不支持动态引入的浏览器，你应该避免在你的库中使用此选项。

## build.outDir {#build-outdir}

- **类型：** `string`
- **默认：** `dist`

指定输出路径（相对于 [项目根目录](/guide/#index-html-and-project-root)).

## build.assetsDir {#build-assetsdir}

- **类型：** `string`
- **默认：** `assets`

指定生成静态资源的存放路径（相对于 `build.outDir`）。

## build.assetsInlineLimit {#build-assetsinlinelimit}

- **类型：** `number`
- **默认：** `4096` (4kb)

小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 `0` 可以完全禁用此项。

Git LFS 占位符会自动排除在内联之外，因为它们不包含它们所表示的文件的内容。

:::tip 注意
如果你指定了 `build.lib`，那么 `build.assetsInlineLimit` 将被忽略，无论文件大小或是否为 Git LFS 占位符，资源都会被内联。
:::

## build.cssCodeSplit {#build-csscodesplit}

- **类型：** `boolean`
- **默认：** `true`

启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在其被加载时插入。

如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。

::: tip 注意
如果指定了 `build.lib`，`build.cssCodeSplit` 会默认为 `false`。
:::

## build.cssTarget

- **类型：** `string | string[]`
- **默认值：** 与 [`build.target`](/config/#build-target) 一致

此选项允许用户为 CSS 的压缩设置一个不同的浏览器 target，此处的 target 并非是用于 JavaScript 转写目标。

应只在针对非主流浏览器时使用。
最直观的示例是当你要兼容的场景是安卓微信中的 webview 时，它支持大多数现代的 JavaScript 功能，但并不支持 [CSS 中的 `#RGBA` 十六进制颜色符号](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors)。
这种情况下，你需要将 `build.cssTarget` 设置为 `chrome61`，以防止 vite 将 `rgba()` 颜色转化为 `#RGBA` 十六进制符号的形式。

## build.sourcemap {#build-sourcemap}

- **类型：** `boolean | 'inline' | 'hidden'`
- **默认：** `false`

构建后是否生成 source map 文件。如果为 `true`，将会创建一个独立的 source map 文件。如果为 `'inline'`，source map 将作为一个 data URI 附加在输出文件中。`'hidden'` 的工作原理与 `'true'` 相似，只是 bundle 文件中相应的注释将不被保留。

## build.rollupOptions {#build-rollupoptions}

- **类型：** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。查看 [Rollup 选项文档](https://rollupjs.org/guide/en/#big-list-of-options) 获取更多细节。

## build.commonjsOptions {#build-commonjsoptions}

- **类型：** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

传递给 [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) 插件的选项。

## build.dynamicImportVarsOptions {#build-dynamicimportvarsoptions}

- **类型：** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **相关内容：** [动态导入](/guide/features#dynamic-import)

传递给 [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars) 的选项。

## build.lib {#build-lib}

- **类型：** `{ entry: string, name?: string, formats?: ('es' | 'cjs' | 'umd' | 'iife')[], fileName?: string | ((format: ModuleFormat) => string) }`
- **相关内容：** [库模式](/guide/build#library-mode)

构建为库。`entry` 是必须的因为库不能使用 HTML 作为入口。`name` 则是暴露的全局变量，在 `formats` 包含 `'umd'` 或 `'iife'` 时是必须的。默认 `formats` 是 `['es', 'umd']` 。`fileName` 是输出的包文件名，默认 `fileName` 是 `package.json` 的 `name` 选项，同时，它还可以被定义为参数为 `format` 的函数。

## build.manifest {#build-manifest}

- **类型：** `boolean | string`
- **默认：** `false`
- **相关内容：** [后端集成](/guide/backend-integration)

当设置为 `true`，构建后将会生成 `manifest.json` 文件，包含了没有被 hash 过的资源文件名和 hash 后版本的映射。可以为一些服务器框架渲染时提供正确的资源引入链接。当该值为一个字符串时，它将作为 manifest 文件的名字。

## build.ssrManifest {#build-ssrmanifest}

- **类型：** `boolean | string`
- **默认值：** `false`
- **相关链接：** [服务端渲染](/guide/ssr)

当设置为 `true` 时，构建也将生成 SSR 的 manifest 文件，以确定生产中的样式链接与资产预加载指令。当该值为一个字符串时，它将作为 manifest 文件的名字。

## build.ssr {#build-ssr}

- **类型：** `boolean | string`
- **默认值：** `undefined`
- **相关链接：** [Server-Side Rendering](/guide/ssr)

生成面向 SSR 的构建。此选项的值可以是字符串，用于直接定义 SSR 的入口，也可以为 `true`，但这需要通过设置 `rollupOptions.input` 来指定 SSR 的入口。

## build.minify {#build-minify}

- **类型：** `boolean | 'terser' | 'esbuild'`
- **默认：** `'esbuild'`

设置为 `false` 可以禁用最小化混淆，或是用来指定使用哪种混淆器。默认为 [Esbuild](https://github.com/evanw/esbuild)，它比 terser 快 20-40 倍，压缩率只差 1%-2%。[Benchmarks](https://github.com/privatenumber/minification-benchmarks)

注意，在 lib 模式下使用 `'es'` 时，`build.minify` 选项不会缩减空格，因为会移除掉 pure 标注，导致破坏 tree-shaking。

当设置为 `'terser'` 时必须先安装 Terser。

```sh
npm add -D terser
```

## build.terserOptions {#build-terseroptions}

- **类型：** `TerserOptions`

传递给 Terser 的更多 [minify 选项](https://terser.org/docs/api-reference#minify-options)。

## build.write {#build-write}

- **类型：** `boolean`
- **默认：** `true`

设置为 `false` 来禁用将构建后的文件写入磁盘。这常用于 [编程式地调用 `build()`](/guide/api-javascript#build) 在写入磁盘之前，需要对构建后的文件进行进一步处理。

## build.emptyOutDir {#build-emptyoutdir}

- **类型：** `boolean`
- **默认：** 若 `outDir` 在 `root` 目录下，则为 `true`

默认情况下，若 `outDir` 在 `root` 目录下，则 Vite 会在构建时清空该目录。若 `outDir` 在根目录之外则会抛出一个警告避免意外删除掉重要的文件。可以设置该选项来关闭这个警告。该功能也可以通过命令行参数 `--emptyOutDir` 来使用。

## build.reportCompressedSize {#build-reportcompressedsize}

- **类型：** `boolean`
- **默认：** `true`

启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。

## build.chunkSizeWarningLimit {#build-chunksizewarninglimit}

- **类型：** `number`
- **默认：** `500`

规定触发警告的 chunk 大小。（以 kbs 为单位）

## build.watch {#build-watch}

- **类型：** [`WatcherOptions`](https://rollupjs.org/guide/en/#watch-options)`| null`
- **默认：** `null`

设置为 `{}` 则会启用 rollup 的监听器。对于只在构建阶段或者集成流程使用的插件很常用。

::: warning 在 Windows Linux 子系统（WSL）上使用 Vite

某些情况下 WSL2 的文件系统监听可能无法正常工作。
查看 [`server.watch`](./server-options.md#server-watch) 了解更多细节。

:::
