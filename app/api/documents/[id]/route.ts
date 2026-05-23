import { NextResponse } from 'next/server'
import { getDocumentById } from '@/lib/documents'

// Document par id (stockage statique)
export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const doc = getDocumentById(params.id)
    if (!doc) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }
    return NextResponse.json({ data: doc })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Écriture désactivée : documents versionnés dans Git (content/documents).
export async function PUT() {
  return NextResponse.json(
    { error: 'Lecture seule : éditez le fichier content/documents/<slug>.json.' },
    { status: 405 },
  )
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Lecture seule : supprimez le fichier content/documents/<slug>.json.' },
    { status: 405 },
  )
}
