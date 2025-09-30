"use client"

import { useEffect, useRef } from "react"
import { Bot, User, ThumbsUp, ThumbsDown, Copy, ExternalLink, AlertCircle } from "lucide-react"
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  return (
    <div className="h-full overflow-y-auto p-3 sm:p-4" ref={containerRef}>
      <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6 pb-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-2 sm:gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            {message.role === "assistant" && (
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent">
                <Bot className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
            )}

            <div className={`flex max-w-[85%] sm:max-w-[80%] flex-col gap-1.5 sm:gap-2 ${message.role === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-card text-card-foreground"
                }`}
              >
                {message.role === "assistant" ? (
                  <div className="prose prose-sm max-w-none dark:prose-invert text-sm sm:text-base">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm sm:text-base leading-relaxed">{message.content}</p>
                )}
              </div>

              {/* Confidence Badge */}
              {message.role === "assistant" && message.confidence && message.confidence < 80 && (
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-100">
                  <AlertCircle className="h-3 w-3" />
                  <span>Confiance: {message.confidence}% - Vérifiez les sources</span>
                </div>
              )}

              {/* Sources */}
              {message.role === "assistant" && message.sources && message.sources.length > 0 && (
                <div className="w-full space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Sources officielles :</p>
                  <div className="space-y-2">
                    {message.sources.map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        className="flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-3 text-left transition-colors hover:bg-muted"
                      >
                        <ExternalLink className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{source.title}</p>
                          <p className="text-xs text-muted-foreground">{source.reference}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {message.role === "assistant" && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => handleCopy(message.content)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <ThumbsUp className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 px-2">
                    <ThumbsDown className="h-3 w-3" />
                  </Button>
                </div>
              )}

              <span className="text-xs text-muted-foreground">
                {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>

            {message.role === "user" && (
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                <User className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary via-secondary to-accent">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3">
              <div className="flex gap-1">
                <div className="h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-secondary [animation-delay:-0.15s]" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-accent" />
              </div>
              <span className="text-sm text-muted-foreground">L'assistant tape...</span>
            </div>
          </div>
        )}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
