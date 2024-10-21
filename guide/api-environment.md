# 环境 API {#environment-api}

:::warning 实验性
这个 API 的初始版本在 Vite 5.1 中以 "Vite Runtime API" 的名字被引入。这份指南介绍了经过修订后的 API，被重新命名为环境 API（Environment API）。这个 API 将在 Vite 6 中作为实验性功能发布。你现在已经可以在最新的 `vite@6.0.0-beta.x` 版本中进行测试。

资料：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此处收集新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此处被实现并进行了审查。

在参与测试这个提议的过程中，请与我们分享您的反馈。
:::

## 引入环境概念 {#formalizing-environments} 

Vite 6 正式引入了环境（Environments）的概念。在 Vite 5 之前，有两个隐式环境（`client` 和 `ssr`）。新的环境 API 允许用户根据他们的应用在生产环境中的工作方式创建尽可能多的环境。这些新的功能需要大规模的内部重构，而我们也已经在保持向后兼容性上做出了很大的努力。Vite 6 的初始目标是尽可能平滑地将整个生态系统迁移到新的主要版本，直到有足够的用户已经迁移，并且框架和插件作者已经验证了新的设计后，再采用这些新的实验性 API。

## 缩小构建和开发模式间的差距 {#closing-the-gap-between-build-and-dev}

对于一个简单的单页应用（SPA），只会有一个环境。应用将在用户浏览器中运行。在开发阶段，除了 Vite 需要一个现代浏览器外，开发环境与生产环境非常接近。在 Vite 6 中，用户仍然可以在不需要了解环境的情况下使用 Vite。在这种情况下，常规的 vite 配置适用于默认的客户端环境。

在典型的服务端渲染（SSR）Vite 应用中，会存在两个环境。客户端环境在浏览器中运行应用，而 Node 环境运行执行 SSR 的服务器。在开发模式下运行 Vite 时，服务器代码在与 Vite 开发服务器相同的 Node 进程中执行，从而接近生产环境。但是应用可以在其他 JS 运行时中运行服务器，比如 [Cloudflare的workerd](https://github.com/cloudflare/workerd)。而且对于现代应用来说，拥有两个以上环境也很常见（例如，一个应用可以在浏览器、Node 服务器和边缘服务器中运行）。Vite 5 中并未允许这些情况得到适当的表示。

Vite 6 允许用户在构建和开发过程中配置应用以映射其所有环境。在开发过程中，现在可以使用单个 Vite 开发服务器同时在多个不同环境中运行代码。应用源代码仍然由 Vite 开发服务器转换。在共享的 HTTP 服务器、中间件、解析的配置和插件管道之上，Vite 服务器现在有一组独立的开发环境。每个环境都配置为尽可能接近生产环境，并连接到一个开发运行时来执行代码（对于 workerd，服务器代码现在可以在本地的 miniflare 中运行）。在客户端，浏览器将导入并执行代码。在其他环境中，模块运行器会获取并执行转换后的代码。

![Vite Environments](../images/vite-environments.svg)

## 环境配置 {#environment-configuration}

环境是通过 `environments` 配置选项显式配置的。

```js
export default {
  environments: {
    client: {
      resolve: {
        conditions: [], // 配置客户端环境
      },
    },
    ssr: {
      dev: {
        optimizeDeps: {}, // 配置 SSR 环境
      },
    },
    rsc: {
      resolve: {
        noExternal: true, // 配置自定义环境
      },
    },
  },
}
```

所有环境配置都从用户的根配置扩展，允许用户在根级别为所有环境添加默认值。这对于配置只有 Vite 客户端的应用程序的常见场景非常有用，可以在不通过 `environments.client` 的情况下完成。

```js
export default {
  resolve: {
    conditions: [], // 为所有环境配置默认值
  },
}
```

`EnvironmentOptions` 接口展示了所有每个环境的选项。有些 `SharedEnvironmentOptions` 适用于 `build` 和 `dev`，比如 `resolve`。还有 `DevEnvironmentOptions` 和 `BuildEnvironmentOptions` 用于开发和构建特定的选项（比如 `dev.optimizeDeps` 或 `build.outDir`）。

```ts
interface EnvironmentOptions extends SharedEnvironmentOptions {
  dev: DevOptions
  build: BuildOptions
}
```

如我们所解释的，用户配置的根级别定义的环境特定选项用于默认的客户端环境（`UserConfig` 接口继承自 `EnvironmentOptions` 接口）。并且可以使用 `environments` 记录显式配置环境。`client` 和 `ssr` 环境在开发过程中总是存在的，即使将空对象设置为 `environments`。这允许与 `server.ssrLoadModule(url)` 和 `server.moduleGraph` 的向后兼容性。在构建过程中，`client` 环境总是存在的，而 `ssr` 环境只有在显式配置（使用 `environments.ssr` 或为了向后兼容 `build.ssr`）时才存在。

```ts
interface UserConfig extends EnvironmentOptions {
  environments: Record<string, EnvironmentOptions>
  // 其他选项
}
```

::: info

顶层属性 `ssr` 与 `EnvironmentOptions` 有许多相同的选项。这个选项是为了与 `environments` 相同的使用场景创建的，但只允许配置少数几个选项。我们将弃用它，以支持统一定义环境配置的方式。

:::

## 自定义环境实例 {#custom-environment-instances}

底层 API 配置已可用，因此可以支持为运行时提供环境。

```js
import { createCustomEnvironment } from 'vite-environment-provider'

export default {
  environments: {
    client: {
      build: {
        outDir: '/dist/client',
      },
    }
    ssr: createCustomEnvironment({
      build: {
        outDir: '/dist/ssr',
      },
    }),
  },
}
```

## 向后兼容性 {#backward-compatibility}

当前的 Vite 服务器 API 尚未被弃用，并且与 Vite 5 向后兼容。新的环境 API 是实验性的。

`server.moduleGraph` 返回客户端和服务器端渲染（ssr）模块图的混合视图。所有其方法都将返回向后兼容的混合模块节点。对于传递给 `handleHotUpdate` 的模块节点，也使用相同的方案。

我们不建议现在就切换到环境 API。我们的目标是在插件不需要维护两个版本之前，让大部分用户基础采用 Vite 6。查看未来破坏性更改部分以获取未来弃用和升级路径的信息：

- [钩子函数中的 `this.environment`](/changes/this-environment-in-hooks)
- [HMR `hotUpdate` 插件钩子](/changes/hotupdate-hook)
- [迁移到按环境划分的 API](/changes/per-environment-apis)
- [使用 `ModuleRunner` API 进行服务端渲染](/changes/ssr-using-modulerunner)
- [构建过程中的共享插件](/changes/shared-plugins-during-build)

## 目标用户 {#target-users}

本指南为终端用户提供了关于环境的基本概念。

插件作者可以使用更一致的 API 与当前环境配置进行交互。如果你正在基于 Vite 进行开发，[环境 API 插件指南](./api-environment-plugins.md) 描述了扩展插件 API 如何支持多个自定义环境。

框架可以自行决定在不同层次上暴露环境。如果你是框架作者，请继续阅读 [环境 API 框架指南](./api-environment-frameworks.md)，以了解环境 API 编程方面的内容。

对于运行时提供者，[环境 API 运行时指南](./api-environment-runtimes.md) 解释了如何提供自定义环境供框架和用户使用。
