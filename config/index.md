---
title: 配置 Vite
---

# 配置 Vite {#configuring-vite}

当以命令行方式运行 `vite` 时，Vite 会自动解析 [项目根目录](/guide/#index-html-and-project-root) 下名为 `vite.config.js` 的配置文件（也支持其他 JS 和 TS 扩展名）。

最基础的配置文件是这样的：

```js [vite.config.js]
export default {
  // 配置选项
}
```

注意：即使项目没有在 `package.json` 中开启 `"type": "module"`，Vite 也支持在配置文件中使用 ESM 语法。这种情况下，配置文件会在被加载前自动进行预处理。

你可以显式地通过 `--config` 命令行选项指定一个配置文件（相对于 `cwd` 路径进行解析）

```bash
vite --config my-config.js
```

::: tip 加载配置文件
默认情况下，Vite 使用 `esbuild` 将配置文件打包到临时文件中并加载它。这可能会在 monorepo 中导入 TypeScript 文件时引发问题。如果你遇到了这种方法问题，可以通过指定 `--configLoader runner` 以改用 [module runner](/guide/api-environment-runtimes.html#modulerunner)，它不会创建临时配置并将动态转换任何文件。请注意，module runner 不支持配置文件中的 CJS，但外部 CJS 包应该可以正常工作。

另外，如果你正在使用支持TypeScript的环境（例如 `node --experimental-strip-types`），或者只编写纯 JavaScript 代码，你可以指定 `--configLoader native` 以使用环境的本机运行时加载配置文件。请注意，配置文件导入的模块的更新不会被检测到，因此不会自动重启 Vite 服务器。
:::

## 配置智能提示 {#config-intellisense}

因为 Vite 本身附带 TypeScript 类型，所以你可以通过 IDE 和 jsdoc 的配合来实现智能提示：

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

另外你可以使用 `defineConfig` 工具函数，这样不用 jsdoc 注解也可以获取类型提示：

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite 也直接支持 TypeScript 配置文件。你可以在 `vite.config.ts` 中使用上述的 `defineConfig` 工具函数，或者 `satisfies` 运算符：

```ts
import type { UserConfig } from 'vite'

export default {
  // ...
} satisfies UserConfig
```

## 情景配置 {#conditional-config}

如果配置文件需要基于（`serve` 或 `build`）命令或者不同的 [模式](/guide/env-and-mode#modes) 来决定选项，亦或者是一个 SSR 构建（`isSsrBuild`）、一个正在预览的构建产物（`isPreview`），则可以选择导出这样一个函数：

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // dev 独有配置
    }
  } else {
    // command === 'build'
    return {
      // build 独有配置
    }
  }
})
```

需要注意的是，在 Vite 的 API 中，在开发环境下 `command` 的值为 `serve`（在 CLI 中， `vite dev` 和 `vite serve` 是 [`vite`](/guide/cli#vite) 的别名），而在生产环境下为 `build`（[`vite build`](/guide/cli#vite-build)）。

`isSsrBuild` 和 `isPreview` 是额外的可选标志，用于区分 `build` 和 `serve` 命令的类型。一些加载 Vite 配置的工具可能不支持这些标志，而会传递 `undefined`。因此，建议使用 `true` 和 `false` 的显式比较。

## 异步配置 {#async-config}

如果配置需要调用一个异步函数，也可以转而导出一个异步函数。这个异步函数也可以通过 `defineConfig` 传递，以便获得更好的智能提示：

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // vite 配置
  }
})
```

## 在配置中使用环境变量 {#using-environment-variables-in-config}

在评估配置文件本身时，可用的环境变量仅限于当前进程环境中已经存在的变量（`process.env`）。Vite 有意推迟加载任何 `.env*` 文件，直到用户配置解析完成之后，因为要加载的文件集合依赖于配置选项如 [`root`](/guide/#index-html-and-project-root) 和 [`envDir`](/config/shared-options.md#envdir)，以及最终的 `mode`。

这意味着：在你的 `vite.config.*` 运行时，定义在 `.env`、`.env.local`、`.env.[mode]` 或 `.env.[mode].local` 中的变量不会自动注入到 `process.env` 中。它们会在稍后自动加载，并通过 `import.meta.env` 暴露给应用程序代码（使用默认的 `VITE_` 前缀过滤器），正如[环境变量和模式](/guide/env-and-mode.html)中所记录的那样。因此，如果你只需要将 `.env*` 文件中的值传递给应用程序，则无需在配置中调用任何内容。

但是，如果 `.env*` 文件中的值必须影响配置本身（例如设置 `server.port`、条件性启用插件或计算 `define` 替换），你可以使用导出的 [`loadEnv`](/guide/api-javascript.html#loadenv) 辅助函数手动加载它们。

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有
  // `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
    define: {
      // Provide an explicit app-level constant derived from an env var.
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    // Example: use an env var to set the dev server port conditionally.
    server: {
      port: env.APP_PORT ? Number(env.APP_PORT) : 5173,
    },
  }
})
```

## 在 VS Code 上调试配置文件 {#debugging-the-config-file-on-vs-code}

在默认的 `--configLoader bundle` 行为下，Vite 会将生成的临时配置文件写入 `node_modules/.vite-temp` 文件夹，在 Vite 配置文件中设置断点调试时会出现文件未找到的错误。要修复该问题，请在 `.vscode/settings.json` 中添加以下配置：

```json
{
  "debug.javascript.terminalOptions": {
    "resolveSourceMapLocations": [
      "${workspaceFolder}/**",
      "!**/node_modules/**",
      "**/node_modules/.vite-temp/**"
    ]
  }
}
```
