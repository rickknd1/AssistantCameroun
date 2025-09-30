"use client"

import { useState, useEffect } from "react"
import { Search, Grid3x3, List, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import type { Document } from "@/lib/types/database"
import { useLanguage } from "@/lib/i18n"

export function LibraryContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  const { t } = useLanguage()

  const documentTypes = ["CODE", "LOI", "DÉCRET", "ORDONNANCE"]

  useEffect(() => {
    async function fetchDocuments() {
      setLoading(true)
      const params = new URLSearchParams()

      if (selectedTypes.length > 0) {
        params.append('type', selectedTypes[0]) // API prend un type à la fois
      }
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      if (searchQuery) {
        params.append('search', searchQuery)
      }

      try {
        const res = await fetch(`/api/documents?${params}`)
        const result = await res.json()
        setDocuments(result.data || [])
      } catch (error) {
        console.error('Error fetching documents:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDocuments()
  }, [selectedTypes, selectedCategory, searchQuery])

  const filteredDocuments = documents


  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{t('library.title')}</h1>
          <p className="mt-1.5 sm:mt-2 text-sm sm:text-base text-muted-foreground">{t('library.subtitle')}</p>

          {/* Search and View Toggle */}
          <div className="mt-4 sm:mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder={t('library.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 sm:h-11 pl-9 sm:pl-10 text-base"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
                className="h-10 w-10 sm:h-10 sm:w-10 touch-manipulation shrink-0"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
                className="h-10 w-10 sm:h-10 sm:w-10 touch-manipulation shrink-0"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8 lg:px-8">
        <div className="flex flex-col gap-6 sm:gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64">
            <div className="space-y-4 sm:space-y-6 rounded-lg border border-border bg-card p-4 sm:p-6 lg:sticky lg:top-24">
              <div>
                <h3 className="mb-4 font-semibold text-card-foreground">{t('library.filters.documentType')}</h3>
                <div className="space-y-3">
                  {documentTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedTypes([...selectedTypes, type])
                          } else {
                            setSelectedTypes(selectedTypes.filter((t) => t !== type))
                          }
                        }}
                      />
                      <label htmlFor={type} className="text-sm text-muted-foreground cursor-pointer">
                        {type}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 font-semibold text-card-foreground">{t('library.filters.category')}</h3>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('library.filters.allCategories')}</SelectItem>
                    <SelectItem value="Droit pénal">{t('library.filters.criminalLaw')}</SelectItem>
                    <SelectItem value="Droit civil">{t('library.filters.civilLaw')}</SelectItem>
                    <SelectItem value="Droit du travail">{t('library.filters.laborLaw')}</SelectItem>
                    <SelectItem value="Finances publiques">{t('library.filters.publicFinances')}</SelectItem>
                    <SelectItem value="Protection des données">{t('library.filters.dataProtection')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent touch-manipulation"
                onClick={() => {
                  setSelectedTypes([])
                  setSelectedCategory("all")
                  setSearchQuery("")
                }}
              >
                {t('library.filters.reset')}
              </Button>
            </div>
          </aside>

          {/* Documents Grid/List */}
          <div className="flex-1">
            <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
              {filteredDocuments.length} {t('library.documentsFound')}
            </div>

            {loading ? (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="animate-pulse rounded-lg border border-border bg-card p-4 sm:p-6">
                    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
                {filteredDocuments.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/bibliotheque/${doc.slug}`}
                    className="group rounded-lg border border-border bg-card p-4 sm:p-6 transition-all hover:shadow-lg active:scale-[0.98] touch-manipulation"
                  >
                    <div className="flex items-start justify-between gap-2 sm:gap-4">
                      <Badge variant="secondary" className="shrink-0 text-xs">
                        {doc.type}
                      </Badge>
                      <Badge variant={doc.status === "ACTIVE" ? "default" : "destructive"} className="shrink-0 text-xs">
                        {doc.status === 'ACTIVE' ? t('library.status.active') : t('library.status.repealed')}
                      </Badge>
                    </div>

                    <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-card-foreground group-hover:text-primary">{doc.title}</h3>
                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground">{doc.reference || t('library.noReference')}</p>
                    <p className="mt-2 sm:mt-3 line-clamp-2 text-xs sm:text-sm text-muted-foreground">{doc.summary || doc.content.substring(0, 150) + '...'}</p>

                    <div className="mt-3 sm:mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {doc.dateEnacted ? new Date(doc.dateEnacted).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }) : t('library.unknownDate')}
                      </span>
                      <Button variant="ghost" size="sm" className="h-7 sm:h-8 text-xs sm:text-sm touch-manipulation">
                        {t('library.consult')}
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDocuments.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/bibliotheque/${doc.slug}`}
                    className="group flex items-center gap-6 rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-2">
                      <Badge variant="secondary" className="w-fit">
                        {doc.type}
                      </Badge>
                      <Badge variant={doc.status === "ACTIVE" ? "default" : "destructive"} className="w-fit">
                        {doc.status === 'ACTIVE' ? t('library.status.active') : t('library.status.repealed')}
                      </Badge>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary">{doc.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{doc.reference || t('library.noReference')}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{doc.summary || doc.content.substring(0, 150) + '...'}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-muted-foreground">
                        {doc.dateEnacted ? new Date(doc.dateEnacted).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }) : t('library.unknownDate')}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        {t('library.download')}
                      </Button>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
