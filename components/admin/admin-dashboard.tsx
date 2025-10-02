"use client"

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  BarChart3,
  MessageSquare,
  TrendingUp,
  Users,
  LogOut,
  Download,
  RefreshCw,
  MessageCircle,
  Check,
  Eye,
  Archive
} from 'lucide-react'

interface DailyStat {
  stat_date: string
  total_events: number
  unique_sessions: number
  conversations_started: number
  messages_sent: number
  avg_response_time: number
}

interface PopularSearch {
  query: string
  search_count: number
}

interface Analytics {
  event: string
  data: Record<string, any>
  created_at: string
  language: string
}

interface Feedback {
  id: string
  messageId: string | null
  rating: number
  comment: string | null
  categories: string | null
  status: 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'ARCHIVED'
  createdAt: string
}

export function AdminDashboard() {
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([])
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([])
  const [recentAnalytics, setRecentAnalytics] = useState<Analytics[]>([])
  const [feedbackList, setFeedbackList] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load daily stats
      const { data: stats } = await supabase
        .from('daily_stats')
        .select('*')
        .order('stat_date', { ascending: false })
        .limit(7)

      if (stats) setDailyStats(stats)

      // Load popular searches
      const { data: searches } = await supabase
        .from('popular_searches')
        .select('*')
        .limit(10)

      if (searches) setPopularSearches(searches)

      // Load recent analytics
      const { data: analytics } = await supabase
        .from('Analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (analytics) setRecentAnalytics(analytics)

      // Load feedback/remarks
      const { data: feedback } = await supabase
        .from('Feedback')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(100)

      if (feedback) setFeedbackList(feedback)

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const exportToCSV = (data: any[], filename: string) => {
    if (!data || data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const latestStats = dailyStats[0]
  const totalMessages = dailyStats.reduce((acc, stat) => acc + (stat.messages_sent || 0), 0)
  const totalConversations = dailyStats.reduce((acc, stat) => acc + (stat.conversations_started || 0), 0)
  const totalSessions = dailyStats.reduce((acc, stat) => acc + (stat.unique_sessions || 0), 0)

  // Feedback stats
  const newFeedbackCount = feedbackList.filter(f => f.status === 'NEW').length
  const inReviewFeedbackCount = feedbackList.filter(f => f.status === 'IN_REVIEW').length

  const updateFeedbackStatus = async (id: string, status: 'NEW' | 'IN_REVIEW' | 'RESOLVED' | 'ARCHIVED') => {
    try {
      const { error } = await supabase
        .from('Feedback')
        .update({ status })
        .eq('id', id)

      if (!error) {
        // Refresh data
        loadData()
      }
    } catch (error) {
      console.error('Error updating feedback status:', error)
    }
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'NEW': return 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20'
      case 'IN_REVIEW': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20'
      case 'RESOLVED': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20'
      case 'ARCHIVED': return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
      default: return 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NEW': return 'Nouveau'
      case 'IN_REVIEW': return 'En cours'
      case 'RESOLVED': return 'Résolu'
      case 'ARCHIVED': return 'Archivé'
      default: return status
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard Admin</h1>
            <p className="text-sm text-muted-foreground">AssistantCameroun Analytics</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages (7j)</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalMessages}</div>
                <p className="text-xs text-muted-foreground">
                  {latestStats?.messages_sent || 0} aujourd'hui
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversations (7j)</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalConversations}</div>
                <p className="text-xs text-muted-foreground">
                  {latestStats?.conversations_started || 0} aujourd'hui
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sessions (7j)</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalSessions}</div>
                <p className="text-xs text-muted-foreground">
                  {latestStats?.unique_sessions || 0} aujourd'hui
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Temps de réponse moy.</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestStats?.avg_response_time ? `${Math.round(latestStats.avg_response_time)}ms` : 'N/A'}
                </div>
                <p className="text-xs text-muted-foreground">
                  Aujourd'hui
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for detailed data */}
          <Tabs defaultValue="feedback" className="space-y-4">
            <TabsList>
              <TabsTrigger value="feedback" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                Remarques utilisateurs
                {newFeedbackCount > 0 && (
                  <span className="ml-1 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                    {newFeedbackCount}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="stats">Statistiques quotidiennes</TabsTrigger>
              <TabsTrigger value="searches">Recherches populaires</TabsTrigger>
              <TabsTrigger value="events">Événements récents</TabsTrigger>
            </TabsList>

            {/* Feedback/Remarks Tab */}
            <TabsContent value="feedback" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Remarques et suggestions des utilisateurs</CardTitle>
                      <CardDescription>
                        {feedbackList.length} remarques au total • {newFeedbackCount} nouvelles • {inReviewFeedbackCount} en cours
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadData()}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Actualiser
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportToCSV(feedbackList, 'feedback')}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Exporter CSV
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {feedbackList.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                        <p className="text-sm text-muted-foreground">Aucune remarque pour le moment</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {feedbackList.map((feedback) => (
                          <div
                            key={feedback.id}
                            className="rounded-lg border border-border bg-muted/30 p-4 space-y-3"
                          >
                            {/* Header with status and date */}
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadgeColor(feedback.status)}`}>
                                  {getStatusLabel(feedback.status)}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(feedback.createdAt).toLocaleString('fr-FR', {
                                    day: '2-digit',
                                    month: 'short',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                                {feedback.rating && (
                                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                    Note: {feedback.rating}/5 {feedback.rating >= 4 ? '👍' : feedback.rating <= 2 ? '👎' : ''}
                                  </span>
                                )}
                                {feedback.messageId && (
                                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                                    Message: {feedback.messageId.substring(0, 8)}...
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Message content */}
                            <div className="bg-background rounded-md p-3 border border-border">
                              <p className="text-sm text-foreground whitespace-pre-wrap">
                                {feedback.comment || 'Pas de commentaire'}
                              </p>
                            </div>

                            {/* Action buttons */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs text-muted-foreground mr-2">Actions:</span>
                              {feedback.status === 'NEW' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateFeedbackStatus(feedback.id, 'IN_REVIEW')}
                                  className="h-7 text-xs gap-1"
                                >
                                  <Eye className="h-3 w-3" />
                                  Examiner
                                </Button>
                              )}
                              {feedback.status === 'IN_REVIEW' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateFeedbackStatus(feedback.id, 'RESOLVED')}
                                  className="h-7 text-xs gap-1"
                                >
                                  <Check className="h-3 w-3" />
                                  Marquer résolu
                                </Button>
                              )}
                              {feedback.status !== 'ARCHIVED' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => updateFeedbackStatus(feedback.id, 'ARCHIVED')}
                                  className="h-7 text-xs gap-1"
                                >
                                  <Archive className="h-3 w-3" />
                                  Archiver
                                </Button>
                              )}
                              {feedback.status !== 'NEW' && (
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => updateFeedbackStatus(feedback.id, 'NEW')}
                                  className="h-7 text-xs gap-1"
                                >
                                  <RefreshCw className="h-3 w-3" />
                                  Réinitialiser
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Daily Stats Tab */}
            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Statistiques des 7 derniers jours</CardTitle>
                      <CardDescription>Vue d'ensemble de l'activité quotidienne</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(dailyStats, 'daily_stats')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Exporter CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {dailyStats.map((stat) => (
                        <div
                          key={stat.stat_date}
                          className="rounded-lg border border-border bg-muted/30 p-4"
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <h4 className="font-semibold text-foreground">
                              {new Date(stat.stat_date).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </h4>
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                            <div>
                              <p className="text-muted-foreground">Événements</p>
                              <p className="font-medium">{stat.total_events}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Sessions</p>
                              <p className="font-medium">{stat.unique_sessions}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Conversations</p>
                              <p className="font-medium">{stat.conversations_started}</p>
                            </div>
                            <div>
                              <p className="text-muted-foreground">Messages</p>
                              <p className="font-medium">{stat.messages_sent}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Popular Searches Tab */}
            <TabsContent value="searches" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Questions les plus fréquentes</CardTitle>
                      <CardDescription>Top 10 des recherches populaires</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(popularSearches, 'popular_searches')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Exporter CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {popularSearches.map((search, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between rounded-lg border border-border bg-muted/30 p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                              {index + 1}
                            </div>
                            <p className="text-sm font-medium text-foreground">{search.query}</p>
                          </div>
                          <span className="text-sm font-semibold text-muted-foreground">
                            {search.search_count} fois
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recent Events Tab */}
            <TabsContent value="events" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Événements récents</CardTitle>
                      <CardDescription>50 derniers événements trackés</CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportToCSV(recentAnalytics, 'recent_events')}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Exporter CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-2">
                      {recentAnalytics.map((event, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-border bg-muted/30 p-3"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                                  {event.event}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(event.created_at).toLocaleString('fr-FR')}
                                </span>
                              </div>
                              {Object.keys(event.data).length > 0 && (
                                <pre className="mt-2 text-xs text-muted-foreground overflow-x-auto">
                                  {JSON.stringify(event.data, null, 2)}
                                </pre>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
