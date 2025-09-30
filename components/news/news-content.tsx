"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { NewsArticle } from "@/lib/types/database"
import { useLanguage } from "@/lib/i18n"

export function NewsContent() {
  const { t, language } = useLanguage()
  const [activeCategory, setActiveCategory] = useState("Tous")

  const CATEGORIES = [
    t('news.category.all'),
    t('news.category.legal'),
    t('news.category.administrative'),
    t('news.category.business'),
    t('news.category.land'),
    t('news.category.social'),
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)
  const articlesPerPage = 6

  // Map displayed category to database category
  const getCategoryForAPI = (displayCategory: string) => {
    const mapping: Record<string, string> = {
      "Tous": "Tous",
      "All": "Tous",
      "Juridique": "Juridique",
      "Legal": "Juridique",
      "Administratif": "Administratif",
      "Administrative": "Administratif",
      "Entreprise": "Entreprise",
      "Business": "Entreprise",
      "Foncier": "Foncier",
      "Land": "Foncier",
      "Social": "Social",
    }
    return mapping[displayCategory] || displayCategory
  }

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      const params = new URLSearchParams()

      const apiCategory = getCategoryForAPI(activeCategory)
      if (apiCategory !== "Tous") {
        params.append("category", apiCategory)
      }

      try {
        const res = await fetch(`/api/news?${params}`)
        const result = await res.json()
        setArticles(result.data || [])
      } catch (error) {
        console.error("Error fetching articles:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchArticles()
  }, [activeCategory])

  // Générer les slugs à partir des titres
  const articlesWithSlugs = articles.map(article => ({
    ...article,
    slug: article.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }))

  const filteredArticles = articlesWithSlugs

  const featuredArticle = filteredArticles.find((article) => article.isFeatured)
  const regularArticles = filteredArticles.filter((article) => !article.isFeatured)

  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = regularArticles.slice(indexOfFirstArticle, indexOfLastArticle)
  const totalPages = Math.ceil(regularArticles.length / articlesPerPage)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">{t('news.title')}</h1>
          <p className="mt-2 text-muted-foreground">
            {t('news.subtitle')}
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
            {loading ? (
              <div className="space-y-8">
                <div className="animate-pulse rounded-xl border border-border bg-card h-64"></div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse rounded-lg border border-border bg-card">
                      <div className="h-48 bg-muted"></div>
                      <div className="p-6 space-y-3">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-3 bg-muted rounded w-full"></div>
                        <div className="h-3 bg-muted rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {/* Featured Article */}
                {featuredArticle && (
                  <Link
                    href={`/actualites/${featuredArticle.slug}`}
                    className="group relative block overflow-hidden rounded-xl border border-border bg-card"
                  >
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="relative h-64 lg:h-full">
                        <img
                          src={featuredArticle.imageUrl || "/placeholder.svg"}
                          alt={featuredArticle.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <Badge className="absolute left-4 top-4">{featuredArticle.category}</Badge>
                      </div>

                      <div className="flex flex-col justify-center p-6 lg:p-8">
                        <Badge variant="secondary" className="w-fit">
                          {t('news.featured')}
                        </Badge>
                        <h2 className="mt-4 text-balance text-2xl font-bold text-card-foreground group-hover:text-primary lg:text-3xl">
                          {language === 'en' && featuredArticle.titleEn ? featuredArticle.titleEn : featuredArticle.title}
                        </h2>
                        <p className="mt-4 text-pretty text-muted-foreground">
                          {language === 'en' && featuredArticle.summaryEn ? featuredArticle.summaryEn : featuredArticle.summary}
                        </p>

                        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {featuredArticle.publishedAt
                                ? new Date(featuredArticle.publishedAt).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </span>
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
                      href={`/actualites/${article.slug}`}
                      className="group overflow-hidden rounded-lg border border-border bg-card transition-all hover:shadow-lg"
                    >
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={article.imageUrl || "/placeholder.svg"}
                          alt={article.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                        <Badge className="absolute left-4 top-4">{article.category}</Badge>
                      </div>

                      <div className="p-6">
                        <h3 className="line-clamp-2 text-balance font-semibold text-card-foreground group-hover:text-primary">
                          {language === 'en' && article.titleEn ? article.titleEn : article.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                          {language === 'en' && article.summaryEn ? article.summaryEn : article.summary}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {article.publishedAt
                                ? new Date(article.publishedAt).toLocaleDateString("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                  })
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-transparent"
                >
                  {t('news.previous')}
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
                  {t('news.next')}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
