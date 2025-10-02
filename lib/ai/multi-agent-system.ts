/**
 * SYSTÈME MULTI-AGENTS À 2 NIVEAUX
 * Architecture optimisée pour le chatbot camerounais
 */

import { GoogleGenerativeAI } from '@google/generative-ai'
import type { SupabaseClient } from '@supabase/supabase-js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// =====================================================
// TYPES
// =====================================================

export interface Section {
  id: string
  title: string
  content: string
  reference: string
  level: number
  position: number
  documentId: string
  Document: {
    id: string
    slug: string
    title: string
    type: string
    category: string
  }
}

export interface ValidatedArticle {
  reference: string
  title: string
  content: string
  url: string
  documentTitle: string
  exists: boolean
}

export interface SearchContext {
  articles: ValidatedArticle[]
  procedures: any[]
  webResults: string
  questionType: 'juridique' | 'procedure' | 'generale'
}

// =====================================================
// AGENT 1: ANALYSEUR + CHERCHEUR INTELLIGENT
// =====================================================

export class IntelligentSearchAgent {
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  /**
   * Génère un ID d'ancre HTML
   */
  private generateAnchorId(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  /**
   * Valide qu'une section existe réellement
   */
  private async validateSection(section: Section): Promise<ValidatedArticle> {
    const anchorId = this.generateAnchorId(section.reference || section.title)
    const url = `/bibliotheque/${section.Document.slug}#${anchorId}`

    // Vérifier que la section existe vraiment
    const { data: exists } = await this.supabase
      .from('Section')
      .select('id')
      .eq('id', section.id)
      .single()

    return {
      reference: section.reference,
      title: section.title,
      content: section.content,
      url,
      documentTitle: section.Document.title,
      exists: !!exists
    }
  }

  /**
   * Analyse la question et détermine le type
   */
  private analyzeQuestionType(message: string): 'juridique' | 'procedure' | 'generale' {
    const lowerMessage = message.toLowerCase()

    // Mots-clés pour questions juridiques
    const juridiqueKeywords = [
      'article', 'code', 'loi', 'constitution', 'droit', 'juridique',
      'légal', 'réglementation', 'texte de loi'
    ]

    // Mots-clés pour procédures administratives
    const procedureKeywords = [
      'comment obtenir', 'procédure', 'démarche', 'cni', 'passeport',
      'acte de naissance', 'étapes', 'documents requis', 'coût', 'durée'
    ]

    if (juridiqueKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'juridique'
    }

    if (procedureKeywords.some(keyword => lowerMessage.includes(keyword))) {
      return 'procedure'
    }

    return 'generale'
  }

  /**
   * Extraction des mots-clés intelligente
   */
  private extractKeywords(message: string): string[] {
    const normalized = message.toLowerCase()

    // Extraire les numéros d'articles
    const articleMatches = message.match(/article\s+(\d+|premier|première)/gi)
    const keywords: string[] = []

    if (articleMatches) {
      articleMatches.forEach(match => {
        keywords.push(match)
        // Ajouter variations
        if (match.toLowerCase().includes('premier')) {
          keywords.push('article 1', 'art. 1', 'article premier', 'ARTICLE PREMIER')
        }
      })
    }

    // Ajouter mots-clés généraux
    const words = normalized
      .replace(/[?.,!]/g, '')
      .split(' ')
      .filter(word => word.length > 3)
      .slice(0, 10)

    return [...new Set([...keywords, ...words])]
  }

  /**
   * Recherche intelligente dans la base de données
   */
  async search(message: string): Promise<SearchContext> {
    const questionType = this.analyzeQuestionType(message)
    const keywords = this.extractKeywords(message)

    console.log('🔍 Recherche intelligente:', { questionType, keywords })

    // Construire les conditions de recherche
    const sectionConditions = keywords.map(k =>
      `title.ilike.%${k}%,content.ilike.%${k}%,reference.ilike.%${k}%`
    ).join(',')

    // 1. Rechercher les sections (articles spécifiques)
    const { data: sections } = await this.supabase
      .from('Section')
      .select(`
        id,
        title,
        content,
        reference,
        level,
        position,
        documentId,
        Document!inner(id, slug, title, type, category)
      `)
      .or(sectionConditions)
      .limit(10)

    // 2. Valider toutes les sections trouvées
    const validatedArticles: ValidatedArticle[] = []

    if (sections && sections.length > 0) {
      for (const section of sections) {
        const validated = await this.validateSection(section as Section)
        if (validated.exists) {
          validatedArticles.push(validated)
        }
      }
    }

    console.log(`✅ ${validatedArticles.length} articles validés trouvés`)

    // 3. Rechercher les procédures si pertinent
    let procedures: any[] = []
    if (questionType === 'procedure') {
      const procConditions = keywords.map(k =>
        `name.ilike.%${k}%,description.ilike.%${k}%`
      ).join(',')

      const { data: procs } = await this.supabase
        .from('Procedure')
        .select('*')
        .or(procConditions)
        .limit(5)

      procedures = procs || []
    }

    // 4. Recherche web en dernier recours
    let webResults = ''
    if (validatedArticles.length === 0 && procedures.length === 0) {
      webResults = await this.searchWeb(message)
    }

    return {
      articles: validatedArticles,
      procedures,
      webResults,
      questionType
    }
  }

  /**
   * Recherche web (fallback)
   */
  private async searchWeb(query: string): Promise<string> {
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
}

// =====================================================
// AGENT 2: FORMATEUR EXPERT
// =====================================================

export class ExpertFormatterAgent {
  /**
   * Construit le contexte structuré pour Gemini
   */
  buildContext(searchContext: SearchContext): string {
    let context = '# CONTEXTE JURIDIQUE ET ADMINISTRATIF DU CAMEROUN\n\n'

    // Articles validés
    if (searchContext.articles.length > 0) {
      context += '## Articles juridiques validés (avec liens directs):\n\n'
      searchContext.articles.forEach(article => {
        context += `**${article.reference}** - ${article.documentTitle}\n`
        context += `- URL exacte: ${article.url}\n`
        context += `- Contenu: ${article.content.substring(0, 500)}...\n\n`
      })
    }

    // Procédures
    if (searchContext.procedures.length > 0) {
      context += '## Procédures administratives:\n\n'
      searchContext.procedures.forEach(proc => {
        context += `**${proc.name}**\n`
        context += `- Description: ${proc.description}\n`
        if (proc.costs) context += `- Coûts: ${proc.costs}\n`
        if (proc.duration) context += `- Durée: ${proc.duration}\n`
        if (proc.onlineUrl) context += `- Plateforme: ${proc.onlineUrl}\n`
        context += '\n'
      })
    }

    // Résultats web
    if (searchContext.webResults) {
      context += searchContext.webResults
    }

    return context
  }

  /**
   * Génère la réponse finale formatée
   */
  async generateResponse(
    message: string,
    searchContext: SearchContext,
    conversationHistory: any[]
  ): Promise<string> {
    const context = this.buildContext(searchContext)

    const systemInstruction = `Tu es l'Assistant National du Cameroun, un expert juridique et administratif.

**RÈGLES ABSOLUES:**

1. **CITATIONS OBLIGATOIRES (Questions juridiques):**
   ${searchContext.questionType === 'juridique' ? `
   - Tu DOIS citer des articles avec des liens cliquables
   - Format EXACT: [Article X du Code Y](URL_EXACTE)
   - Les URLs sont fournies dans le contexte (champ "URL exacte")
   - Exemple: "Selon l'[Article 26 de la Constitution](/bibliotheque/constitution#article-26), ..."
   - MINIMUM 1-2 liens par réponse juridique
   ` : '- Pas besoin de liens pour ce type de question'}

2. **PRÉCISION:**
   - Cite le contenu EXACT de l'article
   - Ne dis JAMAIS "lisez tout le code"
   - Donne la réponse précise demandée

3. **ADAPTATION:**
   - Question juridique → Cite des articles avec liens
   - Question procédure → Étapes claires + plateforme officielle
   - Question générale → Réponse concise sans liens

4. **FORMAT:**
   - Réponds en français
   - Structure claire avec listes à puces
   - **Gras** pour les informations importantes

${context}

**Type de question détecté:** ${searchContext.questionType}
**Articles disponibles:** ${searchContext.articles.length}
**Procédures disponibles:** ${searchContext.procedures.length}`

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction
    })

    const chat = model.startChat({
      history: conversationHistory.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))
    })

    const result = await chat.sendMessage(message)
    return result.response.text()
  }

  /**
   * Extrait les sources citées de la réponse
   */
  extractSources(responseText: string, searchContext: SearchContext): Array<{
    title: string
    reference: string
    url: string
  }> {
    const sources: Array<{ title: string; reference: string; url: string }> = []
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const foundLinks = new Set<string>()
    let match

    while ((match = linkRegex.exec(responseText)) !== null) {
      const [, linkText, linkUrl] = match

      if (!foundLinks.has(linkUrl)) {
        foundLinks.add(linkUrl)

        // Trouver l'article correspondant
        const article = searchContext.articles.find(a => a.url === linkUrl)
        if (article) {
          sources.push({
            title: article.title,
            reference: article.reference,
            url: article.url
          })
        }
      }
    }

    return sources
  }
}
