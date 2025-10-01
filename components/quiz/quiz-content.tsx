"use client"

import { useState } from "react"
import { QuizSelection } from "./quiz-selection"
import { QuizInterface } from "./quiz-interface"

export interface QuizCategory {
  id: string
  name: string
  description: string
  icon: string
  questionCount: number
}

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: "identite",
    name: "Identité & Documents",
    description: "CNI, passeport, actes d'état civil et autres documents",
    icon: "📋",
    questionCount: 10,
  },
  {
    id: "entreprise",
    name: "Création d'Entreprise",
    description: "Tout savoir sur la création et gestion d'entreprise",
    icon: "🏢",
    questionCount: 10,
  },
  {
    id: "juridique",
    name: "Droit du Travail",
    description: "Droits et obligations des travailleurs et employeurs",
    icon: "⚖️",
    questionCount: 10,
  },
  {
    id: "foncier",
    name: "Droit Foncier",
    description: "Propriété, titres fonciers et transactions immobilières",
    icon: "🏠",
    questionCount: 7,
  },
  {
    id: "education",
    name: "Éducation",
    description: "Système éducatif et parcours scolaire au Cameroun",
    icon: "🎓",
    questionCount: 6,
  },
]

export function QuizContent() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<"facile" | "moyen" | "difficile" | null>(null)
  const [quizStarted, setQuizStarted] = useState(false)

  const handleStartQuiz = (categoryId: string, difficulty: "facile" | "moyen" | "difficile") => {
    setSelectedCategory(categoryId)
    setSelectedDifficulty(difficulty)
    setQuizStarted(true)
  }

  const handleRestart = () => {
    setSelectedCategory(null)
    setSelectedDifficulty(null)
    setQuizStarted(false)
  }

  if (quizStarted && selectedCategory && selectedDifficulty) {
    return <QuizInterface categoryId={selectedCategory} difficulty={selectedDifficulty} onRestart={handleRestart} />
  }

  return <QuizSelection onStartQuiz={handleStartQuiz} />
}
