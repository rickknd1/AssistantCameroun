-- =====================================================
-- SYSTÈME D'APPRENTISSAGE INTELLIGENT POUR CAMI
-- Tables pour cache, feedback et vérification
-- =====================================================

-- 1. CACHE DE QUESTIONS/RÉPONSES VALIDÉES
CREATE TABLE IF NOT EXISTS "QuestionCache" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Question
  "questionNormalized" TEXT NOT NULL, -- Question normalisée (lowercase, sans accents)
  "questionOriginal" TEXT NOT NULL, -- Question originale
  "questionHash" TEXT UNIQUE NOT NULL, -- Hash pour recherche rapide

  -- Réponse
  "response" TEXT NOT NULL,
  "sources" JSONB NOT NULL DEFAULT '[]',
  "confidence" INTEGER NOT NULL CHECK ("confidence" BETWEEN 0 AND 100),

  -- Métadonnées
  "questionType" TEXT, -- 'juridique', 'procedure', 'generale'
  "keywords" TEXT[], -- Mots-clés extraits
  "documentsReferenced" TEXT[], -- IDs des documents référencés

  -- Vérification
  "verifiedAt" TIMESTAMP,
  "verifiedBy" TEXT, -- 'auto', 'admin', 'feedback'
  "verificationScore" INTEGER DEFAULT 0, -- Score de véracité (0-100)

  -- Statistiques dusage
  "usageCount" INTEGER DEFAULT 0,
  "successCount" INTEGER DEFAULT 0, -- Nombre de feedbacks positifs
  "failureCount" INTEGER DEFAULT 0, -- Nombre de feedbacks négatifs
  "successRate" DECIMAL GENERATED ALWAYS AS (
    CASE
      WHEN ("successCount" + "failureCount") > 0
      THEN ("successCount"::DECIMAL / ("successCount" + "failureCount")) * 100
      ELSE 0
    END
  ) STORED,

  -- Timestamps
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW(),
  "lastUsedAt" TIMESTAMP
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS "idx_question_hash" ON "QuestionCache"("questionHash");
CREATE INDEX IF NOT EXISTS "idx_question_normalized" ON "QuestionCache" USING gin(to_tsvector('french', "questionNormalized"));
CREATE INDEX IF NOT EXISTS "idx_keywords" ON "QuestionCache" USING gin("keywords");
CREATE INDEX IF NOT EXISTS "idx_usage_count" ON "QuestionCache"("usageCount" DESC);
CREATE INDEX IF NOT EXISTS "idx_success_rate" ON "QuestionCache"("successRate" DESC);

-- =====================================================
-- 2. FEEDBACK UTILISATEURS
CREATE TABLE IF NOT EXISTS "ResponseFeedback" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relations
  "questionCacheId" UUID REFERENCES "QuestionCache"("id") ON DELETE CASCADE,
  "messageId" TEXT, -- Type TEXT pour correspondre à Message.id (pas de foreign key à cause du type)
  "sessionId" TEXT,

  -- Feedback
  "rating" INTEGER CHECK ("rating" BETWEEN 1 AND 5), -- 1-5 étoiles OU 1 (👎) / 5 (👍)
  "feedbackType" TEXT, -- 'helpful', 'not_helpful', 'incorrect', 'incomplete'
  "comment" TEXT,

  -- Contexte
  "userAgent" TEXT,
  "ipAddress" TEXT,

  -- Timestamps
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS "idx_feedback_cache" ON "ResponseFeedback"("questionCacheId");
CREATE INDEX IF NOT EXISTS "idx_feedback_rating" ON "ResponseFeedback"("rating");
CREATE INDEX IF NOT EXISTS "idx_feedback_created" ON "ResponseFeedback"("createdAt" DESC);

-- =====================================================
-- 3. LOGS DE VÉRIFICATION AUTOMATIQUE
CREATE TABLE IF NOT EXISTS "VerificationLog" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relation
  "questionCacheId" UUID REFERENCES "QuestionCache"("id") ON DELETE CASCADE,

  -- Vérification
  "verificationType" TEXT NOT NULL, -- 'source_check', 'cross_reference', 'confidence_threshold', 'admin_review'
  "status" TEXT NOT NULL, -- 'verified', 'flagged', 'rejected', 'pending'
  "score" INTEGER CHECK ("score" BETWEEN 0 AND 100),

  -- Détails
  "details" JSONB DEFAULT '{}', -- Détails de la vérification
  "issues" TEXT[], -- Liste des problèmes détectés
  "suggestions" TEXT[], -- Suggestions d'amélioration

  -- Timestamps
  "createdAt" TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS "idx_verification_cache" ON "VerificationLog"("questionCacheId");
CREATE INDEX IF NOT EXISTS "idx_verification_status" ON "VerificationLog"("status");
CREATE INDEX IF NOT EXISTS "idx_verification_type" ON "VerificationLog"("verificationType");

-- =====================================================
-- 4. FONCTION TRIGGER : Mise à jour automatique updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger sur QuestionCache
DROP TRIGGER IF EXISTS update_question_cache_updated_at ON "QuestionCache";
CREATE TRIGGER update_question_cache_updated_at
  BEFORE UPDATE ON "QuestionCache"
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 5. FONCTION : Normaliser une question
CREATE OR REPLACE FUNCTION normalize_question(question TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN LOWER(
    TRIM(
      REGEXP_REPLACE(
        -- Retirer accents
        TRANSLATE(question,
          'àáâãäåèéêëìíîïòóôõöùúûüýÿñçÀÁÂÃÄÅÈÉÊËÌÍÎÏÒÓÔÕÖÙÚÛÜÝŸÑÇ',
          'aaaaaaeeeeiiiiooooouuuuyyncAAAAAAEEEEIIIIOOOOOUUUUYYNC'
        ),
        '[^a-z0-9\s]', '', 'g' -- Retirer ponctuation
      )
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- 6. FONCTION : Générer hash de question
CREATE OR REPLACE FUNCTION generate_question_hash(question TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN MD5(normalize_question(question));
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- =====================================================
-- 7. VUE : Statistiques du cache
CREATE OR REPLACE VIEW "CacheStatistics" AS
SELECT
  COUNT(*) as "totalCached",
  COUNT(*) FILTER (WHERE "verifiedAt" IS NOT NULL) as "verified",
  COUNT(*) FILTER (WHERE "verificationScore" >= 80) as "highQuality",
  SUM("usageCount") as "totalUsage",
  AVG("successRate") as "avgSuccessRate",
  AVG("confidence") as "avgConfidence",
  COUNT(*) FILTER (WHERE "lastUsedAt" > NOW() - INTERVAL '7 days') as "recentlyUsed"
FROM "QuestionCache";

-- =====================================================
-- 8. VUE : Top questions les plus utilisées
CREATE OR REPLACE VIEW "TopQuestions" AS
SELECT
  "id",
  "questionOriginal",
  "usageCount",
  "successRate",
  "confidence",
  "verificationScore",
  "lastUsedAt"
FROM "QuestionCache"
WHERE "usageCount" > 0
ORDER BY "usageCount" DESC, "successRate" DESC
LIMIT 100;

-- =====================================================
-- COMMENTAIRES
COMMENT ON TABLE "QuestionCache" IS 'Cache de questions/réponses validées pour apprentissage de Cami';
COMMENT ON TABLE "ResponseFeedback" IS 'Feedback utilisateurs sur la qualité des réponses';
COMMENT ON TABLE "VerificationLog" IS 'Logs de vérification automatique de véracité';
COMMENT ON COLUMN "QuestionCache"."questionHash" IS 'Hash MD5 de la question normalisée pour recherche rapide';
COMMENT ON COLUMN "QuestionCache"."verificationScore" IS 'Score de véracité calculé automatiquement (0-100)';
COMMENT ON COLUMN "QuestionCache"."successRate" IS 'Taux de satisfaction calculé automatiquement (%)';
