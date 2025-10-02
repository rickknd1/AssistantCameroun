#!/usr/bin/env tsx
import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sampleCodeCivil() {
  const { data: doc } = await supabase
    .from('Document')
    .select('content')
    .eq('slug', 'code-civil-camerounais')
    .single()

  if (!doc) {
    console.log('❌ Document non trouvé')
    return
  }

  const content = doc.content || ''
  const lines = content.split('\n')

  console.log('📝 Échantillon du Code Civil Camerounais:\n')
  console.log('--- Premières 200 lignes ---\n')

  lines.slice(0, 200).forEach((line, i) => {
    if (line.trim()) {
      console.log(`${i}: ${line}`)
    }
  })

  console.log('\n--- Recherche de patterns "LIVRE", "TITRE", "CHAPITRE" ---\n')

  let count = 0
  lines.forEach((line, i) => {
    if (count >= 30) return
    if (/^(LIVRE|TITRE|CHAPITRE|SECTION)\s+[IVXLC]+/i.test(line.trim())) {
      console.log(`${i}: ${line}`)
      if (i < lines.length - 1) {
        console.log(`${i+1}: ${lines[i+1]}`)
      }
      console.log('')
      count++
    }
  })
}

sampleCodeCivil()
