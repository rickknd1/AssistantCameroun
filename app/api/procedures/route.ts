import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { translateArray } from '@/lib/services/translate'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')
    const lang = searchParams.get('lang') as 'en' | 'fr' || 'fr'

    let query = supabase
      .from('Procedure')
      .select('*')
      .order('popularity', { ascending: false })
      .limit(limit)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching procedures:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Traduire si langue = EN
    let translatedData = data || []
    if (lang === 'en' && data && data.length > 0) {
      try {
        translatedData = await translateArray(
          data,
          ['name', 'description'],
          'en',
          'fr'
        )
        console.log(`✅ Procédures traduites en anglais (${translatedData.length} procédures)`)
      } catch (translateError) {
        console.error('⚠️ Erreur traduction procédures, données FR retournées:', translateError)
      }
    }

    return NextResponse.json({
      data: translatedData,
      count: translatedData?.length || 0
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
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
      .from('Procedure')
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