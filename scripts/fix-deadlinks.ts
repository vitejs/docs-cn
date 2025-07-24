#!/usr/bin/env bun
import { readFile, writeFile } from 'fs/promises';

const fixes = [
  { file: 'Documentations/CICD/index.md', from: '/CICD/Github-CI', to: '/Documentations/CICD/Github-CI' },
  { file: 'Documentations/CICD/index.md', from: '/CICD/GitLab-CI', to: '/Documentations/CICD/GitLab-CI' },
  { file: 'Documentations/Development/Languages/Rust/Rust-Types.md', from: '/Development/Languages/Rust/Rust-Strings', to: '/Documentations/Development/Languages/Rust/Rust-Strings' },
  { file: 'Documentations/Development/Languages/Rust/Rust-Types.md', from: '/Development/Languages/Rust/Rust-Operators', to: '/Documentations/Development/Languages/Rust/Rust-Operators' },
  { file: 'Documentations/Development/Languages/Rust/Rust-Strings.md', from: '/Development/Languages/Rust/Rust-Operators', to: '/Documentations/Development/Languages/Rust/Rust-Operators' },
  { file: 'Documentations/Development/Languages/Rust/Rust-Strings.md', from: '/Development/Languages/Rust/Rust-Functions', to: '/Documentations/Development/Languages/Rust/Rust-Functions' },
  { file: 'Documentations/Development/Languages/Rust/Rust-Operators.md', from: '/Development/Languages/Rust/Rust-Functions', to: '/Documentations/Development/Languages/Rust/Rust-Functions' },
  { file: 'Documentations/Development/Languages/Rust/Rust-Operators.md', from: '/Development/Languages/Rust/Rust-Misc', to: '/Documentations/Development/Languages/Rust/Rust-Misc' },
  { file: 'Documentations/Development/Languages/Rust/Rust-Install.md', from: '/Development/Languages/Rust/Rust-Basics', to: '/Documentations/Development/Languages/Rust/Rust-Basics' },
  { file: 'Documentations/Development/Languages/Rust/Rust-Basics.md', from: '/Development/Languages/Rust/Rust-Types', to: '/Documentations/Development/Languages/Rust/Rust-Types' },
  { file: 'Documentations/Development/Languages/Rust/Rust-Basics.md', from: '/Development/Languages/Rust/Rust-Strings', to: '/Documentations/Development/Languages/Rust/Rust-Strings' },
  { file: 'Documentations/Development/Languages/Rust/Rust-Basics.md', from: '/Development/Languages/Rust/Rust-Operators', to: '/Documentations/Development/Languages/Rust/Rust-Operators' },
  { file: 'Documentations/Development/Languages/Rust/Rust-Basics.md', from: '/Development/Languages/Rust/Rust-Functions', to: '/Documentations/Development/Languages/Rust/Rust-Functions' },
  { file: 'Documentations/Development/Languages/Go/Go-Install.md', from: '/Development/Languages/Go/Go-Basics', to: '/Documentations/Development/Languages/Go/Go-Basics' },
  { file: 'Documentations/Development/Languages/Rust/Rust-Functions.md', from: '/Development/Languages/Rust/Rust-Misc', to: '/Documentations/Development/Languages/Rust/Rust-Misc' },
  { file: 'Documentations/Development/Languages/Go/Go-Basics.md', from: '/Development/Languages/Go/Go-Install', to: '/Documentations/Development/Languages/Go/Go-Install' },
  { file: 'Documentations/Development/Languages/Rust/Rust-FlowControl.md', from: '/Development/Languages/Rust/Rust-Functions', to: '/Documentations/Development/Languages/Rust/Rust-Functions' },
  { file: 'Documentations/Development/Languages/Rust/Rust-FlowControl.md', from: '/Development/Languages/Rust/Rust-Misc', to: '/Documentations/Development/Languages/Rust/Rust-Misc' }
];

async function patchDeadLinks() {
  console.log('🔧 Patching dead links...');

  for (const fix of fixes) {
    try {
      let content = await readFile(fix.file, 'utf-8');

      if (content.includes(`](${fix.from})`)) {
        content = content.replaceAll(`](${fix.from})`, `](${fix.to})`);
        await writeFile(fix.file, content, 'utf-8');
        console.log(`✅ ${fix.file}: ${fix.from} → ${fix.to}`);
      }
    } catch (error) {
      console.error(`❌ Error fixing ${fix.file}:`, error.message);
    }
  }

  console.log('✅ Done!');
}

patchDeadLinks().catch(console.error);