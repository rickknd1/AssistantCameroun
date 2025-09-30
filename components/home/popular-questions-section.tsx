"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { POPULAR_QUESTIONS } from "@/lib/constants"

export function PopularQuestionsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const answers: Record<number, string> = {
    0: "Pour obtenir votre carte nationale d'identité, vous devez vous rendre au centre d'enrôlement le plus proche avec un acte de naissance, deux photos d'identité récentes, et un justificatif de domicile. Le processus prend généralement 2 à 4 semaines.",
    1: "Pour créer une entreprise au Cameroun, vous aurez besoin d'un certificat de domiciliation, d'une copie de votre CNI, des statuts de l'entreprise, et d'un formulaire M0 dûment rempli. Le coût varie selon le type d'entreprise.",
    2: "L'acte de naissance s'obtient au centre d'état civil de votre commune de naissance. Vous devez présenter une pièce d'identité et payer les frais administratifs (environ 1000 FCFA).",
    3: "Pour obtenir un passeport, rendez-vous au centre de production des titres sécurisés avec votre CNI, un acte de naissance, deux photos, et un justificatif de paiement des frais (75 000 FCFA pour un passeport ordinaire).",
    4: "La demande de titre foncier se fait auprès des services du cadastre. Vous devez fournir un plan de localisation, une attestation de propriété, et suivre une procédure d'immatriculation qui peut prendre plusieurs mois.",
    5: "En tant que travailleur au Cameroun, vous avez droit à un salaire minimum garanti, des congés payés, une protection contre le licenciement abusif, et des conditions de travail décentes selon le Code du Travail.",
    6: "Pour porter plainte, rendez-vous au commissariat le plus proche avec votre pièce d'identité. Expliquez les faits, l'agent prendra votre déposition et vous remettra un récépissé de dépôt de plainte.",
    7: "La procédure de divorce au Cameroun peut être par consentement mutuel ou contentieuse. Elle nécessite l'assistance d'un avocat et se déroule devant le tribunal de première instance. La durée varie de 6 mois à plusieurs années.",
  }

  return (
    <section className="border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Questions populaires
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Les questions les plus fréquemment posées par les citoyens
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {POPULAR_QUESTIONS.map((item, index) => (
            <div key={index} className="overflow-hidden rounded-lg border border-border bg-card">
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="flex w-full items-center justify-between gap-4 p-5 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground">{item.question}</h3>
                  <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {item.category}
                  </span>
                </div>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-muted-foreground transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="border-t border-border bg-muted/30 p-5">
                  <p className="text-sm leading-relaxed text-muted-foreground">{answers[index]}</p>
                  <Button asChild size="sm" variant="outline" className="mt-4 bg-transparent">
                    <Link href={`/assistant?q=${encodeURIComponent(item.question)}`}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Poser à l'assistant
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
