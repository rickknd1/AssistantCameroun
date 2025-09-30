import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient()

    // Récupérer la procédure
    const { data, error } = await supabase
      .from('Procedure')
      .select('*')
      .eq('slug', params.slug)
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Procedure not found' },
        { status: 404 }
      )
    }

    // Incrémenter le viewCount
    await supabase
      .from('Procedure')
      .update({ viewCount: data.viewCount + 1 })
      .eq('id', data.id)

    // Tracker l'analytics
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (sessionId) {
      await supabase.from('Analytics').insert({
        event: 'PROCEDURE_VIEW',
        sessionId,
        data: {
          procedureId: data.id,
          slug: params.slug,
          category: data.category
        },
        language: 'FR'
      })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // TODO: Add authentication check

    const { data, error } = await supabase
      .from('Procedure')
      .update(body)
      .eq('slug', params.slug)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}