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

    // Validate event type before inserting
    const validEvents = [
      'PAGE_VIEW',
      'SEARCH',
      'DOCUMENT_VIEW',
      'PROCEDURE_VIEW',
      'NEWS_VIEW',
      'QUIZ_START',
      'QUIZ_COMPLETE',
      'CONVERSATION_START',
      'MESSAGE_SENT',
      'MESSAGE_RECEIVED',
      'MESSAGE_ERROR',
      'CITATION_CLICKED',
      'FEEDBACK_SUBMITTED'
    ]

    if (!validEvents.includes(event)) {
      // Silently ignore invalid events to not break the app
      return NextResponse.json({ success: true, warning: 'Invalid event type' })
    }

    const { error } = await supabase.from('Analytics').insert({
      event,
      sessionId,
      data: data || {},
      language: language || 'FR',
      userAgent,
      ip: ipHash
    })

    if (error) {
      // Don't log to console to avoid spam, just return success to not break the app
      return NextResponse.json({ success: true, skipped: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Unexpected error:', error)
    // Ne pas retourner 500 pour ne pas bloquer l'application
    return NextResponse.json({ success: false })
  }
}
