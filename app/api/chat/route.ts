import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimitMiddleware } from '@/lib/utils/rate-limit'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

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
    const { message, conversationHistory } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message invalide' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Extract keywords from the message for better search
    const searchTerms = message.toLowerCase()

    // Extract key words for better matching
    const keywords = searchTerms
      .replace(/[?.,!]/g, '')
      .split(' ')
      .filter(word => word.length > 3) // Keep words longer than 3 chars
      .slice(0, 5) // Take max 5 keywords

    // Build search conditions for multiple keywords
    const searchConditions = keywords.map(keyword =>
      `title.ilike.%${keyword}%,content.ilike.%${keyword}%,category.ilike.%${keyword}%,description.ilike.%${keyword}%,name.ilike.%${keyword}%`
    ).join(',')

    // 1. Rechercher des documents pertinents avec recherche textuelle
    const { data: documents } = await supabase
      .from('Document')
      .select('title, reference, content, type, category')
      .eq('status', 'ACTIVE')
      .or(searchConditions || `title.ilike.%${searchTerms}%`)
      .limit(5)

    // Fallback: si aucun document trouvé, prendre les plus récents
    const { data: fallbackDocs } = documents && documents.length > 0
      ? { data: null }
      : await supabase
          .from('Document')
          .select('title, reference, content, type, category')
          .eq('status', 'ACTIVE')
          .order('createdAt', { ascending: false })
          .limit(5)

    const finalDocuments = documents && documents.length > 0 ? documents : fallbackDocs

    // 2. Rechercher des procédures pertinentes avec recherche textuelle
    const { data: procedures } = await supabase
      .from('Procedure')
      .select('name, description, steps, documents, costs, duration, category')
      .or(searchConditions || `name.ilike.%${searchTerms}%`)
      .limit(5)

    // Fallback: si aucune procédure trouvée, prendre les plus populaires
    const { data: fallbackProcs } = procedures && procedures.length > 0
      ? { data: null }
      : await supabase
          .from('Procedure')
          .select('name, description, steps, documents, costs, duration, category')
          .order('popularity', { ascending: false })
          .limit(5)

    const finalProcedures = procedures && procedures.length > 0 ? procedures : fallbackProcs

    // 2.5. Si peu de résultats, chercher sur le web
    let webResults = ''
    const hasEnoughData = (finalDocuments && finalDocuments.length >= 2) || (finalProcedures && finalProcedures.length >= 2)

    if (!hasEnoughData) {
      webResults = await searchWeb(message)
    }

    // 3. Construire le contexte pour Gemini
    let context = '# CONTEXTE JURIDIQUE ET ADMINISTRATIF DU CAMEROUN\n\n'

    if (finalDocuments && finalDocuments.length > 0) {
      context += '## Documents juridiques disponibles:\n'
      finalDocuments.forEach(doc => {
        context += `- ${doc.title} (${doc.type})\n`
        context += `  Catégorie: ${doc.category}\n`
        context += `  Référence: ${doc.reference || 'N/A'}\n`
        if (doc.content) {
          context += `  Contenu: ${doc.content.substring(0, 500)}...\n`
        }
        context += '\n'
      })
    }

    if (finalProcedures && finalProcedures.length > 0) {
      context += '## Procédures administratives disponibles:\n'
      finalProcedures.forEach(proc => {
        context += `- ${proc.name}\n`
        context += `  Description: ${proc.description}\n`
        context += `  Durée: ${proc.duration}\n`
        if (proc.steps) {
          context += `  Étapes: ${JSON.stringify(proc.steps)}\n`
        }
        if (proc.documents) {
          context += `  Documents requis: ${JSON.stringify(proc.documents)}\n`
        }
        if (proc.costs) {
          context += `  Coûts: ${JSON.stringify(proc.costs)}\n`
        }
        context += '\n'
      })
    }

    // 3.5. Ajouter les résultats web si disponibles
    if (webResults) {
      context += webResults
    }

    // 4. Construire l'historique de conversation
    let chatHistory: Array<{ role: string; parts: Array<{ text: string }> }> = []

    if (conversationHistory && Array.isArray(conversationHistory)) {
      chatHistory = conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    }

    // 5. Configurer le modèle Gemini
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction: `Tu es l'Assistant National du Cameroun, un assistant IA expert dans le droit et les procédures administratives camerounaises.

**Ton rôle:**
- Aider les citoyens avec les démarches administratives (CNI, passeport, actes d'état civil, etc.)
- Expliquer les lois et réglementations camerounaises
- Guider les utilisateurs à travers les procédures administratives
- Fournir des informations précises basées sur les documents officiels ET tes connaissances du Cameroun

**Règles STRICTES:**
1. Réponds TOUJOURS en français
2. UTILISE EN PRIORITÉ le contexte fourni ci-dessous s'il est pertinent
3. Si le contexte ne contient pas d'information pertinente, utilise tes connaissances générales sur les procédures administratives au Cameroun
4. NE DIS JAMAIS "Je ne dispose pas d'informations" - fournis toujours une réponse utile basée sur tes connaissances
5. Fournis des réponses structurées avec listes à puces pour les étapes
6. Indique les coûts, délais et documents requis (utilise le contexte en priorité, sinon tes connaissances générales)
7. Mets en **gras** les informations importantes
8. Si tu utilises le contexte, cite les sources. Sinon, indique les informations générales

${context}

**Format de réponse obligatoire:**
- Introduction courte expliquant la procédure (1-2 phrases)
- Liste à puces claire des documents/étapes requis
- Détails sur coûts approximatifs et durée estimée
- Conseils pratiques si pertinent
- Sois précis, complet et professionnel

**Important:** Même si le contexte est vide ou non pertinent, réponds quand même en utilisant tes connaissances sur les procédures administratives au Cameroun.`
    })

    // 6. Générer la réponse
    const chat = model.startChat({
      history: chatHistory
    })

    const result = await chat.sendMessage(message)
    const response = result.response
    const responseText = response.text()

    // 7. Identifier les sources citées
    const sources: Array<{
      title: string
      reference: string
      url: string
    }> = []

    if (finalDocuments) {
      finalDocuments.forEach(doc => {
        if (responseText.includes(doc.title) || (doc.reference && responseText.includes(doc.reference))) {
          sources.push({
            title: doc.title,
            reference: doc.reference || '',
            url: `/bibliotheque/${doc.title.toLowerCase().replace(/\s+/g, '-')}`
          })
        }
      })
    }

    if (finalProcedures) {
      finalProcedures.forEach(proc => {
        if (responseText.includes(proc.name)) {
          sources.push({
            title: proc.name,
            reference: `Durée: ${proc.duration}`,
            url: `/procedures/${proc.name.toLowerCase().replace(/\s+/g, '-')}`
          })
        }
      })
    }

    // 8. Calculer le niveau de confiance (basique)
    const confidence = sources.length > 0 ? 90 : 70

    return NextResponse.json({
      response: responseText,
      sources: sources.slice(0, 3), // Max 3 sources
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