"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Clock, Coins, TrendingUp, FileText, Building2, Home, Car, GraduationCap, Scale } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Procedure } from "@/lib/types/database"
import { useLanguage } from "@/lib/i18n"

interface ProcedureWithIcon extends Procedure {
  icon: React.ElementType
}

const getCategoryIcon = (category: string): React.ElementType => {
  switch (category) {
    case "identite":
      return FileText
    case "entreprise":
      return Building2
    case "foncier":
      return Home
    case "transport":
      return Car
    case "education":
      return GraduationCap
    case "justice":
      return Scale
    default:
      return FileText
  }
}

export function ProceduresContent() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loading, setLoading] = useState(true)

  const CATEGORIES = [
    { id: "all", label: t('procedures.category.all'), icon: FileText },
    { id: "identite", label: t('procedures.category.identity'), icon: FileText },
    { id: "entreprise", label: t('procedures.category.business'), icon: Building2 },
    { id: "foncier", label: t('procedures.category.land'), icon: Home },
    { id: "transport", label: t('procedures.category.transport'), icon: Car },
    { id: "education", label: t('procedures.category.education'), icon: GraduationCap },
    { id: "justice", label: t('procedures.category.justice'), icon: Scale },
  ]

  useEffect(() => {
    async function fetchProcedures() {
      setLoading(true)
      const params = new URLSearchParams()

      if (activeCategory !== "all") {
        params.append("category", activeCategory)
      }
      if (searchQuery) {
        params.append("search", searchQuery)
      }

      try {
        const res = await fetch(`/api/procedures?${params}`)
        const result = await res.json()
        setProcedures(result.data || [])
      } catch (error) {
        console.error("Error fetching procedures:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProcedures()
  }, [activeCategory, searchQuery])

  const proceduresWithIcons: ProcedureWithIcon[] = procedures.map((proc) => ({
    ...proc,
    icon: getCategoryIcon(proc.category),
  }))

  const filteredProcedures = proceduresWithIcons

  const getDifficultyColor = (difficulty: string) => {
    const easyLabel = t('procedures.difficulty.easy')
    const mediumLabel = t('procedures.difficulty.medium')
    const hardLabel = t('procedures.difficulty.hard')

    switch (difficulty) {
      case "Facile":
      case easyLabel:
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "Moyen":
      case mediumLabel:
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
      case "Difficile":
      case hardLabel:
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return ""
    }
  }

  const translateDifficulty = (difficulty: string) => {
    switch (difficulty) {
      case "Facile":
        return t('procedures.difficulty.easy')
      case "Moyen":
        return t('procedures.difficulty.medium')
      case "Difficile":
        return t('procedures.difficulty.hard')
      default:
        return difficulty
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-b from-muted/20 to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            {t('procedures.title')}
          </h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            {t('procedures.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('procedures.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-8 flex w-full flex-wrap justify-start gap-2 bg-transparent">
            {CATEGORIES.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <category.icon className="h-4 w-4" />
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0">
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredProcedures.length} {t('procedures.available')}
            </div>

            {loading ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse rounded-lg border border-border bg-card p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="h-12 w-12 bg-muted rounded-lg"></div>
                      <div className="h-6 w-16 bg-muted rounded"></div>
                    </div>
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProcedures.map((procedure) => (
                  <Link
                    key={procedure.id}
                    href={`/procedures/${procedure.slug}`}
                    className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                        <procedure.icon className="h-6 w-6 text-primary" />
                      </div>
                      <Badge className={getDifficultyColor(procedure.difficulty)}>{translateDifficulty(procedure.difficulty)}</Badge>
                    </div>

                    <h3 className="mt-4 font-semibold text-card-foreground group-hover:text-primary">{procedure.name}</h3>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{procedure.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Coins className="h-4 w-4" />
                        <span>{procedure.costs[0]?.amount || "Variable"}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                      {t('procedures.viewDetails')}
                      <TrendingUp className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
