import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '10')

    console.log('Quiz API - Params:', { category, difficulty, limit })

    const supabase = await createClient()

    let query = supabase
      .from('QuizQuestion')
      .select('*')
      .order('timesAsked', { ascending: true })
      .limit(limit)

    if (category) {
      query = query.eq('category', category)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    const { data, error } = await query

    if (error) {
      console.error('Supabase error fetching quiz questions:', error)
      return NextResponse.json({
        error: error.message,
        hint: error.hint || '',
        details: error.details || '',
        code: error.code || ''
      }, { status: 500 })
    }

    console.log(`Quiz API - Found ${data?.length || 0} questions`)

    return NextResponse.json({
      data,
      count: data?.length || 0
    })
  } catch (error: any) {
    console.error('Error fetching quiz questions:', {
      message: error?.message || String(error),
      details: error?.stack || '',
      hint: error?.hint || '',
      code: error?.code || ''
    })
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error?.message || String(error)
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // TODO: Add authentication check

    const { data, error } = await supabase
      .from('QuizQuestion')
      .insert(body)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}