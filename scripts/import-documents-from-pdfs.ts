#!/usr/bin/env tsx
// ============================================
// IMPORT DOCUMENTS FROM PDFs
// Extrait les PDFs juridiques et les insère dans Supabase
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

interface PDFDocument {
  filename: string
  title: string
  type: 'CODE' | 'LOI' | 'DÉCRET' | 'ORDONNANCE' | 'ARRÊTÉ'
  category: string
  reference?: string
  dateEnacted?: string
}

// Mapping des fichiers PDF
const pdfDocuments: PDFDocument[] = [
  {
    filename: '150.12.06-Loi-du-29-decembre-2006_Organisation-judiciaire.pdf',
    title: 'Loi portant organisation judiciaire',
    type: 'LOI',
    category: 'Organisation judiciaire',
    reference: 'Loi du 29 décembre 2006',
    dateEnacted: '2006-12-29'
  },
  {
    filename: 'Code de justice administrative.pdf',
    title: 'Code de Justice Administrative',
    type: 'CODE',
    category: 'Droit administratif',
    reference: 'Code de Justice Administrative'
  },
  {
    filename: 'add-1833.pdf',
    title: 'Arrêté N° 1833',
    type: 'ARRÊTÉ',
    category: 'Droit administratif',
    reference: 'Arrêté N° 1833'
  }
]

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
  // Prendre les premiers paragraphes significatifs
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

async function importDocuments() {
  console.log('🚀 Début de l\'import des documents PDF...\n')

  const docsDir = path.join(process.cwd(), 'docs', 'pdfs-officiels')

  if (!fs.existsSync(docsDir)) {
    console.error(`❌ Répertoire non trouvé: ${docsDir}`)
    process.exit(1)
  }

  let successCount = 0
  let errorCount = 0

  for (const doc of pdfDocuments) {
    const filepath = path.join(docsDir, doc.filename)

    // Vérifier si le fichier existe
    if (!fs.existsSync(filepath)) {
      console.log(`⚠️  Fichier non trouvé: ${doc.filename}`)
      errorCount++
      continue
    }

    console.log(`📄 Traitement: ${doc.title}`)

    try {
      // Extraire le contenu du PDF
      console.log('   → Extraction du texte...')
      const content = await extractPDF(filepath)

      if (!content || content.length < 100) {
        console.log(`   ⚠️  Contenu trop court ou vide (${content.length} caractères)`)
        errorCount++
        continue
      }

      // Générer le slug
      const slug = generateSlug(doc.title)

      // Générer le résumé
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
            title: doc.title,
            type: doc.type,
            category: doc.category,
            reference: doc.reference,
            dateEnacted: doc.dateEnacted,
            content,
            summary,
            source: 'Import PDF',
            sourceFile: doc.filename,
            status: 'ACTIVE',
            updatedAt: new Date().toISOString()
          })
          .eq('id', existing.id)

        if (updateError) {
          console.error('   ❌ Erreur mise à jour:', updateError.message)
          errorCount++
        } else {
          console.log('   ✅ Mis à jour avec succès')
          successCount++
        }
      } else {
        // Insérer le document
        console.log('   → Insertion dans Supabase...')

        const { data, error } = await supabase
          .from('Document')
          .insert({
            slug,
            title: doc.title,
            type: doc.type,
            category: doc.category,
            reference: doc.reference,
            dateEnacted: doc.dateEnacted,
            content,
            summary,
            source: 'Import PDF',
            sourceFile: doc.filename,
            status: 'ACTIVE'
          })
          .select()

        if (error) {
          console.error('   ❌ Erreur insertion:', error.message)
          errorCount++
        } else {
          console.log(`   ✅ Inséré avec succès (${content.length} caractères)`)
          successCount++
        }
      }

      console.log('')
    } catch (error: any) {
      console.error(`   ❌ Erreur:`, error.message)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Import terminé!`)
  console.log(`   Succès: ${successCount}`)
  console.log(`   Erreurs: ${errorCount}`)
  console.log('='.repeat(50))
}

// Exécuter
importDocuments().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})