import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')

    if (!slug) {
      return NextResponse.json({ error: 'Slug required' }, { status: 400 })
    }

    const supabase = await createClient()

    // Récupérer le document
    const { data: documents } = await supabase
      .from('Document')
      .select('*')
      .eq('slug', slug)
      .limit(1)

    if (!documents || documents.length === 0) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    const document = documents[0]

    // Récupérer les sections
    const { data: sections } = await supabase
      .from('Section')
      .select('*')
      .eq('documentId', document.id)
      .order('position', { ascending: true })

    // Générer le contenu texte formaté
    let content = `${document.title}\n`
    content += `${'='.repeat(document.title.length)}\n\n`

    if (document.reference) {
      content += `Référence: ${document.reference}\n`
    }
    if (document.dateEnacted) {
      content += `Date: ${document.dateEnacted}\n`
    }
    content += `Type: ${document.type}\n`
    content += `Catégorie: ${document.category}\n\n`

    if (document.summary) {
      content += `Résumé:\n${document.summary}\n\n`
      content += `${'-'.repeat(80)}\n\n`
    }

    // Ajouter les sections si elles existent
    if (sections && sections.length > 0) {
      content += `TABLE DES MATIÈRES\n`
      content += `${'-'.repeat(80)}\n\n`

      sections.forEach((section) => {
        const indent = '  '.repeat(section.level)
        content += `${indent}${section.reference || ''} ${section.title}\n`
      })

      content += `\n${'='.repeat(80)}\n\n`

      // Contenu complet
      sections.forEach((section) => {
        content += `\n${'#'.repeat(section.level + 1)} ${section.title}\n`
        if (section.reference) {
          content += `Référence: ${section.reference}\n`
        }
        content += `\n${section.content}\n`
        content += `\n${'-'.repeat(80)}\n`
      })
    } else {
      // Si pas de sections, utiliser le contenu brut
      content += `${document.content}\n`
    }

    // Ajouter footer
    content += `\n\n${'='.repeat(80)}\n`
    content += `Document généré depuis AssistantCameroun.cm\n`
    content += `Date de génération: ${new Date().toLocaleDateString('fr-FR')}\n`
    content += `Source: ${document.source || 'AssistantCameroun'}\n`

    // Retourner comme fichier texte (pour l'instant)
    // TODO: Utiliser une bibliothèque pour générer un vrai PDF
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': `attachment; filename="${slug}.txt"`
      }
    })
  } catch (error) {
    console.error('Error generating download:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
