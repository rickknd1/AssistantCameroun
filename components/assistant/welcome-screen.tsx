"use client"

import { useState } from "react"
import { Bot, Sparkles, FileText, Building2, Scale, Home, Users, Briefcase } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

interface WelcomeScreenProps {
  onQuestionClick: (question: string) => void
}

const CATEGORIES = [
  {
    id: "identite",
    name: "Identité",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    questions: [
      "Comment obtenir ma carte nationale d'identité ?",
      "Quelle est la procédure pour un passeport ?",
      "Comment obtenir un acte de naissance ?",
    ]
  },
  {
    id: "entreprise",
    name: "Entreprise",
    icon: Building2,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950",
    questions: [
      "Quels documents pour créer une entreprise ?",
      "Comment enregistrer une société au Cameroun ?",
      "Quelles sont les taxes pour les entreprises ?",
    ]
  },
  {
    id: "juridique",
    name: "Juridique",
    icon: Scale,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    questions: [
      "Quels sont mes droits en tant que travailleur ?",
      "Comment porter plainte au tribunal ?",
      "Quelle est la procédure de divorce au Cameroun ?",
    ]
  },
  {
    id: "foncier",
    name: "Foncier",
    icon: Home,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    questions: [
      "Comment faire une demande de titre foncier ?",
      "Quelle est la procédure d'achat de terrain ?",
      "Comment obtenir un permis de construire ?",
    ]
  },
]

export function WelcomeScreen({ onQuestionClick }: WelcomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { t } = useLanguage()

  const selectedCat = CATEGORIES.find(c => c.id === selectedCategory)

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-3 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl space-y-6 sm:space-y-8 text-center">
        {/* Avatar */}
        <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent shadow-lg">
          <Bot className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
        </div>

        {/* Welcome Message */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-balance text-2xl sm:text-3xl font-bold text-foreground lg:text-4xl">
            {t('assistant.welcome.title')}
          </h1>
          <p className="text-pretty text-sm sm:text-base lg:text-lg text-muted-foreground px-2">
            {t('assistant.welcome.subtitle')}
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
            <span>{t('assistant.welcome.feature1')}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
            <span>{t('assistant.welcome.feature2')}</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
            <span>{t('assistant.welcome.feature3')}</span>
          </div>
        </div>

        {/* Categories */}
        {!selectedCategory ? (
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm font-medium text-foreground">{t('assistant.welcome.chooseCategory')}</p>
            <div className="grid gap-2 sm:gap-3 grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group rounded-lg border border-border ${category.bgColor} p-3 sm:p-4 text-center transition-all hover:border-primary hover:shadow-md active:scale-95 touch-manipulation`}
                >
                  <category.icon className={`mx-auto h-6 w-6 sm:h-8 sm:w-8 mb-2 ${category.color}`} />
                  <span className="text-xs sm:text-sm font-semibold text-foreground">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-xs sm:text-sm font-medium text-foreground">{selectedCat?.name} :</p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs sm:text-sm text-primary hover:underline touch-manipulation"
              >
                {t('assistant.welcome.back')}
              </button>
            </div>
            <div className="grid gap-2 sm:gap-3">
              {selectedCat?.questions.map((question) => (
                <button
                  key={question}
                  onClick={() => onQuestionClick(question)}
                  className="rounded-lg border border-border bg-card p-3 sm:p-4 text-left text-xs sm:text-sm transition-all hover:border-primary hover:shadow-md active:scale-[0.98] touch-manipulation"
                >
                  <span className="text-card-foreground">{question}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
