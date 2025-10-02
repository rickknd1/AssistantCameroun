import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    console.log('🔵 [FEEDBACK] Receiving feedback request...')
    const supabase = await createClient()
    const body = await request.json()
    console.log('🔵 [FEEDBACK] Request body:', JSON.stringify(body, null, 2))

    const { messageId, rating, comment, message, type, page } = body

    // Si c'est un feedback sur un message (like/dislike)
    if (messageId && rating !== undefined) {
      console.log('🔵 [FEEDBACK] Message feedback detected')
      console.log('🔵 [FEEDBACK] messageId:', messageId, 'rating:', rating)

      const { data, error } = await supabase.from('Feedback').insert({
        messageId,
        rating,
        comment: comment || null
      })
      .select()

      if (error) {
        console.error('🔴 [FEEDBACK] Message feedback insertion error:', error)
        console.error('🔴 [FEEDBACK] Error details:', JSON.stringify(error, null, 2))
        return NextResponse.json({ success: true, skipped: true })
      }

      console.log('✅ [FEEDBACK] Message feedback inserted:', data)
      return NextResponse.json({ success: true })
    }

    // Si c'est un feedback général (ancien format)
    if (!message || typeof message !== 'string') {
      console.warn('⚠️ [FEEDBACK] Invalid message format')
      return NextResponse.json(
        { error: 'Message invalide' },
        { status: 400 }
      )
    }

    console.log('🔵 [FEEDBACK] General feedback detected')
    console.log('🔵 [FEEDBACK] type:', type, 'page:', page, 'message:', message)

    // Get IP for tracking (optional, anonymized)
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    const ipHash = ip !== 'unknown'
      ? Buffer.from(ip).toString('base64').substring(0, 16)
      : undefined

    // Insert general feedback into database
    // Note: Le schéma Feedback nécessite un messageId, donc on crée un feedback "général" avec commentaire
    const { data, error } = await supabase.from('Feedback').insert({
      messageId: null, // Feedback général (pas lié à un message spécifique)
      rating: 3, // Neutre par défaut pour les feedbacks généraux
      comment: `[${type || 'recommendation'}] [${page || 'unknown'}] ${message}`
    })
    .select()

    if (error) {
      console.error('🔴 [FEEDBACK] General feedback insertion error:', error)
      console.error('🔴 [FEEDBACK] Error details:', JSON.stringify(error, null, 2))
      // Return success anyway to not discourage users
      return NextResponse.json({ success: true, skipped: true })
    }

    console.log('✅ [FEEDBACK] General feedback inserted:', data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('🔴 [FEEDBACK] API Error:', error)
    console.error('🔴 [FEEDBACK] Error stack:', (error as Error).stack)
    // Return success to not block the app
    return NextResponse.json({ success: true })
  }
}
