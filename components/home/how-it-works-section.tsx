import { MessageSquare, Brain, CheckCircle2 } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: MessageSquare,
      title: "Posez votre question",
      description: "Exprimez-vous en français ou en anglais, notre assistant comprend les deux langues officielles.",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Brain,
      title: "L'IA analyse et recherche",
      description:
        "Notre intelligence artificielle parcourt des centaines de documents officiels pour trouver la réponse exacte.",
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      icon: CheckCircle2,
      title: "Recevez une réponse claire",
      description:
        "Obtenez une réponse détaillée avec les sources officielles citées et des étapes concrètes à suivre.",
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ]

  return (
    <section className="border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Comment ça marche ?
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Trois étapes simples pour obtenir toutes vos réponses
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step.title} className="relative">
              {/* Connector line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-border md:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                <div className={`flex h-24 w-24 items-center justify-center rounded-2xl ${step.bgColor}`}>
                  <step.icon className={`h-12 w-12 ${step.color}`} />
                </div>

                <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-sm font-bold text-background">
                  {index + 1}
                </div>

                <h3 className="mt-6 text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="mt-3 text-pretty text-muted-foreground">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
