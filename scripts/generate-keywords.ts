#!/usr/bin/env bun
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const MAX_SIZE = 8192 // 8KB
const keywordsPath = resolve(import.meta.dir, 'ogKeywords.txt')
const outputPath = resolve(import.meta.dir, 'ogKeywords.generated.ts')

const generateOutput = (keywords: string[]) =>
  `// Auto-generated file - do not edit manually
// Generated from: ogKeywords.txt
export const ogKeywords = ${JSON.stringify(keywords, null, 2)};

export const ogKeywordsString = ogKeywords.join(', ');
`

const getByteSize = (str: string) => Buffer.byteLength(str, 'utf8')

try {
  let keywords = readFileSync(keywordsPath, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  // Auto-detect and truncate if needed
  let output = generateOutput(keywords)
  let originalCount = keywords.length

  while (getByteSize(output) > MAX_SIZE && keywords.length > 0) {
    keywords = keywords.slice(0, -1)
    output = generateOutput(keywords)
  }

  writeFileSync(outputPath, output)

  console.log('✅ ogKeywords.generated.ts created successfully.')
  console.log(`📝 Generated ${keywords.length}/${originalCount} keywords`)
  console.log(`📊 Size: ${getByteSize(output)} bytes (max: ${MAX_SIZE})`)

  if (keywords.length < originalCount) {
    console.log(`⚠️  Truncated ${originalCount - keywords.length} keywords to stay under 8KB`)
  }

  console.log(`📍 Output: ${outputPath}`)
} catch (error) {
  console.error('❌ Error:', error.message)
  error.code === 'ENOENT' && console.log('💡 Make sure ogKeywords.txt exists in the scripts directory')
  process.exit(1)
}