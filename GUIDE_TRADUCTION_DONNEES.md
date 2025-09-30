# Guide de Traduction des Données

## Problème Actuel

Les **données de la base de données** (documents, procédures, actualités, quiz) ne sont **pas traduites** car elles viennent directement de Supabase en français uniquement.

L'interface utilisateur (boutons, titres, labels) est bien traduite, mais pas le contenu dynamique.

## ⚠️ IMPORTANT : Ajouter les Colonnes Anglaises d'Abord

Avant d'exécuter les requêtes de traduction, vous devez **ajouter les colonnes pour le contenu anglais** dans vos tables Supabase.

### Étape 1 : Ajouter les colonnes (SQL Editor dans Supabase)

```sql
-- Ajouter les colonnes anglaises pour NewsArticle
ALTER TABLE "NewsArticle"
ADD COLUMN IF NOT EXISTS "titleEn" TEXT,
ADD COLUMN IF NOT EXISTS "summaryEn" TEXT,
ADD COLUMN IF NOT EXISTS "contentEn" TEXT;

-- Ajouter les colonnes anglaises pour QuizQuestion
ALTER TABLE "QuizQuestion"
ADD COLUMN IF NOT EXISTS "questionEn" TEXT,
ADD COLUMN IF NOT EXISTS "explanationEn" TEXT,
ADD COLUMN IF NOT EXISTS "optionsEn" JSONB;

-- Ajouter les colonnes anglaises pour Procedure
ALTER TABLE "Procedure"
ADD COLUMN IF NOT EXISTS "nameEn" TEXT,
ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT;

-- Ajouter les colonnes anglaises pour Document
ALTER TABLE "Document"
ADD COLUMN IF NOT EXISTS "titleEn" TEXT,
ADD COLUMN IF NOT EXISTS "descriptionEn" TEXT;
```

## Solution Rapide : SQL dans Supabase

### Option 1 : Ajouter les traductions anglaises manuellement

Connecte-toi à Supabase Dashboard → SQL Editor, puis exécute ces requêtes :

#### 1. Traduire les Actualités

```sql
-- Exemple : Traduire quelques actualités clés
UPDATE "NewsArticle"
SET
  "titleEn" = CASE
    WHEN title = 'Nouvelle loi sur la protection des données personnelles entre en vigueur'
      THEN 'New law on personal data protection comes into force'
    WHEN title = 'Simplification des procédures d''obtention de la CNI'
      THEN 'Simplification of ID card obtaining procedures'
    WHEN title = 'Lancement du guichet unique pour la création d''entreprises'
      THEN 'Launch of one-stop shop for business creation'
    ELSE "titleEn"
  END,
  "summaryEn" = CASE
    WHEN title = 'Nouvelle loi sur la protection des données personnelles entre en vigueur'
      THEN 'The Cameroonian government announced the entry into force of the new law on personal data protection.'
    WHEN title = 'Simplification des procédures d''obtention de la CNI'
      THEN 'Enrollment centers announce a reduction in processing times thanks to digitalization.'
    WHEN title = 'Lancement du guichet unique pour la création d''entreprises'
      THEN 'A new one-stop shop allows you to create your business in a single day.'
    ELSE "summaryEn"
  END,
  "contentEn" = CASE
    WHEN title = 'Nouvelle loi sur la protection des données personnelles entre en vigueur'
      THEN 'The new law strengthens citizens'' privacy rights and imposes obligations on companies...'
    ELSE "contentEn"
  END
WHERE "titleEn" IS NULL OR "summaryEn" IS NULL;
```

#### 2. Traduire les Quiz

```sql
-- Ajouter les traductions anglaises aux quiz existants
UPDATE "QuizQuestion"
SET
  "questionEn" = CASE
    WHEN question = 'Quelle est la durée de validité d''une carte nationale d''identité au Cameroun ?'
      THEN 'What is the validity period of a national ID card in Cameroon?'
    WHEN question = 'Quel est le coût d''obtention d''un passeport ordinaire au Cameroun ?'
      THEN 'What is the cost of obtaining an ordinary passport in Cameroon?'
    ELSE "questionEn"
  END,
  "explanationEn" = CASE
    WHEN question = 'Quelle est la durée de validité d''une carte nationale d''identité au Cameroun ?'
      THEN 'The Cameroonian ID card is valid for 10 years for adults and 5 years for minors.'
    WHEN question = 'Quel est le coût d''obtention d''un passeport ordinaire au Cameroun ?'
      THEN 'The cost of an ordinary passport is 75,000 FCFA for Cameroonian nationals.'
    ELSE "explanationEn"
  END
WHERE "questionEn" IS NULL;

-- Ajouter optionsEn (array d'options traduites)
-- Note : Ceci nécessite une approche différente car c'est un array
```

#### 3. Traduire les Procédures

```sql
-- Traduire les noms de procédures
UPDATE "Procedure"
SET
  "nameEn" = CASE
    WHEN name = 'Obtention de la carte nationale d''identité (CNI)'
      THEN 'Obtaining the national identity card (ID)'
    WHEN name = 'Demande de passeport ordinaire'
      THEN 'Ordinary passport application'
    WHEN name = 'Obtention d''un acte de naissance'
      THEN 'Obtaining a birth certificate'
    ELSE "nameEn"
  END,
  "descriptionEn" = CASE
    WHEN name = 'Obtention de la carte nationale d''identité (CNI)'
      THEN 'Complete procedure to obtain your Cameroonian national identity card'
    WHEN name = 'Demande de passeport ordinaire'
      THEN 'Step-by-step guide to apply for your Cameroonian passport'
    ELSE "descriptionEn"
  END
WHERE "nameEn" IS NULL;
```

#### 4. Traduire les Documents

```sql
-- Traduire les titres de documents
UPDATE "Document"
SET
  "titleEn" = CASE
    WHEN title LIKE '%Code pénal%'
      THEN REPLACE(title, 'Code pénal', 'Penal Code')
    WHEN title LIKE '%Code du travail%'
      THEN REPLACE(title, 'Code du travail', 'Labor Code')
    WHEN title LIKE '%Constitution%'
      THEN REPLACE(title, 'Constitution', 'Constitution')
    ELSE "titleEn"
  END
WHERE "titleEn" IS NULL;
```

### Option 2 : Utiliser Google Translate API (Plus rapide)

Si tu veux traduire toutes les données automatiquement, tu peux utiliser un script avec Google Translate API.

## Corriger les Quiz Vides

### Problème : Catégories incompatibles

Les quiz ont des catégories comme `procedures-admin`, `droit-penal`, etc.
Mais le frontend utilise `identite`, `entreprise`, `juridique`, `foncier`, `education`.

### Solution : Mettre à jour les catégories

```sql
-- Corriger les catégories des quiz pour correspondre au frontend
UPDATE "QuizQuestion"
SET category = CASE
  WHEN category = 'procedures-admin' THEN 'identite'
  WHEN category = 'droit-penal' THEN 'juridique'
  WHEN category = 'droit-travail' THEN 'juridique'
  WHEN category = 'entreprise' THEN 'entreprise'
  WHEN category = 'foncier' THEN 'foncier'
  WHEN category = 'culture' THEN 'education'
  ELSE category
END;
```

### Ajouter Plus de Quiz

```sql
-- Ajouter des quiz avec traductions complètes
-- NOTE: options est JSONB, optionsEn est TEXT[]
INSERT INTO "QuizQuestion" (
  question, "questionEn",
  options, "optionsEn",
  answer,
  explanation, "explanationEn",
  category, difficulty
) VALUES
(
  'Combien de temps faut-il pour obtenir une CNI au Cameroun ?',
  'How long does it take to get a national ID card in Cameroon?',
  '["1 semaine", "2-4 semaines", "2-3 mois", "6 mois"]'::jsonb,
  ARRAY['1 week', '2-4 weeks', '2-3 months', '6 months'],
  '1',
  'Le délai moyen est de 2 à 4 semaines après l''enrôlement biométrique.',
  'The average timeframe is 2 to 4 weeks after biometric enrollment.',
  'identite',
  'Facile'
),
(
  'Quel est le capital minimum pour créer une SARL au Cameroun ?',
  'What is the minimum capital to create an LLC in Cameroon?',
  '["100,000 FCFA", "500,000 FCFA", "1,000,000 FCFA", "Aucun minimum"]'::jsonb,
  ARRAY['100,000 FCFA', '500,000 FCFA', '1,000,000 FCFA', 'No minimum'],
  '3',
  'Il n''y a pas de capital minimum obligatoire pour créer une SARL au Cameroun depuis 2017.',
  'There is no mandatory minimum capital to create an LLC in Cameroon since 2017.',
  'entreprise',
  'Facile'
);
```

## Comment le Frontend Utilise les Traductions

Le frontend a maintenant une logique qui :

1. **Détecte la langue** : `const { language } = useLanguage()` (FR ou EN)
2. **Affiche les bonnes données** :
   - Si `language === 'en'` et que `titleEn` existe → affiche `titleEn`
   - Sinon → affiche `title` (français par défaut)

### Exemple dans le code :

```tsx
// Dans un composant
const { language } = useLanguage()

// Affichage intelligent
<h1>{language === 'en' && article.titleEn ? article.titleEn : article.title}</h1>
```

## Prochaines Étapes

1. ✅ **Corriger les catégories des quiz** (SQL ci-dessus)
2. ✅ **Ajouter quelques traductions clés** pour tester
3. ⏳ **Traduire progressivement** le reste des données
4. 🔄 **Ou utiliser un service de traduction automatique** (Google Translate API)

## Note Importante

**Tu n'es pas obligé de tout traduire maintenant !**

Le site fonctionne parfaitement en français. Les traductions anglaises sont un **bonus** pour les utilisateurs anglophones.

Tu peux :
- Commencer par traduire les 10-20 actualités/procédures les plus populaires
- Ajouter les traductions progressivement
- Ou laisser en français pour l'instant et ajouter "🇫🇷 Contenu disponible en français uniquement" pour les utilisateurs EN
