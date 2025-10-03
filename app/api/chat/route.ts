import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimitMiddleware } from '@/lib/utils/rate-limit'
import { IntelligentSearchAgent, ExpertFormatterAgent } from '@/lib/ai/multi-agent-system'

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
    const { message, conversationHistory, conversationId, sessionId } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message invalide' },
        { status: 400 }
      )
    }

    const supabase = await createClient()
    const startTime = Date.now()

    // =====================================================
    // SYSTÈME MULTI-AGENTS À 2 NIVEAUX
    // =====================================================

    console.log('🤖 [AGENT 1] Analyseur + Chercheur Intelligent - Démarrage...')

    // Agent 1: Recherche intelligente avec validation
    const searchAgent = new IntelligentSearchAgent(supabase)
    const searchContext = await searchAgent.search(message)

    console.log('📊 [AGENT 1] Résultats:')
    console.log(`   - Type de question: ${searchContext.questionType}`)
    console.log(`   - Articles validés: ${searchContext.articles.length}`)
    console.log(`   - Procédures: ${searchContext.procedures.length}`)
    console.log(`   - Web results: ${searchContext.webResults ? 'Oui' : 'Non'}`)

    // 4. Construire l'historique de conversation
    let chatHistory: Array<{ role: string; parts: Array<{ text: string }> }> = []

    if (conversationHistory && Array.isArray(conversationHistory)) {
      chatHistory = conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    }

    console.log('🤖 [AGENT 2] Formateur Expert - Démarrage...')

    // Agent 2: Génération de réponse formatée
    const formatterAgent = new ExpertFormatterAgent()
    const responseText = await formatterAgent.generateResponse(
      message,
      searchContext,
      chatHistory
    )

    console.log('✅ [AGENT 2] Réponse générée')

    // 7. Extraire les sources citées de la réponse
    const sources = formatterAgent.extractSources(responseText, searchContext)

    // Ajouter les procédures au tableau de sources
    searchContext.procedures.forEach((proc: any) => {
      const procName = proc.name.toLowerCase()
      const directMention = responseText.toLowerCase().includes(procName) ||
        (procName.includes('cni') && responseText.toLowerCase().includes('cni')) ||
        (procName.includes('passeport') && responseText.toLowerCase().includes('passeport'))

      const alreadyAdded = sources.some(s => s.url === `/procedures/${proc.slug}`)

      if (directMention && !alreadyAdded && sources.length < 4) {
        sources.push({
          title: proc.name,
          reference: `Coût: ${proc.costs || 'N/A'} | Durée: ${proc.duration || 'N/A'}`,
          url: `/procedures/${proc.slug}`
        })
      }
    })

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

    // Log pour debug
    console.log('📊 [SOURCES] Sources finales:', sources.length)
    sources.forEach((s, i) => console.log(`  ${i + 1}. ${s.title} (${s.url})`))
    console.log('🎯 [CONFIDENCE] Niveau de confiance:', confidence + '%')

    // 9. Enregistrer la conversation et les messages dans la BD
    const processingTime = Date.now() - startTime

    try {
      console.log('🔵 [DB] Starting database recording...')
      console.log('🔵 [DB] conversationId:', conversationId)
      console.log('🔵 [DB] sessionId:', sessionId)

      // Créer ou récupérer la conversation
      let dbConversationId = conversationId

      if (conversationId && sessionId) {
        // Vérifier si la conversation existe
        console.log('🔵 [DB] Checking if conversation exists...')
        const { data: existingConv, error: checkError } = await supabase
          .from('Conversation')
          .select('id')
          .eq('id', conversationId)
          .single()

        if (checkError && checkError.code !== 'PGRST116') {
          console.error('🔴 [DB] Error checking conversation:', checkError)
        }

        if (!existingConv) {
          console.log('🔵 [DB] Creating new conversation...')
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
            console.error('🔴 [DB] Conversation error details:', JSON.stringify(convError, null, 2))
          } else {
            console.log('✅ [DB] Conversation created:', newConv)
            dbConversationId = newConv.id
          }
        } else {
          console.log('✅ [DB] Conversation already exists')
        }
      } else {
        console.warn('⚠️ [DB] Missing conversationId or sessionId')
      }

      // Enregistrer le message utilisateur
      if (dbConversationId) {
        console.log('🔵 [DB] Inserting user message...')
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
          console.error('🔴 [DB] User message error details:', JSON.stringify(userMsgError, null, 2))
        } else {
          console.log('✅ [DB] User message inserted:', userMsg?.id)
        }

        // Enregistrer le message assistant
        console.log('🔵 [DB] Inserting assistant message...')
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
          console.error('🔴 [DB] Assistant message error details:', JSON.stringify(assistantMsgError, null, 2))
        } else {
          console.log('✅ [DB] Assistant message inserted:', assistantMsg?.id)
        }

        // Enregistrer les citations (sources)
        if (assistantMsg && sources.length > 0) {
          console.log('🔵 [DB] Inserting citations...')
          const citations = sources.map(source => ({
            messageId: assistantMsg.id,
            documentId: source.url.includes('/bibliotheque/')
              ? source.url.split('/bibliotheque/')[1]?.split('#')[0]
              : null,
            excerpt: source.title,
            reference: source.reference,
            relevance: 0.8
          })).filter(c => c.documentId) // Ne garder que les citations avec documentId

          console.log('🔵 [DB] Citations to insert:', citations.length)

          if (citations.length > 0) {
            const { error: citationError } = await supabase.from('Citation').insert(citations)
            if (citationError) {
              console.error('🔴 [DB] Citation insert error:', citationError)
              console.error('🔴 [DB] Citation error details:', JSON.stringify(citationError, null, 2))
            } else {
              console.log('✅ [DB] Citations inserted:', citations.length)
            }
          }
        }

        // Mettre à jour le compteur de messages de la conversation
        console.log('🔵 [DB] Updating conversation message count...')
        const { error: updateError } = await supabase
          .from('Conversation')
          .update({
            messageCount: (conversationHistory?.length || 0) + 2 // +2 pour user + assistant
          })
          .eq('id', dbConversationId)

        if (updateError) {
          console.error('🔴 [DB] Conversation update error:', updateError)
          console.error('🔴 [DB] Conversation update error details:', JSON.stringify(updateError, null, 2))
        } else {
          console.log('✅ [DB] Conversation updated')
        }
      } else {
        console.warn('⚠️ [DB] No dbConversationId, skipping message recording')
      }

      console.log('✅ [DB] Database recording completed')
    } catch (dbError) {
      console.error('🔴 [DB] Database logging error:', dbError)
      console.error('🔴 [DB] Error stack:', (dbError as Error).stack)
      // Ne pas bloquer la réponse si l'enregistrement échoue
    }

    return NextResponse.json({
      response: responseText,
      sources: sources.slice(0, 4), // Max 4 sources
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