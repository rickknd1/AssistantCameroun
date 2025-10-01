"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isTyping: boolean
  lastUserMessage?: string
  hasMessages?: boolean
}

// Suggestions par défaut (ne s'affichent que si la conversation a déjà commencé)
const DEFAULT_SUGGESTIONS = [
  "Quels sont les délais d'obtention ?",
  "Combien ça coûte ?",
]

// Suggestions contextuelles basées sur le dernier message
const getContextualSuggestions = (lastMessage: string = ""): string[] => {
  const lowerMessage = lastMessage.toLowerCase()

  // Suggestions pour CNI/Passeport
  if (lowerMessage.includes('cni') || lowerMessage.includes('carte nationale') || lowerMessage.includes('identité')) {
    return [
      "Quels sont les délais d'obtention ?",
      "Combien ça coûte ?",
      "Quels documents sont nécessaires ?",
      "Où faire la demande ?",
    ]
  }

  // Suggestions pour passeport
  if (lowerMessage.includes('passeport')) {
    return [
      "Quelle est la durée de validité ?",
      "Quel est le coût ?",
      "Où déposer le dossier ?",
      "Quels sont les documents requis ?",
    ]
  }

  // Suggestions pour entreprise
  if (lowerMessage.includes('entreprise') || lowerMessage.includes('société') || lowerMessage.includes('business')) {
    return [
      "Quel est le capital minimum requis ?",
      "Combien coûte la création ?",
      "Quelles sont les étapes ?",
      "Quels documents pour le RCCM ?",
    ]
  }

  // Suggestions pour foncier
  if (lowerMessage.includes('terrain') || lowerMessage.includes('titre foncier') || lowerMessage.includes('propriété')) {
    return [
      "Comment obtenir un titre foncier ?",
      "Quelle est la procédure d'achat ?",
      "Quels sont les frais ?",
      "Où s'adresser ?",
    ]
  }

  // Suggestions pour travail
  if (lowerMessage.includes('travail') || lowerMessage.includes('emploi') || lowerMessage.includes('salarié')) {
    return [
      "Quels sont mes droits ?",
      "Quel est le salaire minimum ?",
      "Combien de jours de congé ?",
      "Comment porter plainte ?",
    ]
  }

  // Suggestions par défaut
  return DEFAULT_SUGGESTIONS
}

export function ChatInput({ onSendMessage, isTyping, lastUserMessage, hasMessages = false }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const maxLength = 1000

  // Obtenir les suggestions contextuelles seulement si la conversation a déjà commencé
  const suggestions = hasMessages ? getContextualSuggestions(lastUserMessage) : []

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [message])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && !isTyping) {
      onSendMessage(message.trim())
      setMessage("")
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (!isTyping) {
      onSendMessage(suggestion)
      setMessage("")
    }
  }

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-4xl px-3 pt-2 pb-3 sm:px-4 sm:pt-3 sm:pb-4 safe-area-inset-bottom">
        {/* Contextual Suggestions */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground active:scale-95 touch-manipulation"
              disabled={isTyping}
              type="button"
            >
              {suggestion}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
            placeholder="Posez votre question ici..."
            className="min-h-[52px] max-h-[120px] sm:max-h-[150px] resize-none pr-14 text-base leading-snug"
            disabled={isTyping}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />

          <div className="absolute bottom-2 right-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {message.length}/{maxLength}
            </span>
            <Button
              type="submit"
              size="icon"
              disabled={!message.trim() || isTyping}
              className="h-9 w-9 touch-manipulation shrink-0"
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Envoyer</span>
            </Button>
          </div>
        </form>

        <p className="mt-1.5 text-center text-xs text-muted-foreground hidden sm:block">
          Appuyez sur Entrée pour envoyer, Shift + Entrée pour une nouvelle ligne
        </p>
      </div>
    </div>
  )
}
