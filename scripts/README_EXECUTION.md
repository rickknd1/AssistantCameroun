# 📋 Guide d'exécution des scripts SQL - Assistant Cameroun

## 🎯 Vue d'ensemble

Ces scripts SQL créent la base de données complète pour l'application **Assistant National du Cameroun** sur **Supabase PostgreSQL**.

La structure est alignée avec votre frontend existant (Next.js) et suit les meilleures pratiques pour les applications RAG avec pgvector.

---

## 📦 Scripts à exécuter (dans l'ordre)

### **NEW_001_extensions_and_functions.sql**
- Active les extensions PostgreSQL (uuid-ossp, vector, pg_trgm, unaccent)
- Crée les fonctions utilitaires (update timestamps, slugs, recherche)
- **⚠️ À exécuter en PREMIER**

### **NEW_002_core_tables.sql**
- Tables principales: `Document`, `Section`, `Procedure`, `NewsArticle`, `QuizQuestion`
- Index de performance
- Triggers pour `updatedAt`
- Colonnes `searchVector` pour recherche full-text

### **NEW_003_conversation_tables.sql**
- Tables chat: `Conversation`, `Message`, `Citation`, `Feedback`
- Triggers pour compteurs automatiques
- Relations avec documents

### **NEW_004_embeddings_and_rag.sql**
- Table `Embedding` avec vecteurs 768D
- Index vectoriel HNSW (meilleure performance)
- Fonctions de recherche vectorielle:
  - `search_embeddings_documents()`
  - `search_embeddings_all()`
  - `search_hybrid()` (vector + full-text)

### **NEW_005_analytics_tables.sql**
- Tables analytics: `Analytics`, `QuizAttempt`, `SearchQuery`
- Vues analytiques pour dashboard admin:
  - `daily_stats`
  - `popular_documents`
  - `popular_procedures`
  - `popular_searches`
  - `quiz_performance`
  - `satisfaction_stats`

### **NEW_006_rls_policies.sql**
- Row Level Security (RLS) pour Supabase
- Policies PUBLIC (lecture pour tous)
- Policies ADMIN (auth requis)
- Fonctions helper pour permissions

### **NEW_007_seed_data.sql**
- Données initiales (optionnel mais recommandé)
- 6 documents juridiques exemples
- 3 procédures (CNI, Passeport, Acte de naissance)
- 3 articles d'actualités
- 4 questions de quiz

---

## 🚀 Instructions d'exécution

### **Option 1: Supabase Dashboard (Recommandé)**

1. Connectez-vous à votre projet Supabase
2. Allez dans **SQL Editor**
3. Créez une nouvelle query
4. Copiez-collez le contenu de chaque script **dans l'ordre**
5. Cliquez sur **Run** pour chaque script

```sql
-- Exemple dans SQL Editor:
-- 1. Coller NEW_001_extensions_and_functions.sql
-- 2. Run
-- 3. Coller NEW_002_core_tables.sql
-- 4. Run
-- etc.
```

### **Option 2: Supabase CLI**

```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter à votre projet
supabase link --project-ref YOUR_PROJECT_REF

# Exécuter les migrations (dans l'ordre)
supabase db push --file scripts/NEW_001_extensions_and_functions.sql
supabase db push --file scripts/NEW_002_core_tables.sql
supabase db push --file scripts/NEW_003_conversation_tables.sql
supabase db push --file scripts/NEW_004_embeddings_and_rag.sql
supabase db push --file scripts/NEW_005_analytics_tables.sql
supabase db push --file scripts/NEW_006_rls_policies.sql
supabase db push --file scripts/NEW_007_seed_data.sql
```

### **Option 3: Script PostgreSQL direct**

```bash
# Si vous avez accès direct à PostgreSQL
psql -h db.YOUR_PROJECT.supabase.co \
     -U postgres \
     -d postgres \
     -f scripts/NEW_001_extensions_and_functions.sql

# Répéter pour chaque script
```

---

## ✅ Vérification post-installation

Après exécution de tous les scripts, vérifiez:

### 1. **Extensions activées**
```sql
SELECT * FROM pg_extension
WHERE extname IN ('uuid-ossp', 'vector', 'pg_trgm', 'unaccent');
```

### 2. **Tables créées**
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

Vous devriez voir:
- Analytics
- Citation
- Conversation
- Document
- Embedding
- Feedback
- Message
- NewsArticle
- Procedure
- QuizAttempt
- QuizQuestion
- SearchQuery
- Section

### 3. **RLS activé**
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND rowsecurity = true;
```

### 4. **Données seed présentes**
```sql
SELECT COUNT(*) FROM "Document";     -- Devrait retourner 6
SELECT COUNT(*) FROM "Procedure";    -- Devrait retourner 3
SELECT COUNT(*) FROM "NewsArticle";  -- Devrait retourner 3
SELECT COUNT(*) FROM "QuizQuestion"; -- Devrait retourner 4
```

### 5. **Recherche vectorielle fonctionne**
```sql
-- Test de la fonction de recherche
SELECT * FROM search_embeddings_documents(
  array_fill(0.5, ARRAY[768])::vector(768),
  0.5,
  5
);
-- Devrait retourner une structure vide (pas encore d'embeddings)
```

---

## 🔄 Correspondance Frontend ↔ Database

### **Bibliothèque (`/bibliotheque`)**
```typescript
// Frontend: components/library/library-content.tsx
interface Document {
  id: string
  type: "CODE" | "LOI" | "DÉCRET" | "ORDONNANCE"
  title: string
  reference: string
  category: string
  status: "Actif" | "Abrogé"
}

// Database: Table "Document"
✅ Mappé directement avec status: 'ACTIVE' | 'ABROGATED'
```

### **Procédures (`/procedures`)**
```typescript
// Frontend: components/procedures/procedures-content.tsx
interface Procedure {
  id: string
  name: string
  category: string
  duration: string
  cost: string
  difficulty: "Facile" | "Moyen" | "Difficile"
}

// Database: Table "Procedure"
✅ Mappé avec JSONB pour steps, documents, costs, locations, tips, faqs
```

### **Actualités (`/actualites`)**
```typescript
// Frontend: components/news/news-content.tsx
interface Article {
  title: string
  summary: string
  category: string
  source: string
  readTime: string
  featured?: boolean
}

// Database: Table "NewsArticle"
✅ Mappé avec isFeatured, readTime en INTEGER (minutes)
```

### **Quiz (`/quiz`)**
```typescript
// Frontend: components/quiz/quiz-content.tsx
const QUIZ_CATEGORIES = [
  { id: "droit-penal", name: "Droit Pénal" },
  { id: "procedures-admin", name: "Procédures Administratives" },
  // ...
]

// Database: Table "QuizQuestion"
✅ category CHECK constraint avec mêmes valeurs
```

---

## 🔧 Configuration .env

Votre fichier `.env` est déjà créé. Assurez-vous que ces variables sont correctes:

```bash
# Supabase (déjà configuré)
NEXT_PUBLIC_SUPABASE_URL=https://hqmydrehuoqlfosbklqb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...

# À compléter pour le backend
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here  # ⚠️ À obtenir depuis Supabase Dashboard
DATABASE_URL=postgresql://postgres.hqmydrehuoqlfosbklqb:your_password@...
```

---

## 🎨 Prochaines étapes

### **1. Connecter le frontend**
Créer des API routes Next.js pour fetcher les données:

```typescript
// app/api/documents/route.ts
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('Document')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('createdAt', { ascending: false })

  return Response.json(data)
}
```

### **2. Implémenter le backend RAG**
Créer un service pour générer les embeddings:

```typescript
// backend/services/embeddings.service.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

async function generateEmbedding(text: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })

  const result = await model.embedContent(text)
  return result.embedding.values // vector(768)
}
```

### **3. Créer le backoffice admin**
Dashboard pour gérer les documents, procédures, actualités.

---

## ⚠️ Notes importantes

1. **RLS Policies**: Les policies actuelles permettent l'accès PUBLIC en lecture. Adaptez selon vos besoins de sécurité.

2. **Embeddings**: La table `Embedding` est vide initialement. Vous devrez créer un job backend pour générer les vecteurs.

3. **Performance**: Les index HNSW pour pgvector sont optimaux pour >10k vecteurs. Pour moins, IVFFlat suffit.

4. **Coûts**:
   - Supabase Free tier: 500 MB database
   - Ces scripts utilisent ~50-100 MB avec seed data
   - Embeddings: ~10 KB par document (768 dimensions × 4 bytes)

5. **Backup**: Avant exécution en production, faites un backup Supabase.

---

## 📞 Support

En cas de problème:
1. Vérifiez les logs dans Supabase Dashboard > Database > Logs
2. Testez chaque script individuellement
3. Vérifiez que les extensions sont bien activées

---

## 📊 Comparaison: Anciens vs Nouveaux scripts

| Aspect | Anciens scripts | Nouveaux scripts |
|--------|----------------|------------------|
| **Structure** | Tables génériques | Aligné avec frontend |
| **Embeddings** | Chunks séparés | Table unique optimisée |
| **Procédures** | JSONB limité | JSONB complet (steps, faqs, etc.) |
| **Analytics** | Tables séparées | Vues pré-calculées |
| **RLS** | Policies basiques | Policies granulaires |
| **Recherche** | Full-text only | Hybride (vector + text) |
| **Admin** | Tables admin séparées | Intégré avec RLS |

---

**✅ Vous êtes prêt à déployer votre base de données!**