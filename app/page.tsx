"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/home/hero-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { DomainsSection } from "@/components/home/domains-section"
import { PopularQuestionsSection } from "@/components/home/popular-questions-section"
import { StatsSection } from "@/components/home/stats-section"
import { CtaSection } from "@/components/home/cta-section"
import { FeedbackButton } from "@/components/ui/feedback-button"
import Script from "next/script"

export default function HomePage() {
  return (
    <>
      {/* Structured Data for SEO */}
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Cami - Assistant National du Cameroun",
            "alternateName": "Cami",
            "url": "https://assistantcameroun.com",
            "logo": "https://assistantcameroun.com/logo.svg",
            "description": "Assistant intelligent IA gratuit pour les procédures administratives et le droit camerounais. Disponible 24/7 avec réponses instantanées et sources officielles.",
            "sameAs": [
              "https://www.linkedin.com/company/assistant-cameroun"
            ],
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Support",
              "availableLanguage": ["French", "English"]
            }
          })
        }}
      />
      <Script
        id="structured-data-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Cami - Assistant National du Cameroun",
            "url": "https://assistantcameroun.com",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://assistantcameroun.com/assistant?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
      <Script
        id="structured-data-service"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Assistant IA pour procédures administratives",
            "provider": {
              "@type": "Organization",
              "name": "Cami - Assistant National du Cameroun"
            },
            "areaServed": {
              "@type": "Country",
              "name": "Cameroun"
            },
            "availableChannel": {
              "@type": "ServiceChannel",
              "serviceUrl": "https://assistantcameroun.com/assistant",
              "servicePhone": "",
              "availableLanguage": {
                "@type": "Language",
                "name": "French",
                "alternateName": "fr"
              }
            },
            "audience": {
              "@type": "Audience",
              "audienceType": "Citoyens camerounais",
              "geographicArea": {
                "@type": "Country",
                "name": "Cameroun"
              }
            },
            "category": "Intelligence Artificielle",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "XAF",
              "availability": "https://schema.org/InStock"
            }
          })
        }}
      />

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
        <FeedbackButton />
      </div>
    </>
  )
}
