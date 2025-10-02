#!/usr/bin/env tsx
/**
 * MISE À JOUR CNI - NOUVELLES INFORMATIONS 2025
 * Plateforme: www.idcam.cm
 * Tarif: 10 000 FCFA
 * Délai: 48h
 * Validité: 15 ans
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function updateCNIInfo() {
  console.log('🔄 MISE À JOUR DES INFORMATIONS CNI 2025\n')
  console.log('='.repeat(80))

  const newCNIData = {
    name: 'Carte Nationale d\'Identité (CNI)',
    costs: '10 000 FCFA (tarif unique)',
    duration: '48 heures (2 jours ouvrables)',
    onlineUrl: 'https://www.idcam.cm',
    formUrl: 'https://www.idcam.cm',
    description: `Nouvelle Carte Nationale d'Identité biométrique camerounaise avec une validité de 15 ans. La procédure a été entièrement digitalisée via la plateforme IDCAM pour plus de rapidité et d'efficacité.`,

    steps: [
      {
        title: 'Pré-enrôlement en ligne',
        description: 'Se rendre sur www.idcam.cm pour remplir le formulaire numérique, saisir vos informations personnelles et prendre rendez-vous',
        duration: '15-30 minutes',
        cost: 'Gratuit',
        requirements: ['Connexion internet', 'Adresse email valide', 'Numéro de téléphone']
      },
      {
        title: 'Préparation des documents',
        description: 'Rassembler tous les documents requis avant le rendez-vous',
        duration: '1-2 jours',
        cost: 'Variable selon les documents',
        requirements: [
          'Acte de naissance original',
          'Certificat de nationalité (si requis)',
          'Photos d\'identité récentes',
          'Justificatif de domicile'
        ]
      },
      {
        title: 'Enrôlement physique',
        description: 'Se présenter au poste d\'identification du chef-lieu de Région avec les documents requis',
        duration: '1-2 heures',
        cost: '10 000 FCFA',
        requirements: [
          'Documents originaux',
          'Confirmation de rendez-vous',
          'Paiement des frais (Mobile Money ou autre)'
        ]
      },
      {
        title: 'Collecte des données biométriques',
        description: 'Enregistrement des empreintes digitales et photo biométrique',
        duration: '30 minutes',
        cost: 'Inclus',
        requirements: ['Présence physique obligatoire']
      },
      {
        title: 'Paiement des frais',
        description: 'Paiement de 10 000 FCFA par Mobile Money ou autre moyen accepté',
        duration: '5-10 minutes',
        cost: '10 000 FCFA',
        requirements: ['Compte Mobile Money ou moyen de paiement accepté']
      },
      {
        title: 'Production et délivrance',
        description: 'Votre CNI sera produite et disponible sous 48 heures',
        duration: '48 heures',
        cost: 'Inclus',
        requirements: ['Récépissé de paiement']
      }
    ],

    tips: [
      'La pré-inscription en ligne est disponible depuis le 17 février 2025',
      'L\'enrôlement physique débute à partir du 24 février 2025',
      'La nouvelle CNI a une validité de 15 ans',
      'Délai de délivrance garanti: 48 heures après l\'enrôlement',
      'Aucun duplicata ne peut être délivré (selon Décret N°2025059)',
      'La pré-inscription reste valable pendant 1 an',
      'Le rendez-vous reste actif 10 jours après la date choisie',
      'Plateforme officielle: www.idcam.cm',
      'Centre d\'aide disponible: idcam.cm/help',
      'Les demandes rejetées peuvent être resoumises dans les 6 mois'
    ],

    documents: [
      {
        name: 'Acte de naissance',
        description: 'Document original',
        mandatory: true
      },
      {
        name: 'Certificat de nationalité',
        description: 'Si requis selon votre situation',
        mandatory: false
      },
      {
        name: 'Photos d\'identité',
        description: 'Photos récentes conformes aux normes biométriques',
        mandatory: true
      },
      {
        name: 'Justificatif de domicile',
        description: 'Facture d\'eau, électricité ou attestation de résidence',
        mandatory: true
      }
    ],

    faqs: [
      {
        question: 'Quel est le nouveau tarif de la CNI ?',
        answer: '10 000 FCFA (tarif unique tout compris)'
      },
      {
        question: 'Quelle est la durée de validité de la nouvelle CNI ?',
        answer: '15 ans à partir de la date de délivrance'
      },
      {
        question: 'Comment faire ma demande ?',
        answer: 'Rendez-vous sur www.idcam.cm pour faire votre pré-enrôlement en ligne et prendre rendez-vous'
      },
      {
        question: 'Quel est le délai de délivrance ?',
        answer: '48 heures (2 jours ouvrables) après l\'enrôlement physique et le paiement'
      },
      {
        question: 'Puis-je obtenir un duplicata ?',
        answer: 'Non, selon le Décret N°2025059, aucun duplicata ne peut être délivré'
      },
      {
        question: 'Combien de temps ma pré-inscription est-elle valable ?',
        answer: '1 an. Après ce délai, vous devrez refaire une nouvelle pré-inscription'
      },
      {
        question: 'Que faire si je rate mon rendez-vous ?',
        answer: 'Le rendez-vous reste actif 10 jours. Après, vous devez demander un nouveau rendez-vous sur idcam.cm/help'
      },
      {
        question: 'Comment payer les frais ?',
        answer: 'Par Mobile Money ou autres moyens de paiement acceptés sur la plateforme'
      }
    ]
  }

  console.log('\n📝 Mise à jour de la procédure CNI...\n')

  const { data, error } = await supabase
    .from('Procedure')
    .update({
      name: newCNIData.name,
      costs: newCNIData.costs,
      duration: newCNIData.duration,
      onlineUrl: newCNIData.onlineUrl,
      formUrl: newCNIData.formUrl,
      description: newCNIData.description,
      steps: newCNIData.steps,
      documents: newCNIData.documents,
      tips: newCNIData.tips,
      faqs: newCNIData.faqs,
      updatedAt: new Date().toISOString()
    })
    .eq('slug', 'carte-nationale-identite-cni')
    .select()

  if (error) {
    console.error('❌ Erreur:', error.message)
    return
  }

  console.log('✅ Procédure CNI mise à jour avec succès!\n')
  console.log('='.repeat(80))
  console.log('📊 NOUVELLES INFORMATIONS:')
  console.log('─'.repeat(80))
  console.log(`💰 Tarif: ${newCNIData.costs}`)
  console.log(`⏱️  Délai: ${newCNIData.duration}`)
  console.log(`📅 Validité: 15 ans`)
  console.log(`🌐 Plateforme: ${newCNIData.onlineUrl}`)
  console.log(`📋 Étapes: ${newCNIData.steps.length}`)
  console.log(`💡 Conseils: ${newCNIData.tips.length}`)
  console.log(`❓ FAQ: ${newCNIData.faqs.length} questions`)
  console.log('='.repeat(80))

  console.log('\n📌 CHANGEMENTS MAJEURS:')
  console.log('  • Tarif réduit: 16 000 → 10 000 FCFA')
  console.log('  • Délai officiel: 48 heures garanti')
  console.log('  • Validité prolongée: 10 → 15 ans')
  console.log('  • Nouvelle plateforme: www.idcam.cm')
  console.log('  • Pré-enrôlement 100% en ligne')
  console.log('  • Opérateur: AUGENTIC IDCamSA pour la DGSN')

  console.log('\n✅ Mise à jour terminée!')
}

updateCNIInfo().catch(console.error)
