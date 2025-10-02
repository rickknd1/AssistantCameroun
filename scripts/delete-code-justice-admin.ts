#!/usr/bin/env tsx
/**
 * SUPPRESSION DU CODE DE JUSTICE ADMINISTRATIVE (français, pas camerounais)
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function deleteCodeJusticeAdmin() {
  console.log('🗑️  Suppression du Code de Justice Administrative...\n')

  // Trouver le document
  const { data: doc } = await supabase
    .from('Document')
    .select('id, title, slug')
    .eq('slug', 'code-de-justice-administrative')
    .single()

  if (!doc) {
    console.log('❌ Document non trouvé (peut-être déjà supprimé)')
    return
  }

  console.log('📄 Document trouvé:')
  console.log('   Titre:', doc.title)
  console.log('   ID:', doc.id)
  console.log('   Slug:', doc.slug, '\n')

  // Supprimer les sections d'abord
  console.log('🗑️  Suppression des sections...')
  const { error: sectionsError, count } = await supabase
    .from('Section')
    .delete({ count: 'exact' })
    .eq('documentId', doc.id)

  if (sectionsError) {
    console.error('❌ Erreur suppression sections:', sectionsError.message)
  } else {
    console.log(`   ✅ ${count || 0} sections supprimées`)
  }

  // Supprimer le document
  console.log('\n🗑️  Suppression du document...')
  const { error: docError } = await supabase
    .from('Document')
    .delete()
    .eq('id', doc.id)

  if (docError) {
    console.error('❌ Erreur suppression document:', docError.message)
    process.exit(1)
  }

  console.log('   ✅ Document supprimé\n')
  console.log('✅ Code de Justice Administrative supprimé avec succès!')
}

deleteCodeJusticeAdmin().catch(console.error)
