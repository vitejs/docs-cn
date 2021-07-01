import { onMounted } from 'vue'

export default function fetchReleaseTag() {
  onMounted(() => {
    fetch('https://api.github.com/repos/vitejs/docs-cn/releases/latest')
      .then((res) => res.json())
      .then((json) => {
        const mainTitle = document.getElementById('main-title')
        mainTitle.style.position = 'relative'

        const docsReleaseTag = document.createElement('span')
        docsReleaseTag.classList.add('release-tag')
        const releaseTagName = json.tag_name
        docsReleaseTag.innerText = releaseTagName


        mainTitle.appendChild(docsReleaseTag)
      })
  })
}
