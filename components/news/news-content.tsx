"use client"

import { useState } from "react"
import { Calendar, Clock, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface Article {
  id: string
  title: string
  summary: string
  category: string
  date: string
  source: string
  readTime: string
  image: string
  featured?: boolean
}

const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Nouvelle loi sur la protection des données personnelles entre en vigueur",
    summary:
      "Le gouvernement camerounais a annoncé l'entrée en vigueur de la nouvelle loi sur la protection des données personnelles, renforçant les droits des citoyens en matière de vie privée.",
    category: "Juridique",
    date: "2024-01-15",
    source: "Ministère de la Justice",
    readTime: "5 min",
    image: "/cameroon-government-building.jpg",
    featured: true,
  },
  {
    id: "2",
    title: "Simplification des procédures d'obtention de la CNI",
    summary:
      "Les centres d'enrôlement annoncent une réduction des délais de traitement des demandes de carte nationale d'identité grâce à la digitalisation.",
    category: "Administratif",
    date: "2024-01-12",
    source: "DGSN",
    readTime: "3 min",
    image: "/cameroon-id-card-digital.jpg",
  },
  {
    id: "3",
    title: "Réforme du Code du Travail : ce qui change pour les employeurs",
    summary:
      "Le nouveau Code du Travail introduit des modifications importantes concernant les contrats de travail et les conditions de licenciement.",
    category: "Juridique",
    date: "2024-01-10",
    source: "Ministère du Travail",
    readTime: "7 min",
    image: "/cameroon-workers-office.jpg",
  },
  {
    id: "4",
    title: "Lancement du guichet unique pour la création d'entreprises",
    summary:
      "Un nouveau guichet unique permet désormais de créer son entreprise en une seule journée, simplifiant considérablement les démarches administratives.",
    category: "Entreprise",
    date: "2024-01-08",
    source: "APME",
    readTime: "4 min",
    image: "/cameroon-business-startup.jpg",
  },
  {
    id: "5",
    title: "Nouveau système de paiement électronique des taxes foncières",
    summary:
      "Les propriétaires peuvent maintenant payer leurs taxes foncières en ligne via mobile money, facilitant ainsi les transactions.",
    category: "Foncier",
    date: "2024-01-05",
    source: "Direction des Impôts",
    readTime: "3 min",
    image: "/mobile-payment-cameroon.jpg",
  },
  {
    id: "6",
    title: "Campagne de sensibilisation sur les droits des consommateurs",
    summary:
      "Le Ministère du Commerce lance une vaste campagne pour informer les citoyens de leurs droits en tant que consommateurs.",
    category: "Social",
    date: "2024-01-03",
    source: "Ministère du Commerce",
    readTime: "4 min",
    image: "/cameroon-consumer-rights.jpg",
  },
]

const CATEGORIES = ["Tous", "Juridique", "Administratif", "Entreprise", "Foncier", "Social"]

export function NewsContent() {
  const [activeCategory, setActiveCategory] = useState("Tous")
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 6

  const filteredArticles = MOCK_ARTICLES.filter(
    (article) => activeCategory === "Tous" || article.category === activeCategory,
  )

  const featuredArticle = filteredArticles.find((article) => article.featured)
  const regularArticles = filteredArticles.filter((article) => !article.featured)

  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = regularArticles.slice(indexOfFirstArticle, indexOfLastArticle)
  const totalPages = Math.ceil(regularArticles.length / articlesPerPage)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Actualités</h1>
          <p className="mt-2 text-muted-foreground">
            Restez informé des dernières nouvelles juridiques et administratives du Cameroun
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="mb-8 flex w-full flex-wrap justify-start gap-2 bg-transparent">
            {CATEGORIES.map((category) => (
              <TabsTrigger
                key={category}
                value={category}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={activeCategory} className="mt-0 space-y-8">
            {/* Featured Article */}
            {featuredArticle && (
              <Link
                href={`/actualites/${featuredArticle.id}`}
                className="group relative block overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="relative h-64 lg:h-full">
                    <img
                      src={featuredArticle.image || "/placeholder.svg"}
                      alt={featuredArticle.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute left-4 top-4">{featuredArticle.category}</Badge>
                  </div>

                  <div className="flex flex-col justify-center p-6 lg:p-8">
                    <Badge variant="secondary" className="w-fit">
                      À la une
                    </Badge>
                    <h2 className="mt-4 text-balance text-2xl font-bold text-card-foreground group-hover:text-primary lg:text-3xl">
                      {featuredArticle.title}
                    </h2>
                    <p className="mt-4 text-pretty text-muted-foreground">{featuredArticle.summary}</p>

                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(featuredArticle.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{featuredArticle.readTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ExternalLink className="h-4 w-4" />
                        <span>{featuredArticle.source}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Regular Articles Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {currentArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/actualites/${article.id}`}
                  className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={article.image || "/placeholder.svg"}
                      alt={article.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                    <Badge className="absolute left-4 top-4">{article.category}</Badge>
                  </div>

                  <div className="p-6">
                    <h3 className="line-clamp-2 text-balance font-semibold text-card-foreground group-hover:text-primary">
                      {article.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{article.summary}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(article.date).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{article.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-transparent"
                >
                  Précédent
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className={currentPage !== page ? "bg-transparent" : ""}
                    >
                      {page}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-transparent"
                >
                  Suivant
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
