# 后端集成 {#backend-integration}

:::tip Note
如果你想使用传统的后端（如 Rails, Laravel）来服务 HTML，但使用 Vite 来服务其他资源，可以查看在 [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends) 上的已有的后端集成列表。

如果你需要自定义集成，你可以按照本指南的步骤配置它：
:::

1. 在你的 Vite 配置中配置入口文件和启用创建 `manifest`：

   ```js twoslash [vite.config.js]
   import { defineConfig } from 'vite'
   // ---cut---
   export default defineConfig({
     build: {
       // 在 outDir 中生成 .vite/manifest.json
       manifest: true,
       rollupOptions: {
         // 覆盖默认的 .html 入口
         input: '/path/to/main.js'
       }
     }
   })
   ```

   如果你没有禁用 [module preload 的 polyfill](/config/build-options.md#build-polyfillmodulepreload)，你还需在你的入口处添加此 polyfill：

   ```js
   // 在你应用的入口起始处添加此 polyfill
   import 'vite/modulepreload-polyfill'
   ```

2. 在开发环境中，在服务器的 HTML 模板中注入以下内容（用正在运行的本地 URL 替换 `http://localhost:5173`）：

   ```html
   <!-- 如果是在开发环境中 -->
   <script type="module" src="http://localhost:5173/@vite/client"></script>
   <script type="module" src="http://localhost:5173/main.js"></script>
   ```

   为了正确地提供资源，你有两种选项：

   - 确保服务器被配置过，将会拦截代理资源请求给到 Vite 服务器
   - 设置 [`server.origin`](/config/server-options.md#server-origin) 以求生成的资源链接将以服务器 URL 形式被解析而非一个相对路径

   这对于图片等资源的正确加载是必需的。

   如果你正使用 `@vitejs/plugin-react` 配合 React，你还需要在上述脚本前添加下面这个，因为插件不能修改你正在服务的 HTML（请将 `http://localhost:5173` 替换为 Vite 正在运行的本地 URL）：

   ```html
   <script type="module">
     import RefreshRuntime from 'http://localhost:5173/@react-refresh'
     RefreshRuntime.injectIntoGlobalHook(window)
     window.$RefreshReg$ = () => {}
     window.$RefreshSig$ = () => (type) => type
     window.__vite_plugin_react_preamble_installed__ = true
   </script>
   ```

3. 在生产环境中：在运行 `vite build` 之后，一个 `.vite/manifest.json` 文件将与静态资源文件一同生成。一个示例清单文件会像下面这样：

   ```json [.vite/manifest.json]
   {
     "_shared-B7PI925R.js": {
       "file": "assets/shared-B7PI925R.js",
       "name": "shared",
       "css": ["assets/shared-ChJ_j-JJ.css"]
     },
     "_shared-ChJ_j-JJ.css": {
       "file": "assets/shared-ChJ_j-JJ.css",
       "src": "_shared-ChJ_j-JJ.css"
     },
     "baz.js": {
       "file": "assets/baz-B2H3sXNv.js",
       "name": "baz",
       "src": "baz.js",
       "isDynamicEntry": true
     },
     "views/bar.js": {
       "file": "assets/bar-gkvgaI9m.js",
       "name": "bar",
       "src": "views/bar.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "dynamicImports": ["baz.js"]
     },
     "views/foo.js": {
       "file": "assets/foo-BRBmoGS9.js",
       "name": "foo",
       "src": "views/foo.js",
       "isEntry": true,
       "imports": ["_shared-B7PI925R.js"],
       "css": ["assets/foo-5UjPuW-k.css"]
     }
   }
   ```

   - 清单是一个 `Record<name, chunk>` 结构的对象。
   - 对于 入口 或动态入口 chunk，键是相对于项目根目录的资源路径。
   - 对于非入口 chunk，键是生成文件的名称并加上前缀 `_`。
   - Chunk 将信息包含在其静态和动态导入上（两者都是映射到清单中相应 chunk 的键），以及任何与之相关的 CSS 和资源文件。

4. 你可以利用这个文件来渲染带有哈希文件名的链接或预加载指令。

   这是一个用来渲染正确链接的 HTML 模板示例。这里的语法仅用于解释，
   你需要用你的服务器模板语言来替换。`importedChunks` 函数只是
   用来说明，并不是 Vite 提供的。

   ```html
   <!-- 如果是生产环境 -->

   <!-- 对于 manifest[name].css 中的 cssFile -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <!-- 对于 importedChunks(manifest, name) 中的 chunk  -->
   <!-- 对于 chunk.css 中的 cssFile -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <script type="module" src="/{{ manifest[name].file }}"></script>

   <!-- 对于 importedChunks(manifest, name) 中的 chunk  -->
   <link rel="modulepreload" href="/{{ chunk.file }}" />
   ```

   具体来说，一个生成 HTML 的后端在给定 manifest 文件和一个入口文件的情况下，
   应该包含以下标签：

   - 对于入口文件 chunk 的 `css` 列表中的每个文件，都应包含一个 `<link rel="stylesheet">` 标签。
   - 递归追踪入口文件的 `imports` 列表中的所有 chunk，并为每个导入的 chunk 的每个 CSS 文件
     包含一个 `<link rel="stylesheet">` 标签。
   - 对于入口文件 chunk 的 `file` 键的标签（对于 JavaScript 是
     `<script type="module">`，对于 CSS 是 `<link rel="stylesheet">`）
   - 可选项，对于每个导入的 JavaScript chunk 的 `file` 键的 `<link rel="modulepreload">` 标签，
     同样从入口文件 chunk 开始递归追踪导入。

   按照上面的示例 manifest，对于入口文件 `views/foo.js`，在生产环境中应包含以下标签：

   ```html
   <link rel="stylesheet" href="assets/foo-5UjPuW-k.css" />
   <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
   <script type="module" src="assets/foo-BRBmoGS9.js"></script>
   <!-- 可选 -->
   <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
   ```

   而对于入口文件 `views/bar.js`，应该包含以下标签：

   ```html
   <link rel="stylesheet" href="assets/shared-ChJ_j-JJ.css" />
   <script type="module" src="assets/bar-gkvgaI9m.js"></script>
   <!-- 可选 -->
   <link rel="modulepreload" href="assets/shared-B7PI925R.js" />
   ```

   ::: details `importedChunks` 的伪代码实现
   `importedChunks` 在 TypeScript 中的一个伪实现示例
   （这需要根据您的编程语言和模板语言进行调整）：

   ```ts
   import type { Manifest, ManifestChunk } from 'vite'

   export default function importedChunks(
     manifest: Manifest,
     name: string,
   ): ManifestChunk[] {
     const seen = new Set<string>()

     function getImportedChunks(chunk: ManifestChunk): ManifestChunk[] {
       const chunks: ManifestChunk[] = []
       for (const file of chunk.imports ?? []) {
         const importee = manifest[file]
         if (seen.has(file)) {
           continue
         }
         seen.add(file)

         chunks.push(...getImportedChunks(importee))
         chunks.push(importee)
       }

       return chunks
     }

     return getImportedChunks(manifest[name])
   }
   ```

   :::
