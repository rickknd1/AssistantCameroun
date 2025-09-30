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

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `Pour répondre à votre question sur "${content.slice(0, 50)}...", voici les informations officielles :\n\n**Procédure à suivre :**\n\n1. Rendez-vous au centre d'enrôlement le plus proche de votre domicile\n2. Présentez les documents requis (acte de naissance, photos d'identité)\n3. Effectuez l'enrôlement biométrique\n4. Payez les frais administratifs\n5. Récupérez votre récépissé\n\nLe délai de traitement est généralement de **2 à 4 semaines**. Vous serez notifié par SMS lorsque votre document sera prêt.\n\n**Important :** Assurez-vous que tous vos documents sont conformes aux exigences pour éviter tout retard.`,
        timestamp: new Date(),
        sources: [
          {
            title: "Loi N° 2016/007 du 12 juillet 2016 portant Code Pénal",
            reference: "Art. 152-156",
            url: "/bibliotheque/code-penal",
          },
          {
            title: "Décret N° 2011/408 du 09 décembre 2011",
            reference: "Chapitre III",
            url: "/bibliotheque/decret-2011-408",
          },
        ],
        confidence: 95,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsTyping(false)
    }, 2000)
  }

  const handleNewConversation = () => {
    setMessages([])
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      <ChatSidebar
        conversations={conversations}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewConversation={handleNewConversation}
      />

      <div className="flex flex-1 flex-col">
        {messages.length === 0 ? (
          <WelcomeScreen onQuestionClick={handleSendMessage} />
        ) : (
          <ChatMessages messages={messages} isTyping={isTyping} />
        )}

        <ChatInput onSendMessage={handleSendMessage} isTyping={isTyping} />
      </div>
    </div>
  )
}
