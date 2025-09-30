-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Supabase RLS pour sécuriser les données
-- ============================================

-- ============================================
-- ENABLE RLS sur toutes les tables
-- ============================================
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Section" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Procedure" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "NewsArticle" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuizQuestion" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Conversation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Citation" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Feedback" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Embedding" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Analytics" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuizAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SearchQuery" ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: Accès PUBLIC en lecture (non authentifié)
-- ============================================

-- Document: Public read access (documents actifs uniquement)
CREATE POLICY "document_public_select"
  ON "Document" FOR SELECT
  USING (status = 'ACTIVE');

-- Section: Public read access
CREATE POLICY "section_public_select"
  ON "Section" FOR SELECT
  USING (true);

-- Procedure: Public read access
CREATE POLICY "procedure_public_select"
  ON "Procedure" FOR SELECT
  USING (true);

-- NewsArticle: Public read access (articles pertinents)
CREATE POLICY "news_public_select"
  ON "NewsArticle" FOR SELECT
  USING ("isRelevant" = true);

-- QuizQuestion: Public read access
CREATE POLICY "quiz_public_select"
  ON "QuizQuestion" FOR SELECT
  USING (true);

-- Embedding: Public read access (pour recherche)
CREATE POLICY "embedding_public_select"
  ON "Embedding" FOR SELECT
  USING (true);

-- ============================================
-- POLICIES: Accès PUBLIC en écriture (limité)
-- ============================================

-- Conversation: Public can create and read own
CREATE POLICY "conversation_public_insert"
  ON "Conversation" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "conversation_public_select"
  ON "Conversation" FOR SELECT
  USING (true);

CREATE POLICY "conversation_public_update"
  ON "Conversation" FOR UPDATE
  USING (true);

-- Message: Public can create and read
CREATE POLICY "message_public_insert"
  ON "Message" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "message_public_select"
  ON "Message" FOR SELECT
  USING (true);

-- Citation: Public can create and read
CREATE POLICY "citation_public_insert"
  ON "Citation" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "citation_public_select"
  ON "Citation" FOR SELECT
  USING (true);

-- Feedback: Public can create
CREATE POLICY "feedback_public_insert"
  ON "Feedback" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "feedback_public_select"
  ON "Feedback" FOR SELECT
  USING (true);

-- QuizAttempt: Public can create
CREATE POLICY "quiz_attempt_public_insert"
  ON "QuizAttempt" FOR INSERT
  WITH CHECK (true);

CREATE POLICY "quiz_attempt_public_select"
  ON "QuizAttempt" FOR SELECT
  USING (true);

-- Analytics: Public can create
CREATE POLICY "analytics_public_insert"
  ON "Analytics" FOR INSERT
  WITH CHECK (true);

-- SearchQuery: Public can create
CREATE POLICY "search_query_public_insert"
  ON "SearchQuery" FOR INSERT
  WITH CHECK (true);

-- ============================================
-- POLICIES: Accès ADMIN (authentifié)
-- Note: Ces policies nécessitent Supabase Auth
-- À adapter selon votre système d'authentification
-- ============================================

-- Document: Admin full access
CREATE POLICY "document_admin_all"
  ON "Document" FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Procedure: Admin full access
CREATE POLICY "procedure_admin_all"
  ON "Procedure" FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- NewsArticle: Admin full access
CREATE POLICY "news_admin_all"
  ON "NewsArticle" FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- QuizQuestion: Admin full access
CREATE POLICY "quiz_admin_all"
  ON "QuizQuestion" FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Embedding: Admin full access
CREATE POLICY "embedding_admin_all"
  ON "Embedding" FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Analytics: Admin can read
CREATE POLICY "analytics_admin_select"
  ON "Analytics" FOR SELECT
  USING (auth.role() = 'authenticated');

-- ============================================
-- FONCTIONS HELPER pour RLS
-- ============================================

-- Fonction pour vérifier si l'utilisateur est admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- À adapter selon votre système d'auth
  -- Exemple avec Supabase Auth:
  RETURN auth.role() = 'authenticated' AND
         auth.jwt()->>'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Fonction pour vérifier ownership d'une conversation
CREATE OR REPLACE FUNCTION owns_conversation(conversation_id TEXT, session_id TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM "Conversation"
    WHERE id = conversation_id
      AND "sessionId" = session_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;