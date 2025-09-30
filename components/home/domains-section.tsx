import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DOMAINS } from "@/lib/constants"

export function DomainsSection() {
  return (
    <section className="border-b border-border bg-muted/20 py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Domaines couverts
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            Une expertise complète sur tous les aspects de la vie au Cameroun
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((domain) => (
            <Link
              key={domain.title}
              href={domain.href}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <domain.icon className="h-6 w-6 text-primary" />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-card-foreground group-hover:text-primary">{domain.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{domain.description}</p>

                  <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                    En savoir plus
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
