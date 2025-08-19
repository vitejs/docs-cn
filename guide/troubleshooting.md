# 排错指南 {#troubleshooting}

> 你还可以查看 [Rollup 的故障排除指南](https://cn.rollupjs.org/troubleshooting/) 了解更多。

如果这里的建议并未帮助到你，请将你的问题发送到 [GitHub 讨论区](https://github.com/vitejs/vite/discussions) 或 [Vite Land Discord](https://chat.vite.dev) 的 `#help` 频道。

## CLI {#cli}

### `Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'` {#error-cannot-find-module-cfoobarbazvitebinvitejs}

你的项目文件夹路径中可能包含了符号 `&`，这在 Windows 上无法与 `npm` 配合正常工作 ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45))。

你可以选择以下两种修改方式：

- 切换另一种包管理工具（例如 `pnpm` 或 `yarn`）
- 从你的项目路径中移除符号 `&`

## 配置 {#config}

### 该包仅支持 ESM {#this-package-is-esm-only}

当使用 `require` 导入一个仅支持 ESM 的包时，会出现以下错误。

> Failed to resolve "foo". This package is ESM only but it was tried to load by `require`.

> Error [ERR_REQUIRE_ESM]: require() of ES Module /path/to/dependency.js from /path/to/vite.config.js not supported.
> Instead change the require of index.js in /path/to/vite.config.js to a dynamic import() which is available in all CommonJS modules.

在 Node.js <=22 中，ESM 文件默认情况下无法通过 [`require`](https://nodejs.org/docs/latest-v22.x/api/esm.html#require) 加载。

虽然使用 [`--experimental-require-module`](https://nodejs.org/docs/latest-v22.x/api/modules.html#loading-ecmascript-modules-using-require)、Node.js >22 或其他运行时也可能有效，但我们仍建议通过这两种方式之一将配置转换为 ESM：

- 在邻近的 `package.json` 中添加 `"type": "module"`
- 将 `vite.config.js`/`vite.config.ts` 重命名为 `vite.config.mjs`/`vite.config.mts`

## 开发服务器 {#dev-server}

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

或者，如果服务器在 VS Code devcontainer 中运行，请求可能会出现停滞。要修复此问题，请参阅
[Dev Containers / VS Code Port Forwarding](#dev-containers-vs-code-port-forwarding)。

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

### 431 Request Header Fields Too Large {#_431-request-header-fields-too-large}

当服务器或 WebSocket 服务收到一个较大的 HTTP 头，该请求可能会被遗落并且会显示下面这样的警告。

> Server responded with status code 431. See https://vite.dev/guide/troubleshooting.html#_431-request-header-fields-too-large.

这是由于 Node.js 限制请求头大小，以减轻 [CVE-2018-12121](https://www.cve.org/CVERecord?id=CVE-2018-12121) 的影响。

要避免这个问题，请尝试减小请求头大小。举个例子，如果 cookie 太长，请删除它。或者你可以使用 [`--max-http-header-size`](https://nodejs.org/api/cli.html#--max-http-header-sizesize) 来更改最大请求头大小。

### 开发容器 / VS Code 端口转发

如果你正在使用开发容器或 VS Code 的端口转发功能，可能需要在配置中将 [`server.host`](/config/server-options.md#server-host) 选项设置为 `127.0.0.1` 才能使其正常工作。

这是因为 [VS Code 的端口转发功能不支持 IPv6](https://github.com/microsoft/vscode-remote-release/issues/7029)。

更多详情请参阅 [#16522](https://github.com/vitejs/vite/issues/16522)。

## HMR

### Vite 检测到文件变化，但 HMR 不工作 {#vite-detects-a-file-change-but-the-hmr-is-not-working}

你可能导入了一个拥有不同大小写的文件，例如，存在 `src/foo.js` 文件而 `src/bar.js` 导入了它：

```js
import './Foo.js' // 应该为 './foo.js'
```

相关 issue：[#964](https://github.com/vitejs/vite/issues/964)

### Vite 没有检测到文件变化 {#vite-does-not-detect-a-file-change}

如果你正在 WSL2 中运行 Vite，Vite 无法在某些场景下监听文件变化。请查看 [`server.watch` 选项](/config/server-options.md#server-watch) 的描述。

### 完全重新加载了，而不是 HMR {#a-full-reload-happens-instead-of-hmr}

如果 HMR 不是由 Vite 或一个插件处理的，那么将进行完全的重新加载，因为这是唯一刷新状态的方式。

如果 HMR 被处理了，但是在循环依赖中，那么也会发生完全的重新加载，以恢复执行顺序。要解决这个问题，请尝试打破循环。你可以运行 `vite --debug hmr` 来记录循环依赖路径，如果文件变化触发了它。

## 构建 {#build}

### 构建产物因为 CORS 错误无法工作 {#built-file-does-not-work-because-of-cors-error}

如果导出的 HTML 文件是通过 `file` 协议打开的，那么其中的 script 将不会运行，且报告下列错误。

> Access to script at 'file:///foo/bar.js' from origin 'null' has been blocked by CORS policy: Cross origin requests are only supported for protocol schemes: http, data, isolated-app, chrome-extension, chrome, https, chrome-untrusted.

> Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at file:///foo/bar.js. (Reason: CORS request not http).

请查看 [释因：CORS 请求不是 HTTP 请求 - HTTP | MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSRequestNotHttp) 了解为什么会发生这种情况的更多信息。

你需要通过 `http` 协议访问该文件。最简单的办法就是使用 `npx vite preview`。

### 由于区分大小写，没有这样的文件或目录错误 {#no-such-file-or-directory-error-due-to-case-sensitivity}

如果您遇到类似 `ENOENT: no such file or directory` 或者 `Module not found` 之类的错误，这通常是因为您的项目是在不区分大小写的文件系统（Windows / macOS）上开发的，但在区分大小写的文件系统（Linux）上构建时发生的。请确保导入的大小写正确。

### `Failed to fetch dynamically imported module` 错误 {#failed-to-fetch-dynamically-imported-module-error}

> TypeError: Failed to fetch dynamically imported module

此错误在以下几种情况下发生：

- 版本偏差
- 网络状况不佳
- 浏览器扩展程序阻止请求

#### 版本偏差 {#version-skew}

当你部署应用程序的新版本时，HTML 文件和 JS 文件仍然引用在新部署中已删除的旧代码块名称。这种情况发生在：

1. 用户浏览器中缓存了旧版本的应用
2. 由于代码变更，您部署了具有不同代码块名称的新版本
3. 缓存的 HTML 会尝试加载不再存在的代码块

如果您正在使用框架，请首先参考其文档，因为它可能有针对此问题的内置解决方案。

要解决此问题，你可以：

- **暂时保留旧的 chunks**: 考虑保留以前部署的块一段时间，以允许缓存的用户顺利过渡。
- **使用 service worker**: 实现一个 service worker, 它将预获取所有静态资源并缓存它们。
- **Prefetch 动态 chunks**: 请注意，如果您的 HTML 文件由于 `Cache-Control` 标头而被浏览器缓存，则这无济于事
- **实现优雅的回退**: 实现优雅的回退实现动态导入的错误处理，以便在缺少块时重新加载页面。请参阅[加载错误处理](./build.md#load-error-handling)以了解更多详细信息。

#### 网络状况不佳 {#poor-network-conditions}

此错误可能发生在网络不稳定的环境中。例如，由于网络错误或服务器停机导致请求失败。

请注意，由于浏览器限制，您无法重新尝试动态导入。 ([whatwg/html#6768](https://github.com/whatwg/html/issues/6768)).

#### 浏览器扩展阻止请求 {#browser-extensions-blocking-requests}

该错误也可能由浏览器扩展程序（如广告拦截器）阻止该请求导致。

可以通过修改 [`build.rollupOptions.output.chunkFileNames`](../config/build-options.md#build-rollupoptions) 中的块文件名来绕过此问题，因为这些扩展程序通常会根据文件名（例如包含 `ad` 或 `track` 的文件名）来阻止请求。

## 优化依赖 {#optimize-dependencies}

### 链接本地包时过期预构建依赖项 {#outdated-pre-bundled-deps-when-linking-to-a-local-package}

在 Vite 中通过一个哈希值来决定优化后的依赖项是否有效，这个值取决于包锁定的内容、应用于依赖项的补丁以及 Vite 配置文件中影响 node_modules 打包的选项。这意味着，当使用像 [npm overrides](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#overrides) 这样的功能覆盖依赖项时，Vite 将检测到，并在下一次服务器启动时重新打包您的依赖项。当您使用像 [npm link](https://docs.npmjs.com/cli/v9/commands/npm-link) 这样的功能时，Vite 不会使依赖项无效。如果您链接或取消链接一个依赖项，那么您需要使用 `vite --force` 在下一次服务器启动时强制重新预构建。我们建议使用 overrides，它们现在被每个包管理器所支持（还可以参见 [pnpm overrides](https://pnpm.io/9.x/package_json#pnpmoverrides) 和 [yarn resolutions](https://yarnpkg.com/configuration/manifest/#resolutions)）。

## 性能瓶颈 {#performance-bottlenecks}

如果你遇到应用程序性能瓶颈导致加载缓慢，可以在启动 Vite 开发服务器或在构建应用程序时使用内置的 Node.js 调试器来创建 CPU 性能分析文件：

::: code-group

```bash [dev server]
vite --profile --open
```

```bash [build]
vite build --profile
```

:::

::: tip Vite 开发服务器
一旦应用程序在浏览器中打开，请等待其完成加载，然后返回终端并按下 `p` 键（将停止 Node.js 调试器），然后按下 `q` 键停止开发服务器。
:::

Node.js 调试器将在根文件夹中生成 `vite-profile-0.cpuprofile` 文件，前往 https://www.speedscope.app/ ，点击 `BROWSE` 按钮上传 CPU 性能分析文件以检查结果。

可以安装 [vite-plugin-inspect](https://github.com/antfu/vite-plugin-inspect) 插件，它可以让你检查 Vite 插件转换时的中间态，并帮助你确定哪些插件或中间件是你应用的瓶颈。该插件可以在开发和构建模式下使用。请查看其 readme 以获取更多详细信息。

## 其他 {#others}

### 为了浏览器兼容性而模块外部化 {#module-externalized-for-browser-compatibility}

当你在浏览器中使用一个 Node.js 模块时，Vite 会输出以下警告：

> Module "fs" has been externalized for browser compatibility. Cannot access "fs.readFile" in client code.

这是因为 Vite 不会自动 polyfill Node.js 的内建模块。

我们推荐你不要在浏览器中使用 Node.js 模块以减小包体积，尽管你可以为其手动添加 polyfill。如果该模块是被某个第三方库（这里意为某个在浏览器中使用的库）导入的，则建议向对应库提交一个 issue。

### 出现 Syntax Error 或 Type Error {#syntax-error-type-error-happens}

Vite 无法处理、也不支持仅可在非严格模式（sloppy mode）下运行的代码。这是因为 Vite 使用了 ESM 并且始终在 ESM 中使用 [严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)。

例如，你可能会看到以下错误。

> [ERROR] With statements cannot be used with the "esm" output format due to strict mode

> TypeError: Cannot create property 'foo' on boolean 'false'

如果这些代码是在依赖中被使用的，你应该使用 [`patch-package`](https://github.com/ds300/patch-package)（或者 [`yarn patch`](https://yarnpkg.com/cli/patch)、[`pnpm patch`](https://pnpm.io/cli/patch) 工具）来做短期补丁处理。

### 浏览器扩展程序 {#browser-extensions}

某些浏览器扩展程序（例如广告拦截器）可能会阻止 Vite 客户端向 Vite 开发服务器发送请求。在这种情况下，您可能会看到白屏，且没有任何错误记录。您还可能会看到以下错误：

> TypeError: Failed to fetch dynamically imported module

如果您遇到此问题，请尝试禁用扩展。

### Windows 上的跨驱动器链接 {#cross-drive-links-on-windows}

如果你的项目中存在跨驱动器链接，Vite 可能无法工作。

跨驱动器链接的一个例子是：

- 通过 `subst` 命令将虚拟驱动器链接到一个文件夹
- 通过 `mklink` 命令将符号链接/联接到另一个驱动器（例如 Yarn 全局缓存）

相关 issue：[#10802](https://github.com/vitejs/vite/issues/10802)

<script setup lang="ts">
// 使用哈希将旧链接重定向到旧版本文档
if (typeof window !== "undefined") {
  const hashForOldVersion = {
    'vite-cjs-node-api-deprecated': 6
  }

  const version = hashForOldVersion[location.hash.slice(1)]
  if (version) {
    // 更新 scheme 和端口，以便它在本地预览中工作（本地为 http 和 4173）
    location.href = `https://v${version}.vite.dev` + location.pathname + location.search + location.hash
  }
}
</script>
