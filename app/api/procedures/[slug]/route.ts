import { NextResponse } from 'next/server'
import { getProcedureBySlug } from '@/lib/procedures'

// Procédure par slug (stockage statique)
export async function GET(
  request: Request,
  { params }: { params: { slug: string } },
) {
  try {
    const data = getProcedureBySlug(params.slug)
    if (!data) {
      return NextResponse.json({ error: 'Procedure not found' }, { status: 404 })
    }
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Écriture désactivée : procédures versionnées dans lib/procedures/data.ts.
export async function PUT() {
  return NextResponse.json(
    { error: 'Lecture seule : éditez lib/procedures/data.ts.' },
    { status: 405 },
  )
}
