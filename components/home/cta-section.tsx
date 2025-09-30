"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/lib/i18n"

export function CtaSection() {
  const { t } = useLanguage()

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-28">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          {t('home.cta.badge')}
        </div>

        <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          {t('home.cta.title')}
        </h2>

        <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
          {t('home.cta.description')}
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg">
            <Link href="/assistant">
              {t('home.cta.talkToAssistant')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent">
            <Link href="/procedures">{t('home.cta.exploreProcedures')}</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">{t('home.cta.features')}</p>
      </div>
    </section>
  )
}
