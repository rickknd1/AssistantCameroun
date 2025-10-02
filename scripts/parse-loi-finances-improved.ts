#!/usr/bin/env tsx
/**
 * PARSER AMÉLIORÉ DE LA LOI DE FINANCES 2025
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Section {
  reference: string
  title: string
  content: string
  level: number
  position: number
}

function parseLoiFinances(content: string): Section[] {
  const sections: Section[] = []
  let position = 0

  // Diviser en lignes
  const lines = content.split('\n').map(l => l.trim()).filter(l => l.length > 0)

  // Identifier les chapitres
  const chapitres: Array<{index: number, ref: string, title: string}> = []
  lines.forEach((line, idx) => {
    const chapMatch = /^(CHAPITRE\s+[IVXLC]+)\s*:\s*(.+)$/i.exec(line)
    if (chapMatch) {
      chapitres.push({
        index: idx,
        ref: chapMatch[1].toUpperCase(),
        title: chapMatch[2].trim()
      })
    }
  })

  console.log(`   🔍 ${chapitres.length} chapitres détectés`)

  // Traiter chaque chapitre
  for (let i = 0; i < chapitres.length; i++) {
    const chapitre = chapitres[i]
    const nextChapitre = chapitres[i + 1]
    const startIdx = chapitre.index
    const endIdx = nextChapitre ? nextChapitre.index : lines.length

    // Ajouter le chapitre (level 1)
    const chapitreLines = lines.slice(startIdx + 1, endIdx)
    let chapitreContent = ''

    // Extraire le contenu du chapitre (quelques premières lignes)
    const contentLines = chapitreLines.slice(0, 5).join('\n')

    sections.push({
      reference: chapitre.ref,
      title: chapitre.title,
      content: contentLines,
      level: 1,
      position: position++
    })

    // Chercher les sous-sections dans ce chapitre (I.1., I.2., etc.)
    const subsections: Array<{index: number, ref: string, title: string}> = []
    chapitreLines.forEach((line, relIdx) => {
      // Patterns: "I.1.", "II.2.", "III.3.", etc.
      const subMatch = /^([IVXLC]+\.\d+\.)\s+(.+?)\s+\.{3,}/.exec(line)
      if (subMatch) {
        subsections.push({
          index: startIdx + 1 + relIdx,
          ref: subMatch[1],
          title: subMatch[2].trim()
        })
      }
    })

    // Traiter chaque sous-section
    for (let j = 0; j < subsections.length; j++) {
      const subsection = subsections[j]
      const nextSubsection = subsections[j + 1]
      const subStartIdx = subsection.index
      const subEndIdx = nextSubsection ? nextSubsection.index : endIdx

      // Extraire le contenu de la sous-section
      const subContent = lines.slice(subStartIdx + 1, subEndIdx).join('\n').trim()

      sections.push({
        reference: subsection.ref,
        title: subsection.title,
        content: subContent.substring(0, 2000), // Limiter à 2000 caractères
        level: 2,
        position: position++
      })
    }

    // Si pas de sous-sections détectées, chercher les articles
    if (subsections.length === 0) {
      chapitreLines.forEach((line, relIdx) => {
        const artMatch = /^Article\s+(\d+)\s*[:\.\-–—]?\s*(.*)$/i.exec(line)
        if (artMatch) {
          const articleRef = `Article ${artMatch[1]}`
          let articleContent = artMatch[2].trim()

          // Lire les lignes suivantes jusqu'au prochain article
          let k = relIdx + 1
          while (k < chapitreLines.length &&
                 !/^(Article|CHAPITRE)/i.test(chapitreLines[k])) {
            articleContent += '\n' + chapitreLines[k].trim()
            k++
            if (k - relIdx > 20) break // Limiter à 20 lignes
          }

          sections.push({
            reference: articleRef,
            title: articleRef,
            content: articleContent.substring(0, 2000),
            level: 2,
            position: position++
          })
        }
      })
    }
  }

  return sections
}

async function insertSectionsForLoiFinances() {
  console.log('🚀 Reformatage amélioré de la Loi de Finances 2025...\n')

  const { data: doc } = await supabase
    .from('Document')
    .select('id, title, content')
    .eq('slug', 'loi-de-finances-2025')
    .single()

  if (!doc) {
    console.error('❌ Document non trouvé')
    process.exit(1)
  }

  console.log('📄 Document:', doc.title)
  console.log('   ID:', doc.id, '\n')

  console.log('🗑️  Suppression des anciennes sections...')
  await supabase
    .from('Section')
    .delete()
    .eq('documentId', doc.id)

  console.log('📖 Parsing du contenu...')
  const sections = parseLoiFinances(doc.content || '')

  console.log(`\n✅ ${sections.length} sections identifiées`)
  console.log(`   Level 0 (Titres): ${sections.filter(s => s.level === 0).length}`)
  console.log(`   Level 1 (Chapitres): ${sections.filter(s => s.level === 1).length}`)
  console.log(`   Level 2 (Sous-sections/Articles): ${sections.filter(s => s.level === 2).length}\n`)

  console.log('📋 Structure:')
  sections.slice(0, 10).forEach(s => {
    console.log(`   [L${s.level}] ${s.reference} - ${s.title.substring(0, 60)}`)
  })
  console.log('')

  console.log('💾 Insertion des sections...')
  for (const section of sections) {
    await supabase
      .from('Section')
      .insert({
        documentId: doc.id,
        reference: section.reference,
        title: section.title,
        content: section.content,
        level: section.level,
        position: section.position
      })
  }

  console.log('\n✅ Loi de Finances reformatée avec succès!')
}

insertSectionsForLoiFinances().catch(console.error)
