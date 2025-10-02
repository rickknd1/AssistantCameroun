#!/usr/bin/env tsx
/**
 * PARSER DU CODE PÉNAL
 * Crée les sections hiérarchiques pour le Code Pénal
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

function parseCodePenal(content: string): Section[] {
  const sections: Section[] = []
  let position = 0

  // Patterns pour identifier les sections
  const livreRegex = /^(LIVRE\s+[IVXLC]+)\s*$/gm
  const titreRegex = /^(TITRE\s+[IVXLC]+)\s*$/gm
  const chapitreRegex = /^(CHAPITRE\s+[IVXLC]+)\s*$/gm
  const articleRegex = /^Article\s+(\d+(?:\s+bis)?)\s*[—-]\s*/gm

  const lines = content.split('\n')
  let i = 0
  let currentLivre = ''
  let currentTitre = ''
  let currentChapitre = ''
  let currentArticleLines: string[] = []
  let currentArticleRef = ''

  while (i < lines.length) {
    const line = lines[i].trim()

    // LIVRE (level 0)
    if (/^LIVRE\s+[IVXLC]+\s*$/.test(line)) {
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

      currentLivre = line
      let livreTitle = ''
      let j = i + 1

      // Lire le titre du livre (lignes suivantes jusqu'à vide ou nouveau pattern)
      while (j < lines.length && lines[j].trim() &&
             !/^(TITRE|CHAPITRE|Article)\s+/i.test(lines[j].trim())) {
        livreTitle += (livreTitle ? ' ' : '') + lines[j].trim()
        j++
      }

      sections.push({
        reference: currentLivre,
        title: livreTitle || currentLivre,
        content: '',
        level: 0,
        position: position++
      })

      i = j
      continue
    }

    // TITRE (level 0)
    if (/^TITRE\s+[IVXLC]+\s*$/.test(line)) {
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

      currentTitre = line
      let titreTitle = ''
      let j = i + 1

      // Lire le titre (lignes suivantes)
      while (j < lines.length && lines[j].trim() &&
             !/^(CHAPITRE|Article)\s+/i.test(lines[j].trim())) {
        titreTitle += (titreTitle ? ' ' : '') + lines[j].trim()
        j++
      }

      sections.push({
        reference: currentTitre,
        title: titreTitle || currentTitre,
        content: '',
        level: 0,
        position: position++
      })

      i = j
      continue
    }

    // CHAPITRE (level 1)
    if (/^CHAPITRE\s+[IVXLC]+\s*$/.test(line)) {
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

      currentChapitre = line
      let chapitreTitle = ''
      let j = i + 1

      // Lire le titre du chapitre
      while (j < lines.length && lines[j].trim() &&
             !/^Article\s+/i.test(lines[j].trim())) {
        chapitreTitle += (chapitreTitle ? ' ' : '') + lines[j].trim()
        j++
      }

      sections.push({
        reference: currentChapitre,
        title: chapitreTitle || currentChapitre,
        content: '',
        level: 1,
        position: position++
      })

      i = j
      continue
    }

    // ARTICLE (level 2)
    const articleMatch = /^Article\s+(\d+(?:\s+bis)?)\s*[—-]\s*(.*)$/.exec(line)
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

      currentArticleRef = `Article ${articleMatch[1]}`
      currentArticleLines = [articleMatch[2] || '']
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

async function insertSectionsForCodePenal() {
  console.log('🚀 Création des sections pour le Code Pénal...\n')

  // Récupérer le Code Pénal
  const { data: doc } = await supabase
    .from('Document')
    .select('id, title, content')
    .eq('slug', 'code-penal-camerounais')
    .single()

  if (!doc) {
    console.error('❌ Code Pénal non trouvé')
    process.exit(1)
  }

  console.log('📄 Document:', doc.title)
  console.log('   ID:', doc.id, '\n')

  // Supprimer les anciennes sections
  console.log('🗑️  Suppression des anciennes sections...')
  const { error: deleteError } = await supabase
    .from('Section')
    .delete()
    .eq('documentId', doc.id)

  if (deleteError) {
    console.error('❌ Erreur suppression:', deleteError.message)
  }

  // Parser le contenu
  console.log('📖 Parsing du contenu...')
  const sections = parseCodePenal(doc.content || '')

  console.log(`✅ ${sections.length} sections identifiées`)
  console.log(`   Level 0 (Livres/Titres): ${sections.filter(s => s.level === 0).length}`)
  console.log(`   Level 1 (Chapitres): ${sections.filter(s => s.level === 1).length}`)
  console.log(`   Level 2 (Articles): ${sections.filter(s => s.level === 2).length}\n`)

  // Insérer les sections
  console.log('💾 Insertion des sections...')

  for (const section of sections) {
    const { error } = await supabase
      .from('Section')
      .insert({
        documentId: doc.id,
        reference: section.reference,
        title: section.title,
        content: section.content,
        level: section.level,
        position: section.position
      })

    if (error) {
      console.error(`❌ Erreur pour ${section.reference}:`, error.message)
    }
  }

  console.log('\n✅ Sections créées avec succès!')
}

insertSectionsForCodePenal().catch(console.error)
