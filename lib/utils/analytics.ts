// ============================================
// ANALYTICS HELPERS
// Fonctions pour tracker les événements
// ============================================

import { getSessionId } from './session'

type AnalyticsEvent =
  | 'PAGE_VIEW'
  | 'SEARCH'
  | 'DOCUMENT_VIEW'
  | 'PROCEDURE_VIEW'
  | 'NEWS_VIEW'
  | 'QUIZ_START'
  | 'QUIZ_COMPLETE'
  | 'CONVERSATION_START'
  | 'MESSAGE_SENT'
  | 'CITATION_CLICKED'
  | 'FEEDBACK_SUBMITTED'

interface TrackEventOptions {
  event: AnalyticsEvent
  data?: Record<string, any>
  language?: 'FR' | 'EN'
}

/**
 * Envoie un événement analytics à Supabase
 */
export async function trackEvent({
  event,
  data = {},
  language = 'FR'
}: TrackEventOptions): Promise<void> {
  if (typeof window === 'undefined') return

  try {
    const sessionId = getSessionId()
    const userAgent = window.navigator.userAgent

    await fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        event,
        sessionId,
        data,
        language,
        userAgent
      })
    })
  } catch (error) {
    console.error('Error tracking event:', error)
    // Ne pas bloquer l'application si le tracking échoue
  }
}

/**
 * Raccourcis pour les événements communs
 */
export const analytics = {
  pageView: (path: string) => {
    trackEvent({
      event: 'PAGE_VIEW',
      data: { path }
    })
  },

  documentView: (documentId: string, title: string) => {
    trackEvent({
      event: 'DOCUMENT_VIEW',
      data: { documentId, title }
    })
  },

  procedureView: (procedureId: string, slug: string) => {
    trackEvent({
      event: 'PROCEDURE_VIEW',
      data: { procedureId, slug }
    })
  },

  newsView: (newsId: string, title: string) => {
    trackEvent({
      event: 'NEWS_VIEW',
      data: { newsId, title }
    })
  },

  search: (query: string, resultCount: number) => {
    trackEvent({
      event: 'SEARCH',
      data: { query, resultCount }
    })
  },

  quizStart: (category: string, difficulty: string) => {
    trackEvent({
      event: 'QUIZ_START',
      data: { category, difficulty }
    })
  },

  quizComplete: (category: string, score: number, totalQuestions: number) => {
    trackEvent({
      event: 'QUIZ_COMPLETE',
      data: { category, score, totalQuestions }
    })
  },

  conversationStart: (conversationId: string) => {
    trackEvent({
      event: 'CONVERSATION_START',
      data: { conversationId }
    })
  },

  messageSent: (conversationId: string, messageLength: number) => {
    trackEvent({
      event: 'MESSAGE_SENT',
      data: { conversationId, messageLength }
    })
  },

  citationClicked: (citationId: string, documentId: string) => {
    trackEvent({
      event: 'CITATION_CLICKED',
      data: { citationId, documentId }
    })
  },

  feedbackSubmitted: (messageId: string, rating: number) => {
    trackEvent({
      event: 'FEEDBACK_SUBMITTED',
      data: { messageId, rating }
    })
  }
}