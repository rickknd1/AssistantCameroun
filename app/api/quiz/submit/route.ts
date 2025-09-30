import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const supabase = createClient()
    const body = await request.json()

    const { questionId, answer, sessionId, timeSpent } = body

    if (!questionId || !answer || !sessionId || timeSpent === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Récupérer la question pour vérifier la réponse
    const { data: question, error: questionError } = await supabase
      .from('QuizQuestion')
      .select('*')
      .eq('id', questionId)
      .single()

    if (questionError || !question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      )
    }

    // Vérifier si la réponse est correcte
    const isCorrect = answer === question.answer

    // Enregistrer la tentative
    const { data: attempt, error: attemptError } = await supabase
      .from('QuizAttempt')
      .insert({
        questionId,
        sessionId,
        answer,
        isCorrect,
        timeSpent
      })
      .select()
      .single()

    if (attemptError) {
      console.error('Error creating quiz attempt:', attemptError)
      return NextResponse.json(
        { error: attemptError.message },
        { status: 500 }
      )
    }

    // Tracker l'analytics
    await supabase.from('Analytics').insert({
      event: isCorrect ? 'QUIZ_COMPLETE' : 'QUIZ_START',
      sessionId,
      data: {
        questionId,
        category: question.category,
        difficulty: question.difficulty,
        isCorrect,
        timeSpent
      },
      language: 'FR'
    })

    // Retourner le résultat avec l'explication
    return NextResponse.json({
      data: {
        isCorrect,
        correctAnswer: question.answer,
        explanation: question.explanation,
        attempt
      }
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}