# 使用插件 {#using-plugins}

Vite 可以使用插件进行扩展，这得益于 Rollup 优秀的插件接口设计和一部分 Vite 独有的额外选项。这意味着 Vite 用户可以利用 Rollup 插件的强大生态系统，同时根据需要也能够扩展开发服务器和 SSR 功能。

## 添加一个插件 {#adding-a-plugin}

若要使用一个插件，需要将它添加到项目的 `devDependencies` 并在 `vite.config.js` 配置文件中的 `plugins` 数组中引入它。例如，要想为传统浏览器提供支持，可以按下面这样使用官方插件 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)：

```
$ npm add -D @vitejs/plugin-legacy
```

```js
// vite.config.js
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```

`plugins` 也可以接受包含多个插件作为单个元素的预设。这对于使用多个插件实现的复杂特性（如框架集成）很有用。该数组将在内部被扁平化。

Falsy 虚值的插件将被忽略，可以用来轻松地启用或停用插件。

## 查找插件 {#finding-plugins}

:::tip 注意
Vite 旨在为常见的 Web 开发范式提供开箱即用的支持。在寻找一个 Vite 或兼容的 Rollup 插件之前，请先查看 [功能指引](../guide/features.md)。大量在 Rollup 项目中需要使用插件的用例在 Vite 中已经覆盖到了。
:::

<<<<<<< HEAD
查看 [Plugins 章节](../plugins/) 获取官方插件信息。社区插件列表请参见 [awesome-vite](https://github.com/vitejs/awesome-vite#plugins)。而对于兼容的 Rollup 插件，请查看 [Vite Rollup 插件](https://vite-rollup-plugins.patak.dev) 获取一个带使用说明的兼容 Rollup 官方插件列表，若列表中没有找到，则请参阅 [Rollup 插件兼容性章节](../guide/api-plugin#rollup-plugin-compatibility)。
=======
Check out the [Plugins section](../plugins/) for information about official plugins. Community plugins are listed in [awesome-vite](https://github.com/vitejs/awesome-vite#plugins).
>>>>>>> f074bf6cbf9e9c6cb0ade5cce6842cd4072a07f1

你也可以使用此 [npm Vite 插件搜索链接](https://www.npmjs.com/search?q=vite-plugin&ranking=popularity) 来找到一些遵循了 [推荐约定](./api-plugin.md#conventions) 的 Vite 插件，或者通过 [npm Rollup 插件搜索链接](https://www.npmjs.com/search?q=rollup-plugin&ranking=popularity) 获取 Rollup 插件。

## 强制插件排序 {#enforcing-plugin-ordering}

为了与某些 Rollup 插件兼容，可能需要强制修改插件的执行顺序，或者只在构建时使用。这应该是 Vite 插件的实现细节。可以使用 `enforce` 修饰符来强制插件的位置:

- `pre`：在 Vite 核心插件之前调用该插件
- 默认：在 Vite 核心插件之后调用该插件
- `post`：在 Vite 构建插件之后调用该插件

```js
// vite.config.js
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre',
    },
  ],
})
```

<<<<<<< HEAD
查看 [Plugins API Guide](./api-plugin.md#plugin-ordering) 获取细节信息，并在 [Vite Rollup 插件](https://vite-rollup-plugins.patak.dev) 兼容性列表中注意 `enforce` 标签和流行插件的使用说明。
=======
Check out [Plugins API Guide](./api-plugin.md#plugin-ordering) for detailed information.
>>>>>>> f074bf6cbf9e9c6cb0ade5cce6842cd4072a07f1

## 按需应用 {#conditional-application}

默认情况下插件在开发 (serve) 和生产 (build) 模式中都会调用。如果插件在服务或构建期间按需使用，请使用 `apply` 属性指明它们仅在 `'build'` 或 `'serve'` 模式时调用：

```js
// vite.config.js
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build',
    },
  ],
})
```

## 创建插件 {#building-plugins}

阅读 [插件 API 指引](./api-plugin.md) 文档了解如何创建插件。
