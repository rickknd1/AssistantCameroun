#!/usr/bin/env tsx
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
})

const procedures = [
  {
    slug: 'carte-nationale-identite-cni',
    name: 'Carte Nationale d\'Identité (CNI)',
    category: 'identite',
    difficulty: 'Facile',
    description: 'Document officiel d\'identité permettant d\'attester de votre identité et de votre nationalité camerounaise.',
    duration: '48 heures',
    steps: [
      { step: 1, title: 'Créer un compte', description: 'Créer un compte sur le système en ligne' },
      { step: 2, title: 'Prendre rendez-vous', description: 'Prendre rendez-vous au centre d\'enrôlement' },
      { step: 3, title: 'Payer les frais', description: 'Payer 10 000 FCFA' },
      { step: 4, title: 'Enrôlement', description: 'Prise d\'empreintes et photo' },
      { step: 5, title: 'Retrait', description: 'Retirer après 48h' }
    ],
    documents: ['Acte de naissance', 'Certificat de nationalité', '2 photos', 'Justificatif domicile'],
    costs: [{ item: 'Timbre fiscal', amount: '10 000 FCFA' }, { item: 'Certificat nationalité', amount: '3 500 FCFA' }],
    locations: [{ name: 'Centre Etoudi', address: 'Yaoundé', hours: '8h-15h' }],
    tips: ['Arrivez tôt', 'Photos fond blanc'],
    faqs: [{ question: 'Validité ?', answer: '10 ans adultes' }],
    popularity: 100,
    viewCount: 0
  },
  {
    slug: 'passeport-biometrique',
    name: 'Passeport Biométrique',
    category: 'identite',
    difficulty: 'Moyen',
    description: 'Document de voyage officiel permettant les déplacements internationaux.',
    duration: '2-6 semaines',
    steps: [
      { step: 1, title: 'CNI valide', description: 'Avoir une CNI en cours de validité' },
      { step: 2, title: 'Rendez-vous', description: 'Prendre rendez-vous' },
      { step: 3, title: 'Dossier', description: 'Constituer le dossier' },
      { step: 4, title: 'Paiement', description: 'Payer 110 000 FCFA' },
      { step: 5, title: 'Enrôlement', description: 'Empreintes et photo' }
    ],
    documents: ['CNI valide', 'Acte naissance', 'Certificat nationalité', '2 photos biométriques'],
    costs: [{ item: 'Passeport adulte', amount: '110 000 FCFA' }],
    locations: [{ name: 'Centre DGSN', address: 'Yaoundé', hours: '8h-15h' }],
    tips: ['Vérifier CNI', 'Photos récentes'],
    faqs: [{ question: 'Validité ?', answer: '5 ans' }],
    popularity: 90,
    viewCount: 0
  },
  {
    slug: 'acte-naissance',
    name: 'Acte de Naissance',
    category: 'identite',
    difficulty: 'Facile',
    description: 'Document d\'état civil attestant de votre naissance.',
    duration: '24-48 heures',
    steps: [
      { step: 1, title: 'Centre état civil', description: 'Trouver le centre de votre lieu de naissance' },
      { step: 2, title: 'Formulaire', description: 'Remplir le formulaire' },
      { step: 3, title: 'Paiement', description: 'Payer les frais' },
      { step: 4, title: 'Retrait', description: 'Retirer après 24-48h' }
    ],
    documents: ['Pièce identité', 'Infos parents'],
    costs: [{ item: 'Copie simple', amount: '100-300 FCFA' }, { item: 'Extrait certifié', amount: '500-1 000 FCFA' }],
    locations: [{ name: 'Centre état civil', address: 'Votre lieu de naissance', hours: '8h-15h' }],
    tips: ['Connaître noms parents', 'Date exacte naissance'],
    faqs: [{ question: 'Validité ?', answer: 'Pas de limite, copie récente demandée' }],
    popularity: 80,
    viewCount: 0
  }
]

async function main() {
  console.log('🚀 Import direct des procédures...\n')

  for (const proc of procedures) {
    try {
      console.log(`📋 ${proc.name}...`)

      const { data, error } = await supabase
        .from('Procedure')
        .upsert(proc, { onConflict: 'slug' })
        .select()

      if (error) {
        console.error(`   ❌ ${error.message}`)
      } else {
        console.log(`   ✅ OK`)
      }
    } catch (e: any) {
      console.error(`   ❌ ${e.message}`)
    }
  }

  console.log('\n✅ Terminé!')
}

main()