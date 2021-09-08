# 开始 {#getting-started}

## 总览 {#overview}

Vite (法语意为 "快速的"，发音 `/vit/`) 是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：

- 一个开发服务器，它基于 [原生 ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 提供了 [丰富的内建功能](./features)，如速度快到惊人的 [模块热更新（HMR）](./features#hot-module-replacement)。

- 一套构建指令，它使用 [Rollup](https://rollupjs.org) 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

Vite 意在提供开箱即用的配置，同时它的 [插件 API](./api-plugin) 和 [JavaScript API](./api-javascript) 带来了高度的可扩展性，并有完整的类型支持。

你可以在 [为什么选 Vite](./why) 中了解更多关于项目的设计初衷。

## 浏览器支持 {#browser-support}

- 默认的构建目标浏览器是能 [在 script 标签上支持原生 ESM](https://caniuse.com/es6-module) 和 [原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import)。传统浏览器可以通过官方插件 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy) 支持 —— 查看 [构建生产版本](./build) 章节获取更多细节。

## 搭建第一个 Vite 项目 {#scaffolding-your-first-vite-project}

::: tip 兼容性注意
Vite 需要 [Node.js](https://nodejs.org/en/) 版本 >= 12.0.0。
:::

使用 NPM:

```bash
$ npm init vite@latest
```

使用 Yarn:

```bash
$ yarn create vite
```

使用 PNPM:

```bash
$ pnpx create-vite
```

然后按照提示操作即可！

你还可以通过附加的命令行选项直接指定项目名称和你想要使用的模板。例如，要构建一个 Vite + Vue 项目，运行:

```bash
# npm 6.x
npm init vite@latest my-vue-app --template vue

# npm 7+, 需要额外的双横线：
npm init vite@latest my-vue-app -- --template vue

# yarn
yarn create vite my-vue-app --template vue
```

支持的模板预设包括：

- `vanilla`
- `vanilla-ts`
- `vue`
- `vue-ts`
- `react`
- `react-ts`
- `preact`
- `preact-ts`
- `lit-element`
- `lit-element-ts`
- `svelte`
- `svelte-ts`

查看 [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) 以获取每个模板的更多细节。

## 社区模板 {#community-templates}

create-vite 是一个快速生成主流框架基础模板的工具。查看 Awesome Vite 仓库的 [社区维护模板](https://github.com/vitejs/awesome-vite#templates)，里面包含各种工具和不同框架的模板。你可以用如 [degit](https://github.com/Rich-Harris/degit) 之类的工具，使用社区模版来搭建项目。

```bash
npx degit user/project my-project
cd my-project

npm install
npm run dev
```

如果该项目使用 `main` 作为默认分支, 需要在项目名后添加 `#main`。

```bash
npx degit user/project#main my-project
```

## `index.html` 与项目根目录 {#index-html-and-project-root}

你可能已经注意到，在一个 Vite 项目中，`index.html` 在项目最外层而不是在 `public` 文件夹内。这是有意而为之的：在开发期间 Vite 是一个服务器，而 `index.html` 是该 Vite 项目的入口文件。

Vite 将 `index.html` 视为源码和模块图的一部分。Vite 解析 `<script type="module" src="...">` ，这个标签指向你的 JavaScript 源码。甚至内联引入 JavaScript 的 `<script type="module">` 和引用 CSS 的 `<link href>` 也能利用 Vite 特有的功能被解析。另外，`index.html` 中的 URL 将被自动转换，因此不再需要 `%PUBLIC_URL%` 占位符了。

与静态 HTTP 服务器类似，Vite 也有 “根目录” 的概念，即服务文件的位置，在接下来的文档中你将看到它会以 `<root>` 代称。源码中的绝对 URL 路径将以项目的 “根” 作为基础来解析，因此你可以像在普通的静态文件服务器上一样编写代码（并且功能更强大！）。Vite 还能够处理依赖关系，解析处于根目录外的文件位置，这使得它即使在基于 monorepo 的方案中也十分有用。

Vite 也支持多个 `.html` 作入口点的 [多页面应用模式](./build#multi-page-app)。

#### 指定替代根目录 {#specifying-alternative-root}

`vite` 以当前工作目录作为根目录启动开发服务器。你也可以通过 `vite serve some/sub/dir` 来指定一个替代的根目录。

## 命令行界面 {#command-line-interface}

在安装了 Vite 的项目中，可以在 npm scripts 中使用 `vite` 可执行文件，或者直接使用 `npx vite` 运行它。下面是通过脚手架创建的 Vite 项目中默认的 npm scripts：

```json
{
  "scripts": {
    "dev": "vite", // 启动开发服务器
    "build": "vite build", // 为生产环境构建产物
    "serve": "vite preview" // 本地预览生产构建产物
  }
}
```

可以指定额外的命令行选项，如 `--port` 或 `--https`。运行 `npx vite --help` 获得完整的命令行选项列表。

## 使用未发布的功能 {#using-unreleased-commits}

如果你迫不及待想要体验最新的功能，可以自行克隆 [vite 仓库](https://github.com/vitejs/vite) 到本地机器上然后自行将其链接（将需要 [Yarn 1.x](https://classic.yarnpkg.com/lang/en/)）：

```bash
git clone https://github.com/vitejs/vite.git
cd vite
yarn
cd packages/vite
yarn build
yarn link
```

<<<<<<< HEAD
然后，回到你的 vite 项目并运行 `yarn link vite`。重新启动开发服务器（`yarn dev`）来体验新功能吧！
=======
Then go to your Vite based project and run `yarn link vite`. Now restart the development server (`yarn dev`) to ride on the bleeding edge!
>>>>>>> 3b16a683a061a0d6c84ac44f68ca1d64b40999d0

## 社区 {#community}

如果你有疑问或者需要帮助，可以到 [Discord](https://discord.gg/4cmKdMfpU5) 和 [GitHub Discussions](https://github.com/vitejs/vite/discussions) 社区来寻求帮助。
