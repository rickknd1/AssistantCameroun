// ⚠️ FICHIER AUTO-GÉNÉRÉ par scripts/gen-documents-registry.mjs — NE PAS ÉDITER À LA MAIN
import type { Document, Section } from '@/lib/types/database'
import d0 from '@/content/documents/code-du-travail.json'
import d1 from '@/content/documents/code-justice-administrative.json'
import d2 from '@/content/documents/code-penal.json'
import d3 from '@/content/documents/constitution-de-la-republique-du-cameroun.json'
import d4 from '@/content/documents/decret-2025-059-titres-identitaires.json'
import d5 from '@/content/documents/loi-de-finances-2025.json'
import d6 from '@/content/documents/loi-organisation-judiciaire.json'

export type StoredDocument = Document & { sections: Section[] }

export const documents = [d0, d1, d2, d3, d4, d5, d6] as unknown as StoredDocument[]
