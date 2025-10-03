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
    <div className="flex flex-1 flex-col items-center justify-center p-3 sm:p-6 lg:p-8 relative z-10">
      <div className="w-full max-w-4xl space-y-6 sm:space-y-8 text-center">
        {/* Avatar with gradient border */}
        <div className="mx-auto relative">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 via-yellow-500 to-red-500 blur-lg opacity-30 animate-pulse"></div>
          <div className="relative flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 via-yellow-500 to-red-500 shadow-2xl">
            <Bot className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
          </div>
        </div>

        {/* Welcome Message */}
        <div className="space-y-3 sm:space-y-4">
          <h1 className="text-balance text-3xl sm:text-4xl font-bold text-foreground lg:text-5xl bg-gradient-to-r from-green-600 via-yellow-600 to-red-600 bg-clip-text text-transparent">
            {t('assistant.welcome.title')}
          </h1>
          <p className="text-pretty text-base sm:text-lg lg:text-xl text-muted-foreground px-2 max-w-2xl mx-auto">
            {t('assistant.welcome.subtitle')}
          </p>
        </div>

        {/* Features with enhanced styling */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <span className="font-medium text-green-700 dark:text-green-400">{t('assistant.welcome.feature1')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
            <span className="font-medium text-yellow-700 dark:text-yellow-400">{t('assistant.welcome.feature2')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            <span className="font-medium text-red-700 dark:text-red-400">{t('assistant.welcome.feature3')}</span>
          </div>
        </div>

        {/* Categories */}
        {!selectedCategory ? (
          <div className="space-y-4 sm:space-y-6">
            <p className="text-sm sm:text-base font-semibold text-foreground">{t('assistant.welcome.chooseCategory')}</p>
            <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`group relative overflow-hidden rounded-xl border-2 border-transparent ${category.bgColor} p-4 sm:p-6 text-center transition-all hover:border-current hover:shadow-xl hover:scale-105 active:scale-95 touch-manipulation`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <category.icon className={`relative mx-auto h-8 w-8 sm:h-10 sm:w-10 mb-3 ${category.color} group-hover:scale-110 transition-transform`} />
                  <span className="relative text-sm sm:text-base font-bold text-foreground">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm sm:text-base font-semibold text-foreground">{selectedCat?.name} :</p>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm sm:text-base text-primary hover:underline font-medium touch-manipulation flex items-center gap-1"
              >
                ← {t('assistant.welcome.back')}
              </button>
            </div>
            <div className="grid gap-3 sm:gap-4">
              {selectedCat?.questions.map((question) => (
                <button
                  key={question}
                  onClick={() => onQuestionClick(question)}
                  className="group rounded-xl border-2 border-border bg-card p-4 sm:p-5 text-left text-sm sm:text-base transition-all hover:border-primary hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] touch-manipulation"
                >
                  <span className="text-card-foreground group-hover:text-primary transition-colors">{question}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
