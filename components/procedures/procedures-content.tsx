"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Clock, Coins, TrendingUp, FileText, Building2, Home, Car, GraduationCap, Scale } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Procedure } from "@/lib/types/database"

interface ProcedureWithIcon extends Procedure {
  icon: React.ElementType
}

const CATEGORIES = [
  { id: "all", label: "Toutes", icon: FileText },
  { id: "identite", label: "Identité & État civil", icon: FileText },
  { id: "entreprise", label: "Entreprise", icon: Building2 },
  { id: "foncier", label: "Foncier", icon: Home },
  { id: "transport", label: "Transport", icon: Car },
  { id: "education", label: "Éducation", icon: GraduationCap },
  { id: "justice", label: "Justice", icon: Scale },
]

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
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [procedures, setProcedures] = useState<Procedure[]>([])
  const [loading, setLoading] = useState(true)

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
    switch (difficulty) {
      case "Facile":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "Moyen":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
      case "Difficile":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-gradient-to-b from-muted/20 to-background">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
            Guide des démarches administratives
          </h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Toutes les procédures expliquées étape par étape avec les documents requis et les coûts
          </p>

          {/* Search Bar */}
          <div className="relative mt-6">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Rechercher une procédure..."
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
              {filteredProcedures.length} procédure{filteredProcedures.length > 1 ? "s" : ""} disponible
              {filteredProcedures.length > 1 ? "s" : ""}
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
                      <Badge className={getDifficultyColor(procedure.difficulty)}>{procedure.difficulty}</Badge>
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
                      Voir les détails
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
