import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimitMiddleware } from '@/lib/utils/rate-limit'
import { IntelligentSearchAgent, WebSearchAgent, ExpertFormatterAgent } from '@/lib/ai/multi-agent-system'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Helper: Générer un ID d'ancre HTML
function generateAnchorId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Helper: Normaliser les mots ordinaux en chiffres
function normalizeOrdinalToNumber(text: string): string[] {
  const ordinalMap: { [key: string]: string } = {
    'premier': '1',
    'première': '1',
    'deuxième': '2',
    'deuxieme': '2',
    'second': '2',
    'seconde': '2',
    'troisième': '3',
    'troisieme': '3',
    'quatrième': '4',
    'quatrieme': '4',
    'cinquième': '5',
    'cinquieme': '5',
    'sixième': '6',
    'sixieme': '6',
    'septième': '7',
    'septieme': '7',
    'huitième': '8',
    'huitieme': '8',
    'neuvième': '9',
    'neuvieme': '9',
    'dixième': '10',
    'dixieme': '10',
  }

  const variations: string[] = [text]
  const lowerText = text.toLowerCase()

  // Remplacer ordinaux par chiffres
  Object.entries(ordinalMap).forEach(([ordinal, number]) => {
    if (lowerText.includes(ordinal)) {
      variations.push(text.replace(new RegExp(ordinal, 'gi'), number))
      variations.push(text.replace(new RegExp(ordinal, 'gi'), 'PREMIER')) // Pour article premier
    }
  })

  // Ajouter variation "article X" si contient un chiffre
  const numberMatch = lowerText.match(/\d+/)
  if (numberMatch) {
    const num = parseInt(numberMatch[0])
    if (num === 1) {
      variations.push('article premier')
      variations.push('ARTICLE PREMIER')
    }
  }

  return [...new Set(variations)] // Retirer les doublons
}

// Function to search the web using Google Custom Search API
async function searchWeb(query: string): Promise<string> {
  if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
    return ''
  }

  try {
    const searchQuery = `${query} Cameroun procédure administrative`
    const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&num=3`

    const response = await fetch(url)
    const data = await response.json()

    if (!data.items || data.items.length === 0) {
      return ''
    }

    let webContext = '\n\n## Informations trouvées sur le web:\n\n'
    data.items.slice(0, 3).forEach((item: any, index: number) => {
      webContext += `${index + 1}. **${item.title}**\n`
      webContext += `   ${item.snippet}\n`
      webContext += `   Source: ${item.link}\n\n`
    })

    return webContext
  } catch (error) {
    console.error('Web search error:', error)
    return ''
  }
}

export async function POST(request: Request) {
  // Rate limiting: 20 requêtes par minute par IP
  const rateLimitResponse = await rateLimitMiddleware(request, {
    interval: 60 * 1000, // 1 minute
    uniqueTokenPerInterval: 20, // 20 requêtes max
  })

  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const body = await request.json()
    let { message, conversationHistory, conversationId, sessionId } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message invalide' },
        { status: 400 }
      )
    }

    // FIX ENCODAGE: Normaliser UTF-8 dès l'entrée
    message = message.normalize('NFC') // Canonical composition

    const supabase = await createClient()
    const startTime = Date.now()

    // =====================================================
    // SYSTÈME MULTI-AGENTS À 3 NIVEAUX
    // =====================================================

    // Agent 1: Recherche locale (procédures + articles)
    const searchAgent = new IntelligentSearchAgent(supabase)
    const searchContext = await searchAgent.search(message)

    // Agent 2: Recherche web en parallèle

    const webAgent = new WebSearchAgent()
    let webSearchResults = []

    // Activer la recherche web dans ces cas:
    // 1. Question de type procédure (pour comparer avec les données locales)
    // 2. Aucune source locale trouvée (articles + procédures = 0)
    const shouldSearchWeb =
      searchContext.questionType === 'procedure' ||
      (searchContext.articles.length === 0 && searchContext.procedures.length === 0)

    if (shouldSearchWeb) {
      webSearchResults = await webAgent.search(message, searchContext.questionType)

      // Comparer avec les données locales si procédures disponibles
      if (searchContext.procedures.length > 0 && webSearchResults.length > 0) {
        webAgent.compareWithLocal(webSearchResults, searchContext.procedures)
      }
    }

    // Ajouter les résultats web au contexte
    searchContext.webSearchResults = webSearchResults

    // 4. Construire l'historique de conversation
    let chatHistory: Array<{ role: string; parts: Array<{ text: string }> }> = []

    if (conversationHistory && Array.isArray(conversationHistory)) {
      chatHistory = conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    }

    // Agent 3: Génération de réponse formatée avec comparaison
    const formatterAgent = new ExpertFormatterAgent()
    const responseText = await formatterAgent.generateResponse(
      message,
      searchContext,
      chatHistory
    )

    // 7. Extraire les sources citées de la réponse
    const sources = formatterAgent.extractSources(responseText, searchContext)

    // Ajouter les procédures au tableau de sources
    searchContext.procedures.forEach((proc: any) => {
      const procName = proc.name.toLowerCase()
      const directMention = responseText.toLowerCase().includes(procName) ||
        (procName.includes('cni') && responseText.toLowerCase().includes('cni')) ||
        (procName.includes('passeport') && responseText.toLowerCase().includes('passeport'))

      const alreadyAdded = sources.some(s => s.url === `/procedures/${proc.slug}`)

      if (directMention && !alreadyAdded && sources.length < 6) {
        sources.push({
          title: proc.name,
          reference: `📋 Procédure locale | Coût: ${proc.costs || 'N/A'} | Durée: ${proc.duration || 'N/A'}`,
          url: `/procedures/${proc.slug}`
        })
      }
    })

    // Ajouter les sources web si mentionnées dans la réponse
    searchContext.webSearchResults.forEach((webResult: any) => {
      const sourceMentioned = responseText.toLowerCase().includes(webResult.source.toLowerCase()) ||
        responseText.toLowerCase().includes(webResult.title.toLowerCase().substring(0, 30))

      const alreadyAdded = sources.some(s => s.url === webResult.link)

      if (sourceMentioned && !alreadyAdded && sources.length < 6) {
        sources.push({
          title: `🌐 ${webResult.title}`,
          reference: `Source web: ${webResult.source}`,
          url: webResult.link
        })
      }
    })

    // 🔴 GARANTIR AU MOINS UNE SOURCE
    // Si aucune source extraite mais on a des résultats web, ajouter source web générique
    if (sources.length === 0 && searchContext.webResults) {
      sources.push({
        title: 'Recherche web',
        reference: 'Sources en ligne sur le Cameroun',
        url: '#web-search-results'
      })
    }

    // Si vraiment AUCUNE source (cas extrême), ajouter source générique
    if (sources.length === 0) {
      sources.push({
        title: 'Connaissances générales',
        reference: 'Informations générales sur le Cameroun',
        url: '#general-knowledge'
      })
    }

    // 8. Calculer le niveau de confiance de manière dynamique
    let confidence = 50 // Base minimale

    // +10 points par source (max 3 sources = +30)
    confidence += Math.min(sources.length * 10, 30)

    // +20 points si des articles validés sont trouvés
    if (searchContext.articles.length > 0) {
      confidence += 20
    }

    // +15 points si des procédures sont trouvées
    if (searchContext.procedures.length > 0) {
      confidence += 15
    }

    // -15 points si web search a été utilisée (données moins fiables)
    if (searchContext.webResults) {
      confidence -= 15
    }

    // Limiter entre 50% et 95%
    confidence = Math.max(50, Math.min(95, confidence))

    // 9. Enregistrer la conversation et les messages dans la BD
    const processingTime = Date.now() - startTime

    try {
      // Créer ou récupérer la conversation
      let dbConversationId = conversationId

      if (conversationId && sessionId) {
        // Vérifier si la conversation existe
        const { data: existingConv, error: checkError } = await supabase
          .from('Conversation')
          .select('id')
          .eq('id', conversationId)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('🔴 [DB] Error checking conversation:', checkError)
        }

        if (!existingConv) {
          // Créer une nouvelle conversation
          const { data: newConv, error: convError } = await supabase
            .from('Conversation')
            .insert({
              id: conversationId,
              sessionId: sessionId,
              language: 'FR',
              messageCount: 0
            })
            .select()
            .single()

          if (convError) {
            console.error('🔴 [DB] Conversation insert error:', convError)
          } else {
            dbConversationId = newConv.id
          }
        }
      }

      // Enregistrer le message utilisateur
      if (dbConversationId) {
        const { data: userMsg, error: userMsgError } = await supabase
          .from('Message')
          .insert({
            conversationId: dbConversationId,
            role: 'USER',
            content: message,
            language: 'FR'
          })
          .select()
          .single()

        if (userMsgError) {
          console.error('🔴 [DB] User message insert error:', userMsgError)
        }

        // Enregistrer le message assistant
        const { data: assistantMsg, error: assistantMsgError } = await supabase
          .from('Message')
          .insert({
            conversationId: dbConversationId,
            role: 'ASSISTANT',
            content: responseText,
            confidence: confidence,
            processingTime: processingTime,
            model: 'gemini-2.0-flash-exp',
            language: 'FR'
          })
          .select()
          .single()

        if (assistantMsgError) {
          console.error('🔴 [DB] Assistant message insert error:', assistantMsgError)
        }

        // Enregistrer les citations (sources)
        if (assistantMsg && sources.length > 0) {
          const citations = sources.map(source => ({
            messageId: assistantMsg.id,
            documentId: source.url.includes('/bibliotheque/')
              ? source.url.split('/bibliotheque/')[1]?.split('#')[0]
              : null,
            excerpt: source.title,
            reference: source.reference,
            relevance: 0.8
          })).filter(c => c.documentId) // Ne garder que les citations avec documentId

          if (citations.length > 0) {
            const { error: citationError } = await supabase.from('Citation').insert(citations)
            if (citationError) {
              console.error('🔴 [DB] Citation insert error:', citationError)
            }
          }
        }

        // Mettre à jour le compteur de messages de la conversation
        const { error: updateError } = await supabase
          .from('Conversation')
          .update({
            messageCount: (conversationHistory?.length || 0) + 2 // +2 pour user + assistant
          })
          .eq('id', dbConversationId)

        if (updateError) {
          console.error('🔴 [DB] Conversation update error:', updateError)
        }
      }
    } catch (dbError) {
      console.error('🔴 [DB] Database logging error:', dbError)
      console.error('🔴 [DB] Error stack:', (dbError as Error).stack)
      // Ne pas bloquer la réponse si l'enregistrement échoue
    }

    return NextResponse.json({
      response: responseText,
      sources: sources.slice(0, 6), // Max 6 sources (pour inclure web + local)
      confidence
    })

  } catch (error: any) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du traitement de votre demande', details: error.message },
      { status: 500 }
    )
  }
}