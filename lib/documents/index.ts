// ============================================
// Couche d'accès aux documents juridiques (stockage STATIQUE / Git)
// Remplace l'ancien accès Supabase pour la table "Document" + "Section".
// Les données vivent dans content/documents/*.json (versionnées dans Git),
// indexées par scripts/gen-documents-registry.mjs -> registry.ts
// ============================================
import type { Document, Section } from '@/lib/types/database'
import { documents as ALL, type StoredDocument } from './registry'

export type { StoredDocument }

const all: StoredDocument[] = ALL

export interface ListOptions {
  status?: string
  type?: string
  category?: string
  search?: string
  limit?: number
}

/** Document allégé pour les listes (sans sections, content tronqué). */
export type DocumentSummary = Omit<Document, 'content'> & { content: string }

function toSummary(doc: StoredDocument): DocumentSummary {
  const { sections, content, ...rest } = doc
  return {
    ...(rest as Omit<Document, 'content'>),
    // content tronqué : sert uniquement de repli pour l'aperçu en liste
    content: (content || '').slice(0, 300),
    summary: rest.summary || (content || '').slice(0, 200),
  }
}

/** Liste filtrée des documents (version allégée). */
export function listDocuments(opts: ListOptions = {}): DocumentSummary[] {
  const status = opts.status || 'ACTIVE'
  let docs = all.filter((d) => (d.status || 'ACTIVE') === status)

  if (opts.type) docs = docs.filter((d) => d.type === opts.type)
  if (opts.category) docs = docs.filter((d) => d.category === opts.category)
  if (opts.search) {
    const q = opts.search.toLowerCase()
    docs = docs.filter(
      (d) =>
        d.title.toLowerCase().includes(q) ||
        (d.reference || '').toLowerCase().includes(q),
    )
  }

  // Tri par date de promulgation décroissante (repli : titre)
  docs = [...docs].sort((a, b) => {
    const da = a.dateEnacted || ''
    const db = b.dateEnacted || ''
    if (da !== db) return db.localeCompare(da)
    return a.title.localeCompare(b.title)
  })

  if (opts.limit && opts.limit > 0) docs = docs.slice(0, opts.limit)
  return docs.map(toSummary)
}

/** Document complet (avec content intégral + sections) par slug. */
export function getDocumentBySlug(slug: string): StoredDocument | undefined {
  return all.find((d) => d.slug === slug)
}

/** Document complet par id. */
export function getDocumentById(id: string): StoredDocument | undefined {
  return all.find((d) => d.id === id)
}

/** Sections (articles/titres) d'un document, triées par position. */
export function getSectionsByDocumentId(documentId: string): Section[] {
  const doc = getDocumentById(documentId)
  if (!doc) return []
  return [...(doc.sections || [])].sort((a, b) => (a.position || 0) - (b.position || 0))
}

export interface SectionWithDocument {
  id: string
  title: string
  content: string
  reference: string
  level: number
  position: number
  documentId: string
  Document: { id: string; slug: string; title: string; type: string; category: string }
}

/** Toutes les sections de tous les documents, enrichies de leur document parent
 *  (remplace l'ancien join Supabase Section + Document pour la recherche RAG). */
export function getAllSections(): SectionWithDocument[] {
  const out: SectionWithDocument[] = []
  for (const doc of all) {
    for (const s of doc.sections || []) {
      out.push({
        id: s.id,
        title: s.title,
        content: s.content,
        reference: s.reference || s.title,
        level: s.level,
        position: s.position,
        documentId: doc.id,
        Document: {
          id: doc.id,
          slug: doc.slug,
          title: doc.title,
          type: doc.type,
          category: doc.category,
        },
      })
    }
  }
  return out
}
