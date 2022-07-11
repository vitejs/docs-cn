# 部署静态站点 {#deploying-a-static-site}

本指南建立在以下几个假设基础之上：

- 你正在使用的是默认的构建输出路径（`dist`）。这个路径 [可以通过 `build.outDir` 更改](/config/build-options.md#build-outdir)，在这种情况下，你可以从这篇指南中找到出所需的指引。
- 你正在使用 NPM；或者 Yarn 等其他可以运行下面的脚本指令的包管理工具。
- Vite 已作为一个本地开发依赖（dev dependency）安装在你的项目中，并且你已经配置好了如下的 npm scripts：

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

值得注意的是 `vite preview` 用作预览本地构建，而不应直接作为生产服务器。

<<<<<<< HEAD
::: tip 注意
本篇指南提供了部署 Vite 静态站点的说明。Vite 也对服务端渲染（SSR）有了实验性的支持。SSR 是指支持在 Node 中运行相应应用的前端框架，预渲染成 HTML，最后在客户端激活（hydrate）。查看 [SSR 指南](./ssr) 了解更多细节。另一方面，如果你在寻找与传统服务端框架集成的方式，那么请查看 [后端集成](./backend-integration) 章节。
:::

## 构建应用 {#building-the-app}
=======
::: tip NOTE
These guides provide instructions for performing a static deployment of your Vite site. Vite also supports Server Side Rendering. SSR refers to front-end frameworks that support running the same application in Node.js, pre-rendering it to HTML, and finally hydrating it on the client. Check out the [SSR Guide](./ssr) to learn about this feature. On the other hand, if you are looking for integration with traditional server-side frameworks, check out the [Backend Integration guide](./backend-integration) instead.
:::

## Building the App
>>>>>>> c45663aa459c9c1b02e86e4f6778ce3cb2e99378

你可以运行 `npm run build` 命令来执行应用的构建。

```bash
$ npm run build
```

默认情况下，构建会输出到 `dist` 文件夹中。你可以部署这个 `dist` 文件夹到任何你喜欢的平台。

<<<<<<< HEAD
### 本地测试应用 {#testing-the-app-locally}
=======
### Testing the App Locally
>>>>>>> c45663aa459c9c1b02e86e4f6778ce3cb2e99378

当你构建完成应用后，你可以通过运行 `npm run preview` 命令，在本地测试该应用。

```bash
$ npm run build
$ npm run preview
```

`vite preview` 命令会在本地启动一个静态 Web 服务器，将 `dist` 文件夹运行在 `http://localhost:4173`。这样在本地环境下查看该构建产物是否正常可用就方便多了。

你可以通过 `--port` 参数来配置服务的运行端口。

```json
{
  "scripts": {
    "preview": "vite preview --port 8080"
  }
}
```

<<<<<<< HEAD
现在 `preview` 命令会将服务器运行在 `http://localhost:8080`。
=======
Now the `preview` command will launch the server at `http://localhost:8080`.
>>>>>>> c45663aa459c9c1b02e86e4f6778ce3cb2e99378

## GitHub Pages {#github-pages}

1. 在 `vite.config.js` 中设置正确的 `base`。

   如果你要部署在 `https://<USERNAME>.github.io/` 上，你可以省略 `base` 使其默认为 `'/'`。

   如果你要部署在 `https://<USERNAME>.github.io/<REPO>/` 上，例如你的仓库地址为 `https://github.com/<USERNAME>/<REPO>`，那么请设置 `base` 为 `'/<REPO>/'`。

2. 在你的项目中，创建一个 `deploy.sh` 脚本，包含以下内容（注意高亮的行，按需使用），运行脚本来部署站点：

   ```bash{13,20,23}
   #!/usr/bin/env sh

   # 发生错误时终止
   set -e

   # 构建
   npm run build

   # 进入构建文件夹
   cd dist

   # 如果你要部署到自定义域名
   # echo 'www.example.com' > CNAME

   git init
   git checkout -b main
   git add -A
   git commit -m 'deploy'

   # 如果你要部署在 https://<USERNAME>.github.io
   # git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git main

   # 如果你要部署在 https://<USERNAME>.github.io/<REPO>
   # git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

   cd -
   ```

::: tip
你也可以在你的 CI 中配置该脚本，使得在每次推送代码时自动部署。
:::

<<<<<<< HEAD
### GitHub Pages 配合 Travis CI {#github-pages-and-travis-ci}

1. 在 `vite.config.js` 中设置正确的 `base`。

   如果你要部署在 `https://<USERNAME or GROUP>.github.io/` 上，你可以省略 `base` 使其默认为 `'/'`。

   如果你要部署在 `https://<USERNAME or GROUP>.github.io/<REPO>/`，例如你的仓库地址为 `https://github.com/<USERNAME>/<REPO>`，那么请设置 `base` 为 `'/<REPO>/'`。

2. 在项目根目录创建一个 `.travis.yml` 文件

3. 在本地运行 `npm install` 并且提交（commit）生成的 lockfile (`package-lock.json`)。

4. 使用 GitHub Pages 部署的配置文件模板，并按照 [Travis CI 文档](https://docs.travis-ci.com/user/deployment/pages/) 进行配置：

   ```yaml
   language: node_js
   node_js:
     - lts/*
   install:
     - npm ci
   script:
     - npm run build
   deploy:
     provider: pages
     skip_cleanup: true
     local_dir: dist
     # 在 GitHub 上生成的 token，允许 Travis 推送代码到你的仓库。
     # 在仓库的 Travis 设置页面，设为安全的环境变量
     github_token: $GITHUB_TOKEN
     keep_history: true
     on:
       branch: main
   ```

## GitLab Pages 配合 GitLab CI {#gitlab-pages-and-gitlab-ci}
=======
## GitLab Pages and GitLab CI
>>>>>>> c45663aa459c9c1b02e86e4f6778ce3cb2e99378

1. 在 `vite.config.js` 中设置正确的 `base`。

   如果你要部署在 `https://<USERNAME or GROUP>.gitlab.io/` 上，你可以省略 `base` 使其默认为 `'/'`。

   如果你要部署在 `https://<USERNAME or GROUP>.gitlab.io/<REPO>/` 上，例如你的仓库地址为 `https://gitlab.com/<USERNAME>/<REPO>`，那么请设置 `base` 为 `'/<REPO>/'`。

2. 在项目根目录创建一个 `.gitlab-ci.yml` 文件，并包含以下内容。它将使得每次你更改内容时都重新构建与部署站点：

   ```yaml
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

<<<<<<< HEAD
## Cloudflare Pages {#cloudflare-pages}
=======
## Vercel

### Vercel CLI

1. Install the [Vercel CLI](https://vercel.com/cli) and run `vercel` to deploy.
2. Vercel will detect that you are using Vite and will enable the correct settings for your deployment.
3. Your application is deployed! (e.g. [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
```

### Vercel for Git

1. Push your code to your git repository (GitHub, GitLab, Bitbucket).
2. [Import your Vite project](https://vercel.com/new) into Vercel.
3. Vercel will detect that you are using Vite and will enable the correct settings for your deployment.
4. Your application is deployed! (e.g. [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/))

After your project has been imported and deployed, all subsequent pushes to branches will generate [Preview Deployments](https://vercel.com/docs/concepts/deployments/environments#preview), and all changes made to the Production Branch (commonly “main”) will result in a [Production Deployment](https://vercel.com/docs/concepts/deployments/environments#production).

Learn more about Vercel’s [Git Integration](https://vercel.com/docs/concepts/git).

## Cloudflare Pages
>>>>>>> c45663aa459c9c1b02e86e4f6778ce3cb2e99378

### Cloudflare Pages via Wrangler {#cloudflare-pages-via-wrangler}

1. 安装 [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/get-started/).
2. 使用 `wrangler login`、通过你的 Cloudflare 账号完成 Wrangler 身份校验。
3. 运行你的构建命令
4. 使用 `npx wrangler pages publish dist` 部署。

```bash
# 安装 Wrangler CLI
$ npm install -g wrangler

# 使用 CLI 工具登录 Cloudflare 账号
$ wrangler login

# 运行构建命令
$ npm run build

# 创建一个新的部署
$ npx wrangler pages publish dist
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

   `firebase.json`:

   ```json
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

   `.firebaserc`:

   ```js
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

## Heroku {#heroku}

1. 安装 [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)。

2. [注册](https://signup.heroku.com)一个 Heroku 账号。

3. 运行 `heroku login` 并填入你的 Heroku 凭证：

   ```bash
   $ heroku login
   ```

4. 在项目根目录创建一个 `static.json` ，包含以下内容：

   `static.json`:

   ```json
   {
     "root": "./dist"
   }
   ```

   这是你站点的配置，阅读 [heroku-buildpack-static](https://github.com/heroku/heroku-buildpack-static) 文档来了解更多。

5. 配置好你的 Heroku git 远程地址：

   ```bash
   # 版本变更
   $ git init
   $ git add .
   $ git commit -m "My site ready for deployment."

   # 创建一个具有指定名称的新应用
   $ heroku apps:create example
   ```

6. 设置 buildpacks。我们使用 `heroku/nodejs` 来构建项目，`heroku-buildpack-static` 为其启动服务。

   ```bash
   # set buildpacks
   $ heroku buildpacks:set heroku/nodejs
   $ heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static.git
   ```

7. 部署站点：

   ```bash
   # 发布站点
   $ git push heroku main

   # 在浏览器中打开 Heroku 的面板
   $ heroku open
   ```

<<<<<<< HEAD
## Vercel {#vercel}

### Vercel CLI {#vercel-cli}

1. 安装 [Vercel CLI](https://vercel.com/cli) 并运行 `vercel` 来进行部署。
2. Vercel 会检测到你正在使用 Vite，并会为你的开发开启相应的正确设置。
3. 然后你的应用就被正常部署了！（示例 [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/)）

```bash
$ npm i -g vercel
$ vercel init vite
Vercel CLI
> Success! Initialized "vite" example in ~/your-folder.
- To deploy, `cd vite` and run `vercel`.
```

### Vercel for Git {#vercel-for-git}

1. 将你代码推送到你的 git 仓库（GitHub、GitLab 或 Bitbucket 等等）
2. [导入你的 Vite 项目](https://vercel.com/new) 到 Vercel。
3. Vercel 会检测到你正在使用 Vite，并会为你的开发开启相应的正确设置。
4. 然后你的应用就被正常部署了！（示例 [vite-vue-template.vercel.app](https://vite-vue-template.vercel.app/)）

在你的项目被成功导入与部署后，所有对分支的后续推送都将生成 [预览发布](https://vercel.com/docs/concepts/deployments/environments#preview)，所有对生产分支（通常是 "main"）都会最后形成一个 [生产发布](https://vercel.com/docs/concepts/deployments/environments#production)。

访问 Vercel 的 [Git 集成指引](https://vercel.com/docs/concepts/git) 了解更多详情。

## Azure 的静态网站应用 {#azure-static-web-apps}
=======
## Azure Static Web Apps
>>>>>>> c45663aa459c9c1b02e86e4f6778ce3cb2e99378

你可以通过微软 Azure 的 [静态网站应用](https://aka.ms/staticwebapps) 服务来快速部署你的 Vite 应用。你只需：

- 注册 Azure 账号并获取一个订阅（subscription）的 key。可以在 [此处快速完成注册](https://azure.microsoft.com/free)。
- 将你的应用代码托管到 [GitHub](https://github.com)。
- 在 [VSCode](https://code.visualstudio.com) 中安装 [SWA 扩展](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)。

安装完此扩展后，进入你应用的根目录。打开 SWA 的扩展程序，登录 Azure，并点击 '+'，来创建一个全新的 SWA。系统会提示你指定所需的订阅 key。

按照扩展程序的启动向导，给你的应用程序起个名字，选择框架预设，并指定应用程序的根目录（通常为 `/`）以及构建文件的路径 `/dist`。此向导完成后，会在你的 repo 中的 `.github` 文件夹中创建一个 Github Action。

这个 action 致力于部署你的应用程序（可以在仓库的 Actions 标签中，查看相关进度），成功完成后，你可以点击 Github 中出现的 “浏览站点” 的按钮，查看你的应用程序。

## 腾讯云 Webify

[腾讯云 Webify](https://webify.cloudbase.net/) 支持从 Git 仓库直接部署您的 Vite 应用。

进入 [Webify 新建应用页面](https://console.cloud.tencent.com/webify/new)，根据选择您代码仓库所在的 Git 平台（GitHub、GitLab 或者 Gitee 码云），完成授权流程后，便可导入仓库。

应用配置如下：

- 构建命令填入 `npm run build`
- 输出目录填入 `dist`，
- 安装命令填入 `npm install`

![Webify 配置](../images/webify-configuration.png)

应用创建之后，等待构建、部署完毕，便可以通过应用的默认域名（`.app.tcloudbase.com`）来访问应用。如 https://my-vite-vue-app-4gi9tn1478d8ee71-1255679239.ap-shanghai.app.tcloudbase.com/
