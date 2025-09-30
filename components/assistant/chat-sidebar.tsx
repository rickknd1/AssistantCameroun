"use client"

import { Plus, MessageSquare, X, Menu, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Conversation } from "./chat-interface"

interface ChatSidebarProps {
  conversations: Conversation[]
  isOpen: boolean
  onToggle: () => void
  onNewConversation: () => void
}

export function ChatSidebar({ conversations, isOpen, onToggle, onNewConversation }: ChatSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden" onClick={onToggle} />}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-80 border-r border-border bg-card transition-transform lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-lg font-semibold text-card-foreground">Conversations</h2>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggle}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* New Conversation Button */}
          <div className="p-4">
            <Button onClick={onNewConversation} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Nouvelle conversation
            </Button>
          </div>

          {/* Filter */}
          <div className="px-4 pb-4">
            <Select defaultValue="all">
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="identite">Identité</SelectItem>
                <SelectItem value="entreprise">Entreprise</SelectItem>
                <SelectItem value="juridique">Juridique</SelectItem>
                <SelectItem value="foncier">Foncier</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Conversations List */}
          <ScrollArea className="flex-1 px-4">
            <div className="space-y-2 pb-4">
              {conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  className="flex w-full flex-col gap-1 rounded-lg border border-border bg-background p-3 text-left transition-colors hover:bg-muted"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2">
                      <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span className="line-clamp-1 text-sm font-medium text-foreground">{conversation.title}</span>
                    </div>
                  </div>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{conversation.lastMessage}</p>
                  <div className="flex items-center justify-between">
                    {conversation.category && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        {conversation.category}
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(conversation.timestamp).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>

      {/* Mobile toggle button */}
      {!isOpen && (
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-20 left-4 z-40 h-12 w-12 rounded-full shadow-lg lg:hidden bg-transparent"
          onClick={onToggle}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
    </>
  )
}
