// ============================================
// SESSION MANAGEMENT
// Gestion des sessions utilisateur pour analytics
// ============================================

const SESSION_KEY = 'assistant_session_id'
const SESSION_DURATION = 30 * 60 * 1000 // 30 minutes

/**
 * Génère un ID de session unique
 */
export function generateSessionId(): string {
  return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

/**
 * Récupère ou crée un ID de session
 */
export function getSessionId(): string {
  if (typeof window === 'undefined') {
    return generateSessionId()
  }

  try {
    // Vérifier si une session existe déjà
    const stored = localStorage.getItem(SESSION_KEY)

    if (stored) {
      const { sessionId, timestamp } = JSON.parse(stored)
      const now = Date.now()

      // Vérifier si la session est encore valide
      if (now - timestamp < SESSION_DURATION) {
        // Mettre à jour le timestamp
        localStorage.setItem(
          SESSION_KEY,
          JSON.stringify({ sessionId, timestamp: now })
        )
        return sessionId
      }
    }

    // Créer une nouvelle session
    const newSessionId = generateSessionId()
    localStorage.setItem(
      SESSION_KEY,
      JSON.stringify({ sessionId: newSessionId, timestamp: Date.now() })
    )

    return newSessionId
  } catch (error) {
    console.error('Error managing session:', error)
    return generateSessionId()
  }
}

/**
 * Réinitialise la session (par exemple après un logout)
 */
export function clearSession(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.error('Error clearing session:', error)
    }
  }
}

/**
 * Hook React pour utiliser le sessionId
 */
export function useSessionId(): string {
  if (typeof window === 'undefined') {
    return ''
  }

  const [sessionId, setSessionId] = React.useState<string>('')

  React.useEffect(() => {
    setSessionId(getSessionId())
  }, [])

  return sessionId
}

import React from 'react'