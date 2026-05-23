import { NextResponse } from 'next/server'
import { listDocuments, getDocumentBySlug } from '@/lib/documents'
import { translateArray } from '@/lib/services/translate'

// Source des documents : fichiers statiques versionnés (content/documents/*.json)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const slug = searchParams.get('slug')
    const type = searchParams.get('type') || undefined
    const category = searchParams.get('category') || undefined
    const status = searchParams.get('status') || 'ACTIVE'
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || undefined
    const lang = (searchParams.get('lang') as 'en' | 'fr') || 'fr'

    // Document unique par slug (avec son contenu intégral + sections)
    if (slug) {
      const doc = getDocumentBySlug(slug)
      if (!doc || (doc.status || 'ACTIVE') !== status) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 })
      }
      return NextResponse.json({ data: [doc] })
    }

    // Liste filtrée (version allégée)
    let data = listDocuments({ status, type, category, search, limit })

    // Traduction optionnelle EN (repli silencieux sur le FR en cas d'échec)
    if (lang === 'en' && data.length > 0) {
      try {
        data = await translateArray(data, ['title', 'summary'], 'en', 'fr')
      } catch (translateError) {
        console.error('⚠️ Erreur traduction documents, données FR retournées:', translateError)
      }
    }

    return NextResponse.json({ data, count: data.length })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Les documents sont gérés via des fichiers versionnés dans Git : écriture désactivée.
export async function POST() {
  return NextResponse.json(
    {
      error:
        'Lecture seule : les documents sont des fichiers versionnés (content/documents). Ajoutez/éditez le JSON puis relancez `node scripts/gen-documents-registry.mjs`.',
    },
    { status: 405 },
  )
}
