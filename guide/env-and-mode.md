# 环境变量和模式 {#env-variables-and-modes}

## 环境变量 {#env-variables}

Vite 在一个特殊的 **`import.meta.env`** 对象上暴露环境变量。这里有一些在所有情况下都可以使用的内建变量：

- **`import.meta.env.MODE`**: {string} 应用运行的[模式](#modes)。

- **`import.meta.env.BASE_URL`**: {string} 部署应用时的基本 URL。他由[`base` 配置项](/config/#base)决定。

- **`import.meta.env.PROD`**: {boolean} 应用是否运行在生产环境。

- **`import.meta.env.DEV`**: {boolean} 应用是否运行在开发环境 (永远与 `import.meta.env.PROD`相反)。

### 生产环境替换 {#production-replacement}

在生产环境中，这些环境变量会在构建时被**静态替换**，因此，在引用它们时请使用完全静态的字符串。动态的 key 将无法生效。例如，动态 key 取值 `import.meta.env[key]` 是无效的。

它还将替换出现在 JavaScript 和 Vue 模板中的字符串。这应该是一种罕见的情况，但可能是不小心为之的。有一些方法可以避免这个问题：

- 对于 JavaScript 字符串，你可以使用 unicode 零宽度空格 **`\u200b`** (一个看不见的分隔符)来分割这个字符串，例如： `'import.meta\u200b.env.MODE'`。

- 对于 Vue 模板或其他编译到 JavaScript 字符串的 HTML，你可以使用 [`<wbr>` 标签](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/wbr)，例如：`import.meta.<wbr>env.MODE`。

## `.env` 文件 {#env-files}

Vite 使用 [dotenv](https://github.com/motdotla/dotenv) 从你的 [环境目录](/config/#envdir) 中的下列文件加载额外的环境变量：

```
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```

加载的环境变量也会通过 `import.meta.env` 暴露给客户端源码。

为了防止意外地将一些环境变量泄漏到客户端，只有以 `VITE_` 为前缀的变量才会暴露给经过 Vite 处理的代码。例如下面这个文件中：

```
DB_PASSWORD=foobar
VITE_SOME_KEY=123
```

只有 `VITE_SOME_KEY` 会被暴露为 `import.meta.env.VITE_SOME_KEY` 提供给客户端源码，而 `DB_PASSWORD` 则不会。

:::warning 安全注意事项

- `.env.*.local` 文件应是本地的，可以包含敏感变量。你应该将 `.local` 添加到你的 `.gitignore` 中，以避免它们被 git 检入。

- 由于任何暴露给 Vite 源码的变量最终都将出现在客户端包中，`VITE_*` 变量应该不包含任何敏感信息。
  :::

### 智能提示 {#intellisense}

默认情况下，Vite 为 `import.meta.env` 提供了类型定义。随着在 `.env[mode]` 文件中自定义了越来越多的环境变量，你可能想要在代码中获取这些以 `VITE_` 为前缀的用户自定义环境变量的 TypeScript 智能提示。

要想做到这一点，你可以在 `src` 目录下创建一个 `env.d.ts` 文件，接着按下面这样增加 `ImportMetaEnv` 的定义：

```typescript
interface ImportMetaEnv {
  VITE_APP_TITLE: string
  // 更多环境变量...
}
```

## 模式 {#modes}

默认情况下，开发服务器 (`serve` 命令) 运行在 `development` (开发) 模式，而 `build` 命令运行在 `production` (生产) 模式。

这意味着当执行 `vite build` 时，它会自动加载 `.env.production` 中可能存在的环境变量：

```
# .env.production
VITE_APP_TITLE=My App
```

在你的应用中，你可以使用 `import.meta.env.VITE_APP_TITLE` 渲染标题。

然而，重要的是要理解 **模式** 是一个更广泛的概念，而不仅仅是开发和生产。一个典型的例子是，你可能希望有一个 “staging” (预发布|预上线) 模式，它应该具有类似于生产的行为，但环境变量与生产环境略有不同。

你可以通过传递 `--mode` 选项标志来覆盖命令使用的默认模式。例如，如果你想为我们假设的 staging 模式构建应用：

```bash
vite build --mode staging
```

为了使应用实现预期行为，我们还需要一个 `.env.staging` 文件：

```
# .env.staging
NODE_ENV=production
VITE_APP_TITLE=My App (staging)
```

现在，你的 staging 应用应该具有类似于生产的行为，但显示的标题与生产环境不同。
