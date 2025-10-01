"use client"

import { useState } from "react"
import { Plus, MessageSquare, X, Compass, History, FileText, Building2, Scale, Home, GraduationCap, ChevronLeft, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import type { Conversation } from "./chat-interface"
import { QUESTIONS_BANK } from "@/lib/data/questions-bank"
import { useLanguage } from "@/lib/i18n"

interface ChatSidebarProps {
  conversations: Conversation[]
  isOpen: boolean
  onToggle: () => void
  onNewConversation: () => void
  onQuestionClick: (question: string) => void
}

const CATEGORY_ICONS: Record<string, any> = {
  'identite': FileText,
  'entreprise': Building2,
  'juridique': Scale,
  'foncier': Home,
  'education': GraduationCap,
  'sante': Heart,
}

export function ChatSidebar({ conversations, isOpen, onToggle, onNewConversation, onQuestionClick }: ChatSidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const { t } = useLanguage()

  // Filtrer questions par recherche
  const selectedCat = QUESTIONS_BANK.find(c => c.id === selectedCategory)
  const filteredQuestions = selectedCat
    ? selectedCat.questions.filter(q =>
        q.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []

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
            <h2 className="text-lg font-semibold text-card-foreground">{t('assistant.sidebar.title')}</h2>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={onToggle}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* New Conversation Button */}
          <div className="p-4 pb-2">
            <Button onClick={onNewConversation} className="w-full touch-manipulation">
              <Plus className="mr-2 h-4 w-4" />
              {t('assistant.sidebar.newConversation')}
            </Button>
          </div>

          {/* Tabs: Mes Questions vs Explorer */}
          <Tabs defaultValue="explorer" className="flex-1 flex flex-col min-h-0">
            <TabsList className="mx-4 mb-2 grid w-[calc(100%-2rem)] grid-cols-2">
              <TabsTrigger value="history" className="text-xs">
                <History className="h-3.5 w-3.5 mr-1.5" />
                {t('assistant.sidebar.myQuestions')}
              </TabsTrigger>
              <TabsTrigger value="explorer" className="text-xs">
                <Compass className="h-3.5 w-3.5 mr-1.5" />
                {t('assistant.sidebar.explorer')}
              </TabsTrigger>
            </TabsList>

            {/* Onglet 1: Mes Questions (Historique) */}
            <TabsContent value="history" className="flex-1 overflow-hidden m-0">
              <ScrollArea className="h-full px-4">
                {conversations.length === 0 ? (
                  <div className="py-8 text-center">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                    <p className="text-sm text-muted-foreground">{t('assistant.sidebar.noConversations')}</p>
                    <p className="text-xs text-muted-foreground mt-1">{t('assistant.sidebar.startDiscussion')}</p>
                  </div>
                ) : (
                  <div className="space-y-2 pb-4">
                    {conversations.map((conversation) => (
                      <button
                        key={conversation.id}
                        className="flex w-full flex-col gap-1 rounded-lg border border-border bg-background p-2.5 text-left transition-colors hover:bg-muted active:scale-[0.98] touch-manipulation"
                      >
                        <div className="flex items-start gap-2">
                          <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="line-clamp-2 text-xs font-medium text-foreground">{conversation.title}</span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          {conversation.category && (
                            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">
                              {conversation.category}
                            </span>
                          )}
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(conversation.timestamp).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            {/* Onglet 2: Explorer (263 questions) */}
            <TabsContent value="explorer" className="flex-1 overflow-hidden m-0">
              {!selectedCategory ? (
                // Vue catégories
                <ScrollArea className="h-full px-4">
                  <div className="space-y-2 pb-4">
                    <p className="text-xs text-muted-foreground mb-3">{t('assistant.sidebar.chooseCategory')}</p>
                    {QUESTIONS_BANK.map((category) => {
                      const Icon = CATEGORY_ICONS[category.id] || FileText
                      return (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.id)
                            setSearchQuery("")
                          }}
                          className={`flex w-full items-center gap-3 rounded-lg border border-border ${category.bgColor} p-3 text-left transition-all hover:shadow-md active:scale-[0.98] touch-manipulation`}
                        >
                          <Icon className={`h-5 w-5 shrink-0 ${category.color}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground">{category.name}</p>
                            <p className="text-xs text-muted-foreground">{category.questions.length} questions</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </ScrollArea>
              ) : (
                // Vue questions de la catégorie
                <div className="flex flex-col h-full">
                  {/* Header catégorie */}
                  <div className="px-4 pb-3 space-y-2">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="flex items-center gap-1 text-xs text-primary hover:underline touch-manipulation"
                    >
                      <ChevronLeft className="h-3 w-3" />
                      {t('assistant.sidebar.backToCategories')}
                    </button>
                    <h3 className="text-sm font-semibold text-foreground">{selectedCat?.name}</h3>

                    {/* Recherche dans la catégorie */}
                    <Input
                      type="search"
                      placeholder={t('assistant.sidebar.search')}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  {/* Liste questions */}
                  <ScrollArea className="flex-1 px-4">
                    <div className="space-y-1.5 pb-4">
                      {filteredQuestions.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">{t('assistant.sidebar.noQuestionsFound')}</p>
                      ) : (
                        filteredQuestions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              onQuestionClick(question)
                              onToggle() // Fermer sidebar sur mobile
                            }}
                            className="w-full text-left p-2 rounded-lg hover:bg-muted text-xs text-foreground transition-colors active:scale-[0.98] touch-manipulation"
                          >
                            {question}
                          </button>
                        ))
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </aside>
    </>
  )
}
