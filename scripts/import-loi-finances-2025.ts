#!/usr/bin/env tsx
// ============================================
// IMPORT LOI DE FINANCES 2025
// Import de la Loi de Finances 2025 dans Supabase
// ============================================

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import pdf from 'pdf-parse'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

function extractSummary(content: string, maxLength: number = 500): string {
  // Extraire les premiers paragraphes significatifs
  const paragraphs = content
    .split('\n')
    .map(p => p.trim())
    .filter(p => p.length > 50)
    .slice(0, 3)

  const summary = paragraphs.join(' ')
  return summary.length > maxLength
    ? summary.substring(0, maxLength) + '...'
    : summary
}

async function extractPDF(filepath: string): Promise<string> {
  try {
    const dataBuffer = fs.readFileSync(filepath)
    const data = await pdf(dataBuffer)
    return data.text
  } catch (error) {
    console.error(`Erreur lors de l'extraction de ${filepath}:`, error)
    return ''
  }
}

function parseDocument(content: string, documentId: string) {
  const sections: any[] = []
  let position = 0

  // Patterns pour identifier les différentes structures
  const patterns = [
    // Titres (TITRE I, TITRE II, etc.)
    {
      regex: /^(TITRE\s+[IVXLCDM]+)\s*[:\-]?\s*(.+?)$/gim,
      level: 0,
    },
    // Chapitres (CHAPITRE I, CHAPITRE 1, etc.)
    {
      regex: /^(CHAPITRE\s+(?:[IVXLCDM]+|\d+))\s*[:\-]?\s*(.+?)$/gim,
      level: 1,
    },
    // Sections (Section I, Section 1, etc.)
    {
      regex: /^(Section\s+(?:[IVXLCDM]+|\d+))\s*[:\-]?\s*(.+?)$/gim,
      level: 1,
    },
    // Articles (Article 1, Article premier, Art. 1, etc.)
    {
      regex: /^((?:Article|Art\.?)\s+(?:premier|\d+(?:\s*\w+)?))[\s:\-]*(.*?)$/gim,
      level: 2,
    },
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

    // Essayer chaque pattern
    for (const pattern of patterns) {
      const matches = trimmedLine.match(pattern.regex)
      if (matches) {
        // Sauvegarder la section précédente
        saveCurrentSection()

        // Créer une nouvelle section
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

  // Sauvegarder la dernière section
  saveCurrentSection()

  return sections
}

async function importLoiFinances() {
  console.log('🚀 Début de l\'import de la Loi de Finances 2025...\n')

  const filepath = path.join('C:', 'Users', 'kayze', 'Desktop', 'AC', 'AssistantCameroun', 'loi de finance 2025.pdf')

  // Vérifier si le fichier existe
  if (!fs.existsSync(filepath)) {
    console.error(`❌ Fichier non trouvé: ${filepath}`)
    process.exit(1)
  }

  console.log(`📄 Traitement: Loi de Finances 2025`)

  try {
    // Extraire le contenu du PDF
    console.log('   → Extraction du texte du PDF...')
    const content = await extractPDF(filepath)

    if (!content || content.length < 100) {
      console.log(`   ⚠️  Contenu trop court ou vide (${content.length} caractères)`)
      process.exit(1)
    }

    console.log(`   ✓ Extraction réussie (${content.length} caractères)`)

    // Informations du document
    const title = 'Loi de Finances 2025'
    const slug = generateSlug(title)
    const summary = extractSummary(content)

    // Vérifier si le document existe déjà
    const { data: existing } = await supabase
      .from('Document')
      .select('id')
      .eq('slug', slug)
      .single()

    let documentId: string

    if (existing) {
      console.log(`   ℹ️  Document déjà existant, mise à jour...`)

      const { error: updateError } = await supabase
        .from('Document')
        .update({
          title,
          type: 'LOI',
          category: 'Droit fiscal',
          reference: 'Loi de Finances pour l\'exercice 2025',
          dateEnacted: '2025-01-01',
          content,
          summary,
          source: 'Import PDF officiel',
          sourceFile: 'loi de finance 2025.pdf',
          status: 'ACTIVE',
          updatedAt: new Date().toISOString()
        })
        .eq('id', existing.id)

      if (updateError) {
        console.error('   ❌ Erreur mise à jour:', updateError.message)
        process.exit(1)
      }

      documentId = existing.id
      console.log('   ✅ Mis à jour avec succès')
    } else {
      // Insérer le document
      console.log('   → Insertion dans Supabase...')

      const { data, error } = await supabase
        .from('Document')
        .insert({
          slug,
          title,
          type: 'LOI',
          category: 'Droit fiscal',
          subcategory: 'Budget et finances publiques',
          reference: 'Loi de Finances pour l\'exercice 2025',
          dateEnacted: '2025-01-01',
          content,
          summary,
          source: 'Import PDF officiel',
          sourceFile: 'loi de finance 2025.pdf',
          status: 'ACTIVE',
          tags: ['loi de finances', 'budget', 'fiscalité', '2025', 'finances publiques']
        })
        .select()

      if (error) {
        console.error('   ❌ Erreur insertion:', error.message)
        process.exit(1)
      }

      documentId = data[0].id
      console.log(`   ✅ Inséré avec succès (${content.length} caractères)`)
      console.log(`   📊 ID: ${documentId}`)
      console.log(`   📝 Slug: ${slug}`)
    }

    // Parser et créer les sections
    console.log('\n   → Parsing des sections...')
    const sections = parseDocument(content, documentId)

    if (sections.length > 0) {
      // Supprimer les anciennes sections si mise à jour
      if (existing) {
        await supabase.from('Section').delete().eq('documentId', documentId)
      }

      // Insérer les nouvelles sections
      const { error: sectionsError } = await supabase
        .from('Section')
        .insert(sections)

      if (sectionsError) {
        console.error('   ❌ Erreur insertion sections:', sectionsError.message)
      } else {
        console.log(`   ✓ ${sections.length} sections créées`)
      }
    } else {
      console.log('   ⚠️  Aucune section détectée')
    }

    console.log('\n' + '='.repeat(50))
    console.log(`✅ Import terminé avec succès!`)
    console.log('='.repeat(50))
  } catch (error: any) {
    console.error(`   ❌ Erreur:`, error.message)
    process.exit(1)
  }
}

// Exécuter
importLoiFinances().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
