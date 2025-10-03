"use client"

import { useEffect, useRef, useState } from "react"
import { Bot, User, ThumbsUp, ThumbsDown, Copy, Check, ExternalLink, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Message } from "./chat-interface"
import ReactMarkdown from "react-markdown"

interface ChatMessagesProps {
  messages: Message[]
  isTyping: boolean
}

export function ChatMessages({ messages, isTyping }: ChatMessagesProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleCopy = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedId(messageId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (error) {
      console.error('Erreur copie:', error)
    }
  }

  const handleFeedback = async (messageId: string, rating: number) => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          rating,
          type: rating >= 4 ? 'positive' : 'negative',
          page: 'assistant'
        })
      })
    } catch (error) {
      console.error('Feedback error:', error)
    }
  }

  return (
    <div className="h-full w-full overflow-y-auto px-3 py-4 sm:px-4 sm:py-6" ref={containerRef}>
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-5">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-2.5 sm:gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && (
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent">
                <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
              </div>
            )}

            <div className={`flex max-w-[85%] sm:max-w-[80%] flex-col gap-1 sm:gap-1.5 ${message.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`rounded-2xl px-2.5 py-2 sm:px-3 sm:py-2.5 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-card-foreground"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert text-xs sm:text-sm leading-relaxed">
                    <ReactMarkdown
                      components={{
                        a: ({ node, ...props }) => (
                          <a
                            {...props}
                            className="text-primary hover:text-primary/80 underline font-medium transition-colors"
                            target={props.href?.startsWith('http') ? '_blank' : '_self'}
                            rel={props.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                          />
                        )
                      }}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm leading-relaxed">{message.content}</p>
                )}
              </div>

              {/* Confidence Badge - Only for questions with sources (questions related to Cameroon/procedures) */}
              {message.role === "assistant" && message.confidence && message.sources && message.sources.length > 0 && (
                <div className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[10px] sm:text-xs ${
                  message.confidence >= 90
                    ? 'border-green-200 bg-green-50 text-green-900 dark:border-green-800 dark:bg-green-950 dark:text-green-100'
                    : message.confidence >= 75
                    ? 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-100'
                    : 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100'
                }`}>
                  <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span>Confiance: {message.confidence}%</span>
                </div>
              )}

              {/* Sources */}
              {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                <div className="w-full space-y-1 sm:space-y-1.5">
                  <p className="text-[10px] sm:text-xs font-medium text-muted-foreground">Sources :</p>
                  <div className="space-y-1.5">
                    {message.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        className="flex items-start gap-1.5 rounded-lg border border-border bg-muted/50 p-2 text-left transition-colors hover:bg-muted touch-manipulation"
                      >
                        <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{source.title}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{source.reference}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {message.role === "assistant" && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 touch-manipulation"
                    onClick={() => handleCopy(message.content, message.id)}
                  >
                    {copiedId === message.id ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 touch-manipulation" onClick={() => handleFeedback(message.id, 5)}>
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 touch-manipulation" onClick={() => handleFeedback(message.id, 1)}>
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <span className="text-[10px] sm:text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {message.role === "user" && (
              <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-2 sm:gap-3">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent">
              <Bot className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 rounded-2xl border border-border bg-card px-2.5 py-2 sm:px-3 sm:py-2.5">
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-secondary [animation-delay:-0.15s]" />
                <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 animate-bounce rounded-full bg-accent" />
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">Rédaction...</span>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
