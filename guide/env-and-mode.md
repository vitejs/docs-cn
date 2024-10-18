# 环境变量和模式 {#env-variables-and-modes}

## 环境变量 {#env-variables}

Vite 在一个特殊的 **`import.meta.env`** 对象上暴露环境变量，这些变量在构建时会被静态地替换掉。这里有一些在所有情况下都可以使用的内建变量：

- **`import.meta.env.MODE`**: {string} 应用运行的[模式](#modes)。

- **`import.meta.env.BASE_URL`**: {string} 部署应用时的基本 URL。他由[`base` 配置项](/config/shared-options.md#base)决定。

- **`import.meta.env.PROD`**: {boolean} 应用是否运行在生产环境（使用 `NODE_ENV='production'` 运行开发服务器或构建应用时使用 `NODE_ENV='production'` ）。

- **`import.meta.env.DEV`**: {boolean} 应用是否运行在开发环境 (永远与 `import.meta.env.PROD`相反)。

- **`import.meta.env.SSR`**: {boolean} 应用是否运行在 [server](./ssr.md#conditional-logic) 上。

## `.env` 文件 {#env-files}

Vite 使用 [dotenv](https://github.com/motdotla/dotenv) 从你的 [环境目录](/config/shared-options.md#envdir) 中的下列文件加载额外的环境变量：

```
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```

:::tip 环境加载优先级

一份用于指定模式的文件（例如 `.env.production`）会比通用形式的优先级更高（例如 `.env`）。

另外，Vite 执行时已经存在的环境变量有最高的优先级，不会被 `.env` 类文件覆盖。例如当运行 `VITE_SOME_KEY=123 vite build` 的时候。

`.env` 类文件会在 Vite 启动一开始时被加载，而改动会在重启服务器后生效。
:::

加载的环境变量也会通过 `import.meta.env` 以字符串形式暴露给客户端源码。

为了防止意外地将一些环境变量泄漏到客户端，只有以 `VITE_` 为前缀的变量才会暴露给经过 vite 处理的代码。例如下面这些环境变量：

```[.env]
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

只有 `VITE_SOME_KEY` 会被暴露为 `import.meta.env.VITE_SOME_KEY` 提供给客户端源码，而 `DB_PASSWORD` 则不会。

```js
console.log(import.meta.env.VITE_SOME_KEY) // "123"
console.log(import.meta.env.DB_PASSWORD) // undefined
```

:::tip 环境变量解析

如上所示，`VITE_SOME_KEY` 是一个数字，但在解析时会返回一个字符串。布尔类型的环境变量也会发生同样的情况。在代码中使用时，请确保转换为所需的类型。
:::

此外，Vite 使用 [dotenv-expand](https://github.com/motdotla/dotenv-expand) 来扩展在 env 文件中编写的变量。想要了解更多相关语法，请查看 [它们的文档](https://github.com/motdotla/dotenv-expand#what-rules-does-the-expansion-engine-follow)。

请注意，如果想要在环境变量中使用 `$` 符号，则必须使用 `\` 对其进行转义。

```[.env]
KEY=123
NEW_KEY1=test$foo   # test
NEW_KEY2=test\$foo  # test$foo
NEW_KEY3=test$KEY   # test123
```

如果你想自定义 env 变量的前缀，请参阅 [envPrefix](/config/shared-options.html#envprefix)。

  :::warning 安全注意事项

- `.env.*.local` 文件应是本地的，可以包含敏感变量。你应该将 `*.local` 添加到你的 `.gitignore` 中，以避免它们被 git 检入。

- 由于任何暴露给 Vite 源码的变量最终都将出现在客户端包中，`VITE_*` 变量应该不包含任何敏感信息。
  :::

### TypeScript 的智能提示 {#intellisense}

默认情况下，Vite 在 [`vite/client.d.ts`](https://github.com/vitejs/vite/blob/main/packages/vite/client.d.ts) 中为 `import.meta.env` 提供了类型定义。随着在 `.env[mode]` 文件中自定义了越来越多的环境变量，你可能想要在代码中获取这些以 `VITE_` 为前缀的用户自定义环境变量的 TypeScript 智能提示。

要想做到这一点，你可以在 `src` 目录下创建一个 `vite-env.d.ts` 文件，接着按下面这样增加 `ImportMetaEnv` 的定义：

```typescript [vite-env.d.ts]
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```

如果你的代码依赖于浏览器环境的类型，比如 [DOM](https://github.com/microsoft/TypeScript/blob/main/src/lib/dom.generated.d.ts) 和 [WebWorker](https://github.com/microsoft/TypeScript/blob/main/src/lib/webworker.generated.d.ts)，你可以在 `tsconfig.json` 中修改 [lib](https://www.typescriptlang.org/tsconfig#lib) 字段来获取类型支持。

```json [tsconfig.json]
{
  "lib": ["WebWorker"]
}
```

:::warning 导入语句会破坏类型增强

如果 `ImportMetaEnv` 增强不起作用，请确保在 `vite-env.d.ts` 中没有任何 `import` 语句。更多信息请参阅 [TypeScript 文档](https://www.typescriptlang.org/docs/handbook/2/modules.html#how-javascript-modules-are-defined)。
:::

## HTML 环境变量替换 {#html-env-replacement}

Vite 还支持在 HTML 文件中替换环境变量。`import.meta.env` 中的任何属性都可以通过特殊的 `%ENV_NAME%` 语法在 HTML 文件中使用：

```html
<h1>Vite is running in %MODE%</h1>
<p>Using data from %VITE_API_URL%</p>
```

如果环境变量在 `import.meta.env` 中不存在，比如不存在的 `%NON_EXISTENT%`，则会将被忽略而不被替换，这与 JS 中的 `import.meta.env.NON_EXISTENT` 不同，JS 中会被替换为 `undefined`。

正因为 Vite 被许多框架使用，它在复杂的替换（如条件替换）上故意不持任何意见。Vite 可以使用 [现有的用户插件](https://github.com/vitejs/awesome-vite#transformers) 或者一个实现了 [`transformIndexHtml` 钩子](./api-plugin#transformindexhtml) 的自定义插件来扩展。

## 模式 {#modes}

默认情况下，开发服务器 (`dev` 命令) 运行在 `development` (开发) 模式，而 `build` 命令则运行在 `production` (生产) 模式。

这意味着当执行 `vite build` 时，它会自动加载 `.env.production` 中可能存在的环境变量：

```
# .env.production
VITE_APP_TITLE=My App
```

在你的应用中，你可以使用 `import.meta.env.VITE_APP_TITLE` 渲染标题。

在某些情况下，若想在 `vite build` 时运行不同的模式来渲染不同的标题，你可以通过传递 `--mode` 选项标志来覆盖命令使用的默认模式。例如，如果你想在 staging （预发布）模式下构建应用：

```bash
vite build --mode staging
```

还需要新建一个 `.env.staging` 文件：

```
# .env.staging
VITE_APP_TITLE=My App (staging)
```

由于 `vite build` 默认运行生产模式构建，你也可以通过使用不同的模式和对应的 `.env` 文件配置来改变它，用以运行开发模式的构建：

```
# .env.testing
NODE_ENV=development
```

## NODE_ENV 和 模式 {#node-env-and-modes}

需要注意的是，`NODE_ENV`（`process.env.NODE_ENV`）和模式是两个不同的概念。以下是不同命令如何影响 `NODE_ENV` 和模式：

| Command                                              | NODE_ENV        | Mode            |
| ---------------------------------------------------- | --------------- | --------------- |
| `vite build`                                         | `"production"`  | `"production"`  |
| `vite build --mode development`                      | `"production"`  | `"development"` |
| `NODE_ENV=development vite build`                    | `"development"` | `"production"`  |
| `NODE_ENV=development vite build --mode development` | `"development"` | `"development"` |

`NODE_ENV` 和模式的不同值也会反映在相应的 `import.meta.env` 属性上：

| Command                | `import.meta.env.PROD` | `import.meta.env.DEV` |
| ---------------------- | ---------------------- | --------------------- |
| `NODE_ENV=production`  | `true`                 | `false`               |
| `NODE_ENV=development` | `false`                | `true`                |
| `NODE_ENV=other`       | `false`                | `true`                |

| Command              | `import.meta.env.MODE` |
| -------------------- | ---------------------- |
| `--mode production`  | `"production"`         |
| `--mode development` | `"development"`        |
| `--mode staging`     | `"staging"`            |

:::tip `.env` 文件中的 `NODE_ENV`

`NODE_ENV=...` 可以在命令中设置，也可以在 `.env` 文件中设置。如果在 `.env.[mode]` 文件中指定了 `NODE_ENV`，则可以使用模式来控制其值。不过，`NODE_ENV` 和模式仍然是两个不同的概念。

命令中使用 `NODE_ENV=...` 的主要好处是，它允许 Vite 提前检测到该值。这也使你能够在 Vite 配置中读取 `process.env.NODE_ENV`，因为 Vite 只有在解析配置之后才能加载环境变量文件。
:::
