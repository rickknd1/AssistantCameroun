export interface Conversation {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  role: "user" | "assistant"
  content: string
  sources?: Array<{
    title: string
    reference: string
    url?: string
  }>
  confidence_score?: number
  created_at: string
}

export interface Document {
  id: string
  type: string
  category: string
  title: string
  reference: string
  date: string
  description: string
  content?: string
  status: "Actif" | "Abrogé"
  created_at: string
  updated_at: string
}

export interface Procedure {
  id: string
  slug: string
  category: string
  name: string
  duration: string
  cost: string
  difficulty: "Facile" | "Moyen" | "Difficile"
  description: string
  steps: Array<{
    step: number
    title: string
    description: string
  }>
  documents_required: string[]
  costs_detail: Array<{
    item: string
    amount: string
  }>
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
  created_at: string
  updated_at: string
}

export interface NewsArticle {
  id: string
  category: string
  title: string
  summary: string
  content: string
  image_url?: string
  source: string
  published_at: string
  read_time: number
  is_featured: boolean
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: string
  category: string
  difficulty: "Facile" | "Moyen" | "Difficile"
  question: string
  options: string[]
  correct_answer: string
  explanation: string
  created_at: string
}

export interface Feedback {
  id: string
  message_id: string
  type: "positive" | "negative"
  created_at: string
}
