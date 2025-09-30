"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, FileText, Scale, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n"

export function HeroSection() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")

  const suggestions = [
    t('home.popularQuestions.q1').split('?')[0] + '?',
    t('home.popularQuestions.q2').split('?')[0] + '?',
    t('home.popularQuestions.q3').split('?')[0] + '?',
    t('home.popularQuestions.q6').split('?')[0] + '?',
  ]

  const quickCategories = [
    {
      icon: FileText,
      label: t('home.quickCategories.procedures'),
      description: t('home.quickCategories.proceduresDesc'),
      href: "/procedures",
      color: "from-primary to-primary/80",
    },
    {
      icon: Scale,
      label: t('home.quickCategories.legal'),
      description: t('home.quickCategories.legalDesc'),
      href: "/assistant?category=juridique",
      color: "from-secondary to-secondary/80",
    },
    {
      icon: BookOpen,
      label: t('home.quickCategories.culture'),
      description: t('home.quickCategories.cultureDesc'),
      href: "/bibliotheque?category=culture",
      color: "from-accent to-accent/80",
    },
  ]

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Mobile: Image first, Desktop: Content first */}
          <div className="order-1 lg:order-2 flex items-center justify-center">
            <div className="relative h-[280px] w-full max-w-md sm:h-[350px] lg:h-[500px]">
              {/* Decorative elements */}
              <div className="absolute left-0 top-0 h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-secondary/10 blur-3xl" />
              <div className="absolute right-1/4 top-1/4 h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-accent/20 blur-2xl" />

              {/* Main illustration */}
              <div className="relative flex h-full items-center justify-center">
                <img
                  src="/modern-african-person-using-tablet-with-ai-assista.jpg"
                  alt="Assistant IA Cameroun"
                  className="relative z-10 h-full w-full object-contain"
                />
              </div>

              {/* Floating cards - hidden on small mobile */}
              <div className="hidden sm:block absolute left-0 top-16 lg:top-20 z-20 animate-float rounded-lg border border-border bg-card p-2.5 sm:p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-1.5 sm:p-2">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-card-foreground">{t('home.hero.floating.cniObtained')}</p>
                    <p className="text-xs text-muted-foreground">{t('home.hero.floating.inSteps')}</p>
                  </div>
                </div>
              </div>

              <div className="hidden sm:block absolute bottom-16 lg:bottom-20 right-0 z-20 animate-float-delayed rounded-lg border border-border bg-card p-2.5 sm:p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-secondary/10 p-1.5 sm:p-2">
                    <Scale className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-card-foreground">{t('home.hero.floating.questionResolved')}</p>
                    <p className="text-xs text-muted-foreground">{t('home.hero.floating.inMinutes')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-2 lg:order-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              {t('home.hero.availability')}
            </div>

            <h1 className="mt-4 sm:mt-6 text-balance text-3xl sm:text-4xl font-bold tracking-tight text-foreground lg:text-5xl xl:text-6xl">
              {t('home.hero.title')}
            </h1>

            <p className="mt-4 sm:mt-6 text-pretty text-base sm:text-lg leading-relaxed text-muted-foreground">
              {t('home.hero.description')}
            </p>

            {/* Search Bar */}
            <div className="mt-6 sm:mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('home.hero.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 sm:h-14 pl-10 sm:pl-11 pr-4 text-base shadow-sm"
                />
              </div>

              {/* Search Suggestions */}
              {searchQuery === "" && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                      onClick={() => setSearchQuery(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Categories */}
            <div className="mt-6 sm:mt-8 grid gap-2.5 sm:gap-3 grid-cols-1 sm:grid-cols-3">
              {quickCategories.map((category) => (
                <Link
                  key={category.label}
                  href={category.href}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card p-3 sm:p-4 transition-all hover:shadow-md active:scale-95"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-5`}
                  />
                  <category.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  <h3 className="mt-1.5 sm:mt-2 text-sm sm:text-base font-semibold text-card-foreground">{category.label}</h3>
                  <p className="mt-0.5 sm:mt-1 text-xs text-muted-foreground">{category.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
