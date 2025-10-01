-- ============================================
-- FEEDBACK TABLE
-- Table pour stocker les feedbacks des utilisateurs
-- ============================================

-- Créer la table Feedback
CREATE TABLE IF NOT EXISTS "Feedback" (
  "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "message" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'recommendation' CHECK ("type" IN ('recommendation', 'bug', 'suggestion', 'other')),
  "page" TEXT,
  "ip" TEXT,
  "status" TEXT DEFAULT 'NEW' CHECK ("status" IN ('NEW', 'READ', 'PROCESSED')),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour rechercher par statut
CREATE INDEX IF NOT EXISTS "idx_feedback_status" ON "Feedback"("status");

-- Index pour rechercher par type
CREATE INDEX IF NOT EXISTS "idx_feedback_type" ON "Feedback"("type");

-- Index pour rechercher par date
CREATE INDEX IF NOT EXISTS "idx_feedback_created" ON "Feedback"("createdAt" DESC);

-- Fonction pour mettre à jour updatedAt automatiquement
CREATE OR REPLACE FUNCTION update_feedback_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour updatedAt
DROP TRIGGER IF EXISTS trigger_update_feedback_timestamp ON "Feedback";
CREATE TRIGGER trigger_update_feedback_timestamp
  BEFORE UPDATE ON "Feedback"
  FOR EACH ROW
  EXECUTE FUNCTION update_feedback_timestamp();

-- Commentaires
COMMENT ON TABLE "Feedback" IS 'Stocke les feedbacks, recommandations et remarques des utilisateurs';
COMMENT ON COLUMN "Feedback"."type" IS 'Type de feedback: recommendation, bug, suggestion, other';
COMMENT ON COLUMN "Feedback"."status" IS 'Statut du feedback: NEW, READ, PROCESSED';
