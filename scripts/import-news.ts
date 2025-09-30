#!/usr/bin/env tsx
// ============================================
// IMPORT NEWS ARTICLES
// Insère des actualités de base dans Supabase
// ============================================

import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables d\'environnement manquantes!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

interface NewsData {
  title: string
  summary: string
  content: string
  url: string
  source: string
  category: 'Juridique' | 'Administratif' | 'Entreprise' | 'Foncier' | 'Social' | 'Education' | 'Sante' | 'Tous'
  publishedAt: string
  isFeatured?: boolean
  tags?: string[]
}

const newsArticles: NewsData[] = [
  {
    title: 'Nouvelle réforme de la CNI biométrique au Cameroun',
    summary: 'Le gouvernement camerounais accélère le déploiement du système biométrique pour les cartes nationales d\'identité avec un nouveau délai de 48 heures.',
    content: `Le Ministère de l'Administration Territoriale a annoncé une accélération du déploiement du nouveau système de carte nationale d'identité biométrique. Cette réforme vise à moderniser l'identification des citoyens camerounais et à réduire considérablement les délais de traitement.

Principales améliorations :
- Réduction du délai à 48 heures pour l'obtention de la CNI
- Système d'enrôlement biométrique avec empreintes digitales
- Possibilité de prise de rendez-vous en ligne
- Paiement via Mobile Money accepté

Le coût reste fixé à 10 000 FCFA pour le timbre fiscal, auxquels s'ajoutent les frais de certificat de nationalité (3 500 FCFA) et de copie certifiée de l'acte de naissance (2 000 FCFA).

Les centres d'enrôlement sont opérationnels à Yaoundé, Douala, Garoua et progressivement dans les autres régions du pays.`,
    url: 'https://www.cameroon-tribune.cm/article/nouvelle-reforme-cni-biometrique',
    source: 'Cameroon Tribune',
    category: 'Administratif',
    publishedAt: '2025-01-15T10:00:00Z',
    isFeatured: true,
    tags: ['CNI', 'Biométrie', 'Administration', 'Identité']
  },
  {
    title: 'Digitalisation des services publics : Le portail e-gouvernement opérationnel',
    summary: 'Le Cameroun lance officiellement son portail de services publics en ligne permettant aux citoyens d\'effectuer plusieurs démarches administratives à distance.',
    content: `Le gouvernement camerounais a officiellement lancé son portail e-gouvernement, marquant une étape importante dans la digitalisation des services publics. Cette plateforme permet désormais aux citoyens d'effectuer diverses démarches administratives sans se déplacer.

Services disponibles en ligne :
- Demande de certificat de nationalité
- Pré-inscription pour la CNI
- Suivi de dossier de passeport
- Consultation du casier judiciaire
- Paiement de taxes et impôts

Le portail est accessible 24h/24 et 7j/7 depuis n'importe quel appareil connecté à Internet. Les paiements peuvent être effectués via Mobile Money ou carte bancaire.

Cette initiative s'inscrit dans la stratégie nationale de transformation digitale visant à améliorer l'efficacité des services publics et à réduire les délais de traitement.`,
    url: 'https://www.prc.cm/fr/actualites/digitalisation-services-publics',
    source: 'Présidence de la République',
    category: 'Administratif',
    publishedAt: '2025-01-10T09:00:00Z',
    isFeatured: true,
    tags: ['E-gouvernement', 'Digitalisation', 'Services publics', 'Innovation']
  },
  {
    title: 'Nouvelles dispositions pour la création d\'entreprise au Cameroun',
    summary: 'Le Centre de Formalités de Création d\'Entreprises simplifie les procédures avec un guichet unique entièrement digitalisé.',
    content: `Le Centre de Formalités de Création d'Entreprises (CFCE) a annoncé de nouvelles mesures visant à faciliter la création d'entreprises au Cameroun. Le processus est désormais entièrement digitalisé et peut être complété en moins de 48 heures.

Nouveautés :
- Guichet unique en ligne pour toutes les formalités
- Réduction du délai à 48 heures maximum
- Frais réduits pour les jeunes entrepreneurs
- Accompagnement personnalisé disponible

Les entrepreneurs peuvent désormais soumettre leur dossier en ligne, suivre l'avancement en temps réel et recevoir leurs documents officiels par voie électronique.

Le coût de création varie entre 50 000 et 150 000 FCFA selon le type d'entreprise. Des réductions sont accordées aux jeunes de moins de 35 ans et aux femmes entrepreneures.`,
    url: 'https://www.investiraucameroun.com/nouvelles-dispositions-creation-entreprise',
    source: 'Investir au Cameroun',
    category: 'Entreprise',
    publishedAt: '2025-01-08T14:30:00Z',
    tags: ['Entrepreneuriat', 'CFCE', 'Création entreprise', 'Business']
  },
  {
    title: 'Réforme du Code du Travail : Ce qui change pour les employés',
    summary: 'Le nouveau Code du Travail apporte des modifications importantes concernant les contrats, les congés et la protection sociale des travailleurs.',
    content: `Le Parlement camerounais a adopté plusieurs amendements au Code du Travail visant à améliorer la protection des travailleurs et à moderniser les relations professionnelles.

Principaux changements :
- Extension du congé de maternité à 16 semaines
- Introduction du congé de paternité de 10 jours
- Nouvelles dispositions sur le télétravail
- Renforcement de la protection contre le harcèlement
- Assouplissement des conditions de démission

Les employeurs disposent d'un délai de 6 mois pour se mettre en conformité avec ces nouvelles dispositions. Des sessions d'information sont organisées par le Ministère du Travail dans toutes les régions.

Ces réformes visent à harmoniser la législation camerounaise avec les standards internationaux du travail.`,
    url: 'https://www.cameroon-tribune.cm/article/reforme-code-travail',
    source: 'Cameroon Tribune',
    category: 'Social',
    publishedAt: '2025-01-05T11:00:00Z',
    tags: ['Code du travail', 'Droit social', 'Employés', 'Protection sociale']
  },
  {
    title: 'Système judiciaire : Nouvelle plateforme de consultation des jugements',
    summary: 'Le Ministère de la Justice lance une plateforme en ligne permettant de consulter les décisions de justice et de suivre l\'avancement des dossiers.',
    content: `Dans le cadre de la modernisation du système judiciaire camerounais, le Ministère de la Justice a mis en place une plateforme numérique accessible au public.

Fonctionnalités :
- Consultation anonymisée des décisions de justice
- Suivi en ligne de l'état d'avancement des dossiers
- Prise de rendez-vous avec les greffes
- Paiement en ligne des frais de justice
- Demande d'extrait de casier judiciaire

Cette initiative vise à améliorer la transparence du système judiciaire et à faciliter l'accès à l'information juridique pour tous les citoyens.

La plateforme est déjà opérationnelle pour les tribunaux de première instance de Yaoundé et Douala, avec un déploiement progressif dans les autres juridictions du pays.`,
    url: 'https://www.minjustice.gov.cm/plateforme-consultation-jugements',
    source: 'Ministère de la Justice',
    category: 'Juridique',
    publishedAt: '2025-01-03T08:00:00Z',
    isFeatured: true,
    tags: ['Justice', 'Digitalisation', 'Tribunaux', 'Transparence']
  }
]

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

async function importNews() {
  console.log('🚀 Début de l\'import des actualités...\n')

  let successCount = 0
  let errorCount = 0

  for (const article of newsArticles) {
    console.log(`📰 Traitement: ${article.title}`)

    try {
      const slug = generateSlug(article.title)

      // Vérifier si l'article existe déjà
      const { data: existing } = await supabase
        .from('NewsArticle')
        .select('id')
        .eq('url', article.url)
        .single()

      if (existing) {
        console.log('   ℹ️  Article déjà existant, mise à jour...')

        const { error: updateError } = await supabase
          .from('NewsArticle')
          .update({
            title: article.title,
            summary: article.summary,
            content: article.content,
            source: article.source,
            category: article.category,
            publishedAt: article.publishedAt,
            isFeatured: article.isFeatured || false,
            tags: article.tags || [],
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
        // Insérer l'article
        const { error } = await supabase
          .from('NewsArticle')
          .insert({
            title: article.title,
            summary: article.summary,
            content: article.content,
            url: article.url,
            source: article.source,
            category: article.category,
            publishedAt: article.publishedAt,
            isFeatured: article.isFeatured || false,
            tags: article.tags || [],
            isRelevant: true,
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
importNews().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})