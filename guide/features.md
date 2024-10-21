# 功能 {#features}

对非常基础的使用来说，使用 Vite 开发和使用一个静态文件服务器并没有太大区别。然而，Vite 还通过原生 ESM 导入提供了许多主要用于打包场景的增强功能。

## npm 依赖解析和预构建 {#npm-dependency-resolving-and-pre-bundling}

原生 ES 导入不支持下面这样的裸模块导入：

```js
import { someMethod } from 'my-dep'
```

上面的代码会在浏览器中抛出一个错误。Vite 将会检测到所有被加载的源文件中的此类裸模块导入，并执行以下操作:

1. [预构建](./dep-pre-bundling) 它们可以提高页面加载速度，并将 CommonJS / UMD 转换为 ESM 格式。预构建这一步由 [esbuild](http://esbuild.github.io/) 执行，这使得 Vite 的冷启动时间比任何基于 JavaScript 的打包器都要快得多。

2. 重写导入为合法的 URL，例如 `/node_modules/.vite/deps/my-dep.js?v=f3sf2ebd` 以便浏览器能够正确导入它们。

**依赖是强缓存的**

Vite 通过 HTTP 头来缓存请求得到的依赖，所以如果你想要编辑或调试一个依赖，请按照 [这里](./dep-pre-bundling#浏览器缓存) 的步骤操作。

## 模块热替换 {#hot-module-replacement}

Vite 提供了一套原生 ESM 的 [HMR API](./api-hmr)。 具有 HMR 功能的框架可以利用该 API 提供即时、准确的更新，而无需重新加载页面或清除应用程序状态。Vite 内置了 HMR 到 [Vue 单文件组件（SFC）](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue) 和 [React Fast Refresh](https://github.com/vitejs/vite-plugin-react/tree/main/packages/plugin-react) 中。也通过 [@prefresh/vite](https://github.com/JoviDeCroock/prefresh/tree/main/packages/vite) 对 Preact 实现了官方集成。

注意，你不需要手动设置这些 —— 当你通过 [`create-vite`](./) 创建应用程序时，所选模板已经为你预先配置了这些。

## TypeScript {#typescript}

Vite 天然支持引入 `.ts` 文件。

### 仅执行转译 {#transpile-only}

请注意，Vite 仅执行 `.ts` 文件的转译工作，**并不执行** 任何类型检查。并假定类型检查已经被你的 IDE 或构建过程处理了。

Vite 之所以不把类型检查作为转换过程的一部分，是因为这两项工作在本质上是不同的。转译可以在每个文件的基础上进行，与 Vite 的按需编译模式完全吻合。相比之下，类型检查需要了解整个模块图。把类型检查塞进 Vite 的转换管道，将不可避免地损害 Vite 的速度优势。

Vite 的工作是尽可能快地将源模块转化为可以在浏览器中运行的形式。为此，我们建议将静态分析检查与 Vite 的转换管道分开。这一原则也适用于其他静态分析检查，例如 ESLint。

- 在构建生产版本时，你可以在 Vite 的构建命令之外运行 `tsc --noEmit`。

- 在开发时，如果你需要更多的 IDE 提示，我们建议在一个单独的进程中运行 `tsc --noEmit --watch`，或者如果你喜欢在浏览器中直接看到上报的类型错误，可以使用 [vite-plugin-checker](https://github.com/fi3ework/vite-plugin-checker)。

Vite 使用 [esbuild](https://github.com/evanw/esbuild) 将 TypeScript 转译到 JavaScript，约是 `tsc` 速度的 20~30 倍，同时 HMR 更新反映到浏览器的时间小于 50ms。

使用 [仅含类型的导入和导出](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export) 形式的语法可以避免潜在的 “仅含类型的导入被不正确打包” 的问题，写法示例如下：

```ts
import type { T } from 'only/types'
export type { T }
```

### TypeScript 编译器选项 {#typescript-compiler-options}

`tsconfig.json` 中 `compilerOptions` 下的一些配置项需要特别注意。

#### `isolatedModules`

- [TypeScript 文档](https://www.typescriptlang.org/tsconfig#isolatedModules)

应该设置为 `true`。

这是因为 `esbuild` 只执行没有类型信息的转译，它并不支持某些特性，如 `const enum` 和隐式类型导入。

你必须在 `tsconfig.json` 中的 `compilerOptions` 下设置 `"isolatedModules": true`。如此做，TS 会警告你不要使用隔离（isolated）转译的功能。

如果一个依赖项和 `"isolatedModules": true` 不兼容的话，你可以在上游仓库修复好之前暂时使用 `"skipLibCheck": true` 来缓解这个错误。

#### `useDefineForClassFields`

- [TypeScript 文档](https://www.typescriptlang.org/tsconfig#useDefineForClassFields)

从 Vite v2.5.0 开始，如果 TypeScript 的 target 是 `ESNext` 或 `ES2022` 及更新版本，此选项默认值则为 `true`。这与 [`tsc` v4.3.2 及以后版本的行为](https://github.com/microsoft/TypeScript/pull/42663) 一致。这也是标准的 ECMAScript 的运行时行为。

若设了其他 TypeScript target，则本项会默认为 `false`.

但对于那些习惯其他编程语言或旧版本 TypeScript 的开发者来说，这可能是违反直觉的。
你可以参阅 [TypeScript 3.7 发布日志](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier) 中了解更多关于如何兼容的信息。

如果你正在使用一个严重依赖 class fields 的库，请注意该库对此选项的预期设置。

大多数库都希望 `"useDefineForClassFields": true`，如 [MobX](https://mobx.js.org/installation.html#use-spec-compliant-transpilation-for-class-properties)。

但是有几个库还没有兼容这个新的默认值，其中包括 [`lit-element`](https://github.com/lit/lit-element/issues/1030)。如果遇到这种情况，请将 `useDefineForClassFields` 设置为 `false`。

#### `target` {#target}

- [TypeScript 文档](https://www.typescriptlang.org/tsconfig#target)

Vite 忽略 `tsconfig.json` 中的 `target` 值，遵循与 `esbuild` 相同的行为。

要在开发中指定目标，可使用 [`esbuild.target`](/config/shared-options.html#esbuild) 选项，默认值为 `esnext`，以实现最小的转译。在构建中，[`build.target`](/config/build-options.html#build-target) 选项优先于 `esbuild.target`，如有需要也可以进行设置。

::: warning `useDefineForClassFields`

如果 `target` 不是 `ESNext` 或 `ES2022` 或更新版本，或者没有 `tsconfig.json` 文件，`useDefineForClassFields` 将默认为 `false`，这可能会导致默认的 `esbuild.target` 值为 `esnext` 的问题。它可能会转译为 [static initialization blocks](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks#browser_compatibility)，这在你的浏览器中可能不被支持。

因此，建议将 `target` 设置为 `ESNext` 或 `ES2022` 或更新版本，或者在配置 `tsconfig.json` 时将 `useDefineForClassFields` 显式设置为 `true`。
:::

#### 影响构建结果的其他编译器选项 {#other-compiler-options-affecting-the-build-result}

- [`extends`](https://www.typescriptlang.org/tsconfig#extends)
- [`importsNotUsedAsValues`](https://www.typescriptlang.org/tsconfig#importsNotUsedAsValues)
- [`preserveValueImports`](https://www.typescriptlang.org/tsconfig#preserveValueImports)
- [`verbatimModuleSyntax`](https://www.typescriptlang.org/tsconfig#verbatimModuleSyntax)
- [`jsx`](https://www.typescriptlang.org/tsconfig#jsx)
- [`jsxFactory`](https://www.typescriptlang.org/tsconfig#jsxFactory)
- [`jsxFragmentFactory`](https://www.typescriptlang.org/tsconfig#jsxFragmentFactory)
- [`jsxImportSource`](https://www.typescriptlang.org/tsconfig#jsxImportSource)
- [`experimentalDecorators`](https://www.typescriptlang.org/tsconfig#experimentalDecorators)
- [`alwaysStrict`](https://www.typescriptlang.org/tsconfig#alwaysStrict)

::: tip `skipLibCheck`
Vite 启动模板默认情况下会设置 `"skipLibCheck": "true"`，以避免对依赖项进行类型检查，因为它们可能只支持特定版本和配置的 TypeScript。你可以在 [vuejs/vue-cli#5688](https://github.com/vuejs/vue-cli/pull/5688) 了解更多信息。
:::

### 客户端类型 {#client-types}

Vite 默认的类型定义是写给它的 Node.js API 的。要将其补充到一个 Vite 应用的客户端代码环境中，请添加一个 `d.ts` 声明文件：

```typescript
/// <reference types="vite/client" />
```

或者，你也可以将 `vite/client` 添加到 `tsconfig.json` 中的 `compilerOptions.types` 下：

```json [tsconfig.json]
{
  "compilerOptions": {
    "types": ["vite/client"]
  }
}
```

这将会提供以下类型定义补充：

- 资源导入 (例如：导入一个 `.svg` 文件)
- `import.meta.env` 上 Vite 注入的环境变量的类型定义
- `import.meta.hot` 上的 [HMR API](./api-hmr) 类型定义

::: tip
要覆盖默认的类型定义，请添加一个包含你所定义类型的文件，请在三斜线注释 reference `vite/client` 前添加定义。

例如，要为 React 组件中的 `*.svg` 文件定义类型：

- `vite-env-override.d.ts` (the file that contains your typings):
  ```ts
  declare module '*.svg' {
    const content: React.FC<React.SVGProps<SVGElement>>
    export default content
  }
  ```
- The file containing the reference to `vite/client`:
  ```ts
  /// <reference types="./vite-env-override.d.ts" />
  /// <reference types="vite/client" />
  ```

:::

## Vue {#vue}

Vite 为 Vue 提供第一优先级支持：

- Vue 3 单文件组件支持：[@vitejs/plugin-vue](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue)
- Vue 3 JSX 支持：[@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx)
- Vue 2.7 SFC 支持：[@vitejs/plugin-vue2](https://github.com/vitejs/vite-plugin-vue2)
- Vue 2.7 JSX 支持：[@vitejs/plugin-vue2-jsx](https://github.com/vitejs/vite-plugin-vue2-jsx)

## JSX {#jsx}

`.jsx` 和 `.tsx` 文件同样开箱即用。JSX 的转译同样是通过 [esbuild](https://esbuild.github.io)。

Vue 用户应使用官方提供的 [@vitejs/plugin-vue-jsx](https://github.com/vitejs/vite-plugin-vue/tree/main/packages/plugin-vue-jsx) 插件，它提供了 Vue 3 特性的支持，包括 HMR，全局组件解析，指令和插槽。

如果不是在 React 或 Vue 中使用 JSX，自定义的 `jsxFactory` 和 `jsxFragment` 可以使用 [`esbuild` 选项](/config/shared-options.md#esbuild) 进行配置。例如对 Preact：

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
})
```

更多细节详见 [esbuild 文档](https://esbuild.github.io/content-types/#jsx).

你可以使用 `jsxInject`（这是一个仅在 Vite 中使用的选项）为 JSX 注入 helper，以避免手动导入：

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'

export default defineConfig({
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
})
```

## CSS {#css}

导入 `.css` 文件将会把内容插入到 `<style>` 标签中，同时也带有 HMR 支持。

### `@import` 内联和变基 {#import-inlining-and-rebasing}

Vite 通过 `postcss-import` 预配置支持了 CSS `@import` 内联，Vite 的路径别名也遵从 CSS `@import`。换句话说，所有 CSS `url()` 引用，即使导入的文件在不同的目录中，也总是自动变基，以确保正确性。

Sass 和 Less 文件也支持 `@import` 别名和 URL 变基（具体请参阅 [CSS 预处理器](#css-pre-processors)）。

### PostCSS {#postcss}

如果项目包含有效的 PostCSS 配置 (任何受 [postcss-load-config](https://github.com/postcss/postcss-load-config) 支持的格式，例如 `postcss.config.js`)，它将会自动应用于所有已导入的 CSS。

请注意，CSS 最小化压缩将在 PostCSS 之后运行，并会使用 [`build.cssTarget`](/config/build-options.md#build-csstarget) 选项。

### CSS Modules {#css-modules}

任何以 `.module.css` 为后缀名的 CSS 文件都被认为是一个 [CSS modules 文件](https://github.com/css-modules/css-modules)。导入这样的文件会返回一个相应的模块对象：

```css [example.module.css]
.red {
  color: red;
}
```

```js twoslash
import 'vite/client'
// ---cut---
import classes from './example.module.css'
document.getElementById('foo').className = classes.red
```

CSS modules 行为可以通过 [`css.modules` 选项](/config/shared-options.md#css-modules) 进行配置。

如果 `css.modules.localsConvention` 设置开启了 camelCase 格式变量名转换（例如 `localsConvention: 'camelCaseOnly'`），你还可以使用按名导入。

```js twoslash
import 'vite/client'
// ---cut---
// .apply-color -> applyColor
import { applyColor } from './example.module.css'
document.getElementById('foo').className = applyColor
```

### CSS 预处理器 {#css-pre-processors}

由于 Vite 的目标仅为现代浏览器，因此建议使用原生 CSS 变量和实现 CSSWG 草案的 PostCSS 插件（例如 [postcss-nesting](https://github.com/csstools/postcss-plugins/tree/main/plugins/postcss-nesting)）来编写简单的、符合未来标准的 CSS。

话虽如此，但 Vite 也同时提供了对 `.scss`, `.sass`, `.less`, `.styl` 和 `.stylus` 文件的内置支持。没有必要为它们安装特定的 Vite 插件，但必须安装相应的预处理器依赖：

```bash
# .scss 和 .sass
npm add -D sass-embedded # 或 sass

# .less
npm add -D less

# .styl 和 .stylus
npm add -D stylus
```

如果使用的是单文件组件，可以通过 `<style lang="sass">`（或其他预处理器）自动开启。

Vite 为 Sass 和 Less 改进了 `@import` 解析，以保证 Vite 别名也能被使用。另外，`url()` 中的相对路径引用的，与根文件不同目录中的 Sass/Less 文件会自动变基以保证正确性。

由于 Stylus API 限制，`@import` 别名和 URL 变基不支持 Stylus。

你还可以通过在文件扩展名前加上 `.module` 来结合使用 CSS modules 和预处理器，例如 `style.module.scss`。

### 禁用 CSS 注入页面 {#disabling-css-injection-into-the-page}

自动注入 CSS 内容的行为可以通过 `?inline` 参数来关闭。在关闭时，被处理过的 CSS 字符串将会作为该模块的默认导出，但样式并没有被注入到页面中。

```js twoslash
import 'vite/client'
// ---cut---
import './foo.css' // 样式将会注入页面
import otherStyles from './bar.css?inline' // 样式不会注入页面
```

::: tip 注意
自 Vite 5 起，CSS 文件的默认导入和按名导入（例如 `import style from './foo.css'`）将被移除。请使用 `?inline` 参数代替。
:::

### Lightning CSS

从 Vite 4.4 开始，已经实验性地支持 [Lightning CSS](https://lightningcss.dev/)。可以通过在配置文件中添加 [`css.transformer: 'lightningcss'`](../config/shared-options.md#css-transformer) 并安装可选的 [`lightningcss`](https://www.npmjs.com/package/lightningcss) 依赖项来选择使用它：

```bash
npm add -D lightningcss
```

如果启用，CSS 文件将由 Lightning CSS 处理，而不是 PostCSS。可以将 Lightning CSS 的选项传递给 [`css.lightningcss`](../config/shared-options.md#css-lightningcss) 选项来配置。

要配置 CSS Modules，需要使用 [`css.lightningcss.cssModules`](https://lightningcss.dev/css-modules.html) 而不是 [`css.modules`](../config/shared-options.md#css-modules)（后者是用于配置 PostCSS 处理 CSS Modules 的方式）。

默认情况下，Vite 使用 esbuild 来压缩 CSS。通过 [`build.cssMinify: 'lightningcss'`](../config/build-options.md#build-cssminify) 进行配置，也可以将 Lightning CSS 用作 CSS 最小化压缩。

::: tip NOTE
在使用 Lightning CSS 时，不支持 [CSS 预处理器](#css-pre-processors)。
:::

## 静态资源处理 {#static-assets}

导入一个静态资源会返回解析后的 URL：

```js twoslash
import 'vite/client'
// ---cut---
import imgUrl from './img.png'
document.getElementById('hero-img').src = imgUrl
```

添加一些特殊的查询参数可以更改资源被引入的方式：

```js twoslash
import 'vite/client'
// ---cut---
// 显式加载资源为一个 URL
import assetAsURL from './asset.js?url'
```

```js twoslash
import 'vite/client'
// ---cut---
// 以字符串形式加载资源
import assetAsString from './shader.glsl?raw'
```

```js twoslash
import 'vite/client'
// ---cut---
// 加载为 Web Worker
import Worker from './worker.js?worker'
```

```js twoslash
import 'vite/client'
// ---cut---
// 在构建时 Web Worker 内联为 base64 字符串
import InlineWorker from './worker.js?worker&inline'
```

更多细节请见 [静态资源处理](./assets)。

## JSON {#json}

JSON 可以被直接导入 —— 同样支持具名导入：

```js twoslash
import 'vite/client'
// ---cut---
// 导入整个对象
import json from './example.json'
// 对一个根字段使用具名导入 —— 有效帮助 treeshaking！
import { field } from './example.json'
```

## Glob 导入 {#glob-import}

Vite 支持使用特殊的 `import.meta.glob` 函数从文件系统导入多个模块：

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js')
```

以上将会被转译为下面的样子：

```js
// vite 生成的代码
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
  './dir/bar.js': () => import('./dir/bar.js'),
}
```

你可以遍历 `modules` 对象的 key 值来访问相应的模块：

```js
for (const path in modules) {
  modules[path]().then((mod) => {
    console.log(path, mod)
  })
}
```

匹配到的文件默认是懒加载的，通过动态导入实现，并会在构建时分离为独立的 chunk。如果你倾向于直接引入所有的模块（例如依赖于这些模块中的副作用首先被应用），你可以传入 `{ eager: true }` 作为第二个参数：

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { eager: true })
```

以上会被转译为下面的样子：

```js
// vite 生成的代码
import * as __glob__0_0 from './dir/foo.js'
import * as __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

### 多个匹配模式 {#multiple-patterns}

第一个参数可以是一个 glob 数组，例如：

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', './another/*.js'])
```

### 反面匹配模式 {#negative-patterns}

同样也支持反面 glob 匹配模式（以 `!` 作为前缀）。若要忽略结果中的一些文件，你可以添加“排除匹配模式”作为第一个参数：

```js twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob(['./dir/*.js', '!**/bar.js'])
```

```js
// vite 生成的代码
const modules = {
  './dir/foo.js': () => import('./dir/foo.js'),
}
```

#### 具名导入 {#named-imports}

也可能你只想要导入模块中的部分内容，那么可以利用 `import` 选项。

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', { import: 'setup' })
```

```ts
// vite 生成的代码
const modules = {
  './dir/foo.js': () => import('./dir/foo.js').then((m) => m.setup),
  './dir/bar.js': () => import('./dir/bar.js').then((m) => m.setup),
}
```

当与 `eager` 一同存在时，甚至可以对这些模块进行 tree-shaking。

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'setup',
  eager: true,
})
```

```ts
// vite 生成的代码
import { setup as __glob__0_0 } from './dir/foo.js'
import { setup as __glob__0_1 } from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

设置 `import` 为 `default` 可以加载默认导出。

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  import: 'default',
  eager: true,
})
```

```ts
// vite 生成的代码
import __glob__0_0 from './dir/foo.js'
import __glob__0_1 from './dir/bar.js'
const modules = {
  './dir/foo.js': __glob__0_0,
  './dir/bar.js': __glob__0_1,
}
```

#### 自定义查询 {#custom-queries}

你也可以使用 `query` 选项来提供对导入的自定义查询，比如，可以将资源 [作为字符串引入](/guide/assets#importing-asset-as-string) 或者 [作为 URL 引入](/guide/assets#importing-asset-as-url) ：

```ts twoslash
import 'vite/client'
// ---cut---
const moduleStrings = import.meta.glob('./dir/*.svg', {
  query: '?raw',
  import: 'default',
})
const moduleUrls = import.meta.glob('./dir/*.svg', {
  query: '?url',
  import: 'default',
})
```

```ts
// vite 生成的代码
const moduleStrings = {
  './dir/foo.svg': () => import('./dir/foo.js?raw').then((m) => m['default']),
  './dir/bar.svg': () => import('./dir/bar.js?raw').then((m) => m['default']),
}
const moduleUrls = {
  './dir/foo.svg': () => import('./dir/foo.js?url').then((m) => m['default']),
  './dir/bar.svg': () => import('./dir/bar.js?url').then((m) => m['default']),
}
```

你还可以为其他插件提供定制化的查询参数：

```ts twoslash
import 'vite/client'
// ---cut---
const modules = import.meta.glob('./dir/*.js', {
  query: { foo: 'bar', bar: true },
})
```

### Glob 导入注意事项 {#glob-import-caveats}

请注意：

- 这只是一个 Vite 独有的功能而不是一个 Web 或 ES 标准
- 该 Glob 模式会被当成导入标识符：必须是相对路径（以 `./` 开头）或绝对路径（以 `/` 开头，相对于项目根目录解析）或一个别名路径（请看 [`resolve.alias` 选项](/config/shared-options.md#resolve-alias))。
- Glob 匹配是使用 [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) 来实现的 —— 阅读它的文档来查阅 [支持的 Glob 模式](https://github.com/mrmlnc/fast-glob#pattern-syntax)。
- 你还需注意，所有 `import.meta.glob` 的参数都必须以字面量传入。你 **不** 可以在其中使用变量或表达式。

## 动态导入 {#dynamic-import}

和 [glob 导入](#glob-import) 类似，Vite 也支持带变量的动态导入。

```ts
const module = await import(`./dir/${file}.js`)
```

注意变量仅代表一层深的文件名。如果 `file` 是 `foo/bar`，导入将会失败。对于更进阶的使用详情，你可以使用 [glob 导入](#glob-import) 功能。

## WebAssembly {#webassembly}

预编译的 `.wasm` 文件可以通过 `?init` 来导入。
默认导出一个初始化函数，返回值为所导出 [`WebAssembly.Instance`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Instance) 实例对象的 Promise：

```js twoslash
import 'vite/client'
// ---cut---
import init from './example.wasm?init'

init().then((instance) => {
  instance.exports.test()
})
```

`init` 函数还可以将传递给 [`WebAssembly.instantiate`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/instantiate) 的导入对象作为其第二个参数：

```js twoslash
import 'vite/client'
import init from './example.wasm?init'
// ---cut---
init({
  imports: {
    someFunc: () => {
      /* ... */
    },
  },
}).then(() => {
  /* ... */
})
```

在生产构建当中，体积小于 `assetInlineLimit` 的 `.wasm` 文件将会被内联为 base64 字符串。否则，它们将被视为 [静态资源](./assets) ，并按需获取。

::: tip 注意
[对 WebAssembly 的 ES 模块集成提案](https://github.com/WebAssembly/esm-integration) 尚未支持。
请使用 [`vite-plugin-wasm`](https://github.com/Menci/vite-plugin-wasm) 或其他社区上的插件来处理。
:::

### 访问 WebAssembly 模块 {#accessing-the-webassembly-module}

如果需要访问 `Module` 对象，例如将它多次实例化，可以使用 [显式 URL 引入](./assets#explicit-url-imports) 来解析资源，然后执行实例化：

```js twoslash
import 'vite/client'
// ---cut---
import wasmUrl from 'foo.wasm?url'

const main = async () => {
  const responsePromise = fetch(wasmUrl)
  const { module, instance } =
    await WebAssembly.instantiateStreaming(responsePromise)
  /* ... */
}

main()
```

### 在 Node.js 中获取模块 {#fetching-the-module-in-node-js}

在 SSR 中，作为 `?init` 导入的 `fetch()` 可能会失败，导致 `TypeError: Invalid URL` 报错。
请参见问题 [在 SSR 中支持 wasm](https://github.com/vitejs/vite/issues/8882)。

以下是一种替代方案，假设项目根目录在当前目录：

```js twoslash
import 'vite/client'
// ---cut---
import wasmUrl from 'foo.wasm?url'
import { readFile } from 'node:fs/promises'

const main = async () => {
  const resolvedUrl = (await import('./test/boot.test.wasm?url')).default
  const buffer = await readFile('.' + resolvedUrl)
  const { instance } = await WebAssembly.instantiate(buffer, {
    /* ... */
  })
  /* ... */
}

main()
```

## Web Workers {#web-workers}

### 通过构造器导入 {#import-with-constructors}

一个 Web Worker 可以使用 [`new Worker()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/Worker) 和 [`new SharedWorker()`](https://developer.mozilla.org/en-US/docs/Web/API/SharedWorker/SharedWorker) 导入。与 worker 后缀相比，这种语法更接近于标准，是创建 worker 的 **推荐** 方式。

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url))
```

worker 构造函数会接受可以用来创建 “模块” worker 的选项：

```ts
const worker = new Worker(new URL('./worker.js', import.meta.url), {
  type: 'module',
})
```

只有在 `new Worker()` 声明中直接使用 `new URL()` 构造函数时，work 线程的检测才会生效。此外，所有选项参数必须是静态值（即字符串字面量）。

### 带有查询后缀的导入 {#import-with-query-suffixes}

你可以在导入请求上添加 `?worker` 或 `?sharedworker` 查询参数来直接导入一个 web worker 脚本。默认导出会是一个自定义 worker 的构造函数：

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker'

const worker = new MyWorker()
```

这个 worker 脚本也可以使用 ESM `import` 语句而不是 `importScripts()`。**注意**：在开发时，这依赖于 [浏览器原生支持](https://caniuse.com/?search=module%20worker)，但是在生产构建中，它会被编译掉。

默认情况下，worker 脚本将在生产构建中编译成单独的 chunk。如果你想将 worker 内联为 base64 字符串，请添加 `inline` 查询参数：

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&inline'
```

如果你想要以一个 URL 的形式读取该 worker，请添加 `url` 这个 query：

```js twoslash
import 'vite/client'
// ---cut---
import MyWorker from './worker?worker&url'
```

关于如何配置打包全部 worker，可以查看 [Worker 选项](/config/worker-options.md) 了解更多相关细节。

## 内容安全策略（CSP） {#content-security-policy-csp}

由于 Vite 的内部机制，为了部署 CSP 必须设置某些指令或配置。

### [`'nonce-{RANDOM}'`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#nonce-base64-value)

当设置了 [`html.cspNonce`](/config/shared-options#html-cspnonce) 时，Vite 会为任何 `<script>` 和 `<style>` 标签，以及样式表和模块预加载的 `<link>` 标签添加一个 nonce 属性。此外，当设置了这个选项时，Vite 会注入一个 meta 标签 (`<meta property="csp-nonce" nonce="PLACEHOLDER" />`)。

带有 `property="csp-nonce"` 的 meta 标签的 nonce 值将在开发和构建后的必要时刻被 Vite 使用。

:::warning
确保为每个请求替换的占位符为唯一值。这对于防止绕过资源的策略非常重要，否则很容易被绕过。
:::

### [`data:`](<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/Sources#scheme-source:~:text=schemes%20(not%20recommended).-,data%3A,-Allows%20data%3A>)

默认情况下，Vite 在构建过程中会将小型资源内联为 data URI。允许 `data:` 用于相关指令（例如 [`img-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/img-src)，[`font-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/font-src)），或者，通过设置 [`build.assetsInlineLimit: 0`](/config/build-options#build-assetsinlinelimit) 来禁用它是必要的。

:::warning
不要为 [`script-src`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) 允许 `data:`。这将会允许注入任何脚本。
:::

## 构建优化 {#build-optimizations}

> 下面所罗列的功能会自动应用为构建过程的一部分，除非你想禁用它们，否则没有必要显式配置。

### CSS 代码分割 {#css-code-splitting}

Vite 会自动地将一个异步 chunk 模块中使用到的 CSS 代码抽取出来并为其生成一个单独的文件。这个 CSS 文件将在该异步 chunk 加载完成时自动通过一个 `<link>` 标签载入，该异步 chunk 会保证只在 CSS 加载完毕后再执行，避免发生 [FOUC](https://en.wikipedia.org/wiki/Flash_of_unstyled_content#:~:text=A%20flash%20of%20unstyled%20content,before%20all%20information%20is%20retrieved.) 。

如果你更倾向于将所有的 CSS 抽取到一个文件中，你可以通过设置 [`build.cssCodeSplit`](/config/build-options.md#build-csscodesplit) 为 `false` 来禁用 CSS 代码分割。

### 预加载指令生成 {#preload-directives-generation}

Vite 会为入口 chunk 和它们在打包出的 HTML 中的直接引入自动生成 `<link rel="modulepreload">` 指令。

### 异步 Chunk 加载优化 {#async-chunk-loading-optimization}

在实际项目中，Rollup 通常会生成 “共用” chunk —— 被两个或以上的其他 chunk 共享的 chunk。与动态导入相结合，会很容易出现下面这种场景：

<script setup>
import graphSvg from '../images/graph.svg?raw'
</script>
<svg-image :svg="graphSvg" />

在无优化的情境下，当异步 chunk `A` 被导入时，浏览器将必须请求和解析 `A`，然后它才能弄清楚它也需要共用 chunk `C`。这会导致额外的网络往返：

```
Entry ---> A ---> C
```

Vite 将使用一个预加载步骤自动重写代码，来分割动态导入调用，以实现当 `A` 被请求时，`C` 也将 **同时** 被请求：

```
Entry ---> (A + C)
```

`C` 也可能有更深的导入，在未优化的场景中，这会导致更多的网络往返。Vite 的优化会跟踪所有的直接导入，无论导入的深度如何，都能够完全消除不必要的往返。
