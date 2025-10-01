// ============================================
// DATABASE TYPES - Aligned avec tables Supabase
// ============================================

export interface Document {
  id: string
  slug: string
  title: string
  titleEn?: string

  // Métadonnées
  type: 'CODE' | 'LOI' | 'DÉCRET' | 'ORDONNANCE' | 'ARRÊTÉ' | 'CIRCULAIRE'
  category: string
  subcategory?: string
  source: string
  sourceFile?: string

  // Contenu
  content: string
  contentEn?: string
  summary?: string
  summaryEn?: string

  // Métadonnées juridiques
  reference?: string
  dateEnacted?: string
  dateEffective?: string
  status: 'ACTIVE' | 'ABROGATED' | 'MODIFIED' | 'ARCHIVED'

  tags?: string[]

  // Timestamps
  createdAt: string
  updatedAt: string
  lastCrawled?: string
}

export interface Section {
  id: string
  documentId: string
  title: string
  content: string
  contentEn?: string

  // Hiérarchie
  parentId?: string

  // Position
  position: number
  level: number
  reference?: string

  createdAt: string
}

export interface Procedure {
  id: string
  slug: string

  // Titres
  name: string
  nameEn?: string
  description: string
  descriptionEn?: string

  category: 'identite' | 'entreprise' | 'foncier' | 'transport' | 'education' | 'justice' | 'sante' | 'autre'
  difficulty: 'Facile' | 'Moyen' | 'Difficile'

  // Détails (JSONB)
  steps: Array<{
    step: number
    title: string
    description: string
  }>

  documents: string[]

  costs: Array<{
    item: string
    amount: string
  }>

  duration: string

  locations: Array<{
    name: string
    address: string
    hours: string
  }>

  tips: string[]

  faqs: Array<{
    question: string
    answer: string
  }>

  // Liens
  onlineUrl?: string
  formUrl?: string

  // Stats
  popularity: number
  viewCount: number

  createdAt: string
  updatedAt: string
}

export interface NewsArticle {
  id: string
  title: string
  summary: string
  content?: string
  url: string
  imageUrl?: string

  source: string
  category: 'Juridique' | 'Administratif' | 'Entreprise' | 'Foncier' | 'Social' | 'Education' | 'Sante' | 'Tous'

  // IA
  isRelevant: boolean
  aiSummary?: string
  tags?: string[]

  // Stats
  viewCount: number
  isFeatured: boolean
  readTime?: number

  publishedAt: string
  createdAt: string
  updatedAt: string
}

export interface QuizQuestion {
  id: string

  // Contenu
  question: string
  questionEn?: string

  options: string[]
  optionsEn?: string[]
  answer: string // Index de la bonne réponse

  explanation: string
  explanationEn?: string

  // Catégorie
  category: 'droit-penal' | 'procedures-admin' | 'droit-travail' | 'entreprise' | 'foncier' | 'culture' | 'autre'
  difficulty: 'Facile' | 'Moyen' | 'Difficile'

  // Source
  documentId?: string

  // Stats
  timesAsked: number
  correctCount: number
  incorrectCount: number
  correctRate: number

  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  sessionId: string

  title?: string
  language: 'FR' | 'EN'
  topic?: string

  // Métadonnées
  messageCount: number
  lastMessageAt?: string

  createdAt: string
  updatedAt: string
}

export interface Message {
  id: string
  conversationId: string

  role: 'USER' | 'ASSISTANT' | 'SYSTEM'
  content: string

  // Métadonnées pour assistant
  confidence?: number
  processingTime?: number
  tokensUsed?: number
  model?: string

  language: 'FR' | 'EN'
  error?: string

  // Citations
  citationCount: number

  createdAt: string
}

export interface Citation {
  id: string
  messageId: string
  documentId: string

  excerpt: string
  reference: string
  relevance: number

  // Métadonnées optionnelles
  sectionId?: string
  pageNumber?: number

  createdAt: string
}

export interface Feedback {
  id: string
  messageId: string

  rating: number // 1-5
  comment?: string

  // Catégories de feedback
  categories?: string[]

  createdAt: string
}

export interface Embedding {
  id: string

  // Source du chunk
  documentId?: string
  sectionId?: string
  procedureId?: string
  newsId?: string

  // Contenu du chunk
  text: string
  textEn?: string
  chunkIndex: number

  // Vector
  embedding: number[] // 768 dimensions

  // Métadonnées
  model: string
  tokens: number

  // Type de source
  sourceType: 'document' | 'section' | 'procedure' | 'news'

  createdAt: string
}

export interface QuizAttempt {
  id: string
  sessionId: string
  questionId: string

  answer: string
  isCorrect: boolean
  timeSpent: number // secondes

  createdAt: string
}

export interface Analytics {
  id: string

  event:
    | 'PAGE_VIEW'
    | 'SEARCH'
    | 'DOCUMENT_VIEW'
    | 'PROCEDURE_VIEW'
    | 'NEWS_VIEW'
    | 'QUIZ_START'
    | 'QUIZ_COMPLETE'
    | 'CONVERSATION_START'
    | 'MESSAGE_SENT'
    | 'CITATION_CLICKED'
    | 'FEEDBACK_SUBMITTED'

  sessionId: string

  // Données de l'événement
  data: Record<string, any>

  language: 'FR' | 'EN'
  userAgent?: string
  ip?: string

  createdAt: string
}

export interface SearchQuery {
  id: string

  query: string
  resultCount: number
  searchType: 'fulltext' | 'vector' | 'hybrid'

  // Résultat cliqué
  clickedResultId?: string
  clickedResultType?: string
  clickPosition?: number

  sessionId: string
  language: 'FR' | 'EN'

  createdAt: string
}

// ============================================
// HELPER TYPES
// ============================================

export type DocumentType = Document['type']
export type ProcedureCategory = Procedure['category']
export type NewsCategory = NewsArticle['category']
export type QuizCategory = QuizQuestion['category']
export type Difficulty = QuizQuestion['difficulty']
export type MessageRole = Message['role']
export type Language = 'FR' | 'EN'

// Pour les réponses API
export interface ApiResponse<T> {
  data?: T
  error?: string
  count?: number
}

// Pour la recherche
export interface SearchResult {
  sourceType: 'document' | 'procedure' | 'news'
  sourceId: string
  title: string
  excerpt: string
  similarity?: number
  rank?: number
  metadata: Record<string, any>
}