-- Ajouter la colonne status à la table Feedback existante
ALTER TABLE "Feedback"
ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'NEW' CHECK ("status" IN ('NEW', 'READ', 'PROCESSED'));

-- Créer l'index pour la colonne status
CREATE INDEX IF NOT EXISTS "idx_feedback_status" ON "Feedback"("status");

-- Mettre à jour les enregistrements existants
UPDATE "Feedback" SET "status" = 'NEW' WHERE "status" IS NULL;
