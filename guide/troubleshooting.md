# 故障排除 {#troubleshooting}

> 你还可以查看 [Rollup 的故障排除指南](https://rollupjs.org/guide/en/#troubleshooting) 了解更多。

如果这里的建议并未帮助到你，请将你的问题发送到 [GitHub 讨论区](https://github.com/vitejs/vite/discussions) 或 [Vite Land Discord](https://chat.vitejs.dev) 的 `#help` 频道。

## CLI {#cli}

### `Error: Cannot find module 'C:\foo\bar&baz\vite\bin\vite.js'` {#error-cannot-find-module-cfoobarbazvitebinvitejs}

<<<<<<< HEAD
你的项目文件夹路径中可能包含了问号 `?`，这在 Windows 上无法与 `npm` 配合正常工作 ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45))。
=======
The path to your project folder may include `&`, which doesn't work with `npm` on Windows ([npm/cmd-shim#45](https://github.com/npm/cmd-shim/issues/45)).
>>>>>>> 2ee33290a41cb4a55ff166bf0eb41c22112d7335

你可以选择以下两种修改方式：

<<<<<<< HEAD
- 切换另一种包管理工具（例如 `pnpm` 或 `yarn`）
- 从你的项目路径中移除问号 `?`
=======
- Switch to another package manager (e.g. `pnpm`, `yarn`)
- Remove `&` from the path to your project
>>>>>>> 2ee33290a41cb4a55ff166bf0eb41c22112d7335

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

## 其他 {#others}

### Syntax Error / Type Error {#syntax-error-type-error-happens}

Vite 无法处理、也不支持仅可在非严格模式（sloppy mode）下运行的代码。这是因为 Vite 使用了 ESM 并且始终在 ESM 中使用 [严格模式](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)。

例如，你可能会看到以下错误。

> [ERROR] With statements cannot be used with the "esm" output format due to strict mode

> TypeError: Cannot create property 'foo' on boolean 'false'

如果这些代码是在依赖中被使用的，你应该使用 [`patch-package`](https://github.com/ds300/patch-package)（或者 [`yarn patch`](https://yarnpkg.com/cli/patch)、[`pnpm patch`](https://pnpm.io/cli/patch) 工具）来做短期补丁处理。
