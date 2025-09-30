#!/usr/bin/env tsx
// ============================================
// IMPORT PROCEDURES
// Extrait les procédures du fichier txt et les insère dans Supabase
// ============================================

import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface ProcedureData {
  slug: string
  name: string
  category: 'identite' | 'entreprise' | 'foncier' | 'transport' | 'education' | 'justice' | 'sante'
  difficulty: 'Facile' | 'Moyen' | 'Difficile'
  description: string
  duration: string
  steps: Array<{ step: number; title: string; description: string }>
  documents: string[]
  costs: Array<{ item: string; amount: string }>
  locations: Array<{ name: string; address: string; hours: string }>
  tips: string[]
  faqs: Array<{ question: string; answer: string }>
}

// Procédures extraites du fichier procedures-administratives-guide.txt
const procedures: ProcedureData[] = [
  {
    slug: 'carte-nationale-identite-cni',
    name: 'Carte Nationale d\'Identité (CNI)',
    category: 'identite',
    difficulty: 'Facile',
    description: 'Document officiel d\'identité permettant d\'attester de votre identité et de votre nationalité camerounaise. Système biométrique en cours de déploiement.',
    duration: '48 heures (nouveau système)',
    steps: [
      { step: 1, title: 'Créer un compte en ligne', description: 'Créer un compte sur le système en ligne (en déploiement) ou se rendre directement au centre.' },
      { step: 2, title: 'Prendre rendez-vous', description: 'Prendre rendez-vous en ligne ou au centre d\'enrôlement.' },
      { step: 3, title: 'Payer les frais', description: 'Payer via Mobile Money (Orange/MTN) ou en espèces: 10 000 FCFA (timbre fiscal).' },
      { step: 4, title: 'Se présenter au centre', description: 'Apporter tous les documents requis: acte de naissance, certificat de nationalité, photos, justificatif de domicile.' },
      { step: 5, title: 'Enrôlement biométrique', description: 'Prise d\'empreintes digitales et photo biométrique.' },
      { step: 6, title: 'Retrait de la CNI', description: 'Retirer votre CNI après 48 heures au même centre.' }
    ],
    documents: [
      'Acte de naissance original',
      'Certificat de nationalité (3 500 FCFA)',
      '2 photos d\'identité récentes',
      'Justificatif de domicile',
      'Copie certifiée acte de naissance (2 000 FCFA)'
    ],
    costs: [
      { item: 'Timbre fiscal', amount: '10 000 FCFA' },
      { item: 'Certificat de nationalité', amount: '3 500 FCFA' },
      { item: 'Copie certifiée acte naissance', amount: '2 000 FCFA' },
      { item: 'Photos d\'identité', amount: '500 - 1 000 FCFA' }
    ],
    locations: [
      { name: 'Centre national - Etoudi', address: 'Yaoundé', hours: '8h-15h' },
      { name: 'Centre d\'enrôlement', address: 'Douala', hours: '8h-15h' },
      { name: 'Centre d\'enrôlement', address: 'Garoua', hours: '8h-15h' }
    ],
    tips: [
      'Arrivez tôt le matin pour éviter la foule',
      'Vérifiez que vos photos respectent les normes (fond blanc, visage dégagé)',
      'Conservez votre récépissé précieusement',
      'Pour difficultés, contacter délégations régionales DGSN',
      'Site officiel: www.dgsn.cm'
    ],
    faqs: [
      { question: 'Quelle est la durée de validité ?', answer: '10 ans pour les adultes, 5 ans pour les mineurs.' },
      { question: 'Que faire en cas de perte ?', answer: 'Faire une déclaration de perte au commissariat puis demander un duplicata au centre d\'enrôlement.' },
      { question: 'Le nouveau système est-il déjà actif partout ?', answer: 'Non, le déploiement est en cours. Les anciens tarifs sont maintenus jusqu\'au déploiement complet.' }
    ]
  },
  {
    slug: 'passeport-biometrique',
    name: 'Passeport Biométrique',
    category: 'identite',
    difficulty: 'Moyen',
    description: 'Document de voyage officiel permettant les déplacements internationaux. Passeport biométrique valable 5 ans.',
    duration: 'Variable selon centre (2-6 semaines)',
    steps: [
      { step: 1, title: 'Obtenir une CNI valide', description: 'Vous devez avoir une carte nationale d\'identité en cours de validité.' },
      { step: 2, title: 'Prendre rendez-vous', description: 'Prendre rendez-vous en ligne ou directement au centre de production.' },
      { step: 3, title: 'Constituer le dossier', description: 'Rassembler tous les documents requis: CNI, acte de naissance, certificat de nationalité, photos, justificatif.' },
      { step: 4, title: 'Payer les frais', description: 'Payer 110 000 FCFA (tarif national).' },
      { step: 5, title: 'Enrôlement biométrique', description: 'Se présenter pour la prise d\'empreintes et photo biométrique.' },
      { step: 6, title: 'Retrait du passeport', description: 'Retirer le passeport selon le délai annoncé par le centre.' }
    ],
    documents: [
      'CNI en cours de validité',
      'Acte de naissance original',
      'Certificat de nationalité',
      '2 photos d\'identité biométriques (fond blanc)',
      'Justificatif de domicile'
    ],
    costs: [
      { item: 'Passeport biométrique (adulte)', amount: '110 000 FCFA' },
      { item: 'Passeport consulaire', amount: '96€ (62 975 FCFA)' },
      { item: 'Photos biométriques', amount: '1 000 - 2 000 FCFA' }
    ],
    locations: [
      { name: 'Centre de production DGSN', address: 'Yaoundé', hours: '8h-15h' },
      { name: 'Centre de production', address: 'Douala', hours: '8h-15h' },
      { name: 'Centre de production', address: 'Garoua', hours: '8h-15h' }
    ],
    tips: [
      'Vérifiez la validité de votre CNI avant de commencer',
      'Les photos doivent être récentes (moins de 6 mois)',
      'Prévoyez un délai supplémentaire pendant les périodes de forte affluence',
      'Contrat avec INCM-Augentic (10 ans)',
      'Tarif réduit pour les enfants en consulat'
    ],
    faqs: [
      { question: 'Quelle est la durée de validité ?', answer: '5 ans pour tous les âges.' },
      { question: 'Peut-on voyager pendant le traitement ?', answer: 'Non, votre ancien passeport sera retenu lors de l\'enrôlement.' },
      { question: 'Différence entre passeport national et consulaire ?', answer: 'Tarif différent: 110 000 FCFA au Cameroun, 96€ en consulat. Même validité.' }
    ]
  },
  {
    slug: 'acte-naissance',
    name: 'Acte de Naissance',
    category: 'identite',
    difficulty: 'Facile',
    description: 'Document d\'état civil attestant de votre naissance et de votre filiation.',
    duration: '24-48 heures',
    steps: [
      { step: 1, title: 'Identifier le centre d\'état civil', description: 'Trouver le centre d\'état civil de votre lieu de naissance.' },
      { step: 2, title: 'Remplir le formulaire', description: 'Compléter le formulaire de demande d\'acte de naissance.' },
      { step: 3, title: 'Fournir les informations', description: 'Nom, prénom, date et lieu de naissance, noms des parents.' },
      { step: 4, title: 'Payer les frais', description: 'Copie simple (100-300 FCFA), extrait certifié (500-1 000 FCFA), copie intégrale (1 000-2 000 FCFA).' },
      { step: 5, title: 'Retirer l\'acte', description: 'Retrait sous 24-48 heures.' }
    ],
    documents: [
      'Pièce d\'identité du demandeur',
      'Informations complètes sur les parents'
    ],
    costs: [
      { item: 'Copie simple', amount: '100-300 FCFA' },
      { item: 'Extrait certifié', amount: '500-1 000 FCFA' },
      { item: 'Copie intégrale', amount: '1 000-2 000 FCFA' }
    ],
    locations: [
      { name: 'Centre d\'état civil', address: 'Votre lieu de naissance', hours: '8h-15h' }
    ],
    tips: [
      'Connaissez les noms complets de vos parents',
      'Ayez la date exacte de naissance',
      'Pour naissance à l\'étranger, s\'adresser au consulat',
      'La copie certifiée est valable 3 mois pour les démarches'
    ],
    faqs: [
      { question: 'Validité de l\'acte ?', answer: 'Pas de durée de validité, mais une copie récente (moins de 3 mois) est souvent demandée.' },
      { question: 'Acte perdu ?', answer: 'Vous pouvez obtenir une copie au centre d\'état civil de votre lieu de naissance.' },
      { question: 'Peut-on faire la demande par procuration ?', answer: 'Oui, avec une procuration légalisée et la CNI du mandataire.' }
    ]
  }
]

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function importProcedures() {
  console.log('🚀 Début de l\'import des procédures...\n')

  let successCount = 0
  let errorCount = 0

  for (const proc of procedures) {
    console.log(`📋 Traitement: ${proc.name}`)

    try {
      // Vérifier si la procédure existe déjà
      const { data: existing } = await supabase
        .from('Procedure')
        .select('id')
        .eq('slug', proc.slug)
        .single()

      if (existing) {
        console.log('   ℹ️  Procédure déjà existante, mise à jour...')

        const { error: updateError } = await supabase
          .from('Procedure')
          .update({
            name: proc.name,
            category: proc.category,
            difficulty: proc.difficulty,
            description: proc.description,
            duration: proc.duration,
            steps: proc.steps,
            documents: proc.documents,
            costs: proc.costs,
            locations: proc.locations,
            tips: proc.tips,
            faqs: proc.faqs,
            updatedAt: new Date().toISOString()
          })
          .eq('id', existing.id)

        if (updateError) {
          console.error('   ❌ Erreur mise à jour:', updateError.message)
          errorCount++
        } else {
          console.log('   ✅ Mis à jour avec succès')
          successCount++
        }
      } else {
        // Insérer la procédure
        const { error } = await supabase
          .from('Procedure')
          .insert({
            slug: proc.slug,
            name: proc.name,
            category: proc.category,
            difficulty: proc.difficulty,
            description: proc.description,
            duration: proc.duration,
            steps: proc.steps,
            documents: proc.documents,
            costs: proc.costs,
            locations: proc.locations,
            tips: proc.tips,
            faqs: proc.faqs,
            popularity: 0,
            viewCount: 0
          })

        if (error) {
          console.error('   ❌ Erreur insertion:', error.message)
          errorCount++
        } else {
          console.log('   ✅ Inséré avec succès')
          successCount++
        }
      }

      console.log('')
    } catch (error: any) {
      console.error(`   ❌ Erreur:`, error.message)
      errorCount++
    }
  }

  console.log('\n' + '='.repeat(50))
  console.log(`✅ Import terminé!`)
  console.log(`   Succès: ${successCount}`)
  console.log(`   Erreurs: ${errorCount}`)
  console.log('='.repeat(50))
}

// Exécuter
importProcedures().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})