"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isTyping: boolean
}

const CONTEXTUAL_SUGGESTIONS = [
  "Quels sont les délais ?",
  "Combien ça coûte ?",
  "Où dois-je aller ?",
  "Quels documents apporter ?",
]

export function ChatInput({ onSendMessage, isTyping }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const maxLength = 1000

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
    setMessage(suggestion)
    textareaRef.current?.focus()
  }

  return (
    <div className="w-full bg-background">
      <div className="mx-auto max-w-4xl p-3 sm:p-4">
        {/* Contextual Suggestions */}
        <div className="mb-2 sm:mb-3 flex flex-wrap gap-1.5 sm:gap-2">
          {CONTEXTUAL_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              className="rounded-full border border-border bg-background px-2.5 sm:px-3 py-1 text-xs text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              disabled={isTyping}
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
            className="min-h-[56px] sm:min-h-[60px] max-h-[150px] sm:max-h-[200px] resize-none pr-20 sm:pr-24 text-sm sm:text-base"
            disabled={isTyping}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
          />

          <div className="absolute bottom-2 right-2 flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {message.length}/{maxLength}
            </span>
            <Button type="submit" size="icon" disabled={!message.trim() || isTyping} className="h-8 w-8 sm:h-9 sm:w-9">
              <Send className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="sr-only">Envoyer</span>
            </Button>
          </div>
        </form>

        <p className="mt-1.5 sm:mt-2 text-center text-xs text-muted-foreground hidden sm:block">
          Appuyez sur Entrée pour envoyer, Shift + Entrée pour une nouvelle ligne
        </p>
      </div>
    </div>
  )
}
