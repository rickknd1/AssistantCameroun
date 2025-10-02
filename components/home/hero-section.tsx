"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, FileText, Scale, BookOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/lib/i18n"

export function HeroSection() {
  const { t } = useLanguage()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/assistant?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

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
            <div className="relative h-[220px] w-full max-w-md sm:h-[280px] lg:h-[600px] lg:w-[600px] lg:max-w-none">
              {/* Decorative elements - hidden on mobile for cleaner look */}
              <div className="hidden lg:block absolute left-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              <div className="hidden lg:block absolute bottom-0 right-0 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
              <div className="hidden lg:block absolute right-1/4 top-1/4 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />

              {/* Main illustration */}
              <div className="relative flex h-full items-center justify-center">
                <img
                  src="/cameroon-hero-man.webp"
                  alt="Assistant IA Cameroun"
                  className="relative z-10 h-full w-full object-contain"
                />
              </div>

              {/* Floating cards - desktop only for cleaner mobile */}
              <div className="hidden lg:block absolute left-0 top-20 z-20 animate-float rounded-lg border border-border bg-card p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-card-foreground">{t('home.hero.floating.cniObtained')}</p>
                    <p className="text-xs text-muted-foreground">{t('home.hero.floating.inSteps')}</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute bottom-20 right-0 z-20 animate-float-delayed rounded-lg border border-border bg-card p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-secondary/10 p-2">
                    <Scale className="h-4 w-4 text-secondary" />
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
            <div className="hidden sm:inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              {t('home.hero.availability')}
            </div>

            <h1 className="mt-2 sm:mt-6 text-balance text-2xl sm:text-4xl font-bold tracking-tight text-foreground lg:text-5xl xl:text-6xl">
              {t('home.hero.title')}
            </h1>

            <p className="mt-3 sm:mt-6 text-pretty text-sm sm:text-lg leading-relaxed text-muted-foreground">
              {t('home.hero.description')}
            </p>

            {/* Search Bar */}
            <div className="mt-4 sm:mt-8">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('home.hero.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-11 sm:h-14 pl-10 sm:pl-11 pr-4 text-sm sm:text-base shadow-sm"
                />
              </form>

              {/* Search Suggestions - hidden on mobile for cleaner look */}
              {searchQuery === "" && (
                <div className="mt-2 sm:mt-3 hidden sm:flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="rounded-full border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                      onClick={() => router.push(`/assistant?q=${encodeURIComponent(suggestion)}`)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Categories - simplified on mobile */}
            <div className="mt-4 sm:mt-8 grid gap-2 sm:gap-3 grid-cols-3 sm:grid-cols-3">
              {quickCategories.map((category) => (
                <Link
                  key={category.label}
                  href={category.href}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card p-2.5 sm:p-4 transition-all hover:shadow-md active:scale-95"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-5`}
                  />
                  <category.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary mx-auto sm:mx-0" />
                  <h3 className="mt-1 sm:mt-2 text-xs sm:text-base font-semibold text-card-foreground text-center sm:text-left">{category.label}</h3>
                  <p className="hidden sm:block mt-1 text-xs text-muted-foreground">{category.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
