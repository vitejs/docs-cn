<<<<<<< HEAD
# 从 v3 迁移 {#migration-from-v3}

## Rollup 3 {#rollup-3}

Vite 现在正式启用 [Rollup 3](https://github.com/vitejs/vite/issues/9870)，这使得我们可以简化 Vite 内部的资源处理并同时拥有许多改进。详情请查看 [Rollup 3 版本记录](https://github.com/rollup/rollup/releases/tag/v3.0.0)。

Rollup 3 尽最大可能兼容了 Rollup 2。如果你在项目中使用了自定义的 [`rollupOptions`](../config/build-options.md#rollup-options) 并（升级后）遇到了问题，请先查看 [Rollup 迁移指南](https://rollupjs.org/migration/) 来更新升级你的配置。

## 现代浏览器基准线变化 {#modern-browser-baseline-change}

当前对于现代浏览器的构建目标及现调整为了默认 `safari14` 以求更广的 ES2020 兼容性（从 `safari13` 升级）。这意味着现代化构建现在可以使用 [`BigInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)，同时 [空值合并运算符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing) 将不再被转译。如果你需要支持更旧版本的浏览器，你可以照常添加 [`@vitejs/plugin-legacy`](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)。
=======
# Migration from v4

## Node.js Support

Vite no longer supports Node.js 14 / 16 / 17 / 19, which reached its EOL. Node.js 18 / 20+ is now required.

## Deprecate CJS Node API

The CJS Node API of Vite is deprecated. When calling `require('vite')`, a deprecation warning is now logged. You should update your files or frameworks to import the ESM build of Vite instead.

In a basic Vite project, make sure:

1. The `vite.config.js` file content is using the ESM syntax.
2. The closest `package.json` file has `"type": "module"`, or use the `.mjs` extension, e.g. `vite.config.mjs`.

For other projects, there are a few general approaches:

- **Configure ESM as default, opt-in to CJS if needed:** Add `"type": "module"` in the project `package.json`. All `*.js` files are now interpreted as ESM and needs to use the ESM syntax. You can rename a file with the `.cjs` extension to keep using CJS instead.
- **Keep CJS as default, opt-in to ESM if needed:** If the project `package.json` does not have `"type": "module"`, all `*.js` files are interpreted as CJS. You can rename a file with the `.mjs` extension to use ESM instead.
- **Dynamically import Vite:** If you need to keep using CJS, you can dynamically import Vite using `import('vite')` instead. This requires your code to be written in an `async` context, but should still be manageable as Vite's API is mostly asynchronous.

See the [troubleshooting guide](https://vitejs.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated) for more information.
>>>>>>> ef6be1623c7e7bc80a889797f525792c56df9d42

## 其他一般性变化 {#general-changes}

<<<<<<< HEAD
### 编码 {#encoding}

构建的默认字符集现在是 utf8（查看 [#10753](https://github.com/vitejs/vite/issues/10753) 了解更多细节）。

### 以字符串形式导入 CSS {#importing-css-as-a-string}

在过往的 Vite 3 之中，以默认导入形式导入一个 `.css` 文件的可能会造成对 CSS 的双重加载。
=======
### Allow path containing `.` to fallback to index.html

In Vite 4, accessing a path containing `.` did not fallback to index.html even if `appType` is set to `'SPA'` (default).
From Vite 5, it will fallback to index.html.

Note that the browser will no longer show the 404 error message in the console if you point the image path to a non-existent file (e.g. `<img src="./file-does-not-exist.png">`).

### Manifest files are now generated in `.vite` directory by default
>>>>>>> ef6be1623c7e7bc80a889797f525792c56df9d42

In Vite 4, the manifest files (`build.manifest`, `build.ssrManifest`) was generated in the root of `build.outDir` by default. From Vite 5, those will be generated in the `.vite` directory in the `build.outDir` by default.

<<<<<<< HEAD
这种双重加载出现的原因是 `.css` 文件是将会被释放（emit）到最终产物的，并且很可能 CSS 字符串将会在应用代码中被使用到，就比如被框架运行时注入的时候。对于现在的 Vite 4，`.css` 默认导出 [已经被废弃](https://github.com/vitejs/vite/issues/11094)。在这种情况下你将需要使用 `?inline` 这个查询参数后缀，而这时将不会将导入的 `.css` 样式文件释放到最终产物。
=======
### CLI shortcuts require an additional `Enter` press
>>>>>>> ef6be1623c7e7bc80a889797f525792c56df9d42

CLI shortcuts, like `r` to restart the dev server, now require an additional `Enter` press to trigger the shortcut. For example, `r + Enter` to restart the dev server.

<<<<<<< HEAD
### 默认情况下的生产构建 {#production-builds-by-default}

不管所传递的 `--mode` 是什么，`vite build` 总是构建生产版本。之前，若将 `mode` 改为 `production` 之外的模式会构建开发版本，如果现在希望用于开发构建，可以在 `.env.{mode}` 文件中设置 `NODE_ENV=development`。

在本次变动中，如果 `process.env.NODE_ENV` 已经被定义，`vite dev` 和 `vite build` 将不再覆盖它。所以如果在构建前设置了 `process.env.NODE_ENV = 'development'`，将会构建开发版本。这在并行执行多个构建或开发服务器时提供了更多的控制权。

请参阅更新后的 [`mode` 文档](/guide/env-and-mode.md#modes) 了解更多详细信息。

### 环境变量 {#environment-variables}

Vite 现在使用 `dotenv` 16 和 `dotenv-expand` 9（之前是 `dotenv` 14 和 `dotenv-expand` 5）如果你有一个包含 `#` 或者 `` ` `` 的值，你将需要将它们以双引号包裹起来。

```diff
-VITE_APP=ab#cd`ef
+VITE_APP="ab#cd`ef"
```

了解更多详情，请查看 [`dotenv`](https://github.com/motdotla/dotenv/blob/master/CHANGELOG.md) 和 [`dotenv-expand` 更新日志](https://github.com/motdotla/dotenv-expand/blob/master/CHANGELOG.md)。
=======
This change prevents Vite from swallowing and controlling OS-specific shortcuts, allowing better compatibility when combining the Vite dev server with other processes, and avoids the [previous caveats](https://github.com/vitejs/vite/pull/14342).

## Removed Deprecated APIs

- Default exports of CSS files (e.g `import style from './foo.css'`): Use the `?inline` query instead
- `import.meta.globEager`: Use `import.meta.glob('*', { eager: true })` instead
- `ssr.format: 'cjs`' and `legacy.buildSsrCjsExternalHeuristics` ([#13816](https://github.com/vitejs/vite/discussions/13816))
>>>>>>> ef6be1623c7e7bc80a889797f525792c56df9d42

## 进阶 {#advanced}

下列改动仅会影响到插件/工具的作者：

<<<<<<< HEAD
- [[#11036] feat(client)!: remove never implemented hot.decline](https://github.com/vitejs/vite/issues/11036)
  - 使用 `hot.invalidate` 来代替
- [[#9669] feat: align object interface for `transformIndexHtml` hook](https://github.com/vitejs/vite/issues/9669)
  - 使用 `order` 来代替 `enforce`
=======
- [[#14119] refactor!: merge `PreviewServerForHook` into `PreviewServer` type](https://github.com/vitejs/vite/pull/14119)
>>>>>>> ef6be1623c7e7bc80a889797f525792c56df9d42

此外，还有其他一些只影响少数用户的破坏性变化。

<<<<<<< HEAD
- [[#11101] feat(ssr)!: remove dedupe and mode support for CJS](https://github.com/vitejs/vite/pull/11101)
  - 您应该迁移到 SSR 的默认 ESM 模式，CJS SSR 支持可能会在下一个 Vite 主要版本删除。
- [[#10475] feat: handle static assets in case-sensitive manner](https://github.com/vitejs/vite/pull/10475)
  - 您的项目不应该依赖于会被不同操作系统忽略大小写的文件名。
- [[#10996] fix!: make `NODE_ENV` more predictable](https://github.com/vitejs/vite/pull/10996)
  - 有关此更改的解释，请参阅 PR。
- [[#10903] refactor(types)!: remove facade type files](https://github.com/vitejs/vite/pull/10903)

## 从 v2 迁移 {#migration-from-v2}

请先查看之前 Vite v3 文档中的 [Migration from v2 Guide](https://cn.vitejs.dev/guide/migration-from-v2.html) 了解迁移到 v3 所需要的更改，然后再继续执行本页提到的相关更改。
=======
- [[#14098] fix!: avoid rewriting this (reverts #5312)](https://github.com/vitejs/vite/pull/14098)
  - Top level `this` was rewritten to `globalThis` by default when building. This behavior is now removed.
- [[#14231] feat!: add extension to internal virtual modules](https://github.com/vitejs/vite/pull/14231)
  - Internal virtual modules' id now has an extension (`.js`).

## Migration from v3

Check the [Migration from v3 Guide](https://v4.vitejs.dev/guide/migration.html) in the Vite v4 docs first to see the needed changes to port your app to Vite v4, and then proceed with the changes on this page.
>>>>>>> ef6be1623c7e7bc80a889797f525792c56df9d42
