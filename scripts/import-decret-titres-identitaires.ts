#!/usr/bin/env tsx
// ============================================
// IMPORT DÉCRET N°2025059 SUR LES TITRES IDENTITAIRES
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

  const patterns = [
    { regex: /^(CHAPITRE\s+(?:[IVXLCDM]+|\d+))\s*[:\-]?\s*(.+?)$/gim, level: 0 },
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

async function importDecretTitres() {
  console.log('🚀 Import du Décret N°2025059 sur les titres identitaires...\n')

  const baseDir = 'C:\\Users\\kayze\\Desktop\\AC\\AssistantCameroun'

  // Lister tous les PDFs
  const files = fs.readdirSync(baseDir).filter(f => f.toLowerCase().includes('decret') || f.toLowerCase().includes('décret'))
  console.log('Fichiers trouvés:', files)

  if (files.length === 0) {
    console.error('❌ Aucun fichier décret trouvé')
    process.exit(1)
  }

  const filepath = path.join(baseDir, files[0])
  console.log(`📄 Utilisation du fichier: ${filepath}\n`)

  if (!fs.existsSync(filepath)) {
    console.error(`❌ Fichier non trouvé: ${filepath}`)
    process.exit(1)
  }

  console.log(`📄 Traitement: Décret N°2025059`)

  try {
    console.log('   → Extraction du texte du PDF...')
    const content = await extractPDF(filepath)

    if (!content || content.length < 100) {
      console.log(`   ⚠️  Contenu trop court ou vide (${content.length} caractères)`)
      process.exit(1)
    }

    console.log(`   ✓ Extraction réussie (${content.length} caractères)`)

    const title = 'Décret N°2025059 fixant les caractéristiques et modalités d\'établissement des titres identitaires'
    const slug = generateSlug(title)
    const summary = extractSummary(content)

    const { data: existing } = await supabase
      .from('Document')
      .select('id')
      .eq('slug', slug)
      .single()

    let documentId: string

    if (existing) {
      console.log(`   ℹ️  Document existant, mise à jour...`)

      const { error: updateError } = await supabase
        .from('Document')
        .update({
          title,
          type: 'LOI',
          category: 'État civil et identification',
          subcategory: 'Titres identitaires',
          reference: 'Décret N°2025059 du 28 février 2025',
          dateEnacted: '2025-02-28',
          content,
          summary,
          source: 'Import PDF officiel',
          sourceFile: 'Décret N°2025059 du 28 février 2025 fixant les caractéristiques et les modalités d\'établissement et de délivrance des titres identitaires.pdf',
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
      console.log('   → Insertion dans Supabase...')

      const { data, error } = await supabase
        .from('Document')
        .insert({
          slug,
          title,
          type: 'LOI',
          category: 'État civil et identification',
          subcategory: 'Titres identitaires',
          reference: 'Décret N°2025059 du 28 février 2025',
          dateEnacted: '2025-02-28',
          content,
          summary,
          source: 'Import PDF officiel',
          sourceFile: 'Décret N°2025059 du 28 février 2025 fixant les caractéristiques et les modalités d\'établissement et de délivrance des titres identitaires.pdf',
          status: 'ACTIVE',
          tags: ['décret', 'CNI', 'carte d\'identité', 'titres identitaires', 'état civil', '2025']
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

    console.log('\n   → Parsing des sections...')
    const sections = parseDocument(content, documentId)

    if (sections.length > 0) {
      if (existing) {
        await supabase.from('Section').delete().eq('documentId', documentId)
      }

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

importDecretTitres().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
