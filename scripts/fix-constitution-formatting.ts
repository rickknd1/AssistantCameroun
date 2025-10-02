#!/usr/bin/env tsx
/**
 * CORRECTION DU FORMATAGE DE LA CONSTITUTION
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function fixConstitutionFormatting() {
  console.log('🔧 Correction du formatage de la Constitution...\n')

  const { data: doc } = await supabase
    .from('Document')
    .select('*')
    .eq('slug', 'constitution-de-la-republique-du-cameroun')
    .single()

  if (!doc) {
    console.error('❌ Constitution non trouvée')
    return
  }

  console.log(`📄 ${doc.title}\n`)

  const { data: sections } = await supabase
    .from('Section')
    .select('*')
    .eq('documentId', doc.id)
    .order('position')

  if (!sections || sections.length === 0) {
    console.error('❌ Aucune section trouvée')
    return
  }

  console.log(`📋 ${sections.length} sections à vérifier\n`)

  let fixedCount = 0
  let issues: string[] = []

  for (const section of sections) {
    let needsUpdate = false
    const updates: any = {}

    // Vérifier le titre
    if (!section.title || section.title.trim() === '') {
      issues.push(`Section ${section.id}: Titre vide`)
      updates.title = section.reference || 'Sans titre'
      needsUpdate = true
    }

    // Vérifier la référence
    if (!section.reference || section.reference.trim() === '') {
      issues.push(`Section ${section.id}: Référence vide`)
      updates.reference = `Section ${section.position + 1}`
      needsUpdate = true
    }

    // Vérifier le contenu
    if (!section.content || section.content.trim() === '') {
      issues.push(`Section ${section.id}: Contenu vide`)
      // Ne pas mettre à jour le contenu vide, il faut les données d'origine
    } else {
      // Nettoyer le contenu
      const cleanContent = (section.content as string)
        .replace(/\r\n/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .trim()

      if (cleanContent !== section.content) {
        updates.content = cleanContent
        needsUpdate = true
      }
    }

    if (needsUpdate) {
      const { error } = await supabase
        .from('Section')
        .update(updates)
        .eq('id', section.id)

      if (error) {
        console.error(`❌ Erreur pour section ${section.id}:`, error.message)
      } else {
        fixedCount++
        console.log(`✓ Corrigé: ${section.reference}`)
      }
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log(`✅ ${fixedCount} sections corrigées`)

  if (issues.length > 0) {
    console.log(`\n⚠️  ${issues.length} problèmes détectés:`)
    issues.slice(0, 10).forEach(issue => console.log(`   • ${issue}`))
    if (issues.length > 10) {
      console.log(`   ... et ${issues.length - 10} autres`)
    }
  }
}

fixConstitutionFormatting().catch(console.error)
