import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { LibraryContent } from "@/components/library/library-content"

export default function BibliotequePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <LibraryContent />
      </main>
      <Footer />
    </div>
  )
}
