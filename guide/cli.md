# 命令行界面 {#command-line-interface}

## 开发服务器 {#dev-server}

### `vite` {#vite}

在当前目录下启动 Vite 开发服务器。`vite dev` 和 `vite serve` 是 `vite` 的别名。

#### 使用 {#usage}

```bash
vite [root]
```

#### 选项 {#options}

| 选项                     |                                                                                         |
| ------------------------ | -------------------------------------------------------------------------------------- |
| `--host [host]`          | 指定主机名称 (`string`) |
| `--port <port>`          | 指定端口 (`number`) |
| `--open [path]`          | 启动时打开浏览器 (`boolean \| string`) |
| `--cors`                 | 启用 CORS (`boolean`) |
| `--strictPort`           | 如果指定的端口已在使用中，则退出 (`boolean`) |
| `--force`                | 强制优化器忽略缓存并重新构建 (`boolean`) |
| `-c, --config <file>`    | 使用指定的配置文件 (`string`) |
| `--base <path>`          | 公共基础路径（默认为：`/`）(`string`) |
| `-l, --logLevel <level>` | info \| warn \| error \| silent (`string`) |
| `--clearScreen`          | 允许或禁用打印日志时清除屏幕 (`boolean`) |
| `--profile`              | 启动内置的 Node.js 调试器（查看 [性能瓶颈](/guide/troubleshooting#performance-bottlenecks)）|
| `-d, --debug [feat]`     | 显示调试日志 (`string \| boolean`) |
| `-f, --filter <filter>`  | 过滤调试日志 (`string`) |
| `-m, --mode <mode>`      | 设置环境模式 (`string`) |
| `-h, --help`             | 显示可用的 CLI 选项 |
| `-v, --version`          | 显示版本号 |

## 构建 {#build}

### `vite build` {#vite-build}

构建生产版本。

#### 使用 {#usage-1}

```bash
vite build [root]
```

#### 选项 {#options-1}

| 选项                           |                                                                                               |
| ------------------------------ | -------------------------------------------------------------------------------------------- |
| `--target <target>`            | 编译目标（默认为：`"modules"`）(`string`) |
| `--outDir <dir>`               | 输出目录（默认为：`dist`）(`string`) |
| `--assetsDir <dir>`            | 在输出目录下放置资源的目录（默认为：`"assets"`）(`string`) |
| `--assetsInlineLimit <number>` | 静态资源内联为 base64 编码的阈值，以字节为单位（默认为：`4096`）(`number`) |
| `--ssr [entry]`                | 为服务端渲染配置指定入口文件 (`string`) |
| `--sourcemap [output]`         | 构建后输出 source map 文件（默认为：`false`）(`boolean \| "inline" \| "hidden"`) |
| `--minify [minifier]`          | 允许或禁用最小化混淆，或指定使用哪种混淆器（默认为：`"esbuild"`）(`boolean \| "terser" \| "esbuild"`) |
| `--manifest [name]`            | 构建后生成 manifest.json 文件 (`boolean \| string`) |
| `--ssrManifest [name]`         | 构建后生成 SSR manifest.json 文件 (`boolean \| string`) |
| `--emptyOutDir`                | 若输出目录在根目录外，强制清空输出目录 (`boolean`) |
| `-w, --watch`                  | 在磁盘中模块发生变化时，重新构建 (`boolean`) |
| `-c, --config <file>`          | 使用指定的配置文件 (`string`) |
| `--base <path>`                | 公共基础路径（默认为：`/`）(`string`) |
| `-l, --logLevel <level>`       | Info \| warn \| error \| silent (`string`) |
| `--clearScreen`                | 允许或禁用打印日志时清除屏幕 (`boolean`) |
| `--profile`                    | 启动内置的 Node.js 调试器（查看 [性能瓶颈](/guide/troubleshooting#performance-bottlenecks)）|
| `-d, --debug [feat]`           | 显示调试日志 (`string \| boolean`) |
| `-f, --filter <filter>`        | 过滤调试日志 (`string`) |
| `-m, --mode <mode>`            | 设置环境模式 (`string`) |
| `-h, --help`                   | 显示可用的 CLI 选项 |
| `--app`                        | 构建所有环境，这与 `builder: {}` 是一样的（`boolean`，实验性）|

## 其他 {#others}

### `vite optimize` {#vite-optimize}

预构建依赖。

#### 使用 {#usage-2}

```bash
vite optimize [root]
```

#### 选项 {#options-2}

| 选项                     |                                             |
| ------------------------ | ------------------------------------------ |
| `--force`                | 强制优化器忽略缓存并重新构建 (`boolean`) |
| `-c, --config <file>`    | 使用指定的配置文件 (`string`) |
| `--base <path>`          | 公共基础路径（默认为：`/`）(`string`) |
| `-l, --logLevel <level>` | Info \| warn \| error \| silent (`string`) |
| `--clearScreen`          | 允许或禁用打印日志时清除屏幕 (`boolean`) |
| `-d, --debug [feat]`     | 显示调试日志 (`string \| boolean`) |
| `-f, --filter <filter>`  | 过滤调试日志 (`string`) |
| `-m, --mode <mode>`      | 设置环境模式 (`string`) |
| `-h, --help`             | 显示可用的 CLI 选项 |

### `vite preview` {#vite-preview}

本地预览构建产物。不要将其用作生产服务器，因为它不是为此而设计的。

#### 使用 {#usage-3}

```bash
vite preview [root]
```

#### 选项 {#options-3}

| 选项                     |                                             |
| ------------------------ | ------------------------------------------ |
| `--host [host]`          | 指定主机名称 (`string`) |
| `--port <port>`          | 指定端口 (`number`) |
| `--strictPort`           | 如果指定的端口已在使用中，则退出 (`boolean`) |
| `--open [path]`          | 启动时打开浏览器 (`boolean \| string`) |
| `--outDir <dir>`         | 输出目录（默认为：`dist`)(`string`) |
| `-c, --config <file>`    | 使用指定的配置文件 (`string`) |
| `--base <path>`          | 公共基础路径（默认为：`/`）(`string`) |
| `-l, --logLevel <level>` | Info \| warn \| error \| silent (`string`) |
| `--clearScreen`          | 允许或禁用打印日志时清除屏幕 (`boolean`) |
| `-d, --debug [feat]`     | 显示调试日志 (`string \| boolean`) |
| `-f, --filter <filter>`  | 过滤调试日志 (`string`) |
| `-m, --mode <mode>`      | 设置环境模式 (`string`) |
| `-h, --help`             | 显示可用的 CLI 选项 |
