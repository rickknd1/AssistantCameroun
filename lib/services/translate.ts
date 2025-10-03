/**
 * Google Translate API Service
 * Traduction automatique des contenus dynamiques (quiz, documents, etc.)
 */

const GOOGLE_TRANSLATE_API_KEY = process.env.GOOGLE_TRANSLATE_API_KEY
const TRANSLATE_API_URL = 'https://translation.googleapis.com/language/translate/v2'

interface TranslateOptions {
  text: string | string[]
  targetLang: 'en' | 'fr'
  sourceLang?: 'en' | 'fr'
}

interface TranslateResponse {
  data: {
    translations: Array<{
      translatedText: string
      detectedSourceLanguage?: string
    }>
  }
}

/**
 * Cache simple en mémoire pour éviter les traductions répétées
 */
const translationCache = new Map<string, string>()

function getCacheKey(text: string, targetLang: string): string {
  return `${targetLang}:${text.substring(0, 100)}`
}

/**
 * Traduit un texte ou un tableau de textes
 */
export async function translateText(options: TranslateOptions): Promise<string | string[]> {
  const { text, targetLang, sourceLang } = options

  // Si pas de clé API, retourner le texte original
  if (!GOOGLE_TRANSLATE_API_KEY) {
    console.warn('⚠️ GOOGLE_TRANSLATE_API_KEY non configurée - traduction désactivée')
    return text
  }

  const isArray = Array.isArray(text)
  const texts = isArray ? text : [text]

  // Filtrer les textes vides et vérifier le cache
  const textsToTranslate: string[] = []
  const cachedResults: (string | null)[] = []

  texts.forEach((t) => {
    if (!t || t.trim() === '') {
      cachedResults.push(t)
      return
    }

    const cacheKey = getCacheKey(t, targetLang)
    const cached = translationCache.get(cacheKey)

    if (cached) {
      cachedResults.push(cached)
    } else {
      cachedResults.push(null)
      textsToTranslate.push(t)
    }
  })

  // Si tout est en cache, retourner directement
  if (textsToTranslate.length === 0) {
    const results = cachedResults.filter((r): r is string => r !== null)
    return isArray ? results : results[0] || ''
  }

  try {
    const params = new URLSearchParams({
      key: GOOGLE_TRANSLATE_API_KEY,
      target: targetLang,
      format: 'text'
    })

    if (sourceLang) {
      params.append('source', sourceLang)
    }

    // Ajouter chaque texte comme paramètre 'q'
    textsToTranslate.forEach(t => params.append('q', t))

    const response = await fetch(`${TRANSLATE_API_URL}?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Erreur Google Translate API:', error)
      return text // Retourner le texte original en cas d'erreur
    }

    const data: TranslateResponse = await response.json()
    const translations = data.data.translations.map(t => t.translatedText)

    // Mettre en cache les résultats
    textsToTranslate.forEach((original, index) => {
      const cacheKey = getCacheKey(original, targetLang)
      translationCache.set(cacheKey, translations[index])
    })

    // Reconstituer les résultats complets avec le cache
    let translationIndex = 0
    const finalResults = cachedResults.map(cached => {
      if (cached !== null) return cached
      return translations[translationIndex++]
    })

    return isArray ? finalResults : finalResults[0] || ''

  } catch (error) {
    console.error('❌ Erreur lors de la traduction:', error)
    return text // Retourner le texte original en cas d'erreur
  }
}

/**
 * Traduit un objet avec plusieurs champs
 */
export async function translateObject<T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[],
  targetLang: 'en' | 'fr',
  sourceLang?: 'en' | 'fr'
): Promise<T> {
  const textsToTranslate = fields.map(field => String(obj[field] || ''))

  const translations = await translateText({
    text: textsToTranslate,
    targetLang,
    sourceLang
  })

  const translatedObj = { ...obj }
  const translationArray = Array.isArray(translations) ? translations : [translations]

  fields.forEach((field, index) => {
    translatedObj[field] = translationArray[index] as any
  })

  return translatedObj
}

/**
 * Traduit un tableau d'objets
 */
export async function translateArray<T extends Record<string, any>>(
  items: T[],
  fields: (keyof T)[],
  targetLang: 'en' | 'fr',
  sourceLang?: 'en' | 'fr'
): Promise<T[]> {
  return Promise.all(
    items.map(item => translateObject(item, fields, targetLang, sourceLang))
  )
}

/**
 * Nettoie le cache de traduction (utile pour libérer la mémoire)
 */
export function clearTranslationCache() {
  translationCache.clear()
}
