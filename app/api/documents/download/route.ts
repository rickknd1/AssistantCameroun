import { NextResponse } from 'next/server'
import { getDocumentBySlug, getSectionsByDocumentId } from '@/lib/documents'

export const dynamic = 'force-dynamic'

// Génère un fichier texte téléchargeable depuis le document statique + ses sections.
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 })
    }

    const document = getDocumentBySlug(slug)
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const sections = getSectionsByDocumentId(document.id)

    let content = `${document.title}\n`
    content += `${'='.repeat(document.title.length)}\n\n`

    if (document.reference) content += `Référence: ${document.reference}\n`
    if (document.dateEnacted) content += `Date: ${document.dateEnacted}\n`
    content += `Type: ${document.type}\n`
    content += `Catégorie: ${document.category}\n\n`

    if (document.summary) {
      content += `Résumé:\n${document.summary}\n\n`
      content += `${'-'.repeat(80)}\n\n`
    }

    if (sections && sections.length > 0) {
      content += `TABLE DES MATIÈRES\n`
      content += `${'-'.repeat(80)}\n\n`
      sections.forEach((section) => {
        const indent = '  '.repeat(section.level)
        content += `${indent}${section.reference || ''} ${section.title}\n`
      })
      content += `\n${'='.repeat(80)}\n\n`
      sections.forEach((section) => {
        content += `\n${'#'.repeat(section.level + 1)} ${section.title}\n`
        if (section.reference) content += `Référence: ${section.reference}\n`
        content += `\n${section.content}\n`
        content += `\n${'-'.repeat(80)}\n`
      })
    } else {
      content += `${document.content}\n`
    }

    content += `\n\n${'='.repeat(80)}\n`
    content += `Document généré depuis Assistant Digital Cameroun\n`
    content += `Date de génération: ${new Date().toLocaleDateString('fr-FR')}\n`
    content += `Source: ${document.source || 'Assistant Digital Cameroun'}\n`

    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${slug}.txt"`,
      },
    })
  } catch (error) {
    console.error('Error generating download:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
