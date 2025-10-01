// Conversation utilities for chat interface

export interface Conversation {
  id: string
  title: string
  category: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const STORAGE_KEY = 'chat_conversations'

export function getConversations(): Conversation[] {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []

    const conversations = JSON.parse(stored)
    return conversations.map((conv: any) => ({
      ...conv,
      createdAt: new Date(conv.createdAt),
      updatedAt: new Date(conv.updatedAt),
      messages: conv.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }))
  } catch (error) {
    console.error('Error loading conversations:', error)
    return []
  }
}

export function saveConversation(conversation: Conversation): void {
  if (typeof window === 'undefined') return

  try {
    const conversations = getConversations()
    const index = conversations.findIndex(c => c.id === conversation.id)

    if (index >= 0) {
      conversations[index] = conversation
    } else {
      conversations.unshift(conversation)
    }

    // Keep only last 50 conversations
    const trimmed = conversations.slice(0, 50)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch (error) {
    console.error('Error saving conversation:', error)
  }
}

export function generateConversationTitle(firstMessage: string): string {
  // Take first 50 characters of the message
  const title = firstMessage.substring(0, 50).trim()
  return title.length < firstMessage.length ? title + '...' : title
}

export function detectCategory(message: string): string {
  const keywords = {
    identite: ['cni', 'carte', 'identite', 'passeport', 'acte', 'naissance', 'casier'],
    entreprise: ['entreprise', 'societe', 'sarl', 'creation', 'impot', 'taxe', 'tva'],
    juridique: ['droit', 'travail', 'salaire', 'conge', 'licenciement', 'mariage', 'divorce'],
    foncier: ['terrain', 'foncier', 'titre', 'propriete', 'permis', 'construire'],
    education: ['ecole', 'universite', 'etude', 'diplome', 'formation', 'bourse']
  }

  const lowerMessage = message.toLowerCase()

  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => lowerMessage.includes(word))) {
      return category
    }
  }

  return 'general'
}
