'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Share2, ChevronRight, BookOpen, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Document } from '@/lib/types/database'

interface Section {
  id: string
  title: string
  content: string
  reference: string
  level: number
  position: number
}

interface DocumentDetailWithSectionsProps {
  slug: string
}

export function DocumentDetailWithSections({ slug }: DocumentDetailWithSectionsProps) {
  const router = useRouter()
  const [document, setDocument] = useState<Document | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [shareSuccess, setShareSuccess] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Générer l'ID d'ancre à partir de la référence
  const generateAnchorId = (reference: string): string => {
    return reference
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)

        // Charger le document
        const docRes = await fetch(`/api/documents?slug=${slug}`)
        const docResult = await docRes.json()

        if (!docResult.data || docResult.data.length === 0) {
          setError('Document non trouvé')
          return
        }

        const doc = docResult.data[0]
        setDocument(doc)

        // Les sections sont désormais incluses dans la réponse (stockage statique)
        const docSections: Section[] = (doc.sections || [])
          .slice()
          .sort((a: Section, b: Section) => (a.position || 0) - (b.position || 0))
        setSections(docSections)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  // Scroll vers une section spécifique depuis l'URL hash
  useEffect(() => {
    if (sections.length === 0) return
    if (typeof window === 'undefined') return

    const hash = window.location.hash.slice(1) // Retirer le #
    if (!hash) return

    setTimeout(() => {
      const element = window.document.getElementById(hash)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        element.classList.add('highlight-section')
        setTimeout(() => element.classList.remove('highlight-section'), 2000)
      }
    }, 300)
  }, [sections])

  // Observer d'intersection pour le menu latéral actif
  useEffect(() => {
    if (sections.length === 0) return

    let observer: IntersectionObserver | null = null

    // Attendre que le DOM soit complètement rendu
    const timeoutId = setTimeout(() => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSectionId(entry.target.id)
            }
          })
        },
        { rootMargin: '-100px 0px -66%' }
      )

      const sectionElements = window.document.querySelectorAll('[data-section-id]')
      if (sectionElements && sectionElements.length > 0) {
        sectionElements.forEach((el) => observer!.observe(el))
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (observer) observer.disconnect()
    }
  }, [sections])

  const scrollToSection = (anchorId: string) => {
    if (typeof window === 'undefined') return

    const element = window.document.getElementById(anchorId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      window.history.pushState(null, '', `#${anchorId}`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-96 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Document non trouvé</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => router.back()} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </Card>
        </div>
      </div>
    )
  }

  // Organiser les sections hiérarchiquement
  const titles = sections.filter(s => s.level === 0) // Titres (Préambule, Titre I, II, etc.)
  const chapters = sections.filter(s => s.level === 1) // Chapitres
  const articles = sections.filter(s => s.level === 2) // Articles

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    if (navigator.share) {
                      await navigator.share({
                        title: document.title,
                        text: document.summary || document.title,
                        url: window.location.href
                      })
                    } else {
                      await navigator.clipboard.writeText(window.location.href)
                      setShareSuccess(true)
                      setTimeout(() => setShareSuccess(false), 2000)
                    }
                  } catch (error) {
                    console.error('Erreur partage:', error)
                  }
                }}
              >
                {shareSuccess ? (
                  <>
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                    Copié !
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Partager
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  try {
                    setIsDownloading(true)
                    const response = await fetch(`/api/documents/download?slug=${slug}`)
                    if (!response.ok) throw new Error('Erreur téléchargement')
                    const blob = await response.blob()
                    const url = window.URL.createObjectURL(blob)
                    const a = window.document.createElement('a')
                    a.href = url
                    a.download = `${document.slug}.txt`
                    window.document.body.appendChild(a)
                    a.click()
                    window.document.body.removeChild(a)
                    window.URL.revokeObjectURL(url)
                  } catch (error) {
                    console.error('Erreur téléchargement:', error)
                    alert('Erreur lors du téléchargement')
                  } finally {
                    setIsDownloading(false)
                  }
                }}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Téléchargement...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Badge variant="default">{document.type}</Badge>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{document.title}</h1>
              {document.reference && (
                <p className="text-sm text-muted-foreground">{document.reference}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu avec sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar navigation (fixe) */}
          {sections.length > 0 && (
            <aside className="lg:col-span-3">
              <div className="sticky top-4">
                <Card className="p-4">
                  <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Table des matières
                  </h3>
                  <ScrollArea className="h-[calc(100vh-200px)]">
                    <nav className="space-y-1 text-sm">
                      {titles.map((title) => {
                        const titleAnchorId = generateAnchorId(title.reference)
                        const isTitleActive = activeSectionId === titleAnchorId

                        // Trouver les chapitres de ce titre
                        const titleChapters = chapters.filter(ch => ch.position > title.position && ch.position < (titles[titles.indexOf(title) + 1]?.position || Infinity))

                        // Trouver les articles de ce titre (si pas de chapitres)
                        const titleArticles = articles.filter(art => {
                          const nextTitle = titles[titles.indexOf(title) + 1]
                          return art.position > title.position && art.position < (nextTitle?.position || Infinity)
                        })

                        return (
                          <div key={title.id} className="mb-3">
                            {/* Titre principal */}
                            <button
                              onClick={() => scrollToSection(titleAnchorId)}
                              className={`w-full text-left px-3 py-2 rounded-md transition-colors font-semibold ${
                                isTitleActive
                                  ? 'bg-primary text-primary-foreground'
                                  : 'hover:bg-muted text-foreground'
                              }`}
                            >
                              {title.reference}
                            </button>

                            {/* Chapitres de ce titre */}
                            {titleChapters.length > 0 && (
                              <div className="ml-2 mt-1 space-y-1">
                                {titleChapters.map((chapter) => {
                                  const chapterAnchorId = generateAnchorId(chapter.reference)
                                  const isChapterActive = activeSectionId === chapterAnchorId

                                  // Articles de ce chapitre
                                  const chapterArticles = articles.filter(art => {
                                    const nextChapter = titleChapters[titleChapters.indexOf(chapter) + 1]
                                    const nextTitle = titles[titles.indexOf(title) + 1]
                                    const upperBound = nextChapter?.position || nextTitle?.position || Infinity
                                    return art.position > chapter.position && art.position < upperBound
                                  })

                                  return (
                                    <div key={chapter.id}>
                                      <button
                                        onClick={() => scrollToSection(chapterAnchorId)}
                                        className={`w-full text-left px-3 py-1.5 text-xs rounded transition-colors ${
                                          isChapterActive
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'hover:bg-muted text-muted-foreground'
                                        }`}
                                      >
                                        {chapter.reference}
                                      </button>

                                      {/* Articles du chapitre */}
                                      {chapterArticles.length > 0 && (
                                        <div className="ml-3 mt-0.5 space-y-0.5">
                                          {chapterArticles.map((article) => {
                                            const artAnchorId = generateAnchorId(article.reference)
                                            const isArtActive = activeSectionId === artAnchorId

                                            return (
                                              <button
                                                key={article.id}
                                                onClick={() => scrollToSection(artAnchorId)}
                                                className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                                                  isArtActive
                                                    ? 'bg-primary/20 text-primary font-medium'
                                                    : 'hover:bg-muted/50 text-muted-foreground'
                                                }`}
                                              >
                                                {article.reference}
                                              </button>
                                            )
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            )}

                            {/* Articles directs du titre (sans chapitre) */}
                            {titleChapters.length === 0 && titleArticles.length > 0 && (
                              <div className="ml-3 mt-1 space-y-0.5">
                                {titleArticles.map((article) => {
                                  const artAnchorId = generateAnchorId(article.reference)
                                  const isArtActive = activeSectionId === artAnchorId

                                  return (
                                    <button
                                      key={article.id}
                                      onClick={() => scrollToSection(artAnchorId)}
                                      className={`w-full text-left px-2 py-1 text-xs rounded transition-colors ${
                                        isArtActive
                                          ? 'bg-primary/20 text-primary font-medium'
                                          : 'hover:bg-muted/50 text-muted-foreground'
                                      }`}
                                    >
                                      {article.reference}
                                    </button>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </nav>
                  </ScrollArea>
                </Card>
              </div>
            </aside>
          )}

          {/* Contenu principal */}
          <main className={sections.length > 0 ? 'lg:col-span-9' : 'lg:col-span-12'}>
            <Card className="p-6 sm:p-8" ref={contentRef}>
              {sections.length > 0 ? (
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {sections.map((section) => {
                    const anchorId = generateAnchorId(section.reference)

                    return (
                      <div
                        key={section.id}
                        id={anchorId}
                        data-section-id={anchorId}
                        className={`scroll-mt-24 ${
                          section.level === 0 ? 'mb-16 pb-8 border-b-2 border-border' :
                          section.level === 1 ? 'mb-10 pb-4 border-b border-border/50' :
                          'mb-8'
                        }`}
                      >
                        {/* Niveau 0: Titres principaux (Préambule, Titre I, etc.) */}
                        {section.level === 0 && (
                          <>
                            {section.reference && (
                              <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-semibold mb-3">
                                {section.reference}
                              </div>
                            )}
                            <h2 className="text-3xl font-bold text-foreground mb-4">
                              {section.title}
                            </h2>
                          </>
                        )}

                        {/* Niveau 1: Chapitres */}
                        {section.level === 1 && (
                          <>
                            {section.reference && (
                              <div className="inline-block bg-muted text-foreground px-2 py-0.5 rounded text-xs font-medium mb-2">
                                {section.reference}
                              </div>
                            )}
                            <h3 className="text-2xl font-semibold text-foreground mb-3">
                              {section.title}
                            </h3>
                          </>
                        )}

                        {/* Niveau 2: Articles */}
                        {section.level === 2 && (
                          <div className="bg-card border border-border rounded-lg p-4">
                            <h4 className="text-lg font-bold text-primary mb-3 flex items-center gap-2">
                              <span className="bg-primary/10 px-2 py-1 rounded text-sm">
                                {section.reference || section.title}
                              </span>
                              {section.reference && section.title !== section.reference && (
                                <span className="text-base font-normal text-muted-foreground">
                                  {section.title}
                                </span>
                              )}
                            </h4>
                            <div className="text-foreground/90 whitespace-pre-wrap leading-relaxed pl-2 border-l-2 border-primary/20">
                              {section.content}
                            </div>
                          </div>
                        )}

                        {/* Contenu pour niveaux 0 et 1 */}
                        {section.level < 2 && section.content && (
                          <div className="text-foreground/90 whitespace-pre-wrap leading-relaxed mt-3">
                            {section.content}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                // Fallback : affichage classique si pas de sections
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <div className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                    {document.content}
                  </div>
                </div>
              )}
            </Card>
          </main>
        </div>
      </div>

      <style jsx global>{`
        .highlight-section {
          animation: highlight 2s ease-in-out;
        }

        @keyframes highlight {
          0% { background-color: transparent; }
          50% { background-color: hsl(var(--primary) / 0.1); }
          100% { background-color: transparent; }
        }
      `}</style>
    </div>
  )
}
