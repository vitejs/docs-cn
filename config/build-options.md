# 构建选项

## build.target

- **类型：** `string | string[]`
- **默认：** `'modules'`
- **相关内容：** [Browser Compatibility](/guide/build#browser-compatibility)

设置最终构建的浏览器兼容目标。 默认值是一个 Vite 特有的值，`'modules'`，这是指支持 [原生 ES 模块](https://caniuse.com/es6-module) 和 [原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 的浏览器。

另一个特殊值是 `'esnext'`——它假定支持原生动态导入和尽可能少的转换：

- 如果 [`build.minify`](#build-minify) 选项是 `'terser'`，`'esnext'` 会强制降为 `'es2021'`。
- 在其他情况下，它根本不会执行任何转换。

转换过程将会由 esbuild 执行，并且此值应该是一个合法的 [esbuild 目标选项](https://esbuild.github.io/api/#target)。自定义目标也可以是一个 ES 版本 (例如： `es2015`)，一个浏览器版本 (例如： `chrome58`)，或是多个目标组成的一个数组。

注意，如果代码包含不能被 esbuild 安全地编译的特性，那么构建将会失败。查看 [esbuild 文档](https://esbuild.github.io/content-types/#javascript) 获取更多细节。

## build.polyfillModulePreload

- **类型：** `boolean`
- **默认：** `true`

是否自动注入 [模块预加载 polyfill](https://guybedford.com/es-module-preloading-integrity#modulepreload-polyfill)。

如果设为 `true`，该 polyfill 会自动注入到每个 `index.html` 入口的代理模块中。 如果构建通过 `build.rollupOptions.input` 选项，配置为非 html 的自定义入口，就有必要在你的自定义入口中手动引入此 polyfill：

```js
import 'vite/modulepreload-polyfill'
```

注意: 该 polyfill **不会** 应用于 [库模式](/guide/build#library-mode)。 如果你需要支持不含原生动态导入功能的浏览器，你或许应该避免在你的库中使用它。

## build.outDir

- **类型：** `string`
- **默认：** `dist`

指定生成路径 (相对于 [项目根目录](/guide/#index-html-and-project-root))。

## build.assetsDir

- **类型：** `string`
- **默认：** `assets`

指定生成静态资源的存放路径 (相对于 `build.outDir`)。

## build.assetsInlineLimit

- **类型：** `number`
- **默认：** `4096` (4kb)

小于此阈值的导入或引用资源将内联为 base64 编码，以避免额外的 http 请求。设置为 `0` 可以完全禁用此项。

::: tip 提示
如果你添加了 `build.lib` 选项，`build.assetsInlineLimit` 会被忽略，资源文件不论大小全以内联方式输出。
:::

## build.cssCodeSplit

- **类型：** `boolean`
- **默认：** `true`

启用/禁用 CSS 代码拆分。当启用时，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在块加载时插入。

如果禁用，整个项目中的所有 CSS 将被提取到一个 CSS 文件中。

::: tip 提示
如果你添加了 `build.lib` 选项，`build.cssCodeSplit` 会默认为 `false` 。
:::

## build.cssTarget

- **类型：** `string | string[]`
- **默认：** 与 [`build.target`](/config/#build-target) 相同

这个选项允许用户为压缩 css 设置不同于 JavaScript 转换标准。

它应该只用于非主流的浏览器目标时。

比如在安卓的微信 WebView 中，它支持大多数的现代 JavaScript 功能但不支持 [`#RGBA` CSS 的十六进制颜色表示法](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value#rgb_colors)。


在这种情况下，你需要设置 `build.cssTarget` 为 `chrome61`，以阻止 vite 把 `rgba()` 颜色值转换为十六进制的  `#RGBA`。

## build.sourcemap

- **类型：** `boolean | 'inline' | 'hidden'`
- **默认：** `false`

生成 source maps 文件。 如果设为 `true`，会生成一个 sourcemap 文件。 如果设为 `'inline'`，sourcemap 会以数据 URI 被加在输出的结果文件里。 `'hidden'` 和 `true` 一样，但 sourcemap 里的注释不会出现在打包的文件里。

## build.rollupOptions

- **类型：** [`RollupOptions`](https://rollupjs.org/guide/en/#big-list-of-options)

直接自定义底层的 Rollup 打包配置。 这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。 See [Rollup 选项文旦那个](https://rollupjs.org/guide/en/#big-list-of-options) 获取更多细节。

## build.commonjsOptions

- **类型：** [`RollupCommonJSOptions`](https://github.com/rollup/plugins/tree/master/packages/commonjs#options)

传递给 [@rollup/plugin-commonjs](https://github.com/rollup/plugins/tree/master/packages/commonjs) 插件的选项。

## build.dynamicImportVarsOptions

- **类型：** [`RollupDynamicImportVarsOptions`](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars#options)
- **相关内容：** [动态导入](/guide/features#dynamic-import)

传递给 [@rollup/plugin-dynamic-import-vars](https://github.com/rollup/plugins/tree/master/packages/dynamic-import-vars) 插件的选项。

## build.lib

- **类型：** `{ entry: string，name?: string，formats?: ('es' | 'cjs' | 'umd' | 'iife')[]，fileName?: string | ((format: ModuleFormat) => string) }`
- **相关内容：** [库模式](/guide/build#library-mode)

构建为库。 `entry` 为必须，因此库不能用 HTML 作为入口。 `name` 则是暴露的全局变量，并且在 `formats` 包含 `'umd'` 或 `'iife'` 时是必须的。 默认 `formats` 是 `['es'，'umd']`。 `fileName` 是输出的包文件名，默认的 `fileName` 是 package.json 的名称选项，他也能被定义为函数，用 `format` 参数取得。

## build.manifest

- **类型：** `boolean | string`
- **默认：** `false`
- **相关内容：** [后端集成](/guide/backend-integration)

当设为 `true`，构建后将会生成清单文件 `manifest.json`，映射没有被 hash 的资源文件名和它们的 hash 版本，可以为一些服务器框架渲染时提供正确的资源引入链接。 当值为字符串时，它将用作清单文件的文件名。

## build.ssrManifest

- **类型：** `boolean | string`
- **默认：** `false`
- **相关内容：** [服务端渲染](/guide/ssr)

当设为 `true`，该构建也将生成 SSR 清单，用于确定生产中的样式链接和资源预加载指令。当值为字符串时，它将用作清单文件的文件名。

## build.ssr

- **类型：** `boolean | string`
- **默认：** `undefined`
- **相关内容：** [服务端渲染](/guide/ssr)

产生面向 SSR 的构建。 可以是直接指定 SSR 入口的字符串，或者 `true`，它需要通过 `rollupOptions.input` 来指定 SSR 入口。

## build.minify

- **类型：** `boolean | 'terser' | 'esbuild'`
- **默认：** `'esbuild'`

设为 `false` 来禁用压缩，或者指定用什么压缩。 默认为 [esbuild](https://github.com/evanw/esbuild) 它比 terser 快 20 - 40 倍并且只有 1 ~ 2% 的压缩失败。 [Benchmarks 测试](https://github.com/privatenumber/minification-benchmarks)

注意 `build.minify` 在库模式的类型 formats 设为 `'es'` 时不可用。

要先安装 Terser， 值 `'terser'` 才有用。

```sh
npm add -D terser
```

## build.terserOptions

- **类型：** `TerserOptions`

其他可传给 Terser 的 [压缩选项](https://terser.org/docs/api-reference#minify-options)。

## build.write

- **类型：** `boolean`
- **默认：** `true`

设为 `false` 来禁用将构建后的文件写入磁盘。 它通常被用在 [ 编程式地调用 `build()` ](/guide/api-javascript#build) 在写入磁盘之前，需要对构建后的文件进行进一步处理。

## build.emptyOutDir

- **类型：** `boolean`
- **默认：** `true` if `outDir` is inside `root`

默认情况下，如果是在项目根目录下，Vite 会清空 `outDir` 。 若 `outDir` 在根目录之外则会抛出一个警告避免意外删除掉重要的文件。 你可以设置该选项来关闭这个警告。该功能也可以通过命令行参数 `--emptyOutDir` 来使用。

## build.reportCompressedSize

- **类型：** `boolean`
- **默认：** `true`

启用/禁用 gzip 压缩大小报告。压缩大型输出文件可能会很慢，因此禁用该功能可能会提高大型项目的构建性能。

### build.chunkSizeWarningLimit

- **类型：** `number`
- **默认：** `500`

chunk 大小警告的限制（以 kbs 为单位）。

## build.watch

- **类型：** [`WatcherOptions`](https://rollupjs.org/guide/en/#watch-options)`| null`
- **默认：** `null`

设为 `{}` 来启用回滚监听。 这主要用于涉及仅构建插件或集成过程的情况。
