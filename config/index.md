# 配置 Vite {#configuring-vite}

## 配置文件 {#config-file}

当以命令行方式运行 `vite` 时，Vite 会自动解析 [项目根目录](/guide/#index-html-and-project-root) 下名为 `vite.config.js` 的文件。

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

<<<<<<< HEAD
::: tip 注意
Vite 会替换配置文件中的 `__filename`、`__dirname` 和 `import.meta.url` 以及其依赖。若将这些标识符用作变量名或者将其用字符串双引号包裹、作为参数传入函数（如 `console.log`）中，会导致错误：

```js
const __filename = "value"
// 将被转换为下面这样的错误结果
const "path/vite.config.js" = "value"
=======
::: tip NOTE
Vite will inject `__filename`, `__dirname` in config files and its deps. Declaring these variables at top level will result in an error:

```js
const __filename = 'value' // SyntaxError: Identifier '__filename' has already been declared
>>>>>>> 9b189b069ce7477c79dd1b789d5305a9c784343a

const func = () => {
  const __filename = 'value' // no error
}
```

:::

## 配置智能提示 {#config-intellisense}

因为 Vite 本身附带 Typescript 类型，所以你可以通过 IDE 和 jsdoc 的配合来实现智能提示：

```js
/**
 * @type {import('vite').UserConfig}
 */
const config = {
  // ...
}

export default config
```

另外你可以使用 `defineConfig` 工具函数，这样不用 jsdoc 注解也可以获取类型提示：

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite 也直接支持 TS 配置文件。你可以在 `vite.config.ts` 中使用 `defineConfig` 工具函数。

## 情景配置 {#conditional-config}

如果配置文件需要基于（`dev`/`serve` 或 `build`）命令或者不同的 [模式](/guide/env-and-mode) 来决定选项，则可以选择导出这样一个函数：

```js
export default defineConfig(({ command, mode }) => {
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

需要注意的是，在 Vite 的 API 中，在开发环境下 `command` 的值为 `serve`（在 CLI 中， `vite dev` 和 `vite serve` 是 `vite` 的别名），而在生产环境下为 `build`（`vite build`）。

## 异步配置 {#async-config}

如果配置需要调用一个异步函数，也可以转而导出一个异步函数：

```js
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // vite 配置
  }
})
```

## 环境变量 {#environment-variables}

环境变量可以像往常一样从 `process.env` 上获得。

Vite 默认是不加载 `.env` 文件的，因为这些文件需要在执行完 Vite 配置后才能确定加载哪一个，举个例子，`root` 和 `envDir` 选项会影响加载行为。不过当你的确需要时，你可以使用 Vite 导出的 `loadEnv` 函数来加载指定的 `.env` 文件

```js
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ command, mode }) => {
  // 根据当前工作目录中的 `mode` 加载 .env 文件
  // 设置第三个参数为 '' 可以加载所有环境变量，而不考虑 `VITE_` 前缀
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite 配置
    define: {
      __APP_ENV__: env.APP_ENV
    }
  }
})
```
