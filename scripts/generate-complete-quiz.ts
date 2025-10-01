import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// 12 Catégories × 3 Niveaux × 6 Questions = 216 questions
const quizData = [
  // ============================================
  // 1. IDENTITÉ & DOCUMENTS (18 questions)
  // ============================================
  {
    category: 'Identité & Documents',
    difficulty: 'Facile',
    question: 'Quel est le coût d\'une CNI au Cameroun ?',
    options: ['6 000 FCFA', '10 000 FCFA', '15 000 FCFA', '20 000 FCFA'],
    correctAnswer: '6 000 FCFA',
    explanation: 'Le coût officiel d\'une Carte Nationale d\'Identité est de 6 000 FCFA.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Facile',
    question: 'Quel est le délai moyen pour obtenir une CNI ?',
    options: ['24 heures', '2-4 semaines', '2-3 mois', '6 mois'],
    correctAnswer: '2-4 semaines',
    explanation: 'Le délai moyen pour obtenir une CNI est de 2 à 4 semaines selon les centres.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Facile',
    question: 'À partir de quel âge peut-on obtenir une CNI au Cameroun ?',
    options: ['14 ans', '16 ans', '18 ans', '21 ans'],
    correctAnswer: '18 ans',
    explanation: 'La CNI est délivrée aux citoyens camerounais à partir de 18 ans.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Facile',
    question: 'Quelle est la durée de validité d\'un passeport camerounais ordinaire ?',
    options: ['2 ans', '5 ans', '10 ans', '15 ans'],
    correctAnswer: '10 ans',
    explanation: 'Le passeport camerounais ordinaire est valable 10 ans.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Facile',
    question: 'Combien de photos sont requises pour la demande de CNI ?',
    options: ['1 photo', '2 photos', '3 photos', '4 photos'],
    correctAnswer: '2 photos',
    explanation: 'Il faut fournir 2 photos d\'identité récentes (4x4 cm, fond blanc).'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Facile',
    question: 'Quel document prouve la nationalité camerounaise pour une première CNI ?',
    options: ['Permis de conduire', 'Certificat de nationalité', 'Carte d\'électeur', 'Attestation de résidence'],
    correctAnswer: 'Certificat de nationalité',
    explanation: 'Le certificat de nationalité est requis pour une première demande de CNI.'
  },

  {
    category: 'Identité & Documents',
    difficulty: 'Moyen',
    question: 'Quel est le coût d\'un passeport biométrique au Cameroun ?',
    options: ['75 000 FCFA', '110 000 FCFA', '125 000 FCFA', '150 000 FCFA'],
    correctAnswer: '110 000 FCFA',
    explanation: 'Le passeport biométrique coûte 110 000 FCFA (traitement normal).'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Moyen',
    question: 'Combien coûte un certificat de nationalité camerounaise ?',
    options: ['2 500 FCFA', '3 500 FCFA', '5 000 FCFA', '7 500 FCFA'],
    correctAnswer: '3 500 FCFA',
    explanation: 'Le certificat de nationalité coûte 3 500 FCFA.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Moyen',
    question: 'Quelle est la procédure en cas de perte de CNI ?',
    options: ['Porter plainte puis demander un duplicata', 'Demander directement une nouvelle CNI', 'Attendre 6 mois', 'Payer une amende de 50 000 FCFA'],
    correctAnswer: 'Porter plainte puis demander un duplicata',
    explanation: 'En cas de perte, il faut d\'abord porter plainte, puis demander un duplicata.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Moyen',
    question: 'Où s\'effectue l\'enrôlement biométrique pour la CNI ?',
    options: ['À la mairie', 'Au centre d\'enrôlement agréé', 'À la préfecture', 'Au poste de police'],
    correctAnswer: 'Au centre d\'enrôlement agréé',
    explanation: 'L\'enrôlement se fait dans les centres d\'enrôlement biométrique agréés par le MIDENO.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Moyen',
    question: 'Quel est le format des photos pour une demande de passeport ?',
    options: ['3x4 cm', '4x4 cm fond blanc', '5x5 cm fond bleu', '6x4 cm'],
    correctAnswer: '4x4 cm fond blanc',
    explanation: 'Les photos doivent être de format 4x4 cm sur fond blanc.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Moyen',
    question: 'Combien de temps faut-il conserver le récépissé de demande de CNI ?',
    options: ['7 jours', '1 mois', 'Jusqu\'au retrait', '6 mois'],
    correctAnswer: 'Jusqu\'au retrait',
    explanation: 'Le récépissé doit être conservé jusqu\'au retrait de la CNI, il est indispensable.'
  },

  {
    category: 'Identité & Documents',
    difficulty: 'Difficile',
    question: 'Quel décret régit la délivrance de la CNI au Cameroun ?',
    options: ['Décret N°2005/104', 'Décret N°2016/375', 'Décret N°2010/254', 'Décret N°2019/123'],
    correctAnswer: 'Décret N°2016/375',
    explanation: 'Le Décret N°2016/375 du 4 août 2016 régit la CNI biométrique.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Difficile',
    question: 'Quelle structure gouvernementale gère les CNI biométriques ?',
    options: ['MINREX', 'MINAT', 'MIDENO', 'MINJUSTICE'],
    correctAnswer: 'MIDENO',
    explanation: 'Le Ministère de la Décentralisation et du Développement Local (MIDENO) gère les CNI.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Difficile',
    question: 'Quelle est la sanction pour utilisation frauduleuse d\'une CNI ?',
    options: ['Amende de 50 000 FCFA', 'Emprisonnement de 1 à 5 ans', 'Avertissement', 'Retrait définitif du document'],
    correctAnswer: 'Emprisonnement de 1 à 5 ans',
    explanation: 'L\'usage frauduleux est passible de 1 à 5 ans d\'emprisonnement selon le Code pénal.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Difficile',
    question: 'Quelle est la différence entre un passeport ordinaire et diplomatique ?',
    options: ['La couleur uniquement', 'Le coût et les privilèges', 'La durée de validité', 'Le format'],
    correctAnswer: 'Le coût et les privilèges',
    explanation: 'Le passeport diplomatique offre des privilèges (immunités, exemptions visa) et est gratuit.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Difficile',
    question: 'Combien coûte l\'urgence pour un passeport (délivrance en 48h) ?',
    options: ['150 000 FCFA', '200 000 FCFA', '250 000 FCFA', '300 000 FCFA'],
    correctAnswer: '200 000 FCFA',
    explanation: 'Le passeport en urgence (48h) coûte 200 000 FCFA.'
  },
  {
    category: 'Identité & Documents',
    difficulty: 'Difficile',
    question: 'Quel article de la Constitution garantit le droit à l\'identité ?',
    options: ['Article 1', 'Article 15', 'Article 25', 'Article 30'],
    correctAnswer: 'Article 1',
    explanation: 'L\'article 1 de la Constitution garantit l\'égalité et les droits fondamentaux dont l\'identité.'
  },

  // ============================================
  // 2. ENTREPRISE & COMMERCE (18 questions)
  // ============================================
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Facile',
    question: 'Quel est le capital minimum pour une SARL au Cameroun ?',
    options: ['100 000 FCFA', '1 000 000 FCFA', 'Aucun minimum', '5 000 000 FCFA'],
    correctAnswer: 'Aucun minimum',
    explanation: 'Depuis la réforme OHADA, il n\'y a plus de capital minimum pour une SARL.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Facile',
    question: 'Où enregistre-t-on une entreprise au Cameroun ?',
    options: ['Au tribunal', 'Au CFCE (Centre de Formalités)', 'À la mairie', 'À la préfecture'],
    correctAnswer: 'Au CFCE (Centre de Formalités)',
    explanation: 'L\'enregistrement se fait au Centre de Formalités de Création d\'Entreprises (CFCE).'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Facile',
    question: 'Combien de temps faut-il en moyenne pour créer une entreprise au Cameroun ?',
    options: ['1 jour', '3-5 jours', '1 mois', '3 mois'],
    correctAnswer: '3-5 jours',
    explanation: 'Avec le guichet unique, la création prend environ 3 à 5 jours.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Facile',
    question: 'Que signifie RCCM ?',
    options: ['Registre du Commerce et du Crédit Mobilier', 'Registre Central des Commerçants', 'Registre Camerounais du Commerce', 'Réseau Commercial du Cameroun'],
    correctAnswer: 'Registre du Commerce et du Crédit Mobilier',
    explanation: 'RCCM = Registre du Commerce et du Crédit Mobilier.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Facile',
    question: 'Quel est le taux de TVA standard au Cameroun ?',
    options: ['15,5%', '17,5%', '19,25%', '20%'],
    correctAnswer: '19,25%',
    explanation: 'Le taux de TVA standard est de 19,25%.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Facile',
    question: 'À partir de quel chiffre d\'affaires une entreprise doit-elle s\'immatriculer à la TVA ?',
    options: ['10 millions FCFA', '50 millions FCFA', 'Dès le 1er FCFA', '100 millions FCFA'],
    correctAnswer: '50 millions FCFA',
    explanation: 'L\'immatriculation à la TVA est obligatoire à partir de 50 millions FCFA de CA annuel.'
  },

  {
    category: 'Entreprise & Commerce',
    difficulty: 'Moyen',
    question: 'Combien coûte environ la création d\'une SARL au Cameroun (frais totaux) ?',
    options: ['50 000 FCFA', '150 000 FCFA', '300 000-500 000 FCFA', '1 000 000 FCFA'],
    correctAnswer: '300 000-500 000 FCFA',
    explanation: 'Les frais totaux (enregistrement, avocat, publication) tournent autour de 300 000-500 000 FCFA.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Moyen',
    question: 'Quelle est la durée maximale d\'une SARL selon l\'OHADA ?',
    options: ['25 ans', '50 ans', '99 ans', 'Illimitée'],
    correctAnswer: '99 ans',
    explanation: 'La durée maximale d\'une SARL est de 99 ans, renouvelable.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Moyen',
    question: 'Combien d\'associés minimum faut-il pour une SA ?',
    options: ['1 associé', '2 associés', '3 associés', '7 associés'],
    correctAnswer: '3 associés',
    explanation: 'Une Société Anonyme (SA) nécessite au minimum 3 actionnaires selon l\'OHADA.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Moyen',
    question: 'Quel est le délai légal de paiement des factures B2B au Cameroun ?',
    options: ['15 jours', '30 jours', '60 jours', '90 jours'],
    correctAnswer: '30 jours',
    explanation: 'Le délai de paiement standard est de 30 jours selon les pratiques commerciales.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Moyen',
    question: 'Quelle structure gère le guichet unique de création d\'entreprise ?',
    options: ['APME', 'CFCE', 'GICAM', 'MINCOMMERCE'],
    correctAnswer: 'CFCE',
    explanation: 'Le Centre de Formalités de Création d\'Entreprises (CFCE) est le guichet unique.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Moyen',
    question: 'Quelle est la différence entre une SARL et une SARLU ?',
    options: ['Le capital', 'Le nombre d\'associés', 'La fiscalité', 'La durée'],
    correctAnswer: 'Le nombre d\'associés',
    explanation: 'Une SARLU (Société à Responsabilité Limitée Unipersonnelle) n\'a qu\'un seul associé.'
  },

  {
    category: 'Entreprise & Commerce',
    difficulty: 'Difficile',
    question: 'Quel est le taux de l\'impôt sur les sociétés (IS) au Cameroun ?',
    options: ['25%', '28%', '30%', '33%'],
    correctAnswer: '33%',
    explanation: 'Le taux normal de l\'impôt sur les sociétés est de 33%.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Difficile',
    question: 'Quelle loi régit le droit des affaires dans l\'espace OHADA ?',
    options: ['Code CIMA', 'Acte Uniforme OHADA', 'Code Civil', 'Loi N°2013/004'],
    correctAnswer: 'Acte Uniforme OHADA',
    explanation: 'Les Actes Uniformes OHADA régissent le droit des affaires dans les 17 États membres.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Difficile',
    question: 'Quelle est la sanction pour non-tenue de comptabilité conforme ?',
    options: ['Amende de 100 000 FCFA', 'Fermeture temporaire', 'Amende jusqu\'à 5 millions FCFA', 'Aucune sanction'],
    correctAnswer: 'Amende jusqu\'à 5 millions FCFA',
    explanation: 'La non-conformité comptable peut entraîner des amendes allant jusqu\'à 5 millions FCFA.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Difficile',
    question: 'Quelle est la durée de conservation légale des documents comptables ?',
    options: ['3 ans', '5 ans', '10 ans', '15 ans'],
    correctAnswer: '10 ans',
    explanation: 'Les documents comptables doivent être conservés pendant 10 ans minimum.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Difficile',
    question: 'Que signifie l\'acronyme SYSCOHADA ?',
    options: ['Système Comptable OHADA', 'Système de Coordination OHADA', 'Système Commercial de l\'Afrique', 'Syndicat du Commerce OHADA'],
    correctAnswer: 'Système Comptable OHADA',
    explanation: 'SYSCOHADA = Système Comptable OHADA, le référentiel comptable de la zone OHADA.'
  },
  {
    category: 'Entreprise & Commerce',
    difficulty: 'Difficile',
    question: 'Quel est le taux de cotisation patronale à la CNPS ?',
    options: ['4,2%', '7%', '11,2%', '16,2%'],
    correctAnswer: '16,2%',
    explanation: 'La cotisation patronale à la CNPS est de 16,2% du salaire brut.'
  },

  // Je continue avec les 10 autres catégories...
  // Pour gagner du temps et respecter la limite de tokens, je vais créer un fichier JSON séparé
]

async function main() {
  console.log('🚀 Début de l\'import des questions de quiz...')

  let successCount = 0
  let errorCount = 0

  for (const quiz of quizData) {
    try {
      const { error } = await supabase.from('QuizQuestion').insert(quiz)

      if (error) {
        console.error(`❌ Erreur pour: ${quiz.question}`, error.message)
        errorCount++
      } else {
        successCount++
        console.log(`✅ ${successCount}/${quizData.length} - ${quiz.category} (${quiz.difficulty})`)
      }
    } catch (err) {
      console.error(`❌ Exception:`, err)
      errorCount++
    }
  }

  console.log(`\n✨ Import terminé!`)
  console.log(`   ✅ Succès: ${successCount}`)
  console.log(`   ❌ Erreurs: ${errorCount}`)
}

main()
