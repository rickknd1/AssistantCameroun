"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChatSidebar } from "./chat-sidebar"
import { ChatMessages } from "./chat-messages"
import { ChatInput } from "./chat-input"
import { WelcomeScreen } from "./welcome-screen"
import { getConversations, saveConversation, generateConversationTitle, detectCategory } from "@/lib/utils/conversations"
import { getSessionId } from "@/lib/utils/session"
import { useLanguage } from "@/lib/i18n"

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
  const searchParams = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false) // Fermé par défaut sur mobile
  const [messages, setMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [conversationId, setConversationId] = useState<string>(() => `conv_${Date.now()}`)
  const [sessionId, setSessionId] = useState<string>("")
  const [hasProcessedUrlQuery, setHasProcessedUrlQuery] = useState(false)
  const { language } = useLanguage()

  // Load conversations from localStorage on mount
  useEffect(() => {
    const loadedConversations = getConversations()
    setConversations(loadedConversations)
    setSessionId(getSessionId())

    // Clean up corrupted conversations (conversations with error messages without user questions)
    const cleanConversations = loadedConversations.filter(conv =>
      conv.lastMessage !== "Désolé, une erreur s'est produite. Veuillez réessayer."
    )
    if (cleanConversations.length !== loadedConversations.length) {
      localStorage.setItem('conversations', JSON.stringify(cleanConversations))
      setConversations(cleanConversations)
    }
  }, [])

  // Track analytics event
  const trackEvent = async (
    event: string,
    data?: Record<string, any>
  ) => {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event,
          sessionId,
          data,
          language: language.toUpperCase(),
          userAgent: navigator.userAgent,
        }),
      })
    } catch (error) {
      console.error("Analytics tracking error:", error)
      // Ne pas bloquer l'application si analytics échoue
    }
  }

  const handleSendMessage = async (content: string) => {
    // Protection stricte : bloquer si déjà en train de taper
    if (isTyping) {
      console.log('Requête bloquée : une réponse est déjà en cours')
      return
    }

    const isNewConversation = messages.length === 0
    const startTime = Date.now()

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Track conversation start (sans await car non bloquant)
    if (isNewConversation) {
      trackEvent("CONVERSATION_START", {
        conversationId,
        firstQuestion: content,
        category: detectCategory(content),
      })
    }

    // Track message sent (sans await car non bloquant)
    trackEvent("MESSAGE_SENT", {
      conversationId,
      messageLength: content.length,
      messageNumber: messages.length + 1,
    })

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
          })),
          conversationId: conversationId,
          sessionId: sessionId
        })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la communication avec l\'assistant')
      }

      const data = await response.json()
      const responseTime = Date.now() - startTime

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
        sources: data.sources || [],
        confidence: data.confidence || 70,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Save conversation to localStorage
      const updatedMessages = [...messages, userMessage, assistantMessage]
      const title = generateConversationTitle(updatedMessages)
      const category = detectCategory(content)

      saveConversation(
        conversationId,
        title,
        content,
        category
      )

      // Update conversations list
      setConversations(getConversations())

      // Track message received (après le catch pour ne pas déclencher d'erreur)
      trackEvent("MESSAGE_RECEIVED", {
        conversationId,
        responseTime,
        confidence: data.confidence,
        sourcesCount: data.sources?.length || 0,
      })

    } catch (error) {
      console.error('Error sending message:', error)

      // NE PAS ajouter de message d'erreur visible à l'utilisateur
      // Simplement logger l'erreur et arrêter le typing indicator

      // Track error (sans await car non critique)
      trackEvent("MESSAGE_ERROR", {
        conversationId,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setIsTyping(false)
    }
  }

  const handleNewConversation = () => {
    setMessages([])
    setConversationId(`conv_${Date.now()}`)
  }

  // Handle initial question from URL parameter
  useEffect(() => {
    const question = searchParams.get('q')
    if (question && messages.length === 0 && sessionId && !hasProcessedUrlQuery) {
      setHasProcessedUrlQuery(true)
      // Use setTimeout to avoid the dependency warning and prevent infinite loop
      const timer = setTimeout(() => {
        handleSendMessage(question)
      }, 0)
      return () => clearTimeout(timer)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, sessionId])

  return (
    <div className="flex h-full w-full overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewConversation={handleNewConversation}
        onQuestionClick={handleSendMessage}
      />

      {/* Main chat area - Adaptive layout */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Fixed Header - Mobile only */}
        <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur-sm px-4 py-3 lg:hidden">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card hover:bg-muted transition-colors touch-manipulation active:scale-95"
            >
              <svg className="h-5 w-5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-base font-semibold text-foreground">Cami - L'Assistant IA</h1>
          </div>
        </div>

        {/* Messages Area - Responsive padding */}
        <div className="flex-1 overflow-y-auto pb-[180px] sm:pb-[160px] lg:pb-[140px]">
          {messages.length === 0 ? (
            <WelcomeScreen onQuestionClick={handleSendMessage} />
          ) : (
            <ChatMessages messages={messages} isTyping={isTyping} />
          )}
        </div>

        {/* Fixed Input Area - Responsive positioning */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-80 border-t border-border bg-background/95 backdrop-blur-sm z-30 safe-bottom">
          <ChatInput
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            lastUserMessage={messages.filter(m => m.role === 'user').slice(-1)[0]?.content}
            hasMessages={messages.length > 0}
          />
        </div>
      </div>
    </div>
  )
}
