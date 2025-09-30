import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { event, sessionId, data, language, userAgent } = body

    if (!event || !sessionId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Hash de l'IP pour privacy (optionnel)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'

    // Simple hash pour anonymisation
    const ipHash = ip !== 'unknown'
      ? Buffer.from(ip).toString('base64').substring(0, 16)
      : undefined

    const { error } = await supabase.from('Analytics').insert({
      event,
      sessionId,
      data: data || {},
      language: language || 'FR',
      userAgent,
      ip: ipHash
    })

    if (error) {
      console.error('Error inserting analytics:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    // Ne pas retourner 500 pour ne pas bloquer l'application
    return NextResponse.json({ success: false })
  }
}