#!/usr/bin/env bun
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

// Bun uses import.meta.dir instead of __dirname
const keywordsPath = resolve(import.meta.dir, 'ogKeywords.txt')
const outputPath = resolve(import.meta.dir, 'ogKeywords.generated.ts')

try {
  // Read keywords from file, trim, filter empty lines
  const keywords: string[] = readFileSync(keywordsPath, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  // Generate TypeScript export as array of strings
  const output = `// Auto-generated file - do not edit manually
// Generated from: ogKeywords.txt
export const ogKeywords = ${JSON.stringify(keywords, null, 2)};

export const ogKeywordsString = ogKeywords.join(', ');
`

  writeFileSync(outputPath, output)
  console.log('✅ ogKeywords.generated.ts created successfully.')
  console.log(`📝 Generated ${keywords.length} keywords`)
  console.log(`📍 Output: ${outputPath}`)
} catch (error) {
  console.error('❌ Error:', error.message)
  if (error.code === 'ENOENT') {
    console.log('💡 Make sure ogKeywords.txt exists in the scripts directory')
  }
  process.exit(1)
}