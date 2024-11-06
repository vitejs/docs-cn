# 使用 `Environment` 实例 {#using-environment-instances}

:::warning 实验性
这个 API 的初始版本在 Vite 5.1 中以 "Vite Runtime API" 的名字被引入。这份指南介绍了经过修订后的 API，被重新命名为环境 API（Environment API）。这个 API 将在 Vite 6 中作为实验性功能发布。你现在已经可以在最新的 `vite@6.0.0-beta.x` 版本中进行测试。

资料：

- [反馈讨论](https://github.com/vitejs/vite/discussions/16358) 我们在此处收集新 API 的反馈。
- [环境 API PR](https://github.com/vitejs/vite/pull/16471) 新 API 在此处被实现并进行了审查。

在参与测试这个提议的过程中，请与我们分享您的反馈。
:::

## 访问环境 {#accessing-the-environments}
在开发阶段，可以使用 `server.environments` 来访问开发服务器中的可用环境：

```js
// 创建服务器，或通过 configureServer 钩子来获取
const server = await createServer(/* 选项 */)

const environment = server.environments.client
environment.transformRequest(url)
console.log(server.environments.ssr.moduleGraph)
```

你也可以从插件中访问当前环境。更多详情请参见 [针对插件的环境 API](./api-environment-plugins.md#accessing-the-current-environment-in-hooks)。

## `DevEnvironment` 类 {#devenvironment-class}

在开发阶段，每个环境都是 `DevEnvironment` 类的一个实例：

```ts
class DevEnvironment {
  /**
   * 环境在 Vite 服务器中的唯一标识符。
   * 默认情况下，Vite 暴露 'client' 和 'ssr' 环境。
   */
  name: string
  /**
   * 用于在目标运行时的关联模块运行器中
   * 发送和接收消息的通信通道。
   */
  hot: HotChannel | null
  /**
   * 模块节点的图，包含处理过的模块之间的
   * 导入关系和处理代码的缓存结果。
   */
  moduleGraph: EnvironmentModuleGraph
  /**
   * 为此环境解析的插件，包括使用按环境的
   * `create` 钩子创建的插件。
   */
  plugins: Plugin[]
  /**
   * 允许通过环境插件管道解析、加载
   * 和转换代码。
   */
  pluginContainer: EnvironmentPluginContainer
  /**
   * 为此环境解析的配置选项。服务器全局范围内的选项
   * 作为所有环境的默认值，并可以被覆盖（解析条件、
   * 外部依赖、优化的依赖）。
   */
  config: ResolvedConfig & ResolvedDevEnvironmentOptions

  constructor(name, config, { hot, options }: DevEnvironmentSetup)

  /**
   * 解析 URL 到一个 id，加载它，并使用插件管道
   * 处理代码。模块图也会被更新。
   */
  async transformRequest(url: string): TransformResult

  /**
   * 注册一个低优先级处理的请求。这对于避免瀑布效应
   * 非常有用。Vite 服务器有关于其他请求导入模块的
   * 信息，因此它可以预热模块图，使得当模块被请求时
   * 已经处理完毕。
   */
  async warmupRequest(url: string): void
}
```

其中 `TransformResult` 是：

```ts
interface TransformResult {
  code: string
  map: SourceMap | { mappings: '' } | null
  etag?: string
  deps?: string[]
  dynamicDeps?: string[]
}
```

Vite 服务器中的环境实例允许你使用 `environment.transformRequest(url)` 方法处理一个 URL。这个函数将使用插件管道将 `url` 解析为模块 `id`，加载它（从文件系统读取文件或通过实现虚拟模块的插件），然后转换代码。在转换模块时，将通过创建或更新相应的模块节点，在环境模块图中记录导入和其他元数据。处理完成后，转换结果也存储在模块中。

:::info transformRequest 命名
在这个提议的当前版本中，我们使用 `transformRequest(url)` 和 `warmupRequest(url)`，这样对于习惯于 Vite 当前 API 的用户来说，会更容易讨论和理解。在发布之前，我们也可以借此机会审查这些命名。例如，可以命名为 `environment.processModule(url)` 或 `environment.loadModule(url)`，借鉴于 Rollup 的插件钩子中的 `context.load(id)`。目前，我们认为保留当前的名称并推迟这个讨论是更好的选择。
:::

## 独立的模块图 {#separate-module-graphs}

每个环境都有一个独立的模块图。所有模块图都有相同的签名，因此可以实现通用算法来爬取或查询图，而无需依赖环境。`hotUpdate` 是一个很好的例子。当一个文件被修改时，将使用每个环境的模块图来发现受影响的模块，并为每个环境独立执行 HMR。

::: info
Vite v5 有一个混合的客户端和 SSR 模块图。给定一个未处理的或无效的节点，无法知道它对应的是客户端、SSR 还是两者都有的环境。模块节点有一些带有前缀的属性，如 `clientImportedModules` 和 `ssrImportedModules`（以及 `importedModules`，返回两者的并集）。`importers` 包含了每个模块节点的客户端和 SSR 环境的所有导入者。模块节点还有 `transformResult` 和 `ssrTransformResult`。存在一个向后兼容层允许生态系统从已弃用的 `server.moduleGraph` 迁移过来。
:::

每个模块都由一个 `EnvironmentModuleNode` 实例表示。模块可能在图中被注册，但尚未被处理（在这种情况下，`transformResult` 将为 `null`）。在模块处理后，`importers` 和 `importedModules` 也会被更新。

```ts
class EnvironmentModuleNode {
  environment: string

  url: string
  id: string | null = null
  file: string | null = null

  type: 'js' | 'css'

  importers = new Set<EnvironmentModuleNode>()
  importedModules = new Set<EnvironmentModuleNode>()
  importedBindings: Map<string, Set<string>> | null = null

  info?: ModuleInfo
  meta?: Record<string, any>
  transformResult: TransformResult | null = null

  acceptedHmrDeps = new Set<EnvironmentModuleNode>()
  acceptedHmrExports: Set<string> | null = null
  isSelfAccepting?: boolean
  lastHMRTimestamp = 0
  lastInvalidationTimestamp = 0
}
```

`environment.moduleGraph` 是 `EnvironmentModuleGraph` 的一个实例：

```ts
export class EnvironmentModuleGraph {
  environment: string

  urlToModuleMap = new Map<string, EnvironmentModuleNode>()
  idToModuleMap = new Map<string, EnvironmentModuleNode>()
  etagToModuleMap = new Map<string, EnvironmentModuleNode>()
  fileToModulesMap = new Map<string, Set<EnvironmentModuleNode>>()

  constructor(
    environment: string,
    resolveId: (url: string) => Promise<PartialResolvedId | null>,
  )

  async getModuleByUrl(
    rawUrl: string,
  ): Promise<EnvironmentModuleNode | undefined>

  getModulesByFile(file: string): Set<EnvironmentModuleNode> | undefined

  onFileChange(file: string): void

  invalidateModule(
    mod: EnvironmentModuleNode,
    seen: Set<EnvironmentModuleNode> = new Set(),
    timestamp: number = Date.now(),
    isHmr: boolean = false,
  ): void

  invalidateAll(): void

  async ensureEntryFromUrl(
    rawUrl: string,
    setIsSelfAccepting = true,
  ): Promise<EnvironmentModuleNode>

  createFileOnlyEntry(file: string): EnvironmentModuleNode

  async resolveUrl(url: string): Promise<ResolvedUrl>

  updateModuleTransformResult(
    mod: EnvironmentModuleNode,
    result: TransformResult | null,
  ): void

  getModuleByEtag(etag: string): EnvironmentModuleNode | undefined
}
```
