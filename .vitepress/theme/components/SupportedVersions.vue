<script setup lang="ts">
import { computed, ref } from 'vue'

declare const __VITE_VERSION__: string

// Constants
const supportedVersionMessage = {
  color: 'var(--vp-c-brand-1)',
  text: '支持',
}
const notSupportedVersionMessage = {
  color: 'var(--vp-c-danger-1)',
  text: '不支持',
}
const previousMajorLatestMinors: Record<string, string> = {
  2: '2.9',
  3: '3.2',
  4: '4.5',
  5: '5.4',
  6: '6.4',
}

// Current latest Vite version and support info
const parsedViteVersion = parseVersion(__VITE_VERSION__)!
const supportInfo = computeSupportInfo(parsedViteVersion)

// Check supported version input
const checkedVersion = ref(`${Math.max(parsedViteVersion.major - 3, 2)}.0.0`)
const checkedResult = computed(() => {
  const version = checkedVersion.value
  if (!isValidViteVersion(version))
    return notSupportedVersionMessage

  const parsedVersion = parseVersion(checkedVersion.value)
  if (!parsedVersion)
    return notSupportedVersionMessage

  const satisfies = (targetVersion: string) => {
    const compared = parseVersion(targetVersion)!
    return (
      parsedVersion.major === compared.major
      && parsedVersion.minor >= compared.minor
    )
  }
  const satisfiesOneSupportedVersion
    = parsedVersion.major >= parsedViteVersion.major // Treat future major versions as supported
      || supportInfo.regularPatches.some(satisfies)
      || supportInfo.importantFixes.some(satisfies)
      || supportInfo.securityPatches.some(satisfies)

  return satisfiesOneSupportedVersion
    ? supportedVersionMessage
    : notSupportedVersionMessage
})

function parseVersion(version: string) {
  let [major, minor, patch] = version.split('.').map((v) => {
    const num = /^\d+$/.exec(v)?.[0]
    return num ? Number.parseInt(num) : null
  })
  if (!major)
    return null
  minor ??= 0
  patch ??= 0

  return { major, minor, patch }
}

function computeSupportInfo(
  version: NonNullable<ReturnType<typeof parseVersion>>,
) {
  const { major, minor } = version
  const f = (versions: string[]) => {
    return versions
      .map(v => previousMajorLatestMinors[v] ?? v)
      .filter((version) => {
        if (!isValidViteVersion(version))
          return false
        // Negative versions are invalid
        if (/-\d/.test(version))
          return false
        return true
      })
  }

  return {
    regularPatches: f([`${major}.${minor}`]),
    importantFixes: f([`${major - 1}`, `${major}.${minor - 1}`]),
    securityPatches: f([`${major - 2}`, `${major}.${minor - 2}`]),
  }
}

function versionsToText(versions: string[]) {
  versions = versions.map(v => `<code>vite@${v}</code>`)
  if (versions.length === 0)
    return ''
  if (versions.length === 1)
    return versions[0]
  return (
    `${versions.slice(0, -1).join(', ')} 和 ${versions[versions.length - 1]}`
  )
}

function isValidViteVersion(version: string) {
  if (version.length === 1)
    version += '.'
  // Vite 0.x shouldn't be mentioned, and Vite 1.x was never released
  if (version.startsWith('0.') || version.startsWith('1.'))
    return false
  return true
}
</script>

<template>
  <div>
    <ul>
      <li v-if="supportInfo.regularPatches.length">
        定期发布补丁
        <span v-html="versionsToText(supportInfo.regularPatches)" />。
      </li>
      <li v-if="supportInfo.importantFixes.length">
        重要的修复和安全补丁向后移植到
        <span v-html="versionsToText(supportInfo.importantFixes)" />。
      </li>
      <li v-if="supportInfo.securityPatches.length">
        安全补丁也被向后移植到
        <span v-html="versionsToText(supportInfo.securityPatches)" />。
      </li>
      <li>
        之前的所有版本都不再支持。用户应升级，以获得更新。
      </li>
    </ul>
    <p>
      如果你使用的是 Vite
      <input
        v-model="checkedVersion"
        class="checked-input"
        type="text"
        placeholder="0.0.0"
      >, 它是
      <strong :style="{ color: checkedResult.color }">{{
        checkedResult.text
      }}</strong>。
    </p>
  </div>
</template>

<style scoped>
.checked-input {
  display: inline-block;
  padding: 0px 5px;
  width: 100px;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
  font-size: var(--vp-code-font-size);
  font-family: var(--vp-font-family-mono);
  border: 1px solid var(--vp-c-divider);
  border-radius: 5px;
  transition: border-color 0.1s;
}

.checked-input:focus,
.checked-input:hover {
  border-color: var(--vp-c-brand);
}
</style>
