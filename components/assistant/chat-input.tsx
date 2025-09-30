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
    <div className="w-full bg-background border-t border-border">
      <div className="mx-auto max-w-4xl px-3 pt-2 pb-3 sm:px-4 sm:pt-3 sm:pb-4">
        {/* Contextual Suggestions */}
        <div className="mb-2 flex flex-wrap gap-1.5">
          {CONTEXTUAL_SUGGESTIONS.map((suggestion) => (
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
