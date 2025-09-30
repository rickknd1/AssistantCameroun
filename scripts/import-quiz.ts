#!/usr/bin/env tsx
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
})

const quizQuestions = [
  {
    question: 'Quelle est la durée de validité d\'une Carte Nationale d\'Identité pour un adulte au Cameroun ?',
    options: ['5 ans', '10 ans', '15 ans', '20 ans'],
    correctAnswer: 1, // Index 1 = "10 ans"
    explanation: 'La CNI camerounaise est valable 10 ans pour les adultes et 5 ans pour les mineurs.',
    category: 'identite',
    difficulty: 'Facile',
    timesAsked: 0,
    timesCorrect: 0
  },
  {
    question: 'Quel est le coût du timbre fiscal pour une CNI au Cameroun ?',
    options: ['5 000 FCFA', '10 000 FCFA', '15 000 FCFA', '20 000 FCFA'],
    correctAnswer: 1,
    explanation: 'Le timbre fiscal pour la CNI coûte 10 000 FCFA selon le nouveau système biométrique.',
    category: 'identite',
    difficulty: 'Facile',
    timesAsked: 0,
    timesCorrect: 0
  },
  {
    question: 'Combien coûte un passeport biométrique au Cameroun ?',
    options: ['75 000 FCFA', '90 000 FCFA', '110 000 FCFA', '150 000 FCFA'],
    correctAnswer: 2,
    explanation: 'Le passeport biométrique coûte 110 000 FCFA au Cameroun.',
    category: 'identite',
    difficulty: 'Moyen',
    timesAsked: 0,
    timesCorrect: 0
  },
  {
    question: 'Quelle est la durée de validité d\'un passeport biométrique camerounais ?',
    options: ['3 ans', '5 ans', '7 ans', '10 ans'],
    correctAnswer: 1,
    explanation: 'Le passeport biométrique camerounais est valable 5 ans pour tous les âges.',
    category: 'identite',
    difficulty: 'Facile',
    timesAsked: 0,
    timesCorrect: 0
  },
  {
    question: 'Quel document est OBLIGATOIRE pour obtenir une CNI ?',
    options: ['Permis de conduire', 'Acte de naissance', 'Carte d\'électeur', 'Diplôme'],
    correctAnswer: 1,
    explanation: 'L\'acte de naissance original est un document obligatoire pour obtenir la CNI.',
    category: 'identite',
    difficulty: 'Facile',
    timesAsked: 0,
    timesCorrect: 0
  },
  {
    question: 'Dans quel délai peut-on obtenir une CNI avec le nouveau système biométrique ?',
    options: ['24 heures', '48 heures', '1 semaine', '2 semaines'],
    correctAnswer: 1,
    explanation: 'Le nouveau système biométrique permet d\'obtenir la CNI en 48 heures.',
    category: 'identite',
    difficulty: 'Moyen',
    timesAsked: 0,
    timesCorrect: 0
  },
  {
    question: 'Quel est le Code qui régit le droit du travail au Cameroun ?',
    options: ['Code du Travail', 'Code Civil', 'Code Pénal', 'Code de Commerce'],
    correctAnswer: 0,
    explanation: 'Le Code du Travail (Loi N° 92/007 du 14 août 1992) régit les relations de travail au Cameroun.',
    category: 'travail',
    difficulty: 'Facile',
    timesAsked: 0,
    timesCorrect: 0
  },
  {
    question: 'Quelle loi régit la protection des données personnelles au Cameroun ?',
    options: ['Loi N° 2019/020', 'Loi N° 2018/012', 'Loi N° 2016/007', 'Loi N° 2015/006'],
    correctAnswer: 0,
    explanation: 'La Loi N° 2019/020 du 24 décembre 2019 régit la protection des données à caractère personnel.',
    category: 'juridique',
    difficulty: 'Moyen',
    timesAsked: 0,
    timesCorrect: 0
  },
  {
    question: 'Quel ministère est responsable de la délivrance de la CNI ?',
    options: ['Ministère de la Justice', 'Ministère de l\'Intérieur (DGSN)', 'Ministère des Affaires Étrangères', 'Ministère de l\'Administration Territoriale'],
    correctAnswer: 1,
    explanation: 'La DGSN (Délégation Générale à la Sûreté Nationale) sous le Ministère de l\'Intérieur est responsable de la délivrance de la CNI.',
    category: 'identite',
    difficulty: 'Moyen',
    timesAsked: 0,
    timesCorrect: 0
  },
  {
    question: 'Combien coûte un certificat de nationalité camerounais ?',
    options: ['1 500 FCFA', '2 500 FCFA', '3 500 FCFA', '5 000 FCFA'],
    correctAnswer: 2,
    explanation: 'Le certificat de nationalité coûte 3 500 FCFA.',
    category: 'identite',
    difficulty: 'Facile',
    timesAsked: 0,
    timesCorrect: 0
  }
]

async function importQuiz() {
  console.log('🚀 Import des questions de quiz...\n')

  let successCount = 0
  let errorCount = 0

  for (const question of quizQuestions) {
    try {
      console.log(`❓ ${question.question.substring(0, 60)}...`)

      const { error } = await supabase
        .from('QuizQuestion')
        .upsert(question)

      if (error) {
        console.error(`   ❌ ${error.message}`)
        errorCount++
      } else {
        console.log(`   ✅ OK`)
        successCount++
      }
    } catch (e: any) {
      console.error(`   ❌ ${e.message}`)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Import terminé!`)
  console.log(`   Succès: ${successCount}`)
  console.log(`   Erreurs: ${errorCount}`)
  console.log('='.repeat(50))
}

importQuiz()