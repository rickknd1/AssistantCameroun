import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { DocumentDetail } from "@/components/library/document-detail"

export default function DocumentDetailPage({ params }: { params: { slug: string } }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <DocumentDetail slug={params.slug} />
      </main>
      <Footer />
    </div>
  )
}