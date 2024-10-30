# 开发服务器选项 {#server-options}

除非另有说明，本节中的选项仅适用于开发环境。

## server.host

- **类型：** `string | boolean`
- **默认：** `'localhost'`

指定服务器应该监听哪个 IP 地址。
如果将此设置为 `0.0.0.0` 或者 `true` 将监听所有地址，包括局域网和公网地址。

也可以通过 CLI 使用 `--host 0.0.0.0` 或 `--host` 来设置。

::: tip NOTE

在某些情况下，可能响应的是其他服务器而不是 Vite。

第一种情况是 `localhost` 被使用了。Node.js 在 v17 以下版本中默认会对 DNS 解析地址的结果进行重新排序。当访问 `localhost` 时，浏览器使用 DNS 来解析地址，这个地址可能与 Vite 正在监听的地址不同。当地址不一致时，Vite 会打印出来。

你可以设置 [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/api/dns.html#dns_dns_setdefaultresultorder_order) 来禁用这个重新排序的行为。Vite 会将地址打印为 `localhost`。

```js twoslash [vite.config.js]
import { defineConfig } from 'vite'
import dns from 'node:dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  // omit
})
```

第二种情况是使用了通配主机地址（例如 `0.0.0.0`）。这是因为侦听非通配符主机的服务器优先于侦听通配符主机的服务器。

:::

::: tip 在 WSL2 中通过 LAN 访问开发服务器

当你在 WSL2 运行 Vite 时，仅设置 `host: true` 来从局域网访问服务器是不够的。
请看 [WSL 相关文档](https://learn.microsoft.com/en-us/windows/wsl/networking#accessing-a-wsl-2-distribution-from-your-local-area-network-lan) 了解更多细节。

:::

## server.port {#server-port}

- **类型：** `number`
- **默认值：** `5173`

指定开发服务器端口。注意：如果端口已经被使用，Vite 会自动尝试下一个可用的端口，所以这可能不是开发服务器最终监听的实际端口。

## server.strictPort {#server-strictport}

- **类型：** `boolean`

设为 `true` 时若端口已被占用则会直接退出，而不是尝试下一个可用端口。

## server.https {#server-https}

- **类型：** `https.ServerOptions`

启用 TLS + HTTP/2。注意：当 [`server.proxy` 选项](#server-proxy) 也被使用时，将会仅使用 TLS。

这个值也可以是一个传递给 `https.createServer()` 的 [选项对象](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)。

需要一个合法可用的证书。对基本使用的配置需求来说，你可以添加 [@vitejs/plugin-basic-ssl](https://github.com/vitejs/vite-plugin-basic-ssl) 到项目插件中，它会自动创建和缓存一个自签名的证书。但我们推荐你创建和使用你自己的证书。

## server.open {#server-open}

- **类型：** `boolean | string`

开发服务器启动时，自动在浏览器中打开应用程序。当该值为字符串时，它将被用作 URL 的路径名。如果你想在你喜欢的某个浏览器打开该开发服务器，你可以设置环境变量 `process.env.BROWSER` （例如 `firefox`）。你还可以设置 `process.env.BROWSER_ARGS` 来传递额外的参数（例如 `--incognito`）。

`BROWSER` 和 `BROWSER_ARGS` 都是特殊的环境变量，你可以将它们放在 `.env` 文件中进行设置，欲了解更多打开浏览器的更多内部细节，请参阅 [`open` 包的源码](https://github.com/sindresorhus/open#app)。

**示例：**

```js
export default defineConfig({
  server: {
    open: '/docs/index.html',
  },
})
```

## server.proxy {#server-proxy}

- **类型：** `Record<string, string | ProxyOptions>`

为开发服务器配置自定义代理规则。期望接收一个 `{ key: options }` 对象。任何请求路径以 key 值开头的请求将被代理到对应的目标。如果 key 值以 `^` 开头，将被识别为 `RegExp`。`configure` 选项可用于访问 proxy 实例。如果请求匹配任何配置的代理规则，该请求将不会被 Vite 转换。

请注意，如果使用了非相对的 [基础路径 `base`](/config/shared-options.md#base)，则必须在每个 key 值前加上该 `base`。

继承自 [`http-proxy`](https://github.com/http-party/node-http-proxy#options)。完整选项详见 [此处](https://github.com/vitejs/vite/blob/main/packages/vite/src/node/server/middlewares/proxy.ts#L13)。

在某些情况下，你可能也想要配置底层的开发服务器。（例如添加自定义的中间件到内部的 [connect](https://github.com/senchalabs/connect) 应用中）为了实现这一点，你需要编写你自己的 [插件](/guide/using-plugins.html) 并使用 [configureServer](/guide/api-plugin.html#configureserver) 函数。

**示例：**

```js
export default defineConfig({
  server: {
    proxy: {
      // 字符串简写写法：http://localhost:5173/foo -> http://localhost:4567/foo
      '/foo': 'http://localhost:4567',
      // 带选项写法：http://localhost:5173/api/bar -> http://jsonplaceholder.typicode.com/bar
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // 正则表达式写法：http://localhost:5173/fallback/ -> http://jsonplaceholder.typicode.com/
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, ''),
      },
      // 使用 proxy 实例
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy 是 'http-proxy' 的实例
        }
      },
      // 代理 websockets 或 socket.io 写法：ws://localhost:5173/socket.io -> ws://localhost:5174/socket.io
      // 在使用 `rewriteWsOrigin` 时要特别谨慎，因为这可能会让代理服务器暴露在 CSRF 攻击之下
      '/socket.io': {
        target: 'ws://localhost:5174',
        ws: true,
        rewriteWsOrigin: true,
      },
    },
  },
})
```

## server.cors {#server-cors}

- **类型：** `boolean | CorsOptions`

为开发服务器配置 CORS。默认启用并允许任何源，传递一个 [选项对象](https://github.com/expressjs/cors#configuration-options) 来调整行为或设为 `false` 表示禁用。

## server.headers {#server-headers}

- **类型：** `OutgoingHttpHeaders`

指定服务器响应的 header。

## server.hmr {#server-hmr}

- **类型：** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

禁用或配置 HMR 连接（用于 HMR websocket 必须使用不同的 http 服务器地址的情况）。

设置 `server.hmr.overlay` 为 `false` 可以禁用开发服务器错误的屏蔽。

`protocol` 是用于设置 HMR 连接使用的 WebSocket 协议的选项，可以是 `ws`（WebSocket）或者 `wss`（WebSocket Secure）。

`clientPort` 是一个高级选项，只在客户端的情况下覆盖端口，这允许你为 websocket 提供不同的端口，而并非在客户端代码中查找。如果需要在 dev-server 情况下使用 SSL 代理，这非常有用。

当 `server.hmr.server` 被定义后，Vite 将会通过所提供的的服务器来处理 HMR 连接。如果不是在中间件模式下，Vite 将尝试通过已有服务器处理 HMR 连接。这在使用自签证书或想通过网络在某端口暴露 Vite 的情况下，非常有用。

查看 [`vite-setup-catalogue`](https://github.com/sapphi-red/vite-setup-catalogue) 一节获取更多实例。

::: tip NOTE

在默认配置下, 在 Vite 之前的反向代理应该支持代理 WebSocket。如果 Vite HMR 客户端连接 WebSocket 失败，该客户端将兜底为绕过反向代理、直接连接 WebSocket 到 Vite HMR 服务器：

```
Direct websocket connection fallback. Check out https://vite.dev/config/server-options.html#server-hmr to remove the previous connection error.
```

当该兜底策略偶然地可以被忽略时，这条报错将会出现在浏览器中。若要通过直接绕过反向代理来避免此错误，你可以:

- 将反向代理配置为代理 WebSocket
- 设置 [`server.strictPort = true`](#server-strictport) 并设置 `server.hmr.clientPort` 的值与 `server.port` 相同
- 设置 `server.hmr.port` 为一个与 [`server.port`](#server-port) 不同的值

:::

## server.warmup

- **类型：** `{ clientFiles?: string[], ssrFiles?: string[] }`
- **相关：** [预热常用文件](/guide/performance.html#warm-up-frequently-used-files)

提前转换和缓存文件以进行预热。可以在服务器启动时提高初始页面加载速度，并防止转换瀑布。

`clientFiles` 是仅在客户端使用的文件，而 `ssrFiles` 是仅在服务端渲染中使用的文件。它们接受相对于 `root` 的文件路径数组或 [`tinyglobby`](https://github.com/SuperchupuDev/tinyglobby) 模式。

请确保只添加经常使用的文件，以免在启动时过载 Vite 开发服务器。

```js
export default defineConfig({
  server: {
    warmup: {
      clientFiles: ['./src/components/*.vue', './src/utils/big-utils.js'],
      ssrFiles: ['./src/server/modules/*.js'],
    },
  },
})
```

## server.watch {#server-watch}

- **类型：** `object | null`

传递给 [chokidar](https://github.com/paulmillr/chokidar#getting-started) 的文件系统监听器选项。如果传递了 `ignored` 选项，Vite 还会自动将任何字符串转换为 [picomatch 模式](https://github.com/micromatch/picomatch#globbing-features)。

Vite 服务器的文件监听器默认会监听 `root` 目录，同时会跳过 `.git/`、`node_modules/`，以及 Vite 的 `cacheDir` 和 `build.outDir` 这些目录。当监听到文件更新时，Vite 会应用 HMR 并且只在需要时更新页面。

如果设置为 `null`，`server.watcher` 将不会监听任何文件，并且调用 `add` 将不起作用。

::: warning 监听 `node_modules` 中的文件

目前没有可行的方式来监听 `node_modules` 中的文件。若要了解更多详情和可能的临时替代方案，你可以关注 [issue #8619](https://github.com/vitejs/vite/issues/8619)。

:::

::: warning 在 Windows Linux 子系统（WSL）上使用 Vite

当需要在 Windows Subsystem for Linux (WSL) 2 上运行 Vite 时，如果项目文件夹位于 Windows 文件系统中，你需要将此选项设置为 `{ usePolling: true }`。这是由于 Windows 文件系统的 [WSL2 限制](https://github.com/microsoft/WSL/issues/4739) 造成的。

要解决这一问题，你可以采取以下两种办法之一：

- **推荐**：使用 WSL2 应用来编辑你的文件
  - 同时我们推荐将你的项目移出 Windows 文件系统，从 WSL2 访问 Windows 文件系统非常慢。移除这一开销将大大提升性能表现。
- 设置 `{ usePolling: true }`
  - 注意 [`usePolling` 会导致高 CPU 占用率](https://github.com/paulmillr/chokidar#performance)

:::

## server.middlewareMode {#server-middlewaremode}

- **类型：** `'ssr' | 'html'`
- **默认值：** `false`

以中间件模式创建 Vite 服务器。

- **相关：** [appType](./shared-options#apptype)，[SSR - 设置开发服务器](/guide/ssr#setting-up-the-dev-server)

- **示例：**

```js twoslash
import express from 'express'
import { createServer as createViteServer } from 'vite'

async function createServer() {
  const app = express()

  // 以中间件模式创建 Vite 服务器
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom', // 不引入 Vite 默认的 HTML 处理中间件
  })
  // 将 vite 的 connect 实例作中间件使用
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // 由于 `appType` 的值是 `'custom'`，因此应在此处提供响应。
    // 请注意：如果 `appType` 值为 `'spa'` 或 `'mpa'`，Vite 会包含
    // 处理 HTML 请求和 404 的中间件，因此用户中间件应该在
    // Vite 的中间件之前添加，以确保其生效。
  })
}

createServer()
```

## server.fs.strict {#server-fs-strict}

- **类型：** `boolean`
- **默认：** `true` (自 Vite 2.7 起默认启用)

限制为工作区 root 路径以外的文件的访问。

## server.fs.allow {#server-fs-allow}

- **类型：** `string[]`

限制哪些文件可以通过 `/@fs/` 路径提供服务。当 `server.fs.strict` 设置为 true 时，访问这个目录列表外的文件将会返回 403 结果。

可以提供目录和文件。

Vite 将会搜索此根目录下潜在工作空间并作默认使用。一个有效的工作空间应符合以下几个条件，否则会默认以 [项目 root 目录](/guide/#index-html-and-project-root) 作备选方案。

- 在 `package.json` 中包含 `workspaces` 字段
- 包含以下几种文件之一
  - `lerna.json`
  - `pnpm-workspace.yaml`

接受一个路径作为自定义工作区的 root 目录。可以是绝对路径或是相对于 [项目 root 目录](/guide/#index-html-and-project-root) 的相对路径。示例如下：

```js
export default defineConfig({
  server: {
    fs: {
      // 允许为项目根目录的上一级提供服务
      allow: ['..']
    }
  }
})
```

当 `server.fs.allow` 被设置时，工作区根目录的自动检索将被禁用。当需要扩展默认的行为时，你可以使用暴露出来的工具函数 `searchForWorkspaceRoot`：

```js
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        // 搜索工作区的根目录
        searchForWorkspaceRoot(process.cwd()),
        // 自定义规则
        '/path/to/custom/allow_directory',
        '/path/to/custom/allow_file.demo',
      ],
    },
  },
})
```

## server.fs.deny {#server-fs-deny}

- **类型：** `string[]`
- **默认：** `['.env', '.env.*', '*.{crt,pem}', '**/.git/**']`

用于限制 Vite 开发服务器提供敏感文件的黑名单。这会比 [`server.fs.allow`](#server-fs-allow) 选项的优先级更高。同时还支持 [picomatch 模式](https://github.com/micromatch/picomatch#globbing-features)。

## server.fs.cachedChecks

- **类型：** `boolean`
- **默认：** `false`
- **实验性**

该选项可以缓存访问过的目录的文件名，从而避免重复的文件系统操作。尤其在 Windows 系统中，这个选项可能会带来性能提升。但由于存在一些边缘情况，比如在一个已缓存的文件夹中写入文件并立即导入它，所以这个选项默认是关闭的。

## server.origin {#server-origin}

- **类型：** `string`

用于定义开发调试阶段生成资源的 origin。

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080',
  },
})
```

## server.sourcemapIgnoreList {#server-sourcemapignorelist}

- **类型：** `false | (sourcePath: string, sourcemapPath: string) => boolean`
- **默认：** `(sourcePath) => sourcePath.includes('node_modules')`

是否忽略服务器 sourcemap 中的源文件，用于填充 [`x_google_ignoreList` source map 扩展](https://developer.chrome.com/articles/x-google-ignore-list/)。

对开发服务器来说 `server.sourcemapIgnoreList` 等价于 [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist)。两个配置选项之间的区别在于，rollup 函数使用相对路径调用 `sourcePath`，而 `server.sourcemapIgnoreList` 使用绝对路径调用。在开发过程中，大多数模块的映射和源文件位于同一个文件夹中，因此 `sourcePath` 的相对路径就是文件名本身。在这些情况下，使用绝对路径更加方便。

默认情况下，它会排除所有包含 `node_modules` 的路径。你可以传递 `false` 来禁用此行为，或者为了获得完全的控制，可以传递一个函数，该函数接受源路径和 sourcemap 的路径，并返回是否忽略源路径。

```js
export default defineConfig({
  server: {
    // 这是默认值，它将把所有路径中含有 node_modules 的文件
    // 添加到忽略列表中。
    sourcemapIgnoreList(sourcePath, sourcemapPath) {
      return sourcePath.includes('node_modules')
    },
  },
})
```

::: tip 注意
需要单独设置 [`server.sourcemapIgnoreList`](#server-sourcemapignorelist) 和 [`build.rollupOptions.output.sourcemapIgnoreList`](https://rollupjs.org/configuration-options/#output-sourcemapignorelist)。`server.sourcemapIgnoreList` 是一个仅适用于服务端的配置，并不从定义好的 rollup 选项中获得其默认值。
:::
