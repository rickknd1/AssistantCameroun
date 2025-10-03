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
    const keywords: string[] = []

    // Extraire les numéros d'articles avec référence au document
    const articleMatches = message.match(/article\s+(\d+|premier|première)/gi)

    if (articleMatches) {
      articleMatches.forEach(match => {
        keywords.push(match)
        // Ajouter variations
        if (match.toLowerCase().includes('premier')) {
          keywords.push('article 1', 'art. 1', 'article premier', 'ARTICLE PREMIER')
        }
      })
    }

    // Détecter le document cible (IMPORTANT!)
    const documentKeywords: { [key: string]: string[] } = {
      'constitution': ['Constitution', 'constitution', 'constitutionnelle'],
      'code pénal': ['pénal', 'penal', 'pénale', 'penale', 'criminel'],
      'code civil': ['civil', 'civile'],
      'code du travail': ['travail', 'travailleur', 'employeur'],
      'loi de finances': ['finances', 'budget', 'budgétaire']
    }

    // Ajouter le document détecté en priorité
    Object.entries(documentKeywords).forEach(([docName, docKeys]) => {
      if (docKeys.some(key => normalized.includes(key))) {
        keywords.unshift(docName) // Ajouter en premier (priorité)
      }
    })

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

    // Détecter le document cible prioritaire
    const targetDocument = keywords.find(k =>
      ['constitution', 'code pénal', 'code civil', 'code du travail', 'loi de finances'].includes(k.toLowerCase())
    )

    console.log('📄 Document cible détecté:', targetDocument || 'aucun')

    // Construire les conditions de recherche
    const sectionKeywords = keywords.filter(k => k !== targetDocument)
    const sectionConditions = sectionKeywords.map(k =>
      `title.ilike.%${k}%,content.ilike.%${k}%,reference.ilike.%${k}%`
    ).join(',')

    // 1. Rechercher les sections (articles spécifiques)
    let query = this.supabase
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

    // Si un document cible est détecté, filtrer par ce document
    if (targetDocument) {
      query = query.ilike('Document.title', `%${targetDocument}%`)
    }

    // Ajouter les conditions de recherche sur le contenu
    if (sectionConditions) {
      query = query.or(sectionConditions)
    }

    const { data: sections } = await query.limit(10)

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
      context += '## ⚠️ ARTICLES JURIDIQUES VALIDÉS - TU DOIS LES CITER AVEC LIENS ⚠️\n\n'
      context += '**INSTRUCTIONS CRITIQUES:**\n'
      context += '- Pour CHAQUE article listé ci-dessous, tu DOIS créer un lien markdown cliquable\n'
      context += '- Format EXACT: [Nom de l\'article](URL_EXACTE)\n'
      context += '- L\'URL exacte est fournie pour chaque article\n'
      context += '- Exemple: [Article 20 de la Constitution](/bibliotheque/constitution#article-20)\n\n'

      searchContext.articles.forEach((article, index) => {
        context += `### Article ${index + 1}:\n`
        context += `**Référence:** ${article.reference}\n`
        context += `**Document:** ${article.documentTitle}\n`
        context += `**Titre:** ${article.title}\n`
        context += `**Contenu:** ${article.content.substring(0, 500)}...\n`
        context += `**URL pour créer le lien:** ${article.url}\n`
        context += `**Format du lien:** [${article.reference}](${article.url})\n\n`
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

${context}

**TYPE DE QUESTION:** ${searchContext.questionType}
**NOMBRE D'ARTICLES TROUVÉS:** ${searchContext.articles.length}
**NOMBRE DE PROCÉDURES:** ${searchContext.procedures.length}

${searchContext.questionType === 'juridique' && searchContext.articles.length > 0 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  RÈGLE CRITIQUE - CITATIONS OBLIGATOIRES  ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu as ${searchContext.articles.length} articles validés dans le contexte ci-dessus.

🔴 TU DOIS ABSOLUMENT:
1. Citer AU MOINS 1 article avec un lien cliquable
2. Utiliser le format EXACT: [Nom de l'article](URL)
3. L'URL est fournie dans le contexte (champ "URL EXACTE À UTILISER")
4. Intégrer les liens DANS le texte, pas en liste à la fin

🔴 INTERDICTIONS ABSOLUES:
- ❌ NE DIS JAMAIS "l'article n'est pas disponible"
- ❌ NE DIS JAMAIS "je ne trouve pas l'article"
- ❌ NE DIS JAMAIS "lisez tout le code"
- ❌ Les articles SONT dans le contexte ci-dessus, UTILISE-LES!

✅ EXEMPLE DE RÉPONSE CORRECTE:
"Selon l'[Article 20 de la Constitution](/bibliotheque/constitution#article-20),
le Président de la République est élu au suffrage universel direct..."

✅ FORMAT OBLIGATOIRE:
[Référence - Titre](URL_EXACTE_DU_CONTEXTE)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}

**RÈGLES GÉNÉRALES:**
- Réponds en français
- Structure claire avec listes à puces si nécessaire
- **Gras** pour les informations importantes
- Sois précis et cite le contenu exact des articles`

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      systemInstruction
    })

    // Filtrer l'historique pour éviter les messages vides
    const validHistory = conversationHistory
      .filter((msg: any) => msg.content && msg.content.trim().length > 0)
      .map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }))

    const chat = model.startChat({
      history: validHistory
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
