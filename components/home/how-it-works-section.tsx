"use client"

import { MessageSquare, Brain, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export function HowItWorksSection() {
  const { t } = useLanguage()

  const steps = [
    {
      icon: MessageSquare,
      title: t('home.howItWorks.step1.title'),
      description: t('home.howItWorks.step1.description'),
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Brain,
      title: t('home.howItWorks.step2.title'),
      description: t('home.howItWorks.step2.description'),
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: CheckCircle2,
      title: t('home.howItWorks.step3.title'),
      description: t('home.howItWorks.step3.description'),
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  return (
    <section className="border-b border-border bg-background py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-2xl sm:text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            {t('home.howItWorks.title')}
          </h2>
          <p className="mt-3 sm:mt-4 text-pretty text-base sm:text-lg text-muted-foreground">
            {t('home.howItWorks.subtitle')}
          </p>
        </div>

        <div className="mt-10 sm:mt-14 lg:mt-16 grid gap-8 sm:gap-10 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border md:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                <div className={`flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-2xl ${step.bgColor}`}>
                  <step.icon className={`h-10 w-10 sm:h-12 sm:w-12 ${step.color}`} />
                </div>

                <div className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-foreground text-xs sm:text-sm font-bold text-background">
                  {index + 1}
                </div>

                <h3 className="mt-5 sm:mt-6 text-lg sm:text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 sm:mt-3 text-sm sm:text-base text-pretty text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
