#!/usr/bin/env tsx
/**
 * EXTRACTION DES INFORMATIONS DU DÉCRET SUR LES TITRES IDENTITAIRES
 * Pour vérifier les prix officiels de la CNI et autres documents
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function extractDecretInfo() {
  console.log('📜 Extraction des informations du Décret N°2025059...\n')

  const { data: doc } = await supabase
    .from('Document')
    .select('*')
    .ilike('slug', '%decret%2025059%')
    .single()

  if (!doc) {
    console.error('❌ Décret non trouvé')
    return
  }

  console.log(`📄 ${doc.title}`)
  console.log(`   Date: ${doc.dateEnacted}`)
  console.log(`   Longueur: ${(doc.content as string).length} caractères\n`)

  const content = doc.content as string

  // Rechercher les mentions de prix et tarifs
  const searchTerms = [
    { term: 'CNI', context: 'carte nationale' },
    { term: 'timbre', context: 'timbre fiscal' },
    { term: 'prix', context: 'tarif' },
    { term: 'montant', context: 'coût' },
    { term: 'FCFA', context: 'francs' },
    { term: 'frais', context: 'redevance' },
  ]

  console.log('='.repeat(80))
  console.log('🔍 RECHERCHE D\'INFORMATIONS SUR LES PRIX')
  console.log('='.repeat(80))

  for (const { term, context } of searchTerms) {
    const regex = new RegExp(`[^\n]{0,150}${term}[^\n]{0,150}`, 'gi')
    const matches = content.match(regex)

    if (matches && matches.length > 0) {
      console.log(`\n✓ "${term}" trouvé (${matches.length} occurrence(s))`)
      matches.slice(0, 5).forEach((match, i) => {
        console.log(`   ${i + 1}. ${match.trim()}`)
      })
    }
  }

  // Rechercher spécifiquement les articles sur les tarifs
  console.log('\n' + '='.repeat(80))
  console.log('📋 ARTICLES IMPORTANTS')
  console.log('='.repeat(80))

  const { data: sections } = await supabase
    .from('Section')
    .select('*')
    .eq('documentId', doc.id)
    .order('position')

  if (sections) {
    console.log(`\n${sections.length} sections trouvées\n`)

    sections.forEach((section, idx) => {
      const sectionContent = section.content as string

      // Chercher les mentions de prix dans cette section
      const hasPriceInfo = /(?:tarif|prix|montant|frais|coût|FCFA|francs)/gi.test(sectionContent)

      if (hasPriceInfo) {
        console.log(`\n📌 ${section.reference}: ${section.title}`)
        console.log('─'.repeat(80))

        // Extraire les montants
        const amounts = sectionContent.match(/\d+[\s\.]?\d*\s*(?:FCFA|francs?|F\s*CFA)/gi)
        if (amounts && amounts.length > 0) {
          console.log(`💰 Montants: ${amounts.join(', ')}`)
        }

        console.log(`\n📝 Contenu:`)
        console.log(sectionContent.substring(0, 500))
        if (sectionContent.length > 500) console.log('...')
      }
    })
  }

  console.log('\n' + '='.repeat(80))
  console.log('✅ Extraction terminée!')
}

extractDecretInfo().catch(console.error)
