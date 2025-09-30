"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewsDetail } from "@/components/news/news-detail"

export default function NewsDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <NewsDetail slug={params.slug} />
      </main>
      <Footer />
    </div>
  )
}