#!/usr/bin/env tsx
// ============================================
// MIGRATION CONSTITUTION → SECTIONS
// Parse la Constitution et crée les sections pour chaque article
// ============================================

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import { parseJuridicalDocument, extractSectionSummary } from '../lib/utils/document-parser'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateConstitutionToSections() {
  console.log('🚀 Début de la migration Constitution → Sections...\n')

  try {
    // 1. Récupérer la Constitution
    console.log('📄 Récupération de la Constitution...')
    const { data: constitution, error: fetchError } = await supabase
      .from('Document')
      .select('*')
      .eq('slug', 'constitution-de-la-republique-du-cameroun')
      .single()

    if (fetchError || !constitution) {
      console.error('❌ Constitution non trouvée:', fetchError)
      process.exit(1)
    }

    console.log(`✓ Constitution trouvée (ID: ${constitution.id})`)
    console.log(`  Contenu: ${constitution.content.length} caractères\n`)

    // 2. Parser le document
    console.log('🔍 Parsing du document...')
    const sections = parseJuridicalDocument(constitution.content, 'CONSTITUTION')
    console.log(`✓ ${sections.length} sections détectées\n`)

    // Afficher un aperçu
    console.log('📊 Aperçu des sections:')
    const sectionsByLevel = {
      0: sections.filter(s => s.level === 0).length, // Titres
      1: sections.filter(s => s.level === 1).length, // Chapitres
      2: sections.filter(s => s.level === 2).length, // Articles
    }
    console.log(`  - Titres/Préambule: ${sectionsByLevel[0]}`)
    console.log(`  - Chapitres: ${sectionsByLevel[1]}`)
    console.log(`  - Articles: ${sectionsByLevel[2]}\n`)

    // 3. Supprimer les anciennes sections de ce document (si réimport)
    console.log('🗑️  Nettoyage des anciennes sections...')
    const { error: deleteError } = await supabase
      .from('Section')
      .delete()
      .eq('documentId', constitution.id)

    if (deleteError) {
      console.warn('⚠️  Erreur lors du nettoyage:', deleteError.message)
    } else {
      console.log('✓ Anciennes sections supprimées\n')
    }

    // 4. Insérer les nouvelles sections
    console.log('💾 Insertion des sections...')
    let insertedCount = 0
    let errorCount = 0

    // Insérer par batch de 50 pour éviter les timeouts
    const batchSize = 50
    for (let i = 0; i < sections.length; i += batchSize) {
      const batch = sections.slice(i, i + batchSize)

      const sectionsToInsert = batch.map(section => ({
        documentId: constitution.id,
        title: section.title,
        content: section.content,
        level: section.level,
        position: section.position,
        reference: section.reference,
        // Stocker l'anchorId dans un champ metadata JSON si besoin
        // Pour l'instant on le génère côté frontend
      }))

      const { data, error } = await supabase
        .from('Section')
        .insert(sectionsToInsert)
        .select()

      if (error) {
        console.error(`  ❌ Erreur batch ${i / batchSize + 1}:`, error.message)
        errorCount += batch.length
      } else {
        insertedCount += data.length
        console.log(`  ✓ Batch ${i / batchSize + 1}: ${data.length} sections insérées`)
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log(`✅ Migration terminée!`)
    console.log(`  - Sections insérées: ${insertedCount}`)
    console.log(`  - Erreurs: ${errorCount}`)
    console.log('='.repeat(60))

    // 5. Afficher quelques exemples
    console.log('\n📝 Exemples de sections créées:')
    const examples = sections.filter(s => s.level === 2).slice(0, 3)
    examples.forEach(ex => {
      console.log(`\n  ${ex.title}`)
      console.log(`  Ancre: #${ex.anchorId}`)
      console.log(`  Contenu: ${ex.content.substring(0, 100)}...`)
    })

  } catch (error: any) {
    console.error('❌ Erreur fatale:', error.message)
    process.exit(1)
  }
}

// Exécuter
migrateConstitutionToSections().catch(error => {
  console.error('❌ Erreur:', error)
  process.exit(1)
})
