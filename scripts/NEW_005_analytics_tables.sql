-- ============================================
-- TABLES ANALYTICS & TRACKING
-- Analytics, QuizAttempt, SearchQuery
-- ============================================

-- ============================================
-- 1. TABLE ANALYTICS (Événements utilisateur)
-- ============================================
CREATE TABLE "Analytics" (
  id TEXT PRIMARY KEY DEFAULT ('analytics_' || replace(gen_random_uuid()::TEXT, '-', '')),

  event TEXT NOT NULL CHECK (event IN (
    'PAGE_VIEW',
    'SEARCH',
    'DOCUMENT_VIEW',
    'PROCEDURE_VIEW',
    'NEWS_VIEW',
    'QUIZ_START',
    'QUIZ_COMPLETE',
    'CONVERSATION_START',
    'MESSAGE_SENT',
    'MESSAGE_RECEIVED',
    'MESSAGE_ERROR',
    'CITATION_CLICKED',
    'FEEDBACK_SUBMITTED'
  )),

  "sessionId" TEXT NOT NULL,

  -- Données de l'événement
  data JSONB NOT NULL DEFAULT '{}'::JSONB,

  language TEXT NOT NULL CHECK (language IN ('FR', 'EN')),
  "userAgent" TEXT,
  ip TEXT, -- Hash pour privacy

  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour Analytics
CREATE INDEX idx_analytics_event_created ON "Analytics"(event, "createdAt" DESC);
CREATE INDEX idx_analytics_session ON "Analytics"("sessionId");
CREATE INDEX idx_analytics_created ON "Analytics"("createdAt" DESC);

-- ============================================
-- 2. TABLE QUIZATTEMPT (Tentatives de quiz)
-- ============================================
CREATE TABLE "QuizAttempt" (
  id TEXT PRIMARY KEY DEFAULT ('attempt_' || replace(gen_random_uuid()::TEXT, '-', '')),
  "sessionId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL REFERENCES "QuizQuestion"(id) ON DELETE CASCADE,

  answer TEXT NOT NULL,
  "isCorrect" BOOLEAN NOT NULL,
  "timeSpent" INTEGER NOT NULL, -- secondes

  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour QuizAttempt
CREATE INDEX idx_quiz_attempt_session ON "QuizAttempt"("sessionId");
CREATE INDEX idx_quiz_attempt_question ON "QuizAttempt"("questionId");
CREATE INDEX idx_quiz_attempt_created ON "QuizAttempt"("createdAt" DESC);

-- Trigger pour mettre à jour les stats de QuizQuestion
CREATE OR REPLACE FUNCTION update_quiz_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE "QuizQuestion"
  SET
    "timesAsked" = "timesAsked" + 1,
    "correctCount" = "correctCount" + CASE WHEN NEW."isCorrect" THEN 1 ELSE 0 END,
    "incorrectCount" = "incorrectCount" + CASE WHEN NOT NEW."isCorrect" THEN 1 ELSE 0 END,
    "updatedAt" = NOW()
  WHERE id = NEW."questionId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER quiz_attempt_inserted
  AFTER INSERT ON "QuizAttempt"
  FOR EACH ROW
  EXECUTE FUNCTION update_quiz_stats();

-- ============================================
-- 3. TABLE SEARCHQUERY (Historique recherches)
-- ============================================
CREATE TABLE "SearchQuery" (
  id TEXT PRIMARY KEY DEFAULT ('search_' || replace(gen_random_uuid()::TEXT, '-', '')),

  query TEXT NOT NULL,
  "resultCount" INTEGER DEFAULT 0 NOT NULL,
  "searchType" TEXT NOT NULL CHECK ("searchType" IN ('fulltext', 'vector', 'hybrid')),

  -- Résultat cliqué
  "clickedResultId" TEXT,
  "clickedResultType" TEXT,
  "clickPosition" INTEGER,

  "sessionId" TEXT NOT NULL,
  language TEXT NOT NULL CHECK (language IN ('FR', 'EN')),

  "createdAt" TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Index pour SearchQuery
CREATE INDEX idx_search_query_text ON "SearchQuery"(query);
CREATE INDEX idx_search_query_session ON "SearchQuery"("sessionId");
CREATE INDEX idx_search_query_created ON "SearchQuery"("createdAt" DESC);

-- ============================================
-- 4. VUES ANALYTIQUES
-- ============================================

-- Vue: Statistiques quotidiennes globales
CREATE OR REPLACE VIEW daily_stats AS
SELECT
  DATE("createdAt") AS date,
  COUNT(*) FILTER (WHERE event = 'PAGE_VIEW') AS page_views,
  COUNT(*) FILTER (WHERE event = 'CONVERSATION_START') AS conversations_started,
  COUNT(*) FILTER (WHERE event = 'MESSAGE_SENT') AS messages_sent,
  COUNT(*) FILTER (WHERE event = 'SEARCH') AS searches,
  COUNT(*) FILTER (WHERE event = 'QUIZ_START') AS quizzes_started,
  COUNT(*) FILTER (WHERE event = 'QUIZ_COMPLETE') AS quizzes_completed,
  COUNT(DISTINCT "sessionId") AS unique_sessions
FROM "Analytics"
GROUP BY DATE("createdAt")
ORDER BY date DESC;

-- Vue: Documents les plus consultés
CREATE OR REPLACE VIEW popular_documents AS
SELECT
  d.id,
  d.title,
  d.type,
  d.category,
  COUNT(a.id) AS view_count,
  MAX(a."createdAt") AS last_viewed
FROM "Document" d
LEFT JOIN "Analytics" a ON
  a.event = 'DOCUMENT_VIEW' AND
  (a.data->>'documentId')::TEXT = d.id
WHERE d.status = 'ACTIVE'
GROUP BY d.id, d.title, d.type, d.category
ORDER BY view_count DESC
LIMIT 50;

-- Vue: Procédures les plus consultées
CREATE OR REPLACE VIEW popular_procedures AS
SELECT
  p.id,
  p.name,
  p.slug,
  p.category,
  p.difficulty,
  p."viewCount",
  COUNT(a.id) AS analytics_views
FROM "Procedure" p
LEFT JOIN "Analytics" a ON
  a.event = 'PROCEDURE_VIEW' AND
  (a.data->>'procedureId')::TEXT = p.id
GROUP BY p.id, p.name, p.slug, p.category, p.difficulty, p."viewCount"
ORDER BY p."viewCount" DESC, analytics_views DESC
LIMIT 50;

-- Vue: Recherches populaires
CREATE OR REPLACE VIEW popular_searches AS
SELECT
  query,
  COUNT(*) AS frequency,
  COUNT(DISTINCT "sessionId") AS unique_users,
  AVG("resultCount") AS avg_results,
  MAX("createdAt") AS last_searched
FROM "SearchQuery"
WHERE LENGTH(query) > 3
GROUP BY query
HAVING COUNT(*) > 2
ORDER BY frequency DESC, last_searched DESC
LIMIT 100;

-- Vue: Performance des questions de quiz
CREATE OR REPLACE VIEW quiz_performance AS
SELECT
  q.id,
  q.category,
  q.difficulty,
  q.question,
  q."timesAsked",
  q."correctRate",
  COUNT(qa.id) AS recent_attempts,
  SUM(CASE WHEN qa."isCorrect" THEN 1 ELSE 0 END)::FLOAT /
    NULLIF(COUNT(qa.id), 0) * 100 AS recent_correct_rate
FROM "QuizQuestion" q
LEFT JOIN "QuizAttempt" qa ON qa."questionId" = q.id
  AND qa."createdAt" > NOW() - INTERVAL '30 days'
GROUP BY q.id, q.category, q.difficulty, q.question, q."timesAsked", q."correctRate"
ORDER BY q."timesAsked" DESC;

-- Vue: Taux de satisfaction (feedbacks)
CREATE OR REPLACE VIEW satisfaction_stats AS
SELECT
  DATE(f."createdAt") AS date,
  COUNT(*) AS total_feedbacks,
  AVG(f.rating) AS avg_rating,
  COUNT(*) FILTER (WHERE f.rating >= 4) AS positive_count,
  COUNT(*) FILTER (WHERE f.rating <= 2) AS negative_count,
  ROUND(
    COUNT(*) FILTER (WHERE f.rating >= 4)::DECIMAL /
    NULLIF(COUNT(*), 0) * 100,
    2
  ) AS satisfaction_percentage
FROM "Feedback" f
GROUP BY DATE(f."createdAt")
ORDER BY date DESC;