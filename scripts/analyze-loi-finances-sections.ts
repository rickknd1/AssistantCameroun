#!/usr/bin/env tsx
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function analyzeSections() {
  console.log('📊 Analyse détaillée de la Loi de Finances 2025...\n')

  // Récupérer le document
  const { data: doc } = await supabase
    .from('Document')
    .select('*')
    .eq('slug', 'loi-de-finances-2025')
    .single()

  if (!doc) {
    console.error('❌ Document non trouvé')
    return
  }

  console.log(`📄 ${doc.title}`)
  console.log(`   Type: ${doc.type}`)
  console.log(`   Catégorie: ${doc.category}`)
  console.log(`   Longueur contenu: ${(doc.content as string).length} caractères`)

  // Récupérer les sections
  const { data: sections } = await supabase
    .from('Section')
    .select('*')
    .eq('documentId', doc.id)
    .order('position')

  console.log(`\n📑 ${sections?.length || 0} sections trouvées\n`)
  console.log('='.repeat(80))

  if (sections) {
    sections.forEach((section, idx) => {
      console.log(`\n${idx + 1}. ${section.reference}: ${section.title}`)
      console.log('─'.repeat(80))
      console.log(`   Niveau: ${section.level}`)
      console.log(`   Position: ${section.position}`)

      const content = section.content as string
      console.log(`   Longueur: ${content.length} caractères`)

      // Rechercher des montants
      const amounts = content.match(/\d+[\s\.]?\d*\s*(?:milliards?|millions?|FCFA|francs?|F\s*CFA)/gi)
      if (amounts && amounts.length > 0) {
        console.log(`\n   💰 Montants trouvés (${amounts.length}):`)
        amounts.slice(0, 10).forEach(amount => {
          console.log(`      • ${amount}`)
        })
      }

      // Rechercher des mots-clés administratifs
      const adminKeywords = ['CNI', 'passeport', 'visa', 'timbre', 'taxe', 'droit', 'frais', 'tarif']
      const foundKeywords = adminKeywords.filter(kw =>
        content.toLowerCase().includes(kw.toLowerCase())
      )

      if (foundKeywords.length > 0) {
        console.log(`\n   🔑 Mots-clés: ${foundKeywords.join(', ')}`)

        // Afficher le contexte
        foundKeywords.forEach(kw => {
          const regex = new RegExp(`[^\n]{0,80}${kw}[^\n]{0,80}`, 'gi')
          const matches = content.match(regex)
          if (matches && matches.length > 0) {
            console.log(`\n   📝 Contexte "${kw}":`)
            matches.slice(0, 2).forEach(match => {
              console.log(`      "${match.trim()}"`)
            })
          }
        })
      }

      // Afficher un extrait du contenu
      console.log(`\n   📖 Extrait:`)
      console.log(`      ${content.substring(0, 300).replace(/\n/g, ' ')}...`)
    })
  }

  console.log('\n' + '='.repeat(80))

  // Analyser le contenu complet pour des patterns spécifiques
  const fullContent = doc.content as string

  console.log('\n🔍 ANALYSE DU CONTENU COMPLET')
  console.log('='.repeat(80))

  // Chercher des tables de tarifs
  const tablePatterns = [
    /(?:tarifs?|prix|coûts?|montants?)[\s\S]{0,500}(?:FCFA|francs?)/gi,
    /annexe[\s\S]{0,200}(?:tarif|prix|fiscalité)/gi,
  ]

  tablePatterns.forEach((pattern, idx) => {
    const matches = fullContent.match(pattern)
    if (matches && matches.length > 0) {
      console.log(`\n✓ Pattern ${idx + 1} trouvé (${matches.length} fois):`)
      matches.slice(0, 3).forEach(match => {
        console.log(`   ${match.substring(0, 200)}...`)
      })
    }
  })

  console.log('\n✅ Analyse terminée!')
}

analyzeSections().catch(console.error)
