"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { InfoContent } from "@/components/info/info-content"

export default function InfoPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <InfoContent />
      </main>
      <Footer />
    </div>
  )
}
