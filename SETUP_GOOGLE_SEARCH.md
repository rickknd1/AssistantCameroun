# Configuration Google Custom Search API

## Problème
L'API Google Search ne fonctionne pas car le `GOOGLE_SEARCH_ENGINE_ID` n'est pas configuré. Il est actuellement défini sur `your_search_engine_id_here`.

## Solution: Créer un Custom Search Engine

### Étape 1: Créer le moteur de recherche
1. Aller sur https://programmablesearchengine.google.com/
2. Cliquer sur "Add" ou "Créer un moteur de recherche"
3. Configuration:
   - **Sites à rechercher**: Laisser vide OU sélectionner "Search the entire web"
   - **Nom du moteur**: "AssistantCameroun Search"
   - **Langue**: Français

### Étape 2: Activer la recherche sur tout le web
1. Dans les paramètres du moteur créé
2. Aller dans "Basics" / "Paramètres de base"
3. Activer "Search the entire web" / "Rechercher sur tout le web"
4. Sauvegarder

### Étape 3: Obtenir le Search Engine ID
1. Dans le panneau de contrôle de votre moteur
2. Section "Basics" / "Vue d'ensemble"
3. Copier le **Search engine ID** (commence généralement par un code alphanumérique)
   - Format: `a1b2c3d4e5f6g7h8i` (exemple)

### Étape 4: Mettre à jour le .env
1. Ouvrir le fichier `.env`
2. Remplacer la ligne:
   ```
   GOOGLE_SEARCH_ENGINE_ID=your_search_engine_id_here
   ```
   Par:
   ```
   GOOGLE_SEARCH_ENGINE_ID=VOTRE_VRAI_ID_ICI
   ```
3. Sauvegarder le fichier
4. Redémarrer le serveur: `npm run dev`

## Vérification
Après configuration, tester avec:
```bash
curl -s "https://www.googleapis.com/customsearch/v1?key=AIzaSyAoW9PQLCDIDvjdEKBh8X_MoMvYo_ko6A0&cx=VOTRE_ID&q=candidats+presidentielle+cameroun+2025&num=3"
```

Si ça fonctionne, vous devriez voir des résultats JSON avec des liens et des snippets.

## Notes importantes
- L'API Google Custom Search a une limite de **100 requêtes GRATUITES par jour**
- Au-delà, il faut payer $5 pour 1000 requêtes supplémentaires
- Bien surveiller l'usage dans la Google Cloud Console
