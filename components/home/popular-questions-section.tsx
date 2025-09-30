"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n"

export function PopularQuestionsSection() {
  const { t } = useLanguage()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const questions = [
    {
      question: t('home.popularQuestions.q1'),
      category: t('home.popularQuestions.category.identity'),
      answer: t('home.popularQuestions.q1.answer'),
    },
    {
      question: t('home.popularQuestions.q2'),
      category: t('home.popularQuestions.category.business'),
      answer: t('home.popularQuestions.q2.answer'),
    },
    {
      question: t('home.popularQuestions.q3'),
      category: t('home.popularQuestions.category.civilStatus'),
      answer: t('home.popularQuestions.q3.answer'),
    },
    {
      question: t('home.popularQuestions.q4'),
      category: t('home.popularQuestions.category.identity'),
      answer: t('home.popularQuestions.q4.answer'),
    },
    {
      question: t('home.popularQuestions.q5'),
      category: t('home.popularQuestions.category.land'),
      answer: t('home.popularQuestions.q5.answer'),
    },
    {
      question: t('home.popularQuestions.q6'),
      category: t('home.popularQuestions.category.work'),
      answer: t('home.popularQuestions.q6.answer'),
    },
    {
      question: t('home.popularQuestions.q7'),
      category: t('home.popularQuestions.category.justice'),
      answer: t('home.popularQuestions.q7.answer'),
    },
    {
      question: t('home.popularQuestions.q8'),
      category: t('home.popularQuestions.category.justice'),
      answer: t('home.popularQuestions.q8.answer'),
    },
  ]

  return (
    <section className="border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t('home.popularQuestions.title')}
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            {t('home.popularQuestions.subtitle')}
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {questions.map((item, index) => (
            <div key={index} className="overflow-hidden rounded-lg border border-border bg-card">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">{item.question}</h3>
                  <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {item.category}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="border-t border-border bg-muted/30 p-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">{item.answer}</p>
                  <Button asChild size="sm" variant="outline" className="mt-4 bg-transparent">
                    <Link href={`/assistant?q=${encodeURIComponent(item.question)}`}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      {t('home.popularQuestions.askAssistant')}
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
