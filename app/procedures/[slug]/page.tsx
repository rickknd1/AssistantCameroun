"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProcedureDetail } from "@/components/procedures/procedure-detail"

export default function ProcedureDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ProcedureDetail slug={params.slug} />
      </main>
      <Footer />
    </div>
  )
}