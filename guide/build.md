# 构建生产版本 {#building-for-production}

当需要将应用部署到生产环境时，只需运行 `vite build` 命令。默认情况下，它使用 `<root>/index.html` 作为其构建入口点，并生成能够静态部署的应用程序包。请查阅 [部署静态站点](./static-deploy) 获取常见服务的部署指引。

## 浏览器兼容性 {#browser-compatibility}

用于生产环境的构建包会假设目标浏览器支持现代 JavaScript 语法。默认情况下，Vite 的目标是能够 [支持原生 ESM script 标签](https://caniuse.com/es6-module)、[支持原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 和 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) 的浏览器：

- Chrome >=87
- Firefox >=78
- Safari >=14
- Edge >=88

你也可以通过 [`build.target` 配置项](/config/build-options.md#build-target) 指定构建目标，最低支持 `es2015`。

请注意，默认情况下 Vite 只处理语法转译，且 **不包含任何 polyfill**。你可以前往 [Polyfill.io](https://polyfill.io/v3/) 查看，这是一个基于用户浏览器 User-Agent 字符串自动生成 polyfill 包的服务。

传统浏览器可以通过插件 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 来支持，它将自动生成传统版本的 chunk 及与其相对应 ES 语言特性方面的 polyfill。兼容版的 chunk 只会在不支持原生 ESM 的浏览器中进行按需加载。

## 公共基础路径 {#public-base-path}

- 相关内容：[静态资源处理](./assets)

如果你需要在嵌套的公共路径下部署项目，只需指定 [`base` 配置项](/config/shared-options.md#base)，然后所有资源的路径都将据此配置重写。这个选项也可以通过命令行参数指定，例如 `vite build --base=/my/public/path/`。

由 JS 引入的资源 URL，CSS 中的 `url()` 引用以及 `.html` 文件中引用的资源在构建过程中都会自动调整，以适配此选项。

当然，情况也有例外，当访问过程中需要使用动态连接的 url 时，可以使用全局注入的 `import.meta.env.BASE_URL` 变量，它的值为公共基础路径。注意，这个变量在构建时会被静态替换，因此，它必须按 `import.meta.env.BASE_URL` 的原样出现（例如 `import.meta.env['BASE_URL']` 是无效的）

若想要进一步控制基础路径，请查看 [高级 base 选项](#advanced-base-options).

## 自定义构建 {#customizing-the-build}

构建过程可以通过多种 [构建配置选项](/config/#build-options) 来自定义构建。具体来说，你可以通过 `build.rollupOptions` 直接调整底层的 [Rollup 选项](https://rollupjs.org/configuration-options/)：

```js
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      // https://rollupjs.org/configuration-options/
    },
  },
})
```

例如，你可以使用仅在构建期间应用的插件来指定多个 Rollup 输出。

## 产物分块策略 {#chunking-strategy}

你可以通过配置 `build.rollupOptions.output.manualChunks` 来自定义 chunk 分割策略（查看 [Rollup 相应文档](https://rollupjs.org/configuration-options/#output-manualchunks)）。在 Vite 2.8 及更早版本中，默认的策略是将 chunk 分割为 `index` 和 `vendor`。这对一些 SPA 来说是好的策略，但是要对所有应用场景提供一种通用解决方案是非常困难的。从 Vite 2.9 起，`manualChunks` 默认情况下不再被更改。你可以通过在配置文件中添加 `splitVendorChunkPlugin` 来继续使用 “分割 Vendor Chunk” 策略：

```js
// vite.config.js
import { splitVendorChunkPlugin } from 'vite'
export default defineConfig({
  plugins: [splitVendorChunkPlugin()],
})
```

也可以用一个工厂函数 `splitVendorChunk({ cache: SplitVendorChunkCache })` 来提供该策略，在需要与自定义逻辑组合的情况下，`cache.reset()` 需要在 `buildStart` 阶段被调用，以便构建的 watch 模式在这种情况下正常工作。

::: warning
你应该使用 `build.rollupOptions.output.manualChunks` 函数形式来使用此插件。如果使用对象形式，插件将不会生效。
:::

## 文件变化时重新构建 {#rebuild-on-files-changes}

你可以使用 `vite build --watch` 来启用 rollup 的监听器。或者，你可以直接通过 `build.watch` 调整底层的 [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch) 选项：

```js
// vite.config.js
export default defineConfig({
  build: {
    watch: {
      // https://rollupjs.org/configuration-options/#watch
    },
  },
})
```

当启用 `--watch` 标志时，对 `vite.config.js` 的改动，以及任何要打包的文件，都将触发重新构建。

## 多页面应用模式 {#multi-page-app}

假设你有下面这样的项目文件结构

```
├── package.json
├── vite.config.js
├── index.html
├── main.js
└── nested
    ├── index.html
    └── nested.js
```

在开发过程中，简单地导航或链接到 `/nested/` - 将会按预期工作，与正常的静态文件服务器表现一致。

在构建过程中，你只需指定多个 `.html` 文件作为入口点即可：

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        nested: resolve(__dirname, 'nested/index.html'),
      },
    },
  },
})
```

如果你指定了另一个根目录，请记住，在解析输入路径时，`__dirname` 的值将仍然是 vite.config.js 文件所在的目录。因此，你需要把对应入口文件的 `root` 的路径添加到 `resolve` 的参数中。

请注意，在 HTML 文件中，Vite 忽略了 `rollupOptions.input` 对象中给定的入口名称，而是在生成 dist 文件夹中的 HTML 资源文件时，使用了文件已解析的路径 ID。这确保了与开发服务器的工作方式保持一致的结构。

## 库模式 {#library-mode}

当你开发面向浏览器的库时，你可能会将大部分时间花在该库的测试/演示页面上。在 Vite 中你可以使用 `index.html` 获得如丝般顺滑的开发体验。

当这个库要进行发布构建时，请使用 [`build.lib` 配置项](/config/build-options.md#build-lib)，以确保将那些你不想打包进库的依赖进行外部化处理，例如 `vue` 或 `react`：

```js
// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      // the proper extensions will be added
      fileName: 'my-lib',
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

入口文件将包含可以由你的包的用户导入的导出：

```js
// lib/main.js
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

使用如上配置运行 `vite build` 时，将会使用一套面向库的 Rollup 预设，并且将为该库提供两种构建格式：`es` 和 `umd` (可在 `build.lib` 中配置)：

```
$ vite build
building for production...
dist/my-lib.js      0.08 KiB / gzip: 0.07 KiB
dist/my-lib.umd.cjs 0.30 KiB / gzip: 0.16 KiB
```

推荐在你库的 `package.json` 中使用如下格式：

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.umd.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.umd.cjs"
    }
  }
}
```

或者，如果暴露了多个入口起点：

```json
{
  "name": "my-lib",
  "type": "module",
  "files": ["dist"],
  "main": "./dist/my-lib.cjs",
  "module": "./dist/my-lib.js",
  "exports": {
    ".": {
      "import": "./dist/my-lib.js",
      "require": "./dist/my-lib.cjs"
    },
    "./secondary": {
      "import": "./dist/secondary.js",
      "require": "./dist/secondary.cjs"
    }
  }
}
```

::: tip 注意
如果 `package.json` 不包含 `"type": "module"`，Vite 会生成不同的文件后缀名以兼容 Node.js。`.js` 会变为 `.mjs` 而 `.cjs` 会变为 `.js` 。
:::

::: tip 环境变量
在库模式下，所有 `import.meta.env.*` 用法在构建生产时都会被静态替换。但是，`process.env.*` 的用法不会被替换，所以你的库的使用者可以动态地更改它。如果不想允许他们这样做，你可以使用 `define: { 'process.env.NODE_ENV': '"production"' }` 例如静态替换它们。
:::

## 进阶基础路径选项 {#advanced-base-options}

::: warning
该功能是实验性的，可以在这里 [提供反馈](https://github.com/vitejs/vite/discussions/13834)。
:::

对更高级的使用场景，被部署的资源和公共文件可能想要分为不同的路径，例如使用不同缓存策略的场景。
一个用户可能以三种不同的路径部署下列文件：

- 生成的入口 HTML 文件（可能会在 SSR 中被处理）
- 生成的带有 hash 值的文件（JS、CSS 以及其他文件类型，如图片）
- 拷贝的 [公共文件](assets.md#the-public-directory)

单个静态的 [基础路径](#public-base-path) 在这种场景中就不够用了。Vite 在构建时为更高级的基础路径选项提供了实验性支持，可以使用 `experimental.renderBuiltUrl`。

```ts
experimental: {
  renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
    if (hostType === 'js') {
      return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
    } else {
      return { relative: true }
    }
  }
}
```

如果 hash 后的资源和公共文件没有被部署在一起，可以根据该函数的第二个参数 `context` 上的字段 `type` 分别定义各个资源组的选项：

```ts
experimental: {
  renderBuiltUrl(filename: string, { hostId, hostType, type }: { hostId: string, hostType: 'js' | 'css' | 'html', type: 'public' | 'asset' }) {
    if (type === 'public') {
      return 'https://www.domain.com/' + filename
    }
    else if (path.extname(hostId) === '.js') {
      return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
    }
    else {
      return 'https://cdn.domain.com/assets/' + filename
    }
  }
}
```
