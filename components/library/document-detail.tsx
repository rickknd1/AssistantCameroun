'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Download, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import type { Document } from '@/lib/types/database'

interface DocumentDetailProps {
  slug: string
}

export function DocumentDetail({ slug }: DocumentDetailProps) {
  const router = useRouter()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDocument() {
      try {
        setLoading(true)
        const res = await fetch(`/api/documents?slug=${slug}`)
        const result = await res.json()

        if (result.data && result.data.length > 0) {
          setDocument(result.data[0])
        } else {
          setError('Document non trouvé')
        }
      } catch (err) {
        console.error('Error fetching document:', err)
        setError('Erreur lors du chargement du document')
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
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

  if (error || !document) {
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
            <h2 className="text-2xl font-bold text-foreground mb-2">Document non trouvé</h2>
            <p className="text-muted-foreground">{error || 'Ce document n\'existe pas ou a été supprimé.'}</p>
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
                <Badge variant="secondary">{document.type}</Badge>
                <Badge variant={document.status === 'ACTIVE' ? 'default' : 'destructive'}>
                  {document.status === 'ACTIVE' ? 'Actif' : 'Abrogé'}
                </Badge>
              </div>
              <h1 className="text-balance text-3xl font-bold text-foreground sm:text-4xl">
                {document.title}
              </h1>
              {document.reference && (
                <p className="mt-2 text-muted-foreground">{document.reference}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Partager
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-semibold">Catégorie:</span> {document.category}
            </div>
            {document.dateEnacted && (
              <div>
                <span className="font-semibold">Date d'adoption:</span>{' '}
                {new Date(document.dateEnacted).toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </div>
            )}
            <div>
              <span className="font-semibold">Source:</span> {document.source}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {document.summary && (
          <Card className="mb-8 p-6 bg-primary/5">
            <h2 className="text-lg font-semibold mb-3">Résumé</h2>
            <p className="text-muted-foreground">{document.summary}</p>
          </Card>
        )}

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Contenu</h2>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <div className="whitespace-pre-wrap text-sm leading-relaxed">
              {document.content}
            </div>
          </div>
        </Card>

        {document.tags && document.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-semibold mb-3">Mots-clés</h3>
            <div className="flex flex-wrap gap-2">
              {document.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}