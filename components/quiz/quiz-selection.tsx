"use client"

import { Brain, Trophy, Target } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { QUIZ_CATEGORIES } from "./quiz-content"
import { useState } from "react"

interface QuizSelectionProps {
  onStartQuiz: (categoryId: string, difficulty: "facile" | "moyen" | "difficile") => void
}

export function QuizSelection({ onStartQuiz }: QuizSelectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-gradient-to-b from-muted/20 to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-balance text-3xl font-bold text-foreground sm:text-4xl">Quiz Interactifs</h1>
            <p className="mt-2 text-pretty text-muted-foreground">
              Testez vos connaissances sur le droit et les procédures au Cameroun
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {!selectedCategory ? (
          <>
            <h2 className="text-2xl font-bold text-foreground">Choisissez une catégorie</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {QUIZ_CATEGORIES.map((category) => (
                <Card
                  key={category.id}
                  className="group cursor-pointer p-6 transition-all hover:shadow-lg"
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <div className="text-4xl">{category.icon}</div>
                  <h3 className="mt-4 font-semibold text-card-foreground group-hover:text-primary">{category.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{category.description}</p>
                  <Badge variant="secondary" className="mt-4">
                    {category.questionCount} questions
                  </Badge>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <>
            <Button variant="ghost" onClick={() => setSelectedCategory(null)} className="mb-6">
              ← Retour aux catégories
            </Button>

            <div className="mx-auto max-w-2xl">
              <Card className="p-8">
                <div className="text-center">
                  <div className="text-5xl">{QUIZ_CATEGORIES.find((c) => c.id === selectedCategory)?.icon}</div>
                  <h2 className="mt-4 text-2xl font-bold text-card-foreground">
                    {QUIZ_CATEGORIES.find((c) => c.id === selectedCategory)?.name}
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    {QUIZ_CATEGORIES.find((c) => c.id === selectedCategory)?.description}
                  </p>
                </div>

                <div className="mt-8 space-y-4">
                  <h3 className="font-semibold text-card-foreground">Choisissez votre niveau de difficulté :</h3>

                  <button
                    onClick={() => onStartQuiz(selectedCategory, "facile")}
                    className="flex w-full items-center gap-4 rounded-lg border border-border bg-background p-4 text-left transition-all hover:border-primary hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900">
                      <Target className="h-6 w-6 text-green-600 dark:text-green-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">Facile</h4>
                      <p className="text-sm text-muted-foreground">Questions de base, idéal pour débuter</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                      10 questions
                    </Badge>
                  </button>

                  <button
                    onClick={() => onStartQuiz(selectedCategory, "moyen")}
                    className="flex w-full items-center gap-4 rounded-lg border border-border bg-background p-4 text-left transition-all hover:border-primary hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900">
                      <Brain className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">Moyen</h4>
                      <p className="text-sm text-muted-foreground">Questions intermédiaires, bon challenge</p>
                    </div>
                    <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
                      15 questions
                    </Badge>
                  </button>

                  <button
                    onClick={() => onStartQuiz(selectedCategory, "difficile")}
                    className="flex w-full items-center gap-4 rounded-lg border border-border bg-background p-4 text-left transition-all hover:border-primary hover:shadow-md"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900">
                      <Trophy className="h-6 w-6 text-red-600 dark:text-red-300" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">Difficile</h4>
                      <p className="text-sm text-muted-foreground">Questions avancées pour les experts</p>
                    </div>
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">20 questions</Badge>
                  </button>
                </div>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
