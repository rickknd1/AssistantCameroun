/**
 * SERVICE DE CACHE INTELLIGENT POUR QUESTIONS/RÉPONSES
 * Permet d'accélérer Cami et améliorer la qualité des réponses
 */

import type { SupabaseClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// =====================================================
// TYPES
// =====================================================

export interface CachedQuestion {
  id: string
  questionNormalized: string
  questionOriginal: string
  questionHash: string
  response: string
  sources: Array<{
    title: string
    reference: string
    url: string
  }>
  confidence: number
  questionType: string
  keywords: string[]
  documentsReferenced: string[]
  verifiedAt: Date | null
  verifiedBy: string | null
  verificationScore: number
  usageCount: number
  successCount: number
  failureCount: number
  successRate: number
  createdAt: Date
  updatedAt: Date
  lastUsedAt: Date | null
}

export interface CacheSearchResult {
  found: boolean
  cached?: CachedQuestion
  similarity?: number
}

export interface VerificationResult {
  verified: boolean
  score: number
  issues: string[]
  suggestions: string[]
}

// =====================================================
// SERVICE DE CACHE
// =====================================================

export class QuestionCacheService {
  private supabase: SupabaseClient

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase
  }

  /**
   * Normalise une question (lowercase, sans accents, sans ponctuation)
   */
  private normalizeQuestion(question: string): string {
    return question
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Retirer accents
      .replace(/[^a-z0-9\s]/g, '') // Retirer ponctuation
      .trim()
      .replace(/\s+/g, ' ') // Normaliser espaces
  }

  /**
   * Génère un hash unique pour une question
   */
  private generateQuestionHash(question: string): string {
    const normalized = this.normalizeQuestion(question)
    return crypto.createHash('md5').update(normalized).digest('hex')
  }

  /**
   * Extrait les mots-clés d'une question
   */
  private extractKeywords(question: string): string[] {
    const normalized = this.normalizeQuestion(question)
    const stopWords = ['le', 'la', 'les', 'un', 'une', 'des', 'de', 'du', 'et', 'ou', 'est', 'comment', 'quel', 'quelle', 'quels', 'quelles', 'que', 'qui', 'quoi']

    return normalized
      .split(' ')
      .filter(word => word.length > 3 && !stopWords.includes(word))
      .slice(0, 10) // Max 10 mots-clés
  }

  /**
   * Calcule la similarité entre deux questions (0-100)
   */
  private calculateSimilarity(q1: string, q2: string): number {
    const normalized1 = this.normalizeQuestion(q1)
    const normalized2 = this.normalizeQuestion(q2)

    // Similarité exacte
    if (normalized1 === normalized2) return 100

    // Similarité par mots-clés (Jaccard)
    const words1 = new Set(normalized1.split(' '))
    const words2 = new Set(normalized2.split(' '))

    const intersection = new Set([...words1].filter(w => words2.has(w)))
    const union = new Set([...words1, ...words2])

    return Math.round((intersection.size / union.size) * 100)
  }

  /**
   * Recherche une question dans le cache
   * Retourne la question si similarité > 85%
   */
  async searchCache(question: string): Promise<CacheSearchResult> {
    const hash = this.generateQuestionHash(question)

    // 1. Recherche par hash exact (plus rapide)
    const { data: exactMatch } = await this.supabase
      .from('QuestionCache')
      .select('*')
      .eq('questionHash', hash)
      .single()

    if (exactMatch) {
      console.log('✅ [CACHE] Question trouvée (hash exact)')
      return {
        found: true,
        cached: exactMatch as CachedQuestion,
        similarity: 100
      }
    }

    // 2. Recherche par mots-clés similaires
    const keywords = this.extractKeywords(question)

    if (keywords.length === 0) {
      return { found: false }
    }

    const { data: similarQuestions } = await this.supabase
      .from('QuestionCache')
      .select('*')
      .overlaps('keywords', keywords)
      .gte('verificationScore', 70) // Seulement questions vérifiées
      .order('usageCount', { ascending: false })
      .limit(10)

    if (!similarQuestions || similarQuestions.length === 0) {
      console.log('❌ [CACHE] Aucune question similaire trouvée')
      return { found: false }
    }

    // 3. Calculer similarité pour chaque question
    let bestMatch: CachedQuestion | null = null
    let bestSimilarity = 0

    for (const cached of similarQuestions) {
      const similarity = this.calculateSimilarity(question, cached.questionOriginal)
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity
        bestMatch = cached as CachedQuestion
      }
    }

    // 4. Retourner si similarité > 85%
    if (bestMatch && bestSimilarity >= 85) {
      console.log(`✅ [CACHE] Question similaire trouvée (${bestSimilarity}%)`)
      return {
        found: true,
        cached: bestMatch,
        similarity: bestSimilarity
      }
    }

    console.log(`⚠️ [CACHE] Question similaire mais similarité faible (${bestSimilarity}%)`)
    return { found: false }
  }

  /**
   * Vérifie la véracité d'une réponse automatiquement
   */
  async verifyResponse(
    response: string,
    sources: any[],
    confidence: number
  ): Promise<VerificationResult> {
    const issues: string[] = []
    const suggestions: string[] = []
    let score = 100

    // 1. Vérifier qu'il y a des sources
    if (sources.length === 0) {
      issues.push('Aucune source fournie')
      score -= 30
    }

    // 2. Vérifier le niveau de confiance
    if (confidence < 70) {
      issues.push('Niveau de confiance faible')
      score -= 20
    }

    // 3. Vérifier que les sources sont citées dans la réponse
    let sourcesNotCited = 0
    for (const source of sources) {
      const sourceMentioned = response.includes(source.url) || response.includes(source.title)
      if (!sourceMentioned) {
        sourcesNotCited++
      }
    }

    if (sourcesNotCited > 0) {
      issues.push(`${sourcesNotCited} source(s) non citée(s) dans la réponse`)
      score -= sourcesNotCited * 10
    }

    // 4. Vérifier la longueur de la réponse
    if (response.length < 50) {
      issues.push('Réponse trop courte')
      score -= 15
    }

    // 5. Vérifier présence de liens markdown
    const markdownLinks = response.match(/\[([^\]]+)\]\(([^)]+)\)/g)
    if (!markdownLinks && sources.length > 0) {
      issues.push('Aucun lien cliquable dans la réponse')
      score -= 10
    }

    // 6. Suggestions d'amélioration
    if (score < 80) {
      if (sources.length === 0) {
        suggestions.push('Ajouter des sources officielles')
      }
      if (!markdownLinks) {
        suggestions.push('Ajouter des liens cliquables vers les documents')
      }
      if (response.length < 100) {
        suggestions.push('Développer la réponse avec plus de détails')
      }
    }

    // Score final (0-100)
    score = Math.max(0, Math.min(100, score))

    return {
      verified: score >= 70,
      score,
      issues,
      suggestions
    }
  }

  /**
   * Ajoute une question/réponse au cache
   */
  async addToCache(
    question: string,
    response: string,
    sources: any[],
    confidence: number,
    questionType: string
  ): Promise<string | null> {
    try {
      // 1. Vérifier la véracité
      const verification = await this.verifyResponse(response, sources, confidence)

      // 2. Ne mettre en cache que si score > 70
      if (verification.score < 70) {
        console.log(`⚠️ [CACHE] Réponse non ajoutée au cache (score: ${verification.score})`)
        return null
      }

      const hash = this.generateQuestionHash(question)
      const normalized = this.normalizeQuestion(question)
      const keywords = this.extractKeywords(question)

      // 3. Extraire IDs des documents référencés
      const documentsReferenced = sources
        .filter(s => s.url.includes('/bibliotheque/'))
        .map(s => s.url.split('/bibliotheque/')[1]?.split('#')[0])
        .filter(Boolean)

      // 4. Insérer dans le cache
      const { data, error } = await this.supabase
        .from('QuestionCache')
        .insert({
          questionHash: hash,
          questionNormalized: normalized,
          questionOriginal: question,
          response,
          sources,
          confidence,
          questionType,
          keywords,
          documentsReferenced,
          verifiedAt: verification.verified ? new Date().toISOString() : null,
          verifiedBy: 'auto',
          verificationScore: verification.score,
          usageCount: 1
        })
        .select()
        .single()

      if (error) {
        // Si la question existe déjà (hash unique), mettre à jour
        if (error.code === '23505') {
          console.log('⚠️ [CACHE] Question déjà en cache, mise à jour...')
          const { data: updated } = await this.supabase
            .from('QuestionCache')
            .update({
              response,
              sources,
              confidence,
              verificationScore: verification.score,
              updatedAt: new Date().toISOString()
            })
            .eq('questionHash', hash)
            .select()
            .single()

          return updated?.id || null
        }

        console.error('🔴 [CACHE] Erreur insertion:', error)
        return null
      }

      // 5. Logger la vérification
      if (data) {
        await this.supabase
          .from('VerificationLog')
          .insert({
            questionCacheId: data.id,
            verificationType: 'auto',
            status: verification.verified ? 'verified' : 'flagged',
            score: verification.score,
            details: {
              issues: verification.issues,
              suggestions: verification.suggestions
            },
            issues: verification.issues,
            suggestions: verification.suggestions
          })

        console.log(`✅ [CACHE] Question ajoutée au cache (score: ${verification.score})`)
      }

      return data?.id || null
    } catch (error) {
      console.error('🔴 [CACHE] Erreur addToCache:', error)
      return null
    }
  }

  /**
   * Incrémente le compteur d'usage d'une question en cache
   */
  async incrementUsage(cacheId: string): Promise<void> {
    // Récupérer la valeur actuelle
    const { data: current } = await this.supabase
      .from('QuestionCache')
      .select('usageCount')
      .eq('id', cacheId)
      .single()

    if (current) {
      // Incrémenter
      await this.supabase
        .from('QuestionCache')
        .update({
          usageCount: (current.usageCount || 0) + 1,
          lastUsedAt: new Date().toISOString()
        })
        .eq('id', cacheId)
    }
  }

  /**
   * Ajoute un feedback utilisateur
   */
  async addFeedback(
    cacheId: string,
    messageId: string | null,
    rating: number,
    feedbackType: string,
    comment?: string
  ): Promise<void> {
    try {
      // 1. Ajouter le feedback
      await this.supabase
        .from('ResponseFeedback')
        .insert({
          questionCacheId: cacheId,
          messageId,
          rating,
          feedbackType,
          comment
        })

      // 2. Mettre à jour les stats du cache
      const incrementField = rating >= 4 ? 'successCount' : 'failureCount'

      // Récupérer la valeur actuelle
      const { data: current } = await this.supabase
        .from('QuestionCache')
        .select(incrementField)
        .eq('id', cacheId)
        .single()

      if (current) {
        // Incrémenter
        await this.supabase
          .from('QuestionCache')
          .update({
            [incrementField]: ((current as any)[incrementField] || 0) + 1
          })
          .eq('id', cacheId)
      }

      console.log(`✅ [FEEDBACK] Feedback enregistré (${rating}/5)`)
    } catch (error) {
      console.error('🔴 [FEEDBACK] Erreur:', error)
    }
  }
}
