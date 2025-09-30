import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const slug = searchParams.get('slug')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Si slug fourni, chercher par titre (slug décodé)
    if (slug) {
      // Décoder le slug en titre
      const titleFromSlug = slug
        .split('-')
        .join(' ')

      const { data: articles, error } = await supabase
        .from('NewsArticle')
        .select('*')
        .eq('isRelevant', true)
        .ilike('title', `%${titleFromSlug}%`)

      if (error || !articles || articles.length === 0) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 })
      }

      const article = articles[0]

      // Incrémenter viewCount
      await supabase
        .from('NewsArticle')
        .update({ viewCount: article.viewCount + 1 })
        .eq('id', article.id)

      return NextResponse.json({ data: [article] })
    }

    let query = supabase
      .from('NewsArticle')
      .select('*', { count: 'exact' })
      .eq('isRelevant', true)
      .order('publishedAt', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category && category !== 'Tous') {
      query = query.eq('category', category)
    }

    if (featured === 'true') {
      query = query.eq('isFeatured', true)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching news:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      count,
      hasMore: (count || 0) > offset + limit
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
      .from('NewsArticle')
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