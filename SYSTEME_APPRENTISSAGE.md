# 🧠 SYSTÈME D'APPRENTISSAGE INTELLIGENT DE CAMI

## Vue d'ensemble

Cami dispose d'un **système d'apprentissage continu** qui améliore sa vitesse et sa précision au fil du temps grâce à :
- **Cache intelligent** de questions/réponses
- **Vérification automatique** de véracité
- **Feedback utilisateurs**
- **Statistiques d'usage**

---

## 🎯 Objectifs

1. **Accélérer les réponses** : Réponses instantanées (< 0.5s) pour questions fréquentes
2. **Améliorer la qualité** : Seules les réponses vérifiées (score > 70%) sont mises en cache
3. **Apprendre en continu** : Le cache s'enrichit automatiquement
4. **Préparer le fine-tuning** : Collecte de données de qualité pour entraîner un modèle personnalisé

---

## 📊 Architecture

```
┌─────────────────────────────────────────────────┐
│          UTILISATEUR POSE UNE QUESTION          │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│   ÉTAPE 1: RECHERCHE DANS LE CACHE              │
│   - Hash MD5 pour recherche exacte              │
│   - Similarité par mots-clés (Jaccard)          │
│   - Seuil: 85% de similarité                    │
└────────────────┬────────────────────────────────┘
                 │
         ┌───────┴───────┐
         │               │
         ▼               ▼
   ✅ TROUVÉE       ❌ NON TROUVÉE
   (< 0.5s)         (2-3s)
         │               │
         │               ▼
         │    ┌─────────────────────────┐
         │    │ GÉNÉRATION NOUVELLE     │
         │    │ - Multi-agents          │
         │    │ - Vérification véracité │
         │    │ - Mise en cache (si >70%)│
         │    └─────────────────────────┘
         │               │
         └───────┬───────┘
                 │
                 ▼
        ┌────────────────┐
        │ RÉPONSE RETOURNÉE │
        └────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │ FEEDBACK USER   │
        │ (👍 / 👎)       │
        └────────────────┘
```

---

## 🗄️ Structure de la base de données

### Table `QuestionCache`

Stocke les questions/réponses validées pour réutilisation rapide.

```sql
CREATE TABLE QuestionCache (
  id UUID PRIMARY KEY,
  questionHash TEXT UNIQUE,           -- Hash MD5 pour recherche rapide
  questionNormalized TEXT,            -- Question normalisée (sans accents, lowercase)
  questionOriginal TEXT,              -- Question originale
  response TEXT,                      -- Réponse formatée
  sources JSONB,                      -- Sources citées
  confidence INTEGER,                 -- Niveau de confiance (0-100)
  questionType TEXT,                  -- 'juridique' | 'procedure' | 'generale'
  keywords TEXT[],                    -- Mots-clés pour recherche
  documentsReferenced TEXT[],         -- IDs des documents référencés
  verifiedAt TIMESTAMP,               -- Date de vérification
  verifiedBy TEXT,                    -- 'auto' | 'admin' | 'feedback'
  verificationScore INTEGER,          -- Score de véracité (0-100)
  usageCount INTEGER DEFAULT 0,       -- Nombre d'utilisations
  successCount INTEGER DEFAULT 0,     -- Feedbacks positifs
  failureCount INTEGER DEFAULT 0,     -- Feedbacks négatifs
  successRate DECIMAL,                -- Taux de satisfaction (calculé)
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP,
  lastUsedAt TIMESTAMP
)
```

**Index** :
- `idx_question_hash` : Recherche exacte ultra-rapide
- `idx_keywords` : Recherche par similarité
- `idx_usage_count` : Top questions
- `idx_success_rate` : Questions les mieux notées

### Table `ResponseFeedback`

Collecte les avis utilisateurs sur la qualité des réponses.

```sql
CREATE TABLE ResponseFeedback (
  id UUID PRIMARY KEY,
  questionCacheId UUID REFERENCES QuestionCache(id),
  messageId UUID REFERENCES Message(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),  -- 1-5 étoiles
  feedbackType TEXT,                              -- 'helpful' | 'not_helpful' | 'incorrect'
  comment TEXT,
  createdAt TIMESTAMP
)
```

### Table `VerificationLog`

Trace toutes les vérifications automatiques de véracité.

```sql
CREATE TABLE VerificationLog (
  id UUID PRIMARY KEY,
  questionCacheId UUID REFERENCES QuestionCache(id),
  verificationType TEXT,              -- 'auto' | 'admin_review'
  status TEXT,                        -- 'verified' | 'flagged' | 'rejected'
  score INTEGER,                      -- Score de vérification (0-100)
  details JSONB,                      -- Détails de la vérification
  issues TEXT[],                      -- Problèmes détectés
  suggestions TEXT[],                 -- Suggestions d'amélioration
  createdAt TIMESTAMP
)
```

---

## 🔍 Algorithmes

### 1. Normalisation de question

```typescript
function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')  // Retirer accents
    .replace(/[^a-z0-9\s]/g, '')       // Retirer ponctuation
    .trim()
    .replace(/\s+/g, ' ')              // Normaliser espaces
}
```

**Exemples** :
- `"Quel est l'article 20 de la Constitution ?"` → `"quel est l article 20 de la constitution"`
- `"Comment obtenir une CNI?"` → `"comment obtenir une cni"`

### 2. Calcul de similarité (Jaccard)

```typescript
function calculateSimilarity(q1: string, q2: string): number {
  const words1 = new Set(normalizeQuestion(q1).split(' '))
  const words2 = new Set(normalizeQuestion(q2).split(' '))

  const intersection = new Set([...words1].filter(w => words2.has(w)))
  const union = new Set([...words1, ...words2])

  return (intersection.size / union.size) * 100
}
```

**Exemples** :
- `"Quel est l'article 20 ?"` vs `"Que dit l'article 20 ?"` → **~70%**
- `"Comment obtenir une CNI ?"` vs `"Procédure CNI"` → **~50%**
- `"Article 20"` vs `"ARTICLE 20"` → **100%** (normalisation)

### 3. Vérification automatique de véracité

Le système attribue un **score de 0 à 100** basé sur :

| Critère                          | Impact            | Points |
|----------------------------------|-------------------|--------|
| Présence de sources              | Obligatoire       | -30 si aucune |
| Niveau de confiance ≥ 70%        | Important         | -20 si < 70% |
| Sources citées dans réponse      | Important         | -10 par source non citée |
| Longueur réponse ≥ 50 caractères | Basique           | -15 si trop courte |
| Présence liens markdown          | Amélioration      | -10 si aucun lien |

**Seuil de mise en cache** : Score ≥ 70%

---

## ⚡ Performance

### Temps de réponse

| Scénario                  | Temps moyen | Gain  |
|---------------------------|-------------|-------|
| **Cache HIT** (exacte)    | ~100ms      | 95%   |
| **Cache HIT** (similaire) | ~200ms      | 90%   |
| **Cache MISS**            | ~2500ms     | 0%    |

### Évolution du taux de cache

```
Semaine 1:   5% cache hit
Mois 1:     25% cache hit (estimation)
Mois 3:     50% cache hit (estimation)
Mois 6:     70% cache hit (objectif)
```

---

## 📈 Statistiques et monitoring

### Vue `CacheStatistics`

```sql
SELECT
  COUNT(*) as totalCached,
  COUNT(*) FILTER (WHERE verifiedAt IS NOT NULL) as verified,
  AVG(successRate) as avgSuccessRate,
  SUM(usageCount) as totalUsage
FROM QuestionCache;
```

### Vue `TopQuestions`

Les 100 questions les plus utilisées avec leurs stats :
- Usage count
- Success rate
- Confidence level
- Verification score

### Logs en temps réel

```bash
⚡ [CACHE HIT] Réponse instantanée (similarité: 95%)
❌ [CACHE MISS] Génération d'une nouvelle réponse...
✅ [CACHE] Question ajoutée au cache (score: 85)
✅ [FEEDBACK] Feedback enregistré (5/5)
```

---

## 🚀 Utilisation

### 1. Installation

```bash
# Créer les tables
psql DATABASE_URL -f scripts/create-learning-system-tables.sql
```

### 2. Exemple API

```typescript
// Dans votre code client
const response = await fetch('/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Quel est l'article 20 de la Constitution ?"
  })
})

const data = await response.json()
console.log(data)
// {
//   response: "L'article 20...",
//   sources: [...],
//   confidence: 95,
//   cached: true,           // ✅ Vient du cache
//   cacheId: "abc123",      // Pour feedback
//   similarity: 98,         // Similarité avec question en cache
//   processingTime: 150     // ms
// }
```

### 3. Envoyer un feedback

```typescript
await fetch('/api/feedback', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cacheId: "abc123",
    rating: 5,              // 1-5
    feedbackType: "helpful",
    comment: "Très utile !"
  })
})
```

---

## 📋 Roadmap

### ✅ Phase 1 (Actuelle) - Cache Intelligent
- [x] Tables BD créées
- [x] Service de cache implémenté
- [x] Vérification automatique véracité
- [x] Intégration API chat
- [x] Feedback utilisateurs

### 🔄 Phase 2 (Mois 1-2) - Optimisations
- [ ] Recherche sémantique avec embeddings
- [ ] Dashboard admin pour valider manuellement le cache
- [ ] Export automatique des meilleures Q&R
- [ ] Nettoyage automatique des questions obsolètes

### 🎯 Phase 3 (Mois 3-6) - Fine-tuning
- [ ] Collecte de 1000+ Q&R validées
- [ ] Export au format JSONL pour fine-tuning
- [ ] Test fine-tuning sur Gemini/GPT
- [ ] Déploiement modèle personnalisé

---

## 🔧 Maintenance

### Commandes utiles

```sql
-- Voir les stats globales
SELECT * FROM CacheStatistics;

-- Top 10 questions
SELECT * FROM TopQuestions LIMIT 10;

-- Questions à valider manuellement
SELECT * FROM QuestionCache
WHERE verificationScore < 80
ORDER BY usageCount DESC
LIMIT 20;

-- Supprimer questions peu utilisées (< 3 usages, créées > 3 mois)
DELETE FROM QuestionCache
WHERE usageCount < 3
  AND createdAt < NOW() - INTERVAL '3 months';
```

---

## 📊 KPIs à surveiller

1. **Taux de cache hit** : Objectif > 50% à M3
2. **Score de vérification moyen** : Objectif > 85/100
3. **Success rate moyen** : Objectif > 80%
4. **Temps de réponse P95** : Objectif < 500ms pour cache hit

---

## ❓ FAQ

**Q: Pourquoi seuil de 85% pour similarité ?**
R: Balance entre précision et couverture. < 85% = trop de faux positifs.

**Q: Que se passe-t-il si une réponse en cache devient obsolète ?**
R: L'admin peut la flaguer manuellement. Prévu : auto-détection via version de documents.

**Q: Comment éviter les réponses incorrectes en cache ?**
R: 3 niveaux de sécurité :
  1. Vérification auto (score > 70%)
  2. Feedback utilisateurs
  3. Review admin (prévu)

**Q: Peut-on désactiver le cache temporairement ?**
R: Oui, modifier le seuil de similarité à 100% dans le code.

---

## 📝 Licence

Ce système fait partie de **Cami - Assistant National du Cameroun**
© 2025 KENDEM MBA Rick Dylan

---

**Dernière mise à jour** : 2025-10-03
**Version** : 1.0.0
