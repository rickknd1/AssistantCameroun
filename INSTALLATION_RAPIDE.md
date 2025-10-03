# ⚡ INSTALLATION RAPIDE - Système d'Apprentissage

## 📋 Étape 1 : Copier le SQL

Ouvrir le fichier : **`scripts/create-learning-system-tables.sql`**

Sélectionner TOUT le contenu (Ctrl+A), puis copier (Ctrl+C)

---

## 🌐 Étape 2 : Ouvrir Supabase Dashboard

1. Aller sur : **https://supabase.com/dashboard**
2. Se connecter avec son compte
3. Sélectionner le projet : **AssistantCameroun** (ou votre projet)

---

## 💾 Étape 3 : Exécuter le SQL

1. Dans le menu gauche, cliquer sur **"SQL Editor"**
2. Cliquer sur le bouton **"New Query"** (en haut à droite)
3. Coller le SQL copié (Ctrl+V)
4. Cliquer sur **"Run"** (ou appuyer sur Ctrl+Enter)

⏳ **Attendre 5-10 secondes...**

✅ Devrait afficher : **"Success. No rows returned"**

---

## ✅ Étape 4 : Vérifier l'installation

Dans le même SQL Editor, exécuter cette requête :

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_name IN ('QuestionCache', 'ResponseFeedback', 'VerificationLog');
```

**Résultat attendu :** 3 lignes
- QuestionCache
- ResponseFeedback
- VerificationLog

---

## 🎉 C'EST TOUT !

Le système d'apprentissage intelligent est maintenant installé.

### 🧪 Test rapide

Poser 2 fois la même question dans l'assistant :

**Question 1** (génération normale ~2s) :
```
Quel est l'article 20 de la Constitution ?
```

**Question 2** (cache hit ~0.1s) :
```
Quel est l'article 20 de la Constitution ?
```

La deuxième fois devrait être **instantanée** ! ⚡

---

## 📊 Voir les statistiques

```sql
-- Nombre de questions en cache
SELECT COUNT(*) FROM "QuestionCache";

-- Top 5 questions
SELECT
  "questionOriginal",
  "usageCount",
  "successRate"
FROM "QuestionCache"
ORDER BY "usageCount" DESC
LIMIT 5;
```

---

## ❓ Problèmes ?

### Erreur : "relation already exists"

➡️ **Normal !** Les tables existent déjà. Tout est OK.

### Erreur : "permission denied"

➡️ Vérifier que vous utilisez bien le **Service Role Key** dans `.env.local` :
```
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### Tables non visibles dans Table Editor

➡️ **Normal !** Utiliser le SQL Editor pour les voir.

---

**Support** : Voir `SYSTEME_APPRENTISSAGE.md` pour la doc complète
