#!/usr/bin/env tsx
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function getProcedureDetails() {
  console.log('📋 Récupération des détails des procédures...\n')

  const { data: procedures, error } = await supabase
    .from('Procedure')
    .select('*')
    .order('name')

  if (error) {
    console.error('❌ Erreur:', error)
    return
  }

  console.log(`Total: ${procedures?.length || 0} procédures\n`)
  console.log('='.repeat(80))

  procedures?.forEach((proc, index) => {
    console.log(`\n${index + 1}. ${proc.name}`)
    console.log('─'.repeat(80))
    console.log(`   ID: ${proc.id}`)
    console.log(`   Slug: ${proc.slug}`)
    console.log(`   Catégorie: ${proc.category || 'Non définie'}`)
    console.log(`   Coût: ${proc.costs || 'Non défini'}`)
    console.log(`   Durée: ${proc.duration || 'Non définie'}`)
    console.log(`   Difficulté: ${proc.difficulty || 'Non définie'}`)

    if (proc.description) {
      console.log(`   Description: ${proc.description.substring(0, 150)}...`)
    }

    if (proc.requirements && Array.isArray(proc.requirements)) {
      console.log(`   Documents requis (${proc.requirements.length}):`)
      proc.requirements.forEach((req: any) => {
        console.log(`      - ${req.name || req}`)
      })
    }

    if (proc.steps && Array.isArray(proc.steps)) {
      console.log(`   Étapes (${proc.steps.length}):`)
      proc.steps.forEach((step: any, i: number) => {
        console.log(`      ${i + 1}. ${step.title || step.description || step}`)
      })
    }
  })

  console.log('\n' + '='.repeat(80))
  console.log('✅ Terminé!')
}

getProcedureDetails().catch(console.error)
