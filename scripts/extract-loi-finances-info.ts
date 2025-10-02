#!/usr/bin/env tsx
// ============================================
// EXTRACTION DES INFORMATIONS DE LA LOI DE FINANCES 2025
// Extraction des prix, tarifs et procédures
// ============================================

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

interface ExtractedInfo {
  category: string
  item: string
  value: string
  reference: string
}

async function extractFinancialInfo() {
  console.log('📊 Extraction des informations de la Loi de Finances 2025...\n')

  // Récupérer le document
  const { data: doc, error } = await supabase
    .from('Document')
    .select('*')
    .eq('slug', 'loi-de-finances-2025')
    .single()

  if (error || !doc) {
    console.error('❌ Document non trouvé:', error)
    return
  }

  const content = doc.content as string
  const extractedInfo: ExtractedInfo[] = []

  // Patterns pour extraire les informations importantes
  const patterns = [
    // Prix et montants en FCFA
    {
      regex: /(\d+(?:\s*\d+)*)\s*(?:FCFA|francs?|F\s*CFA)/gi,
      category: 'Montants'
    },
    // Tarifs et taxes
    {
      regex: /(taxe|impôt|droit|redevance|cotisation|contribution)[^.]+?(\d+(?:\s*\d+)*)\s*(?:FCFA|francs?|%|F\s*CFA)/gi,
      category: 'Fiscalité'
    },
    // Salaires et rémunérations
    {
      regex: /(salaire|rémunération|indemnité|prime)[^.]+?(\d+(?:\s*\d+)*)\s*(?:FCFA|francs?|F\s*CFA)/gi,
      category: 'Rémunérations'
    },
    // Frais administratifs
    {
      regex: /(frais|coût|prix)[^.]+?(?:carte|passeport|visa|CNI|acte|extrait|timbre)[^.]+?(\d+(?:\s*\d+)*)\s*(?:FCFA|francs?|F\s*CFA)/gi,
      category: 'Frais administratifs'
    },
  ]

  console.log('🔍 Recherche des informations financières...\n')

  // Extraire les sections pour mieux contextualiser
  const { data: sections } = await supabase
    .from('Section')
    .select('*')
    .eq('documentId', doc.id)
    .order('position')

  if (sections && sections.length > 0) {
    console.log(`📄 Analyse de ${sections.length} sections...\n`)

    for (const section of sections) {
      console.log(`\n📌 ${section.reference}: ${section.title}`)
      console.log('─'.repeat(70))

      const sectionContent = section.content as string

      // Rechercher les montants
      const amounts = sectionContent.match(/\d+(?:\s*\d+)*\s*(?:FCFA|francs?|F\s*CFA)/gi)
      if (amounts && amounts.length > 0) {
        console.log(`💰 Montants trouvés: ${amounts.length}`)
        amounts.slice(0, 5).forEach(amount => {
          console.log(`   • ${amount}`)
        })
      }

      // Rechercher les pourcentages
      const percentages = sectionContent.match(/\d+(?:[,.]\d+)?\s*%/g)
      if (percentages && percentages.length > 0) {
        console.log(`📊 Pourcentages trouvés: ${percentages.length}`)
        percentages.slice(0, 5).forEach(pct => {
          console.log(`   • ${pct}`)
        })
      }

      // Rechercher des mots-clés importants
      const keywords = [
        'CNI', 'carte nationale', 'passeport', 'visa',
        'acte de naissance', 'casier judiciaire',
        'timbre', 'taxe', 'impôt', 'droit',
        'salaire', 'SMIG', 'minimum',
        'tarif', 'prix', 'coût', 'frais'
      ]

      const foundKeywords = keywords.filter(kw =>
        sectionContent.toLowerCase().includes(kw.toLowerCase())
      )

      if (foundKeywords.length > 0) {
        console.log(`🔑 Mots-clés pertinents: ${foundKeywords.join(', ')}`)
      }
    }
  }

  // Afficher un résumé global
  console.log('\n\n' + '='.repeat(70))
  console.log('📋 RÉSUMÉ DES INFORMATIONS CLÉS')
  console.log('='.repeat(70))

  // Extraire des statistiques globales
  const allAmounts = content.match(/\d+(?:\s*\d+)*\s*(?:FCFA|francs?|F\s*CFA)/gi)
  const allPercentages = content.match(/\d+(?:[,.]\d+)?\s*%/g)

  console.log(`\n💰 Total de montants mentionnés: ${allAmounts?.length || 0}`)
  console.log(`📊 Total de pourcentages mentionnés: ${allPercentages?.length || 0}`)

  // Rechercher des informations spécifiques sur les documents administratifs
  console.log('\n📝 Recherche de frais administratifs spécifiques...')

  const adminDocs = [
    'carte nationale d\'identité',
    'CNI',
    'passeport',
    'visa',
    'acte de naissance',
    'extrait de naissance',
    'casier judiciaire',
    'certificat de nationalité',
    'timbre fiscal'
  ]

  for (const docType of adminDocs) {
    const regex = new RegExp(`${docType}[^.]*?(\\d+(?:\\s*\\d+)*)\\s*(?:FCFA|francs?|F\\s*CFA)`, 'gi')
    const matches = content.match(regex)
    if (matches && matches.length > 0) {
      console.log(`\n✓ ${docType.toUpperCase()}:`)
      matches.slice(0, 3).forEach(match => {
        console.log(`   ${match}`)
      })
    }
  }

  console.log('\n' + '='.repeat(70))
  console.log('✅ Extraction terminée!')
  console.log('='.repeat(70))
}

extractFinancialInfo().catch(console.error)
