"use client"

import { Bot, Sparkles } from "lucide-react"

interface WelcomeScreenProps {
  onQuestionClick: (question: string) => void
}

const SUGGESTED_QUESTIONS = [
  "Comment obtenir ma carte nationale d'identité ?",
  "Quels documents pour créer une entreprise ?",
  "Comment obtenir un acte de naissance ?",
  "Quelle est la procédure pour un passeport ?",
  "Comment faire une demande de titre foncier ?",
  "Quels sont mes droits en tant que travailleur ?",
]

export function WelcomeScreen({ onQuestionClick }: WelcomeScreenProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8">
      <div className="w-full max-w-3xl space-y-8 text-center">
        {/* Avatar */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent shadow-lg">
          <Bot className="h-10 w-10 text-white" />
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <h1 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Bonjour ! Je suis votre Assistant National
          </h1>
          <p className="text-pretty text-lg text-muted-foreground">
            Posez-moi vos questions sur les procédures administratives, le droit camerounais, ou tout autre sujet
            concernant la vie au Cameroun. Je suis là pour vous aider avec des informations fiables et vérifiées.
          </p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Réponses instantanées</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-secondary" />
            <span>Sources officielles</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span>Bilingue FR/EN</span>
          </div>
        </div>

        {/* Suggested Questions */}
        <div className="space-y-4">
          <p className="text-sm font-medium text-foreground">Questions suggérées :</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {SUGGESTED_QUESTIONS.map((question) => (
              <button
                key={question}
                onClick={() => onQuestionClick(question)}
                className="rounded-lg border border-border bg-card p-4 text-left text-sm transition-all hover:border-primary hover:shadow-md"
              >
                <span className="text-card-foreground">{question}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
