"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, FileText, Scale } from "lucide-react"
import { Input } from "@/components/ui/input"
import { QUICK_CATEGORIES } from "@/lib/constants"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions] = useState([
    "Comment obtenir une CNI ?",
    "Créer une entreprise",
    "Obtenir un acte de naissance",
    "Droits du travailleur",
  ])

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left: Content */}
          <div className="flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              Disponible 24/7
            </div>

            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Votre guide intelligent pour naviguer au Cameroun
            </h1>

            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Droit, procédures administratives, culture - Toutes les réponses dont vous avez besoin, alimentées par
              l'intelligence artificielle et des sources officielles vérifiées.
            </p>

            {/* Search Bar */}
            <div className="mt-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Posez votre question ici..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-14 pl-11 pr-4 text-base shadow-sm"
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
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {QUICK_CATEGORIES.map((category) => (
                <Link
                  key={category.label}
                  href={category.href}
                  className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition-all hover:shadow-md"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 transition-opacity group-hover:opacity-5`}
                  />
                  <category.icon className="h-6 w-6 text-primary" />
                  <h3 className="mt-2 font-semibold text-card-foreground">{category.label}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{category.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Illustration */}
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative h-[400px] w-full max-w-md lg:h-[500px]">
              {/* Decorative elements */}
              <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-secondary/10 blur-3xl" />
              <div className="absolute right-1/4 top-1/4 h-24 w-24 rounded-full bg-accent/20 blur-2xl" />

              {/* Main illustration placeholder */}
              <div className="relative flex h-full items-center justify-center">
                <img
                  src="/modern-african-person-using-tablet-with-ai-assista.jpg"
                  alt="Assistant IA Cameroun"
                  className="relative z-10 h-full w-full object-contain"
                />
              </div>

              {/* Floating cards */}
              <div className="absolute left-0 top-20 z-20 animate-float rounded-lg border border-border bg-card p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-primary/10 p-2">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-card-foreground">CNI obtenue</p>
                    <p className="text-xs text-muted-foreground">En 3 étapes</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-20 right-0 z-20 animate-float-delayed rounded-lg border border-border bg-card p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="rounded-md bg-secondary/10 p-2">
                    <Scale className="h-4 w-4 text-secondary" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-card-foreground">Question résolue</p>
                    <p className="text-xs text-muted-foreground">En 2 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
