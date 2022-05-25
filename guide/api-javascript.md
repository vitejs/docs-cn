# JavaScript API {#javascript-api}

Vite 的 JavaScript API 是完全类型化的，我们推荐使用 TypeScript 或者在 VS Code 中启用 JS 类型检查来利用智能提示和类型校验。

## `createServer` {#createserver}

**类型签名：**

```ts
async function createServer(inlineConfig?: InlineConfig): Promise<ViteDevServer>
```

**使用示例：**

```js
const { createServer } = require('vite')

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
const path = require('path')
const { build } = require('vite')

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
const { preview } = require('vite')

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
  defaultMode?: string
): Promise<ResolvedConfig>
```

The `command` value is `serve` in dev (in the cli `vite`, `vite dev`, and `vite serve` are aliases).

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
