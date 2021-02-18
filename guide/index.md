# 开始

## 总览

Vite (法语意为 "快速的"，发音 `/vit/`) 是一种新型前端构建工具，能够显著提升前端开发体验，它主要由两部分组成：

- 一个针对 [原生 ES Modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 有许多增强功能的开发服务器，并附带 [丰富的内建功能](./features) 和速度快到惊人的 [模块热重载（HMR）](./features#hot-module-replacement)。

- 一套 [构建指令](./build) 使用 [Rollup](https://rollupjs.org) 打包你的代码，预配置输出高度优化的静态资源用于生产。

此外，Vite 通过它的 [插件 API](./api-plugin) 和 [JavaScript API](./api-javascript) 具有高度的可扩展性，并支持全类型。

## 浏览器支持

- 开发环境中：Vite 需要在支持 [原生 ES 模块动态导入](https://caniuse.com/es6-module-dynamic-import) 的浏览器中使用。

- 生产环境中：默认的构建目标浏览器支持 [通过脚本标签来引入原生 ES 模块](https://caniuse.com/es6-module) 。可以通过官方插件 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 支持传统浏览器。有关更多细节详见 [构建生产版本](./build)。

## 第一个 Vite 项目

::: tip 兼容性注意
Vite 需要 [Node.js](https://nodejs.org/en/) 版本 >= 12.0.0。
:::

使用 NPM:

```bash
npm init @vitejs/app
```

使用 Yarn:

```bash
yarn create @vitejs/app
```

然后按照提示操作即可！

您还可以通过附加的命令行选项直接指定项目名称和您想要使用的模板。例如，要构建一个 Vite + Vue 项目，运行:

```bash
# npm 6.x
npm init @vitejs/app my-vue-app --template vue

# npm 7+, 需要额外的双横线:
npm init @vitejs/app my-vue-app -- --template vue

# yarn
yarn create @vitejs/app my-vue-app --template vue
```

支持的模板预设包括：

- `vanilla`
- `vue`
- `vue-ts`
- `react`
- `react-ts`
- `preact`
- `preact-ts`
- `lit-element`
- `lit-element-ts`

查看 [@vitejs/create-app](https://github.com/vitejs/vite/tree/main/packages/create-app) 获取每个模板的更多细节。

## `index.html` 与项目根目录

你可能已经注意到，在一个 Vite 项目中，`index.html` 是放在项目最外层而不是藏在 `public` 文件夹里。如此为之是因为：在开发期间 Vite 是一个服务器，而 `index.html` 是该应用的入口点。

Vite 将 `index.html` 视为源代码和模块图谱的一部分。它将解析引用了你 JavaScript 源代码的 `<script type="module" src="...">`。即使是内联的 `<script type="module">` 和通过 `<link href>` 引用的 CSS 也可以享受到 Vite 独有的功能。另外，`index.html` 中的 URL 将被自动变基，所以无需那个特殊的 `%PUBLIC_URL%` 占位符了。

与静态 http 服务器类似，Vite 也有提供文件的 “根目录” 的概念。你会看到它在其余的文档中被引用为 `<root>`。源代码中的绝对 URL 路径将以项目根文件作为基础来解析，因此您可以像使用普通的静态文件服务器一样编写代码（并且功能更强大!）。Vite 还能够处理依赖关系，解析出处于根目录外的文件位置，这使得它即使在基于 monorepo 的设置中也十分有用。

Vite 也支持多个 `.html` 作入口点的 [多页面应用模式](./build#多页面应用模式)。

#### 指定替代根目录

运行 `vite` 启动开发服务器时，将以当前工作目录作为根。你可以通过 `vite serve some/sub/dir` 来指定一个替代的根目录。

## 命令行接口

在安装了 Vite 的项目中，可以在 npm scripts 中使用 `vite` 可执行文件，或者直接使用 `npx vite` 运行它。下面是通过脚手架创建的 Vite 项目中默认的 npm scripts：

```json
{
  "scripts": {
    "dev": "vite", // 启动开发服务器
    "build": "vite build", // 为生产环境构建
    "serve": "vite preview" // 本地预览生产构建产物
  }
}
```

可以指定额外的命令行选项，如 `--port` 或 `--https`。运行 `npx vite --help` 获得完整的命令行选项列表。

## 使用未发布的特性

如果等不及一个新版本来测试最新的特性，可以自行克隆 [vite 仓库](https://github.com/vitejs/vite) 到本地机器上然后将其自行链接（将需要 [Yarn 1.x](https://classic.yarnpkg.com/lang/en/)）：

```bash
git clone https://github.com/vitejs/vite.git
cd vite
yarn
cd packages/vite
yarn build
yarn link
```

然后回到基于 vite 的项目并运行 `yarn link vite`。重新启动开发服务器（`yarn dev`）来体验最前沿功能吧！
