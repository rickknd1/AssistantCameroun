"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProceduresContent } from "@/components/procedures/procedures-content"

export default function ProceduresPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <ProceduresContent />
      </main>
      <Footer />
    </div>
  )
}
