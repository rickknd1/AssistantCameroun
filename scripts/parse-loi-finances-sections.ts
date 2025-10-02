#!/usr/bin/env tsx
/**
 * PARSER DE LA LOI DE FINANCES 2025
 * Crée les sections hiérarchiques pour la Loi de Finances
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

  const lines = content.split('\n')
  let i = 0
  let currentPartie = ''
  let currentChapitre = ''
  let currentSection: string[] = []
  let currentSectionRef = ''
  let currentSectionTitle = ''
  let currentLevel = -1

  while (i < lines.length) {
    const line = lines[i].trim()

    // PARTIE (level 0) - ex: "PREMIERE PARTIE", "DEUXIEME PARTIE"
    if (/^(PREMIERE|DEUXIEME|TROISIEME|QUATRIEME|CINQUIEME)\s+PARTIE/i.test(line)) {
      // Sauvegarder la section précédente
      if (currentSectionRef && currentSection.length > 0) {
        sections.push({
          reference: currentSectionRef,
          title: currentSectionTitle || currentSectionRef,
          content: currentSection.join('\n').trim(),
          level: currentLevel,
          position: position++
        })
        currentSection = []
      }

      currentPartie = line
      let partieTitle = ''
      let j = i + 1

      // Lire le titre de la partie (ligne suivante non vide)
      while (j < lines.length && lines[j].trim() &&
             !/^(CHAPITRE|TITRE|SECTION|Article)/i.test(lines[j].trim())) {
        partieTitle += (partieTitle ? ' ' : '') + lines[j].trim()
        j++
        if (j - i > 3) break // Limiter à 3 lignes
      }

      currentSectionRef = currentPartie
      currentSectionTitle = partieTitle || currentPartie
      currentLevel = 0
      currentSection = []
      i = j
      continue
    }

    // TITRE (level 0) - ex: "TITRE I", "TITRE II"
    if (/^TITRE\s+[IVXLC]+\s*:?\s*$/i.test(line)) {
      // Sauvegarder la section précédente
      if (currentSectionRef && currentSection.length > 0) {
        sections.push({
          reference: currentSectionRef,
          title: currentSectionTitle || currentSectionRef,
          content: currentSection.join('\n').trim(),
          level: currentLevel,
          position: position++
        })
        currentSection = []
      }

      let titreRef = line.replace(/\s*:?\s*$/, '')
      let titreTitle = ''
      let j = i + 1

      // Lire le titre
      while (j < lines.length && lines[j].trim() &&
             !/^(CHAPITRE|SECTION|Article)/i.test(lines[j].trim())) {
        titreTitle += (titreTitle ? ' ' : '') + lines[j].trim()
        j++
        if (j - i > 3) break
      }

      currentSectionRef = titreRef
      currentSectionTitle = titreTitle || titreRef
      currentLevel = 0
      currentSection = []
      i = j
      continue
    }

    // CHAPITRE (level 1) - ex: "CHAPITRE I", "CHAPITRE II"
    if (/^CHAPITRE\s+[IVXLC]+\s*:?\s*/i.test(line)) {
      // Sauvegarder la section précédente
      if (currentSectionRef && currentSection.length > 0) {
        sections.push({
          reference: currentSectionRef,
          title: currentSectionTitle || currentSectionRef,
          content: currentSection.join('\n').trim(),
          level: currentLevel,
          position: position++
        })
        currentSection = []
      }

      const chapitreMatch = /^(CHAPITRE\s+[IVXLC]+)\s*:?\s*(.*)$/i.exec(line)
      if (chapitreMatch) {
        currentChapitre = chapitreMatch[1].toUpperCase()
        let chapitreTitle = chapitreMatch[2].trim()

        // Si pas de titre sur la même ligne, chercher sur les lignes suivantes
        let j = i + 1
        if (!chapitreTitle) {
          while (j < lines.length && lines[j].trim() &&
                 !/^(SECTION|Article|\d+\.)/i.test(lines[j].trim())) {
            chapitreTitle += (chapitreTitle ? ' ' : '') + lines[j].trim()
            j++
            if (j - i > 3) break
          }
        }

        currentSectionRef = currentChapitre
        currentSectionTitle = chapitreTitle || currentChapitre
        currentLevel = 1
        currentSection = []
        i = j
        continue
      }
    }

    // SECTION (level 1) - ex: "SECTION I", "SECTION II"
    if (/^SECTION\s+[IVXLC]+\s*:?\s*/i.test(line)) {
      // Sauvegarder la section précédente
      if (currentSectionRef && currentSection.length > 0) {
        sections.push({
          reference: currentSectionRef,
          title: currentSectionTitle || currentSectionRef,
          content: currentSection.join('\n').trim(),
          level: currentLevel,
          position: position++
        })
        currentSection = []
      }

      const sectionMatch = /^(SECTION\s+[IVXLC]+)\s*:?\s*(.*)$/i.exec(line)
      if (sectionMatch) {
        let sectionRef = sectionMatch[1].toUpperCase()
        let sectionTitle = sectionMatch[2].trim()

        let j = i + 1
        if (!sectionTitle) {
          while (j < lines.length && lines[j].trim() &&
                 !/^(Article|\d+\.)/i.test(lines[j].trim())) {
            sectionTitle += (sectionTitle ? ' ' : '') + lines[j].trim()
            j++
            if (j - i > 3) break
          }
        }

        currentSectionRef = sectionRef
        currentSectionTitle = sectionTitle || sectionRef
        currentLevel = 1
        currentSection = []
        i = j
        continue
      }
    }

    // ARTICLE (level 2)
    const articleMatch = /^Article\s+(\d+)\s*[:\.\-–—]?\s*(.*)$/i.exec(line)
    if (articleMatch) {
      // Sauvegarder la section précédente
      if (currentSectionRef && currentSection.length > 0) {
        sections.push({
          reference: currentSectionRef,
          title: currentSectionTitle || currentSectionRef,
          content: currentSection.join('\n').trim(),
          level: currentLevel,
          position: position++
        })
      }

      const articleRef = `Article ${articleMatch[1]}`
      let articleContent = articleMatch[2].trim()
      let j = i + 1

      // Lire tout le contenu de l'article jusqu'au prochain article ou section
      while (j < lines.length &&
             !/^(Article|CHAPITRE|SECTION|TITRE|PARTIE)/i.test(lines[j].trim())) {
        if (lines[j].trim()) {
          articleContent += '\n' + lines[j].trim()
        }
        j++
      }

      currentSectionRef = articleRef
      currentSectionTitle = articleRef
      currentSection = [articleContent]
      currentLevel = 2
      i = j
      continue
    }

    // Sous-sections numérotées (level 2) - ex: "I.1.", "II.2.", "III.3."
    const subsectionMatch = /^([IVXLC]+\.\d+\.?)\s+(.+)$/.exec(line)
    if (subsectionMatch && currentLevel === 1) {
      // Sauvegarder la sous-section précédente
      if (currentSectionRef && currentSection.length > 0 && currentLevel === 2) {
        sections.push({
          reference: currentSectionRef,
          title: currentSectionTitle || currentSectionRef,
          content: currentSection.join('\n').trim(),
          level: currentLevel,
          position: position++
        })
      }

      const subsectionRef = subsectionMatch[1]
      let subsectionTitle = subsectionMatch[2].trim()
      let subsectionContent = ''
      let j = i + 1

      // Lire le contenu jusqu'à la prochaine sous-section ou section
      while (j < lines.length &&
             !/^([IVXLC]+\.\d+\.?|Article|CHAPITRE|SECTION)/i.test(lines[j].trim())) {
        if (lines[j].trim()) {
          subsectionContent += (subsectionContent ? '\n' : '') + lines[j].trim()
        }
        j++
      }

      sections.push({
        reference: subsectionRef,
        title: subsectionTitle,
        content: subsectionContent,
        level: 2,
        position: position++
      })

      currentSectionRef = ''
      currentSection = []
      i = j
      continue
    }

    // Ajouter les lignes au contenu de la section en cours
    if (currentSectionRef && line) {
      currentSection.push(line)
    }

    i++
  }

  // Sauvegarder la dernière section
  if (currentSectionRef && currentSection.length > 0) {
    sections.push({
      reference: currentSectionRef,
      title: currentSectionTitle || currentSectionRef,
      content: currentSection.join('\n').trim(),
      level: currentLevel,
      position: position++
    })
  }

  return sections
}

async function insertSectionsForLoiFinances() {
  console.log('🚀 Création des sections pour la Loi de Finances 2025...\n')

  // Récupérer le document
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
  const sections = parseLoiFinances(doc.content || '')

  console.log(`✅ ${sections.length} sections identifiées`)
  console.log(`   Level 0 (Parties/Titres): ${sections.filter(s => s.level === 0).length}`)
  console.log(`   Level 1 (Chapitres/Sections): ${sections.filter(s => s.level === 1).length}`)
  console.log(`   Level 2 (Articles/Sous-sections): ${sections.filter(s => s.level === 2).length}\n`)

  // Afficher quelques exemples
  console.log('📋 Exemples de sections:')
  sections.slice(0, 5).forEach(s => {
    console.log(`   [L${s.level}] ${s.reference}: ${s.title}`)
  })
  console.log('')

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

insertSectionsForLoiFinances().catch(console.error)
