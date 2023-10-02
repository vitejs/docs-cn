import { h } from 'vue'
import Theme from 'vitepress/theme'
import HomeSponsors from './components/HomeSponsors.vue'
import AsideSponsors from './components/AsideSponsors.vue'
import SvgImage from './components/SvgImage.vue'
import WwAds from './components/WwAds.vue'
import './styles/vars.css'
import './custom.css'

export default {
  ...Theme,
  Layout() {
    return h(Theme.Layout, null, {
      'home-features-after': () => h(HomeSponsors),
      'aside-outline-after': () => h(WwAds),
      'aside-bottom': () => h(AsideSponsors)
    })
  },
  enhanceApp({ app }) {
    app.component('SvgImage', SvgImage)
  }
}
