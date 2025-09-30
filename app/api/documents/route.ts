import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import type { Document } from '@/lib/types/database'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const slug = searchParams.get('slug')
    const type = searchParams.get('type')
    const category = searchParams.get('category')
    const status = searchParams.get('status') || 'ACTIVE'
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')

    // Si slug fourni, retourner un seul document
    if (slug) {
      const { data, error } = await supabase
        .from('Document')
        .select('*')
        .eq('slug', slug)
        .eq('status', status)
        .single()

      if (error || !data) {
        return NextResponse.json({ error: 'Document not found' }, { status: 404 })
      }

      return NextResponse.json({ data: [data] })
    }

    let query = supabase
      .from('Document')
      .select('*')
      .eq('status', status)
      .order('createdAt', { ascending: false })
      .limit(limit)

    if (type) {
      query = query.eq('type', type)
    }

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,reference.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching documents:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      data,
      count: data?.length || 0
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

    // TODO: Add authentication check for admin
    // const { data: { user } } = await supabase.auth.getUser()
    // if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('Document')
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