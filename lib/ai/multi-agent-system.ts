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

    // Extraire les numéros d'articles avec référence au document - AMÉLIORÉ
    const articleMatches = message.match(/article\s+(\d+|premier|première|1er|1ère)/gi)

    if (articleMatches) {
      articleMatches.forEach(match => {
        keywords.push(match)
        // Extraire le numéro
        const numberMatch = match.match(/\d+/)
        if (numberMatch) {
          const num = numberMatch[0]
          // Ajouter multiples variations AVEC priorité haute
          keywords.unshift(`ARTICLE ${num}`) // Priorité maximale - exactement comme dans la BD
          keywords.push(`article ${num}`)
          keywords.push(`art. ${num}`)
          keywords.push(`art ${num}`)
          keywords.push(`Article ${num}`)
          keywords.push(`Art. ${num}`)
          keywords.push(`Art ${num}`)
        }
        // Variations pour "premier" / "1"
        if (match.toLowerCase().includes('premier') || match.toLowerCase().includes('1er') || match.includes(' 1')) {
          keywords.unshift('ARTICLE 1') // Priorité maximale
          keywords.push('article 1', 'art. 1', 'article premier', 'ARTICLE PREMIER', 'Article 1', 'art 1', 'Art. 1', 'Art 1')
        }
      })
    }

    // Détecter le document cible (IMPORTANT!)
    // Mapping des mots-clés vers les noms EXACTS des documents dans la BD
    const documentKeywords: { [key: string]: string[] } = {
      'constitution': ['constitution', 'constitutionnelle'],
      'code penal camerounais': ['pénal', 'penal', 'pénale', 'penale', 'criminel'],
      'code civil camerounais': ['civil', 'civile'],
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
   * Recherche intelligente dans la base de données - PARCOURS COMPLET
   * PRIORITÉ: Procédures > Articles juridiques > Web
   */
  async search(message: string): Promise<SearchContext> {
    const questionType = this.analyzeQuestionType(message)
    const keywords = this.extractKeywords(message)

    console.log('🔍 Recherche intelligente:', { questionType, keywords })

    // =====================================================
    // ÉTAPE 1: TOUJOURS CHERCHER DANS LES PROCÉDURES D'ABORD
    // =====================================================
    let procedures: any[] = []

    const procConditions = keywords.map(k =>
      `name.ilike.%${k}%,description.ilike.%${k}%,steps.ilike.%${k}%`
    ).join(',')

    const { data: procs } = await this.supabase
      .from('Procedure')
      .select('*')
      .or(procConditions)
      .limit(10)

    procedures = procs || []
    console.log(`📋 ${procedures.length} procédures trouvées`)

    // =====================================================
    // ÉTAPE 2: CHERCHER DANS LES DOCUMENTS JURIDIQUES
    // Seulement si:
    // - Aucune procédure trouvée OU
    // - Question explicitement juridique (article, code, loi)
    // =====================================================

    // Détecter le document cible prioritaire
    const targetDocument = keywords.find(k =>
      ['constitution', 'code penal camerounais', 'code civil camerounais', 'code du travail', 'loi de finances'].includes(k.toLowerCase())
    )

    console.log('📄 Document cible détecté:', targetDocument || 'aucun')

    let validatedArticles: ValidatedArticle[] = []

    // Chercher dans les articles juridiques SI:
    // - Pas de procédure trouvée OU question explicitement juridique
    const shouldSearchArticles = procedures.length === 0 || questionType === 'juridique'

    if (shouldSearchArticles) {
      // 2a. RECHERCHE CIBLÉE (si document spécifique détecté)
      if (targetDocument && keywords.length > 1) {
        const sectionKeywords = keywords.filter(k => k !== targetDocument)
        const conditions = sectionKeywords.map(k =>
          `reference.ilike.%${k}%,title.ilike.%${k}%,content.ilike.%${k}%`
        ).join(',')

        const { data: targetedSections } = await this.supabase
          .from('Section')
          .select(`
            id, title, content, reference, level, position, documentId,
            Document!inner(id, slug, title, type, category)
          `)
          .ilike('Document.title', `%${targetDocument}%`)
          .or(conditions)
          .order('level', { ascending: true })
          .limit(30)

        if (targetedSections && targetedSections.length > 0) {
          for (const section of targetedSections) {
            const validated = await this.validateSection(section as any as Section)
            if (validated.exists) validatedArticles.push(validated)
          }
        }
      }

      // 2b. RECHERCHE ÉLARGIE (si rien trouvé, chercher dans TOUS les documents)
      if (validatedArticles.length === 0) {
        console.log('🔄 Recherche élargie dans TOUS les documents juridiques...')

        const conditions = keywords.map(k =>
          `reference.ilike.%${k}%,title.ilike.%${k}%,content.ilike.%${k}%`
        ).join(',')

        const { data: allSections } = await this.supabase
          .from('Section')
          .select(`
            id, title, content, reference, level, position, documentId,
            Document!inner(id, slug, title, type, category)
          `)
          .or(conditions)
          .order('level', { ascending: true })
          .limit(50)

        if (allSections && allSections.length > 0) {
          for (const section of allSections) {
            const validated = await this.validateSection(section as any as Section)
            if (validated.exists) validatedArticles.push(validated)
          }
        }
      }

      console.log(`✅ ${validatedArticles.length} articles validés trouvés`)
    }

    // =====================================================
    // ÉTAPE 3: RECHERCHE WEB EN FALLBACK
    // =====================================================
    let webResults = ''
    if (validatedArticles.length === 0 && procedures.length === 0) {
      console.log('🌐 Activation recherche web fallback...')
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
   * PRIORITÉ: Procédures administratives en premier
   */
  buildContext(searchContext: SearchContext): string {
    let context = '# CONTEXTE JURIDIQUE ET ADMINISTRATIF DU CAMEROUN\n\n'

    // =====================================================
    // PRIORITÉ 1: PROCÉDURES ADMINISTRATIVES
    // =====================================================
    if (searchContext.procedures.length > 0) {
      context += '## 🔴 PROCÉDURES ADMINISTRATIVES OFFICIELLES - PRIORITÉ ABSOLUE 🔴\n\n'
      context += '**⚠️ INSTRUCTIONS CRITIQUES:**\n'
      context += '- Ces procédures contiennent les informations LES PLUS À JOUR\n'
      context += '- TOUJOURS utiliser ces informations EN PRIORITÉ\n'
      context += '- Si un conflit existe avec d\'autres documents, TOUJOURS privilégier les procédures\n'
      context += '- Les procédures reflètent la réalité administrative actuelle du Cameroun\n\n'

      searchContext.procedures.forEach(proc => {
        context += `### ✅ ${proc.name}\n`
        context += `- **Description:** ${proc.description}\n`
        if (proc.costs) context += `- **Coûts actuels:** ${proc.costs}\n`
        if (proc.duration) context += `- **Durée:** ${proc.duration}\n`
        if (proc.onlineUrl) context += `- **Plateforme en ligne:** ${proc.onlineUrl}\n`
        if (proc.steps) context += `- **Étapes:** ${proc.steps}\n`
        context += '\n'
      })
    }

    // =====================================================
    // PRIORITÉ 2: ARTICLES JURIDIQUES (si pertinent)
    // =====================================================
    if (searchContext.articles.length > 0) {
      context += '## ⚖️ ARTICLES JURIDIQUES VALIDÉS - TU DOIS LES CITER AVEC LIENS ⚖️\n\n'
      context += '**INSTRUCTIONS:**\n'
      context += '- Pour CHAQUE article listé ci-dessous, tu DOIS créer un lien markdown cliquable\n'
      context += '- Format EXACT: [Nom de l\'article](URL_EXACTE)\n'
      context += '- L\'URL exacte est fournie pour chaque article\n'
      context += '- Exemple: [Article 20 de la Constitution](/bibliotheque/constitution#article-20)\n'
      context += '- ⚠️ ATTENTION: Si ces articles contredisent les procédures ci-dessus, PRIVILÉGIER LES PROCÉDURES\n\n'

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

    // =====================================================
    // PRIORITÉ 3: RÉSULTATS WEB (fallback)
    // =====================================================
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

    const systemInstruction = `Tu es Cami, l'Assistant National du Cameroun, un expert juridique et administratif.

${context}

**TYPE DE QUESTION:** ${searchContext.questionType}
**NOMBRE D'ARTICLES TROUVÉS:** ${searchContext.articles.length}
**NOMBRE DE PROCÉDURES:** ${searchContext.procedures.length}
**RÉSULTATS WEB:** ${searchContext.webResults ? 'OUI' : 'NON'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔴  HIÉRARCHIE DES SOURCES - ORDRE DE PRIORITÉ  🔴
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. **PRIORITÉ ABSOLUE: PROCÉDURES ADMINISTRATIVES**
   - Les procédures contiennent les informations LES PLUS À JOUR
   - TOUJOURS utiliser les procédures EN PREMIER si disponibles
   - En cas de conflit avec d'autres sources, TOUJOURS privilégier les procédures

2. **SECONDAIRE: ARTICLES JURIDIQUES (Codes, Constitution, Lois)**
   - Utiliser seulement si:
     * Aucune procédure ne répond à la question OU
     * Question explicitement juridique (article, loi, code)
   - Si un article contredit une procédure, IGNORER l'article

3. **DERNIER RECOURS: Résultats web**
   - Utiliser seulement si aucune source locale disponible

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${searchContext.procedures.length > 0 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅  PROCÉDURES DISPONIBLES - À UTILISER EN PRIORITÉ  ✅
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu as ${searchContext.procedures.length} procédure(s) administrative(s) officielle(s).

🔴 INSTRUCTIONS CRITIQUES:
- TOUJOURS baser ta réponse sur ces procédures
- Utilise les informations exactes (coûts, durée, étapes)
- Ces informations sont À JOUR et reflètent la réalité actuelle
- NE PAS utiliser d'anciennes informations des codes si elles contredisent
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}

🔴 INTERDICTIONS ABSOLUES:
- ❌ NE DIS JAMAIS "Je n'ai pas d'informations"
- ❌ NE DIS JAMAIS "Je ne peux pas répondre"
- ❌ NE DIS JAMAIS "l'article n'est pas disponible"
- ❌ TU DOIS TOUJOURS FOURNIR UNE RÉPONSE

✅ OBLIGATION DE RÉPONSE:
1. Si tu as des PROCÉDURES dans le contexte → Utilise-les EN PRIORITÉ
2. Si tu as des articles juridiques (et pas de procédures) → Utilise-les avec liens
3. Si tu as des résultats web → Résume-les et cite la source web
4. Si tu n'as RIEN → Utilise tes connaissances générales sur le Cameroun
5. TOUJOURS fournir une réponse utile, JAMAIS dire "je ne sais pas"

${searchContext.questionType === 'juridique' && searchContext.articles.length > 0 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  CITATIONS POUR ARTICLES JURIDIQUES  ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu as ${searchContext.articles.length} articles validés dans le contexte.

🔴 FORMAT OBLIGATOIRE:
[Nom de l'article](URL_EXACTE_DU_CONTEXTE)

✅ EXEMPLE:
"Selon l'[Article 20 de la Constitution](/bibliotheque/constitution#article-20),
le Président de la République est élu au suffrage universel direct..."

⚠️ RAPPEL: Si des procédures sont aussi disponibles, PRIVILÉGIER LES PROCÉDURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}

${searchContext.webResults ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  UTILISATION DES RÉSULTATS WEB  ⚠️
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu as des résultats de recherche web. Utilise-les pour construire ta réponse.
Mentionne "Selon des sources en ligne" et résume les informations.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}

**RÈGLES GÉNÉRALES:**
- Réponds TOUJOURS en français
- Structure claire avec listes à puces si nécessaire
- **Gras** pour les informations importantes
- Sois précis et cite le contenu exact des sources prioritaires
- TOUJOURS fournir une réponse, JAMAIS refuser de répondre`

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
