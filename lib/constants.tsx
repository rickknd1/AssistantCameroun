import { Scale, FileText, Building2, Home, GraduationCap, Heart, BookOpen } from "lucide-react"

export const DOMAINS = [
  {
    icon: Scale,
    title: "Droit & Justice",
    description: "Droit pénal, civil, du travail et procédures judiciaires",
    href: "/bibliotheque?category=droit",
  },
  {
    icon: FileText,
    title: "Procédures administratives",
    description: "CNI, passeport, actes de naissance et autres documents",
    href: "/procedures?category=identite",
  },
  {
    icon: Building2,
    title: "Entreprises & Commerce",
    description: "Création d'entreprise, fiscalité et réglementation",
    href: "/bibliotheque?category=entreprise",
  },
  {
    icon: Home,
    title: "Foncier & Propriété",
    description: "Titres fonciers, baux et transactions immobilières",
    href: "/bibliotheque?category=foncier",
  },
  {
    icon: GraduationCap,
    title: "Éducation & Culture",
    description: "Système éducatif, bourses et patrimoine culturel",
    href: "/bibliotheque?category=education",
  },
  {
    icon: Heart,
    title: "Santé & Social",
    description: "Système de santé, protection sociale et aide",
    href: "/bibliotheque?category=sante",
  },
]

export const POPULAR_QUESTIONS = [
  {
    question: "Comment obtenir ma carte nationale d'identité ?",
    category: "Identité",
  },
  {
    question: "Quels documents pour créer une entreprise au Cameroun ?",
    category: "Entreprise",
  },
  {
    question: "Comment obtenir un acte de naissance ?",
    category: "État civil",
  },
  {
    question: "Quelle est la procédure pour obtenir un passeport ?",
    category: "Identité",
  },
  {
    question: "Comment faire une demande de titre foncier ?",
    category: "Foncier",
  },
  {
    question: "Quels sont mes droits en tant que travailleur ?",
    category: "Travail",
  },
  {
    question: "Comment porter plainte au commissariat ?",
    category: "Justice",
  },
  {
    question: "Quelle est la procédure de divorce au Cameroun ?",
    category: "Justice",
  },
]

export const STATS = [
  { value: "100+", label: "Documents juridiques" },
  { value: "1000+", label: "Questions répondues" },
  { value: "100%", label: "Sources officielles" },
  { value: "24/7", label: "Disponibilité" },
]

export const QUICK_CATEGORIES = [
  {
    icon: FileText,
    label: "Procédures",
    description: "CNI, Passeport, Actes...",
    href: "/procedures",
    color: "from-primary to-primary/80",
  },
  {
    icon: Scale,
    label: "Questions juridiques",
    description: "Droit, Justice, Travail...",
    href: "/assistant?category=juridique",
    color: "from-secondary to-secondary/80",
  },
  {
    icon: BookOpen,
    label: "Culture & Histoire",
    description: "Patrimoine, Traditions...",
    href: "/bibliotheque?category=culture",
    color: "from-accent to-accent/80",
  },
]
