# Configuration des Variables d'Environnement Vercel

## Variables Requises

Pour déployer **Cami - Assistant National du Cameroun** sur Vercel, vous devez configurer les variables d'environnement suivantes :

### 1. Supabase (Obligatoires)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...votre-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...votre-service-role-key
```

**Où les trouver :**
1. Allez sur [supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. Allez dans **Settings** > **API**
4. Copiez les valeurs de :
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Google Gemini AI (Obligatoire)

```bash
GEMINI_API_KEY=AIzaSy...votre-gemini-key
```

**Où l'obtenir :**
1. Allez sur [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Créez ou copiez votre clé API Gemini
3. Modèle utilisé : `gemini-2.0-flash-exp`

### 3. Google Custom Search (Optionnel)

```bash
GOOGLE_SEARCH_API_KEY=AIzaSy...votre-search-key
GOOGLE_SEARCH_ENGINE_ID=votre-engine-id
```

**Où les obtenir :**
1. API Key : [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
2. Engine ID : [programmablesearchengine.google.com](https://programmablesearchengine.google.com)

**Note :** Ces variables sont optionnelles. Si non fournies, Cami fonctionnera sans recherche web externe.

---

## Configuration sur Vercel

### Méthode 1 : Interface Web (Recommandée)

1. Allez sur votre projet Vercel : [vercel.com/dashboard](https://vercel.com/dashboard)
2. Cliquez sur votre projet **AssistantCameroun**
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez chaque variable :
   - **Key** : Nom de la variable (ex: `GEMINI_API_KEY`)
   - **Value** : Valeur de la variable
   - **Environments** : Sélectionnez **Production**, **Preview**, et **Development**
5. Cliquez sur **Save**

### Méthode 2 : Vercel CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Lier le projet
vercel link

# Ajouter les variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add GEMINI_API_KEY production

# (Optionnel) Google Search
vercel env add GOOGLE_SEARCH_API_KEY production
vercel env add GOOGLE_SEARCH_ENGINE_ID production
```

### Méthode 3 : Fichier .env (Local uniquement)

**⚠️ NE JAMAIS COMMITTER CE FICHIER ⚠️**

Créez `.env.local` à la racine du projet :

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Google Gemini AI
GEMINI_API_KEY=AIzaSy...

# Google Custom Search (optionnel)
GOOGLE_SEARCH_API_KEY=AIzaSy...
GOOGLE_SEARCH_ENGINE_ID=votre-engine-id
```

---

## Redéploiement Après Configuration

Une fois les variables ajoutées, redéployez votre projet :

### Option 1 : Automatique (Git Push)
```bash
git add .
git commit -m "Update env vars"
git push
```

### Option 2 : Manuel (Vercel Dashboard)
1. Allez dans **Deployments**
2. Cliquez sur les **3 points** du dernier déploiement
3. Cliquez sur **Redeploy**

### Option 3 : CLI
```bash
vercel --prod
```

---

## Vérification

Après redéploiement, vérifiez que tout fonctionne :

1. ✅ **Page d'accueil** : [https://votre-projet.vercel.app](https://votre-projet.vercel.app)
2. ✅ **Bibliothèque** : [https://votre-projet.vercel.app/bibliotheque](https://votre-projet.vercel.app/bibliotheque)
3. ✅ **Chat Cami** : Testez une question comme "Comment obtenir une CNI ?"
4. ✅ **Admin** : [https://votre-projet.vercel.app/admin/login](https://votre-projet.vercel.app/admin/login)

### Logs de Déploiement

Si des erreurs persistent, vérifiez les logs :

1. Allez dans **Deployments** > Dernier déploiement
2. Cliquez sur **View Function Logs**
3. Recherchez les erreurs liées aux env vars :
   ```
   Error: @supabase/ssr: Your project's URL and API key are required
   ```

Si cette erreur apparaît, vérifiez que :
- Les variables sont bien ajoutées avec les bons noms (sensible à la casse)
- Les valeurs sont complètes (pas de copier-coller partiel)
- Les variables sont activées pour **Production**

---

## Sécurité

### ✅ Variables Publiques (Safe)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Ces variables sont visibles côté client, c'est normal.

### 🔒 Variables Privées (Secrets)
- `SUPABASE_SERVICE_ROLE_KEY` → Ne JAMAIS exposer côté client
- `GEMINI_API_KEY` → Ne JAMAIS exposer côté client
- `GOOGLE_SEARCH_API_KEY` → Ne JAMAIS exposer côté client

Vercel protège automatiquement ces variables en production.

### ⚠️ À NE JAMAIS FAIRE
```typescript
// ❌ DANGER - Expose la clé secrète
const key = process.env.SUPABASE_SERVICE_ROLE_KEY
return NextResponse.json({ key })

// ✅ BON - Utilisation serveur uniquement
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Serveur only
)
```

---

## Troubleshooting

### Erreur : "Your project's URL and API key are required"
**Solution :** Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont bien définis dans Vercel.

### Erreur : "Invalid API key for Gemini"
**Solution :** Vérifiez que `GEMINI_API_KEY` est valide sur [aistudio.google.com](https://aistudio.google.com)

### Les variables ne sont pas prises en compte
**Solution :**
1. Vérifiez que les variables sont activées pour l'environnement **Production**
2. Redéployez après l'ajout des variables
3. Videz le cache du navigateur (`Ctrl + Shift + R`)

### Build réussit mais runtime error
**Solution :** Certaines variables ne sont visibles qu'au runtime. Vérifiez les **Function Logs** pour voir les valeurs manquantes.

---

## Checklist Finale

Avant de déployer en production, vérifiez :

- [ ] `NEXT_PUBLIC_SUPABASE_URL` défini
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` défini
- [ ] `SUPABASE_SERVICE_ROLE_KEY` défini
- [ ] `GEMINI_API_KEY` défini et valide
- [ ] Variables activées pour **Production**
- [ ] Redéploiement effectué après ajout des variables
- [ ] Tests de la page d'accueil OK
- [ ] Tests du chat Cami OK
- [ ] Tests de la bibliothèque OK
- [ ] Pas d'erreurs dans les Function Logs

---

**✅ Une fois toutes les variables configurées, Cami sera pleinement opérationnel sur Vercel !**
