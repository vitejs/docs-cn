# 构建生产版本 {#building-for-production}

当需要将应用部署到生产环境时，只需运行 `vite build` 命令。默认情况下，它使用 `<root>/index.html` 作为其构建入口点，并生成能够静态部署的应用程序包。请查阅 [部署静态站点](./static-deploy) 获取常见服务的部署指引。

## 浏览器兼容性 {#browser-compatibility}

用于生产环境的构建包会假设目标浏览器支持现代 JavaScript 语法。默认情况下，Vite 的目标是能够 [支持原生 ESM script 标签](https://caniuse.com/es6-module)、[支持原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 和 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta) 的浏览器：

- Chrome >=87
- Firefox >=78
- Safari >=14
- Edge >=88

你也可以通过 [`build.target` 配置项](/config/build-options.md#build-target) 指定构建目标，最低支持 `es2015`。

请注意，默认情况下 Vite 只处理语法转译，且 **不包含任何 polyfill**。你可以访问 https://cdnjs.cloudflare.com/polyfill/ ，这个网站可以根据用户的浏览器 UserAgent 字符串自动生成 polyfill 包。

传统浏览器可以通过插件 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 来支持，它将自动生成传统版本的 chunk 及与其相对应 ES 语言特性方面的 polyfill。兼容版的 chunk 只会在不支持原生 ESM 的浏览器中进行按需加载。

## 公共基础路径 {#public-base-path}

- 相关内容：[静态资源处理](./assets)

如果你需要在嵌套的公共路径下部署项目，只需指定 [`base` 配置项](/config/shared-options.md#base)，然后所有资源的路径都将据此配置重写。这个选项也可以通过命令行参数指定，例如 `vite build --base=/my/public/path/`。

由 JS 引入的资源 URL，CSS 中的 `url()` 引用以及 `.html` 文件中引用的资源在构建过程中都会自动调整，以适配此选项。

当然，情况也有例外，当访问过程中需要使用动态连接的 url 时，可以使用全局注入的 `import.meta.env.BASE_URL` 变量，它的值为公共基础路径。注意，这个变量在构建时会被静态替换，因此，它必须按 `import.meta.env.BASE_URL` 的原样出现（例如 `import.meta.env['BASE_URL']` 是无效的）

若想要进一步控制基础路径，请查看 [高级 base 选项](#advanced-base-options).

### 相对基础路径 {#relative-base}

如果无法提前确定基础路径，可以使用 `"base": "./"` 或 `"base": ""` 设置相对基础路径。这将使所有生成的 URL 相对于每个文件。

:::warning 使用相对基础路径时对旧浏览器的支持

使用相对基础路径需要 `import.meta` 的支持。如果你需要支持 [不支持 `import.meta` 的浏览器](https://caniuse.com/mdn-javascript_operators_import_meta)，可以使用 [`legacy` 插件](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)。

:::

## 自定义构建 {#customizing-the-build}

构建过程可以通过多种 [构建配置选项](/config/#build-options) 来自定义构建。具体来说，你可以通过 `build.rollupOptions` 直接调整底层的 [Rollup 选项](https://rollupjs.org/configuration-options/)：

```js [vite.config.js]
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

你可以通过配置 `build.rollupOptions.output.manualChunks` 来自定义 chunk 分割策略（查看 [Rollup 相应文档](https://cn.rollupjs.org/configuration-options/#output-manualchunks)）。如果你使用的是一个框架，那么请参考他们的文档来了解如何配置分割 chunk。

## 处理加载报错 {#load-error-handling}

当 Vite 加载动态导入失败时，会触发 `vite:preloadError` 事件。`event.payload` 包含原始的导入错误信息。如果调用 `event.preventDefault()`，则不会抛出错误。

```js twoslash
window.addEventListener('vite:preloadError', (event) => {
  window.location.reload() // 例如，刷新页面
})
```

当重新部署时，托管服务可能会删除之前部署的资源。因此，之前访问过您站点的用户可能会遇到导入错误。这种错误发生的原因是用户设备上运行的资源过时，并尝试导入相应的旧代码块，而这些代码块已经被删除。这个事件对于解决这种情况会很有帮助。

## 文件变化时重新构建 {#rebuild-on-files-changes}

你可以使用 `vite build --watch` 来启用 rollup 的监听器。或者，你可以直接通过 `build.watch` 调整底层的 [`WatcherOptions`](https://rollupjs.org/configuration-options/#watch) 选项：

```js [vite.config.js]
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

```js twoslash [vite.config.js]
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

::: code-group

```js twoslash [vite.config.js (单入口)]
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/main.js'),
      name: 'MyLib',
      // 将添加适当的扩展名后缀
      fileName: 'my-lib',
    },
    rollupOptions: {
      // 确保外部化处理那些
      // 你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖
        // 提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

```js twoslash [vite.config.js (多入口)]
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: {
        'my-lib': resolve(__dirname, 'lib/main.js'),
        secondary: resolve(__dirname, 'lib/secondary.js'),
      },
      name: 'MyLib',
    },
    rollupOptions: {
      // 确保外部化处理那些
      // 你不想打包进库的依赖
      external: ['vue'],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖
        // 提供一个全局变量
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
})
```

:::

入口文件将包含可以被您的包的用户导入的导出内容：

```js [lib/main.js]
import Foo from './Foo.vue'
import Bar from './Bar.vue'
export { Foo, Bar }
```

使用如上配置运行 `vite build` 时，将会使用一套面向库的 Rollup 预设，并且将为该库提供两种构建格式：`es` 和 `umd` (可在 `build.lib` 中配置)：

```
$ vite build
building for production...
dist/my-lib.js      0.08 kB / gzip: 0.07 kB
dist/my-lib.umd.cjs 0.30 kB / gzip: 0.16 kB
```

推荐在库的 `package.json` 中使用如下格式：

::: code-group

```json [package.json (单入口)]
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

```json [package.json (多入口)]
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

:::

::: tip 文件扩展名
如果 `package.json` 不包含 `"type": "module"`，Vite 会生成不同的文件后缀名以兼容 Node.js。`.js` 会变为 `.mjs` 而 `.cjs` 会变为 `.js` 。
:::

::: tip 环境变量
在库模式中，所有 [`import.meta.env.*`](./env-and-mode.md) 的使用都会在构建生产版本时被静态替换。但是，`process.env.*` 的使用不会，这样你的库的使用者就可以动态地改变它。如果这是不可取的，你可以使用 `define: { 'process.env.NODE_ENV': '"production"' }` 来静态替换它们，或者使用 [`esm-env`](https://github.com/benmccann/esm-env) 来更好地兼容打包工具和运行时。
:::

::: warning 进阶用法
库模式包括了一种简单而又有见地的配置，适用于面向浏览器和 JS 框架的库。如果你正在构建非面向浏览器的库，或需要高级构建流程，可以直接使用 [Rollup](https://rollupjs.org) 或 [esbuild](https://esbuild.github.io)。
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

```ts twoslash
import type { UserConfig } from 'vite'
// prettier-ignore
const config: UserConfig = {
// ---cut-before---
experimental: {
  renderBuiltUrl(filename, { hostType }) {
    if (hostType === 'js') {
      return { runtime: `window.__toCdnUrl(${JSON.stringify(filename)})` }
    } else {
      return { relative: true }
    }
  },
},
// ---cut-after---
}
```

如果 hash 后的资源和公共文件没有被部署在一起，可以根据该函数的第二个参数 `context` 上的字段 `type` 分别定义各个资源组的选项：

```ts twoslash
import type { UserConfig } from 'vite'
import path from 'node:path'
// prettier-ignore
const config: UserConfig = {
// ---cut-before---
experimental: {
  renderBuiltUrl(filename, { hostId, hostType, type }) {
    if (type === 'public') {
      return 'https://www.domain.com/' + filename
    } else if (path.extname(hostId) === '.js') {
      return { runtime: `window.__assetsPath(${JSON.stringify(filename)})` }
    } else {
      return 'https://cdn.domain.com/assets/' + filename
    }
  },
},
// ---cut-after---
}
```

请注意，传递的 `filename` 是一个已解码的 URL，如果函数返回了一个 URL 字符串，那么它也应该是已解码的。当 Vite 渲染 URL 时会自动处理编码。如果返回的是一个带有 `runtime` 的对象，就需要在必要的地方自行处理编码，因为运行时的代码将会按照原样呈现。
