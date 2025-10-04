/**
 * SYSTÈME MULTI-AGENTS À 3 NIVEAUX
 * Architecture optimisée pour le chatbot camerounais
 * Agent 1: Recherche locale (Procédures + Articles)
 * Agent 2: Recherche web temps réel
 * Agent 3: Formateur expert avec comparaison des sources
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

export interface WebSearchResult {
  title: string
  snippet: string
  link: string
  source: string
}

export interface SearchContext {
  articles: ValidatedArticle[]
  procedures: any[]
  webResults: string
  webSearchResults: WebSearchResult[]
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
      'légal', 'réglementation', 'texte de loi', 'décret', 'ordonnance'
    ]

    // Mots-clés pour procédures administratives
    const procedureKeywords = [
      'comment obtenir', 'procédure', 'démarche', 'cni', 'passeport',
      'acte de naissance', 'étapes', 'documents requis', 'coût', 'durée',
      'combien', 'prix', 'tarif', 'frais', 'obtenir', 'faire', 'demander',
      'besoin', 'nécessaire', 'où', 'quand', 'délai'
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
   * Calcule la similarité entre deux chaînes (algorithme Levenshtein simplifié)
   */
  private calculateSimilarity(str1: string, str2: string): number {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) return 1.0

    // Vérification de sous-chaîne
    if (longer.includes(shorter)) return 0.8

    // Calcul de distance simple
    let matches = 0
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) matches++
    }

    return (matches / longer.length) * 0.7
  }

  /**
   * Génère des variations de mots-clés pour recherche floue
   */
  private generateKeywordVariations(keyword: string): string[] {
    const variations = [keyword]

    // Si le mot est court (>3 chars), ajouter des variations partielles
    if (keyword.length > 3) {
      variations.push(keyword.substring(0, keyword.length - 1)) // Enlever dernière lettre
      variations.push(keyword.substring(0, keyword.length - 2)) // Enlever 2 dernières lettres
    }

    // Variations communes de typos pour mots camerounais
    const typoMap: { [key: string]: string[] } = {
      'passeport': ['passport', 'pasport', 'passepor'],
      'identite': ['identité', 'idantite', 'identiter'],
      'nationale': ['national', 'nationalle'],
      'penal': ['pénal', 'penale', 'pénale'],
      'cameroun': ['cameroon', 'camerun']
    }

    if (typoMap[keyword]) {
      variations.push(...typoMap[keyword])
    }

    return [...new Set(variations)]
  }

  /**
   * Extraction des mots-clés intelligente
   */
  private extractKeywords(message: string): string[] {
    // IMPORTANT: Normaliser d'abord, puis mettre en minuscules
    const normalized = message
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
    const keywords: string[] = []

    // Mapping des abréviations courantes
    const abbreviationMap: { [key: string]: string[] } = {
      'cni': ['Carte Nationale', 'Identité', 'CNI'],
      'passeport': ['passeport', 'Passeport'],
      'acte de naissance': ['acte', 'naissance']
    }

    // Ajouter les expansions des abréviations
    Object.entries(abbreviationMap).forEach(([abbrev, expansions]) => {
      if (normalized.includes(abbrev)) {
        keywords.push(...expansions)
      }
    })

    // Extraire les numéros d'articles de manière simplifiée
    const articleMatches = message.match(/article\s+(\d+|premier|première|1er|1ère)/gi)

    if (articleMatches) {
      articleMatches.forEach(match => {
        const numberMatch = match.match(/\d+/)
        if (numberMatch) {
          const num = numberMatch[0]
          keywords.push(`article ${num}`)
          keywords.push(`art ${num}`)
        }
        // Variations pour "premier" / "1"
        if (match.toLowerCase().includes('premier') || match.toLowerCase().includes('1er')) {
          keywords.push('article 1')
          keywords.push('article premier')
        }
      })
    }

    // Détecter le document cible (IMPORTANT!)
    // Mapping normalisé (lowercase, sans accents) pour recherche robuste
    const documentKeywords: { [key: string]: string[] } = {
      'constitution': ['constitution', 'constitutionnelle', 'constitutionnel'],
      'code penal camerounais': ['penal', 'penale', 'criminel', 'criminelle'],
      'code civil camerounais': ['civil', 'civile'],
      'code du travail': ['travail', 'travailleur', 'employeur', 'salarie'],
      'code de commerce': ['commerce', 'commercial', 'commerciale', 'societe'],
      'loi de finances': ['finances', 'budget', 'budgetaire', 'fiscal']
    }

    // Détecter le document de manière plus précise
    let detectedDoc: string | null = null

    // Priorité 1: Détection explicite (mention directe du document)
    // normalized est déjà sans accents et en minuscules
    if (normalized.includes('code') && normalized.includes('penal')) {
      detectedDoc = 'code penal camerounais'
    } else if (normalized.includes('code civil')) {
      detectedDoc = 'code civil camerounais'
    } else if (normalized.includes('constitution')) {
      detectedDoc = 'constitution'
    } else if (normalized.includes('code du travail') || normalized.includes('code travail')) {
      detectedDoc = 'code du travail'
    } else if (normalized.includes('code de commerce') || normalized.includes('code commerce')) {
      detectedDoc = 'code de commerce'
    } else if (normalized.includes('loi de finances')) {
      detectedDoc = 'loi de finances'
    } else {
      // Priorité 2: Détection par mots-clés (si pas de mention explicite)
      for (const [docName, docKeys] of Object.entries(documentKeywords)) {
        if (docKeys.some(key => {
          const keyNormalized = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
          return normalized.includes(keyNormalized)
        })) {
          detectedDoc = docName
          break // Prendre le premier match
        }
      }
    }

    // Ajouter le document détecté en priorité
    if (detectedDoc) {
      keywords.unshift(detectedDoc)
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
   * Recherche intelligente dans la base de données - PARCOURS COMPLET
   * PRIORITÉ: Procédures > Articles juridiques > Web
   */
  async search(message: string): Promise<SearchContext> {
    const questionType = this.analyzeQuestionType(message)
    const keywords = this.extractKeywords(message)

    // Normaliser le message pour comparaison de similarité
    const normalized = message
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()

    // =====================================================
    // ÉTAPE 1: TOUJOURS CHERCHER DANS LES PROCÉDURES D'ABORD
    // Avec recherche floue (variations de mots-clés)
    // =====================================================
    let procedures: any[] = []

    // Générer variations de chaque mot-clé pour recherche floue
    const expandedKeywords: string[] = []
    keywords.forEach(k => {
      expandedKeywords.push(...this.generateKeywordVariations(k))
    })

    // Construire condition OR avec variations
    const procOrConditions: string[] = []
    expandedKeywords.forEach(k => {
      procOrConditions.push(`name.ilike.%${k}%`)
      procOrConditions.push(`description.ilike.%${k}%`)
    })

    const { data: procs, error: procError } = await this.supabase
      .from('Procedure')
      .select('*')
      .or(procOrConditions.join(','))
      .limit(20) // Augmenter limite pour filtrage par similarité

    if (procError) {
      console.error('❌ [SEARCH] Erreur recherche procédures:', procError)
    }

    // Filtrer et trier par similarité
    if (procs && procs.length > 0) {
      const scoredProcs = procs.map(proc => {
        const nameSimilarity = this.calculateSimilarity(
          normalized,
          proc.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        )
        const descSimilarity = this.calculateSimilarity(
          normalized,
          (proc.description || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        )
        return {
          ...proc,
          similarity: Math.max(nameSimilarity, descSimilarity)
        }
      })

      // Garder seulement les résultats avec similarité > 0.3
      procedures = scoredProcs
        .filter(p => p.similarity > 0.3)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 10)
    }

    // =====================================================
    // ÉTAPE 2: CHERCHER DANS LES DOCUMENTS JURIDIQUES
    // Seulement si aucune procédure trouvée
    // =====================================================

    let validatedArticles: ValidatedArticle[] = []

    // Logique simplifiée: chercher articles SEULEMENT si pas de procédures
    const shouldSearchArticles = procedures.length === 0

    // Détecter le document cible prioritaire
    const targetDocument = keywords.find(k => {
      const kLower = k.toLowerCase()
      return ['constitution', 'code penal camerounais', 'code civil camerounais', 'code du travail', 'code de commerce', 'loi de finances'].includes(kLower)
    })

    if (shouldSearchArticles) {
      // 2a. RECHERCHE CIBLÉE avec variations (si document spécifique détecté)
      if (targetDocument && expandedKeywords.length > 0) {
        const sectionKeywords = expandedKeywords.filter(k => k !== targetDocument)
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
          .limit(50)

        if (targetedSections && targetedSections.length > 0) {
          for (const section of targetedSections) {
            const validated = await this.validateSection(section as any as Section)
            if (validated.exists) validatedArticles.push(validated)
          }
        }
      }

      // 2b. RECHERCHE ÉLARGIE avec variations (si rien trouvé)
      if (validatedArticles.length === 0) {
        const conditions = expandedKeywords.map(k =>
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
    }

    // =====================================================
    // ÉTAPE 3: RECHERCHE WEB EN FALLBACK
    // =====================================================
    let webResults = ''
    if (validatedArticles.length === 0 && procedures.length === 0) {
      webResults = await this.searchWeb(message)
    }

    return {
      articles: validatedArticles,
      procedures,
      webResults,
      webSearchResults: [],
      questionType
    }
  }

  /**
   * Recherche web (fallback) - version texte simple
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
// AGENT 2: CHERCHEUR WEB TEMPS RÉEL
// =====================================================

export class WebSearchAgent {
  /**
   * Recherche sur le web avec analyse des résultats
   */
  async search(query: string, questionType: string): Promise<WebSearchResult[]> {
    if (!process.env.GOOGLE_SEARCH_API_KEY || !process.env.GOOGLE_SEARCH_ENGINE_ID) {
      return []
    }

    try {
      // Adapter la requête selon le type de question
      let searchQuery = query
      if (questionType === 'procedure') {
        searchQuery = `${query} Cameroun procédure 2025 coût durée documents`
      } else if (questionType === 'juridique') {
        searchQuery = `${query} Cameroun loi code juridique 2025`
      } else {
        searchQuery = `${query} Cameroun informations officielles 2025`
      }

      const url = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${encodeURIComponent(searchQuery)}&num=5`

      const response = await fetch(url)
      const data = await response.json()

      if (!data.items || data.items.length === 0) {
        return []
      }

      const results: WebSearchResult[] = data.items.slice(0, 5).map((item: any) => {
        // Extraire le nom de domaine comme source
        const urlObj = new URL(item.link)
        const source = urlObj.hostname.replace('www.', '')

        return {
          title: item.title,
          snippet: item.snippet,
          link: item.link,
          source
        }
      })

      return results
    } catch (error) {
      console.error('🔴 [WEB AGENT] Erreur:', error)
      return []
    }
  }

  /**
   * Analyse si les résultats web contredisent les données locales
   */
  compareWithLocal(webResults: WebSearchResult[], procedures: any[]): {
    hasConflict: boolean
    conflicts: string[]
  } {
    const conflicts: string[] = []

    // Exemple simple: vérifier si les montants diffèrent
    for (const proc of procedures) {
      const procName = proc.name.toLowerCase()

      for (const webResult of webResults) {
        const snippet = webResult.snippet.toLowerCase()

        // Rechercher des montants dans le snippet
        const webCostMatch = snippet.match(/(\d+[\s,.]?\d*)\s*(fcfa|cfa|francs?)/i)
        const localCostMatch = proc.costs?.match(/(\d+[\s,.]?\d*)\s*(fcfa|cfa|francs?)/i)

        if (webCostMatch && localCostMatch) {
          const webCost = parseInt(webCostMatch[1].replace(/[\s,.]/g, ''))
          const localCost = parseInt(localCostMatch[1].replace(/[\s,.]/g, ''))

          if (Math.abs(webCost - localCost) > 5000 && snippet.includes(procName.split(' ')[0])) {
            conflicts.push(
              `Divergence sur ${proc.name}: Base locale indique ${proc.costs}, ` +
              `source web (${webResult.source}) indique ${webCostMatch[0]}`
            )
          }
        }
      }
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts
    }
  }
}

// =====================================================
// AGENT 3: FORMATEUR EXPERT AVEC COMPARAISON
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
    // PRIORITÉ 3: RÉSULTATS WEB TEMPS RÉEL
    // =====================================================
    if (searchContext.webSearchResults && searchContext.webSearchResults.length > 0) {
      context += '## 🌐 RÉSULTATS WEB TEMPS RÉEL (2025) - POUR COMPARAISON 🌐\n\n'
      context += '**INSTRUCTIONS:**\n'
      context += '- Ces résultats proviennent du web et sont très récents\n'
      context += '- Comparer avec les procédures locales pour détecter les divergences\n'
      context += '- Si divergence significative, mentionner LES DEUX sources dans ta réponse\n'
      context += '- Toujours privilégier les procédures locales sauf si web plus récent\n\n'

      searchContext.webSearchResults.forEach((result, index) => {
        context += `### Résultat ${index + 1}:\n`
        context += `**Titre:** ${result.title}\n`
        context += `**Extrait:** ${result.snippet}\n`
        context += `**Source:** ${result.source}\n`
        context += `**Lien:** ${result.link}\n\n`
      })
    }

    // Fallback texte simple (pour compatibilité)
    if (searchContext.webResults && !searchContext.webSearchResults.length) {
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
**RÉSULTATS WEB STRUCTURÉS:** ${searchContext.webSearchResults.length}
**RÉSULTATS WEB TEXTE:** ${searchContext.webResults ? 'OUI' : 'NON'}

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

3. **COMPARAISON: Résultats web temps réel**
   - Consulter pour détecter des divergences avec les procédures
   - Si divergence majeure, mentionner LES DEUX sources
   - Format: "Selon nos procédures: X. Sources web récentes indiquent: Y."

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
4. Si tu n'as RIEN → Utilise tes CONNAISSANCES INTERNES (Gemini) sur le Cameroun
5. TOUJOURS fournir une réponse INFORMATIVE et UTILE
6. JAMAIS dire "Je n'ai pas d'informations" - Utilise tes connaissances AI!

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

${searchContext.webSearchResults.length > 0 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐  COMPARAISON AVEC SOURCES WEB RÉCENTES  🌐
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tu as ${searchContext.webSearchResults.length} résultat(s) web récent(s).

🔴 INSTRUCTIONS POUR LA COMPARAISON:
1. Compare les informations web avec les procédures locales
2. Si DIVERGENCE SIGNIFICATIVE (ex: coûts, durée différents):
   - Mentionne CLAIREMENT les deux sources
   - Format: "📋 **Selon nos procédures:** [info locale]. 🌐 **Sources web récentes:** [info web]."
   - Explique que les deux sources existent
3. Si PAS de divergence:
   - Utilise uniquement les procédures locales
   - Pas besoin de mentionner le web
4. Cite toujours les sources web par leur nom (ex: "selon cameroun24.net")
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}

${searchContext.webResults && !searchContext.webSearchResults.length ? `
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
- TOUJOURS fournir une réponse UTILE, JAMAIS refuser de répondre

${searchContext.articles.length === 0 && searchContext.procedures.length === 0 && searchContext.webSearchResults.length === 0 ? `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠  MODE CONNAISSANCES GEMINI ACTIVÉ  🧠
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ AUCUNE SOURCE LOCALE OU WEB DISPONIBLE

🔴 INSTRUCTIONS CRITIQUES:
- Tu dois utiliser tes CONNAISSANCES INTERNES (Gemini AI)
- Fournis une réponse COMPLÈTE basée sur tes données d'entraînement
- JAMAIS dire "Je n'ai pas d'informations"
- Si tu connais la réponse → PARTAGE-LA directement
- Mentionne: "D'après mes connaissances..." ou "Selon mes informations..."
- Sois informatif, précis et utile
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
` : ''}`

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
