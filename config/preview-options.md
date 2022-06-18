# Preview Options

## preview.host

- **Type:** `string | boolean`
- **Default:** [`server.host`](./server-options#server-host)

Specify which IP addresses the server should listen on.
Set this to `0.0.0.0` or `true` to listen on all addresses, including LAN and public addresses.

This can be set via the CLI using `--host 0.0.0.0` or `--host`.

::: tip NOTE

There are cases when other servers might respond instead of Vite.
See [`server.host`](./server-options#server-host) for more details.

:::

## preview.port

- **Type:** `number`
- **Default:** `4173`

Specify server port. Note if the port is already being used, Vite will automatically try the next available port so this may not be the actual port the server ends up listening on.

**Example:**

```js
export default defineConfig({
  server: {
    port: 3030
  },
  preview: {
    port: 8080
  }
})
```

## preview.strictPort

- **Type:** `boolean`
- **Default:** [`server.strictPort`](./server-options#server-strictport)

Set to `true` to exit if port is already in use, instead of automatically try the next available port.

## preview.https

- **Type:** `boolean | https.ServerOptions`
- **Default:** [`server.https`](./server-options#server-https)

Enable TLS + HTTP/2. Note this downgrades to TLS only when the [`server.proxy` option](./server-options#server-proxy) is also used.

The value can also be an [options object](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) passed to `https.createServer()`.

## preview.open

- **Type:** `boolean | string`
- **Default:** [`server.open`](./server-options#server_open)

Automatically open the app in the browser on server start. When the value is a string, it will be used as the URL's pathname. If you want to open the server in a specific browser you like, you can set the env `process.env.BROWSER` (e.g. `firefox`). See [the `open` package](https://github.com/sindresorhus/open#app) for more details.

## preview.proxy

- **Type:** `Record<string, string | ProxyOptions>`
- **Default:** [`server.proxy`](./server-options#server_proxy)

Configure custom proxy rules for the dev server. Expects an object of `{ key: options }` pairs. If the key starts with `^`, it will be interpreted as a `RegExp`. The `configure` option can be used to access the proxy instance.

Uses [`http-proxy`](https://github.com/http-party/node-http-proxy). Full options [here](https://github.com/http-party/node-http-proxy#options).

## preview.cors

- **Type:** `boolean | CorsOptions`
- **Default:** [`server.cors`](./server-options#server_proxy)

Configure CORS for the dev server. This is enabled by default and allows any origin. Pass an [options object](https://github.com/expressjs/cors) to fine tune the behavior or `false` to disable.
