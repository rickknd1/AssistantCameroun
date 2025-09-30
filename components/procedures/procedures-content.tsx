"use client"

import type React from "react"

import { useState } from "react"
import { Search, Clock, Coins, TrendingUp, FileText, Building2, Home, Car, GraduationCap, Scale } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Procedure {
  id: string
  name: string
  category: string
  duration: string
  cost: string
  difficulty: "Facile" | "Moyen" | "Difficile"
  icon: React.ElementType
}

const PROCEDURES: Procedure[] = [
  {
    id: "cni",
    name: "Carte Nationale d'Identité (CNI)",
    category: "identite",
    duration: "2-4 semaines",
    cost: "6 000 FCFA",
    difficulty: "Facile",
    icon: FileText,
  },
  {
    id: "passeport",
    name: "Passeport ordinaire",
    category: "identite",
    duration: "3-6 semaines",
    cost: "75 000 FCFA",
    difficulty: "Moyen",
    icon: FileText,
  },
  {
    id: "acte-naissance",
    name: "Acte de naissance",
    category: "identite",
    duration: "1-2 jours",
    cost: "1 000 FCFA",
    difficulty: "Facile",
    icon: FileText,
  },
  {
    id: "creation-entreprise",
    name: "Création d'entreprise",
    category: "entreprise",
    duration: "2-4 semaines",
    cost: "50 000 - 200 000 FCFA",
    difficulty: "Difficile",
    icon: Building2,
  },
  {
    id: "registre-commerce",
    name: "Inscription au registre du commerce",
    category: "entreprise",
    duration: "1-2 semaines",
    cost: "25 000 FCFA",
    difficulty: "Moyen",
    icon: Building2,
  },
  {
    id: "titre-foncier",
    name: "Demande de titre foncier",
    category: "foncier",
    duration: "6-12 mois",
    cost: "Variable",
    difficulty: "Difficile",
    icon: Home,
  },
  {
    id: "permis-construire",
    name: "Permis de construire",
    category: "foncier",
    duration: "2-3 mois",
    cost: "50 000 - 150 000 FCFA",
    difficulty: "Moyen",
    icon: Home,
  },
  {
    id: "permis-conduire",
    name: "Permis de conduire",
    category: "transport",
    duration: "3-6 mois",
    cost: "150 000 - 250 000 FCFA",
    difficulty: "Moyen",
    icon: Car,
  },
  {
    id: "carte-grise",
    name: "Carte grise (certificat d'immatriculation)",
    category: "transport",
    duration: "1-2 semaines",
    cost: "25 000 FCFA",
    difficulty: "Facile",
    icon: Car,
  },
  {
    id: "inscription-universite",
    name: "Inscription à l'université",
    category: "education",
    duration: "Variable",
    cost: "50 000 - 500 000 FCFA",
    difficulty: "Moyen",
    icon: GraduationCap,
  },
  {
    id: "plainte-commissariat",
    name: "Dépôt de plainte au commissariat",
    category: "justice",
    duration: "1 jour",
    cost: "Gratuit",
    difficulty: "Facile",
    icon: Scale,
  },
]

const CATEGORIES = [
  { id: "all", label: "Toutes", icon: FileText },
  { id: "identite", label: "Identité & État civil", icon: FileText },
  { id: "entreprise", label: "Entreprise", icon: Building2 },
  { id: "foncier", label: "Foncier", icon: Home },
  { id: "transport", label: "Transport", icon: Car },
  { id: "education", label: "Éducation", icon: GraduationCap },
  { id: "justice", label: "Justice", icon: Scale },
]

export function ProceduresContent() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredProcedures = PROCEDURES.filter((proc) => {
    const matchesSearch = proc.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === "all" || proc.category === activeCategory
    return matchesSearch && matchesCategory
  })

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

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProcedures.map((procedure) => (
                <Link
                  key={procedure.id}
                  href={`/procedures/${procedure.id}`}
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
                      <span>{procedure.cost}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary">
                    Voir les détails
                    <TrendingUp className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
