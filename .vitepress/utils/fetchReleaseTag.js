export function fetchReleaseTag() {
  return fetch('https://api.github.com/repos/vitejs/docs-cn/releases/latest')
    .then((res) => res.json())
    .then((json) => json.tag_name ?? '')
    .then(releaseTag => {
      const tagLineParagragh = document.querySelector('div.VPHero.has-image.VPHomeHero > div > div.main > p.tagline')
      const docsReleaseTagSpan = document.createElement('samp')
      docsReleaseTagSpan.classList.add('docs-cn-github-release-tag')
      docsReleaseTagSpan.innerText = releaseTag
      tagLineParagragh?.appendChild(docsReleaseTagSpan)
    })
}
