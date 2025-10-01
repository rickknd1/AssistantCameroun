import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Charger les variables d'environnement depuis .env
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  console.error('   Assurez-vous que NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définis')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function main() {
  console.log('🚀 Début de l\'import des 216 questions de quiz...\n')

  // Lire le fichier JSON
  const jsonPath = path.join(__dirname, 'quiz-complete-data.json')

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Fichier non trouvé: ${jsonPath}`)
    process.exit(1)
  }

  const quizData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  console.log(`📚 ${quizData.length} questions chargées depuis le fichier JSON\n`)

  // Statistiques par catégorie
  const stats: Record<string, { facile: number; moyen: number; difficile: number }> = {}

  let successCount = 0
  let errorCount = 0

  // Importer les questions par batch de 10 pour éviter les timeouts
  const batchSize = 10
  for (let i = 0; i < quizData.length; i += batchSize) {
    const batch = quizData.slice(i, i + batchSize)

    try {
      const { error } = await supabase
        .from('QuizQuestion')
        .insert(batch)

      if (error) {
        console.error(`❌ Erreur batch ${Math.floor(i / batchSize) + 1}:`, error.message)
        errorCount += batch.length
      } else {
        successCount += batch.length

        // Mise à jour des stats
        batch.forEach((q: any) => {
          if (!stats[q.category]) {
            stats[q.category] = { facile: 0, moyen: 0, difficile: 0 }
          }
          const diffKey = q.difficulty.toLowerCase() as 'facile' | 'moyen' | 'difficile'
          stats[q.category][diffKey]++
        })

        console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(quizData.length / batchSize)} - ${successCount}/${quizData.length} questions importées`)
      }
    } catch (err: any) {
      console.error(`❌ Exception batch ${Math.floor(i / batchSize) + 1}:`, err.message)
      errorCount += batch.length
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`✨ Import terminé!`)
  console.log(`${'='.repeat(60)}`)
  console.log(`   ✅ Succès: ${successCount} questions`)
  console.log(`   ❌ Erreurs: ${errorCount} questions`)
  console.log(`\n📊 Statistiques par catégorie:\n`)

  Object.entries(stats).forEach(([category, counts]) => {
    const total = counts.facile + counts.moyen + counts.difficile
    console.log(`   ${category}:`)
    console.log(`      - Facile: ${counts.facile}`)
    console.log(`      - Moyen: ${counts.moyen}`)
    console.log(`      - Difficile: ${counts.difficile}`)
    console.log(`      - Total: ${total}\n`)
  })
}

main().catch(console.error)
