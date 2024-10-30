# JavaScript API {#javascript-api}

Vite 的 JavaScript API 是完全类型化的，我们推荐使用 TypeScript 或者在 VS Code 中启用 JS 类型检查来利用智能提示和类型签名。

## `createServer` {#createserver}

**类型签名：**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**使用示例：**

```ts twoslash
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

const server = await createServer({
  // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
  configFile: false,
  root: __dirname,
  server: {
    port: 1337,
  },
})
await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })
```

::: tip 注意
当在同一个 Node.js 进程中使用 `createServer` 和 `build` 时，两个函数都依赖于 `process.env.NODE_ENV` 才可正常工作，而这个环境变量又依赖于 `mode` 配置项。为了避免行为冲突，请在使用这两个 API 时为 `process.env.NODE_ENV` 或者 `mode` 配置项、字段设置参数值 `development`，或者你也可以生成另一个子进程，分别运行这两个 API。
:::

::: tip 注意
当使用 [中间件模式](/config/server-options.md#server-middlewaremode) 与 [WebSocket 代理配置](/config/server-options.md#server-proxy) 时，父 http 服务器应该在 `middlewareMode` 中提供，以正确绑定代理。

<details>
<summary>示例</summary>

```ts twoslash
import http from 'http'
import { createServer } from 'vite'

const parentServer = http.createServer() // or express, koa, etc.

const vite = await createServer({
  server: {
    // 开启中间件模式
    middlewareMode: {
      // 提供父 http 服务器以代理 WebSocket
      server: parentServer,
    },
    proxy: {
      '/ws': {
        target: 'ws://localhost:3000',
        // Proxying WebSocket
        ws: true,
      },
    },
  },
})

// @noErrors: 2339
parentServer.use(vite.middlewares)
```

</details>
:::

## `InlineConfig` {#inlineconfig}

`InlineConfig` 接口扩展了 `UserConfig` 并添加了以下属性：

- `configFile`：指明要使用的配置文件。如果没有设置，Vite 将尝试从项目根目录自动解析。设置为 `false` 可以禁用自动解析功能。
- `envFile`：设置为 `false` 时，则禁用 `.env` 文件。

## `ResolvedConfig` {#resolvedconfig}

`ResolvedConfig` 接口和 `UserConfig` 有完全相同的属性，期望多数属性是已经解析完成且不为 undefined 的。它同样包括下面这样的工具方法：

- `config.assetsInclude`：一个函数，用来检查一个 `id` 是否被考虑为是一个资源。
- `config.logger`：Vite 内部的日志对象。

## `ViteDevServer` {#vitedevserver}

```ts
interface ViteDevServer {
  /**
   * 被解析的 Vite 配置对象
   */
  config: ResolvedConfig
  /**
   * 一个 connect 应用实例
   * - 可以用于将自定义中间件附加到开发服务器。
   * - 还可以用作自定义http服务器的处理函数。
      或作为中间件用于任何 connect 风格的 Node.js 框架。
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * 本机 node http 服务器实例
   */
  httpServer: http.Server | null
  /**
   * chokidar 监听器实例。如果 `config.server.watch` 被设置为 `null`，
   * 它不会监听任何文件，并且调用 `add` 将不起作用。
   * https://github.com/paulmillr/chokidar#getting-started
   */
  watcher: FSWatcher
  /**
   * web socket 服务器，带有 `send(payload)` 方法。
   */
  ws: WebSocketServer
  /**
   * Rollup 插件容器，可以针对给定文件运行插件钩子。
   */
  pluginContainer: PluginContainer
  /**
   * 跟踪导入关系、url 到文件映射和 hmr 状态的模块图。
   */
  moduleGraph: ModuleGraph
  /**
   * Vite 在 CLI 上打印的已解析的 URL（经 URL 编码处理）。
   * 在中间件模式下或服务器未监听任何端口时，返回 `null`。
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * 编程式地解析、加载和转换一个 URL 并获得
   * 还没有进入 HTTP 请求管道中的结果
   */
  transformRequest(
    url: string,
    options?: TransformOptions,
  ): Promise<TransformResult | null>
  /**
   * 应用 Vite 内建 HTML 转换和任意插件 HTML 转换
   */
  transformIndexHtml(
    url: string,
    html: string,
    originalUrl?: string,
  ): Promise<string>
  /**
   * 加载一个给定的 URL 作为 SSR 的实例化模块
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean },
  ): Promise<Record<string, any>>
  /**
   * 解决 ssr 错误堆栈信息
   */
  ssrFixStacktrace(e: Error): void
  /**
   * 触发模块图中某个模块的 HMR。你可以使用 `server.moduleGraph`
   * API 来检索要重新加载的模块。如果 `hmr` 是 `false`，则不进行任何操作
   */
  reloadModule(module: ModuleNode): Promise<void>
  /**
   * 启动服务器
   */
  listen(port?: number, isRestart?: boolean): Promise<ViteDevServer>
  /**
   * 重启服务器
   *
   * @param forceOptimize - 强制优化器打包，和命令行内使用 --force 一致
   */
  restart(forceOptimize?: boolean): Promise<void>
  /**
   * 停止服务器
   */
  close(): Promise<void>
  /**
   * 绑定 CLI 快捷键
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<ViteDevServer>): void
  /**
   * 调用 `await server.waitForRequestsIdle(id)` 会等待所有的静态导入
   * 都被处理完。如果这个函数是从一个加载或转换的插件钩子中被调用的，那么你需要
   * 把 id 作为参数传入，以避免死锁。在模块图的第一个静态导入部分被处理之后
   * 调用这个函数，它将立即返回。
   * @实验性
   */
  waitForRequestsIdle: (ignoredId?: string) => Promise<void>
}
```

:::info
`waitForRequestsIdle` 的设计初衷是作为一种应急措施，以改善那些无法按照 Vite 开发服务器按需加载特性来实现的功能的开发体验。像 Tailwind 这样的工具可以在启动期间使用它，以便在应用代码被加载之前延迟生成应用的 CSS 类，从而避免样式的闪烁变化。当这个函数在加载或转换钩子中被使用，并且使用的是默认的 HTTP1 服务器时，六个 http 通道中的一个将被阻塞，直到服务器处理完所有的静态导入。Vite 的依赖优化器目前使用这个函数来避免在缺少依赖项时进行全页刷新，它通过延迟加载预打包的依赖项，直到从静态导入的源收集到所有的导入依赖项。在未来的主要版本中，Vite 可能会采取不同的策略，将 `optimizeDeps.crawlUntilStaticImports: false` 设置为默认值，以避免在大型应用程序在冷启动期间出现性能下降。
:::

## `build` {#build}

**类型签名：**

```ts
async function build(
  inlineConfig?: InlineConfig,
): Promise<RollupOutput | RollupOutput[]>
```

**使用示例：**

```ts twoslash [vite.config.js]
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

await build({
  root: path.resolve(__dirname, './project'),
  base: '/foo/',
  build: {
    rollupOptions: {
      // ...
    },
  },
})
```

## `preview` {#preview}

**类型签名：**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**示例用法：**

```ts twoslash
import { preview } from 'vite'

const previewServer = await preview({
  // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
  preview: {
    port: 8080,
    open: true,
  },
})

previewServer.printUrls()
previewServer.bindCLIShortcuts({ print: true })
```

## `PreviewServer`

```ts
interface PreviewServer {
  /**
   * 解析后的 vite 配置对象
   */
  config: ResolvedConfig
  /**
   * 一个 connect 应用实例。
   * - 可用作将自定义中间件附加到预览服务器上。
   * - 还可用作自定义 HTTP 服务器的处理函数
   *   或作为任何 connect 风格的 Node.js 框架的中间件
   *
   * https://github.com/senchalabs/connect#use-middleware
   */
  middlewares: Connect.Server
  /**
   * 原生 Node http 服务器实例
   */
  httpServer: http.Server
  /**
   * Vite 在 CLI 上打印的已解析的 URL（经 URL 编码处理）。
   * 在服务器未监听任何端口时，返回 `null`。
   */
  resolvedUrls: ResolvedServerUrls | null
  /**
   * 打印服务器 URL
   */
  printUrls(): void
  /**
   * 设置 CLI 快捷键
   */
  bindCLIShortcuts(options?: BindCLIShortcutsOptions<PreviewServer>): void
}
```

## `resolveConfig` {#resolveconfig}

**类型签名：**

```ts
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development',
  defaultNodeEnv = 'development',
  isPreview = false,
): Promise<ResolvedConfig>
```

该 `command` 值在开发环境和预览环境 为 `serve`，而在构建环境是 `build`。

## `mergeConfig`

**类型签名：**

```ts
function mergeConfig(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  isRoot = true,
): Record<string, any>
```

深度合并两份配置。`isRoot` 代表着 Vite 配置被合并的层级。举个例子，如果你是要合并两个 `build` 选项请设为 `false`。

::: tip NOTE
`mergeConfig` 只接受对象形式的配置。如果有一个回调形式的配置，应该在将其传递给 `mergeConfig` 之前先调用该回调函数，将其转换成对象形式。

你可以使用 `defineConfig` 工具函数将回调形式的配置与另一个配置合并：

```ts twoslash
import {
  defineConfig,
  mergeConfig,
  type UserConfigFnObject,
  type UserConfig,
} from 'vite'
declare const configAsCallback: UserConfigFnObject
declare const configAsObject: UserConfig

// ---cut---
export default defineConfig((configEnv) =>
  mergeConfig(configAsCallback(configEnv), configAsObject),
)
```

:::

## `searchForWorkspaceRoot`

**类型签名：**

```ts
function searchForWorkspaceRoot(
  current: string,
  root = searchForPackageRoot(current),
): string
```

**相关内容：** [server.fs.allow](/config/server-options.md#server-fs-allow)

如果当前工作空间满足以下条件，则搜索它的根目录，否则它将回退到 `root`：

- `package.json` 中包含 `workspaces` 字段
- 包含以下文件之一：
  - `lerna.json`
  - `pnpm-workspace.yaml`

## `loadEnv`

**类型签名：**

```ts
function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'VITE_',
): Record<string, string>
```

**相关内容：** [`.env` Files](./env-and-mode.md#env-files)

加载 `envDir` 中的 `.env` 文件。默认情况下只有前缀为 `VITE_` 会被加载，除非更改了 `prefixes` 配置。

## `normalizePath`

**类型签名：**

```ts
function normalizePath(id: string): string
```

**相关内容：** [路径规范化](./api-plugin.md#path-normalization)

规范化路径，以便在 Vite 插件之间互操作。

## `transformWithEsbuild`

**类型签名：**

```ts
async function transformWithEsbuild(
  code: string,
  filename: string,
  options?: EsbuildTransformOptions,
  inMap?: object,
): Promise<ESBuildTransformResult>
```

通过 esbuild 转换 JavaScript 或 TypeScript 文件。对于更想要匹配 Vite 内部 esbuild 转换的插件很有用。

## `loadConfigFromFile`

**类型签名：**

```ts
async function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd(),
  logLevel?: LogLevel,
  customLogger?: Logger,
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

手动通过 esbuild 加载一份 Vite 配置。

## `preprocessCSS`

- **实验性：** [提供反馈](https://github.com/vitejs/vite/discussions/13815)

**类型签名：**

```ts
async function preprocessCSS(
  code: string,
  filename: string,
  config: ResolvedConfig,
): Promise<PreprocessCSSResult>

interface PreprocessCSSResult {
  code: string
  map?: SourceMapInput
  modules?: Record<string, string>
  deps?: Set<string>
}
```

预处理 `.css`、`.scss`、`.sass`、`.less`、`.styl` 和 `.stylus` 文件，将它们转化为纯 CSS，这样就可以在浏览器中使用或者被其他工具解析了。这和 [内置的 CSS 预处理器](/guide/features#css-pre-processors) 很像，如果你使用了这个功能，则必须安装相应的预处理器。

使用哪个预处理器是根据 `filename` 的扩展名来推断的。如果 `filename` 以 `.module.{ext}` 结尾，那么它就会被推断为 [CSS module](https://github.com/css-modules/css-modules)，返回的结果会包含一个 `modules` 对象，这个对象将原始的类名映射到转换后的类名。

需要注意的是，预处理不会解析 `url()` 或 `image-set()` 中的 URL。
