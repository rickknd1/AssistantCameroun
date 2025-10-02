import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

async function analyzeSections() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Récupérer la Constitution
  const { data: doc, error } = await supabase
    .from('Document')
    .select('id, slug, title')
    .ilike('title', '%constitution%')
    .single()

  if (!doc) {
    console.log('❌ Constitution non trouvée')
    return
  }

  console.log('📄 Document:', doc.title)
  console.log('🆔 ID:', doc.id)

  // Récupérer les sections
  const { data: sections } = await supabase
    .from('Section')
    .select('id, title, reference, level, position')
    .eq('documentId', doc.id)
    .order('position', { ascending: true })

  if (!sections || sections.length === 0) {
    console.log('❌ Aucune section trouvée')
    return
  }

  console.log(`\n📊 Total sections: ${sections.length}`)

  // Analyser par niveau
  const byLevel = sections.reduce((acc, s) => {
    acc[s.level] = (acc[s.level] || 0) + 1
    return acc
  }, {} as Record<number, number>)

  console.log('\n📈 Répartition par niveau:')
  Object.entries(byLevel).forEach(([level, count]) => {
    console.log(`  Niveau ${level}: ${count} sections`)
  })

  // Afficher les premiers articles
  const articles = sections.filter(s =>
    s.reference && (
      s.reference.toLowerCase().includes('article') ||
      s.reference.match(/^art/i) ||
      s.reference.match(/^\d+\./i)
    )
  )

  console.log(`\n📝 Articles identifiés: ${articles.length}`)
  console.log('\nPremiers articles:')
  articles.slice(0, 10).forEach(a => {
    console.log(`  - ${a.reference}: ${a.title.substring(0, 60)}...`)
  })

  // Vérifier les autres documents
  console.log('\n\n=== AUTRES DOCUMENTS ===\n')

  const { data: allDocs } = await supabase
    .from('Document')
    .select('id, slug, title, type')
    .order('title')

  if (!allDocs) return

  for (const d of allDocs) {
    const { count } = await supabase
      .from('Section')
      .select('*', { count: 'exact', head: true })
      .eq('documentId', d.id)

    console.log(`📄 ${d.title} (${d.type})`)
    console.log(`   ${count || 0} sections | slug: ${d.slug}`)
  }
}

analyzeSections()
