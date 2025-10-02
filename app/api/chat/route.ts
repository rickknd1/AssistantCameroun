import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimitMiddleware } from '@/lib/utils/rate-limit'

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

    // Extract keywords from the message for better search
    const searchTerms = message.toLowerCase()

    // Normaliser le message pour détecter les variations d'articles
    const normalizedVariations = normalizeOrdinalToNumber(message)

    // Extract key words for better matching
    let keywords = searchTerms
      .replace(/[?.,!]/g, '')
      .split(' ')
      .filter(word => word.length > 3) // Keep words longer than 3 chars
      .slice(0, 5) // Take max 5 keywords

    // Ajouter les variations normalisées aux mots-clés
    normalizedVariations.forEach(variation => {
      const variationWords = variation.toLowerCase()
        .replace(/[?.,!]/g, '')
        .split(' ')
        .filter(word => word.length > 3)
      keywords = [...keywords, ...variationWords]
    })

    // Retirer les doublons
    keywords = [...new Set(keywords)].slice(0, 10) // Max 10 keywords avec variations

    // Build search conditions for SECTIONS (only has title, content, reference)
    const sectionSearchConditions = keywords.map(keyword =>
      `title.ilike.%${keyword}%,content.ilike.%${keyword}%,reference.ilike.%${keyword}%`
    ).join(',')

    // Build search conditions for DOCUMENTS (has category)
    const documentSearchConditions = keywords.map(keyword =>
      `title.ilike.%${keyword}%,content.ilike.%${keyword}%,category.ilike.%${keyword}%`
    ).join(',')

    // Build search conditions for PROCEDURES (has name, description)
    const procedureSearchConditions = keywords.map(keyword =>
      `name.ilike.%${keyword}%,description.ilike.%${keyword}%,category.ilike.%${keyword}%`
    ).join(',')

    // 1. Rechercher des SECTIONS pertinentes (granularité article par article)
    const { data: sections } = await supabase
      .from('Section')
      .select(`
        id,
        title,
        content,
        reference,
        level,
        position,
        documentId,
        Document!inner(id, slug, title, type, category, reference)
      `)
      .or(sectionSearchConditions || `title.ilike.%${searchTerms}%`)
      .limit(10)

    // Fallback: si aucune section trouvée, chercher dans les documents complets
    const { data: documents } = sections && sections.length > 0
      ? { data: null }
      : await supabase
          .from('Document')
          .select('id, slug, title, reference, content, type, category')
          .eq('status', 'ACTIVE')
          .or(documentSearchConditions || `title.ilike.%${searchTerms}%`)
          .limit(5)

    const finalDocuments = documents

    // 2. Rechercher des procédures pertinentes avec recherche textuelle
    const { data: procedures } = await supabase
      .from('Procedure')
      .select('slug, name, description, steps, documents, costs, duration, category, onlineUrl, formUrl, tips, faqs')
      .or(procedureSearchConditions || `name.ilike.%${searchTerms}%`)
      .limit(5)

    // NE PAS utiliser de fallback - seulement les procédures pertinentes
    const finalProcedures = procedures && procedures.length > 0 ? procedures : null

    // 2.5. Si peu de résultats, chercher sur le web
    let webResults = ''
    const hasEnoughData = (finalDocuments && finalDocuments.length >= 2) || (finalProcedures && finalProcedures.length >= 2)

    if (!hasEnoughData) {
      webResults = await searchWeb(message)
    }

    // 3. Construire le contexte pour Gemini avec SECTIONS (granulaires)
    let context = '# CONTEXTE JURIDIQUE ET ADMINISTRATIF DU CAMEROUN\n\n'

    // Générer un mapping des ancres pour les citations
    const anchorMap: Map<string, string> = new Map()

    if (sections && sections.length > 0) {
      context += '## Sections juridiques pertinentes (articles spécifiques):\n'
      sections.forEach((section: any) => {
        const doc = section.Document
        const anchorId = generateAnchorId(section.reference || section.title)
        const url = `/bibliotheque/${doc.slug}#${anchorId}`

        // Stocker pour les citations
        anchorMap.set(section.reference, url)

        context += `- **${section.title}** (${doc.title})\n`
        context += `  Document: ${doc.title} (${doc.type})\n`
        context += `  Référence citée: ${section.reference}\n`
        context += `  URL exacte: ${url}\n`
        context += `  Contenu: ${section.content.substring(0, 400)}...\n`
        context += '\n'
      })
    } else if (finalDocuments && finalDocuments.length > 0) {
      // Fallback sur documents complets
      context += '## Documents juridiques disponibles:\n'
      finalDocuments.forEach((doc: any) => {
        const url = `/bibliotheque/${doc.slug}`
        context += `- ${doc.title} (${doc.type})\n`
        context += `  Catégorie: ${doc.category}\n`
        context += `  Référence: ${doc.reference || 'N/A'}\n`
        context += `  URL: ${url}\n`
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
        context += `  Coûts: ${proc.costs || 'Non spécifié'}\n`
        context += `  Durée: ${proc.duration || 'Non spécifié'}\n`
        if (proc.onlineUrl) {
          context += `  **Plateforme officielle**: ${proc.onlineUrl}\n`
        }
        if (proc.steps) {
          context += `  Étapes: ${JSON.stringify(proc.steps)}\n`
        }
        if (proc.documents) {
          context += `  Documents requis: ${JSON.stringify(proc.documents)}\n`
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
8. **COMPRÉHENSION CONTEXTUELLE (TRÈS IMPORTANT):**
   - Comprends les équivalences: "article 1" = "article premier" = "premier article"
   - "deuxième article" = "article 2", "troisième article" = "article 3", etc.
   - Si l'utilisateur demande "l'article 1" et que tu trouves "Article PREMIER" dans le contexte, utilise-le!
   - Sois intelligent dans la correspondance entre ordinaux (premier, deuxième...) et chiffres (1, 2...)
9. **CITATIONS AVEC LIENS CLIQUABLES (OBLIGATOIRE - TRÈS IMPORTANT):**
   - Tu DOIS TOUJOURS citer des articles juridiques dans tes réponses avec des liens cliquables
   - Format EXACT obligatoire: [Article X du Code Y](/bibliotheque/slug#article-x)
   - Le contexte te donne l'URL exacte à utiliser (champ "URL exacte")
   - Exemples OBLIGATOIRES:
     * "Selon l'[Article 26 de la Constitution](/bibliotheque/constitution-de-la-republique-du-cameroun#article-26), ..."
     * "Comme stipulé dans l'[Article 1 du Code Pénal](/bibliotheque/code-penal-camerounais#article-1), ..."
     * "Conformément à l'[Article 34 du Code Civil](/bibliotheque/code-civil-camerounais#art-34), ..."
   - CHAQUE réponse juridique DOIT contenir AU MOINS 1-2 liens vers des articles spécifiques
   - Place les liens INLINE dans le texte (intégrés naturellement dans les phrases)
   - NE METS JAMAIS les liens en liste à la fin
   - Si tu cites un article, il DOIT être cliquable
10. **STYLE DE CITATION OBLIGATOIRE:**
   - Toujours introduire avec "Selon", "Conformément à", "Comme indiqué dans", "D'après"
   - Toujours préciser le document source: "Article X du [Nom du Code/Loi]"
   - Exemples: "Selon l'[Article 5 du Code du Travail](/bibliotheque/code-du-travail-au-cameroun#art-5), le salaire minimum..."

${context}

**Format de réponse obligatoire:**
- Introduction courte expliquant la procédure (1-2 phrases)
- Liste à puces claire des documents/étapes requis
- Détails sur coûts approximatifs et durée estimée
- **TOUJOURS mentionner la plateforme officielle si disponible** (ex: www.idcam.cm pour CNI, https://portal.passcam.cm/ pour passeport)
- Conseils pratiques si pertinent
- Sois précis, complet et professionnel

**INFORMATIONS OFFICIELLES CLÉS À TOUJOURS MENTIONNER:**
- **CNI (Carte Nationale d'Identité)**: Plateforme www.idcam.cm, 10 000 FCFA, 48 heures, validité 15 ans
- **Passeport**: Plateforme https://portal.passcam.cm/, 110 000 FCFA, 48 heures, validité 10 ans
- Si la "Plateforme officielle" est dans le contexte, MENTIONNE-LA SYSTÉMATIQUEMENT dans ta réponse

**Important:** Même si le contexte est vide ou non pertinent, réponds quand même en utilisant tes connaissances sur les procédures administratives au Cameroun.`
    })

    // 6. Générer la réponse
    const chat = model.startChat({
      history: chatHistory
    })

    const result = await chat.sendMessage(message)
    const response = result.response
    const responseText = response.text()

    // 7. Identifier les sources citées (depuis les sections ET les liens inline)
    const sources: Array<{
      title: string
      reference: string
      url: string
    }> = []

    // Extraire les liens markdown de la réponse
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const foundLinks = new Set<string>()
    let match

    while ((match = linkRegex.exec(responseText)) !== null) {
      const [, linkText, linkUrl] = match
      if (!foundLinks.has(linkUrl)) {
        foundLinks.add(linkUrl)

        // Trouver la section/document correspondant
        if (sections && sections.length > 0) {
          const section = sections.find((s: any) => {
            const anchorId = generateAnchorId(s.reference || s.title)
            const expectedUrl = `/bibliotheque/${s.Document.slug}#${anchorId}`
            return expectedUrl === linkUrl
          })

          if (section) {
            sources.push({
              title: section.title,
              reference: section.reference,
              url: linkUrl
            })
          }
        }
      }
    }

    // Ajouter les procédures citées UNIQUEMENT si réellement mentionnées dans la réponse
    if (finalProcedures && finalProcedures.length > 0) {
      finalProcedures.forEach((proc: any) => {
        // Extraire les mots-clés significatifs du nom (ignorer mots trop courts ou communs)
        const procKeywords = proc.name.toLowerCase()
          .split(/[\s-()]+/)
          .filter((w: string) => w.length > 4 && !['carte', 'document', 'acte'].includes(w))

        // Vérifier si AU MOINS 3 mots-clés du nom sont dans la réponse (seuil augmenté)
        const matchCount = procKeywords.filter((keyword: string) =>
          responseText.toLowerCase().includes(keyword)
        ).length

        // Vérifier si pas déjà ajouté
        const alreadyAdded = sources.some(s => s.url === `/procedures/${proc.slug}`)

        // Vérifier le slug exact ou des acronymes
        const slugMentioned = responseText.toLowerCase().includes(proc.slug.replace(/-/g, ' '))
        const procName = proc.name.toLowerCase()

        // Vérifier si le nom complet ou des parties clés sont mentionnés
        const directMention = responseText.toLowerCase().includes(procName) ||
          (procName.includes('cni') && responseText.toLowerCase().includes('cni')) ||
          (procName.includes('passeport') && responseText.toLowerCase().includes('passeport'))

        // Ajouter SEULEMENT si:
        // - Le nom complet est mentionné directement OU
        // - Au moins 3 mots-clés significatifs matchent OU
        // - Le slug complet est mentionné
        if ((directMention || matchCount >= 3 || slugMentioned) && !alreadyAdded && sources.length < 4) {
          sources.push({
            title: proc.name,
            reference: `Coût: ${proc.costs || 'N/A'} | Durée: ${proc.duration || 'N/A'}`,
            url: `/procedures/${proc.slug}`
          })
        }
      })
    }

    // Ajouter les documents complets UNIQUEMENT si mentionnés dans la réponse
    if (finalDocuments && finalDocuments.length > 0) {
      finalDocuments.forEach((doc: any) => {
        // Extraire les mots-clés significatifs du titre (ignorer mots courts ou communs)
        const docKeywords = doc.title.toLowerCase()
          .split(/[\s-,()]+/)
          .filter((w: string) => w.length > 5 && !['cameroun', 'republique', 'document'].includes(w))

        // Compter combien de mots-clés significatifs sont dans la réponse
        const matchCount = docKeywords.filter((keyword: string) =>
          responseText.toLowerCase().includes(keyword)
        ).length

        // Vérifier si référence exacte mentionnée
        const refMentioned = doc.reference && responseText.toLowerCase().includes(doc.reference.toLowerCase())

        // Vérifier si pas déjà ajouté
        const alreadyAdded = sources.some(s => s.url === `/bibliotheque/${doc.slug}`)

        // Vérifier si le titre complet ou des parties clés sont mentionnés
        const docTitle = doc.title.toLowerCase()
        const directMention = responseText.toLowerCase().includes(docTitle) ||
          (docTitle.includes('constitution') && responseText.toLowerCase().includes('constitution')) ||
          (docTitle.includes('code') && responseText.toLowerCase().includes('code'))

        // Ajouter SEULEMENT si:
        // - Le titre complet est mentionné directement OU
        // - Au moins 3 mots-clés significatifs matchent OU
        // - La référence exacte est mentionnée
        if ((directMention || matchCount >= 3 || refMentioned) && !alreadyAdded && sources.length < 4) {
          sources.push({
            title: doc.title,
            reference: doc.reference || doc.type || 'Document officiel',
            url: `/bibliotheque/${doc.slug}`
          })
        }
      })
    }

    // Ajouter les sources web si utilisées
    if (webResults && webResults.length > 0 && sources.length < 4) {
      webResults.slice(0, 4 - sources.length).forEach((result: any) => {
        if (result.url) {
          sources.push({
            title: result.title || 'Source web',
            reference: result.url,
            url: result.url
          })
        }
      })
    }

    // 8. Calculer le niveau de confiance de manière dynamique
    let confidence = 50 // Base minimale

    // +10 points par source (max 3 sources = +30)
    confidence += Math.min(sources.length * 10, 30)

    // +20 points si des documents officiels sont trouvés
    if (finalDocuments && finalDocuments.length > 0) {
      confidence += 20
    }

    // +15 points si des procédures sont trouvées
    if (finalProcedures && finalProcedures.length > 0) {
      confidence += 15
    }

    // +10 points si plusieurs mots-clés matchent
    if (keywords.length >= 3) {
      confidence += 10
    }

    // -15 points si web search a été utilisée (données moins fiables)
    if (webResults) {
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