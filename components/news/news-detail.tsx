'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, ExternalLink, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { NewsArticle } from '@/lib/types/database'
import { useLanguage } from '@/lib/i18n'

interface NewsDetailProps {
  slug: string
}

export function NewsDetail({ slug }: NewsDetailProps) {
  const router = useRouter()
  const { language, t } = useLanguage()
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchArticle() {
      try {
        setLoading(true)
        const res = await fetch(`/api/news?slug=${encodeURIComponent(slug)}`)
        const result = await res.json()

        if (result.data && result.data.length > 0) {
          setArticle(result.data[0])
        } else {
          setError('Article non trouvé')
        }
      } catch (err) {
        console.error('Error fetching article:', err)
        setError('Erreur lors du chargement de l\'article')
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-muted rounded mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">Article non trouvé</h2>
            <p className="text-muted-foreground">{error || 'Cet article n\'existe pas ou a été supprimé.'}</p>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
          </div>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex gap-2 mb-3">
                <Badge variant="secondary">{article.category}</Badge>
                {article.isFeatured && (
                  <Badge variant="default">À la une</Badge>
                )}
              </div>
              <h1 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
                {language === 'en' && article.titleEn ? article.titleEn : article.title}
              </h1>
              {(article.summary || article.summaryEn) && (
                <p className="mt-4 text-lg text-muted-foreground">
                  {language === 'en' && article.summaryEn ? article.summaryEn : article.summary}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {article.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            )}
            {article.source && (
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4" />
                <span>{article.source}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {article.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-lg">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <Card className="p-6">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {language === 'en' && article.contentEn ? article.contentEn : article.content}
            </div>
          </div>
        </Card>

        {article.tags && article.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Mots-clés</h3>
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {article.url && (
          <div className="mt-6">
            <Button asChild variant="outline">
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Voir la source originale
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}