import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Mapping des catégories vers le format de la base de données
const categoryMapping: Record<string, string> = {
  'Identité & Documents': 'procedures-admin',
  'Entreprise & Commerce': 'entreprise',
  'Foncier & Immobilier': 'foncier',
  'Droit du Travail': 'droit-travail',
  'Justice & Tribunaux': 'droit-penal',
  'Fiscalité & Impôts': 'entreprise',
  'Éducation': 'procedures-admin',
  'Santé': 'procedures-admin',
  'Transport': 'procedures-admin',
  'Culture & Patrimoine': 'culture',
  'Gouvernance & Administration': 'procedures-admin',
  'Droits Civiques': 'droit-penal'
}

async function main() {
  console.log('🚀 Conversion et import des questions de quiz...\n')

  // Lire le fichier JSON
  const jsonPath = path.join(__dirname, 'quiz-complete-data.json')
  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Fichier non trouvé: ${jsonPath}`)
    process.exit(1)
  }

  const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'))
  console.log(`📚 ${rawData.length} questions chargées\n`)

  // Convertir les questions au format de la base de données
  const convertedQuestions = rawData.map((q: any) => {
    const answerIndex = q.options.indexOf(q.correctAnswer)

    if (answerIndex === -1) {
      console.warn(`⚠️  Réponse incorrecte pour: ${q.question}`)
    }

    return {
      question: q.question,
      options: q.options,
      answer: answerIndex.toString(), // Convertir l'index en string
      explanation: q.explanation,
      category: categoryMapping[q.category] || 'autre',
      difficulty: q.difficulty as 'Facile' | 'Moyen' | 'Difficile'
    }
  })

  console.log(`✨ ${convertedQuestions.length} questions converties\n`)

  let successCount = 0
  let errorCount = 0

  // Importer par batch de 10
  const batchSize = 10
  for (let i = 0; i < convertedQuestions.length; i += batchSize) {
    const batch = convertedQuestions.slice(i, i + batchSize)

    try {
      const { error } = await supabase
        .from('QuizQuestion')
        .insert(batch)

      if (error) {
        console.error(`❌ Batch ${Math.floor(i / batchSize) + 1}:`, error.message)
        errorCount += batch.length
      } else {
        successCount += batch.length
        console.log(`✅ ${successCount}/${convertedQuestions.length} questions importées`)
      }
    } catch (err: any) {
      console.error(`❌ Exception:`, err.message)
      errorCount += batch.length
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`✨ Import terminé!`)
  console.log(`${'='.repeat(60)}`)
  console.log(`   ✅ Succès: ${successCount} questions`)
  console.log(`   ❌ Erreurs: ${errorCount} questions\n`)
}

main().catch(console.error)
