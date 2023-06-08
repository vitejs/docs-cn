# 故障排除 {#troubleshooting}

> 你还可以查看 [Rollup 的故障排除指南](https://rollupjs.org/troubleshooting/) 了解更多。

如果这里的建议并未帮助到你，请将你的问题发送到 [GitHub 讨论区](https://github.com/vitejs/vite/discussions) 或 [Vite Land Discord](https://chat.vitejs.dev) 的 `#help` 频道。

## CLI {#cli}

### `Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'` {#error-cannot-find-module-cfoobarbazvitebinvitejs}

你的项目文件夹路径中可能包含了符号 `&`，这在 Windows 上无法与 `npm` 配合正常工作 ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45))。

你可以选择以下两种修改方式：

- 切换另一种包管理工具（例如 `pnpm` 或 `yarn`）
- 从你的项目路径中移除符号 `&`

<<<<<<< HEAD
## 开发服务器 {#dev-server}
=======
## Config

### This package is ESM only

When importing a ESM only package by `require`, the following error happens.

> Failed to resolve "foo". This package is ESM only but it was tried to load by `require`.

> "foo" resolved to an ESM file. ESM file cannot be loaded by `require`.

ESM files cannot be loaded by [`require`](<https://nodejs.org/docs/latest-v18.x/api/esm.html#require:~:text=Using%20require%20to%20load%20an%20ES%20module%20is%20not%20supported%20because%20ES%20modules%20have%20asynchronous%20execution.%20Instead%2C%20use%20import()%20to%20load%20an%20ES%20module%20from%20a%20CommonJS%20module.>).

We recommend converting your config to ESM by either:

- adding `"type": "module"` to the nearest `package.json`
- renaming `vite.config.js`/`vite.config.ts` to `vite.config.mjs`/`vite.config.mts`

## Dev Server
>>>>>>> 334f84ab655867a1a1b2e2f97fcf2210f51e5b67

### 请求始终停滞 {#requests-are-stalled-forever}

如果你使用的是 Linux，文件描述符限制和 inotify 限制可能会导致这个问题。由于 Vite 不会打包大多数文件，浏览器可能会请求许多文件，而相应地需要许多文件描述符，因此超过了限制。

要解决这个问题：

- 使用 `ulimit` 增加文件描述符的限制

  ```shell
  # 查看当前限制值
  $ ulimit -Sn
  # （暂时）更改限制值
  $ ulimit -Sn 10000 # 你可能也需要更改硬性限制值
  # 重启你的浏览器
  ```

- 通过 `sysctl` 提升下列 inotify 相关的限制

  ```shell
  # 查看当前限制值
  $ sysctl fs.inotify
  # （暂时）更改限制值
  $ sudo sysctl fs.inotify.max_queued_events=16384
  $ sudo sysctl fs.inotify.max_user_instances=8192
  $ sudo sysctl fs.inotify.max_user_watches=524288
  ```

如果通过以上步骤仍不起作用，可以尝试在以下文件中添加 `DefaultLimitNOFILE=65536` 配置。

- /etc/systemd/system.conf
- /etc/systemd/user.conf

对于 Ubuntu Linux 操作系统，你可能需要添加一行 `* - nofile 65536` 到文件 `/etc/security/limits.conf` 之中，而不是更新 systemd 配置文件。

请注意，这些配置会持久作用，但需要 **重新启动**。

### 网络请求停止加载 {#network-requests-stop-loading}

使用自签名SSL证书时，Chrome 会忽略所有缓存指令并重新加载内容。而 Vite 依赖于这些缓存指令。

要解决此问题，请使用受信任的SSL证书。

请查看：[缓存问题](https://helpx.adobe.com/mt/experience-manager/kb/cache-problems-on-chrome-with-SSL-certificate-errors.html) 和相关的 [Chrome issue](https://bugs.chromium.org/p/chromium/issues/detail?id=110649#c8)

#### macOS

您可以使用以下命令通过 CLI 安装受信任的证书：

```
security add-trusted-cert -d -r trustRoot -k ~/Library/Keychains/login.keychain-db your-cert.cer
```

或者，通过将其导入 Keychain Access 应用程序并将您的证书的信任更新为“始终信任”。

### 431 Request Header Fields Too Large {#431-request-header-fields-too-large}

当服务器或 WebSocket 服务收到一个较大的 HTTP 头，该请求可能会被遗落并且会显示下面这样的警告。

> Server responded with status code 431. See https://vitejs.dev/guide/troubleshooting.html#_431-request-header-fields-too-large.

这是由于 Node.js 限制请求头大小，以减轻 [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121) 的影响。

要避免这个问题，请尝试减小请求头大小。举个例子，如果 cookie 太长，请删除它。或者你可以使用 [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize) 来更改最大请求头大小。

## HMR {#hmr}

### Vite 检测到文件变化，但 HMR 不工作 {#vite-detects-a-file-change-but-the-hmr-is-not-working}

你可能导入了一个拥有不同大小写的文件，例如，存在 `src/foo.js` 文件而 `src/bar.js` 导入了它：

```js
import './Foo.js' // 应该为 './foo.js'
```

相关 issue：[#964](https://github.com/vitejs/vite/issues/964)

### Vite 没有检测到文件变化 {#vite-does-not-detect-a-file-change}

如果你正在 WSL2 中运行 Vite，Vite 无法在某些场景下监听文件变化。请查看 [`server.watch` 选项](/config/server-options.md#server-watch) 的描述。

### 完全重新加载了，而不是 HMR {#a-full-reload-happens-instead-of-hmr}

如果 HMR 不是由 Vite 或一个插件处理的，那么将进行完全的重新加载。

同时如果有依赖环，也会发生完全重载。要解决这个问题，请先尝试解决依赖循环。

### 控制台中大量热更新 {#high-number-of-hmr-updates-in-console}

This can be caused by a circular dependency. To solve this, try breaking the loop.

## 构建 {#build}

### 构建产物因为 CORS 错误无法工作 {#built-file-does-not-work-because-of-cors-error}

如果导出的 HTML 文件是通过 `file` 协议打开的，那么其中的 script 将不会运行，且报告下列错误。

> Access to script at 'file:///foo/bar.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///foo/bar.js. (Reason: CORS request not http).

请查看 [释因：CORS 请求不是 HTTP 请求 - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp) 了解为什么会发生这种情况的更多信息。

你需要通过 `http` 协议访问该文件。最简单的办法就是使用 `npx vite preview`。

## 优化依赖 {#optimize-dependencies}

### 链接本地包时过期预构建依赖项 {#outdated-pre-bundled-deps-when-linking-to-a-local-package}

在 Vite 中通过一个哈希值来决定优化后的依赖项是否有效，这个值取决于包锁定的内容、应用于依赖项的补丁以及 Vite 配置文件中影响 node_modules 打包的选项。这意味着，当使用像 [npm overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides) 这样的功能覆盖依赖项时，Vite 将检测到，并在下一次服务器启动时重新打包您的依赖项。当您使用像 [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link) 这样的功能时，Vite 不会使依赖项无效。如果您链接或取消链接一个依赖项，那么您需要使用 `vite --force` 在下一次服务器启动时强制重新预构建。我们建议使用 overrides，它们现在被每个包管理器所支持（还可以参见 [pnpm overrides](https://pnpm.io/package_json#pnpmoverrides) 和 [yarn resolutions](https://yarnpkg.com/configuration/manifest/#resolutions)）。

## 其他 {#others}

### Module externalized for browser compatibility {#module-externalized-for-browser-compatibility}

当你在浏览器中使用一个 Node.js 模块时，Vite 会输出以下警告：

> Module "fs" has been externalized for browser compatibility. Cannot access "fs.readFile" in client code.

这是因为 Vite 不会自动 polyfill Node.js 的内建模块。

我们推荐你不要再浏览器中使用 Node.js 模块以减小包体积，尽管你可以为其手动添加 polyfill。如果该模块是被某个第三方库（这里意为某个在浏览器中使用的库）导入的，则建议向对应库提交一个 issue。

### Syntax Error / Type Error {#syntax-error-type-error-happens}

Vite 无法处理、也不支持仅可在非严格模式（sloppy mode）下运行的代码。这是因为 Vite 使用了 ESM 并且始终在 ESM 中使用 [严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)。

例如，你可能会看到以下错误。

> [ERROR] With statements cannot be used with the "esm" output format due to strict mode

> TypeError: Cannot create property 'foo' on boolean 'false'

如果这些代码是在依赖中被使用的，你应该使用 [`patch-package`](https://github.com/ds300/patch-package)（或者 [`yarn patch`](https://yarnpkg.com/cli/patch)、[`pnpm patch`](https://pnpm.io/cli/patch) 工具）来做短期补丁处理。

### 浏览器扩展程序 {#browser-extensions}

<<<<<<< HEAD
一些浏览器扩展程序（例如 ad-blockers 广告拦截器），可能会阻止 Vite 客户端向 Vite 开发服务器发送请求。在这种情况下，你可能会看到一个空白屏且没有错误日志。如果遇到这类问题，请尝试禁用扩展程序。

### Windows 上的跨驱动器链接 {#cross-drive-links-on-windows}

如果你的项目中存在跨驱动器链接，Vite 可能无法工作。

跨驱动器链接的一个例子是：

- 通过 `subst` 命令将虚拟驱动器链接到一个文件夹
- 通过 `mklink` 命令将符号链接/联接到另一个驱动器（例如 Yarn 全局缓存）

相关 issue：[#10802](https://github.com/vitejs/vite/issues/10802)
=======
Some browser extensions (like ad-blockers) may prevent the Vite client from sending requests to the Vite dev server. You may see a white screen without logged errors in this case. Try disabling extensions if you have this issue.

### Cross drive links on Windows

If there's a cross drive links in your project on Windows, Vite may not work.

An example of cross drive links are:

- a virtual drive linked to a folder by `subst` command
- a symlink/junction to a different drive by `mklink` command (e.g. Yarn global cache)

Related issue: [#10802](https://github.com/vitejs/vite/issues/10802)
>>>>>>> 334f84ab655867a1a1b2e2f97fcf2210f51e5b67
