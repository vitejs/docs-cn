#项目理念



极致的可扩展核心



Vite并不打算覆盖每个用户的每个用例。Vite的目标是支持最常见的模式来构建开箱即用的Web应用程序，但是[Vite核心](https://github.com/vitejs/vite)必须通过一个小的API表面保持精简，以保持项目的长期可维护性。多亏了[Vite的基于rollup的插件系统](./api-plugin.md)，这个目标才有可能实现。可以作为外部插件实现的功能通常不会添加到Vite核心中。[Vite -plugin-pwa](https://vite-pwa-org.netlify.app/)是一个很好的例子，说明了Vite核心可以实现什么，并且有许多[维护良好的插件](https://github.com/vitejs/awesome-vite#plugins)可以满足您的需求。Vite与Rollup项目紧密合作，以确保插件可以在纯Rollup和Vite项目中尽可能多地使用，尽可能地将需要的扩展推送到上游的Plugin API。



##推动现代网络



Vite提供了一些固执己见的特性，推动编写现代代码。例如:



-源代码只能用ESM编写，其中非ESM依赖项需要[预绑定为ESM](./ deep - prebundling)才能工作。

Web Worker被鼓励使用[' new Worker '语法](./features# Web -workers)来编写，以遵循现代标准。

—Node.js模块不能在浏览器中使用。



在添加新特性时，遵循这些模式来创建一个面向未来的API，该API可能并不总是与其他构建工具兼容。



务实的绩效方法



Vite自[起源](./why.md)以来一直专注于性能。它的开发服务器架构允许HMR在项目扩展时保持快速。Vite使用像[esbuild](https://esbuild.github.io/)和[SWC](https://github.com/vitejs/vite-plugin-react-swc)这样的本地工具来实现密集的任务，但将其余代码保留在JS中以平衡速度和灵活性。当需要的时候，框架插件会进入[Babel](https://babeljs.io/)来编译用户代码。在构建期间，Vite目前使用的是[Rollup](https://rollupjs.org/)，在这里，捆绑的大小和获得广泛的插件生态系统比原始速度更重要。Vite将继续在内部发展，使用新的库来改进DX，同时保持其API的稳定。



##在Vite之上构建框架



尽管Vite可以由用户直接使用，但它作为创建框架的工具还是很出色的。Vite的核心与框架无关，但每个UI框架都有精美的插件。它的[JS API](./ API -javascript.md)允许App Framework作者使用Vite的特性为他们的用户创建量身定制的体验。Vite包括对[SSR原语](./ SSR .md)的支持，通常出现在高级工具中，但却是构建现代web框架的基础。而Vite插件通过提供一种在框架之间共享的方式来完成这一任务。当与[后端框架](./ Backend -integration.md)如[Ruby](https://vite-ruby.netlify.app/)和[Laravel](https://laravel.com/docs/10.x/vite)配对时，Vite也非常适合。



一个活跃的生态系统



Vite的发展是框架和插件维护者、用户和Vite团队之间的合作。一旦一个项目采用了Vite，我们鼓励积极参与Vite的核心开发。我们与生态系统中的主要项目密切合作，在像[vite-ecosystem-ci](https://github.com/vitejs/vite-ecosystem-ci)这样的工具的帮助下，尽量减少每个版本的回归。它允许我们在选定的pr上使用Vite运行主要项目的CI，并为我们提供生态系统如何对发布做出反应的清晰状态。我们努力在回归到达用户之前修复它们，并允许项目在发布后尽快更新到下一个版本。如果您正在与Vite合作，我们邀请您加入[Vite的Discord](https://chat.vitejs.dev)并参与到项目中来。
