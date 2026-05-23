// ============================================
// Couche d'accès aux procédures (stockage STATIQUE / Git)
// Remplace l'ancien accès Supabase pour la table "Procedure".
// ============================================
import type { Procedure } from "@/lib/types/database"
import { PROCEDURES } from "./data"

export interface ProcedureListOptions {
  category?: string
  difficulty?: string
  search?: string
  limit?: number
}

/** Liste filtrée des procédures, triées par popularité décroissante. */
export function listProcedures(opts: ProcedureListOptions = {}): Procedure[] {
  let procs = [...PROCEDURES]

  if (opts.category && opts.category !== "all") {
    procs = procs.filter((p) => p.category === opts.category)
  }
  if (opts.difficulty) {
    procs = procs.filter((p) => p.difficulty === opts.difficulty)
  }
  if (opts.search) {
    const q = opts.search.toLowerCase()
    procs = procs.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }

  procs.sort((a, b) => (b.popularity || 0) - (a.popularity || 0))

  if (opts.limit && opts.limit > 0) procs = procs.slice(0, opts.limit)
  return procs
}

/** Procédure complète par slug. */
export function getProcedureBySlug(slug: string): Procedure | undefined {
  return PROCEDURES.find((p) => p.slug === slug)
}
