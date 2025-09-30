# 🇨🇲 Assistant National du Cameroun

> Votre guide intelligent pour naviguer au Cameroun - Droit, procédures administratives, culture et actualités

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app)

## 📋 Vue d'ensemble

**Assistant National du Cameroun** est une plateforme web intelligente propulsée par l'IA qui aide les citoyens camerounais à :

- 🤖 **Dialoguer avec l'IA** : Posez vos questions en français ou anglais et obtenez des réponses précises avec sources juridiques
- 📚 **Consulter la bibliothèque juridique** : Accédez aux codes, lois, décrets et documents officiels
- 📋 **Suivre les procédures** : Guides pas-à-pas pour CNI, passeport, actes administratifs, création d'entreprise, etc.
- 📰 **S'informer de l'actualité** : Actualités camerounaises pertinentes et analysées
- 🎮 **Tester ses connaissances** : Quiz éducatifs sur le droit et la culture camerounaise
- 🌍 **Découvrir la culture** : Histoire, traditions, géographie, langues locales

## ✨ Fonctionnalités

### Interface Utilisateur
- ✅ Chat conversationnel avec l'IA (français/anglais)
- ✅ Historique des conversations
- ✅ Citations des sources avec références juridiques
- ✅ Score de confiance des réponses
- ✅ Suggestions de questions contextuelles
- ✅ Mode sombre/clair
- ✅ Design responsive (mobile, tablet, desktop)

### Backend & IA
- 🔄 **En cours d'implémentation**
- Intégration Gemini 2.0 Flash (1M tokens context)
- Système RAG (Retrieval-Augmented Generation) avec embeddings
- Recherche sémantique vectorielle (pgvector)
- Extraction automatique de PDFs juridiques
- Crawling automatique d'actualités
- Cache Redis pour performances
- Rate limiting et gestion des quotas

### Administration
- 🔄 **À implémenter** (voir [BACKOFFICE_PROMPT.md](./BACKOFFICE_PROMPT.md))
- Dashboard complet de monitoring
- Gestion des documents et procédures
- Modération des conversations
- Analytics en temps réel
- Gestion des embeddings et performance IA

## 🏗️ Architecture Technique

### Frontend
```
Next.js 14.2.16 (App Router)
├── TypeScript 5
├── Tailwind CSS 4.1.9
├── shadcn/ui + Radix UI
├── React Hook Form + Zod
├── Supabase (Auth & DB)
└── Vercel Analytics
```

### Backend (Planifié)
```
Express.js + TypeScript
├── Prisma ORM
├── PostgreSQL + pgvector
├── Redis (cache & queues)
├── BullMQ (jobs)
├── Gemini 2.0 Flash API
└── Puppeteer (scraping)
```

### Infrastructure
- **Frontend** : Vercel
- **Backend** : Railway
- **Database** : Supabase PostgreSQL
- **Cache/Queue** : Upstash Redis
- **Storage** : Cloudinary (PDFs)
- **Monitoring** : Sentry + Vercel Analytics

## 🚀 Installation

### Prérequis
- Node.js 20 LTS ou supérieur
- pnpm 9.0+ (recommandé)
- Compte Supabase
- Compte Vercel (optionnel)
- Clé API Gemini (gratuite)

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/AssistantCameroun.git
cd AssistantCameroun
```

### 2. Installer les dépendances

```bash
pnpm install
```

### 3. Configuration des variables d'environnement

Créer un fichier `.env.local` à la racine du projet :

```bash
cp .env.example .env.local
```

Remplir les variables (voir [.env.example](./.env.example) pour la liste complète)

### 4. Setup de la base de données

```bash
# Créer les tables dans Supabase
# Exécuter les scripts dans /scripts/ dans l'ordre :
# - 001_create_tables.sql
# - 002_seed_documents.sql
# - 003_seed_procedures.sql
# - 004_seed_news.sql
# - 005_seed_quiz.sql
```

Utilisez le SQL Editor dans votre dashboard Supabase ou la CLI :

```bash
supabase db push
```

### 5. Lancer le serveur de développement

```bash
pnpm dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000)

## 📁 Structure du Projet

```
AssistantCameroun/
├── app/                        # Routes Next.js (App Router)
│   ├── assistant/              # Interface chat IA
│   ├── actualites/             # Actualités
│   ├── bibliotheque/           # Documents juridiques
│   ├── procedures/             # Procédures administratives
│   ├── quiz/                   # Quiz éducatifs
│   ├── layout.tsx              # Layout principal
│   └── page.tsx                # Page d'accueil
│
├── components/                 # Composants React
│   ├── assistant/              # Chat (ChatInterface, etc.)
│   ├── home/                   # Sections homepage
│   ├── library/                # Bibliothèque
│   ├── news/                   # Actualités
│   ├── procedures/             # Procédures
│   ├── quiz/                   # Quiz
│   ├── ui/                     # shadcn/ui components
│   ├── header.tsx
│   └── footer.tsx
│
├── lib/                        # Utilitaires
│   ├── supabase/               # Config Supabase
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── types/                  # Types TypeScript
│   ├── constants.tsx           # Constantes
│   └── utils.ts
│
├── scripts/                    # Scripts SQL
│   ├── 001_create_tables.sql
│   ├── 002_seed_documents.sql
│   ├── 003_seed_procedures.sql
│   ├── 004_seed_news.sql
│   └── 005_seed_quiz.sql
│
├── public/                     # Assets statiques
│   └── *.jpg
│
├── ARCHITECTURE.md             # Documentation architecture complète
├── BACKOFFICE_PROMPT.md        # Prompt pour créer le backoffice
└── README.md                   # Ce fichier
```

## 🎯 Domaines Couverts

1. **Droit & Justice** : Droit pénal, civil, du travail, procédures judiciaires
2. **Procédures administratives** : CNI, passeport, actes de naissance, documents
3. **Entreprises & Commerce** : Création d'entreprise, fiscalité, réglementation
4. **Foncier & Propriété** : Titres fonciers, baux, transactions immobilières
5. **Éducation & Culture** : Système éducatif, bourses, patrimoine culturel
6. **Santé & Social** : Système de santé, protection sociale, aide

## 🔧 Commandes Utiles

```bash
# Développement
pnpm dev              # Lancer le serveur de développement

# Build
pnpm build            # Créer le build de production
pnpm start            # Lancer le serveur de production

# Linting & Formatting
pnpm lint             # Vérifier le code avec ESLint

# Base de données (si backend implémenté)
npx prisma studio     # Interface visuelle pour la DB
npx prisma migrate dev # Créer/appliquer migrations
npx prisma db seed    # Seed la base de données
```

## 🌐 Déploiement

### Déploiement sur Vercel (Frontend)

1. Connecter votre repository GitHub à Vercel
2. Configurer les variables d'environnement dans Vercel Dashboard
3. Déployer automatiquement à chaque push sur `main`

### Déploiement sur Railway (Backend - à venir)

Documentation à compléter lors de l'implémentation du backend

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add: amazing feature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Conventions de code

- **Fichiers** : kebab-case (ex: `chat-interface.tsx`)
- **Composants React** : PascalCase (ex: `ChatInterface`)
- **Fonctions** : camelCase (ex: `sendMessage`)
- **Constantes** : UPPER_SNAKE_CASE (ex: `API_URL`)
- **Types/Interfaces** : PascalCase avec préfixe `I` (ex: `IMessage`)

## 📖 Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture détaillée du système
- [BACKOFFICE_PROMPT.md](./BACKOFFICE_PROMPT.md) - Spécifications du backoffice admin
- [.env.example](./.env.example) - Variables d'environnement requises

## 🔒 Sécurité

- Toutes les routes `/admin/*` sont protégées par authentification
- Rate limiting sur l'API
- Validation stricte avec Zod
- Sanitization des inputs utilisateur
- Pas d'exposition de clés API côté client
- Audit trail pour toutes les actions admin

## 📊 Roadmap

### Phase 1 : Frontend (✅ Complété)
- [x] Interface utilisateur complète
- [x] Composants chat
- [x] Pages bibliothèque, procédures, actualités, quiz
- [x] Integration Supabase basique

### Phase 2 : Backend & IA (🔄 En cours)
- [ ] API Express.js + Prisma
- [ ] Intégration Gemini 2.0 Flash
- [ ] Système RAG avec embeddings
- [ ] Extraction PDFs juridiques
- [ ] Crawling automatique actualités
- [ ] Cache Redis & jobs BullMQ

### Phase 3 : Backoffice (📋 Planifié)
- [ ] Dashboard admin complet
- [ ] Gestion documents & procédures
- [ ] Monitoring temps réel
- [ ] Analytics avancées
- [ ] Modération conversations

### Phase 4 : Améliorations (🔮 Futur)
- [ ] Application mobile (React Native)
- [ ] Recherche vocale
- [ ] Notifications push
- [ ] Mode hors-ligne
- [ ] Intégration WhatsApp/Telegram

## 📜 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

## 🙏 Remerciements

- [v0.dev](https://v0.app) pour la génération de composants UI
- [shadcn/ui](https://ui.shadcn.com) pour les composants
- [Supabase](https://supabase.com) pour le backend
- [Google Gemini](https://ai.google.dev) pour l'IA
- La communauté open-source

## 📞 Contact

Pour toute question ou suggestion :

- Email : [votre-email@example.com](mailto:votre-email@example.com)
- GitHub Issues : [github.com/votre-username/AssistantCameroun/issues](https://github.com/votre-username/AssistantCameroun/issues)

---

**Made with ❤️ for Cameroon** 🇨🇲