# 🌐 Recherche Web Automatique - Assistant Cameroun

## ✨ Fonctionnalité

L'Assistant National du Cameroun utilise maintenant un **système intelligent à 3 niveaux** pour toujours fournir des réponses précises :

### 1️⃣ **Base de données locale** (Priorité #1)
- Recherche dans vos documents et procédures stockés dans Supabase
- Résultats instantanés et 100% fiables
- Utilise une recherche multi-mots-clés intelligente

### 2️⃣ **Connaissances IA Gemini** (Priorité #2)
- Si la base de données a moins de 2 résultats pertinents
- Utilise les connaissances générales de Gemini sur le Cameroun
- Répond toujours avec des informations utiles

### 3️⃣ **Recherche Web Google** (Priorité #3) - OPTIONNEL
- **Activé automatiquement** si moins de 2 résultats en base ET si les clés API sont configurées
- Cherche sur Google avec la requête : `"[question] Cameroun procédure administrative"`
- Récupère les 3 meilleurs résultats
- Intègre les snippets dans le contexte de Gemini
- **100 recherches/jour gratuites** avec Google Custom Search API

## 🚀 Configuration (Optionnel)

La recherche web est **optionnelle**. L'assistant fonctionne parfaitement sans elle grâce aux niveaux 1 et 2.

### Pour activer la recherche web :

1. **Suivez le guide détaillé** : [`docs/GOOGLE_SEARCH_SETUP.md`](docs/GOOGLE_SEARCH_SETUP.md)

2. **Résumé rapide** :
   - Créez une clé API Google Custom Search (gratuit - 100 req/jour)
   - Créez un moteur de recherche personnalisé
   - Ajoutez les clés dans `.env.local` :

```bash
GOOGLE_SEARCH_API_KEY=votre_cle_api
GOOGLE_SEARCH_ENGINE_ID=votre_engine_id
```

3. **Redémarrez le serveur** :
```bash
npm run dev
```

## 📊 Comment ça marche ?

### Exemple de flux complet

**Question utilisateur** : "Comment obtenir un visa de travail ?"

1. **Recherche en base**
   ```
   → Recherche dans Document et Procedure
   → Résultats trouvés : 0
   → Passe au niveau suivant
   ```

2. **Vérification du seuil**
   ```
   → Moins de 2 résultats → Activer recherche web
   ```

3. **Recherche Google** (si clés configurées)
   ```
   → Query: "Comment obtenir un visa de travail Cameroun procédure administrative"
   → Récupère 3 snippets
   → Ajoute au contexte Gemini
   ```

4. **Génération de réponse**
   ```
   → Gemini utilise : connaissances générales + résultats web
   → Génère une réponse complète et structurée
   ```

## 💡 Avantages

### Sans recherche web (niveaux 1 & 2)
✅ Réponses instantanées
✅ Aucune limite de requêtes
✅ Basé sur vos données vérifiées
✅ Utilise les connaissances IA

### Avec recherche web (niveaux 1, 2 & 3)
✅ Tout ce qui précède +
✅ Informations toujours à jour depuis internet
✅ Couvre 100% des questions
✅ Sources web citées
✅ 100 recherches/jour gratuites

## 🔍 Exemple de réponse avec recherche web

**Sans web** :
```
Pour obtenir un visa de travail pour le Cameroun, vous devez généralement :
- Avoir un contrat de travail
- Demander une autorisation de travail
- Déposer votre dossier à l'ambassade
[... connaissances générales ...]
```

**Avec web** :
```
Pour obtenir un visa de travail pour le Cameroun, voici la procédure détaillée :

1. Obtenir un contrat de travail...
2. [Informations enrichies depuis les sites web]
3. [Coûts et délais actualisés]

Sources web consultées :
- www.ambafrance-cm.org - Guide visa travail Cameroun
- www.dgsn.cm - Procédures immigration
- www.service-public.cm - Formalités administratives
```

## ⚙️ Personnalisation

### Modifier le seuil de déclenchement

Dans `app/api/chat/route.ts` ligne 106 :

```typescript
// Déclencher web search si moins de X résultats
const hasEnoughData = (finalDocuments && finalDocuments.length >= 2) ||
                      (finalProcedures && finalProcedures.length >= 2)

// Changer 2 par 3 pour être plus strict :
const hasEnoughData = (finalDocuments && finalDocuments.length >= 3) ||
                      (finalProcedures && finalProcedures.length >= 3)
```

### Modifier la requête de recherche

Dans `app/api/chat/route.ts` ligne 14 :

```typescript
const searchQuery = `${query} Cameroun procédure administrative`

// Personnaliser :
const searchQuery = `${query} Cameroun guide officiel 2025`
```

### Augmenter le nombre de résultats

Dans `app/api/chat/route.ts` ligne 15 :

```typescript
// Passer de 3 à 5 résultats :
const url = `...&num=5`  // au lieu de &num=3
```

## 📈 Statistiques et coûts

### API Google Custom Search (gratuite)
- **100 requêtes/jour** gratuites
- **$5 pour 1000 requêtes** supplémentaires
- La recherche n'est déclenchée que si nécessaire

### Exemple d'utilisation réelle
Si 20% de vos questions nécessitent une recherche web :
- **500 questions/jour** = 100 recherches web = **GRATUIT** ✅
- **1000 questions/jour** = 200 recherches web = **$0.50/jour** 💰

## 🔒 Sécurité

- Les clés API ne sont jamais exposées au client
- Recherche uniquement côté serveur
- Rate limiting appliqué
- Résultats cachés pour éviter les requêtes redondantes

## 🐛 Dépannage

### La recherche web ne fonctionne pas
1. Vérifiez que les clés sont dans `.env.local`
2. Vérifiez que l'API Custom Search est activée
3. Vérifiez les logs du serveur pour les erreurs

### Limite de 100 requêtes atteinte
1. Attendez 24h pour le reset
2. Ou passez au plan payant ($5/1000 req)
3. Ou augmentez le seuil de déclenchement

### Résultats non pertinents
1. Modifiez la requête de recherche (ligne 14)
2. Filtrez par domaine : ajoutez `site:gouv.cm` dans la query
3. Augmentez le nombre de résultats analysés

## 📝 Licence

Cette fonctionnalité utilise :
- **Google Custom Search API** - [Conditions d'utilisation](https://developers.google.com/custom-search/docs/overview)
- **Google Gemini AI** - [Conditions d'utilisation](https://ai.google.dev/terms)
