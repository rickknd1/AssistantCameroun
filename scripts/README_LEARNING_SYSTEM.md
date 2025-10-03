# 🚀 Installation du Système d'Apprentissage Intelligent

## Étapes d'installation

### 1. Exécuter le script SQL

Le fichier `create-learning-system-tables.sql` crée toutes les tables nécessaires.

#### Option A : Via Supabase Dashboard (Recommandé)

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Cliquez sur "SQL Editor" dans le menu gauche
4. Cliquez sur "New Query"
5. Copiez-collez le contenu de `create-learning-system-tables.sql`
6. Cliquez sur "Run" (ou appuyez sur Ctrl+Enter)

#### Option B : Via ligne de commande (si psql installé)

```bash
# Remplacer par votre DATABASE_URL
psql "postgresql://postgres.xxx:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres" -f scripts/create-learning-system-tables.sql
```

#### Option C : Via script Node.js

```typescript
// scripts/install-learning-system.ts
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const sql = fs.readFileSync('./create-learning-system-tables.sql', 'utf8')

// Exécuter le SQL
await supabase.rpc('exec_sql', { sql_query: sql })
```

---

### 2. Vérifier l'installation

```sql
-- Vérifier que les tables existent
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('QuestionCache', 'ResponseFeedback', 'VerificationLog');

-- Devrait retourner 3 lignes
```

---

### 3. Tester le système

```typescript
// Test simple via l'API
const response = await fetch('http://localhost:3000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: "Quel est l'article 20 de la Constitution ?"
  })
})

const data = await response.json()
console.log('Réponse:', data.response)
console.log('Confiance:', data.confidence)
console.log('Sources:', data.sources)
```

**Première fois** : Génération normale (~2-3s)
**Deuxième fois** : Cache hit instantané (~0.1s) 🚀

---

## 📊 Tables créées

| Table               | Description                                  | Lignes estimées |
|---------------------|----------------------------------------------|-----------------|
| `QuestionCache`     | Cache de questions/réponses validées         | 1000+ (à M3)    |
| `ResponseFeedback`  | Feedback utilisateurs (👍/👎)               | 5000+ (à M3)    |
| `VerificationLog`   | Logs de vérification automatique             | 1000+ (à M3)    |

---

## 🔐 Permissions

Le système nécessite les permissions suivantes dans Supabase :

```sql
-- Pour le service role (backend)
GRANT ALL ON QuestionCache TO service_role;
GRANT ALL ON ResponseFeedback TO service_role;
GRANT ALL ON VerificationLog TO service_role;

-- Pour les utilisateurs anonymes (frontend) - lecture seule stats
GRANT SELECT ON CacheStatistics TO anon;
```

---

## 🧪 Tests de validation

### Test 1 : Cache fonctionne

```bash
# Question 1 (cache miss)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Quel est l\'article 20 de la Constitution?"}'

# Attendre 1 seconde

# Question 2 (identique - devrait être cache hit)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Quel est l\'article 20 de la Constitution?"}'

# Vérifier les logs: devrait afficher "⚡ [CACHE HIT]"
```

### Test 2 : Feedback fonctionne

```bash
# Envoyer un feedback positif
curl -X POST http://localhost:3000/api/feedback \
  -H "Content-Type: application/json" \
  -d '{"cacheId":"<ID_DU_CACHE>","rating":5,"feedbackType":"helpful"}'
```

### Test 3 : Vérifier les stats

```sql
-- Stats globales
SELECT * FROM CacheStatistics;

-- Top questions
SELECT * FROM TopQuestions LIMIT 5;
```

---

## 🐛 Dépannage

### Problème : Tables déjà existantes

```sql
-- Supprimer les tables existantes (ATTENTION: perte de données)
DROP TABLE IF EXISTS VerificationLog CASCADE;
DROP TABLE IF EXISTS ResponseFeedback CASCADE;
DROP TABLE IF EXISTS QuestionCache CASCADE;

-- Puis relancer le script
```

### Problème : Permissions refusées

```sql
-- Vérifier les permissions
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'QuestionCache';
```

### Problème : Cache ne fonctionne pas

```bash
# Vérifier les logs du serveur
npm run dev

# Chercher dans les logs:
# - "⚡ [CACHE HIT]" = succès
# - "❌ [CACHE MISS]" = normal pour première fois
# - "🔴 [CACHE]" = erreur
```

---

## 📈 Monitoring

### Requêtes utiles

```sql
-- Taux de cache hit (dernières 24h)
SELECT
  COUNT(*) FILTER (WHERE lastUsedAt > NOW() - INTERVAL '24 hours') as hits_24h,
  COUNT(*) as total_cached
FROM QuestionCache;

-- Questions les plus populaires cette semaine
SELECT
  questionOriginal,
  usageCount,
  successRate,
  verificationScore
FROM QuestionCache
WHERE lastUsedAt > NOW() - INTERVAL '7 days'
ORDER BY usageCount DESC
LIMIT 10;

-- Feedback récent
SELECT
  qc.questionOriginal,
  rf.rating,
  rf.feedbackType,
  rf.comment,
  rf.createdAt
FROM ResponseFeedback rf
JOIN QuestionCache qc ON rf.questionCacheId = qc.id
ORDER BY rf.createdAt DESC
LIMIT 20;
```

---

## 🎯 KPIs à surveiller

1. **Taux de cache hit** : `SELECT COUNT(*) FROM QuestionCache WHERE usageCount > 1`
2. **Score moyen de vérification** : `SELECT AVG(verificationScore) FROM QuestionCache`
3. **Satisfaction utilisateurs** : `SELECT AVG(rating) FROM ResponseFeedback`

---

## 📚 Documentation complète

Voir `SYSTEME_APPRENTISSAGE.md` pour la documentation détaillée.

---

**Support** : En cas de problème, vérifier les logs avec `npm run dev` et chercher `[CACHE]` dans la console.
