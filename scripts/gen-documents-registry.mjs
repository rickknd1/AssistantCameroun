// ============================================
// Génère lib/documents/registry.ts en scannant content/documents/*.json
// À relancer après ajout/modif d'un document : node scripts/gen-documents-registry.mjs
// ============================================
import { readdirSync, writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const docsDir = join(root, 'content', 'documents')
const outFile = join(root, 'lib', 'documents', 'registry.ts')

const files = readdirSync(docsDir)
  .filter((f) => f.endsWith('.json'))
  .sort()

const imports = files
  .map((f, i) => `import d${i} from '@/content/documents/${f}'`)
  .join('\n')
const arr = files.map((_, i) => `d${i}`).join(', ')

const out = `// ⚠️ FICHIER AUTO-GÉNÉRÉ par scripts/gen-documents-registry.mjs — NE PAS ÉDITER À LA MAIN
import type { Document, Section } from '@/lib/types/database'
${imports}

export type StoredDocument = Document & { sections: Section[] }

export const documents = [${arr}] as unknown as StoredDocument[]
`

mkdirSync(dirname(outFile), { recursive: true })
writeFileSync(outFile, out, 'utf-8')
console.log(`registry.ts généré avec ${files.length} document(s):`)
files.forEach((f) => console.log('  -', f))
