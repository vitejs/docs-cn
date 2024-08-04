---
title: 配置 Vite
---

# 配置 Vite {#configuring-vite}

当以命令行方式运行 `vite` 时，Vite 会自动解析 [项目根目录](/guide/#index-html-and-project-root) 下名为 `vite.config.js` 的配置文件（也支持其他 JS 和 TS 扩展名）。

最基础的配置文件是这样的：

```js
// vite.config.js
export default {
  // 配置选项
}
```

注意：即使项目没有在 `package.json` 中开启 `type: "module"`，Vite 也支持在配置文件中使用 ESM 语法。这种情况下，配置文件会在被加载前自动进行预处理。

你可以显式地通过 `--config` 命令行选项指定一个配置文件（相对于 `cwd` 路径进行解析）

```bash
vite --config my-config.js
```

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

如果配置文件需要基于（`dev`/`serve` 或 `build`）命令或者不同的 [模式](/guide/env-and-mode) 来决定选项，亦或者是一个 SSR 构建（`isSsrBuild`）、一个正在预览的构建产物（`isPreview`），则可以选择导出这样一个函数：

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

环境变量通常可以从 `process.env` 获得。

注意 Vite 默认是不加载 `.env` 文件的，因为这些文件需要在执行完 Vite 配置后才能确定加载哪一个，举个例子，`root` 和 `envDir` 选项会影响加载行为。不过当你的确需要时，你可以使用 Vite 导出的 `loadEnv` 函数来加载指定的 `.env` 文件。

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 来加载所有环境变量，而不管是否有 `VITE_` 前缀。
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite 配置
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
```
