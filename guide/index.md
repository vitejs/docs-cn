# 开始 {#getting-started}

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## 总览 {#overview}

Vite（法语意为 "快速的"，发音 `/vit/`<button id="play-vite-audio" onclick="document.getElementById('vite-audio').play();" style="border: none; padding: 3px; border-radius: 4px; vertical-align: bottom;"><svg style="height:2em;width:2em"><use href="/voice.svg#voice" /></svg></button>，发音同 "veet"）是一种新型前端构建工具，能够显著提升前端开发体验。它主要由两部分组成：

- 一个开发服务器，它基于 [原生 ES 模块](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) 提供了 [丰富的内建功能](./features)，如速度快到惊人的 [模块热替换（HMR）](./features#hot-module-replacement)。

- 一套构建指令，它使用 [Rollup](https://rollupjs.org) 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

Vite 是一种具有明确建议的工具，具备合理的默认设置。您可以在 [功能指南](./features) 中了解 Vite 的各种可能性。通过 [插件](./using-plugins)，Vite 支持与其他框架或工具的集成。如有需要，您可以通过 [配置部分](../config/) 自定义适应你的项目。

Vite 还提供了强大的扩展性，可通过其 [插件 API](./api-plugin) 和 [JavaScript API](./api-javascript) 进行扩展，并提供完整的类型支持。

你可以在 [为什么选 Vite](./why) 部分深入了解该项目的设计理念。

## 浏览器支持 {#browser-support}

在开发阶段，Vite 将 [`esnext` 作为转换目标](https://esbuild.github.io/api/#target)，因为我们假设使用的是现代浏览器，它支持所有最新的 JavaScript 和 CSS 特性。这样可以防止语法降级，让 Vite 尽可能地接近原始源代码。

对于生产构建，默认情况下 Vite 的目标浏览器支持 [原生 ES 模块](https://caniuse.com/es6-module)、[原生 ESM 动态导入](https://caniuse.com/es6-module-dynamic-import) 和 [`import.meta`](https://caniuse.com/mdn-javascript_operators_import_meta)。旧版浏览器可以通过官方的 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)。查看 [构建生产环境](./build) 了解更多细节。

## 在线试用 Vite {#trying-vite-online}

你可以通过 [StackBlitz](https://vite.new/) 在线试用 vite。它直接在浏览器中运行基于 Vite 的构建，因此它与本地开发几乎无差别，同时无需在你的机器上安装任何东西。你可以浏览 `vite.new/{template}` 来选择你要使用的框架。

目前支持的模板预设如下：

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |
|   [solid](https://vite.new/solid)   |   [solid-ts](https://vite.new/solid-ts)   |
|    [qwik](https://vite.new/qwik)    |    [qwik-ts](https://vite.new/qwik-ts)    |

## 搭建第一个 Vite 项目 {#scaffolding-your-first-vite-project}

::: tip 兼容性注意
Vite 需要 [Node.js](https://nodejs.org/en/) 版本 18+ 或 20+。然而，有些模板需要依赖更高的 Node 版本才能正常运行，当你的包管理器发出警告时，请注意升级你的 Node 版本。
:::

::: code-group

```bash [npm]
$ npm create vite@latest
```

```bash [Yarn]
$ yarn create vite
```

```bash [pnpm]
$ pnpm create vite
```

```bash [Bun]
$ bun create vite
```

:::

然后按照提示操作即可！

你还可以通过附加的命令行选项直接指定项目名称和你想要使用的模板。例如，要构建一个 Vite + Vue 项目，运行:

::: code-group

```bash [npm]
# npm 7+，需要添加额外的 --：
$ npm create vite@latest my-vue-app -- --template vue
```

```bash [Yarn]
$ yarn create vite my-vue-app --template vue
```

```bash [pnpm]
$ pnpm create vite my-vue-app --template vue
```

```bash [Bun]
$ bun create vite my-vue-app --template vue
```

:::

查看 [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) 以获取每个模板的更多细节：`vanilla`，`vanilla-ts`, `vue`, `vue-ts`，`react`，`react-ts`，`react-swc`，`react-swc-ts`，`preact`，`preact-ts`，`lit`，`lit-ts`，`svelte`，`svelte-ts`，`solid`，`solid-ts`，`qwik`，`qwik-ts`。

你可以使用 `.` 作为项目名称，在当前目录中创建项目脚手架。

## 社区模板 {#community-templates}

create-vite 是一个快速生成主流框架基础模板的工具。查看 Awesome Vite 仓库的 [社区维护模板](https://github.com/vitejs/awesome-vite#templates)，里面包含各种工具和不同框架的模板。

对于一个 `https://github.com/user/project` 中的模板，可以尝试使用 `https://github.stackblitz.com/user/project`（即在项目 URL 的 `github` 后添加 `.stackblitz`）。

你也可以用如 [degit](https://github.com/Rich-Harris/degit) 之类的工具，使用社区模版来搭建项目。假设项目在 GitHub 上并使用 `main` 作为默认分支，可以使用以下命令创建本地副本：

```bash
npx degit user/project#main my-project
cd my-project

npm install
npm run dev
```

## 手动安装 {#manual-installation}

在你的项目中，可以用以下方法来安装 `vite` 命令行工具：

::: code-group

```bash [npm]
$ npm install -D vite
```

```bash [Yarn]
$ yarn add -D vite
```

```bash [pnpm]
$ pnpm add -D vite
```

```bash [Bun]
$ bun add -D vite
```

:::

并创建一个像这样的 `index.html` 文件：

```html
<p>Hello Vite!</p>
```

然后在终端上运行相应的命令:

::: code-group

```bash [npm]
$ npx vite
```

```bash [Yarn]
$ yarn vite
```

```bash [pnpm]
$ pnpm vite
```

```bash [Bun]
$ bunx vite
```

:::

之后就可以在 `http://localhost:5173` 上访问 `index.html`。

## `index.html` 与项目根目录 {#index-html-and-project-root}

你可能已经注意到，在一个 Vite 项目中，`index.html` 在项目最外层而不是在 `public` 文件夹内。这是有意而为之的：在开发期间 Vite 是一个服务器，而 `index.html` 是该 Vite 项目的入口文件。

Vite 将 `index.html` 视为源码和模块图的一部分。Vite 解析 `<script type="module" src="...">` ，这个标签指向你的 JavaScript 源码。甚至内联引入 JavaScript 的 `<script type="module">` 和引用 CSS 的 `<link href>` 也能利用 Vite 特有的功能被解析。另外，`index.html` 中的 URL 将被自动转换，因此不再需要 `%PUBLIC_URL%` 占位符了。

与静态 HTTP 服务器类似，Vite 也有 “根目录” 的概念，即服务文件的位置，在接下来的文档中你将看到它会以 `<root>` 代称。源码中的绝对 URL 路径将以项目的 “根” 作为基础来解析，因此你可以像在普通的静态文件服务器上一样编写代码（并且功能更强大！）。Vite 还能够处理依赖关系，解析处于根目录外的文件位置，这使得它即使在基于 monorepo 的方案中也十分有用。

Vite 也支持多个 `.html` 作入口点的 [多页面应用模式](./build#multi-page-app)。

#### 指定替代根目录 {#specifying-alternative-root}

执行 `vite` 命令会以当前工作目录作为根目录启动开发服务器。你也可以通过 `vite serve some/sub/dir` 来指定一个不同的根目录。
需要注意的是，Vite 也会在项目的根目录中寻找 [它的配置文件（即 `vite.config.js`）](/config/#configuring-vite)，所以如果更改了根目录，你需要将配置文件一起移动过去。

## 命令行界面 {#command-line-interface}

在安装了 Vite 的项目中，可以在 npm scripts 中使用 `vite` 可执行文件，或者直接使用 `npx vite` 运行它。下面是通过脚手架创建的 Vite 项目中默认的 npm scripts：

<!-- prettier-ignore -->
```json [package.json]
{
  "scripts": {
    "dev": "vite", // 启动开发服务器，别名：`vite dev`，`vite serve`
    "build": "vite build", // 为生产环境构建产物
    "preview": "vite preview" // 本地预览生产构建产物
  }
}
```

可以指定额外的命令行选项，如 `--port` 或 `--open`。运行 `npx vite --help` 获得完整的命令行选项列表。

查看 [命令行界面](./cli.md) 了解更多细节。

## 使用未发布的功能 {#using-unreleased-commits}

如果你迫不及待想要体验最新的功能，可以自行克隆 [vite 仓库](https://github.com/vitejs/vite) 到本地机器上然后自行将其链接（将需要 [pnpm](https://pnpm.io/)）：

```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # 在这一步中可使用你喜欢的包管理器
```

然后，回到你的 Vite 项目并运行 `pnpm link --global vite`（或者使用你的其他包管理工具来全局链接 `vite`）。重新启动开发服务器来体验新功能吧！

## 社区 {#community}

如果你有疑问或者需要帮助，可以到 [Discord](https://chat.vite.dev) 和 [GitHub Discussions](https://github.com/vitejs/vite/discussions) 社区来寻求帮助。
