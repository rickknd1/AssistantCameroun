# 🔍 Configuration Google Search - Guide Rapide

## ⚠️ PROBLÈME ACTUEL
Le chatbot **ne peut PAS chercher l'actualité** car `GOOGLE_SEARCH_ENGINE_ID` n'est pas configuré.

## ✅ SOLUTION (5 minutes)

### Option 1: Script Automatique (RECOMMANDÉ)
```bash
node setup-google-search.js
```
Le script va:
- Ouvrir le navigateur sur la bonne page
- Vous guider étape par étape
- Mettre à jour le .env automatiquement
- Tester l'API immédiatement

### Option 2: Configuration Manuelle

#### Étape 1: Créer le Search Engine
1. Allez sur: https://programmablesearchengine.google.com/controlpanel/all
2. Cliquez sur **"Add"** (bouton bleu)
3. Remplissez:
   - **Sites to search**: Laissez VIDE
   - Cochez ✅ **"Search the entire web"**
   - **Name**: `AssistantCameroun Search`
   - **Language**: French
4. Cliquez **"Create"**

#### Étape 2: Copier l'ID
1. Dans la page de votre moteur créé
2. Section **"Basics"**
3. Copiez le **Search engine ID**
   ```
   Exemple: a1b2c3d4e5f6g7h8i
   ```

#### Étape 3: Mettre à jour .env
1. Ouvrez `.env`
2. Ligne 35, remplacez:
   ```env
   GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
   ```
   Par:
   ```env
   GOOGLE_SEARCH_ENGINE_ID=VOTRE_ID_ICI
   ```
3. Sauvegardez

#### Étape 4: Tester
```bash
node test-google-search.js
```

Si vous voyez des résultats → ✅ **SUCCÈS!**

#### Étape 5: Redémarrer le serveur
```bash
# Arrêter le serveur (Ctrl+C)
npm run dev
```

## 🎯 Vérification Finale
Posez une question d'actualité au chatbot:
```
"Liste des candidats à la présidentielle 2025 au Cameroun"
```

Si le chatbot trouve des infos récentes → **Configuration réussie!** 🎉

## 📊 Limites
- **100 requêtes/jour GRATUITES**
- Au-delà: 5$/1000 requêtes
- Surveillez l'usage: https://console.cloud.google.com

## ❓ Problèmes Courants

### "Invalid API key"
→ Vérifiez `GOOGLE_SEARCH_API_KEY` dans .env

### "Invalid cx parameter"
→ L'ID du Search Engine est incorrect

### "Search the entire web is disabled"
→ Activez cette option dans les paramètres du moteur

## 🆘 Besoin d'aide?
Exécutez:
```bash
node setup-google-search.js
```
Le script vous guidera pas à pas!
