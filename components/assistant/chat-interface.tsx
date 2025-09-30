"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { WelcomeScreen } from "./welcome-screen"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  sources?: Array<{
    title: string
    reference: string
    url: string
  }>
  confidence?: number
}

export interface Conversation {
  id: string
  title: string
  lastMessage: string
  timestamp: Date
  category?: string
}

export function ChatInterface() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Obtenir une CNI",
      lastMessage: "Merci pour ces informations détaillées",
      timestamp: new Date(Date.now() - 86400000),
      category: "Identité",
    },
    {
      id: "2",
      title: "Créer une entreprise",
      lastMessage: "Quels sont les coûts ?",
      timestamp: new Date(Date.now() - 172800000),
      category: "Entreprise",
    },
  ])
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    try {
      // Appel à l'API réelle
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages.map(m => ({
            role: m.role,
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'assistant')
      }

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        sources: data.sources || [],
        confidence: data.confidence || 70,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleNewConversation = () => {
    setMessages([])
  }

  return (
    <div className="flex h-full w-full overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewConversation={handleNewConversation}
      />

      <div className="flex flex-1 flex-col min-h-0 h-full">
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <WelcomeScreen onQuestionClick={handleSendMessage} />
          ) : (
            <ChatMessages messages={messages} isTyping={isTyping} />
          )}
        </div>

        <div className="flex-shrink-0 border-t border-border bg-background">
          <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
        </div>
      </div>
    </div>
  )
}
