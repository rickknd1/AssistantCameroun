import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Use anon key for client operations

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Translation mappings for quiz questions
const quizTranslations: Record<string, { questionEn: string; explanationEn: string; optionsEn: string[] }> = {
  "Quelle est la durée de validité d'une carte nationale d'identité au Cameroun ?": {
    questionEn: "What is the validity period of a national ID card in Cameroon?",
    explanationEn: "The Cameroonian ID card is valid for 10 years for adults and 5 years for minors.",
    optionsEn: ["5 years", "10 years", "15 years", "Lifetime"]
  },
  "Quel est le coût d'obtention d'un passeport ordinaire au Cameroun ?": {
    questionEn: "What is the cost of obtaining an ordinary passport in Cameroon?",
    explanationEn: "The cost of an ordinary passport is 75,000 FCFA for Cameroonian nationals.",
    optionsEn: ["50,000 FCFA", "75,000 FCFA", "100,000 FCFA", "125,000 FCFA"]
  },
  "Quelle est la capitale administrative du Cameroun ?": {
    questionEn: "What is the administrative capital of Cameroon?",
    explanationEn: "Yaoundé is the administrative capital of Cameroon, while Douala is the economic capital.",
    optionsEn: ["Douala", "Yaoundé", "Garoua", "Bamenda"]
  },
}

// New quiz questions to add (bilingual)
const newQuizQuestions = [
  // Identity & Documents - Easy
  {
    question: "Combien de temps faut-il pour obtenir une CNI au Cameroun ?",
    questionEn: "How long does it take to get a national ID card in Cameroon?",
    options: ["1 semaine", "2-4 semaines", "2-3 mois", "6 mois"],
    optionsEn: ["1 week", "2-4 weeks", "2-3 months", "6 months"],
    answer: "1",
    explanation: "Le délai moyen est de 2 à 4 semaines après l'enrôlement biométrique.",
    explanationEn: "The average timeframe is 2 to 4 weeks after biometric enrollment.",
    category: "identite",
    difficulty: "Facile"
  },
  {
    question: "Quel document est nécessaire pour obtenir un acte de naissance ?",
    questionEn: "What document is needed to obtain a birth certificate?",
    options: ["Passeport", "Carte d'identité", "Extrait de naissance", "Certificat de nationalité"],
    optionsEn: ["Passport", "ID card", "Birth excerpt", "Nationality certificate"],
    answer: "1",
    explanation: "Une carte d'identité valide est requise pour obtenir un acte de naissance.",
    explanationEn: "A valid ID card is required to obtain a birth certificate.",
    category: "identite",
    difficulty: "Facile"
  },
  {
    question: "Quel est le coût approximatif d'un acte de naissance au Cameroun ?",
    questionEn: "What is the approximate cost of a birth certificate in Cameroon?",
    options: ["500 FCFA", "1000 FCFA", "2000 FCFA", "5000 FCFA"],
    optionsEn: ["500 FCFA", "1000 FCFA", "2000 FCFA", "5000 FCFA"],
    answer: "1",
    explanation: "Le coût standard d'un acte de naissance est d'environ 1000 FCFA.",
    explanationEn: "The standard cost of a birth certificate is approximately 1000 FCFA.",
    category: "identite",
    difficulty: "Facile"
  },

  // Business - Easy
  {
    question: "Quel est le capital minimum pour créer une SARL au Cameroun ?",
    questionEn: "What is the minimum capital to create an LLC in Cameroon?",
    options: ["100,000 FCFA", "500,000 FCFA", "1,000,000 FCFA", "Aucun minimum"],
    optionsEn: ["100,000 FCFA", "500,000 FCFA", "1,000,000 FCFA", "No minimum"],
    answer: "3",
    explanation: "Il n'y a pas de capital minimum obligatoire pour créer une SARL au Cameroun depuis 2017.",
    explanationEn: "There is no mandatory minimum capital to create an LLC in Cameroon since 2017.",
    category: "entreprise",
    difficulty: "Facile"
  },
  {
    question: "Combien de temps faut-il pour créer une entreprise au Cameroun ?",
    questionEn: "How long does it take to create a business in Cameroon?",
    options: ["1 jour", "3-5 jours", "2 semaines", "1 mois"],
    optionsEn: ["1 day", "3-5 days", "2 weeks", "1 month"],
    answer: "1",
    explanation: "Avec le guichet unique, la création d'entreprise peut se faire en 1 à 3 jours.",
    explanationEn: "With the one-stop shop, business creation can be done in 1 to 3 days.",
    category: "entreprise",
    difficulty: "Facile"
  },

  // Legal - Easy
  {
    question: "Quel est le salaire minimum au Cameroun ?",
    questionEn: "What is the minimum wage in Cameroon?",
    options: ["28,000 FCFA", "36,270 FCFA", "50,000 FCFA", "75,000 FCFA"],
    optionsEn: ["28,000 FCFA", "36,270 FCFA", "50,000 FCFA", "75,000 FCFA"],
    answer: "1",
    explanation: "Le SMIG (Salaire Minimum Interprofessionnel Garanti) est de 36,270 FCFA par mois.",
    explanationEn: "The SMIG (Guaranteed Inter professional Minimum Wage) is 36,270 FCFA per month.",
    category: "juridique",
    difficulty: "Facile"
  },
  {
    question: "Combien de jours de congé payé par an a un travailleur au Cameroun ?",
    questionEn: "How many days of paid leave per year does a worker in Cameroon have?",
    options: ["15 jours", "18 jours", "21 jours", "30 jours"],
    optionsEn: ["15 days", "18 days", "21 days", "30 days"],
    answer: "2",
    explanation: "Selon le Code du Travail, un travailleur a droit à 18 jours ouvrables de congé payé par an.",
    explanationEn: "According to the Labor Code, a worker is entitled to 18 working days of paid leave per year.",
    category: "juridique",
    difficulty: "Facile"
  },

  // Land & Property - Medium
  {
    question: "Combien coûte approximativement l'obtention d'un titre foncier au Cameroun ?",
    questionEn: "What is the approximate cost of obtaining a land title in Cameroon?",
    options: ["50,000 FCFA", "150,000-500,000 FCFA", "1,000,000 FCFA", "5,000,000 FCFA"],
    optionsEn: ["50,000 FCFA", "150,000-500,000 FCFA", "1,000,000 FCFA", "5,000,000 FCFA"],
    answer: "1",
    explanation: "Le coût varie entre 150,000 et 500,000 FCFA selon la superficie et la localisation.",
    explanationEn: "The cost varies between 150,000 and 500,000 FCFA depending on the size and location.",
    category: "foncier",
    difficulty: "Moyen"
  },
  {
    question: "Quelle est la durée de validité d'un permis de construire au Cameroun ?",
    questionEn: "What is the validity period of a building permit in Cameroon?",
    options: ["6 mois", "1 an", "2 ans", "5 ans"],
    optionsEn: ["6 months", "1 year", "2 years", "5 years"],
    answer: "2",
    explanation: "Un permis de construire est valable 2 ans à partir de sa délivrance.",
    explanationEn: "A building permit is valid for 2 years from its issuance.",
    category: "foncier",
    difficulty: "Moyen"
  },

  // Education - Easy
  {
    question: "À quel âge commence l'école primaire au Cameroun ?",
    questionEn: "At what age does primary school start in Cameroon?",
    options: ["4 ans", "5 ans", "6 ans", "7 ans"],
    optionsEn: ["4 years", "5 years", "6 years", "7 years"],
    answer: "2",
    explanation: "L'école primaire commence généralement à 6 ans au Cameroun.",
    explanationEn: "Primary school generally starts at age 6 in Cameroon.",
    category: "education",
    difficulty: "Facile"
  },
]

async function translateExistingQuiz() {
  console.log('🔄 Translating existing quiz questions...')

  const { data: existingQuiz, error } = await supabase
    .from('QuizQuestion')
    .select('*')
    .is('questionEn', null)

  if (error) {
    console.error('❌ Error fetching quiz:', error)
    return
  }

  console.log(`📝 Found ${existingQuiz?.length || 0} quiz questions to translate`)

  for (const quiz of existingQuiz || []) {
    const translation = quizTranslations[quiz.question]

    if (translation) {
      const { error: updateError } = await supabase
        .from('QuizQuestion')
        .update({
          questionEn: translation.questionEn,
          explanationEn: translation.explanationEn,
          optionsEn: translation.optionsEn
        })
        .eq('id', quiz.id)

      if (updateError) {
        console.error(`❌ Error updating quiz ${quiz.id}:`, updateError)
      } else {
        console.log(`✅ Translated: "${quiz.question.substring(0, 50)}..."`)
      }
    }
  }
}

async function addNewQuiz() {
  console.log('\n📚 Adding new quiz questions...')

  for (const quiz of newQuizQuestions) {
    // Convert options arrays to proper formats
    // options: JSONB format
    // optionsEn: TEXT[] format (Supabase client handles this automatically)
    const { error } = await supabase
      .from('QuizQuestion')
      .insert({
        question: quiz.question,
        questionEn: quiz.questionEn,
        options: quiz.options, // Array will be converted to JSONB by Supabase
        optionsEn: quiz.optionsEn, // Array will be kept as TEXT[]
        answer: quiz.answer,
        explanation: quiz.explanation,
        explanationEn: quiz.explanationEn,
        category: quiz.category,
        difficulty: quiz.difficulty,
      })

    if (error) {
      console.error(`❌ Error adding quiz:`, error)
    } else {
      console.log(`✅ Added: "${quiz.question.substring(0, 50)}..."`)
    }
  }
}

async function main() {
  console.log('🚀 Starting data translation and enrichment...\n')

  // Translate existing quiz
  await translateExistingQuiz()

  // Add new quiz
  await addNewQuiz()

  console.log('\n✨ Done! Data has been translated and enriched.')
  console.log('📊 Summary:')

  // Get final counts
  const { count: quizCount } = await supabase
    .from('QuizQuestion')
    .select('*', { count: 'exact', head: true })

  const { count: translatedCount } = await supabase
    .from('QuizQuestion')
    .select('*', { count: 'exact', head: true })
    .not('questionEn', 'is', null)

  console.log(`   - Total quiz: ${quizCount}`)
  console.log(`   - Translated quiz: ${translatedCount}`)
  console.log(`   - Translation rate: ${Math.round((translatedCount! / quizCount!) * 100)}%`)
}

main().catch(console.error)
