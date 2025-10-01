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
    answer: '1', // Index 1 = "10 ans"
    explanation: 'La CNI camerounaise est valable 10 ans pour les adultes et 5 ans pour les mineurs.',
    category: 'procedures-admin',
    difficulty: 'Facile'
  },
  {
    question: 'Quel est le coût du timbre fiscal pour une CNI au Cameroun ?',
    options: ['5 000 FCFA', '10 000 FCFA', '15 000 FCFA', '20 000 FCFA'],
    answer: '1',
    explanation: 'Le timbre fiscal pour la CNI coûte 10 000 FCFA selon le nouveau système biométrique.',
    category: 'procedures-admin',
    difficulty: 'Facile'
  },
  {
    question: 'Combien coûte un passeport biométrique au Cameroun ?',
    options: ['75 000 FCFA', '90 000 FCFA', '110 000 FCFA', '150 000 FCFA'],
    answer: '2',
    explanation: 'Le passeport biométrique coûte 110 000 FCFA au Cameroun.',
    category: 'procedures-admin',
    difficulty: 'Moyen'
  },
  {
    question: 'Quelle est la durée de validité d\'un passeport biométrique camerounais ?',
    options: ['3 ans', '5 ans', '7 ans', '10 ans'],
    answer: '1',
    explanation: 'Le passeport biométrique camerounais est valable 5 ans pour tous les âges.',
    category: 'procedures-admin',
    difficulty: 'Facile'
  },
  {
    question: 'Quel document est OBLIGATOIRE pour obtenir une CNI ?',
    options: ['Permis de conduire', 'Acte de naissance', 'Carte d\'électeur', 'Diplôme'],
    answer: '1',
    explanation: 'L\'acte de naissance original est un document obligatoire pour obtenir la CNI.',
    category: 'procedures-admin',
    difficulty: 'Facile'
  },
  {
    question: 'Dans quel délai peut-on obtenir une CNI avec le nouveau système biométrique ?',
    options: ['24 heures', '48 heures', '1 semaine', '2 semaines'],
    answer: '1',
    explanation: 'Le nouveau système biométrique permet d\'obtenir la CNI en 48 heures.',
    category: 'procedures-admin',
    difficulty: 'Moyen'
  },
  {
    question: 'Quel est le Code qui régit le droit du travail au Cameroun ?',
    options: ['Code du Travail', 'Code Civil', 'Code Pénal', 'Code de Commerce'],
    answer: '0',
    explanation: 'Le Code du Travail (Loi N° 92/007 du 14 août 1992) régit les relations de travail au Cameroun.',
    category: 'droit-travail',
    difficulty: 'Facile'
  },
  {
    question: 'Quelle loi régit la protection des données personnelles au Cameroun ?',
    options: ['Loi N° 2019/020', 'Loi N° 2018/012', 'Loi N° 2016/007', 'Loi N° 2015/006'],
    answer: '0',
    explanation: 'La Loi N° 2019/020 du 24 décembre 2019 régit la protection des données à caractère personnel.',
    category: 'droit-penal',
    difficulty: 'Moyen'
  },
  {
    question: 'Quel ministère est responsable de la délivrance de la CNI ?',
    options: ['Ministère de la Justice', 'Ministère de l\'Intérieur (DGSN)', 'Ministère des Affaires Étrangères', 'Ministère de l\'Administration Territoriale'],
    answer: '1',
    explanation: 'La DGSN (Délégation Générale à la Sûreté Nationale) sous le Ministère de l\'Intérieur est responsable de la délivrance de la CNI.',
    category: 'procedures-admin',
    difficulty: 'Moyen'
  },
  {
    question: 'Combien coûte un certificat de nationalité camerounais ?',
    options: ['1 500 FCFA', '2 500 FCFA', '3 500 FCFA', '5 000 FCFA'],
    answer: '2',
    explanation: 'Le certificat de nationalité coûte 3 500 FCFA.',
    category: 'procedures-admin',
    difficulty: 'Facile'
  },
  {
    question: 'Quelle est la durée légale hebdomadaire de travail au Cameroun ?',
    options: ['35 heures', '40 heures', '45 heures', '48 heures'],
    answer: '1',
    explanation: 'La durée légale de travail est de 40 heures par semaine selon le Code du Travail camerounais.',
    category: 'droit-travail',
    difficulty: 'Facile'
  },
  {
    question: 'Quel est le salaire minimum interprofessionnel garanti (SMIG) au Cameroun ?',
    options: ['28 216 FCFA', '36 270 FCFA', '41 875 FCFA', '50 000 FCFA'],
    answer: '1',
    explanation: 'Le SMIG est fixé à 36 270 FCFA par mois depuis 2014.',
    category: 'droit-travail',
    difficulty: 'Moyen'
  },
  {
    question: 'Quelle est la durée minimale du congé annuel au Cameroun ?',
    options: ['15 jours', '18 jours', '21 jours', '30 jours'],
    answer: '2',
    explanation: 'Le congé annuel minimal est de 21 jours ouvrables (1,5 jour par mois de travail).',
    category: 'droit-travail',
    difficulty: 'Facile'
  },
  {
    question: 'Combien coûte la création d\'une entreprise individuelle au Cameroun ?',
    options: ['15 000 FCFA', '25 000 FCFA', '50 000 FCFA', '100 000 FCFA'],
    answer: '1',
    explanation: 'La création d\'une entreprise individuelle coûte environ 25 000 FCFA au CFCE.',
    category: 'entreprise',
    difficulty: 'Moyen'
  },
  {
    question: 'Quel est l\'âge minimum pour créer une entreprise au Cameroun ?',
    options: ['16 ans', '18 ans', '21 ans', '25 ans'],
    answer: '1',
    explanation: 'Il faut avoir 18 ans (majorité légale) pour créer une entreprise au Cameroun.',
    category: 'entreprise',
    difficulty: 'Facile'
  },
  {
    question: 'Quelle est la durée de validité d\'un permis de conduire au Cameroun ?',
    options: ['3 ans', '5 ans', '7 ans', '10 ans'],
    answer: '1',
    explanation: 'Le permis de conduire camerounais est valable 5 ans.',
    category: 'procedures-admin',
    difficulty: 'Facile'
  },
  {
    question: 'Combien coûte l\'établissement d\'un acte de naissance au Cameroun ?',
    options: ['Gratuit', '500 FCFA', '1 000 FCFA', '2 000 FCFA'],
    answer: '0',
    explanation: 'L\'établissement de l\'acte de naissance est gratuit au Cameroun dans les délais légaux.',
    category: 'procedures-admin',
    difficulty: 'Facile'
  },
  {
    question: 'Quelle est la TVA standard au Cameroun ?',
    options: ['15,5%', '17,5%', '19,25%', '21%'],
    answer: '2',
    explanation: 'Le taux normal de TVA au Cameroun est de 19,25%.',
    category: 'entreprise',
    difficulty: 'Moyen'
  },
  {
    question: 'Quel est le préavis légal pour un salarié avec 2 ans d\'ancienneté ?',
    options: ['15 jours', '1 mois', '2 mois', '3 mois'],
    answer: '1',
    explanation: 'Pour un salarié avec moins de 5 ans d\'ancienneté, le préavis est d\'un mois.',
    category: 'droit-travail',
    difficulty: 'Moyen'
  },
  {
    question: 'Quelle est la durée du congé de maternité au Cameroun ?',
    options: ['8 semaines', '10 semaines', '12 semaines', '14 semaines'],
    answer: '3',
    explanation: 'Le congé de maternité est de 14 semaines au Cameroun.',
    category: 'droit-travail',
    difficulty: 'Facile'
  },
  {
    question: 'Quel document prouve la propriété foncière au Cameroun ?',
    options: ['Attestation de vente', 'Certificat foncier', 'Titre foncier', 'Acte notarié'],
    answer: '2',
    explanation: 'Le titre foncier est le document officiel qui prouve la propriété foncière.',
    category: 'foncier',
    difficulty: 'Moyen'
  },
  {
    question: 'Combien coûte l\'immatriculation d\'une société au RCCM ?',
    options: ['25 000 FCFA', '50 000 FCFA', '75 000 FCFA', '100 000 FCFA'],
    answer: '1',
    explanation: 'L\'immatriculation au RCCM coûte environ 50 000 FCFA.',
    category: 'entreprise',
    difficulty: 'Moyen'
  },
  {
    question: 'Quelle est la durée légale du congé de paternité ?',
    options: ['3 jours', '5 jours', '7 jours', '10 jours'],
    answer: '3',
    explanation: 'Le congé de paternité est de 10 jours ouvrables au Cameroun.',
    category: 'droit-travail',
    difficulty: 'Facile'
  },
  {
    question: 'Quel est le capital minimum pour créer une SARL au Cameroun ?',
    options: ['Aucun minimum', '100 000 FCFA', '1 000 000 FCFA', '10 000 000 FCFA'],
    answer: '2',
    explanation: 'Le capital minimum pour une SARL est de 1 000 000 FCFA.',
    category: 'entreprise',
    difficulty: 'Difficile'
  },
  {
    question: 'Quelle est la période d\'essai maximale pour un employé au Cameroun ?',
    options: ['1 mois', '2 mois', '3 mois', '6 mois'],
    answer: '2',
    explanation: 'La période d\'essai maximale est de 3 mois, renouvelable une fois.',
    category: 'droit-travail',
    difficulty: 'Moyen'
  },
  {
    question: 'Combien coûte l\'obtention d\'un extrait de casier judiciaire ?',
    options: ['Gratuit', '500 FCFA', '1 000 FCFA', '2 000 FCFA'],
    answer: '2',
    explanation: 'L\'extrait de casier judiciaire coûte 1 000 FCFA.',
    category: 'droit-penal',
    difficulty: 'Facile'
  },
  {
    question: 'Quel est le taux de cotisation CNPS pour l\'employeur ?',
    options: ['4,2%', '7%', '11,2%', '14,2%'],
    answer: '2',
    explanation: 'L\'employeur cotise 11,2% du salaire brut à la CNPS (4,2% employé + 7% entreprise pour les prestations familiales).',
    category: 'droit-travail',
    difficulty: 'Difficile'
  },
  {
    question: 'Quelle est la durée de validité d\'un visa touristique pour le Cameroun ?',
    options: ['15 jours', '30 jours', '60 jours', '90 jours'],
    answer: '3',
    explanation: 'Le visa touristique est valable 90 jours maximum.',
    category: 'procedures-admin',
    difficulty: 'Moyen'
  },
  {
    question: 'Quel document est nécessaire pour ouvrir un compte bancaire au Cameroun ?',
    options: ['Permis de conduire uniquement', 'CNI ou passeport', 'Carte d\'électeur', 'Diplôme'],
    answer: '1',
    explanation: 'Une CNI ou un passeport est obligatoire pour ouvrir un compte bancaire.',
    category: 'procedures-admin',
    difficulty: 'Facile'
  },
  {
    question: 'Quelle est la majorité civile au Cameroun ?',
    options: ['16 ans', '18 ans', '21 ans', '25 ans'],
    answer: '1',
    explanation: 'La majorité civile est fixée à 18 ans au Cameroun.',
    category: 'droit-penal',
    difficulty: 'Facile'
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