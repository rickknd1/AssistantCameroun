#!/usr/bin/env tsx
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function searchPricesInDocuments() {
  console.log('🔍 Recherche des prix dans tous les documents...\n')

  const { data: documents } = await supabase
    .from('Document')
    .select('id, title, slug, content')
    .neq('content', '')

  if (!documents) {
    console.error('Aucun document trouvé')
    return
  }

  console.log(`📚 ${documents.length} documents à analyser\n`)

  const searchTerms = [
    { term: 'CNI', aliases: ['carte nationale', 'carte d\'identité'] },
    { term: 'passeport', aliases: ['passport'] },
    { term: 'visa', aliases: [] },
    { term: 'acte de naissance', aliases: ['extrait de naissance', 'certificat de naissance'] },
    { term: 'casier judiciaire', aliases: ['bulletin n°3'] },
    { term: 'timbre', aliases: ['timbre fiscal'] },
  ]

  const pricePatterns = [
    /(\d+[\s\.]?\d*)\s*(?:FCFA|francs?|F\s*CFA)/gi,
    /(\d+[\s\.]?\d*)\s*F(?:\s|$)/gi,
  ]

  for (const doc of documents) {
    const content = doc.content as string
    if (!content || content.length < 100) continue

    let foundInDoc = false

    for (const { term, aliases } of searchTerms) {
      const allTerms = [term, ...aliases]

      for (const searchTerm of allTerms) {
        // Recherche contextuelle : terme + prix dans un rayon de 200 caractères
        const regex = new RegExp(
          `[^\n]{0,100}${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\n]{0,100}`,
          'gi'
        )
        const matches = content.match(regex)

        if (matches && matches.length > 0) {
          for (const match of matches) {
            // Vérifier s'il y a un prix dans ce contexte
            let hasPrice = false
            let priceInfo = ''

            for (const pricePattern of pricePatterns) {
              const priceMatch = match.match(pricePattern)
              if (priceMatch) {
                hasPrice = true
                priceInfo = priceMatch.join(', ')
                break
              }
            }

            if (hasPrice) {
              if (!foundInDoc) {
                console.log(`\n📄 ${doc.title}`)
                console.log('─'.repeat(80))
                foundInDoc = true
              }

              console.log(`\n🔑 "${searchTerm}" avec prix:`)
              console.log(`   💰 ${priceInfo}`)
              console.log(`   📝 ${match.trim().substring(0, 200)}...`)
            }
          }
        }
      }
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('✅ Recherche terminée!')
}

searchPricesInDocuments().catch(console.error)
