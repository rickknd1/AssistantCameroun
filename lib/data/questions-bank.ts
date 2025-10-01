// Bank of popular questions organized by categories

export interface QuestionCategory {
  id: string
  name: string
  icon: string
  color: string
  bgColor: string
  questions: string[]
}

export const QUESTIONS_BANK: QuestionCategory[] = [
  {
    id: 'identite',
    name: 'Identite & Documents',
    icon: 'FileText',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950',
    questions: [
      "Comment obtenir ma carte nationale d'identite ?",
      "Quels documents sont necessaires pour faire une CNI ?",
      "Combien coute la carte nationale d'identite au Cameroun ?",
      "Quelle est la duree de validite de la CNI ?",
      "Comment obtenir un passeport ?",
      "Combien coute le passeport biometrique ?",
      "Comment obtenir un acte de naissance ?",
      "Comment obtenir un casier judiciaire ?",
    ]
  },
  {
    id: 'entreprise',
    name: 'Entreprise & Commerce',
    icon: 'Building2',
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950',
    questions: [
      "Comment creer une entreprise au Cameroun ?",
      "Quels documents pour creer une entreprise ?",
      "Combien coute la creation d'entreprise ?",
      "Quelle structure juridique choisir (SARL, SA, SAS) ?",
      "Faut-il un capital minimum pour creer une entreprise ?",
      "Quelles taxes pour une entreprise au Cameroun ?",
      "Comment declarer ses impots en ligne ?",
    ]
  },
  {
    id: 'juridique',
    name: 'Juridique & Justice',
    icon: 'Scale',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950',
    questions: [
      "Quels sont mes droits en tant que travailleur ?",
      "Salaire minimum au Cameroun : combien ?",
      "Comment calculer mes conges payes ?",
      "Licenciement abusif : que faire ?",
      "Comment se marier au Cameroun ?",
      "Comment divorcer au Cameroun ?",
      "Comment porter plainte au Cameroun ?",
    ]
  },
  {
    id: 'foncier',
    name: 'Foncier & Immobilier',
    icon: 'Home',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950',
    questions: [
      "Comment obtenir un titre foncier ?",
      "Combien coute un titre foncier au Cameroun ?",
      "Comment obtenir un permis de construire ?",
      "Peut-on vendre un terrain sans titre foncier ?",
      "Comment rediger un contrat de location ?",
    ]
  },
  {
    id: 'education',
    name: 'Education & Formation',
    icon: 'GraduationCap',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950',
    questions: [
      "Comment s'inscrire a l'universite au Cameroun ?",
      "Bourses d'etudes : comment en obtenir ?",
      "Equivalence de diplome etranger au Cameroun ?",
      "Comment obtenir son baccalaureat ?",
    ]
  }
]
