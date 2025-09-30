// ============================================
// CONVERSATIONS MANAGEMENT - localStorage
// Gestion des conversations locales (temporaires)
// ============================================

import type { Message, Conversation } from '@/components/assistant/chat-interface'

const CONVERSATIONS_KEY = 'assistant_conversations'
const MAX_CONVERSATIONS = 20 // Limite pour éviter de surcharger localStorage

/**
 * Récupère toutes les conversations locales
 */
export function getConversations(): Conversation[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY)
    if (!stored) return []

    const conversations: Conversation[] = JSON.parse(stored)

    // Convertir les dates en objets Date
    return conversations.map(conv => ({
      ...conv,
      timestamp: new Date(conv.timestamp)
    }))
  } catch (error) {
    console.error('Error loading conversations:', error)
    return []
  }
}

/**
 * Sauvegarde une conversation
 */
export function saveConversation(
  id: string,
  title: string,
  lastMessage: string,
  category?: string
): void {
  if (typeof window === 'undefined') return

  try {
    const conversations = getConversations()

    // Vérifier si la conversation existe déjà
    const existingIndex = conversations.findIndex(c => c.id === id)

    const conversation: Conversation = {
      id,
      title,
      lastMessage,
      timestamp: new Date(),
      category
    }

    if (existingIndex >= 0) {
      // Mettre à jour
      conversations[existingIndex] = conversation
    } else {
      // Ajouter au début
      conversations.unshift(conversation)

      // Limiter le nombre de conversations
      if (conversations.length > MAX_CONVERSATIONS) {
        conversations.pop()
      }
    }

    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
  } catch (error) {
    console.error('Error saving conversation:', error)
  }
}

/**
 * Supprime une conversation
 */
export function deleteConversation(id: string): void {
  if (typeof window === 'undefined') return

  try {
    const conversations = getConversations()
    const filtered = conversations.filter(c => c.id !== id)
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(filtered))
  } catch (error) {
    console.error('Error deleting conversation:', error)
  }
}

/**
 * Efface toutes les conversations
 */
export function clearAllConversations(): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.removeItem(CONVERSATIONS_KEY)
  } catch (error) {
    console.error('Error clearing conversations:', error)
  }
}

/**
 * Génère un titre de conversation à partir des messages
 */
export function generateConversationTitle(messages: Message[]): string {
  if (messages.length === 0) return 'Nouvelle conversation'

  // Prendre la première question utilisateur
  const firstUserMessage = messages.find(m => m.role === 'user')
  if (!firstUserMessage) return 'Nouvelle conversation'

  // Limiter à 50 caractères
  const title = firstUserMessage.content
  return title.length > 50 ? title.substring(0, 47) + '...' : title
}

/**
 * Détecte la catégorie d'une conversation basée sur le contenu
 */
export function detectCategory(content: string): string | undefined {
  const keywords = {
    'Identité': ['cni', 'carte', 'identité', 'passeport', 'acte', 'naissance'],
    'Entreprise': ['entreprise', 'société', 'business', 'commerce', 'tax', 'enregistrement'],
    'Juridique': ['droit', 'loi', 'justice', 'tribunal', 'avocat', 'plainte'],
    'Foncier': ['terrain', 'titre', 'foncier', 'propriété', 'construire', 'permis']
  }

  const lowerContent = content.toLowerCase()

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => lowerContent.includes(word))) {
      return category
    }
  }

  return undefined
}
