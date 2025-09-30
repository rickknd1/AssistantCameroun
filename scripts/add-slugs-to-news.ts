#!/usr/bin/env tsx
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 100)
}

async function addSlugsToNews() {
  console.log('🚀 Ajout des slugs aux actualités...\n')

  // Récupérer toutes les actualités
  const { data: articles, error } = await supabase
    .from('NewsArticle')
    .select('id, title')

  if (error) {
    console.error('❌ Erreur:', error)
    return
  }

  let successCount = 0
  let errorCount = 0

  for (const article of articles || []) {
    const slug = generateSlug(article.title)
    console.log(`📰 ${article.title}`)
    console.log(`   Slug: ${slug}`)

    const { error: updateError } = await supabase
      .from('NewsArticle')
      .update({ slug })
      .eq('id', article.id)

    if (updateError) {
      console.error(`   ❌ Erreur: ${updateError.message}`)
      errorCount++
    } else {
      console.log(`   ✅ OK`)
      successCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Terminé!`)
  console.log(`   Succès: ${successCount}`)
  console.log(`   Erreurs: ${errorCount}`)
  console.log('='.repeat(50))
}

addSlugsToNews()