#!/usr/bin/env tsx
/**
 * MISE À JOUR PASSEPORT - NOUVELLES INFORMATIONS 2025
 * Plateforme: https://portal.passcam.cm/
 * Délai: 48h
 * Prix: 110 000 FCFA (biométrique)
 */

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

async function updatePasseportInfo() {
  console.log('🔄 MISE À JOUR DES INFORMATIONS PASSEPORT 2025\n')
  console.log('='.repeat(80))

  // PASSEPORT BIOMÉTRIQUE
  const passeportBiometrique = {
    name: 'Passeport Biométrique',
    costs: '110 000 FCFA (passeport biométrique)',
    duration: '48 heures (2 jours ouvrables)',
    onlineUrl: 'https://portal.passcam.cm/',
    formUrl: 'https://portal.passcam.cm/',
    description: `Passeport biométrique camerounais, document de voyage officiel sécurisé permettant les déplacements internationaux. Validité de 10 ans pour les adultes. Procédure entièrement digitalisée via la plateforme PassCam.`,

    steps: [
      {
        title: 'Vérification des prérequis',
        description: 'S\'assurer d\'avoir une CNI valide et tous les documents nécessaires',
        duration: '1 jour',
        cost: 'Gratuit',
        requirements: ['CNI valide', 'Acte de naissance', 'Photos d\'identité biométriques']
      },
      {
        title: 'Pré-enrôlement en ligne',
        description: 'Se rendre sur portal.passcam.cm pour remplir le formulaire et prendre rendez-vous',
        duration: '15-30 minutes',
        cost: 'Gratuit',
        requirements: ['Connexion internet', 'Email valide', 'CNI numérisée']
      },
      {
        title: 'Préparation du dossier',
        description: 'Rassembler tous les documents originaux requis',
        duration: '1-2 jours',
        cost: 'Variable',
        requirements: [
          'CNI originale et copie',
          'Acte de naissance original',
          '3 photos d\'identité biométriques',
          'Certificat de nationalité (si requis)'
        ]
      },
      {
        title: 'Rendez-vous et enrôlement',
        description: 'Se présenter au centre d\'enrôlement avec tous les documents',
        duration: '1-2 heures',
        cost: '110 000 FCFA',
        requirements: [
          'Tous les documents originaux',
          'Confirmation de rendez-vous',
          'Paiement des frais'
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
        title: 'Production et délivrance',
        description: 'Votre passeport sera produit et disponible sous 48 heures',
        duration: '48 heures',
        cost: 'Inclus',
        requirements: ['Récépissé de paiement']
      }
    ],

    tips: [
      'La CNI est OBLIGATOIRE pour faire une demande de passeport',
      'Utilisez la plateforme portal.passcam.cm pour le pré-enrôlement',
      'Délai de délivrance garanti: 48 heures après l\'enrôlement',
      'Prix: 110 000 FCFA pour le passeport biométrique',
      'Validité: 10 ans pour les adultes',
      'Prévoyez 3 photos d\'identité biométriques récentes',
      'Paiement par Mobile Money ou autres moyens acceptés',
      'Gardez précieusement votre récépissé de paiement'
    ],

    documents: [
      {
        name: 'Carte Nationale d\'Identité (CNI)',
        description: 'CNI originale et une copie',
        mandatory: true
      },
      {
        name: 'Acte de naissance',
        description: 'Document original',
        mandatory: true
      },
      {
        name: 'Photos d\'identité biométriques',
        description: '3 photos récentes conformes aux normes',
        mandatory: true
      },
      {
        name: 'Certificat de nationalité',
        description: 'Si requis selon votre situation',
        mandatory: false
      }
    ],

    faqs: [
      {
        question: 'Quel est le prix du passeport biométrique ?',
        answer: '110 000 FCFA'
      },
      {
        question: 'Quel est le délai de délivrance ?',
        answer: '48 heures (2 jours ouvrables) après l\'enrôlement et le paiement'
      },
      {
        question: 'Comment faire ma demande ?',
        answer: 'Rendez-vous sur https://portal.passcam.cm/ pour le pré-enrôlement en ligne'
      },
      {
        question: 'Ai-je besoin d\'une CNI ?',
        answer: 'Oui, la CNI est OBLIGATOIRE pour toute demande de passeport'
      },
      {
        question: 'Quelle est la durée de validité ?',
        answer: '10 ans pour les adultes'
      },
      {
        question: 'Combien de photos faut-il ?',
        answer: '3 photos d\'identité biométriques récentes'
      }
    ]
  }

  console.log('\n📝 Mise à jour du passeport biométrique...\n')

  const { error: errorBio } = await supabase
    .from('Procedure')
    .update({
      name: passeportBiometrique.name,
      costs: passeportBiometrique.costs,
      duration: passeportBiometrique.duration,
      onlineUrl: passeportBiometrique.onlineUrl,
      formUrl: passeportBiometrique.formUrl,
      description: passeportBiometrique.description,
      steps: passeportBiometrique.steps,
      documents: passeportBiometrique.documents,
      tips: passeportBiometrique.tips,
      faqs: passeportBiometrique.faqs,
      updatedAt: new Date().toISOString()
    })
    .eq('slug', 'passeport-biometrique')

  if (errorBio) {
    console.error('❌ Erreur passeport biométrique:', errorBio.message)
  } else {
    console.log('✅ Passeport biométrique mis à jour!')
  }

  // PASSEPORT ORDINAIRE (même plateforme, prix différent si applicable)
  const passeportOrdilaire = {
    name: 'Passeport ordinaire',
    costs: '110 000 FCFA (passeport ordinaire)',
    duration: '48 heures (2 jours ouvrables)',
    onlineUrl: 'https://portal.passcam.cm/',
    formUrl: 'https://portal.passcam.cm/',
    description: `Passeport camerounais ordinaire, document de voyage officiel permettant les déplacements internationaux. Validité de 10 ans pour les adultes. Procédure entièrement digitalisée via la plateforme PassCam.`,

    steps: passeportBiometrique.steps, // Même procédure

    tips: [
      'La CNI est OBLIGATOIRE pour faire une demande de passeport',
      'Utilisez la plateforme portal.passcam.cm pour le pré-enrôlement',
      'Délai de délivrance garanti: 48 heures après l\'enrôlement',
      'Prix: 110 000 FCFA',
      'Validité: 10 ans pour les adultes',
      'Prévoyez 3 photos d\'identité biométriques récentes',
      'Paiement par Mobile Money ou autres moyens acceptés',
      'Gardez précieusement votre récépissé de paiement'
    ],

    documents: passeportBiometrique.documents,

    faqs: [
      {
        question: 'Quel est le prix du passeport ?',
        answer: '110 000 FCFA'
      },
      {
        question: 'Quel est le délai de délivrance ?',
        answer: '48 heures (2 jours ouvrables) après l\'enrôlement et le paiement'
      },
      {
        question: 'Comment faire ma demande ?',
        answer: 'Rendez-vous sur https://portal.passcam.cm/ pour le pré-enrôlement en ligne'
      },
      {
        question: 'Ai-je besoin d\'une CNI ?',
        answer: 'Oui, la CNI est OBLIGATOIRE pour toute demande de passeport'
      },
      {
        question: 'Quelle est la durée de validité ?',
        answer: '10 ans pour les adultes'
      }
    ]
  }

  console.log('\n📝 Mise à jour du passeport ordinaire...\n')

  const { error: errorOrd } = await supabase
    .from('Procedure')
    .update({
      name: passeportOrdilaire.name,
      costs: passeportOrdilaire.costs,
      duration: passeportOrdilaire.duration,
      onlineUrl: passeportOrdilaire.onlineUrl,
      formUrl: passeportOrdilaire.formUrl,
      description: passeportOrdilaire.description,
      steps: passeportOrdilaire.steps,
      documents: passeportOrdilaire.documents,
      tips: passeportOrdilaire.tips,
      faqs: passeportOrdilaire.faqs,
      updatedAt: new Date().toISOString()
    })
    .eq('slug', 'passeport')

  if (errorOrd) {
    console.error('❌ Erreur passeport ordinaire:', errorOrd.message)
  } else {
    console.log('✅ Passeport ordinaire mis à jour!')
  }

  console.log('\n' + '='.repeat(80))
  console.log('📊 RÉSUMÉ DES MISES À JOUR:')
  console.log('─'.repeat(80))
  console.log(`🌐 Plateforme: https://portal.passcam.cm/`)
  console.log(`💰 Prix: 110 000 FCFA`)
  console.log(`⏱️  Délai: 48 heures garanti`)
  console.log(`📅 Validité: 10 ans`)
  console.log(`📋 Étapes: 6`)
  console.log(`💡 Conseils: 8`)
  console.log('='.repeat(80))

  console.log('\n📌 CHANGEMENTS:')
  console.log('  • Délai: 2-6 semaines → 48 heures')
  console.log('  • Plateforme: portal.passcam.cm ajoutée')
  console.log('  • Prix confirmé: 110 000 FCFA')
  console.log('  • Procédure détaillée (6 étapes)')
  console.log('  • FAQ ajoutée (5-6 questions)')

  console.log('\n✅ Mise à jour terminée!')
}

updatePasseportInfo().catch(console.error)
