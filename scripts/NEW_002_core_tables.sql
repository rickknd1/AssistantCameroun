-- ============================================
-- TABLES PRINCIPALES
-- Document, Section, Procedure, NewsArticle, QuizQuestion
-- ============================================

-- ============================================
-- 1. TABLE DOCUMENT (Bibliothèque juridique)
-- ============================================
CREATE TABLE "Document" (
  id TEXT PRIMARY KEY DEFAULT ('doc_' || replace(gen_random_uuid()::TEXT, '-', '')),
  slug TEXT UNIQUE NOT NULL,

  -- Titres
  title TEXT NOT NULL,
  "titleEn" TEXT,

  -- Métadonnées
  type TEXT NOT NULL CHECK (type IN ('CODE', 'LOI', 'DÉCRET', 'ORDONNANCE', 'ARRÊTÉ', 'CIRCULAIRE')),
  category TEXT NOT NULL,
  subcategory TEXT,
  source TEXT NOT NULL,
  "sourceFile" TEXT,

  -- Contenu
  content TEXT NOT NULL,
  "contentEn" TEXT,
  summary TEXT,
  "summaryEn" TEXT,

  -- Métadonnées juridiques
  reference TEXT,
  "dateEnacted" TIMESTAMPTZ,
  "dateEffective" TIMESTAMPTZ,
  status TEXT DEFAULT 'ACTIVE' NOT NULL CHECK (status IN ('ACTIVE', 'ABROGATED', 'MODIFIED', 'ARCHIVED')),

  -- Recherche full-text
  "searchVector" TSVECTOR GENERATED ALWAYS AS (
    setweight(to_tsvector('french', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('french', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('french', coalesce(content, '')), 'C') ||
    setweight(to_tsvector('french', coalesce(reference, '')), 'D')
  ) STORED,

  tags TEXT[],

  -- Timestamps
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "lastCrawled" TIMESTAMPTZ
);

-- Index pour Document
CREATE INDEX idx_document_type_category ON "Document"(type, category);
CREATE INDEX idx_document_status ON "Document"(status);
CREATE INDEX idx_document_slug ON "Document"(slug);
CREATE INDEX idx_document_search_vector ON "Document" USING GIN("searchVector");
CREATE INDEX idx_document_date_enacted ON "Document"("dateEnacted");
CREATE INDEX idx_document_tags ON "Document" USING GIN(tags);

-- Trigger pour updatedAt
CREATE TRIGGER update_document_updated_at
  BEFORE UPDATE ON "Document"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. TABLE SECTION (Sections de documents)
-- ============================================
CREATE TABLE "Section" (
  id TEXT PRIMARY KEY DEFAULT ('sec_' || replace(gen_random_uuid()::TEXT, '-', '')),
  "documentId" TEXT NOT NULL REFERENCES "Document"(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  content TEXT NOT NULL,
  "contentEn" TEXT,

  -- Hiérarchie
  "parentId" TEXT REFERENCES "Section"(id) ON DELETE SET NULL,

  -- Position
  position INTEGER NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  reference TEXT,

  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour Section
CREATE INDEX idx_section_document_position ON "Section"("documentId", position);
CREATE INDEX idx_section_parent ON "Section"("parentId");

-- ============================================
-- 3. TABLE PROCEDURE (Procédures administratives)
-- ============================================
CREATE TABLE "Procedure" (
  id TEXT PRIMARY KEY DEFAULT ('proc_' || replace(gen_random_uuid()::TEXT, '-', '')),
  slug TEXT UNIQUE NOT NULL,

  -- Titres
  name TEXT NOT NULL,
  "nameEn" TEXT,
  description TEXT NOT NULL,
  "descriptionEn" TEXT,

  category TEXT NOT NULL CHECK (category IN ('identite', 'entreprise', 'foncier', 'transport', 'education', 'justice', 'sante', 'autre')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Facile', 'Moyen', 'Difficile')),

  -- Détails (JSONB pour flexibilité)
  steps JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- Format: [{"step": 1, "title": "...", "description": "..."}]

  documents JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- Format: ["Document 1", "Document 2"]

  costs JSONB NOT NULL DEFAULT '{}'::JSONB,
  -- Format: [{"item": "...", "amount": "..."}]

  duration TEXT NOT NULL,

  locations JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- Format: [{"name": "...", "address": "...", "hours": "..."}]

  tips JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- Format: ["Conseil 1", "Conseil 2"]

  faqs JSONB NOT NULL DEFAULT '[]'::JSONB,
  -- Format: [{"question": "...", "answer": "..."}]

  -- Liens
  "onlineUrl" TEXT,
  "formUrl" TEXT,

  -- Stats
  popularity INTEGER DEFAULT 0 NOT NULL,
  "viewCount" INTEGER DEFAULT 0 NOT NULL,

  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour Procedure
CREATE INDEX idx_procedure_category ON "Procedure"(category);
CREATE INDEX idx_procedure_slug ON "Procedure"(slug);
CREATE INDEX idx_procedure_difficulty ON "Procedure"(difficulty);
CREATE INDEX idx_procedure_popularity ON "Procedure"(popularity DESC);

-- Trigger pour updatedAt
CREATE TRIGGER update_procedure_updated_at
  BEFORE UPDATE ON "Procedure"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 4. TABLE NEWSARTICLE (Actualités)
-- ============================================
CREATE TABLE "NewsArticle" (
  id TEXT PRIMARY KEY DEFAULT ('news_' || replace(gen_random_uuid()::TEXT, '-', '')),

  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  content TEXT,
  url TEXT UNIQUE NOT NULL,
  "imageUrl" TEXT,

  source TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Juridique', 'Administratif', 'Entreprise', 'Foncier', 'Social', 'Education', 'Sante', 'Tous')),

  -- IA
  "isRelevant" BOOLEAN DEFAULT TRUE NOT NULL,
  "aiSummary" TEXT,
  tags TEXT[],

  -- Stats
  "viewCount" INTEGER DEFAULT 0 NOT NULL,
  "isFeatured" BOOLEAN DEFAULT FALSE NOT NULL,
  "readTime" INTEGER, -- minutes

  "publishedAt" TIMESTAMPTZ NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour NewsArticle
CREATE INDEX idx_news_published ON "NewsArticle"("publishedAt" DESC);
CREATE INDEX idx_news_category ON "NewsArticle"(category);
CREATE INDEX idx_news_featured ON "NewsArticle"("isFeatured") WHERE "isFeatured" = TRUE;
CREATE INDEX idx_news_tags ON "NewsArticle" USING GIN(tags);

-- Trigger pour updatedAt
CREATE TRIGGER update_news_updated_at
  BEFORE UPDATE ON "NewsArticle"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. TABLE QUIZQUESTION (Questions de quiz)
-- ============================================
CREATE TABLE "QuizQuestion" (
  id TEXT PRIMARY KEY DEFAULT ('quiz_' || replace(gen_random_uuid()::TEXT, '-', '')),

  -- Contenu
  question TEXT NOT NULL,
  "questionEn" TEXT,

  options JSONB NOT NULL,
  -- Format: ["Option A", "Option B", "Option C", "Option D"]

  answer TEXT NOT NULL,
  -- Index de la bonne réponse (0, 1, 2, 3)

  explanation TEXT NOT NULL,
  "explanationEn" TEXT,

  -- Catégorie
  category TEXT NOT NULL CHECK (category IN ('droit-penal', 'procedures-admin', 'droit-travail', 'entreprise', 'foncier', 'culture', 'autre')),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Facile', 'Moyen', 'Difficile')),

  -- Source
  "documentId" TEXT REFERENCES "Document"(id) ON DELETE SET NULL,

  -- Stats
  "timesAsked" INTEGER DEFAULT 0 NOT NULL,
  "correctCount" INTEGER DEFAULT 0 NOT NULL,
  "incorrectCount" INTEGER DEFAULT 0 NOT NULL,
  "correctRate" DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE
      WHEN "timesAsked" > 0 THEN ("correctCount"::DECIMAL / "timesAsked"::DECIMAL) * 100
      ELSE 0
    END
  ) STORED,

  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour QuizQuestion
CREATE INDEX idx_quiz_category_difficulty ON "QuizQuestion"(category, difficulty);
CREATE INDEX idx_quiz_document ON "QuizQuestion"("documentId");
CREATE INDEX idx_quiz_correct_rate ON "QuizQuestion"("correctRate" DESC);

-- Trigger pour updatedAt
CREATE TRIGGER update_quiz_updated_at
  BEFORE UPDATE ON "QuizQuestion"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();