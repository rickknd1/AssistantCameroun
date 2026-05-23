import { NextResponse } from 'next/server'
import { listProcedures } from '@/lib/procedures'
import { translateArray } from '@/lib/services/translate'

// Source des procédures : données statiques versionnées (lib/procedures/data.ts)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category') || undefined
    const difficulty = searchParams.get('difficulty') || undefined
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search') || undefined
    const lang = (searchParams.get('lang') as 'en' | 'fr') || 'fr'

    let data = listProcedures({ category, difficulty, search, limit })

    // Traduction optionnelle EN (repli silencieux sur le FR)
    if (lang === 'en' && data.length > 0) {
      try {
        data = await translateArray(data, ['name', 'description'], 'en', 'fr')
      } catch (translateError) {
        console.error('⚠️ Erreur traduction procédures, données FR retournées:', translateError)
      }
    }

    return NextResponse.json({ data, count: data.length })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Procédures gérées via fichiers versionnés : écriture désactivée.
export async function POST() {
  return NextResponse.json(
    { error: 'Lecture seule : les procédures sont définies dans lib/procedures/data.ts.' },
    { status: 405 },
  )
}
