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
  RefreshCw
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

export function AdminDashboard() {
  const [dailyStats, setDailyStats] = useState<DailyStat[]>([])
  const [popularSearches, setPopularSearches] = useState<PopularSearch[]>([])
  const [recentAnalytics, setRecentAnalytics] = useState<Analytics[]>([])
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
          <Tabs defaultValue="stats" className="space-y-4">
            <TabsList>
              <TabsTrigger value="stats">Statistiques quotidiennes</TabsTrigger>
              <TabsTrigger value="searches">Recherches populaires</TabsTrigger>
              <TabsTrigger value="events">Événements récents</TabsTrigger>
            </TabsList>

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
