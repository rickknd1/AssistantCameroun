#!/usr/bin/env tsx
/**
 * MISE À JOUR DES PROCÉDURES AVEC LES INFORMATIONS CORRECTES
 *
 * Ce script met à jour les procédures avec les informations officielles
 * sur les coûts et durées des démarches administratives au Cameroun.
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function updateProcedures() {
  console.log('🔄 Mise à jour des procédures avec informations correctes...\n')

  // 1. Supprimer les doublons de CNI
  console.log('1️⃣ Suppression des doublons CNI...')

  const { data: cniProcs } = await supabase
    .from('Procedure')
    .select('*')
    .ilike('name', '%CNI%')
    .order('createdAt')

  if (cniProcs && cniProcs.length > 1) {
    // Garder le plus complet/récent, supprimer les autres
    const toDelete = cniProcs.slice(0, -1) // Garder le dernier

    for (const proc of toDelete) {
      const { error } = await supabase
        .from('Procedure')
        .delete()
        .eq('id', proc.id)

      if (!error) {
        console.log(`   ✓ Supprimé: ${proc.slug} (${proc.id})`)
      }
    }
  }

  // 2. Mettre à jour avec les informations correctes
  console.log('\n2️⃣ Mise à jour des informations...\n')

  const updates = [
    {
      slug: 'carte-nationale-identite-cni',
      name: 'Carte Nationale d\'Identité (CNI)',
      costs: '6 000 FCFA (CNI) + 10 000 FCFA (timbre fiscal) = 16 000 FCFA total',
      duration: '2 à 4 semaines',
      tips: [
        'Vérifiez que tous vos documents sont conformes avant de prendre rendez-vous',
        'Le timbre fiscal de 10 000 FCFA est obligatoire',
        'Privilégiez les heures creuses pour éviter la foule',
        'Gardez précieusement votre récépissé'
      ]
    },
    {
      slug: 'passeport',
      name: 'Passeport ordinaire',
      costs: '75 000 FCFA (passeport ordinaire 48 pages)',
      duration: '2 à 6 semaines',
      tips: [
        'La CNI est obligatoire pour faire le passeport',
        'Prenez rendez-vous en ligne pour gagner du temps',
        'Prévoyez 110 000 FCFA pour le passeport biométrique',
        'Le délai peut être plus long en période de forte affluence'
      ]
    },
    {
      slug: 'passeport-biometrique',
      name: 'Passeport Biométrique',
      costs: '110 000 FCFA (passeport biométrique 48 pages)',
      duration: '2 à 6 semaines',
      tips: [
        'Plus sécurisé que le passeport ordinaire',
        'Recommandé pour les voyages internationaux',
        'La CNI est obligatoire',
        'Prenez rendez-vous en ligne sur le site du MINREX'
      ]
    },
    {
      slug: 'acte-naissance',
      name: 'Acte de Naissance',
      costs: '1 000 à 5 000 FCFA selon le centre d\'état civil',
      duration: 'Quelques heures à 2 jours',
      tips: [
        'Document délivré gratuitement à la naissance',
        'Les frais concernent les copies et extraits',
        'Rendez-vous au centre d\'état civil du lieu de naissance',
        'Prévoyez une pièce d\'identité d\'un parent'
      ]
    }
  ]

  for (const update of updates) {
    const { slug, ...updateData } = update

    const { data, error } = await supabase
      .from('Procedure')
      .update({
        ...updateData,
        updatedAt: new Date().toISOString()
      })
      .eq('slug', slug)
      .select()

    if (error) {
      console.error(`   ❌ Erreur pour ${slug}:`, error.message)
    } else if (data && data.length > 0) {
      console.log(`   ✅ ${update.name}`)
      console.log(`      💰 Coût: ${update.costs}`)
      console.log(`      ⏱️  Durée: ${update.duration}`)
    } else {
      console.log(`   ⚠️  Procédure non trouvée: ${slug}`)
    }
  }

  console.log('\n' + '='.repeat(80))
  console.log('✅ Mise à jour terminée!')
  console.log('='.repeat(80))
  console.log('\n📝 NOTES IMPORTANTES:')
  console.log('   • Les prix indiqués sont les tarifs officiels en vigueur')
  console.log('   • Le timbre fiscal de 10 000 FCFA est obligatoire pour la CNI')
  console.log('   • Les délais peuvent varier selon les centres et périodes')
  console.log('   • Ces informations doivent être vérifiées régulièrement')
}

updateProcedures().catch(console.error)
