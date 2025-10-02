#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function listDocumentsWithoutSections() {
  console.log('📋 Liste des documents et leurs sections...\n')

  // Récupérer tous les documents
  const { data: documents } = await supabase
    .from('Document')
    .select('id, title, slug, type')
    .eq('status', 'ACTIVE')
    .order('title')

  if (!documents || documents.length === 0) {
    console.log('❌ Aucun document trouvé')
    return
  }

  for (const doc of documents) {
    const { data: sections, count } = await supabase
      .from('Section')
      .select('*', { count: 'exact', head: false })
      .eq('documentId', doc.id)

    const sectionCount = count || 0
    const status = sectionCount > 0 ? '✅' : '❌'

    console.log(`${status} ${doc.title}`)
    console.log(`   Type: ${doc.type}`)
    console.log(`   Slug: ${doc.slug}`)
    console.log(`   Sections: ${sectionCount}`)

    if (sections && sections.length > 0) {
      const level0 = sections.filter(s => s.level === 0).length
      const level1 = sections.filter(s => s.level === 1).length
      const level2 = sections.filter(s => s.level === 2).length
      console.log(`   Structure: ${level0} titres, ${level1} chapitres, ${level2} articles`)
    }

    console.log('')
  }
}

listDocumentsWithoutSections()
