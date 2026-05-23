"use client"

import { motion, useReducedMotion, type Variants } from "framer-motion"
import { MessageSquare, Brain, CheckCircle2 } from "lucide-react"
import { useLanguage } from "@/lib/i18n"

export function HowItWorksSection() {
  const { t } = useLanguage()
  const reduce = useReducedMotion()

  const steps = [
    {
      icon: MessageSquare,
      title: t("home.howItWorks.step1.title"),
      description: t("home.howItWorks.step1.description"),
      iconWrap: "from-primary/20 to-primary/5",
      iconColor: "text-primary",
      ring: "group-hover:ring-primary/40",
      watermark: "text-primary/10",
      glow: "bg-primary/20",
    },
    {
      icon: Brain,
      title: t("home.howItWorks.step2.title"),
      description: t("home.howItWorks.step2.description"),
      iconWrap: "from-secondary/20 to-secondary/5",
      iconColor: "text-secondary",
      ring: "group-hover:ring-secondary/40",
      watermark: "text-secondary/10",
      glow: "bg-secondary/20",
    },
    {
      icon: CheckCircle2,
      title: t("home.howItWorks.step3.title"),
      description: t("home.howItWorks.step3.description"),
      iconWrap: "from-accent/20 to-accent/5",
      iconColor: "text-accent",
      ring: "group-hover:ring-accent/40",
      watermark: "text-accent/10",
      glow: "bg-accent/20",
    },
  ]

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.15 } },
  }
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 28 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  }

  return (
    <section className="border-b border-border bg-background py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t("home.howItWorks.title")}
          </h2>
          <p className="mt-4 text-pretty text-lg text-muted-foreground">
            {t("home.howItWorks.subtitle")}
          </p>
        </motion.div>

        {/* Étapes */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mx-auto mt-14 grid max-w-5xl gap-6 md:mt-20 md:grid-cols-3"
        >
          {/* Ligne de connexion (desktop uniquement) */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[4.75rem] hidden md:block"
          >
            <div className="mx-auto h-px w-[70%] bg-gradient-to-r from-transparent via-border to-transparent" />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.title}
                variants={item}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-foreground/15 hover:shadow-xl"
              >
                {/* Halo coloré au survol */}
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -top-16 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full ${step.glow} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100`}
                />

                {/* Numéro en filigrane */}
                <span
                  aria-hidden
                  className={`pointer-events-none absolute right-3 top-1 select-none text-7xl font-black leading-none ${step.watermark}`}
                >
                  {i + 1}
                </span>

                {/* Icône */}
                <div
                  className={`relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${step.iconWrap} ring-1 ring-inset ring-border transition-all duration-300 group-hover:scale-105 ${step.ring}`}
                >
                  <Icon className={`h-8 w-8 ${step.iconColor}`} />
                </div>

                {/* Texte */}
                <h3 className="relative mt-6 text-lg font-semibold text-card-foreground sm:text-xl">
                  {step.title}
                </h3>
                <p className="relative mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
