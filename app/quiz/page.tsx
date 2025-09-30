"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { QuizContent } from "@/components/quiz/quiz-content"

export default function QuizPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <QuizContent />
      </main>
      <Footer />
    </div>
  )
}
