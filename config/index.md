---
title: Configuring Vite
---

# Configuring Vite {#configuring-vite}

When running `vite` from the command line, Vite will automatically resolve a configuration file named `vite.config.js` in the [project root directory](../guide/#index-html-and-project-root) (other JS and TS extensions are also supported).

The most basic configuration file looks like this:

```js
// vite.config.js
export default {
  // Configuration options
}
```

Note: Even if the project does not enable `type: "module"` in `package.json`, Vite supports using ESM syntax in the configuration file. In this case, the configuration file will be preprocessed automatically before being loaded.

You can explicitly specify a configuration file via the `--config` command line option (resolved relative to the `cwd` path)

```bash
vite --config my-config.js
```

## Config Intellisense {#config-intellisense}

Since Vite comes with TypeScript types, you can achieve Intellisense with the help of IDE and jsdoc:

```js
/** @type {import('vite').UserConfig} */
export default {
  // ...
}
```

Alternatively, you can use the `defineConfig` utility function to get type hints without jsdoc annotations:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  // ...
})
```

Vite also directly supports TypeScript configuration files. You can use the `defineConfig` utility function or the `satisfies` operator in `vite.config.ts`:

```ts
import type { UserConfig } from 'vite'

export default {
  // ...
} satisfies UserConfig
```

## Conditional Config {#conditional-config}

If the configuration file needs to determine options based on the command (`dev`/`serve` or `build`) or different [modes](/guide/env-and-mode), or if it is an SSR build (`isSsrBuild`), or a preview of the build output (`isPreview`), you can choose to export a function:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  if (command === 'serve') {
    return {
      // dev specific config
    }
  } else {
    // command === 'build'
    return {
      // build specific config
    }
  }
})
```

Note that in Vite's API, the value of `command` is `serve` in development mode (in the CLI, `vite dev` and `vite serve` are aliases for [`vite`](../guide/cli.md#vite)), and `build` in production mode ([`vite build`](../guide/cli.md#vite-build)).

`isSsrBuild` and `isPreview` are additional optional flags used to distinguish the types of `build` and `serve` commands. Some tools that load Vite configurations may not support these flags and will pass `undefined`. Therefore, it is recommended to use explicit comparisons with `true` and `false`.

## Async Config {#async-config}

If the configuration needs to call an async function, you can export an async function instead. This async function can also be passed through `defineConfig` for better Intellisense:

```js twoslash
import { defineConfig } from 'vite'
// ---cut---
export default defineConfig(async ({ command, mode }) => {
  const data = await asyncFunction()
  return {
    // vite config
  }
})
```

## Using Environment Variables in Config {#using-environment-variables-in-config}

Environment variables are usually accessed from `process.env`.

Note that Vite does not load `.env` files by default, as these files need to be determined after the Vite configuration is executed. For example, the `root` and `envDir` options affect the loading behavior. However, when you do need it, you can use the `loadEnv` function exported by Vite to load a specific `.env` file.

```js twoslash
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  // Load .env file based on the `mode` in the current working directory
  // Set the third parameter to '' to load all environment variables, regardless of whether they have the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '')
  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
  }
})
```
