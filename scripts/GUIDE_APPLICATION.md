# 🚀 Guide d'application des scripts SQL - Assistant Cameroun

## ⚠️ Méthode recommandée: Supabase Dashboard (pas besoin de CLI)

La Supabase CLI nécessite une authentification. **La méthode la plus simple est d'utiliser le Supabase Dashboard directement.**

---

## 📋 **MÉTHODE 1: Supabase Dashboard (RECOMMANDÉ)**

### Étape 1: Se connecter à Supabase
1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Connectez-vous à votre compte
3. Sélectionnez votre projet: **hqmydrehuoqlfosbklqb**

### Étape 2: Ouvrir le SQL Editor
1. Dans le menu latéral, cliquez sur **SQL Editor**
2. Cliquez sur **New Query**

### Étape 3: Exécuter les scripts (DANS L'ORDRE)

#### **Script 1: NEW_001_extensions_and_functions.sql**
1. Ouvrez le fichier `scripts/NEW_001_extensions_and_functions.sql`
2. Copiez tout le contenu
3. Collez dans le SQL Editor
4. Cliquez sur **Run** (ou Ctrl+Enter)
5. ✅ Vérifiez qu'il n'y a pas d'erreurs

#### **Script 2: NEW_002_core_tables.sql**
1. Ouvrez `scripts/NEW_002_core_tables.sql`
2. Copiez tout le contenu
3. Collez dans une nouvelle query
4. Cliquez sur **Run**
5. ✅ Vérifiez la création des tables

#### **Script 3: NEW_003_conversation_tables.sql**
1. Ouvrez `scripts/NEW_003_conversation_tables.sql`
2. Copiez et collez
3. **Run**

#### **Script 4: NEW_004_embeddings_and_rag.sql**
1. Ouvrez `scripts/NEW_004_embeddings_and_rag.sql`
2. Copiez et collez
3. **Run**

#### **Script 5: NEW_005_analytics_tables.sql**
1. Ouvrez `scripts/NEW_005_analytics_tables.sql`
2. Copiez et collez
3. **Run**

#### **Script 6: NEW_006_rls_policies.sql**
1. Ouvrez `scripts/NEW_006_rls_policies.sql`
2. Copiez et collez
3. **Run**

#### **Script 7: NEW_007_seed_data.sql** (Optionnel mais recommandé)
1. Ouvrez `scripts/NEW_007_seed_data.sql`
2. Copiez et collez
3. **Run**

---

## ✅ **VÉRIFICATION POST-INSTALLATION**

### Dans le SQL Editor, exécutez ces requêtes:

#### 1. Vérifier les tables créées
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

**Résultat attendu (13 tables):**
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

#### 2. Vérifier les extensions
```sql
SELECT extname, extversion
FROM pg_extension
WHERE extname IN ('uuid-ossp', 'vector', 'pg_trgm', 'unaccent');
```

**Résultat attendu (4 extensions):**
- uuid-ossp
- vector
- pg_trgm
- unaccent

#### 3. Vérifier les données seed
```sql
SELECT
  (SELECT COUNT(*) FROM "Document") as documents,
  (SELECT COUNT(*) FROM "Procedure") as procedures,
  (SELECT COUNT(*) FROM "NewsArticle") as news,
  (SELECT COUNT(*) FROM "QuizQuestion") as quiz;
```

**Résultat attendu:**
- documents: 6
- procedures: 3
- news: 3
- quiz: 4

#### 4. Vérifier le RLS (Row Level Security)
```sql
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
```

**Résultat attendu:** Toutes les tables doivent avoir `rowsecurity = true`

---

## 📦 **MÉTHODE 2: Supabase CLI (Alternative)**

Si vous préférez utiliser la CLI, voici comment faire:

### Étape 1: Obtenir un Access Token
1. Allez sur [https://supabase.com/dashboard/account/tokens](https://supabase.com/dashboard/account/tokens)
2. Cliquez sur **Generate new token**
3. Copiez le token

### Étape 2: Se connecter
```bash
# Option 1: Login avec token
pnpm supabase login --token YOUR_ACCESS_TOKEN

# Option 2: Définir la variable d'environnement
# Windows PowerShell
$env:SUPABASE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"

# Windows CMD
set SUPABASE_ACCESS_TOKEN=YOUR_ACCESS_TOKEN

# Linux/Mac
export SUPABASE_ACCESS_TOKEN="YOUR_ACCESS_TOKEN"
```

### Étape 3: Lier le projet
```bash
pnpm db:link --project-ref hqmydrehuoqlfosbklqb
```

### Étape 4: Exécuter les scripts
```bash
# Option 1: Push tous les fichiers
pnpm supabase db push --file scripts/NEW_001_extensions_and_functions.sql
pnpm supabase db push --file scripts/NEW_002_core_tables.sql
pnpm supabase db push --file scripts/NEW_003_conversation_tables.sql
pnpm supabase db push --file scripts/NEW_004_embeddings_and_rag.sql
pnpm supabase db push --file scripts/NEW_005_analytics_tables.sql
pnpm supabase db push --file scripts/NEW_006_rls_policies.sql
pnpm supabase db push --file scripts/NEW_007_seed_data.sql

# Option 2: Utiliser un script bash/PowerShell
```

---

## 🔧 **CONFIGURATION POST-INSTALLATION**

### 1. Récupérer la Service Role Key

1. Dans Supabase Dashboard, allez dans **Settings** > **API**
2. Copiez la **service_role key** (secret)
3. Mettez-la dans votre `.env`:

```bash
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3M...
```

### 2. Tester la connexion

Créez un fichier `test-connection.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  // Test 1: Lire les documents
  const { data: documents, error: docError } = await supabase
    .from('Document')
    .select('id, title, type')
    .limit(5)

  console.log('📚 Documents:', documents)

  // Test 2: Lire les procédures
  const { data: procedures, error: procError } = await supabase
    .from('Procedure')
    .select('id, name, category')
    .limit(5)

  console.log('📋 Procedures:', procedures)

  // Test 3: Créer une conversation
  const { data: conversation, error: convError } = await supabase
    .from('Conversation')
    .insert({
      sessionId: 'test-session-' + Date.now(),
      language: 'FR'
    })
    .select()

  console.log('💬 Conversation:', conversation)
}

testConnection()
```

Exécutez:
```bash
npx tsx test-connection.ts
```

---

## 🔄 **PROCHAINES ÉTAPES**

### 1. Créer les API Routes Next.js

**app/api/documents/route.ts**
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)

  const type = searchParams.get('type')
  const category = searchParams.get('category')

  let query = supabase
    .from('Document')
    .select('*')
    .eq('status', 'ACTIVE')
    .order('createdAt', { ascending: false })

  if (type) query = query.eq('type', type)
  if (category) query = query.eq('category', category)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

**app/api/procedures/route.ts**
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createClient()
  const { searchParams } = new URL(request.url)

  const category = searchParams.get('category')

  let query = supabase
    .from('Procedure')
    .select('*')
    .order('popularity', { ascending: false })

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

**app/api/procedures/[slug]/route.ts**
```typescript
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('Procedure')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Procedure not found' }, { status: 404 })
  }

  // Incrémenter le viewCount
  await supabase
    .from('Procedure')
    .update({ viewCount: data.viewCount + 1 })
    .eq('id', data.id)

  return NextResponse.json(data)
}
```

### 2. Mettre à jour les composants frontend

**components/library/library-content.tsx**
```typescript
'use client'

import { useEffect, useState } from 'react'
import { Document } from '@/lib/types/database' // ✅ Déjà défini

export function LibraryContent() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDocuments() {
      const res = await fetch('/api/documents')
      const data = await res.json()
      setDocuments(data)
      setLoading(false)
    }

    fetchDocuments()
  }, [])

  // ... reste du composant (même UI)
}
```

### 3. Générer les embeddings (Backend)

Créez un script pour générer les embeddings:

**scripts/generate-embeddings.ts**
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function generateEmbeddings() {
  // Récupérer tous les documents
  const { data: documents } = await supabase
    .from('Document')
    .select('*')
    .eq('status', 'ACTIVE')

  for (const doc of documents || []) {
    console.log(`Processing: ${doc.title}`)

    // Générer l'embedding
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' })
    const result = await model.embedContent(doc.content)

    // Sauvegarder dans la base
    await supabase.from('Embedding').insert({
      documentId: doc.id,
      text: doc.content,
      embedding: result.embedding.values,
      sourceType: 'document',
      tokens: doc.content.split(' ').length
    })
  }

  console.log('✅ Embeddings générés!')
}

generateEmbeddings()
```

Exécutez:
```bash
npx tsx scripts/generate-embeddings.ts
```

---

## 📞 **Support & Troubleshooting**

### Erreur: "extension does not exist"
**Solution:** Activez les extensions dans Supabase Dashboard > Database > Extensions

### Erreur: "relation does not exist"
**Solution:** Vérifiez que vous avez exécuté les scripts dans l'ordre

### Erreur: "RLS policy violation"
**Solution:** Vérifiez que le script NEW_006 a bien été exécuté

### Problème de performance
**Solution:** Les index HNSW sont créés. Pour >10k embeddings, ajustez les paramètres:
```sql
CREATE INDEX idx_embedding_vector ON "Embedding"
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 32, ef_construction = 128); -- Plus de précision
```

---

## 🎉 **Félicitations!**

Votre base de données est maintenant configurée et prête à l'emploi!

**Prochaines étapes:**
1. ✅ Créer les API routes
2. ✅ Connecter le frontend
3. ✅ Générer les embeddings
4. ✅ Tester le système RAG
5. ✅ Déployer sur Vercel

**Besoin d'aide?** Consultez:
- [Supabase Docs](https://supabase.com/docs)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
- [pgvector Guide](https://github.com/pgvector/pgvector)