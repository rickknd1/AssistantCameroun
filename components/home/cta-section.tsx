import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 lg:py-28">
      {/* Decorative background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Sparkles className="h-4 w-4" />
          Propulsé par l'IA
        </div>

        <h2 className="mt-6 text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Prêt à obtenir vos réponses ?
        </h2>

        <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
          Rejoignez des milliers de Camerounais qui utilisent déjà notre assistant intelligent pour simplifier leurs
          démarches administratives et obtenir des informations fiables.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="h-12 px-8 text-base shadow-lg">
            <Link href="/assistant">
              Parler à l'assistant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>

          <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base bg-transparent">
            <Link href="/procedures">Explorer les procédures</Link>
          </Button>
        </div>

        <p className="mt-6 text-sm text-muted-foreground">Gratuit • Rapide • Fiable • Sources officielles vérifiées</p>
      </div>
    </section>
  )
}
