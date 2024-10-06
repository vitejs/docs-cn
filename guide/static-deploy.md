# 部署静态站点 {#deploying-a-static-site}

本指南建立在以下几个假设基础之上：

- 你正在使用的是默认的构建输出路径（`dist`）。这个路径 [可以通过 `build.outDir` 更改](/config/build-options.md#build-outdir)，在这种情况下，你可以从这篇指南中找到所需的指引。
- 你正在使用 NPM；或者 Yarn 等其他可以运行下面的脚本指令的包管理工具。
- Vite 已作为一个本地开发依赖（dev dependency）安装在你的项目中，并且你已经配置好了如下的 npm scripts：

```json [package.json]
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

值得注意的是 `vite preview` 用作预览本地构建，而不应直接作为生产服务器。

::: tip 注意
本篇指南提供了部署 Vite 静态站点的说明。Vite 也对服务端渲染（SSR）有了实验性的支持。SSR 是指支持在 Node 中运行相应应用的前端框架，预渲染成 HTML，最后在客户端激活（hydrate）。查看 [SSR 指南](./ssr) 了解更多细节。另一方面，如果你在寻找与传统服务端框架集成的方式，那么请查看 [后端集成](./backend-integration) 章节。
:::

## 构建应用 {#building-the-app}

你可以运行 `npm run build` 命令来执行应用的构建。

```bash
$ npm run build
```

默认情况下，构建会输出到 `dist` 文件夹中。你可以部署这个 `dist` 文件夹到任何你喜欢的平台。

### 本地测试应用 {#testing-the-app-locally}

当你构建完成应用后，你可以通过运行 `npm run preview` 命令，在本地测试该应用。

```bash
$ npm run preview
```

`vite preview` 命令会在本地启动一个静态 Web 服务器，将 `dist` 文件夹运行在 `http://localhost:4173`。这样在本地环境下查看该构建产物是否正常可用就方便多了。

你可以通过 `--port` 参数来配置服务的运行端口。

```json [package.json]
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

现在 `preview` 命令会将服务器运行在 `http://localhost:8080`。

## GitHub Pages {#github-pages}

1. 在 `vite.config.js` 中设置正确的 `base`。

   如果你正要部署到 `https://<USERNAME>.github.io/`，或者通过 GitHub Pages 部署到一个自定义域名（例如 `www.example.com`），请将 `base` 设置为 `'/'`。或者，你也可以从配置中移除 `base`，因为它默认为 `'/'`。

   如果你正在部署到 `https://<USERNAME>.github.io/<REPO>/`（例如你的仓库地址为 `https://github.com/<USERNAME>/<REPO>`），那么请将 `base` 设置为 `'/<REPO>/'`。

2. 进入仓库 settings 页面的 GitHub Pages 配置，选择部署来源为“GitHub Actions”，这将引导你创建一个构建和部署项目的工作流程，我们提供了一个安装依赖项和使用 npm 构建的工作流程样本：

   ```yml
   # 将静态内容部署到 GitHub Pages 的简易工作流程
   name: Deploy static content to Pages

   on:
     # 仅在推送到默认分支时运行。
     push:
       branches: ['main']

     # 这个选项可以使你手动在 Action tab 页面触发工作流
     workflow_dispatch:

   # 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages。
   permissions:
     contents: read
     pages: write
     id-token: write

   # 允许一个并发的部署
   concurrency:
     group: 'pages'
     cancel-in-progress: true

   jobs:
     # 单次部署的工作描述
     deploy:
       environment:
         name: github-pages
         url: ${{ steps.deployment.outputs.page_url }}
       runs-on: ubuntu-latest
       steps:
         - name: Checkout
           uses: actions/checkout@v4
         - name: Set up Node
           uses: actions/setup-node@v4
           with:
             node-version: 20
             cache: 'npm'
         - name: Install dependencies
           run: npm ci
         - name: Build
           run: npm run build
         - name: Setup Pages
           uses: actions/configure-pages@v4
         - name: Upload artifact
           uses: actions/upload-pages-artifact@v3
           with:
             # Upload dist folder
             path: './dist'
         - name: Deploy to GitHub Pages
           id: deployment
           uses: actions/deploy-pages@v4
   ```

## GitLab Pages 配合 GitLab CI {#gitlab-pages-and-gitlab-ci}

1. 在 `vite.config.js` 中设置正确的 `base`。

   如果你要部署在 `https://<USERNAME or GROUP>.gitlab.io/` 上，你可以省略 `base` 使其默认为 `'/'`。

   如果你要部署在 `https://<USERNAME or GROUP>.gitlab.io/<REPO>/` 上，例如你的仓库地址为 `https://gitlab.com/<USERNAME>/<REPO>`，那么请设置 `base` 为 `'/<REPO>/'`。

2. 在项目根目录创建一个 `.gitlab-ci.yml` 文件，并包含以下内容。它将使得每次你更改内容时都重新构建与部署站点：

   ```yaml [.gitlab-ci.yml]
   image: node:16.5.0
   pages:
     stage: deploy
     cache:
       key:
         files:
           - package-lock.json
         prefix: npm
       paths:
         - node_modules/
     script:
       - npm install
       - npm run build
       - cp -a dist/. public/
     artifacts:
       paths:
         - public
     rules:
       - if: $CI_COMMIT_BRANCH == $CI_DEFAULT_BRANCH
   ```

## Netlify {#netlify}

### Netlify CLI {#netlify-cli}

1. 安装 [Netlify CLI](https://cli.netlify.com/)。
2. 使用 `ntl init` 创建一个新站点。
3. 使用 `ntl deploy` 来部署。

```bash
# 安装 Netlify CLI
$ npm install -g netlify-cli

# 在 Netlify 中创建一个新站点
$ ntl init

# 部署一个独一无二的预览 URL
$ ntl deploy
```

Netlify CLI 会给你分享一个预览的 URL 来检查部署结果。当你准备好了发布生产版本时，请使用 `prod` 标志：

```bash
# 部署站点到生产环境
$ ntl deploy --prod
```

### Netlify with Git {#netlify-with-git}

1. 将你的代码推送到 git 仓库（GitHub、GitLab、BitBucket 或是 Azure DevOps 等服务）
2. 在 Netlify 中 [导入该项目](https://app.netlify.com/start)
3. 选择分支，输出目录，如果需要还可以设置环境变量。
4. 点击 **部署**
5. 你的 Vite 应用就部署完成了！

在你的项目被导入和部署后，所有对生产分支以外的其他分支（可能来自合并请求）的后续推送都会生成 [预览部署](https://docs.netlify.com/site-deploys/deploy-previews/)，所有对生产分支（通常是 "main"）的更改都会生成一个 [生产部署](https://docs.netlify.com/site-deploys/overview/#definitions)。

## Vercel {#vercel}

### Vercel CLI {#vercel-cli}

1. 安装 [Vercel CLI](https://vercel.com/cli) 并运行 `vercel` 来部署。
2. Vercel 会检测到你正在使用 Vite，并会为你开启相应的正确配置。
3. 你的应用被部署好了！（示例：[vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/)）

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
```

### Vercel for Git {#vercel-for-git}

1. 将你的代码推送到远程仓库（GitHub, GitLab, Bitbucket）
2. [导入你的 Vite 仓库](https://vercel.com/new) 到 Vercel
3. Vercel 会检测到你正在使用 Vite，并会为你的部署开启相应的正确配置。
4. 你的应用被部署好了！（示例：[vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/)）

在你的项目被导入和部署后，所有对分支的后续推送都会生成 [预览部署](https://vercel.com/docs/concepts/deployments/environments#preview)，而所有对生产分支（通常是"main"）的更改都会生成一个 [生产构建](https://vercel.com/docs/concepts/deployments/environments#production)

查看 Vercel 的 [Git 集成](https://vercel.com/docs/concepts/git) 了解更多细节。

## Cloudflare Pages {#cloudflare-pages}

### Cloudflare Pages via Wrangler {#cloudflare-pages-via-wrangler}

1. 安装 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).
2. 使用 `wrangler login`、通过你的 Cloudflare 账号完成 Wrangler 身份校验。
3. 运行你的构建命令
4. 使用 `npx wrangler pages deploy dist` 部署。

```bash
# 安装 Wrangler CLI
$ npm install -g wrangler

# 使用 CLI 工具登录 Cloudflare 账号
$ wrangler login

# 运行构建命令
$ npm run build

# 创建一个新的部署
$ npx wrangler pages deploy dist
```

在你的资产上传后，Wrangler 会给你一个预览 URL 来检查你的网站。当你登录到 Cloudflare Pages 仪表板时，你会看到你的新项目。

### Cloudflare Pages with Git {#cloudflare-pages-with-git}

1. 将你的代码推送到你的 Git 仓库（GitHub, GitLab）
2. 登录 Cloudflare 控制台，在 **Account Home** > **Pages** 下选择你的账号
3. 选择 **Create a new Project** 以及 **Connect Git** 选项
4. 选择你想要部署的 Git 项目，然后点击 **Begin setup**
5. 根据你所选择的 Vite 框架，在构建设置中选择相应的框架预设
6. 记得保存！然后部署吧！
7. 然后你的应用就部署完成了！（例如： `https://<PROJECTNAME>.pages.dev/`）

在你的项目被导入和部署后，所有对该分支的后续推送都会生成一个 [预览部署](https://developers.cloudflare.com/pages/platform/preview-deployments/)，除非你特意在 [控制分支构建](https://developers.cloudflare.com/pages/platform/branch-build-controls/) 的选项中写明不触发。所有对 **生产分支**（通常是 "main"）的更改都会生成一个 **生产构建**。

你也可以添加自定义域名，并自定义各个页面的构建设置。查看 [Cloudflare 页面与 Git 集成](https://developers.cloudflare.com/pages/get-started/#manage-your-site) 了解更多详情。

## Google Firebase {#google-firebase}

1. 确保已经安装 [firebase-tools](https://www.npmjs.com/package/firebase-tools)。

2. 在项目根目录创建 `firebase.json` 和 `.firebaserc` 两个文件，包含以下内容：

   ```json [firebase.json]
   {
     "hosting": {
       "public": "dist",
       "ignore": [],
       "rewrites": [
         {
           "source": "**",
           "destination": "/index.html"
         }
       ]
     }
   }
   ```

   ```js [.firebaserc]
   {
     "projects": {
       "default": "<YOUR_FIREBASE_ID>"
     }
   }
   ```

3. 运行 `npm run build` 后，通过 `firebase deploy` 命令部署。

## Surge {#surge}

1. 首先确保已经安装 [surge](https://www.npmjs.com/package/surge)。

2. 运行 `npm run build`。

3. 运行 `surge dist` 命令部署到 surge。

你也可以通过添加 `surge dist yourdomain.com` 部署到一个 [自定义域名](http://surge.sh/help/adding-a-custom-domain)。

## Azure 的静态网站应用 {#azure-static-web-apps}

你可以通过微软 Azure 的 [静态网站应用](https://aka.ms/staticwebapps) 服务来快速部署你的 Vite 应用。你只需：

- 注册 Azure 账号并获取一个订阅（subscription）的 key。可以在 [此处快速完成注册](https://azure.microsoft.com/free)。
- 将你的应用代码托管到 [GitHub](https://github.com)。
- 在 [VSCode](https://code.visualstudio.com) 中安装 [SWA 扩展](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)。

安装完此扩展后，进入你应用的根目录。打开 SWA 的扩展程序，登录 Azure，并点击 '+'，来创建一个全新的 SWA。系统会提示你指定所需的订阅 key。

按照扩展程序的启动向导，给你的应用程序起个名字，选择框架预设，并指定应用程序的根目录（通常为 `/`）以及构建文件的路径 `/dist`。此向导完成后，会在你的 repo 中的 `.github` 文件夹中创建一个 GitHub Action。

这个 action 致力于部署你的应用程序（可以在仓库的 Actions 标签中，查看相关进度），成功完成后，你可以点击 GitHub 中出现的 “浏览站点” 的按钮，查看你的应用程序。

## Render {#render}

你可以在 [Render](https://render.com/) 部署你的 Vite 应用。

1. 创建一个 [Render 账号](https://dashboard.render.com/register)

2. 在 [控制台](https://dashboard.render.com/) 页面点击 **New** 按钮并选择 **Static Site**。

3. 链接你的 GitHub/GitLab 账号或使用一个公共仓库

4. 指定一个项目名称和所用分支

   - **构建命令**：`npm install && npm run build`
   - **发布目录**：`dist`

5. 点击 **Create Static Site**

   你的应用将会被部署在 `https://<PROJECTNAME>.onrender.com/`。

默认情况下，推送到该指定分支的任何新的 commit 都会自动触发一个新的部署。[Auto-Deploy](https://render.com/docs/deploys#toggling-auto-deploy-for-a-service) 可以在项目设置中部署。

还可以为项目添加一个 [自定义域名](https://render.com/docs/custom-domains)。

<!--
  NOTE: The sections below are reserved for more deployment platforms not listed above.
  Feel free to submit a PR that adds a new section with a link to your platform's
  deployment guide, as long as it meets these criteria:

  1. Users should be able to deploy their site for free.
  2. Free tier offerings should host the site indefinitely and are not time-bound.
     Offering a limited number of computation resource or site counts in exchange is fine.
  3. The linked guides should not contain any malicious content.

  The Vite team may change the criteria and audit the current list from time to time.
  If a section is removed, we will ping the original PR authors before doing so.
-->

## Flightcontrol

根据 [说明](https://www.flightcontrol.dev/docs/reference/examples/vite?ref=docs-vite)，使用 [Flightcontrol](https://www.flightcontrol.dev/?ref=docs-vite) 来部署你的静态站点。

## Kinsta 静态站点托管 {#kinsta-static-site-hosting}

根据 [说明](https://kinsta.com/docs/react-vite-example/)，使用 [Kinsta](https://kinsta.com/static-site-hosting/) 来部署你的静态站点。

## xmit 静态站点托管 {#xmit-static-site-hosting}

根据 [说明](https://xmit.dev/posts/vite-quickstart/)，使用 [xmit](https://xmit.co) 来部署你的静态站点。
