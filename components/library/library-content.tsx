"use client"

import { useState } from "react"
import { Search, Grid3x3, List, Download } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

interface Document {
  id: string
  type: "CODE" | "LOI" | "DÉCRET" | "ORDONNANCE"
  title: string
  reference: string
  date: string
  category: string
  description: string
  status: "Actif" | "Abrogé"
}

const MOCK_DOCUMENTS: Document[] = [
  {
    id: "1",
    type: "CODE",
    title: "Code Pénal",
    reference: "Loi N° 2016/007 du 12 juillet 2016",
    date: "2016-07-12",
    category: "Droit pénal",
    description: "Code pénal camerounais définissant les infractions et les peines applicables",
    status: "Actif",
  },
  {
    id: "2",
    type: "CODE",
    title: "Code du Travail",
    reference: "Loi N° 92/007 du 14 août 1992",
    date: "1992-08-14",
    category: "Droit du travail",
    description: "Réglementation des relations de travail au Cameroun",
    status: "Actif",
  },
  {
    id: "3",
    type: "LOI",
    title: "Loi portant régime financier de l'État",
    reference: "Loi N° 2018/012 du 11 juillet 2018",
    date: "2018-07-11",
    category: "Finances publiques",
    description: "Loi définissant le régime financier de l'État et des collectivités territoriales",
    status: "Actif",
  },
  {
    id: "4",
    type: "DÉCRET",
    title: "Décret portant organisation du Ministère de la Justice",
    reference: "Décret N° 2011/408 du 09 décembre 2011",
    date: "2011-12-09",
    category: "Organisation administrative",
    description: "Organisation et fonctionnement du Ministère de la Justice",
    status: "Actif",
  },
  {
    id: "5",
    type: "CODE",
    title: "Code Civil",
    reference: "Loi N° 81/02 du 29 juin 1981",
    date: "1981-06-29",
    category: "Droit civil",
    description: "Code civil camerounais régissant les personnes, les biens et les obligations",
    status: "Actif",
  },
  {
    id: "6",
    type: "LOI",
    title: "Loi portant protection des données à caractère personnel",
    reference: "Loi N° 2019/020 du 24 décembre 2019",
    date: "2019-12-24",
    category: "Protection des données",
    description: "Protection des données personnelles et de la vie privée",
    status: "Actif",
  },
]

export function LibraryContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState("all")

  const documentTypes = ["CODE", "LOI", "DÉCRET", "ORDONNANCE"]

  const filteredDocuments = MOCK_DOCUMENTS.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.reference.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(doc.type)
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory

    return matchesSearch && matchesType && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Bibliothèque Juridique</h1>
          <p className="mt-2 text-muted-foreground">Accédez à tous les documents juridiques officiels du Cameroun</p>

          {/* Search and View Toggle */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Rechercher un document..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-64">
            <div className="sticky top-24 space-y-6 rounded-lg border border-border bg-card p-6">
              <div>
                <h3 className="mb-4 font-semibold text-card-foreground">Type de document</h3>
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
                <h3 className="mb-4 font-semibold text-card-foreground">Catégorie</h3>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="Droit pénal">Droit pénal</SelectItem>
                    <SelectItem value="Droit civil">Droit civil</SelectItem>
                    <SelectItem value="Droit du travail">Droit du travail</SelectItem>
                    <SelectItem value="Finances publiques">Finances publiques</SelectItem>
                    <SelectItem value="Protection des données">Protection des données</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setSelectedTypes([])
                  setSelectedCategory("all")
                  setSearchQuery("")
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </aside>

          {/* Documents Grid/List */}
          <div className="flex-1">
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredDocuments.length} document{filteredDocuments.length > 1 ? "s" : ""} trouvé
              {filteredDocuments.length > 1 ? "s" : ""}
            </div>

            {viewMode === "grid" ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {filteredDocuments.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`/bibliotheque/${doc.id}`}
                    className="group rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <Badge variant="secondary" className="shrink-0">
                        {doc.type}
                      </Badge>
                      <Badge variant={doc.status === "Actif" ? "default" : "destructive"} className="shrink-0">
                        {doc.status}
                      </Badge>
                    </div>

                    <h3 className="mt-4 font-semibold text-card-foreground group-hover:text-primary">{doc.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{doc.reference}</p>
                    <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{doc.description}</p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(doc.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <Button variant="ghost" size="sm" className="h-8">
                        Consulter
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
                    href={`/bibliotheque/${doc.id}`}
                    className="group flex items-center gap-6 rounded-lg border border-border bg-card p-6 transition-all hover:shadow-lg"
                  >
                    <div className="flex flex-col gap-2">
                      <Badge variant="secondary" className="w-fit">
                        {doc.type}
                      </Badge>
                      <Badge variant={doc.status === "Actif" ? "default" : "destructive"} className="w-fit">
                        {doc.status}
                      </Badge>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-card-foreground group-hover:text-primary">{doc.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{doc.reference}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{doc.description}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(doc.date).toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Télécharger
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
