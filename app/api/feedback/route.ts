import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    const { message, type, page } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message invalide' },
        { status: 400 }
      )
    }

    // Get IP for tracking (optional, anonymized)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    const ipHash = ip !== 'unknown'
      ? Buffer.from(ip).toString('base64').substring(0, 16)
      : undefined

    // Insert feedback into database
    const { error } = await supabase.from('Feedback').insert({
      message,
      type: type || 'recommendation',
      page: page || 'unknown',
      ip: ipHash,
      status: 'NEW'
    })

    if (error) {
      console.error('Feedback insertion error:', error)
      // Return success anyway to not discourage users
      return NextResponse.json({ success: true, skipped: true })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback API Error:', error)
    // Return success to not block the app
    return NextResponse.json({ success: true })
  }
}
