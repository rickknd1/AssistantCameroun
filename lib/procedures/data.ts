// ============================================
// Données STATIQUES des procédures administratives (versionnées dans Git)
// Source d'origine : scripts/import-procedures.ts (anciennement table Supabase "Procedure")
// ============================================
import type { Procedure } from "@/lib/types/database"

const NOW = "2025-01-01T00:00:00.000Z"

export const PROCEDURES: Procedure[] = [
  {
    id: "carte-nationale-identite-cni",
    slug: "carte-nationale-identite-cni",
    name: "Carte Nationale d'Identité (CNI)",
    description:
      "Document officiel d'identité permettant d'attester de votre identité et de votre nationalité camerounaise. Système biométrique en cours de déploiement.",
    category: "identite",
    difficulty: "Facile",
    duration: "48 heures (nouveau système)",
    steps: [
      { step: 1, title: "Créer un compte en ligne", description: "Créer un compte sur le système en ligne (en déploiement) ou se rendre directement au centre." },
      { step: 2, title: "Prendre rendez-vous", description: "Prendre rendez-vous en ligne ou au centre d'enrôlement." },
      { step: 3, title: "Payer les frais", description: "Payer via Mobile Money (Orange/MTN) ou en espèces: 10 000 FCFA (timbre fiscal)." },
      { step: 4, title: "Se présenter au centre", description: "Apporter tous les documents requis: acte de naissance, certificat de nationalité, photos, justificatif de domicile." },
      { step: 5, title: "Enrôlement biométrique", description: "Prise d'empreintes digitales et photo biométrique." },
      { step: 6, title: "Retrait de la CNI", description: "Retirer votre CNI après 48 heures au même centre." },
    ],
    documents: [
      "Acte de naissance original",
      "Certificat de nationalité (3 500 FCFA)",
      "2 photos d'identité récentes",
      "Justificatif de domicile",
      "Copie certifiée acte de naissance (2 000 FCFA)",
    ],
    costs: [
      { item: "Timbre fiscal", amount: "10 000 FCFA" },
      { item: "Certificat de nationalité", amount: "3 500 FCFA" },
      { item: "Copie certifiée acte naissance", amount: "2 000 FCFA" },
      { item: "Photos d'identité", amount: "500 - 1 000 FCFA" },
    ],
    locations: [
      { name: "Centre national - Etoudi", address: "Yaoundé", hours: "8h-15h" },
      { name: "Centre d'enrôlement", address: "Douala", hours: "8h-15h" },
      { name: "Centre d'enrôlement", address: "Garoua", hours: "8h-15h" },
    ],
    tips: [
      "Arrivez tôt le matin pour éviter la foule",
      "Vérifiez que vos photos respectent les normes (fond blanc, visage dégagé)",
      "Conservez votre récépissé précieusement",
      "Pour difficultés, contacter délégations régionales DGSN",
      "Site officiel: www.dgsn.cm",
    ],
    faqs: [
      { question: "Quelle est la durée de validité ?", answer: "10 ans pour les adultes, 5 ans pour les mineurs." },
      { question: "Que faire en cas de perte ?", answer: "Faire une déclaration de perte au commissariat puis demander un duplicata au centre d'enrôlement." },
      { question: "Le nouveau système est-il déjà actif partout ?", answer: "Non, le déploiement est en cours. Les anciens tarifs sont maintenus jusqu'au déploiement complet." },
    ],
    popularity: 100,
    viewCount: 0,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "passeport-biometrique",
    slug: "passeport-biometrique",
    name: "Passeport Biométrique",
    description:
      "Document de voyage officiel permettant les déplacements internationaux. Passeport biométrique valable 5 ans.",
    category: "identite",
    difficulty: "Moyen",
    duration: "Variable selon centre (2-6 semaines)",
    steps: [
      { step: 1, title: "Obtenir une CNI valide", description: "Vous devez avoir une carte nationale d'identité en cours de validité." },
      { step: 2, title: "Prendre rendez-vous", description: "Prendre rendez-vous en ligne ou directement au centre de production." },
      { step: 3, title: "Constituer le dossier", description: "Rassembler tous les documents requis: CNI, acte de naissance, certificat de nationalité, photos, justificatif." },
      { step: 4, title: "Payer les frais", description: "Payer 110 000 FCFA (tarif national)." },
      { step: 5, title: "Enrôlement biométrique", description: "Se présenter pour la prise d'empreintes et photo biométrique." },
      { step: 6, title: "Retrait du passeport", description: "Retirer le passeport selon le délai annoncé par le centre." },
    ],
    documents: [
      "CNI en cours de validité",
      "Acte de naissance original",
      "Certificat de nationalité",
      "2 photos d'identité biométriques (fond blanc)",
      "Justificatif de domicile",
    ],
    costs: [
      { item: "Passeport biométrique (adulte)", amount: "110 000 FCFA" },
      { item: "Passeport consulaire", amount: "96€ (62 975 FCFA)" },
      { item: "Photos biométriques", amount: "1 000 - 2 000 FCFA" },
    ],
    locations: [
      { name: "Centre de production DGSN", address: "Yaoundé", hours: "8h-15h" },
      { name: "Centre de production", address: "Douala", hours: "8h-15h" },
      { name: "Centre de production", address: "Garoua", hours: "8h-15h" },
    ],
    tips: [
      "Vérifiez la validité de votre CNI avant de commencer",
      "Les photos doivent être récentes (moins de 6 mois)",
      "Prévoyez un délai supplémentaire pendant les périodes de forte affluence",
      "Contrat avec INCM-Augentic (10 ans)",
      "Tarif réduit pour les enfants en consulat",
    ],
    faqs: [
      { question: "Quelle est la durée de validité ?", answer: "5 ans pour tous les âges." },
      { question: "Peut-on voyager pendant le traitement ?", answer: "Non, votre ancien passeport sera retenu lors de l'enrôlement." },
      { question: "Différence entre passeport national et consulaire ?", answer: "Tarif différent: 110 000 FCFA au Cameroun, 96€ en consulat. Même validité." },
    ],
    popularity: 90,
    viewCount: 0,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: "acte-naissance",
    slug: "acte-naissance",
    name: "Acte de Naissance",
    description: "Document d'état civil attestant de votre naissance et de votre filiation.",
    category: "identite",
    difficulty: "Facile",
    duration: "24-48 heures",
    steps: [
      { step: 1, title: "Identifier le centre d'état civil", description: "Trouver le centre d'état civil de votre lieu de naissance." },
      { step: 2, title: "Remplir le formulaire", description: "Compléter le formulaire de demande d'acte de naissance." },
      { step: 3, title: "Fournir les informations", description: "Nom, prénom, date et lieu de naissance, noms des parents." },
      { step: 4, title: "Payer les frais", description: "Copie simple (100-300 FCFA), extrait certifié (500-1 000 FCFA), copie intégrale (1 000-2 000 FCFA)." },
      { step: 5, title: "Retirer l'acte", description: "Retrait sous 24-48 heures." },
    ],
    documents: [
      "Pièce d'identité du demandeur",
      "Informations complètes sur les parents",
    ],
    costs: [
      { item: "Copie simple", amount: "100-300 FCFA" },
      { item: "Extrait certifié", amount: "500-1 000 FCFA" },
      { item: "Copie intégrale", amount: "1 000-2 000 FCFA" },
    ],
    locations: [
      { name: "Centre d'état civil", address: "Votre lieu de naissance", hours: "8h-15h" },
    ],
    tips: [
      "Connaissez les noms complets de vos parents",
      "Ayez la date exacte de naissance",
      "Pour naissance à l'étranger, s'adresser au consulat",
      "La copie certifiée est valable 3 mois pour les démarches",
    ],
    faqs: [
      { question: "Validité de l'acte ?", answer: "Pas de durée de validité, mais une copie récente (moins de 3 mois) est souvent demandée." },
      { question: "Acte perdu ?", answer: "Vous pouvez obtenir une copie au centre d'état civil de votre lieu de naissance." },
      { question: "Peut-on faire la demande par procuration ?", answer: "Oui, avec une procuration légalisée et la CNI du mandataire." },
    ],
    popularity: 80,
    viewCount: 0,
    createdAt: NOW,
    updatedAt: NOW,
  },
]
