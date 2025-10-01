"use client"

import { useState, useEffect } from "react"
import { Check, X, Share2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import type { QuizQuestion } from "@/lib/types/database"
import { useLanguage } from "@/lib/i18n"

interface QuizInterfaceProps {
  categoryId: string
  difficulty: "facile" | "moyen" | "difficile"
  onRestart: () => void
}

export function QuizInterface({ categoryId, difficulty, onRestart }: QuizInterfaceProps) {
  const { language, t } = useLanguage()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true)
      const params = new URLSearchParams()
      params.append("category", categoryId)
      // Capitalize first letter only: facile -> Facile
      const capitalizedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase()
      params.append("difficulty", capitalizedDifficulty)

      try {
        const res = await fetch(`/api/quiz?${params}`)
        const result = await res.json()
        setQuestions(result.data || [])
      } catch (error) {
        console.error("Error fetching quiz questions:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [categoryId, difficulty])

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null || questions.length === 0) return

    setSelectedAnswer(answerIndex)
    setShowExplanation(true)

    const isCorrect = answerIndex === questions[currentQuestion].correctAnswerIndex
    setAnswers([...answers, isCorrect])

    if (isCorrect) {
      setScore(score + 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-2 bg-muted rounded mb-8"></div>
            <Card className="p-8">
              <div className="h-6 bg-muted rounded w-3/4 mb-8"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 bg-muted rounded"></div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-card-foreground">Aucune question disponible</h2>
            <p className="mt-2 text-muted-foreground">
              Il n'y a pas encore de questions pour cette catégorie et difficulté.
            </p>
            <Button onClick={onRestart} className="mt-6">
              Retour
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    } else {
      setQuizCompleted(true)
    }
  }

  const getScorePercentage = () => {
    return Math.round((score / questions.length) * 100)
  }

  const getScoreMessage = () => {
    const percentage = getScorePercentage()
    if (percentage >= 80) return "Excellent ! Vous maîtrisez parfaitement le sujet."
    if (percentage >= 60) return "Bien joué ! Vous avez de bonnes connaissances."
    if (percentage >= 40) return "Pas mal ! Continuez à apprendre."
    return "Continuez vos efforts ! La pratique rend parfait."
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent">
              <span className="text-3xl font-bold text-white">{getScorePercentage()}%</span>
            </div>

            <h2 className="mt-6 text-2xl font-bold text-card-foreground">Quiz terminé !</h2>
            <p className="mt-2 text-muted-foreground">{getScoreMessage()}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Score</p>
                <p className="mt-1 text-2xl font-bold text-foreground">
                  {score}/{questions.length}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Bonnes réponses</p>
                <p className="mt-1 text-2xl font-bold text-green-600">{score}</p>
              </div>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">Mauvaises réponses</p>
                <p className="mt-1 text-2xl font-bold text-red-600">{questions.length - score}</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <h3 className="font-semibold text-card-foreground">Résumé des réponses :</h3>
              <div className="space-y-2">
                {answers.map((isCorrect, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border border-border p-3">
                    <span className="text-sm text-muted-foreground">Question {index + 1}</span>
                    {isCorrect ? (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                        <Check className="mr-1 h-3 w-3" />
                        Correct
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                        <X className="mr-1 h-3 w-3" />
                        Incorrect
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button onClick={onRestart} variant="outline" className="bg-transparent">
                <RotateCcw className="mr-2 h-4 w-4" />
                Recommencer
              </Button>
              <Button>
                <Share2 className="mr-2 h-4 w-4" />
                Partager mon score
              </Button>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">
              Question {currentQuestion + 1} sur {questions.length}
            </span>
            <span className="text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8">
          <h2 className="text-balance text-xl font-bold text-card-foreground sm:text-2xl">
            {language === 'en' && question.questionEn ? question.questionEn : question.question}
          </h2>

          {/* Options */}
          <div className="mt-8 space-y-3">
            {(language === 'en' && question.optionsEn ? question.optionsEn : question.options).map((option, index) => {
              const isSelected = selectedAnswer === index
              const isCorrect = index === question.correctAnswerIndex
              const showResult = showExplanation

              let buttonClass = "w-full justify-start text-left p-4 h-auto border-2 transition-all"

              if (showResult) {
                if (isCorrect) {
                  buttonClass += " border-green-500 bg-green-50 dark:bg-green-950"
                } else if (isSelected && !isCorrect) {
                  buttonClass += " border-red-500 bg-red-50 dark:bg-red-950"
                } else {
                  buttonClass += " border-border opacity-50"
                }
              } else {
                buttonClass += " border-border hover:border-primary hover:bg-muted"
              }

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={buttonClass}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-current font-semibold">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="flex-1">{option}</span>
                    {showResult && isCorrect && <Check className="h-5 w-5 text-green-600" />}
                    {showResult && isSelected && !isCorrect && <X className="h-5 w-5 text-red-600" />}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="mt-6 rounded-lg border border-border bg-muted/50 p-4">
              <h3 className="font-semibold text-foreground">{t('quiz.explanation')}:</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {language === 'en' && question.explanationEn ? question.explanationEn : question.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          {showExplanation && (
            <Button onClick={handleNextQuestion} className="mt-6 w-full">
              {currentQuestion < questions.length - 1 ? "Question suivante" : "Voir les résultats"}
            </Button>
          )}
        </Card>
      </div>
    </div>
  )
}
