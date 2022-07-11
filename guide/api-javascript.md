# JavaScript API {#javascript-api}

Vite 的 JavaScript API 是完全类型化的，我们推荐使用 TypeScript 或者在 VS Code 中启用 JS 类型检查来利用智能提示和类型校验。

## `createServer` {#createserver}

**类型签名：**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**使用示例：**

```js
import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  const server = await createServer({
    // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
    configFile: false,
    root: __dirname,
    server: {
      port: 1337
    }
  })
  await server.listen()

  server.printUrls()
})()
```

::: tip 注意
当在同一个 Node.js 进程中使用 `createServer` 和 `build` 时，两个函数都依赖于 `process.env.`<wbr>`NODE_ENV` 才可正常工作，而这个环境变量又依赖于 `mode` 配置项。为了避免行为冲突，请在这两个 API 传入参数 `development` 字段中设置 `process.env.`<wbr>`NODE_ENV` 或者 `mode` 配置项，或者你也可以生成另一个子进程，分别运行这两个 API。
:::

## `InlineConfig` {#inlineconfig}

`InlineConfig` 接口扩展了 `UserConfig` 并添加了以下属性：

- `configFile`：指明要使用的配置文件。如果没有设置，Vite 将尝试从项目根目录自动解析。设置为 `false` 可以禁用自动解析功能。
- `envFile`：设置为 `false` 时，则禁用 `.env` 文件。

<<<<<<< HEAD
## `ViteDevServer` {#vitedevserver}
=======
## `ResolvedConfig`

The `ResolvedConfig` interface has all the same properties of a `UserConfig`, except most properties are resolved and non-undefined. It also contains utilities like:

- `config.assetsInclude`: A function to check if an `id` is considered an asset.
- `config.logger`: Vite's internal logger object.

## `ViteDevServer`
>>>>>>> c45663aa459c9c1b02e86e4f6778ce3cb2e99378

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
   * chokidar 监听器实例
   * https://github.com/paulmillr/chokidar#api
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
   * 以代码方式解析、加载和转换 url 并获取结果
   * 而不需要通过 http 请求管道。
   */
  transformRequest(
    url: string,
    options?: TransformOptions
  ): Promise<TransformResult | null>
  /**
   * 应用 Vite 内建 HTML 转换和任意插件 HTML 转换
   */
  transformIndexHtml(url: string, html: string): Promise<string>
  /**
   * 加载一个给定的 URL 作为 SSR 的实例化模块
   */
  ssrLoadModule(
    url: string,
    options?: { fixStacktrace?: boolean }
  ): Promise<Record<string, any>>
  /**
   * 解决 ssr 错误堆栈信息
   */
  ssrFixStacktrace(e: Error): void
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
}
```

## `build` {#build}

**类型校验：**

```ts
async function build(
  inlineConfig?: InlineConfig
): Promise<RollupOutput | RollupOutput[]>
```

**使用示例：**

```js
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  await build({
    root: path.resolve(__dirname, './project'),
    base: '/foo/',
    build: {
      rollupOptions: {
        // ...
      }
    }
  })
})()
```

## `preview` {#preview}

**类型签名：**

```ts
async function preview(inlineConfig?: InlineConfig): Promise<PreviewServer>
```

**示例用法：**

```js
import { preview } from 'vite'
;(async () => {
  const previewServer = await preview({
    // 任何有效的用户配置项，将加上 `mode` 和 `configFile`
    preview: {
      port: 8080,
      open: true
    }
  })

  previewServer.printUrls()
})()
```

## `resolveConfig` {#resolveconfig}

**类型校验：**

```ts
async function resolveConfig(
  inlineConfig: InlineConfig,
  command: 'build' | 'serve',
  defaultMode = 'development'
): Promise<ResolvedConfig>
```

The `command` value is `serve` in dev (in the cli `vite`, `vite dev`, and `vite serve` are aliases).

## `mergeConfig`

**Type Signature:**

```ts
function mergeConfig(
  defaults: Record<string, any>,
  overrides: Record<string, any>,
  isRoot = true
): Record<string, any>
```

Deeply merge two Vite configs. `isRoot` represents the level within the Vite config which is being merged. For example, set `false` if you're merging two `build` options.

## `searchForWorkspaceRoot`

**Type Signature:**

```ts
function searchForWorkspaceRoot(
  current: string,
  root = searchForPackageRoot(current)
): string
```

**Related:** [server.fs.allow](/config/server-options.md#server-fs-allow)

Search for the root of the potential workspace if it meets the following conditions, otherwise it would fallback to `root`:

- contains `workspaces` field in `package.json`
- contains one of the following file
  - `lerna.json`
  - `pnpm-workspace.yaml`

## `loadEnv`

**Type Signature:**

```ts
function loadEnv(
  mode: string,
  envDir: string,
  prefixes: string | string[] = 'VITE_'
): Record<string, string>
```

**Related:** [`.env` Files](./env-and-mode.md#env-files)

Load `.env` files within the `envDir`. By default only env variables prefixed with `VITE_` are loaded, unless `prefixes` is changed.

## `normalizePath`

**Type Signature:**

```ts
function normalizePath(id: string): string
```

**Related:** [Path Normalization](./api-plugin.md#path-normalization)

Normalizes a path to interoperate between Vite plugins.

## `transformWithEsbuild`

**类型签名：**

```ts
async function transformWithEsbuild(
  code: string,
  filename: string,
  options?: EsbuildTransformOptions,
  inMap?: object
): Promise<ESBuildTransformResult>
```

Transform JavaScript or TypeScript with esbuild. Useful for plugins that prefers matching Vite's internal esbuild transform.

## `loadConfigFromFile`

**Type Signature:**

```ts
async function loadConfigFromFile(
  configEnv: ConfigEnv,
  configFile?: string,
  configRoot: string = process.cwd(),
  logLevel?: LogLevel
): Promise<{
  path: string
  config: UserConfig
  dependencies: string[]
} | null>
```

Load a Vite config file manually with esbuild.
