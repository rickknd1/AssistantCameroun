#!/usr/bin/env tsx
/**
 * PARSER CORRECT DU CODE CIVIL CAMEROUNAIS
 * Structure: LIVRE (0) → TITRE (0) → CHAPITRE (1) → Article (2)
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

function parseCodeCivil(content: string): Section[] {
  const sections: Section[] = []
  let position = 0

  const lines = content.split('\n')
  let i = 0
  let currentArticleLines: string[] = []
  let currentArticleRef = ''

  while (i < lines.length) {
    const line = lines[i].trim()

    // LIVRE (level 0)
    if (/^LIVRE\s+[IVXLC]+/i.test(line)) {
      // Sauvegarder l'article précédent
      if (currentArticleRef && currentArticleLines.length > 0) {
        sections.push({
          reference: currentArticleRef,
          title: currentArticleRef,
          content: currentArticleLines.join('\n').trim(),
          level: 2,
          position: position++
        })
        currentArticleLines = []
        currentArticleRef = ''
      }

      const livreMatch = /^(LIVRE\s+[IVXLC]+)\s+(.*)$/i.exec(line)
      if (livreMatch) {
        sections.push({
          reference: livreMatch[1].toUpperCase(),
          title: livreMatch[2].trim() || livreMatch[1].toUpperCase(),
          content: '',
          level: 0,
          position: position++
        })
      }
      i++
      continue
    }

    // TITRE (level 0)
    if (/^TITRE\s+[IVXLC\d]+/i.test(line)) {
      // Sauvegarder l'article précédent
      if (currentArticleRef && currentArticleLines.length > 0) {
        sections.push({
          reference: currentArticleRef,
          title: currentArticleRef,
          content: currentArticleLines.join('\n').trim(),
          level: 2,
          position: position++
        })
        currentArticleLines = []
        currentArticleRef = ''
      }

      const titreMatch = /^(TITRE\s+(?:PRELIMINAIRE|[IVXLC\d]+))\s+(.*)$/i.exec(line)
      if (titreMatch) {
        sections.push({
          reference: titreMatch[1].toUpperCase(),
          title: titreMatch[2].trim() || titreMatch[1].toUpperCase(),
          content: '',
          level: 0,
          position: position++
        })
      }
      i++
      continue
    }

    // CHAPITRE (level 1)
    if (/^CHAP(?:\.|ITRE)?\s+[IVXLC]+/i.test(line)) {
      // Sauvegarder l'article précédent
      if (currentArticleRef && currentArticleLines.length > 0) {
        sections.push({
          reference: currentArticleRef,
          title: currentArticleRef,
          content: currentArticleLines.join('\n').trim(),
          level: 2,
          position: position++
        })
        currentArticleLines = []
        currentArticleRef = ''
      }

      const chapitreMatch = /^(CHAP(?:\.|ITRE)?\s+[IVXLC]+)\s+(.*)$/i.exec(line)
      if (chapitreMatch) {
        sections.push({
          reference: chapitreMatch[1].replace('CHAP.', 'CHAPITRE').toUpperCase(),
          title: chapitreMatch[2].trim() || chapitreMatch[1].toUpperCase(),
          content: '',
          level: 1,
          position: position++
        })
      }
      i++
      continue
    }

    // SECTION (level 1)
    if (/^SECT(?:\.|ION)?\s+[IVXLC]+/i.test(line)) {
      // Sauvegarder l'article précédent
      if (currentArticleRef && currentArticleLines.length > 0) {
        sections.push({
          reference: currentArticleRef,
          title: currentArticleRef,
          content: currentArticleLines.join('\n').trim(),
          level: 2,
          position: position++
        })
        currentArticleLines = []
        currentArticleRef = ''
      }

      const sectionMatch = /^(SECT(?:\.|ION)?\s+[IVXLC]+)\s+(.*)$/i.exec(line)
      if (sectionMatch) {
        sections.push({
          reference: sectionMatch[1].replace('SECT.', 'SECTION').toUpperCase(),
          title: sectionMatch[2].trim() || sectionMatch[1].toUpperCase(),
          content: '',
          level: 1,
          position: position++
        })
      }
      i++
      continue
    }

    // ARTICLE (level 2) - Patterns: "Art. 1", "Art. 123", etc.
    const articleMatch = /^Art\.\s*(\d+(?:\s*(?:er|bis|ter))?(?:\s*(?:à|-)\s*\d+)?)\s*[.\-–—]?\s*(.*)$/i.exec(line)
    if (articleMatch) {
      // Sauvegarder l'article précédent
      if (currentArticleRef && currentArticleLines.length > 0) {
        sections.push({
          reference: currentArticleRef,
          title: currentArticleRef,
          content: currentArticleLines.join('\n').trim(),
          level: 2,
          position: position++
        })
      }

      currentArticleRef = `Art. ${articleMatch[1].trim()}`
      currentArticleLines = [articleMatch[2].trim()]
      i++
      continue
    }

    // Ajouter les lignes au contenu de l'article en cours
    if (currentArticleRef && line) {
      currentArticleLines.push(line)
    }

    i++
  }

  // Sauvegarder le dernier article
  if (currentArticleRef && currentArticleLines.length > 0) {
    sections.push({
      reference: currentArticleRef,
      title: currentArticleRef,
      content: currentArticleLines.join('\n').trim(),
      level: 2,
      position: position++
    })
  }

  return sections
}

async function reparseCodeCivil() {
  console.log('🚀 Reparse du Code Civil Camerounais...\n')

  const { data: doc } = await supabase
    .from('Document')
    .select('id, title, content')
    .eq('slug', 'code-civil-camerounais')
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
  const sections = parseCodeCivil(doc.content || '')

  console.log(`✅ ${sections.length} sections identifiées`)
  console.log(`   Level 0 (Livres/Titres): ${sections.filter(s => s.level === 0).length}`)
  console.log(`   Level 1 (Chapitres/Sections): ${sections.filter(s => s.level === 1).length}`)
  console.log(`   Level 2 (Articles): ${sections.filter(s => s.level === 2).length}\n`)

  console.log('📋 Exemples de structure:')
  sections.filter(s => s.level === 0).slice(0, 5).forEach(s => {
    console.log(`   [L0] ${s.reference} - ${s.title.substring(0, 50)}`)
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

  console.log('\n✅ Code Civil reparsé avec succès!')
}

reparseCodeCivil().catch(console.error)
