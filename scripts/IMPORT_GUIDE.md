# 📥 Guide d'Import des Données

## 🎯 Vue d'ensemble

Ce guide explique comment importer les documents PDF et procédures du dossier `docs/` dans votre base de données Supabase.

---

## ✅ Prérequis

### 1. Variables d'environnement configurées

Vérifiez que votre fichier `.env` contient:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://hqmydrehuoqlfosbklqb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...  # ⚠️ IMPORTANT: Key admin nécessaire
```

**⚠️ IMPORTANT**: Vous devez avoir la `SUPABASE_SERVICE_ROLE_KEY` (pas juste l'anon key).

**Comment l'obtenir:**
1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet
3. **Settings** > **API**
4. Copiez la clé **service_role** (secret, en bas de page)
5. Collez-la dans votre `.env`

### 2. Tables créées dans Supabase

Les tables `Document` et `Procedure` doivent exister (normalement déjà fait via les scripts SQL).

### 3. Dépendances installées

```bash
# Déjà installé
pnpm add pdf-parse @google/generative-ai
pnpm add -D tsx
```

---

## 🚀 Import des données

### **Méthode 1: Import tout en une commande**

```bash
pnpm import:all
```

Cette commande va:
1. Extraire les PDFs du dossier `docs/pdfs-officiels/`
2. Extraire les procédures du guide txt
3. Insérer tout dans Supabase

### **Méthode 2: Import séparé**

#### A. Importer uniquement les documents PDF

```bash
pnpm import:documents
```

**Ce qui sera importé:**
- `Loi portant organisation judiciaire` (150.12.06-Loi-du-29-decembre-2006_Organisation-judiciaire.pdf)
- `Code de Justice Administrative` (Code de justice administrative.pdf)
- `Code Civil Camerounais` (CODE-CIVIL-CAMEROUNAIS complet.pdf.crdownload)

**Résultat attendu:**
```
🚀 Début de l'import des documents PDF...

📄 Traitement: Loi portant organisation judiciaire
   → Extraction du texte...
   → Insertion dans Supabase...
   ✅ Inséré avec succès (125430 caractères)

📄 Traitement: Code de Justice Administrative
   → Extraction du texte...
   → Insertion dans Supabase...
   ✅ Inséré avec succès (98765 caractères)

==================================================
✅ Import terminé!
   Succès: 3
   Erreurs: 0
==================================================
```

#### B. Importer uniquement les procédures

```bash
pnpm import:procedures
```

**Ce qui sera importé:**
- Carte Nationale d'Identité (CNI)
- Passeport Biométrique
- Acte de Naissance

**Résultat attendu:**
```
🚀 Début de l'import des procédures...

📋 Traitement: Carte Nationale d'Identité (CNI)
   ✅ Inséré avec succès

📋 Traitement: Passeport Biométrique
   ✅ Inséré avec succès

📋 Traitement: Acte de Naissance
   ✅ Inséré avec succès

==================================================
✅ Import terminé!
   Succès: 3
   Erreurs: 0
==================================================
```

---

## 🔍 Vérification des données importées

### Dans Supabase Dashboard

1. Allez dans **Table Editor**
2. Sélectionnez la table `Document`
3. Vous devriez voir les 3 documents PDF
4. Sélectionnez la table `Procedure`
5. Vous devriez voir les 3 procédures

### Via SQL

```sql
-- Compter les documents
SELECT COUNT(*) as total_documents FROM "Document";

-- Voir les documents
SELECT title, type, category, status FROM "Document";

-- Compter les procédures
SELECT COUNT(*) as total_procedures FROM "Procedure";

-- Voir les procédures
SELECT name, category, difficulty, duration FROM "Procedure";
```

### Via API

```bash
# Test rapide avec curl
curl "http://localhost:3000/api/documents"
curl "http://localhost:3000/api/procedures"
```

---

## 🔄 Ré-import / Mise à jour

Les scripts gèrent automatiquement les mises à jour:

- Si un document avec le même `slug` existe déjà → **Mise à jour**
- Sinon → **Création**

Vous pouvez donc relancer les scripts en toute sécurité.

---

## 📝 Ajouter plus de données

### Ajouter un nouveau document PDF

1. Placez votre PDF dans `docs/pdfs-officiels/`
2. Éditez `scripts/import-documents-from-pdfs.ts`
3. Ajoutez votre document dans le tableau `pdfDocuments`:

```typescript
{
  filename: 'votre-document.pdf',
  title: 'Titre du Document',
  type: 'LOI', // CODE, LOI, DÉCRET, ORDONNANCE, ARRÊTÉ
  category: 'Droit pénal',
  reference: 'Loi N° 2024/001 du 15 janvier 2024',
  dateEnacted: '2024-01-15'
}
```

4. Relancez: `pnpm import:documents`

### Ajouter une nouvelle procédure

1. Éditez `scripts/import-procedures.ts`
2. Ajoutez votre procédure dans le tableau `procedures`:

```typescript
{
  slug: 'permis-construire',
  name: 'Permis de Construire',
  category: 'foncier',
  difficulty: 'Difficile',
  description: 'Description...',
  duration: '2-3 mois',
  steps: [
    { step: 1, title: 'Étape 1', description: '...' },
    // ...
  ],
  documents: ['Document 1', 'Document 2'],
  costs: [
    { item: 'Frais dossier', amount: '50 000 FCFA' }
  ],
  locations: [
    { name: 'Mairie', address: 'Yaoundé', hours: '8h-15h' }
  ],
  tips: ['Conseil 1', 'Conseil 2'],
  faqs: [
    { question: 'Question ?', answer: 'Réponse.' }
  ]
}
```

3. Relancez: `pnpm import:procedures`

---

## 🐛 Résolution des problèmes

### Erreur: "Variables d'environnement manquantes"

**Solution:** Vérifiez que votre `.env` contient bien `SUPABASE_SERVICE_ROLE_KEY`.

```bash
# Tester les variables
node -e "console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"
node -e "console.log(process.env.SUPABASE_SERVICE_ROLE_KEY)"
```

### Erreur: "Contenu trop court ou vide"

**Solution:** Le PDF est probablement corrompu ou protégé. Vérifiez que:
- Le PDF s'ouvre correctement
- Le PDF n'est pas protégé par mot de passe
- Le fichier n'est pas en `.crdownload` (téléchargement incomplet)

### Erreur: "Error inserting/updating"

**Solution:** Vérifiez la structure de votre table dans Supabase:
- Les colonnes existent
- Les types correspondent
- Les constraints (CHECK, UNIQUE) sont respectés

### Erreur: "Cannot find module 'pdf-parse'"

**Solution:** Installez les dépendances:

```bash
pnpm install
```

---

## 📊 Statistiques après import

Après un import réussi, vous aurez:

### Documents
- **3 documents juridiques** majeurs
- Contenu complet extrait des PDFs
- Résumés générés automatiquement
- Prêts pour recherche full-text

### Procédures
- **3 procédures administratives** détaillées
- Étapes complètes
- Coûts actualisés
- Lieux et conseils pratiques
- FAQs

---

## 🔜 Prochaines étapes

Après l'import des données:

1. **Générer les embeddings** (pour RAG/recherche vectorielle)
   ```bash
   # À créer: scripts/generate-embeddings.ts
   pnpm generate:embeddings
   ```

2. **Mettre à jour les composants frontend** pour utiliser les données de la BD

3. **Tester l'application**
   ```bash
   pnpm dev
   # Visiter http://localhost:3000/bibliotheque
   # Visiter http://localhost:3000/procedures
   ```

---

## 🎉 Félicitations!

Vos données sont maintenant dans Supabase et prêtes à être utilisées par l'application!

**Commandes rapides:**
```bash
pnpm import:all         # Import complet
pnpm import:documents   # Seulement les PDFs
pnpm import:procedures  # Seulement les procédures
```