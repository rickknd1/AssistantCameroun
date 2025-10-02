#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function analyzeCodeCivil() {
  console.log('🔍 Analyse du Code Civil Camerounais...\n')

  const { data: doc } = await supabase
    .from('Document')
    .select('id, title, slug')
    .eq('slug', 'code-civil-camerounais')
    .single()

  if (!doc) {
    console.log('❌ Document non trouvé')
    return
  }

  console.log('📄 Document:', doc.title)
  console.log('   ID:', doc.id, '\n')

  // Charger les sections
  const { data: sections } = await supabase
    .from('Section')
    .select('*')
    .eq('documentId', doc.id)
    .order('position', { ascending: true })
    .limit(20)

  if (!sections || sections.length === 0) {
    console.log('❌ Aucune section trouvée')
    return
  }

  console.log(`📊 Structure des premières sections:\n`)

  sections.forEach((s, i) => {
    console.log(`${i + 1}. [Level ${s.level}] ${s.reference}`)
    console.log(`   Title: ${s.title}`)
    console.log(`   Position: ${s.position}`)
    console.log(`   Content: ${s.content?.substring(0, 100) || 'VIDE'}...`)
    console.log('')
  })

  // Vérifier la distribution par niveau
  const { data: allSections } = await supabase
    .from('Section')
    .select('level')
    .eq('documentId', doc.id)

  if (allSections) {
    const level0 = allSections.filter(s => s.level === 0).length
    const level1 = allSections.filter(s => s.level === 1).length
    const level2 = allSections.filter(s => s.level === 2).length

    console.log('📊 Distribution complète:')
    console.log(`   Level 0 (Titres): ${level0}`)
    console.log(`   Level 1 (Chapitres): ${level1}`)
    console.log(`   Level 2 (Articles): ${level2}`)
    console.log(`   Total: ${allSections.length}`)
  }
}

analyzeCodeCivil()
