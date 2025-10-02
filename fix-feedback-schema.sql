-- Rendre le champ messageId optionnel dans la table Feedback
-- Cela permet d'enregistrer des feedbacks généraux (homepage bubble) sans messageId
-- et des feedbacks spécifiques (like/dislike sur messages) avec messageId

ALTER TABLE "Feedback"
ALTER COLUMN "messageId" DROP NOT NULL;

-- Vérification : afficher les contraintes de la colonne
SELECT
  column_name,
  is_nullable,
  data_type
FROM information_schema.columns
WHERE table_name = 'Feedback'
  AND column_name = 'messageId';
