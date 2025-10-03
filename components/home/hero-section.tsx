"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Search, FileText, Scale, BookOpen, Bot, Building2, Briefcase, GraduationCap, Zap, MessageCircle, Star } from "lucide-react"
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
            <div className="relative h-[120px] sm:h-[150px] lg:h-[600px] w-full max-w-md lg:w-[600px] lg:max-w-none">
              {/* Decorative elements - hidden on mobile for cleaner look */}
              <div className="hidden lg:block absolute left-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              <div className="hidden lg:block absolute bottom-0 right-0 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
              <div className="hidden lg:block absolute right-1/4 top-1/4 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />

              {/* Main illustration */}
              <div className="relative flex h-full items-center justify-center">
                {/* Mobile: Simple Animated Cameroon Flag */}
                <div className="lg:hidden relative z-10 w-[90%]">
                  <div className="relative flex items-center h-24 sm:h-28 rounded-xl overflow-hidden shadow-lg border border-white/10 animate-gentle-float">
                    {/* Green stripe */}
                    <div className="flex-1 h-full bg-[#008751]"></div>

                    {/* Red stripe with star */}
                    <div className="relative flex-1 h-full bg-[#CE1126]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-[#FCD116] animate-subtle-pulse" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                      </div>
                    </div>

                    {/* Yellow stripe */}
                    <div className="flex-1 h-full bg-[#FCD116]"></div>
                  </div>

                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 -m-2 rounded-xl blur-lg bg-gradient-to-r from-[#008751]/20 via-[#CE1126]/20 to-[#FCD116]/20 -z-10"></div>
                </div>

                {/* Desktop: Original illustration */}
                <img
                  src="/cameroon-hero-man.webp"
                  alt="Assistant IA Cameroun"
                  className="hidden lg:block relative z-10 h-full w-full object-contain"
                />
              </div>

              {/* Floating badges - desktop only */}
              <div className="hidden lg:block absolute left-[-60px] top-16 z-20 animate-float rounded-xl border border-green-200 bg-white/90 backdrop-blur-sm p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <Bot className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Chat IA</p>
                    <p className="text-xs text-gray-600">Instantané</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute left-[-40px] top-40 z-20 animate-float-delayed rounded-xl border border-yellow-200 bg-white/90 backdrop-blur-sm p-3 shadow-xl">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">CNI & Passeport</p>
                    <p className="text-xs text-gray-600">En 3 étapes</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute right-[-60px] top-12 z-20 animate-float rounded-xl border border-yellow-200 bg-white/90 backdrop-blur-sm p-3 shadow-xl" style={{animationDelay: '0.4s'}}>
                <div className="flex items-center gap-2">
                  <Scale className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Code Pénal</p>
                    <p className="text-xs text-gray-600">& Civil</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute right-[-50px] top-36 z-20 animate-float-delayed rounded-xl border border-green-200 bg-white/90 backdrop-blur-sm p-3 shadow-xl" style={{animationDelay: '0.6s'}}>
                <div className="flex items-center gap-2">
                  <Building2 className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Création</p>
                    <p className="text-xs text-gray-600">Entreprise</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute right-[-40px] bottom-32 z-20 animate-float rounded-xl border border-green-200 bg-white/90 backdrop-blur-sm p-3 shadow-xl" style={{animationDelay: '0.8s'}}>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">+10K articles</p>
                    <p className="text-xs text-gray-600">Juridiques</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute right-[-60px] bottom-16 z-20 animate-float-delayed rounded-xl border border-yellow-200 bg-white/90 backdrop-blur-sm p-3 shadow-xl" style={{animationDelay: '1s'}}>
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Réponses</p>
                    <p className="text-xs text-gray-600">En 30s</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute left-[-50px] bottom-32 z-20 animate-float rounded-xl border border-red-200 bg-white/90 backdrop-blur-sm p-3 shadow-xl" style={{animationDelay: '1.2s'}}>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Quiz</p>
                    <p className="text-xs text-gray-600">Interactifs</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute left-[-60px] bottom-12 z-20 animate-float-delayed rounded-xl border border-yellow-200 bg-white/90 backdrop-blur-sm p-3 shadow-xl" style={{animationDelay: '1.4s'}}>
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 text-yellow-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">100%</p>
                    <p className="text-xs text-gray-600">Cameroun</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute left-[-70px] top-1/2 -translate-y-1/2 z-20 animate-float rounded-xl border border-green-200 bg-white/90 backdrop-blur-sm p-3 shadow-xl" style={{animationDelay: '1.6s'}}>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Disponible</p>
                    <p className="text-xs text-gray-600">24/7</p>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block absolute right-[-70px] top-1/2 -translate-y-1/2 z-20 animate-float-delayed rounded-xl border border-red-200 bg-white/90 backdrop-blur-sm p-3 shadow-xl" style={{animationDelay: '1.8s'}}>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-red-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Code du</p>
                    <p className="text-xs text-gray-600">Travail</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-2 lg:order-1 flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mx-auto lg:mx-0 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              {t('home.hero.availability')}
            </div>

            <h1 className="mt-4 sm:mt-6 text-balance text-2xl sm:text-4xl font-bold tracking-tight text-foreground lg:text-5xl xl:text-6xl">
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
