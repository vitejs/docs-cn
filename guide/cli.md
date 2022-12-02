# 命令行界面 CLI

## 开发服务器 {#dev-server}

### `vite`

在当前目录下启动 Vite 的开发服务器。在开发环境下自动进入 `watch` 监听模式，在 CI 环境自动进入 `run` 运行模式。

#### 用法

```bash
vite [root]
```

#### 选项

| 选项                     |                                            |
|--------------------------|--------------------------------------------|
| `--host [host]`          | 指定 hostname (`string`)                   |
| `--port <port>`          | 指定端口 (`number`)                        |
| `--https`                | 使用 TLS + HTTP/2 (`boolean`)              |
| `--open [path]`          | 启动时打开浏览器 (`boolean \| string`)     |
| `--cors`                 | 启用 CORS (`boolean`)                      |
| `--strictPort`           | 如果指定端口被占用，则退出 (`boolean`)     |
| `--force`                | 强制忽略缓存并重新构建 (`boolean`)         |
| `-c, --config <file>`    | 使用指定的配置文件 (`string`)              |
| `--base <path>`          | 指定基本路径 （默认值: `/`） (`string`)    |
| `-l, --logLevel <level>` | info \| warn \| error \| silent (`string`) |
| `--clearScreen`          | 启动/禁用打印日志时清除屏幕 (`boolean`)    |
| `-d, --debug [feat]`     | 是否显示 debug 日志 (`string \| boolean`)  |
| `-f, --filter <filter>`  | 过滤 debug 日志 (`string`)                 |
| `-m, --mode <mode>`      | 设置环境模式 `env mode` (`string`)         |
| `-h, --help`             | 展示可用的 CLI 选项                        |
| `-v, --version`          | 展示当前版本号                             |

## 打包 {#build}

### `vite build`

为生产环境打包。

#### 用法

```bash
vite build [root]
```

#### 选项

| 选项                           |                                                                                             |
|--------------------------------|--------------------------------------------------------------------------------------------|
| `--target <target>`            | 转译目标 （默认值：`"modules"`） (`string`)                                                   |
| `--outDir <dir>`               | 输出目录 （默认值：`dist`） (`string`)                                                        |
| `--assetsDir <dir>`            | 输出目录下放静态资源的目录 （默认值：`"assets"`） (`string`)                                     |
| `--assetsInlineLimit <number>` | 静态资源转为内联 base64 格式的尺寸最大值，单位为字节 （默认值：`4096`） (`number`)                  |
| `--ssr [entry]`                | 为服务端渲染 `SSR` 指定入口 (`string`)                                                        |
| `--sourcemap`                  | 是否打包后生成 source map （默认值：`false`） (`boolean`)                                      |
| `--minify [minifier]`          | 启用/禁用最小化混淆，或指定一个混淆器 （默认值：`"esbuild"`）(`boolean \| "terser" \| "esbuild"`)  |
| `--manifest [name]`            | 打包后是否生成 `mainfest` 文件 (`boolean \| string`)                                          |
| `--ssrManifest [name]`         | SSR 模式是否生成 `mainfest` 文件 (`boolean \| string`)                                        |
| `--force`                      | 强制忽略缓存，并重新打包（实验性） (`boolean`)                                                   |
| `--emptyOutDir`                | 当输出目录不在根目录时，强制清空 (`boolean`)                                                     |
| `-w, --watch`                  | 当模块文件发生改变时，重新打包 (`boolean`)                                                       |
| `-c, --config <file>`          | 使用指定的配置文件 (`string`)                                                                  |
| `--base <path>`                | 指定公共基本路径 （默认值：`/`） (`string`)                                                      |
| `-l, --logLevel <level>`       | info \| warn \| error \| silent (`string`)                                                  |
| `--clearScreen`                | 启动/禁用打印日志时清除屏幕 (`boolean`)                                                          |
| `-d, --debug [feat]`           | 是否显示 debug 日志 (`string \| boolean`)                                                      |
| `-f, --filter <filter>`        | 过滤 debug 日志 (`string`)                                                                    |
| `-m, --mode <mode>`            | 设置环境模式 `env mode` (`string`)                                                             |
| `-h, --help`                   | 展示可用的 CLI 选项                                                                            |

## 其他

### `vite optimize`

预构建依赖。

#### 用法

```bash
vite optimize [root]
```

#### 选项

| 选项                     |                                            |
|--------------------------|--------------------------------------------|
| `--force`                | 强制忽略缓存，并重新构建 (`boolean`)           |
| `-c, --config <file>`    | 使用指定的配置文件 (`string`)                 |
| `--base <path>`          | 公共基础路径 (default: `/`) (`string`)       |
| `-l, --logLevel <level>` | info \| warn \| error \| silent (`string`) |
| `--clearScreen`          | 启动/禁用打印日志时清除屏幕 (`boolean`)        |
| `-d, --debug [feat]`     | 是否显示 debug 日志 (`string \| boolean`)    |
| `-f, --filter <filter>`  | 过滤 debug 日志 (`string`)                  |
| `-m, --mode <mode>`      | 设置环境模式 `env mode` (`string`)          |
| `-h, --help`             | 展示可用的 CLI 选项                          |

### `vite preview`

本地预览生产环境打包的内容。

#### 用法

```bash
vite preview [root]
```

#### 选项

| 选项                     |                                             |
|--------------------------|---------------------------------------------|
| `--host [host]`          | 指定 hostname (`string`)                    |
| `--port <port>`          | 指定端口 (`number`)                         |
| `--strictPort`           | 如果指定端口被占用，则退出 (`boolean`)          |
| `--https`                | 使用 TLS + HTTP/2 (`boolean`)               |
| `--open [path]`          | 启动时打开浏览器 (`boolean \| string`)        |
| `--outDir <dir>`         | 输出目录 （默认值：`"dist"`） (`string`)       |
| `-c, --config <file>`    | 使用指定的配置文件 (`string`)                  |
| `--base <path>`          | 指定公共基本路径 （默认值：`/`） (`string`)      |
| `-l, --logLevel <level>` | info \| warn \| error \| silent (`string`)  |
| `--clearScreen`          | 启动/禁用打印日志时清除屏幕 (`boolean`)         |
| `-d, --debug [feat]`     | 是否显示 debug 日志 (`string \| boolean`)     |
| `-f, --filter <filter>`  | 过滤 debug 日志 (`string`)                   |
| `-m, --mode <mode>`      | 设置环境模式 `env mode` (`string`)            |
| `-h, --help`             | 展示可用的 CLI 选项                           |
