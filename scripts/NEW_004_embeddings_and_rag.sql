-- ============================================
-- SYSTÈME RAG - EMBEDDINGS & RECHERCHE VECTORIELLE
-- Table Embedding + Fonctions de recherche
-- ============================================

-- ============================================
-- 1. TABLE EMBEDDING (Vecteurs pour RAG)
-- ============================================
CREATE TABLE "Embedding" (
  id TEXT PRIMARY KEY DEFAULT ('emb_' || replace(gen_random_uuid()::TEXT, '-', '')),

  -- Source du chunk
  "documentId" TEXT REFERENCES "Document"(id) ON DELETE CASCADE,
  "sectionId" TEXT REFERENCES "Section"(id) ON DELETE CASCADE,
  "procedureId" TEXT REFERENCES "Procedure"(id) ON DELETE CASCADE,
  "newsId" TEXT REFERENCES "NewsArticle"(id) ON DELETE CASCADE,

  -- Contenu du chunk
  text TEXT NOT NULL,
  "textEn" TEXT,
  "chunkIndex" INTEGER NOT NULL DEFAULT 0,

  -- Vector (768 dimensions pour text-embedding-004)
  embedding VECTOR(768) NOT NULL,

  -- Métadonnées
  model TEXT DEFAULT 'text-embedding-004' NOT NULL,
  tokens INTEGER NOT NULL,

  -- Type de source
  "sourceType" TEXT NOT NULL CHECK ("sourceType" IN ('document', 'section', 'procedure', 'news')),

  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Contrainte: au moins une source doit être définie
  CONSTRAINT embedding_has_source CHECK (
    ("documentId" IS NOT NULL) OR
    ("sectionId" IS NOT NULL) OR
    ("procedureId" IS NOT NULL) OR
    ("newsId" IS NOT NULL)
  )
);

-- Index pour Embedding
CREATE INDEX idx_embedding_document ON "Embedding"("documentId");
CREATE INDEX idx_embedding_section ON "Embedding"("sectionId");
CREATE INDEX idx_embedding_procedure ON "Embedding"("procedureId");
CREATE INDEX idx_embedding_news ON "Embedding"("newsId");
CREATE INDEX idx_embedding_source_type ON "Embedding"("sourceType");

-- Index vectoriel (HNSW pour meilleure performance que IVFFlat)
CREATE INDEX idx_embedding_vector ON "Embedding"
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- ============================================
-- 2. FONCTION: Recherche vectorielle dans documents
-- ============================================
CREATE OR REPLACE FUNCTION search_embeddings_documents(
  query_embedding VECTOR(768),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id TEXT,
  "documentId" TEXT,
  text TEXT,
  similarity FLOAT,
  document_title TEXT,
  document_reference TEXT,
  document_type TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e."documentId",
    e.text,
    1 - (e.embedding <=> query_embedding) AS similarity,
    d.title AS document_title,
    d.reference AS document_reference,
    d.type AS document_type
  FROM "Embedding" e
  JOIN "Document" d ON d.id = e."documentId"
  WHERE e."sourceType" = 'document'
    AND d.status = 'ACTIVE'
    AND 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- ============================================
-- 3. FONCTION: Recherche vectorielle multi-sources
-- ============================================
CREATE OR REPLACE FUNCTION search_embeddings_all(
  query_embedding VECTOR(768),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id TEXT,
  "sourceType" TEXT,
  "sourceId" TEXT,
  text TEXT,
  similarity FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH ranked_embeddings AS (
    SELECT
      e.id,
      e."sourceType",
      COALESCE(e."documentId", e."sectionId", e."procedureId", e."newsId") AS "sourceId",
      e.text,
      1 - (e.embedding <=> query_embedding) AS similarity,
      CASE
        WHEN e."sourceType" = 'document' THEN
          jsonb_build_object(
            'title', d.title,
            'reference', d.reference,
            'type', d.type,
            'category', d.category
          )
        WHEN e."sourceType" = 'procedure' THEN
          jsonb_build_object(
            'name', p.name,
            'slug', p.slug,
            'category', p.category,
            'difficulty', p.difficulty
          )
        WHEN e."sourceType" = 'news' THEN
          jsonb_build_object(
            'title', n.title,
            'source', n.source,
            'category', n.category,
            'publishedAt', n."publishedAt"
          )
        ELSE '{}'::JSONB
      END AS metadata
    FROM "Embedding" e
    LEFT JOIN "Document" d ON d.id = e."documentId"
    LEFT JOIN "Procedure" p ON p.id = e."procedureId"
    LEFT JOIN "NewsArticle" n ON n.id = e."newsId"
    WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
    ORDER BY e.embedding <=> query_embedding
    LIMIT match_count
  )
  SELECT * FROM ranked_embeddings;
END;
$$;

-- ============================================
-- 4. FONCTION: Recherche hybride (Vector + Full-text)
-- ============================================
CREATE OR REPLACE FUNCTION search_hybrid(
  search_query TEXT,
  query_embedding VECTOR(768),
  match_threshold FLOAT DEFAULT 0.7,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  id TEXT,
  "sourceType" TEXT,
  "sourceId" TEXT,
  text TEXT,
  vector_similarity FLOAT,
  text_rank FLOAT,
  combined_score FLOAT,
  metadata JSONB
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH vector_results AS (
    SELECT
      e.id,
      e."sourceType",
      COALESCE(e."documentId", e."procedureId", e."newsId") AS "sourceId",
      e.text,
      1 - (e.embedding <=> query_embedding) AS similarity
    FROM "Embedding" e
    WHERE 1 - (e.embedding <=> query_embedding) > match_threshold
    ORDER BY e.embedding <=> query_embedding
    LIMIT match_count * 2
  ),
  text_results AS (
    SELECT
      d.id,
      'document'::TEXT AS "sourceType",
      d.id AS "sourceId",
      d.summary AS text,
      ts_rank(d."searchVector", websearch_to_tsquery('french', search_query)) AS rank
    FROM "Document" d
    WHERE d."searchVector" @@ websearch_to_tsquery('french', search_query)
      AND d.status = 'ACTIVE'
    ORDER BY rank DESC
    LIMIT match_count
  ),
  combined AS (
    SELECT
      COALESCE(v.id, t.id) AS id,
      COALESCE(v."sourceType", t."sourceType") AS "sourceType",
      COALESCE(v."sourceId", t."sourceId") AS "sourceId",
      COALESCE(v.text, t.text) AS text,
      COALESCE(v.similarity, 0) AS vector_similarity,
      COALESCE(t.rank, 0) AS text_rank,
      (COALESCE(v.similarity, 0) * 0.7 + COALESCE(t.rank, 0) * 0.3) AS combined_score
    FROM vector_results v
    FULL OUTER JOIN text_results t ON v.id = t.id
  )
  SELECT
    c.id,
    c."sourceType",
    c."sourceId",
    c.text,
    c.vector_similarity,
    c.text_rank,
    c.combined_score,
    CASE
      WHEN c."sourceType" = 'document' THEN
        (SELECT jsonb_build_object(
          'title', d.title,
          'reference', d.reference,
          'type', d.type
        ) FROM "Document" d WHERE d.id = c."sourceId")
      WHEN c."sourceType" = 'procedure' THEN
        (SELECT jsonb_build_object(
          'name', p.name,
          'slug', p.slug
        ) FROM "Procedure" p WHERE p.id = c."sourceId")
      ELSE '{}'::JSONB
    END AS metadata
  FROM combined c
  ORDER BY c.combined_score DESC
  LIMIT match_count;
END;
$$;