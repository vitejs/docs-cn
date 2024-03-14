# 后端集成 {#backend-integration}

:::tip Note
如果你想使用传统的后端（如 Rails, Laravel）来服务 HTML，但使用 Vite 来服务其他资源，可以查看在 [Awesome Vite](https://github.com/vitejs/awesome-vite#integrations-with-backends) 上的已有的后端集成列表。

如果你需要自定义集成，你可以按照本指南的步骤配置它：
:::

1. 在你的 Vite 配置中配置入口文件和启用创建 `manifest`：

   ```js
   // vite.config.js
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

   ```json
   {
     "main.js": {
       "file": "assets/main.4889e940.js",
       "src": "main.js",
       "isEntry": true,
       "dynamicImports": ["views/foo.js"],
       "css": ["assets/main.b82dbe22.css"],
       "assets": ["assets/asset.0ab0f9cd.png"],
       "imports": ["_shared.83069a53.js"]
     },
     "views/foo.js": {
       "file": "assets/foo.869aea0d.js",
       "src": "views/foo.js",
       "isDynamicEntry": true,
       "imports": ["_shared.83069a53.js"]
     },
     "_shared.83069a53.js": {
       "file": "assets/shared.83069a53.js",
       "css": ["assets/shared.a834bfc3.css"]
     }
   }
   ```

   - 清单是一个 `Record<name, chunk>` 结构的对象。
   - 对于 入口 或动态入口 chunk，键是相对于项目根目录的资源路径。
   - 对于非入口 chunk，键是生成文件的名称并加上前缀 `_`。
   - Chunk 将信息包含在其静态和动态导入上（两者都是映射到清单中相应 chunk 的键)，以及任何与之相关的 CSS 和资源文件。

<<<<<<< HEAD
   你可以使用这个文件来渲染链接或者用散列文件名预加载指令（注意：这里的语法只是为了解释，实际使用时请你的服务器模板语言代替）：

   ```html
   <!-- 如果是在生产环境中 -->
   <link rel="stylesheet" href="/assets/{{ manifest['main.js'].css }}" />
   <script type="module" src="/assets/{{ manifest['main.js'].file }}"></script>
=======
4. You can use this file to render links or preload directives with hashed filenames.

   Here is an example HTML template to render the proper links. The syntax here is for
   explanation only, substitute with your server templating language. The `importedChunks`
   function is for illustration and isn't provided by Vite.

   ```html
   <!-- if production -->

   <!-- for cssFile of manifest[name].css -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <!-- for chunk of importedChunks(manifest, name) -->
   <!-- for cssFile of chunk.css -->
   <link rel="stylesheet" href="/{{ cssFile }}" />

   <script type="module" src="/{{ manifest[name].file }}"></script>

   <!-- for chunk of importedChunks(manifest, name) -->
   <link rel="modulepreload" src="/{{ chunk.file }}" />
   ```

   Specifically, a backend generating HTML should include the following tags given a manifest
   file and an entry point:

   - A `<link rel="stylesheet">` tag for each file in the entry point chunk's `css` list
   - Recursively follow all chunks in the entry point's `imports` list and include a
     `<link rel="stylesheet">` tag for each css file of each imported chunk.
   - A tag for the `file` key of the entry point chunk (`<script type="moudle">` for Javascript,
     or `<link rel="stylesheet">` for css)
   - Optionally, `<link rel="modulepreload">` tag for the `file` of each imported Javascript
     chunk, again recursively following the imports starting from the entry point chunk.

   Following the above example manifest, for the entry point `main.js` the following tags should be included in production:

   ```html
   <link rel="stylesheet" href="assets/main.b82dbe22.css" />
   <link rel="stylesheet" href="assets/shared.a834bfc3.css" />
   <script type="module" src="assets/main.4889e940.js"></script>
   <!-- optional -->
   <link rel="modulepreload" src="assets/shared.83069a53.js" />
   ```

   While the following should be included for the entry point `views/foo.js`:

   ```html
   <link rel="stylesheet" href="assets/shared.a834bfc3.css" />
   <script type="module" src="assets/foo.869aea0d.js"></script>
   <!-- optional -->
   <link rel="modulepreload" src="assets/shared.83069a53.js" />
>>>>>>> d4cb9d97376cb7c3bb435d307c79b28e206f1c72
   ```
