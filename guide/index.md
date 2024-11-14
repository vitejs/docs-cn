# Getting Started {#getting-started}

<audio id="vite-audio">
  <source src="/vite.mp3" type="audio/mpeg">
</audio>

## Overview {#overview}

Vite (French for "quick", pronounced `/vit/`<button id="play-vite-audio" onclick="document.getElementById('vite-audio').play();" style="border: none; padding: 3px; border-radius: 4px; vertical-align: bottom;"><svg style="height:2em;width:2em"><use href="/voice.svg#voice" /></svg></button>, pronounced "veet") is a new kind of front-end build tool that significantly improves the front-end development experience. It consists of two main parts:


```bash
git clone https://github.com/vitejs/vite.git
cd vite
pnpm install
cd packages/vite
pnpm run build
pnpm link --global # 在这一步中可使用你喜欢的包管理器
```
你可以通过 [StackBlitz](https://vite.new/) 在线试用 vite。它直接在浏览器中运行基于 Vite 的构建，因此它与本地开发几乎无差别，同时无需在你的机器上安装任何东西。你可以浏览 `vite.new/{template}` 来选择你要使用的框架。

目前支持的模板预设如下：

|             JavaScript              |                TypeScript                 |
| :---------------------------------: | :---------------------------------------: |
| [vanilla](https://vite.new/vanilla) | [vanilla-ts](https://vite.new/vanilla-ts) |
|     [vue](https://vite.new/vue)     |     [vue-ts](https://vite.new/vue-ts)     |
|   [react](https://vite.new/react)   |   [react-ts](https://vite.new/react-ts)   |
|  [preact](https://vite.new/preact)  |  [preact-ts](https://vite.new/preact-ts)  |
|     [lit](https://vite.new/lit)     |     [lit-ts](https://vite.new/lit-ts)     |
|  [svelte](https://vite.new/svelte)  |  [svelte-ts](https://vite.new/svelte-ts)  |
|   [solid](https://vite.new/solid)   |   [solid-ts](https://vite.new/solid-ts)   |
|    [qwik](https://vite.new/qwik)    |    [qwik-ts](https://vite.new/qwik-ts)    |
