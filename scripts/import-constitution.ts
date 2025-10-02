#!/usr/bin/env tsx
// ============================================
// IMPORT CONSTITUTION DU CAMEROUN
// Import de la Constitution dans Supabase
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
  // Extraire le préambule comme résumé
  const preambleMatch = content.match(/PREAMBULE\s+([\s\S]+?)(?=TITRE PREMIER|$)/i)

  if (preambleMatch) {
    const preamble = preambleMatch[1]
      .trim()
      .replace(/\s+/g, ' ')
      .substring(0, maxLength * 2)

    const sentences = preamble.split(/[.;]/).slice(0, 3)
    const summary = sentences.join('. ')

    return summary.length > maxLength
      ? summary.substring(0, maxLength) + '...'
      : summary + '.'
  }

  // Fallback sur les premiers paragraphes
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

async function importConstitution() {
  console.log('🚀 Début de l\'import de la Constitution du Cameroun...\n')

  const filepath = path.join('C:', 'Users', 'kayze', 'Downloads', 'La_Constitution.pdf')

  // Vérifier si le fichier existe
  if (!fs.existsSync(filepath)) {
    console.error(`❌ Fichier non trouvé: ${filepath}`)
    process.exit(1)
  }

  console.log(`📄 Traitement: Constitution de la République du Cameroun`)

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
    const title = 'Constitution de la République du Cameroun'
    const slug = generateSlug(title)
    const summary = extractSummary(content)

    // Vérifier si le document existe déjà
    const { data: existing } = await supabase
      .from('Document')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      console.log(`   ℹ️  Document déjà existant, mise à jour...`)

      const { error: updateError } = await supabase
        .from('Document')
        .update({
          title,
          type: 'LOI',
          category: 'Droit constitutionnel',
          reference: 'Loi n°96/06 du 18 janvier 1996, modifiée par la loi n°2008/001 du 14 avril 2008',
          dateEnacted: '1996-01-18',
          content,
          summary,
          source: 'Import PDF officiel',
          sourceFile: 'La_Constitution.pdf',
          status: 'ACTIVE',
          updatedAt: new Date().toISOString()
        })
        .eq('id', existing.id)

      if (updateError) {
        console.error('   ❌ Erreur mise à jour:', updateError.message)
        process.exit(1)
      } else {
        console.log('   ✅ Mis à jour avec succès')
      }
    } else {
      // Insérer le document
      console.log('   → Insertion dans Supabase...')

      const { data, error } = await supabase
        .from('Document')
        .insert({
          slug,
          title,
          type: 'LOI',
          category: 'Droit constitutionnel',
          reference: 'Loi n°96/06 du 18 janvier 1996, modifiée par la loi n°2008/001 du 14 avril 2008',
          dateEnacted: '1996-01-18',
          content,
          summary,
          source: 'Import PDF officiel',
          sourceFile: 'La_Constitution.pdf',
          status: 'ACTIVE',
          tags: ['constitution', 'loi fondamentale', 'droit constitutionnel', 'cameroun']
        })
        .select()

      if (error) {
        console.error('   ❌ Erreur insertion:', error.message)
        process.exit(1)
      } else {
        console.log(`   ✅ Inséré avec succès (${content.length} caractères)`)
        console.log(`   📊 ID: ${data[0].id}`)
        console.log(`   📝 Slug: ${slug}`)
      }
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
importConstitution().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
