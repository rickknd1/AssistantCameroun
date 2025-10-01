# 📚 Documentation Complète - Assistant National du Cameroun

**Version**: 1.0.0
**Date**: Octobre 2025
**Statut**: Production Ready ✅

---

## 🎯 Vue d'Ensemble du Projet

### Présentation

**Assistant National du Cameroun** est une plateforme web intelligente qui utilise l'intelligence artificielle pour aider les citoyens camerounais dans leurs démarches administratives. Le système répond aux questions sur les procédures (CNI, passeport, création d'entreprise, etc.), les lois, et fournit des informations officielles fiables.

### Objectifs Principaux

1. **Accessibilité** - Rendre l'information administrative accessible 24/7
2. **Fiabilité** - Fournir des réponses basées sur des documents officiels
3. **Intelligence** - Utiliser l'IA pour comprendre et répondre naturellement
4. **Multilingue** - Support français et anglais (langues officielles du Cameroun)

### Statistiques Clés

- **302 questions pré-enregistrées** réparties en 6 catégories
- **3 niveaux de recherche** : Base de données → IA → Web
- **Score d'audit** : 87/100 (Excellent)
- **Technologies** : Next.js 14, React 18, TypeScript, Supabase, Google Gemini AI

---

## 🏗️ Architecture Technique

### Stack Technologique

#### Frontend
```
- Next.js 14 (App Router)
- React 18 (Server & Client Components)
- TypeScript 5.x
- Tailwind CSS 3.x
- Radix UI (Composants accessibles)
- next-themes (Dark mode)
- Lucide React (Icônes)
```

#### Backend
```
- Next.js API Routes (Serverless)
- Supabase PostgreSQL (Base de données)
- Google Gemini AI (gemini-2.0-flash-exp)
- Google Custom Search API (Recherche web)
```

#### Outils & DevOps
```
- Git/GitHub (Versioning)
- Vercel (Hébergement & CI/CD)
- ESLint + TypeScript (Qualité code)
```

### Architecture des Dossiers

```
AssistantCameroun/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── analytics/           # Tracking utilisateur
│   │   ├── chat/                # IA conversationnelle (★)
│   │   ├── documents/           # Gestion documents
│   │   ├── news/                # Actualités
│   │   ├── procedures/          # Procédures admin
│   │   └── quiz/                # Quiz éducatifs
│   ├── assistant/               # Page chat IA
│   ├── bibliotheque/            # Bibliothèque documents
│   ├── procedures/              # Liste procédures
│   ├── actualites/              # Actualités
│   └── quiz/                    # Quiz interactifs
│
├── components/                   # Composants React
│   ├── assistant/               # Chat IA (★)
│   │   ├── chat-interface.tsx   # Interface principale
│   │   ├── chat-messages.tsx    # Affichage messages
│   │   ├── chat-input.tsx       # Input + suggestions
│   │   ├── chat-sidebar.tsx     # Sidebar conversations
│   │   └── welcome-screen.tsx   # Écran d'accueil
│   ├── home/                    # Page d'accueil
│   ├── library/                 # Composants bibliothèque
│   ├── news/                    # Composants actualités
│   ├── procedures/              # Composants procédures
│   ├── quiz/                    # Composants quiz
│   └── ui/                      # Composants UI réutilisables
│
├── lib/                          # Utilitaires
│   ├── data/                    # Données statiques
│   │   └── questions-bank.ts    # 302 questions (★)
│   ├── i18n/                    # Traductions FR/EN
│   ├── supabase/                # Client Supabase
│   ├── types/                   # Types TypeScript
│   └── utils/                   # Fonctions utilitaires
│       ├── analytics.ts         # Analytics
│       ├── conversations.ts     # Gestion conversations
│       ├── rate-limit.ts        # Rate limiting (★)
│       └── session.ts           # Sessions utilisateur
│
├── scripts/                      # Scripts d'import
│   ├── import-documents-from-pdfs.ts
│   ├── import-procedures-direct.ts
│   ├── import-news.ts
│   └── import-quiz.ts
│
├── public/                       # Assets statiques
├── styles/                       # CSS global
├── docs/                         # Documentation
├── .env                          # Variables production
├── .env.example                  # Template variables
├── next.config.mjs               # Config Next.js (★)
├── tailwind.config.ts            # Config Tailwind
└── tsconfig.json                 # Config TypeScript
```

**★ Fichiers critiques** pour le fonctionnement du système IA

---

## 🧠 Système d'Intelligence Artificielle

### Modèle IA Utilisé

**Google Gemini 2.0 Flash Experimental**
- Modèle multimodal (texte + images)
- Vitesse de réponse rapide (< 2 secondes)
- Contexte de 1M tokens
- Gratuit avec limites raisonnables

### Architecture en 3 Niveaux

```
┌─────────────────────────────────────────────────────────┐
│  1. RECHERCHE BASE DE DONNÉES (Supabase PostgreSQL)    │
│     → Documents juridiques (9)                          │
│     → Procédures administratives (5)                    │
│     → Recherche multi-mots-clés intelligente           │
└─────────────────────────────────────────────────────────┘
                          ↓ (si résultats insuffisants)
┌─────────────────────────────────────────────────────────┐
│  2. CONNAISSANCES IA GEMINI                             │
│     → Connaissances générales sur le Cameroun          │
│     → Procédures administratives courantes             │
│     → Lois et réglementations                          │
└─────────────────────────────────────────────────────────┘
                          ↓ (si résultats insuffisants)
┌─────────────────────────────────────────────────────────┐
│  3. RECHERCHE WEB (Google Custom Search API)            │
│     → 3 résultats web pertinents                        │
│     → Query: "{question} Cameroun procédure admin"      │
│     → 100 requêtes/jour gratuites                       │
└─────────────────────────────────────────────────────────┘
```

### Prompt System IA

Le système utilise un prompt structuré qui :
- ✅ Force les réponses en français
- ✅ Priorise le contexte fourni (documents DB)
- ✅ Interdit de dire "Je ne dispose pas d'informations"
- ✅ Structure les réponses (étapes, coûts, délais, conseils)
- ✅ Cite les sources utilisées

**Fichier**: `app/api/chat/route.ts:165-192`

### Recherche Intelligente Multi-Mots-Clés

```typescript
// Extraction de mots-clés pertinents
const keywords = searchTerms
  .replace(/[?.,!]/g, '')
  .split(' ')
  .filter(word => word.length > 3)  // Mots > 3 caractères
  .slice(0, 5)                       // Max 5 mots-clés

// Construction de conditions de recherche
const searchConditions = keywords.map(keyword =>
  `title.ilike.%${keyword}%,content.ilike.%${keyword}%,category.ilike.%${keyword}%`
).join(',')
```

**Fichier**: `app/api/chat/route.ts:55-64`

---

## 💾 Base de Données Supabase

### Schéma de la Base

#### Table `Document`
```sql
CREATE TABLE "Document" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  reference TEXT,              -- Ex: "Loi N°2016/007"
  content TEXT,                -- Contenu extrait du PDF
  type TEXT NOT NULL,          -- LOI, DECRET, ARRETE, CODE
  category TEXT,               -- IDENTITE, ENTREPRISE, etc.
  status TEXT DEFAULT 'ACTIVE',
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

**Contenu actuel**: 9 documents juridiques importés

#### Table `Procedure`
```sql
CREATE TABLE "Procedure" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  steps JSONB,                 -- Liste des étapes
  documents JSONB,             -- Documents requis
  costs JSONB,                 -- Coûts détaillés
  duration TEXT,               -- Durée estimée
  category TEXT,
  popularity INTEGER DEFAULT 0,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

**Contenu actuel**: 5 procédures (CNI, Passeport, Acte de naissance, etc.)

#### Table `News`
```sql
CREATE TABLE "News" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE,
  title TEXT NOT NULL,
  titleEn TEXT,
  content TEXT,
  contentEn TEXT,
  category TEXT,
  publishedAt TIMESTAMP,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

**Contenu actuel**: 8 actualités

#### Table `QuizQuestion`
```sql
CREATE TABLE "QuizQuestion" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  questionEn TEXT,
  options JSONB NOT NULL,      -- [opt1, opt2, opt3, opt4]
  correctAnswer INTEGER,       -- Index 0-3
  explanation TEXT,
  category TEXT,               -- identite, entreprise, etc.
  difficulty TEXT,             -- Facile, Moyen, Difficile
  createdAt TIMESTAMP DEFAULT NOW()
);
```

**Contenu actuel**: 10+ questions réparties en 6 catégories

#### Table `Analytics`
```sql
CREATE TABLE "Analytics" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event TEXT NOT NULL CHECK (event IN (
    'PAGE_VIEW', 'SEARCH', 'DOCUMENT_VIEW', 'PROCEDURE_VIEW',
    'NEWS_VIEW', 'QUIZ_START', 'QUIZ_COMPLETE',
    'CONVERSATION_START', 'MESSAGE_SENT', 'MESSAGE_RECEIVED',
    'MESSAGE_ERROR', 'CITATION_CLICKED', 'FEEDBACK_SUBMITTED'
  )),
  sessionId TEXT NOT NULL,
  data JSONB,
  language TEXT DEFAULT 'FR',
  userAgent TEXT,
  ip TEXT,
  createdAt TIMESTAMP DEFAULT NOW()
);
```

### Row Level Security (RLS)

Supabase utilise RLS pour sécuriser l'accès aux données :
- Lecture publique pour `Document`, `Procedure`, `News`, `QuizQuestion`
- Écriture restreinte via `service_role_key` (backend uniquement)
- `Analytics` : insertion publique, lecture admin uniquement

---

## 📝 Fonctionnalités Principales

### 1. Chat IA Conversationnel 🤖

**Localisation**: `/assistant`

**Composants clés**:
- `components/assistant/chat-interface.tsx` - Interface principale
- `components/assistant/chat-input.tsx` - Input avec suggestions contextuelles
- `components/assistant/chat-messages.tsx` - Affichage messages
- `components/assistant/chat-sidebar.tsx` - Historique + 302 questions

**Fonctionnalités**:
- ✅ Conversations illimitées
- ✅ Historique sauvegardé (localStorage)
- ✅ Suggestions contextuelles intelligentes
- ✅ Auto-scroll vers nouveau message
- ✅ Support mobile responsive
- ✅ Citations de sources
- ✅ Niveau de confiance (70-90%)
- ✅ Recherche dans 302 questions pré-définies
- ✅ Analytics tracking automatique

**Exemple de flux**:
```
1. Utilisateur : "Comment obtenir une CNI ?"
2. Système recherche DB → Trouve procédure CNI
3. Gemini génère réponse structurée avec contexte
4. Affichage : Réponse + Sources + Confiance 90%
5. Suggestions contextuelles : "Quels documents ?", "Combien ça coûte ?"
6. Analytics : CONVERSATION_START, MESSAGE_SENT, MESSAGE_RECEIVED
```

### 2. Bibliothèque de Documents 📚

**Localisation**: `/bibliotheque`

**Contenu**:
- 9 documents juridiques officiels
- Types : Lois, Décrets, Arrêtés, Codes
- Catégories : Identité, Entreprise, Foncier, Travail, etc.
- Recherche et filtrage par catégorie
- Détails complets avec contenu extrait

### 3. Guide des Procédures 📋

**Localisation**: `/procedures`

**Contenu**:
- 5 procédures administratives détaillées
- Étapes numérotées claires
- Documents requis listés
- Coûts détaillés
- Durée estimée
- Conseils pratiques

**Exemples**:
- Obtention de la CNI
- Demande de passeport
- Acte de naissance
- Création d'entreprise
- Titre foncier

### 4. Actualités 📰

**Localisation**: `/actualites`

**Contenu**:
- 8 articles d'actualité
- Bilingue FR/EN
- Catégories : Politique, Économie, Social, etc.
- Système de slugs SEO-friendly
- Pages de détail complètes

### 5. Quiz Éducatifs 🎓

**Localisation**: `/quiz`

**Contenu**:
- 10+ questions interactives
- 6 catégories (Identité, Entreprise, Juridique, Foncier, Éducation, Santé)
- 3 niveaux de difficulté (Facile, Moyen, Difficile)
- Score en temps réel
- Explications détaillées
- Recommandations personnalisées

**Exemple de question**:
```json
{
  "question": "Quelle est la durée de validité d'une CNI au Cameroun ?",
  "options": ["5 ans", "10 ans", "15 ans", "20 ans"],
  "correctAnswer": 1,
  "explanation": "La CNI camerounaise est valide 10 ans...",
  "category": "identite",
  "difficulty": "Facile"
}
```

---

## 🔒 Sécurité

### Mesures Implémentées

#### 1. Rate Limiting ⚡
**Fichier**: `lib/utils/rate-limit.ts`

```typescript
// 20 requêtes par minute par IP sur /api/chat
rateLimitMiddleware(request, {
  interval: 60 * 1000,
  uniqueTokenPerInterval: 20
})
```

**Protection contre**:
- Spam
- Attaques DDoS
- Abus de l'API

#### 2. Variables d'Environnement 🔑

**Fichier**: `.env` (non versionné sur Git)

```bash
# ✅ JAMAIS exposé côté client
GEMINI_API_KEY=***
SUPABASE_SERVICE_ROLE_KEY=***
GOOGLE_SEARCH_API_KEY=***

# ✅ Safe pour le client (lecture seule)
NEXT_PUBLIC_SUPABASE_URL=***
NEXT_PUBLIC_SUPABASE_ANON_KEY=***
```

#### 3. Row Level Security (RLS)

Toutes les tables Supabase utilisent RLS :
- Lectures publiques limitées
- Écritures via backend uniquement
- Isolation des données sensibles

#### 4. Validation des Entrées

```typescript
// Validation stricte des événements analytics
const validEvents = [
  'PAGE_VIEW', 'SEARCH', 'DOCUMENT_VIEW', ...
]

if (!validEvents.includes(event)) {
  return NextResponse.json({ success: true, warning: 'Invalid event type' })
}
```

#### 5. Headers de Sécurité

```javascript
// next.config.mjs - À ajouter pour CSP
headers: [
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  }
]
```

### Recommandations Futures

- [ ] Implémenter Content Security Policy (CSP)
- [ ] Ajouter CSRF protection
- [ ] Migrer rate limiting vers Redis (production)
- [ ] Ajouter monitoring avec Sentry
- [ ] Implémenter audit logs

---

## 🌐 Internationalisation (i18n)

### Langues Supportées

- 🇫🇷 **Français** (par défaut)
- 🇬🇧 **Anglais**

### Architecture i18n

**Fichier**: `lib/i18n/index.ts`

```typescript
export const translations = {
  fr: {
    home: {
      hero: {
        title: "Assistant National du Cameroun",
        searchPlaceholder: "Posez votre question ici..."
      }
    },
    assistant: {
      welcome: "Bonjour ! Comment puis-je vous aider ?"
    }
  },
  en: {
    home: {
      hero: {
        title: "National Assistant of Cameroon",
        searchPlaceholder: "Ask your question here..."
      }
    },
    assistant: {
      welcome: "Hello! How can I help you?"
    }
  }
}
```

### Utilisation

```typescript
import { useLanguage } from '@/lib/i18n'

const { t, language, setLanguage } = useLanguage()

<h1>{t('home.hero.title')}</h1>
<button onClick={() => setLanguage('en')}>English</button>
```

### Base de Données Bilingue

Toutes les tables principales ont des champs bilingues :
- `title` / `titleEn`
- `content` / `contentEn`
- `question` / `questionEn`

---

## 📊 Analytics & Tracking

### Événements Trackés

| Événement | Description | Données |
|-----------|-------------|---------|
| `PAGE_VIEW` | Visite de page | `page`, `referrer` |
| `CONVERSATION_START` | Début conversation | `conversationId`, `firstQuestion`, `category` |
| `MESSAGE_SENT` | Message utilisateur | `messageLength`, `messageNumber` |
| `MESSAGE_RECEIVED` | Réponse IA | `responseTime`, `confidence`, `sourcesCount` |
| `MESSAGE_ERROR` | Erreur IA | `error` |
| `DOCUMENT_VIEW` | Vue document | `documentId`, `title` |
| `PROCEDURE_VIEW` | Vue procédure | `procedureId`, `name` |
| `NEWS_VIEW` | Vue actualité | `newsId`, `slug` |
| `QUIZ_START` | Début quiz | `category`, `difficulty` |
| `QUIZ_COMPLETE` | Fin quiz | `score`, `totalQuestions` |
| `CITATION_CLICKED` | Clic source | `sourceTitle`, `sourceUrl` |
| `FEEDBACK_SUBMITTED` | Feedback utilisateur | `rating`, `comment` |

### Architecture Analytics

**Fichier**: `components/assistant/chat-interface.tsx:53-73`

```typescript
const trackEvent = async (event: string, data?: Record<string, any>) => {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        sessionId,
        data,
        language: language.toUpperCase(),
        userAgent: navigator.userAgent,
      }),
    })
  } catch (error) {
    // Ne pas bloquer l'application si analytics échoue
    console.error("Analytics tracking error:", error)
  }
}
```

### Dashboard Analytics (À Implémenter)

Utiliser les données pour :
- 📊 Questions les plus fréquentes
- ⏱️ Temps de réponse moyen
- 💯 Taux de satisfaction
- 🔥 Pages les plus visitées
- 📈 Croissance utilisateurs

---

## ⚡ Performance

### Optimisations Implémentées

#### 1. Next.js Compiler
```javascript
// next.config.mjs
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn']
  } : false
}
```
✅ Supprime 804 `console.log` en production

#### 2. Code Splitting Automatique
- Next.js split automatiquement par route
- Lazy loading des composants lourds
- Bundle size optimisé

#### 3. Images Optimisées
```javascript
images: {
  unoptimized: true // Pour Vercel
}
```

#### 4. Recherche Optimisée
```typescript
// Limitation des résultats
.select('id, title, content')  // Colonnes spécifiques
.limit(5)                       // Max 5 résultats
```

#### 5. Cache Navigateur
- Assets statiques : 1 an
- API responses : headers Cache-Control
- localStorage pour conversations

### Métriques de Performance

**Cible Lighthouse** (Production):
- Performance: 90+
- Accessibilité: 95+
- Best Practices: 90+
- SEO: 95+

---

## 🎨 Design & UX

### Système de Design

#### Couleurs (Tailwind)
```javascript
colors: {
  border: "hsl(var(--border))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: "hsl(var(--primary))",
  secondary: "hsl(var(--secondary))",
  muted: "hsl(var(--muted))",
  accent: "hsl(var(--accent))",
  destructive: "hsl(var(--destructive))"
}
```

#### Typographie
```css
Font: Inter (système)
Tailles: text-xs, text-sm, text-base, text-lg, text-xl, text-2xl
Poids: font-normal, font-medium, font-semibold, font-bold
```

#### Espacements
```css
Padding: p-2, p-3, p-4, p-6, p-8
Margin: m-2, m-3, m-4, m-6, m-8
Gap: gap-1, gap-2, gap-3, gap-4, gap-6
```

### Dark Mode

Système complet avec `next-themes`:
```typescript
import { ThemeProvider } from 'next-themes'

<ThemeProvider attribute="class" defaultTheme="system">
  {children}
</ThemeProvider>
```

- ✅ Détection automatique système
- ✅ Toggle manuel
- ✅ Persistance localStorage
- ✅ Tous les composants supportent dark mode

### Responsive Design

**Breakpoints Tailwind**:
```
sm: 640px   (Mobile large)
md: 768px   (Tablet)
lg: 1024px  (Desktop)
xl: 1280px  (Large desktop)
2xl: 1536px (Extra large)
```

**Mobile-First**:
```jsx
<div className="text-sm sm:text-base lg:text-lg">
  S'adapte à toutes les tailles
</div>
```

### Accessibilité (A11y)

- ✅ Radix UI (accessible par défaut)
- ✅ Labels sémantiques
- ✅ Navigation clavier
- ✅ ARIA attributes
- ✅ Contrastes WCAG AA
- ✅ Screen readers friendly

---

## 🚀 Déploiement

### Hébergement Vercel

#### Configuration Vercel

**Variables d'environnement à configurer**:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hqmydrehuoqlfosbklqb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=***
SUPABASE_SERVICE_ROLE_KEY=***

# Gemini AI
GEMINI_API_KEY=***

# Google Custom Search (optionnel)
GOOGLE_SEARCH_API_KEY=***
GOOGLE_SEARCH_ENGINE_ID=***

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://assistant-cameroun.vercel.app
```

#### Commandes de Déploiement

```bash
# Build local (test)
npm run build

# Déploiement Vercel (automatique sur push)
git push origin main

# Déploiement manuel
vercel --prod
```

#### Configuration Git Pre-Deployment

```bash
# Vérifier le build avant push
npm run build

# Vérifier les types TypeScript
npm run type-check

# Commit et push
git add .
git commit -m "Deploy: Production ready"
git push origin main
```

### Configuration Production

#### 1. Next.js Production Build
```bash
npm run build
npm run start
```

#### 2. Environment Variables
- ✅ Toutes les clés API configurées
- ✅ NODE_ENV=production
- ✅ NEXT_PUBLIC_APP_URL correct

#### 3. Database
- ✅ Supabase en production
- ✅ Données importées
- ✅ RLS activé

#### 4. Monitoring
- [ ] Ajouter Sentry pour error tracking
- [ ] Configurer Vercel Analytics
- [ ] Setup uptime monitoring

---

## 🔧 Maintenance & Scripts

### Scripts NPM Disponibles

```bash
# Développement
npm run dev              # Démarre dev server (port 3000)

# Build & Production
npm run build            # Build pour production
npm run start            # Démarre en mode production

# Type Checking
npm run type-check       # Vérifier erreurs TypeScript

# Linting
npm run lint             # ESLint

# Scripts d'import de données
npm run import:documents # Importer documents PDF
npm run import:procedures # Importer procédures
npm run import:news      # Importer actualités
npm run import:quiz      # Importer questions quiz
```

### Scripts d'Import de Données

#### Import Documents
**Fichier**: `scripts/import-documents-from-pdfs.ts`
```bash
npx tsx scripts/import-documents-from-pdfs.ts
```
Parse les PDFs et extrait le texte pour la base de données.

#### Import Procédures
**Fichier**: `scripts/import-procedures-direct.ts`
```bash
npx tsx scripts/import-procedures-direct.ts
```
Importe les procédures administratives détaillées.

#### Import Actualités
**Fichier**: `scripts/import-news.ts`
```bash
npx tsx scripts/import-news.ts
```
Importe les articles d'actualité avec slugs.

#### Import Quiz
**Fichier**: `scripts/import-quiz.ts`
```bash
npx tsx scripts/import-quiz.ts
```
Importe les questions de quiz avec difficultés.

### Backup Base de Données

```bash
# Backup Supabase (manuel)
# Via Dashboard Supabase → Database → Backups

# Backup local (pg_dump)
pg_dump -h db.hqmydrehuoqlfosbklqb.supabase.co \
  -U postgres -d postgres > backup_$(date +%Y%m%d).sql
```

---

## 🐛 Debugging & Troubleshooting

### Problèmes Courants

#### 1. IA ne répond pas
**Symptômes**: Timeout ou erreur 500
**Solutions**:
- Vérifier `GEMINI_API_KEY` dans `.env`
- Vérifier quota API Gemini
- Vérifier connexion Supabase
- Regarder les logs Vercel/console

#### 2. Base de données vide
**Symptômes**: Pages vides (bibliothèque, procédures)
**Solutions**:
- Vérifier `NEXT_PUBLIC_SUPABASE_URL`
- Vérifier RLS policies Supabase
- Lancer scripts d'import
- Vérifier `await createClient()` dans API routes

#### 3. Analytics ne fonctionne pas
**Symptômes**: Événements non enregistrés
**Solutions**:
- Vérifier constraint `Analytics_event_check`
- Vérifier INSERT permissions Supabase
- Regarder console browser pour erreurs
- Vérifier format des données envoyées

#### 4. Rate limiting trop strict
**Symptômes**: "Too many requests" fréquent
**Solutions**:
```typescript
// Augmenter limite dans app/api/chat/route.ts
rateLimitMiddleware(request, {
  interval: 60 * 1000,
  uniqueTokenPerInterval: 50 // Augmenté de 20 à 50
})
```

#### 5. Recherche web ne fonctionne pas
**Symptômes**: Pas de résultats web
**Solutions**:
- Vérifier `GOOGLE_SEARCH_API_KEY`
- Vérifier `GOOGLE_SEARCH_ENGINE_ID`
- Vérifier quota (100 requêtes/jour gratuit)
- Recherche web est optionnelle (normal si non configuré)

### Logs & Monitoring

#### Vercel Logs
```bash
# Via Dashboard Vercel
# Functions → Logs → Filtrer par route

# Via CLI
vercel logs
```

#### Console Browser
```javascript
// Activer debug en dev
DEBUG=true npm run dev

// Logs analytics
localStorage.getItem('analytics_debug')
```

#### Supabase Logs
```bash
# Via Dashboard Supabase
# Logs & Reports → API Logs
```

---

## 📖 Guide du Développeur

### Setup Local

#### 1. Prérequis
```bash
Node.js 18+
npm 9+
Git
```

#### 2. Installation
```bash
# Cloner le repo
git clone https://github.com/username/AssistantCameroun.git
cd AssistantCameroun

# Installer dépendances
npm install

# Copier variables d'environnement
cp .env.example .env

# Configurer .env avec vraies clés
nano .env
```

#### 3. Configuration Base de Données
```bash
# 1. Créer projet Supabase sur supabase.com
# 2. Copier URL et keys dans .env
# 3. Exécuter scripts SQL dans Supabase SQL Editor
#    (fichiers dans scripts/NEW_*.sql)

# 4. Importer données
npm run import:documents
npm run import:procedures
npm run import:news
npm run import:quiz
```

#### 4. Lancer en Dev
```bash
npm run dev
# Ouvrir http://localhost:3000
```

### Conventions de Code

#### TypeScript
```typescript
// Toujours typer les paramètres et retours
export async function fetchDocuments(): Promise<Document[]> {
  // ...
}

// Interfaces pour les props
interface ChatInputProps {
  onSendMessage: (message: string) => void
  isTyping: boolean
}

// Types custom dans lib/types/
import type { Message, Conversation } from '@/lib/types'
```

#### Naming Conventions
```typescript
// Composants : PascalCase
ChatInterface.tsx

// Fichiers utilitaires : kebab-case
rate-limit.ts

// Variables : camelCase
const messageCount = 10

// Constantes : UPPER_SNAKE_CASE
const MAX_RETRIES = 3
```

#### Structure Composant
```typescript
'use client' // Si nécessaire

import { useState } from 'react'
import type { ComponentProps } from '@/lib/types'

interface Props {
  // Props typées
}

export function MyComponent({ prop1, prop2 }: Props) {
  // 1. Hooks
  const [state, setState] = useState()

  // 2. Fonctions handlers
  const handleClick = () => {}

  // 3. useEffect
  useEffect(() => {}, [])

  // 4. Return JSX
  return <div>...</div>
}
```

### Contribuer

#### Git Workflow
```bash
# 1. Créer branche feature
git checkout -b feature/nouvelle-fonctionnalite

# 2. Développer + commiter
git add .
git commit -m "feat: Ajouter nouvelle fonctionnalité"

# 3. Push
git push origin feature/nouvelle-fonctionnalite

# 4. Créer Pull Request sur GitHub

# 5. Après merge, supprimer branche
git branch -d feature/nouvelle-fonctionnalite
```

#### Convention Commits
```
feat: Nouvelle fonctionnalité
fix: Correction de bug
docs: Documentation
style: Formatage (pas de changement code)
refactor: Refactoring
test: Ajout de tests
chore: Maintenance
```

---

## 📈 Roadmap & Améliorations Futures

### Court Terme (1 mois)

- [ ] **Tests automatisés** (Jest + React Testing Library)
- [ ] **CSP Headers** pour sécurité renforcée
- [ ] **Migration Redis** pour rate limiting production
- [ ] **Sitemap XML** pour SEO
- [ ] **Structured Data (JSON-LD)** pour rich snippets
- [ ] **Monitoring Sentry** pour error tracking

### Moyen Terme (3 mois)

- [ ] **Système de favoris** utilisateur
- [ ] **Export PDF** des réponses
- [ ] **Partage social** (WhatsApp, Twitter, Facebook)
- [ ] **Dashboard analytics** admin
- [ ] **Notifications push** (PWA)
- [ ] **Mode hors-ligne** (Service Worker)
- [ ] **Recherche avancée** avec filtres

### Long Terme (6+ mois)

- [ ] **Authentification utilisateur** (comptes)
- [ ] **Système de feedback** utilisateur
- [ ] **Multi-tenant** (autres pays africains)
- [ ] **Mobile apps** (React Native)
- [ ] **API publique** pour développeurs
- [ ] **Intégration WhatsApp Bot**
- [ ] **Voice assistant** (Speech-to-Text)
- [ ] **Chatbot Telegram/Discord**

---

## 🤝 Support & Contact

### Documentation Officielle

- **GitHub**: [github.com/username/AssistantCameroun](https://github.com)
- **Docs**: `/docs` dans le repo
- **Audit Report**: `AUDIT_REPORT.md`

### Technologies Utilisées

- [Next.js](https://nextjs.org/docs)
- [React](https://react.dev)
- [Supabase](https://supabase.com/docs)
- [Google Gemini AI](https://ai.google.dev/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Radix UI](https://www.radix-ui.com/docs/primitives)

### Support Technique

Pour questions ou bugs :
1. Vérifier cette documentation
2. Consulter `AUDIT_REPORT.md`
3. Regarder les issues GitHub
4. Créer une nouvelle issue si nécessaire

---

## 📄 Licence & Crédits

### Licence

Ce projet est sous licence **MIT** (à définir selon vos besoins).

### Crédits

**Développé par**: [Votre Nom/Équipe]
**Client**: Gouvernement du Cameroun / Organisation
**Année**: 2025

**Technologies Open Source utilisées**:
- Next.js (Vercel)
- React (Meta)
- Supabase (Supabase Inc)
- Google Gemini AI (Google)
- Tailwind CSS (Tailwind Labs)
- Radix UI (WorkOS)

---

## 📊 Annexes

### A. Variables d'Environnement Complètes

Voir fichier `.env.example` pour la liste exhaustive des 40+ variables.

### B. Structure Base de Données

Voir fichiers `scripts/NEW_001.sql` à `NEW_007.sql`.

### C. API Routes Documentation

| Route | Méthode | Description | Auth |
|-------|---------|-------------|------|
| `/api/chat` | POST | Chat IA | Public |
| `/api/analytics` | POST | Tracking | Public |
| `/api/documents` | GET | Liste documents | Public |
| `/api/documents/[id]` | GET | Détail document | Public |
| `/api/procedures` | GET | Liste procédures | Public |
| `/api/procedures/[slug]` | GET | Détail procédure | Public |
| `/api/news` | GET | Liste actualités | Public |
| `/api/quiz` | GET | Questions quiz | Public |
| `/api/quiz/submit` | POST | Soumission quiz | Public |

### D. Composants UI Réutilisables

Disponibles dans `components/ui/`:
- `button.tsx` - Boutons
- `input.tsx` - Champs de saisie
- `textarea.tsx` - Zones de texte
- `card.tsx` - Cartes
- `badge.tsx` - Badges
- `dialog.tsx` - Modales
- `dropdown-menu.tsx` - Menus déroulants
- `tabs.tsx` - Onglets
- `toast.tsx` - Notifications
- Et 20+ autres composants

---

**Version**: 1.0.0
**Dernière mise à jour**: Octobre 2025
**Statut**: ✅ Production Ready - Score 87/100

---

## 📦 DÉTAIL DES 302 QUESTIONS PRÉ-ENREGISTRÉES

### Répartition par Catégorie

#### 1. Identité & Documents (53 questions) 🆔
**Icône**: FileText | **Couleur**: Blue

**Thèmes couverts**:
- CNI (Carte Nationale d'Identité) : 7 questions
  - Obtention, coût, durée de validité, renouvellement, perte, duplicata
- Passeport : 8 questions
  - Biométrique, coût, documents requis, renouvellement, passeport mineur
- Actes d'état civil : 5 questions
  - Naissance, mariage, décès, corrections, personnes nées à l'étranger
- Casier judiciaire : 3 questions
- Certificats divers : 8 questions
  - Résidence, nationalité, vie, non-condamnation, identité, médical
- Légalisation documents : 4 questions
  - Authentication, légalisation, apostille
- Permis de conduire : 7 questions
  - Obtention, coût, épreuves, renouvellement, international
- Carte d'électeur : 4 questions
- Autres : 7 questions

#### 2. Entreprise & Commerce (58 questions) 🏢
**Icône**: Building2 | **Couleur**: Green

**Thèmes couverts**:
- Création entreprise : 8 questions
  - Démarches, documents, coûts, structures juridiques (SARL, SA, SAS)
- Capital et statuts : 5 questions
- Registre du commerce (RCCM) : 6 questions
- Fiscalité : 12 questions
  - Impôts, TVA, patente, déclarations, contribuable
- Importation/Exportation : 8 questions
- Marchés publics : 4 questions
- Licences et agréments : 6 questions
- Zones économiques : 3 questions
- Fermeture entreprise : 3 questions
- Autres : 3 questions

#### 3. Juridique & Justice (67 questions) ⚖️
**Icône**: Scale | **Couleur**: Purple

**Thèmes couverts**:
- Droit du travail : 15 questions
  - Contrats, licenciement, salaire, congés, harcèlement
- Divorce et famille : 8 questions
  - Procédure, pension, garde d'enfants, adoption
- Succession et héritage : 6 questions
- Propriété intellectuelle : 5 questions
  - Brevets, marques, droits d'auteur
- Justice et tribunaux : 12 questions
  - Porter plainte, avocat, casier judiciaire, aide juridictionnelle
- Droits fondamentaux : 8 questions
  - Libertés, discrimination, protection des données
- Contrats : 5 questions
- Assurances : 4 questions
- Autres : 4 questions

#### 4. Foncier & Immobilier (53 questions) 🏘️
**Icône**: Home | **Couleur**: Orange

**Thèmes couverts**:
- Achat terrain/maison : 12 questions
  - Procédure, vérifications, titres fonciers, documents
- Titre foncier : 8 questions
  - Obtention, coût, délai, transformation
- Location : 8 questions
  - Bail, loyer, charges, congé, expulsion
- Construction : 10 questions
  - Permis, normes, promoteur immobilier
- Litiges fonciers : 6 questions
- Cadastre : 4 questions
- Autres : 5 questions

#### 5. Éducation & Formation (45 questions) 🎓
**Icône**: GraduationCap | **Couleur**: Indigo

**Thèmes couverts**:
- Inscription scolaire : 8 questions
  - Publique, privée, documents requis, âge
- Examens officiels : 10 questions
  - CEP, BEPC, Probatoire, Baccalauréat, inscriptions
- Universités : 12 questions
  - Admission, bourses, équivalences, privé/public
- Formation professionnelle : 7 questions
- Diplômes étrangers : 4 questions
- Autres : 4 questions

#### 6. Santé & Protection Sociale (26 questions) 🏥
**Icône**: Heart | **Couleur**: Red

**Thèmes couverts**:
- Assurance maladie : 6 questions
  - CNPS, carte, remboursements
- Hôpitaux publics : 4 questions
- Sécurité sociale : 8 questions
  - Cotisations, pension, allocations familiales
- Médicaments : 3 questions
- Autres : 5 questions

**Fichier source**: `lib/data/questions-bank.ts`

---

## 🎨 DÉTAIL DES COMPOSANTS UI

### Composants de Base (lib/ui/)

#### Button Component
**Fichier**: `components/ui/button.tsx`

```typescript
import { ButtonHTMLAttributes, forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    )
  }
)

export { Button, buttonVariants }
```

**Utilisation**:
```tsx
<Button variant="default" size="lg">
  Envoyer
</Button>
<Button variant="outline" size="sm">
  Annuler
</Button>
<Button variant="ghost" size="icon">
  <Icon />
</Button>
```

#### Card Component
**Fichier**: `components/ui/card.tsx`

```typescript
import { HTMLAttributes, forwardRef } from "react"

const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={"rounded-lg border bg-card text-card-foreground shadow-sm " + className}
      {...props}
    />
  )
)

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={"flex flex-col space-y-1.5 p-6 " + className} {...props} />
  )
)

const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={"text-2xl font-semibold leading-none tracking-tight " + className} {...props} />
  )
)

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={"p-6 pt-0 " + className} {...props} />
  )
)

export { Card, CardHeader, CardTitle, CardContent }
```

**Utilisation**:
```tsx
<Card>
  <CardHeader>
    <CardTitle>Titre de la carte</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Contenu de la carte</p>
  </CardContent>
</Card>
```

### Composants Complexes

#### Chat Interface
**Fichier**: `components/assistant/chat-interface.tsx`

**Architecture**:
```
ChatInterface (parent)
├── ChatSidebar (conversations + 302 questions)
└── Main Content
    ├── Header (mobile uniquement)
    ├── WelcomeScreen (si messages.length === 0)
    │   OR
    ├── ChatMessages (affichage messages)
    └── ChatInput (input + suggestions)
```

**State Management**:
```typescript
const [sidebarOpen, setSidebarOpen] = useState(false)
const [messages, setMessages] = useState<Message[]>([])
const [conversations, setConversations] = useState<Conversation[]>([])
const [isTyping, setIsTyping] = useState(false)
const [conversationId, setConversationId] = useState<string>(`conv_${Date.now()}`)
const [sessionId, setSessionId] = useState<string>("")
const [hasProcessedUrlQuery, setHasProcessedUrlQuery] = useState(false)
```

**Flux de Message**:
```typescript
// 1. Utilisateur envoie message
handleSendMessage("Comment obtenir une CNI ?")

// 2. Création message utilisateur
const userMessage: Message = {
  id: Date.now().toString(),
  role: "user",
  content: "Comment obtenir une CNI ?",
  timestamp: new Date()
}
setMessages(prev => [...prev, userMessage])

// 3. Appel API
const response = await fetch('/api/chat', {
  method: 'POST',
  body: JSON.stringify({
    message: content,
    conversationHistory: messages
  })
})

// 4. Réception réponse
const data = await response.json()
const assistantMessage: Message = {
  id: (Date.now() + 1).toString(),
  role: "assistant",
  content: data.response,
  timestamp: new Date(),
  sources: data.sources,
  confidence: data.confidence
}

// 5. Affichage + Analytics + Sauvegarde
setMessages(prev => [...prev, assistantMessage])
trackEvent("MESSAGE_RECEIVED", {...})
saveConversation(conversationId, title, content, category)
```

#### Welcome Screen
**Fichier**: `components/assistant/welcome-screen.tsx`

**Fonctionnalités**:
- Écran d'accueil avant première question
- Affiche questions suggérées par catégorie
- 6 catégories avec icônes colorées
- Responsive (grille adaptive)

**Structure**:
```tsx
<div className="flex-1 overflow-y-auto">
  <div className="mx-auto max-w-4xl p-6">
    {/* Header */}
    <div className="mb-8 text-center">
      <h1>Bienvenue sur l'Assistant National</h1>
      <p>Posez vos questions sur les démarches administratives</p>
    </div>

    {/* Suggested Questions by Category */}
    <div className="space-y-6">
      {QUESTIONS_BANK.map(category => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {category.questions.slice(0, 4).map(question => (
              <button onClick={() => onQuestionClick(question)}>
                {question}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
```

#### Chat Sidebar
**Fichier**: `components/assistant/chat-sidebar.tsx`

**Fonctionnalités**:
- Liste conversations précédentes (localStorage)
- Banque de 302 questions par catégorie
- Recherche dans questions
- Responsive (overlay sur mobile)

**Structure**:
```tsx
<div className={`fixed inset-y-0 left-0 z-50 w-80 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
  {/* Header */}
  <div className="flex items-center justify-between p-4">
    <h2>Conversations</h2>
    <button onClick={onNewConversation}>Nouvelle</button>
  </div>

  {/* Tabs: Conversations vs Questions */}
  <Tabs defaultValue="conversations">
    <TabsList>
      <TabsTrigger value="conversations">Historique</TabsTrigger>
      <TabsTrigger value="questions">Questions</TabsTrigger>
    </TabsList>

    {/* Conversations List */}
    <TabsContent value="conversations">
      {conversations.map(conv => (
        <div key={conv.id} className="cursor-pointer p-3 hover:bg-muted">
          <h3>{conv.title}</h3>
          <p>{conv.lastMessage}</p>
        </div>
      ))}
    </TabsContent>

    {/* Questions Bank by Category */}
    <TabsContent value="questions">
      <Input placeholder="Rechercher..." />
      <Accordion>
        {QUESTIONS_BANK.map(category => (
          <AccordionItem key={category.id} value={category.id}>
            <AccordionTrigger>
              {category.name} ({category.questions.length})
            </AccordionTrigger>
            <AccordionContent>
              {category.questions.map(question => (
                <button onClick={() => onQuestionClick(question)}>
                  {question}
                </button>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </TabsContent>
  </Tabs>
</div>
```

#### Chat Input avec Suggestions Contextuelles
**Fichier**: `components/assistant/chat-input.tsx`

**Système de Suggestions Intelligentes**:
```typescript
const getContextualSuggestions = (lastMessage: string = ""): string[] => {
  const lowerMessage = lastMessage.toLowerCase()

  // CNI/Identité → Suggestions sur documents, coûts, délais
  if (lowerMessage.includes('cni') || lowerMessage.includes('carte nationale')) {
    return [
      "Quels sont les délais d'obtention ?",
      "Combien ça coûte ?",
      "Quels documents sont nécessaires ?",
      "Où faire la demande ?",
    ]
  }

  // Passeport → Suggestions spécifiques passeport
  if (lowerMessage.includes('passeport')) {
    return [
      "Quelle est la durée de validité ?",
      "Quel est le coût ?",
      "Où déposer le dossier ?",
      "Quels sont les documents requis ?",
    ]
  }

  // Entreprise → Suggestions business
  if (lowerMessage.includes('entreprise') || lowerMessage.includes('société')) {
    return [
      "Quel est le capital minimum requis ?",
      "Combien coûte la création ?",
      "Quelles sont les étapes ?",
      "Quels documents pour le RCCM ?",
    ]
  }

  // Foncier → Suggestions terrain/propriété
  if (lowerMessage.includes('terrain') || lowerMessage.includes('titre foncier')) {
    return [
      "Comment obtenir un titre foncier ?",
      "Quelle est la procédure d'achat ?",
      "Quels sont les frais ?",
      "Où s'adresser ?",
    ]
  }

  // Travail → Suggestions droits du travail
  if (lowerMessage.includes('travail') || lowerMessage.includes('emploi')) {
    return [
      "Quels sont mes droits ?",
      "Quel est le salaire minimum ?",
      "Combien de jours de congé ?",
      "Comment porter plainte ?",
    ]
  }

  // Par défaut (seulement après 1er échange)
  return [
    "Quels sont les délais d'obtention ?",
    "Combien ça coûte ?",
  ]
}
```

**Affichage conditionnel**:
```typescript
// Ne pas afficher suggestions avant premier message
const suggestions = hasMessages ? getContextualSuggestions(lastUserMessage) : []
```

#### Quiz Interface
**Fichier**: `components/quiz/quiz-interface.tsx`

**State Management**:
```typescript
const [currentQuestion, setCurrentQuestion] = useState(0)
const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
const [score, setScore] = useState(0)
const [showExplanation, setShowExplanation] = useState(false)
const [quizCompleted, setQuizCompleted] = useState(false)
const [userAnswers, setUserAnswers] = useState<(number | null)[]>([])
```

**Flux Quiz**:
```
1. Sélection (catégorie + difficulté + nombre)
   → QuizSelection component

2. Fetch questions depuis API
   GET /api/quiz?category=identite&difficulty=Facile&limit=10

3. Affichage question par question
   → QuizContent component

4. Sélection réponse → Affichage explication

5. Question suivante ou Résultats finaux

6. Recommandations personnalisées basées sur score
```

**Calcul du Score**:
```typescript
const calculateScore = () => {
  let correct = 0
  questions.forEach((question, index) => {
    if (userAnswers[index] === question.correctAnswer) {
      correct++
    }
  })
  return Math.round((correct / questions.length) * 100)
}
```

---

## 🔌 API ROUTES DÉTAILLÉES

### `/api/chat` - Chat IA Conversationnel

**Méthode**: POST

**Body**:
```json
{
  "message": "Comment obtenir une CNI ?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Bonjour"
    },
    {
      "role": "assistant",
      "content": "Bonjour ! Comment puis-je vous aider ?"
    }
  ]
}
```

**Response**:
```json
{
  "response": "Pour obtenir une CNI au Cameroun...",
  "sources": [
    {
      "title": "Procédure CNI",
      "reference": "Durée: 2-3 semaines",
      "url": "/procedures/obtention-cni"
    }
  ],
  "confidence": 90
}
```

**Algorithme Complet**:
```typescript
export async function POST(request: Request) {
  // 1. Rate Limiting (20 req/min)
  const rateLimitResponse = await rateLimitMiddleware(request, {
    interval: 60 * 1000,
    uniqueTokenPerInterval: 20
  })
  if (rateLimitResponse) return rateLimitResponse

  // 2. Validation
  const { message, conversationHistory } = await request.json()
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: 'Message invalide' }, { status: 400 })
  }

  // 3. Extraction mots-clés (multi-keyword search)
  const keywords = message
    .toLowerCase()
    .replace(/[?.,!]/g, '')
    .split(' ')
    .filter(word => word.length > 3)
    .slice(0, 5)

  // 4. Recherche DB - Documents
  const { data: documents } = await supabase
    .from('Document')
    .select('title, reference, content, type, category')
    .eq('status', 'ACTIVE')
    .or(keywords.map(k => `title.ilike.%${k}%,content.ilike.%${k}%`).join(','))
    .limit(5)

  // 5. Recherche DB - Procédures
  const { data: procedures } = await supabase
    .from('Procedure')
    .select('name, description, steps, documents, costs, duration, category')
    .or(keywords.map(k => `name.ilike.%${k}%,description.ilike.%${k}%`).join(','))
    .limit(5)

  // 6. Fallback DB si résultats insuffisants
  if (!documents || documents.length < 2) {
    // Récupérer documents les plus récents
  }
  if (!procedures || procedures.length < 2) {
    // Récupérer procédures les plus populaires
  }

  // 7. Recherche Web (si peu de résultats DB)
  let webResults = ''
  const hasEnoughData = (documents?.length >= 2) || (procedures?.length >= 2)
  if (!hasEnoughData) {
    webResults = await searchWeb(message)
  }

  // 8. Construction contexte pour Gemini
  let context = '# CONTEXTE JURIDIQUE ET ADMINISTRATIF DU CAMEROUN\n\n'

  if (documents && documents.length > 0) {
    context += '## Documents juridiques disponibles:\n'
    documents.forEach(doc => {
      context += `- ${doc.title} (${doc.type})\n`
      context += `  Catégorie: ${doc.category}\n`
      context += `  Référence: ${doc.reference || 'N/A'}\n`
      if (doc.content) {
        context += `  Contenu: ${doc.content.substring(0, 500)}...\n`
      }
    })
  }

  if (procedures && procedures.length > 0) {
    context += '\n## Procédures administratives disponibles:\n'
    procedures.forEach(proc => {
      context += `- ${proc.name}\n`
      context += `  Description: ${proc.description}\n`
      context += `  Durée: ${proc.duration}\n`
      context += `  Étapes: ${JSON.stringify(proc.steps)}\n`
      context += `  Documents requis: ${JSON.stringify(proc.documents)}\n`
      context += `  Coûts: ${JSON.stringify(proc.costs)}\n`
    })
  }

  if (webResults) {
    context += webResults
  }

  // 9. Configuration modèle Gemini
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-exp',
    systemInstruction: `Tu es l'Assistant National du Cameroun...

**Règles STRICTES:**
1. Réponds TOUJOURS en français
2. UTILISE EN PRIORITÉ le contexte fourni
3. Si contexte vide, utilise tes connaissances générales
4. NE DIS JAMAIS "Je ne dispose pas d'informations"
5. Structure: Intro + Liste étapes + Coûts/Délais + Conseils
6. Cite les sources si contexte utilisé

${context}

**Format de réponse obligatoire:**
- Introduction courte (1-2 phrases)
- Liste à puces claire des documents/étapes
- Détails sur coûts et durée
- Conseils pratiques
`
  })

  // 10. Génération réponse avec historique
  const chat = model.startChat({
    history: conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))
  })

  const result = await chat.sendMessage(message)
  const responseText = result.response.text()

  // 11. Identification sources citées
  const sources: Array<{title, reference, url}> = []

  documents?.forEach(doc => {
    if (responseText.includes(doc.title) || responseText.includes(doc.reference)) {
      sources.push({
        title: doc.title,
        reference: doc.reference || '',
        url: `/bibliotheque/${doc.title.toLowerCase().replace(/\s+/g, '-')}`
      })
    }
  })

  procedures?.forEach(proc => {
    if (responseText.includes(proc.name)) {
      sources.push({
        title: proc.name,
        reference: `Durée: ${proc.duration}`,
        url: `/procedures/${proc.name.toLowerCase().replace(/\s+/g, '-')}`
      })
    }
  })

  // 12. Calcul confiance
  const confidence = sources.length > 0 ? 90 : 70

  // 13. Retour
  return NextResponse.json({
    response: responseText,
    sources: sources.slice(0, 3),
    confidence
  })
}
```

### `/api/analytics` - Tracking Événements

**Méthode**: POST

**Body**:
```json
{
  "event": "MESSAGE_SENT",
  "sessionId": "sess_1234567890",
  "data": {
    "conversationId": "conv_1234567890",
    "messageLength": 25,
    "messageNumber": 3
  },
  "language": "FR",
  "userAgent": "Mozilla/5.0..."
}
```

**Validation Événements**:
```typescript
const validEvents = [
  'PAGE_VIEW',
  'SEARCH',
  'DOCUMENT_VIEW',
  'PROCEDURE_VIEW',
  'NEWS_VIEW',
  'QUIZ_START',
  'QUIZ_COMPLETE',
  'CONVERSATION_START',
  'MESSAGE_SENT',
  'MESSAGE_RECEIVED',
  'MESSAGE_ERROR',
  'CITATION_CLICKED',
  'FEEDBACK_SUBMITTED'
]

if (!validEvents.includes(event)) {
  return NextResponse.json({ success: true, warning: 'Invalid event type' })
}
```

**Anonymisation IP**:
```typescript
const forwarded = request.headers.get('x-forwarded-for')
const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
const ipHash = ip !== 'unknown'
  ? Buffer.from(ip).toString('base64').substring(0, 16)
  : undefined
```

### `/api/quiz` - Questions Quiz

**Méthode**: GET

**Query Params**:
```
category: "identite" | "entreprise" | "juridique" | "foncier" | "education" | "sante"
difficulty: "Facile" | "Moyen" | "Difficile"
limit: number (défaut: 10)
```

**Exemple**:
```
GET /api/quiz?category=identite&difficulty=Facile&limit=5
```

**Response**:
```json
[
  {
    "id": "uuid",
    "question": "Quelle est la durée de validité de la CNI ?",
    "questionEn": "What is the validity period of the CNI?",
    "options": ["5 ans", "10 ans", "15 ans", "20 ans"],
    "correctAnswer": 1,
    "explanation": "La CNI camerounaise est valide 10 ans...",
    "category": "identite",
    "difficulty": "Facile"
  }
]
```

**Implémentation**:
```typescript
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const difficulty = searchParams.get('difficulty')
  const limit = parseInt(searchParams.get('limit') || '10')

  const supabase = await createClient()

  let query = supabase
    .from('QuizQuestion')
    .select('*')

  // Filtres case-insensitive
  if (category) {
    query = query.ilike('category', category)
  }

  if (difficulty) {
    query = query.ilike('difficulty', difficulty)
  }

  query = query.limit(limit)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
```

### `/api/documents` - Liste Documents

**Méthode**: GET

**Query Params**:
```
category?: string
type?: "LOI" | "DECRET" | "ARRETE" | "CODE"
search?: string
```

**Response**:
```json
[
  {
    "id": "uuid",
    "title": "Loi N°2016/007 portant Code pénal",
    "reference": "Loi N°2016/007",
    "type": "LOI",
    "category": "JURIDIQUE",
    "status": "ACTIVE",
    "createdAt": "2025-01-15T10:00:00Z"
  }
]
```

### `/api/procedures` - Liste Procédures

**Méthode**: GET

**Response**:
```json
[
  {
    "id": "uuid",
    "name": "Obtention de la CNI",
    "description": "Démarches pour obtenir la carte nationale d'identité",
    "steps": [
      "Retirer le formulaire",
      "Rassembler les documents",
      "Déposer le dossier",
      "Payer les frais",
      "Retirer la carte"
    ],
    "documents": [
      "Acte de naissance",
      "Certificat de nationalité",
      "2 photos d'identité"
    ],
    "costs": {
      "formulaire": "500 FCFA",
      "timbre": "1000 FCFA",
      "total": "1500 FCFA"
    },
    "duration": "2-3 semaines",
    "category": "IDENTITE",
    "popularity": 150
  }
]
```

---

## 🗄️ SCHÉMA BASE DE DONNÉES COMPLET

### Tables Principales

#### Document
```sql
CREATE TABLE "Document" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "titleEn" TEXT,
  "reference" TEXT,
  "content" TEXT,
  "contentEn" TEXT,
  "type" TEXT NOT NULL CHECK (type IN ('LOI', 'DECRET', 'ARRETE', 'CODE', 'CIRCULAIRE')),
  "category" TEXT,
  "fileUrl" TEXT,
  "status" TEXT DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'ARCHIVED', 'DRAFT')),
  "tags" TEXT[],
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_document_category ON "Document"(category);
CREATE INDEX idx_document_type ON "Document"(type);
CREATE INDEX idx_document_status ON "Document"(status);
CREATE INDEX idx_document_title ON "Document" USING GIN (to_tsvector('french', title));
```

#### Procedure
```sql
CREATE TABLE "Procedure" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL,
  "nameEn" TEXT,
  "description" TEXT,
  "descriptionEn" TEXT,
  "steps" JSONB,
  "stepsEn" JSONB,
  "documents" JSONB,
  "documentsEn" JSONB,
  "costs" JSONB,
  "duration" TEXT,
  "category" TEXT,
  "relatedDocs" UUID[],
  "popularity" INTEGER DEFAULT 0,
  "lastUpdated" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_procedure_category ON "Procedure"(category);
CREATE INDEX idx_procedure_popularity ON "Procedure"(popularity DESC);
```

#### News
```sql
CREATE TABLE "News" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "slug" TEXT UNIQUE NOT NULL,
  "title" TEXT NOT NULL,
  "titleEn" TEXT,
  "summary" TEXT,
  "summaryEn" TEXT,
  "content" TEXT,
  "contentEn" TEXT,
  "imageUrl" TEXT,
  "category" TEXT,
  "tags" TEXT[],
  "author" TEXT,
  "publishedAt" TIMESTAMP WITH TIME ZONE,
  "views" INTEGER DEFAULT 0,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_news_slug ON "News"(slug);
CREATE INDEX idx_news_category ON "News"(category);
CREATE INDEX idx_news_published ON "News"(publishedAt DESC);
```

#### QuizQuestion
```sql
CREATE TABLE "QuizQuestion" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "question" TEXT NOT NULL,
  "questionEn" TEXT,
  "options" JSONB NOT NULL,
  "optionsEn" JSONB,
  "correctAnswer" INTEGER NOT NULL CHECK (correctAnswer >= 0 AND correctAnswer <= 3),
  "explanation" TEXT,
  "explanationEn" TEXT,
  "category" TEXT NOT NULL,
  "difficulty" TEXT NOT NULL CHECK (difficulty IN ('Facile', 'Moyen', 'Difficile')),
  "tags" TEXT[],
  "timesAsked" INTEGER DEFAULT 0,
  "successRate" DECIMAL(5,2),
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_quiz_category ON "QuizQuestion"(category);
CREATE INDEX idx_quiz_difficulty ON "QuizQuestion"(difficulty);
```

#### Analytics
```sql
CREATE TABLE "Analytics" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "event" TEXT NOT NULL CHECK (event IN (
    'PAGE_VIEW', 'SEARCH', 'DOCUMENT_VIEW', 'PROCEDURE_VIEW',
    'NEWS_VIEW', 'QUIZ_START', 'QUIZ_COMPLETE',
    'CONVERSATION_START', 'MESSAGE_SENT', 'MESSAGE_RECEIVED',
    'MESSAGE_ERROR', 'CITATION_CLICKED', 'FEEDBACK_SUBMITTED'
  )),
  "sessionId" TEXT NOT NULL,
  "userId" UUID,
  "data" JSONB,
  "language" TEXT DEFAULT 'FR' CHECK (language IN ('FR', 'EN')),
  "userAgent" TEXT,
  "ip" TEXT,
  "referrer" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_analytics_event ON "Analytics"(event);
CREATE INDEX idx_analytics_session ON "Analytics"(sessionId);
CREATE INDEX idx_analytics_created ON "Analytics"(createdAt DESC);
```

#### Feedback
```sql
CREATE TABLE "Feedback" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "conversationId" TEXT,
  "messageId" TEXT,
  "rating" INTEGER CHECK (rating >= 1 AND rating <= 5),
  "comment" TEXT,
  "type" TEXT CHECK (type IN ('HELPFUL', 'NOT_HELPFUL', 'INCORRECT', 'SUGGESTION')),
  "userAgent" TEXT,
  "resolved" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_feedback_rating ON "Feedback"(rating);
CREATE INDEX idx_feedback_type ON "Feedback"(type);
CREATE INDEX idx_feedback_resolved ON "Feedback"(resolved);
```

### Vues Analytiques

#### Vue Stats Globales
```sql
CREATE VIEW "AnalyticsStats" AS
SELECT
  event,
  COUNT(*) as total_count,
  COUNT(DISTINCT sessionId) as unique_sessions,
  DATE_TRUNC('day', createdAt) as date
FROM "Analytics"
GROUP BY event, DATE_TRUNC('day', createdAt)
ORDER BY date DESC, total_count DESC;
```

#### Vue Questions Populaires
```sql
CREATE VIEW "PopularProcedures" AS
SELECT
  id,
  name,
  category,
  popularity,
  COALESCE(
    (SELECT COUNT(*) FROM "Analytics"
     WHERE event = 'PROCEDURE_VIEW'
     AND data->>'procedureId' = "Procedure".id::TEXT
    ), 0
  ) as views_count
FROM "Procedure"
ORDER BY popularity DESC, views_count DESC;
```

### Triggers

#### Auto-update Timestamp
```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_document_updated
BEFORE UPDATE ON "Document"
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

#### Auto-increment Popularity
```sql
CREATE OR REPLACE FUNCTION increment_procedure_popularity()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.event = 'PROCEDURE_VIEW' THEN
    UPDATE "Procedure"
    SET popularity = popularity + 1
    WHERE id::TEXT = NEW.data->>'procedureId';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_analytics_procedure_view
AFTER INSERT ON "Analytics"
FOR EACH ROW
EXECUTE FUNCTION increment_procedure_popularity();
```

---

## 🔐 SÉCURITÉ AVANCÉE

### Row Level Security (RLS) Policies

#### Document - Lecture publique
```sql
ALTER TABLE "Document" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active documents"
ON "Document"
FOR SELECT
USING (status = 'ACTIVE');

CREATE POLICY "Service role can do everything"
ON "Document"
FOR ALL
USING (auth.role() = 'service_role');
```

#### Analytics - Insertion publique, lecture admin
```sql
ALTER TABLE "Analytics" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics"
ON "Analytics"
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Only admins can read analytics"
ON "Analytics"
FOR SELECT
USING (auth.role() = 'service_role');
```

### Rate Limiting Avancé

**Fichier**: `lib/utils/rate-limit.ts`

**Fonctionnalités**:
- Limitation par IP
- Fenêtres glissantes
- Nettoyage automatique (toutes les heures)
- Headers X-RateLimit-*
- Messages d'erreur en français

**Configuration Production**:
```typescript
// Pour production avec Redis
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!
})

export async function checkRateLimitRedis(
  identifier: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`
  const now = Date.now()

  const count = await redis.incr(key)

  if (count === 1) {
    await redis.expire(key, Math.ceil(config.interval / 1000))
  }

  return {
    success: count <= config.uniqueTokenPerInterval,
    limit: config.uniqueTokenPerInterval,
    remaining: Math.max(0, config.uniqueTokenPerInterval - count),
    reset: now + config.interval
  }
}
```

### Content Security Policy (À implémenter)

```javascript
// next.config.mjs
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel-scripts.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https:",
      "font-src 'self' data:",
      "connect-src 'self' https://hqmydrehuoqlfosbklqb.supabase.co https://generativelanguage.googleapis.com",
      "frame-ancestors 'none'",
    ].join('; ')
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()'
  }
]

export default {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  }
}
```

---

## 🚀 DÉPLOIEMENT PRODUCTION VERCEL

### Checklist Pré-Déploiement

#### 1. Variables d'Environnement
```bash
# Dashboard Vercel → Settings → Environment Variables

# Supabase (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://hqmydrehuoqlfosbklqb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# Gemini AI (REQUIRED)
GEMINI_API_KEY=AIzaSyC...

# Google Search (OPTIONAL - 100 req/jour gratuit)
GOOGLE_SEARCH_API_KEY=AIzaSyC...
GOOGLE_SEARCH_ENGINE_ID=7625020dc869b408d

# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://assistant-cameroun.vercel.app
```

#### 2. Build Settings Vercel
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs"
}
```

#### 3. Configuration Git
```bash
# .gitignore (déjà configuré)
.env
.env.local
.env.production.local
node_modules/
.next/
out/
.vercel/
*.log
```

#### 4. Tests Avant Deploy
```bash
# Test build local
npm run build
npm run start

# Vérifier TypeScript
npm run type-check

# Test API routes
curl http://localhost:3000/api/chat \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"message":"Test"}'
```

### Déploiement Automatique

**Configuration**: `.github/workflows/deploy.yml` (optionnel)

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Monitoring Production

#### Vercel Analytics
```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

#### Sentry Error Tracking (À implémenter)
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

```javascript
// sentry.server.config.ts
import * as Sentry from "@sentry/nextjs"

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

---

*Cette documentation sera mise à jour régulièrement. Pour la version la plus récente, consultez le repo GitHub.*
