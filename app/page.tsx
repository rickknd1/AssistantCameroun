"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { DomainsSection } from "@/components/home/domains-section"
import { PopularQuestionsSection } from "@/components/home/popular-questions-section"
import { StatsSection } from "@/components/home/stats-section"
import { CtaSection } from "@/components/home/cta-section"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorksSection />
        <DomainsSection />
        <PopularQuestionsSection />
        <StatsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
