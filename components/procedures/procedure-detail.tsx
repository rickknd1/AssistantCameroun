"use client"

import { CheckCircle2, Clock, Coins, MapPin, FileText, AlertCircle, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"

interface ProcedureDetailProps {
  procedureId: string
}

export function ProcedureDetail({ procedureId }: ProcedureDetailProps) {
  // Mock data - would come from API/database
  const procedure = {
    name: "Carte Nationale d'Identité (CNI)",
    description:
      "La carte nationale d'identité est un document officiel qui permet d'attester de votre identité et de votre nationalité camerounaise.",
    duration: "2-4 semaines",
    cost: "6 000 FCFA",
    difficulty: "Facile",
    steps: [
      {
        title: "Rassembler les documents requis",
        description:
          "Préparez tous les documents nécessaires avant de vous rendre au centre d'enrôlement. Assurez-vous que vos photos sont conformes aux normes.",
      },
      {
        title: "Se rendre au centre d'enrôlement",
        description:
          "Rendez-vous au centre d'enrôlement le plus proche de votre domicile avec tous vos documents. Arrivez tôt pour éviter la foule.",
      },
      {
        title: "Enrôlement biométrique",
        description:
          "L'agent procédera à la prise de vos empreintes digitales et de votre photo. Suivez attentivement les instructions.",
      },
      {
        title: "Paiement des frais",
        description: "Payez les frais d'établissement de la CNI (6 000 FCFA) et conservez votre reçu.",
      },
      {
        title: "Récupération du récépissé",
        description:
          "Vous recevrez un récépissé avec un numéro de suivi. Conservez-le précieusement pour le retrait de votre CNI.",
      },
      {
        title: "Retrait de la CNI",
        description:
          "Après 2 à 4 semaines, vous serez notifié par SMS. Retournez au centre avec votre récépissé pour récupérer votre CNI.",
      },
    ],
    documents: [
      "Acte de naissance (original et photocopie)",
      "2 photos d'identité récentes (4x4 cm, fond blanc)",
      "Justificatif de domicile (facture d'eau, électricité, attestation de résidence)",
      "Ancienne CNI (si renouvellement)",
      "Certificat de nationalité (pour première demande)",
    ],
    costs: [
      { item: "Frais d'établissement", amount: "6 000 FCFA" },
      { item: "Photos d'identité", amount: "500 - 1 000 FCFA" },
      { item: "Photocopies", amount: "200 - 500 FCFA" },
    ],
    locations: [
      "Centre d'enrôlement de Yaoundé - Quartier Bastos",
      "Centre d'enrôlement de Douala - Akwa",
      "Tous les centres d'enrôlement des chefs-lieux de région",
    ],
    tips: [
      "Arrivez tôt le matin pour éviter les longues files d'attente",
      "Vérifiez que vos photos respectent les normes (fond blanc, visage dégagé)",
      "Conservez votre récépissé en lieu sûr",
      "Notez le numéro de suivi pour vérifier l'avancement de votre demande",
      "Prévoyez un délai supplémentaire pendant les périodes de forte affluence",
    ],
    faqs: [
      {
        question: "Quelle est la durée de validité de la CNI ?",
        answer:
          "La carte nationale d'identité camerounaise est valable 10 ans pour les adultes et 5 ans pour les mineurs.",
      },
      {
        question: "Que faire en cas de perte de ma CNI ?",
        answer:
          "En cas de perte, vous devez d'abord faire une déclaration de perte au commissariat, puis demander un duplicata au centre d'enrôlement avec la déclaration de perte.",
      },
      {
        question: "Puis-je faire ma CNI dans une autre région ?",
        answer:
          "Oui, vous pouvez faire votre CNI dans n'importe quel centre d'enrôlement du Cameroun, mais vous devrez fournir un justificatif de domicile de la région concernée.",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/20">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-balance text-3xl font-bold text-foreground">{procedure.name}</h1>
              <p className="mt-2 text-pretty text-muted-foreground">{procedure.description}</p>
            </div>
            <Badge className="shrink-0 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
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
                <p className="font-semibold text-card-foreground">{procedure.cost}</p>
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
                      {index + 1}
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
                    <span className="text-sm text-card-foreground">{location}</span>
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
