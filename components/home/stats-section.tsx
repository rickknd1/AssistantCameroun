"use client"

import { useLanguage } from "@/lib/i18n"

export function StatsSection() {
  const { t } = useLanguage()

  const stats = [
    { value: "100+", label: t('home.stats.documents') },
    { value: "1000+", label: t('home.stats.questionsAnswered') },
    { value: "100%", label: t('home.stats.officialSources') },
    { value: "24/7", label: t('home.stats.availability') },
  ]

  return (
    <section className="border-b border-border bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 py-10 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:gap-8 grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">{stat.value}</div>
              <div className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
