#!/usr/bin/env tsx
/**
 * RECONSTRUCTION DES SECTIONS DE LA CONSTITUTION
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

function parseDocument(content: string, documentId: string) {
  const sections: any[] = []
  let position = 0

  const patterns = [
    { regex: /^(TITRE\s+[IVXLCDM]+)\s*[:\-]?\s*(.+?)$/gim, level: 0 },
    { regex: /^(CHAPITRE\s+(?:[IVXLCDM]+|\d+))\s*[:\-]?\s*(.+?)$/gim, level: 1 },
    { regex: /^(Section\s+(?:[IVXLCDM]+|\d+))\s*[:\-]?\s*(.+?)$/gim, level: 1 },
    { regex: /^((?:Article|Art\.?)\s+(?:premier|\d+(?:\s*\w+)?))[\s:\-]*(.*?)$/gim, level: 2 },
  ]

  const lines = content.split('\n')
  let currentSection: any = null
  let contentBuffer: string[] = []

  const saveCurrentSection = () => {
    if (currentSection && contentBuffer.length > 0) {
      currentSection.content = contentBuffer.join('\n').trim()
      if (currentSection.content) {
        sections.push(currentSection)
      }
      contentBuffer = []
    }
  }

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    let matched = false

    for (const pattern of patterns) {
      const matches = trimmedLine.match(pattern.regex)
      if (matches) {
        saveCurrentSection()

        const reference = trimmedLine.split(/[:\-]/)[0].trim()
        const title = trimmedLine.substring(reference.length).replace(/^[:\-\s]+/, '').trim() || reference

        currentSection = {
          documentId,
          title,
          content: '',
          reference,
          level: pattern.level,
          position: position++,
        }

        matched = true
        break
      }
    }

    if (!matched && currentSection) {
      contentBuffer.push(line)
    }
  }

  saveCurrentSection()
  return sections
}

async function rebuildConstitution() {
  console.log('🔄 Reconstruction des sections de la Constitution...\n')

  const { data: doc } = await supabase
    .from('Document')
    .select('*')
    .eq('slug', 'constitution-de-la-republique-du-cameroun')
    .single()

  if (!doc) {
    console.error('❌ Constitution non trouvée')
    return
  }

  console.log(`📄 ${doc.title}`)
  console.log(`   Contenu: ${(doc.content as string).length} caractères\n`)

  // Supprimer les anciennes sections
  console.log('   → Suppression des anciennes sections...')
  const { error: deleteError } = await supabase
    .from('Section')
    .delete()
    .eq('documentId', doc.id)

  if (deleteError) {
    console.error('❌ Erreur suppression:', deleteError.message)
    return
  }

  // Parser le document
  console.log('   → Parsing du contenu...')
  const sections = parseDocument(doc.content as string, doc.id)

  if (sections.length === 0) {
    console.error('❌ Aucune section détectée')
    return
  }

  console.log(`   ✓ ${sections.length} sections détectées\n`)

  // Insérer les nouvelles sections
  console.log('   → Insertion des sections...')
  const { error: insertError } = await supabase
    .from('Section')
    .insert(sections)

  if (insertError) {
    console.error('❌ Erreur insertion:', insertError.message)
    return
  }

  console.log(`   ✅ ${sections.length} sections insérées\n`)

  // Afficher un résumé
  const levels: { [key: number]: number } = {}
  sections.forEach(s => {
    levels[s.level] = (levels[s.level] || 0) + 1
  })

  console.log('📊 Répartition:')
  Object.entries(levels).forEach(([level, count]) => {
    const label = level === '0' ? 'Titres' : level === '1' ? 'Chapitres/Sections' : 'Articles'
    console.log(`   • ${label}: ${count}`)
  })

  console.log('\n✅ Reconstruction terminée!')
}

rebuildConstitution().catch(console.error)
