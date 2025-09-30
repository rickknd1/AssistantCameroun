import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { NewsContent } from "@/components/news/news-content"

export default function ActualitesPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <NewsContent />
      </main>
      <Footer />
    </div>
  )
}
