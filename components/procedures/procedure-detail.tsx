"use client"

import { useState, useEffect } from 'react'
import { CheckCircle2, Clock, Coins, MapPin, FileText, AlertCircle, MessageCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import type { Procedure } from '@/lib/types/database'

interface ProcedureDetailProps {
  slug: string
}

export function ProcedureDetail({ slug }: ProcedureDetailProps) {
  const router = useRouter()
  const [procedure, setProcedure] = useState<Procedure | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchProcedure() {
      try {
        const res = await fetch(`/api/procedures/${slug}`)
        const result = await res.json()
        if (result.data) {
          setProcedure(result.data)
        }
      } catch (error) {
        console.error('Error fetching procedure:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProcedure()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!procedure) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <Card className="p-8 text-center mt-4">
            <h2 className="text-2xl font-bold">Procédure non trouvée</h2>
          </Card>
        </div>
      </div>
    )
  }

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
      {/* Header */}
      <div className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-balance text-3xl font-bold text-foreground">{procedure.name}</h1>
              <p className="mt-2 text-pretty text-muted-foreground">{procedure.description}</p>
            </div>
            <Badge className={getDifficultyColor(procedure.difficulty)}>
              {procedure.difficulty}
            </Badge>
          </div>

          {/* Quick Info */}
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Durée</p>
                <p className="font-semibold text-card-foreground">{procedure.duration}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
              <Coins className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Coût</p>
                <p className="font-semibold text-card-foreground">
                  {procedure.costs[0]?.amount || 'Variable'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Documents</p>
                <p className="font-semibold text-card-foreground">{procedure.documents.length} requis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Steps Timeline */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Étapes à suivre</h2>
            <div className="mt-6 space-y-4">
              {procedure.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {step.step}
                    </div>
                    {index < procedure.steps.length - 1 && <div className="mt-2 h-full w-0.5 bg-border" />}
                  </div>
                  <div className="flex-1 pb-8">
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Documents Required */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Documents requis</h2>
            <Card className="mt-4 p-6">
              <ul className="space-y-3">
                {procedure.documents.map((doc, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm text-card-foreground">{doc}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Costs */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Coûts détaillés</h2>
            <Card className="mt-4 overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Élément</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-foreground">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {procedure.costs.map((cost, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 text-sm text-card-foreground">{cost.item}</td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-card-foreground">{cost.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </section>

          {/* Locations */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Où s'adresser</h2>
            <Card className="mt-4 p-6">
              <ul className="space-y-3">
                {procedure.locations.map((location, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-card-foreground">{location.name}</p>
                      <p className="text-sm text-muted-foreground">{location.address}</p>
                      <p className="text-xs text-muted-foreground">{location.hours}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* Tips */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Conseils pratiques</h2>
            <Card className="mt-4 p-6">
              <ul className="space-y-3">
                {procedure.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
                    <span className="text-sm text-card-foreground">{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </section>

          {/* FAQs */}
          <section>
            <h2 className="text-2xl font-bold text-foreground">Questions fréquentes</h2>
            <Accordion type="single" collapsible className="mt-4">
              {procedure.faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* CTA */}
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8 text-center">
            <h3 className="text-xl font-bold text-foreground">Besoin d'aide supplémentaire ?</h3>
            <p className="mt-2 text-muted-foreground">
              Posez vos questions à notre assistant intelligent pour obtenir des réponses personnalisées
            </p>
            <Button asChild className="mt-4">
              <Link href="/assistant">
                <MessageCircle className="mr-2 h-4 w-4" />
                Parler à l'assistant
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  )
}