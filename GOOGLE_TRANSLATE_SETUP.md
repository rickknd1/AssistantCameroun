# 🌍 Configuration Google Translate API

## 📋 Prérequis

- Compte Google Cloud
- Projet Google Cloud existant ou nouveau

## 🚀 Installation (5 minutes)

### 1️⃣ Activer l'API Google Cloud Translation

1. Allez sur **Google Cloud Console** : https://console.cloud.google.com/
2. Sélectionnez votre projet (ou créez-en un nouveau)
3. Allez dans **APIs & Services** → **Library**
4. Recherchez **"Cloud Translation API"**
5. Cliquez sur **ENABLE** (Activer)

### 2️⃣ Créer une clé API

1. Allez dans **APIs & Services** → **Credentials**
2. Cliquez sur **+ CREATE CREDENTIALS** → **API key**
3. **Copiez** la clé générée
4. (Recommandé) Cliquez sur **RESTRICT KEY** pour limiter son utilisation :
   - **API restrictions** → Sélectionnez **Cloud Translation API**
   - **Application restrictions** → Choisir selon votre besoin

### 3️⃣ Configurer dans le projet

1. Ouvrez le fichier `.env` à la racine du projet
2. Ajoutez la ligne suivante :

```bash
GOOGLE_TRANSLATE_API_KEY=votre_clé_api_ici
```

3. Sauvegardez le fichier

### 4️⃣ Redémarrer l'application

```bash
npm run dev
```

## ✅ Vérification

Changez la langue en **English** dans l'interface :
- Les quiz doivent s'afficher en anglais
- Les documents doivent être traduits
- Les procédures doivent être traduites

## 📊 Quotas GRATUITS

- **500,000 caractères/mois** GRATUITS
- Au-delà : $20 par million de caractères

### Estimation pour votre projet :
- 1 quiz = ~500 caractères
- 1 document = ~200 caractères
- 1 procédure = ~150 caractères

**Exemple :** 10,000 requêtes/mois = ~200,000 caractères = **100% GRATUIT** ✅

## 🔧 Dépannage

### Erreur : "API key not configured"
➡️ Vérifiez que `GOOGLE_TRANSLATE_API_KEY` est bien dans `.env`

### Erreur : "API not enabled"
➡️ Retournez à l'étape 1 et activez l'API

### Contenu reste en français
➡️ Vérifiez la console du navigateur pour les erreurs
➡️ Redémarrez le serveur Next.js

## 🎯 Ce qui est traduit automatiquement

✅ **Quiz** : Questions, options, explications
✅ **Documents** : Titres, descriptions
✅ **Procédures** : Noms, descriptions
✅ **Bibliothèque** : Tous les contenus dynamiques

## 🔐 Sécurité

⚠️ **NE JAMAIS** commiter le fichier `.env` avec la clé API
✅ Le fichier `.gitignore` est déjà configuré pour l'exclure
✅ Utilisez `.env.example` comme template

## 📚 Documentation officielle

- [Cloud Translation API](https://cloud.google.com/translate/docs)
- [Tarification](https://cloud.google.com/translate/pricing)
- [Limites & Quotas](https://cloud.google.com/translate/quotas)
