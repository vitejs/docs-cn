# Server Options

## server.host

- **Type:** `string | boolean`
- **Default:** `'localhost'`

Specify which IP addresses the server should listen on.
Set this to `0.0.0.0` or `true` to listen on all addresses, including LAN and public addresses.

This can be set via the CLI using `--host 0.0.0.0` or `--host`.

::: tip NOTE

There are cases when other servers might respond instead of Vite.

The first case is when `localhost` is used. Node.js below v17 reorders the result of DNS-resolved address by default. When accessing `localhost`, browsers use DNS to resolve the address and that address might differ from the address which Vite is listening.

You could set [`dns.setDefaultResultOrder('verbatim')`](https://nodejs.org/docs/latest-v18.x/api/dns.html#dnssetdefaultresultorderorder) to disable the reordering behavior. Or you could set `server.host` to `127.0.0.1` explicitly.

```js
// vite.config.js
import { defineConfig } from 'vite'
import dns from 'dns'

dns.setDefaultResultOrder('verbatim')

export default defineConfig({
  // omit
})
```

The second case is when wildcard hosts (e.g. `0.0.0.0`) is used. This is because servers listening on non-wildcard hosts take priority over those listening on wildcard hosts.

:::

## server.port

- **Type:** `number`
- **Default:** `5173`

Specify server port. Note if the port is already being used, Vite will automatically try the next available port so this may not be the actual port the server ends up listening on.

## server.strictPort

- **Type:** `boolean`

Set to `true` to exit if port is already in use, instead of automatically try the next available port.

## server.https

- **Type:** `boolean | https.ServerOptions`

Enable TLS + HTTP/2. Note this downgrades to TLS only when the [`server.proxy` option](#server-proxy) is also used.

The value can also be an [options object](https://nodejs.org/api/https.html#https_https_createserver_options_requestlistener) passed to `https.createServer()`.

## server.open

- **Type:** `boolean | string`

Automatically open the app in the browser on server start. When the value is a string, it will be used as the URL's pathname. If you want to open the server in a specific browser you like, you can set the env `process.env.BROWSER` (e.g. `firefox`). See [the `open` package](https://github.com/sindresorhus/open#app) for more details.

**Example:**

```js
export default defineConfig({
  server: {
    open: '/docs/index.html'
  }
})
```

## server.proxy

- **Type:** `Record<string, string | ProxyOptions>`

Configure custom proxy rules for the dev server. Expects an object of `{ key: options }` pairs. If the key starts with `^`, it will be interpreted as a `RegExp`. The `configure` option can be used to access the proxy instance.

Uses [`http-proxy`](https://github.com/http-party/node-http-proxy). Full options [here](https://github.com/http-party/node-http-proxy#options).

In some cases, you might also want to configure the underlying dev server (e.g. to add custom middlewares to the internal [connect](https://github.com/senchalabs/connect) app). In order to do that, you need to write your own [plugin](/guide/using-plugins.html) and use [configureServer](/guide/api-plugin.html#configureserver) function.

**Example:**

```js
export default defineConfig({
  server: {
    proxy: {
      // string shorthand
      '/foo': 'http://localhost:4567',
      // with options
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      // with RegEx
      '^/fallback/.*': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fallback/, '')
      },
      // Using the proxy instance
      '/api': {
        target: 'http://jsonplaceholder.typicode.com',
        changeOrigin: true,
        configure: (proxy, options) => {
          // proxy will be an instance of 'http-proxy'
        }
      },
      // Proxying websockets or socket.io
      '/socket.io': {
        target: 'ws://localhost:5173',
        ws: true
      }
    }
  }
})
```

## server.cors

- **Type:** `boolean | CorsOptions`

Configure CORS for the dev server. This is enabled by default and allows any origin. Pass an [options object](https://github.com/expressjs/cors) to fine tune the behavior or `false` to disable.

## server.headers

- **Type:** `OutgoingHttpHeaders`

Specify server response headers.

## server.hmr

- **Type:** `boolean | { protocol?: string, host?: string, port?: number, path?: string, timeout?: number, overlay?: boolean, clientPort?: number, server?: Server }`

Disable or configure HMR connection (in cases where the HMR websocket must use a different address from the http server).

Set `server.hmr.overlay` to `false` to disable the server error overlay.

`clientPort` is an advanced option that overrides the port only on the client side, allowing you to serve the websocket on a different port than the client code looks for it on. Useful if you're using an SSL proxy in front of your dev server.

If specifying `server.hmr.server`, Vite will process HMR connection requests through the provided server. If not in middleware mode, Vite will attempt to process HMR connection requests through the existing server. This can be helpful when using self-signed certificates or when you want to expose Vite over a network on a single port.

## server.watch

- **Type:** `object`

File system watcher options to pass on to [chokidar](https://github.com/paulmillr/chokidar#api).

When running Vite on Windows Subsystem for Linux (WSL) 2, if the project folder resides in a Windows filesystem, you'll need to set this option to `{ usePolling: true }`. This is due to [a WSL2 limitation](https://github.com/microsoft/WSL/issues/4739) with the Windows filesystem.

The Vite server watcher skips `.git/` and `node_modules/` directories by default. If you want to watch a package inside `node_modules/`, you can pass a negated glob pattern to `server.watch.ignored`. That is:

```js
export default defineConfig({
  server: {
    watch: {
      ignored: ['!**/node_modules/your-package-name/**']
    }
  },
  // The watched package must be excluded from optimization,
  // so that it can appear in the dependency graph and trigger hot reload.
  optimizeDeps: {
    exclude: ['your-package-name']
  }
})
```

## server.middlewareMode

- **Type:** `boolean`
- **Default:** `false`

Create Vite server in middleware mode.

- **Related:** [appType](./shared-options#apptype), [SSR - Setting Up the Dev Server](/guide/ssr#setting-up-the-dev-server)

- **Example:**

```js
const express = require('express')
const { createServer: createViteServer } = require('vite')

async function createServer() {
  const app = express()

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom' // don't include Vite's default HTML handling middlewares
  })
  // Use vite's connect instance as middleware
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // Since `appType` is `'custom'`, should serve response here.
    // Note: if `appType` is `'spa'` or `'mpa'`, Vite includes middlewares to handle
    // HTML requests and 404s so user middlewares should be added
    // before Vite's middlewares to take effect instead
  })
}

createServer()
```

## server.base

- **Type:** `string | undefined`

Prepend this folder to http requests, for use when proxying vite as a subfolder. Should start and end with the `/` character.

## server.fs.strict

- **Type:** `boolean`
- **Default:** `true` (enabled by default since Vite 2.7)

Restrict serving files outside of workspace root.

## server.fs.allow

- **Type:** `string[]`

Restrict files that could be served via `/@fs/`. When `server.fs.strict` is set to `true`, accessing files outside this directory list that aren't imported from an allowed file will result in a 403.

Vite will search for the root of the potential workspace and use it as default. A valid workspace met the following conditions, otherwise will fallback to the [project root](/guide/#index-html-and-project-root).

- contains `workspaces` field in `package.json`
- contains one of the following file
  - `lerna.json`
  - `pnpm-workspace.yaml`

Accepts a path to specify the custom workspace root. Could be a absolute path or a path relative to [project root](/guide/#index-html-and-project-root). For example:

```js
export default defineConfig({
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
    }
  }
})
```

When `server.fs.allow` is specified, the auto workspace root detection will be disabled. To extend the original behavior, a utility `searchForWorkspaceRoot` is exposed:

```js
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
  server: {
    fs: {
      allow: [
        // search up for workspace root
        searchForWorkspaceRoot(process.cwd()),
        // your custom rules
        '/path/to/custom/allow'
      ]
    }
  }
})
```

## server.fs.deny

- **Type:** `string[]`

Blocklist for sensitive files being restricted to be served by Vite dev server.

Default to `['.env', '.env.*', '*.{pem,crt}']`.

## server.origin

- **Type:** `string`

Defines the origin of the generated asset URLs during development.

```js
export default defineConfig({
  server: {
    origin: 'http://127.0.0.1:8080'
  }
})
```
