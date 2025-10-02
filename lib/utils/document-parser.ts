// ============================================
// DOCUMENT PARSER - Extraction intelligente des sections
// Parse les documents juridiques (Constitution, Codes, Lois)
// ============================================

export interface ParsedSection {
  title: string
  content: string
  reference: string
  level: number // 0=Titre, 1=Chapitre, 2=Article
  position: number // Position dans le document
  anchorId: string // ID pour l'ancre HTML
  parentId?: string // Référence au parent (pour hiérarchie)
}

/**
 * Parse un document juridique et extrait les sections structurées
 */
export function parseJuridicalDocument(content: string, documentType: 'CONSTITUTION' | 'CODE' | 'LOI' | 'DÉCRET'): ParsedSection[] {
  const sections: ParsedSection[] = []
  let position = 0

  // Patterns de détection
  const patterns = {
    // TITRE PREMIER, TITRE II, etc.
    titre: /^(TITRE\s+(?:PREMIER|[IVX]+|[0-9]+).*?)$/gim,

    // CHAPITRE I, CHAPITRE II, etc.
    chapitre: /^(CHAPITRE\s+(?:[IVX]+|[0-9]+).*?)$/gim,

    // ARTICLE 1, ARTICLE PREMIER, Article 26, etc.
    article: /^(ARTICLE\s+(?:PREMIER|[0-9]+|[IVX]+)\s*(?::|\.)?)$/gim,

    // PREAMBULE
    preambule: /^(PR[ÉE]AMBULE)\s*$/gim,
  }

  const lines = content.split('\n')
  let currentTitre: ParsedSection | null = null
  let currentChapitre: ParsedSection | null = null
  let currentArticle: ParsedSection | null = null
  let articleBuffer: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue

    // Détecter PRÉAMBULE
    if (patterns.preambule.test(line)) {
      // Sauvegarder l'article précédent si existe
      if (currentArticle && articleBuffer.length > 0) {
        currentArticle.content = articleBuffer.join('\n').trim()
        sections.push(currentArticle)
        articleBuffer = []
      }

      // Extraire le contenu du préambule
      const preambuleContent: string[] = []
      for (let j = i + 1; j < lines.length; j++) {
        const nextLine = lines[j].trim()
        // Arrêter au premier TITRE
        if (patterns.titre.test(nextLine)) break
        preambuleContent.push(nextLine)
      }

      sections.push({
        title: 'Préambule',
        content: preambuleContent.join('\n').trim(),
        reference: 'Préambule',
        level: 0,
        position: position++,
        anchorId: 'preambule',
      })
      continue
    }

    // Détecter TITRE
    if (patterns.titre.test(line)) {
      // Sauvegarder l'article précédent
      if (currentArticle && articleBuffer.length > 0) {
        currentArticle.content = articleBuffer.join('\n').trim()
        sections.push(currentArticle)
        articleBuffer = []
      }

      const titreId = generateAnchorId(line)
      currentTitre = {
        title: line,
        content: '', // Les titres n'ont pas de contenu propre
        reference: line,
        level: 0,
        position: position++,
        anchorId: titreId,
      }
      sections.push(currentTitre)
      currentChapitre = null
      currentArticle = null
      continue
    }

    // Détecter CHAPITRE
    if (patterns.chapitre.test(line)) {
      // Sauvegarder l'article précédent
      if (currentArticle && articleBuffer.length > 0) {
        currentArticle.content = articleBuffer.join('\n').trim()
        sections.push(currentArticle)
        articleBuffer = []
      }

      const chapitreId = generateAnchorId(line)
      currentChapitre = {
        title: line,
        content: '',
        reference: line,
        level: 1,
        position: position++,
        anchorId: chapitreId,
        parentId: currentTitre?.anchorId,
      }
      sections.push(currentChapitre)
      currentArticle = null
      continue
    }

    // Détecter ARTICLE
    if (patterns.article.test(line)) {
      // Sauvegarder l'article précédent
      if (currentArticle && articleBuffer.length > 0) {
        currentArticle.content = articleBuffer.join('\n').trim()
        sections.push(currentArticle)
        articleBuffer = []
      }

      // Extraire le numéro d'article
      const articleMatch = line.match(/ARTICLE\s+(PREMIER|[0-9]+|[IVX]+)/i)
      const articleNum = articleMatch ? articleMatch[1] : 'INCONNU'
      const articleId = `article-${normalizeArticleNumber(articleNum)}`

      currentArticle = {
        title: line.replace(/\s*:?\s*$/, ''), // Nettoyer les : finaux
        content: '', // Sera rempli au prochain article ou fin
        reference: `Article ${articleNum}`,
        level: 2,
        position: position++,
        anchorId: articleId,
        parentId: currentChapitre?.anchorId || currentTitre?.anchorId,
      }
      continue
    }

    // Accumuler le contenu de l'article courant
    if (currentArticle) {
      articleBuffer.push(line)
    }
  }

  // Sauvegarder le dernier article
  if (currentArticle && articleBuffer.length > 0) {
    currentArticle.content = articleBuffer.join('\n').trim()
    sections.push(currentArticle)
  }

  return sections
}

/**
 * Génère un ID d'ancre HTML valide
 */
function generateAnchorId(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
    .replace(/[^a-z0-9\s-]/g, '') // Garder seulement alphanumériques
    .replace(/\s+/g, '-') // Espaces → tirets
    .replace(/-+/g, '-') // Tirets multiples → simple
    .replace(/^-|-$/g, '') // Retirer tirets début/fin
}

/**
 * Normalise les numéros d'articles pour les IDs
 * PREMIER → 1, II → 2, etc.
 */
function normalizeArticleNumber(articleNum: string): string {
  if (articleNum.toUpperCase() === 'PREMIER') return '1'

  // Convertir chiffres romains en arabes
  const romanMap: { [key: string]: number } = {
    'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
    'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10,
    'XI': 11, 'XII': 12, 'XIII': 13, 'XIV': 14, 'XV': 15,
    'XVI': 16, 'XVII': 17, 'XVIII': 18, 'XIX': 19, 'XX': 20,
  }

  if (romanMap[articleNum.toUpperCase()]) {
    return romanMap[articleNum.toUpperCase()].toString()
  }

  // Déjà en chiffres arabes
  return articleNum
}

/**
 * Extrait un résumé intelligent d'une section
 */
export function extractSectionSummary(content: string, maxLength: number = 150): string {
  // Prendre la première phrase complète
  const sentences = content.split(/[.;]/).filter(s => s.trim().length > 0)

  if (sentences.length === 0) return content.substring(0, maxLength) + '...'

  let summary = sentences[0].trim()

  // Si trop court, ajouter la deuxième phrase
  if (summary.length < 100 && sentences.length > 1) {
    summary += '. ' + sentences[1].trim()
  }

  return summary.length > maxLength
    ? summary.substring(0, maxLength) + '...'
    : summary + '.'
}

/**
 * Détecte le type de document à partir du contenu
 */
export function detectDocumentType(content: string): 'CONSTITUTION' | 'CODE' | 'LOI' | 'DÉCRET' | 'ARRÊTÉ' {
  const lowerContent = content.toLowerCase()

  if (lowerContent.includes('constitution')) return 'CONSTITUTION'
  if (lowerContent.includes('code')) return 'CODE'
  if (lowerContent.includes('décret')) return 'DÉCRET'
  if (lowerContent.includes('arrêté')) return 'ARRÊTÉ'

  return 'LOI'
}
