"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DocumentDetailWithSections } from "@/components/library/document-detail-with-sections"

export default function DocumentDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <DocumentDetailWithSections slug={params.slug} />
      </main>
      <Footer />
    </div>
  )
}