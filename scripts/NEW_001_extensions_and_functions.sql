-- ============================================
-- EXTENSIONS ET FONCTIONS UTILITAIRES
-- Base de données Supabase pour Assistant Cameroun
-- ============================================

-- 1. Activer les extensions nécessaires
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";      -- Génération UUID
CREATE EXTENSION IF NOT EXISTS "vector";         -- pgvector pour RAG
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- Trigram pour recherche floue
CREATE EXTENSION IF NOT EXISTS "unaccent";       -- Suppression accents

-- 2. Fonction pour update automatique de updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Fonction pour générer des slugs
CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        unaccent(text_input),
        '[^a-zA-Z0-9\s-]', '', 'g'
      ),
      '\s+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 4. Fonction pour recherche full-text (français)
CREATE OR REPLACE FUNCTION search_documents_fulltext(search_query TEXT, result_limit INT DEFAULT 20)
RETURNS TABLE(
  id TEXT,
  title TEXT,
  type TEXT,
  category TEXT,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.title,
    d.type,
    d.category,
    ts_rank(d."searchVector", websearch_to_tsquery('french', search_query)) as rank
  FROM "Document" d
  WHERE d."searchVector" @@ websearch_to_tsquery('french', search_query)
    AND d.status = 'ACTIVE'
  ORDER BY rank DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql;