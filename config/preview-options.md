# 预览选项 {#preview-options}

除非另有说明，本节中的选项仅适用于预览。

## preview.host

- **类型：** `string | boolean`
- **默认：** [`server.host`](./server-options#server-host)

为开发服务器指定 ip 地址。
设置为 `0.0.0.0` 或 `true` 会监听所有地址，包括局域网和公共地址。

还可以通过 CLI 进行设置，使用 `--host 0.0.0.0` 或 `--host`。

::: tip 注意

在某些情况下，可能响应的是其他服务器而不是 Vite。
查看 [`server.host`](./server-options#server-host) 了解更多细节。

:::

## preview.port {#preview-port}

- **类型：** `number`
- **默认：** `4173`

指定开发服务器端口。注意，如果设置的端口已被使用，Vite 将自动尝试下一个可用端口，所以这可能不是最终监听的服务器端口。

**示例：**

```js
export default defineConfig({
  server: {
    port: 3030,
  },
  preview: {
    port: 8080,
  },
})
```

## preview.strictPort {#preview-strictport}

- **类型：** `boolean`
- **默认：** [`server.strictPort`](./server-options#server-strictport)

设置为 `true` 时，如果端口已被使用，则直接退出，而不会再进行后续端口的尝试。

## preview.https {#preview-https}

- **类型：** `https.ServerOptions`
- **默认：** [`server.https`](./server-options#server-https)

启用 TLS + HTTP/2。注意，只有在与 [`server.proxy` 选项](./server-options#server-proxy) 同时使用时，才会降级为 TLS。

该值也可以传递给 `https.createServer()` 的 [options 对象](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener)。

## preview.open {#preview-open}

- **类型：** `boolean | string`
- **默认：** [`server.open`](./server-options#server-open)

开发服务器启动时，自动在浏览器中打开应用程序。当该值为字符串时，它将被用作 URL 的路径名。如果你想在你喜欢的某个浏览器打开该开发服务器，你可以设置环境变量 `process.env.BROWSER` （例如 `firefox`）。欲了解更多细节，请参阅 [`open` 包的源码](https://github.com/sindresorhus/open#app)。

`BROWSER` 和 `BROWSER_ARGS` 是两个特殊的环境变量，你可以在 `.env` 文件中设置它们用以配置本选项。查看 [`open` 这个包](https://github.com/sindresorhus/open#app) 了解更多详情。

## preview.proxy {#preview-proxy}

- **类型：** `Record<string, string | ProxyOptions>`
- **默认：** [`server.proxy`](./server-options#server-proxy)

为开发服务器配置自定义代理规则。其值的结构为 `{ key: options }` 的对象。如果 key 以 `^` 开头，它将被识别为 `RegExp`，其中 `configure` 选项可用于访问代理实例。

基于 [`http-proxy`](https://github.com/http-party/node-http-proxy) 实现，完整的参数列表参见 [此链接](https://github.com/http-party/node-http-proxy#options)。

## preview.cors {#preview-cors}

- **类型：** `boolean | CorsOptions`
- **默认：** [`server.cors`](./server-options#server-cors)

为开发服务器配置 CORS。此功能默认启用并支持任何来源。可传递一个 [options 对象](https://github.com/expressjs/cors#configuration-options) 来进行配置，或者传递 `false` 来禁用此行为。

## preview.headers {#preview-headers}

- **类型：** `OutgoingHttpHeaders`

指明服务器返回的响应头。
