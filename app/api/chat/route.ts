import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(request: Request) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message invalide' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1. Rechercher des documents pertinents
    const { data: documents } = await supabase
      .from('Document')
      .select('title, reference, content, type, category')
      .eq('status', 'ACTIVE')
      .limit(3)

    // 2. Rechercher des procédures pertinentes
    const { data: procedures } = await supabase
      .from('Procedure')
      .select('name, description, steps, documents, costs, duration')
      .limit(3)

    // 3. Construire le contexte pour Gemini
    let context = '# CONTEXTE JURIDIQUE ET ADMINISTRATIF DU CAMEROUN\n\n'

    if (documents && documents.length > 0) {
      context += '## Documents juridiques disponibles:\n'
      documents.forEach(doc => {
        context += `- ${doc.title} (${doc.type})\n`
        context += `  Catégorie: ${doc.category}\n`
        context += `  Référence: ${doc.reference || 'N/A'}\n\n`
      })
    }

    if (procedures && procedures.length > 0) {
      context += '## Procédures administratives disponibles:\n'
      procedures.forEach(proc => {
        context += `- ${proc.name}\n`
        context += `  Description: ${proc.description}\n`
        context += `  Durée: ${proc.duration}\n\n`
      })
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
      systemInstruction: `Tu es l'Assistant National du Cameroun, un assistant IA spécialisé dans le droit et les procédures administratives camerounaises.

**Ton rôle:**
- Aider les citoyens avec les démarches administratives (CNI, passeport, actes d'état civil, etc.)
- Expliquer les lois et réglementations camerounaises
- Guider les utilisateurs à travers les procédures administratives
- Fournir des informations précises basées sur les documents officiels

**Règles importantes:**
1. Réponds UNIQUEMENT en français
2. Sois précis et cite les références légales quand possible
3. Si tu n'es pas sûr, dis-le clairement
4. Fournis des réponses structurées et faciles à comprendre
5. Utilise le contexte fourni pour répondre avec précision
6. Indique toujours les coûts, délais et documents requis pour les procédures

${context}

**Format de réponse:**
- Utilise des listes à puces pour les étapes
- Mets en **gras** les informations importantes
- Cite les sources et références légales
- Sois concis mais complet`
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

    if (documents) {
      documents.forEach(doc => {
        if (responseText.includes(doc.title) || (doc.reference && responseText.includes(doc.reference))) {
          sources.push({
            title: doc.title,
            reference: doc.reference || '',
            url: `/bibliotheque/${doc.title.toLowerCase().replace(/\s+/g, '-')}`
          })
        }
      })
    }

    if (procedures) {
      procedures.forEach(proc => {
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