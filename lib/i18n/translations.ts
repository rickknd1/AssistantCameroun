export type Language = 'fr' | 'en'

export interface Translations {
  // Header
  'header.home': string
  'header.assistant': string
  'header.library': string
  'header.procedures': string
  'header.news': string
  'header.quiz': string
  'header.infos': string
  'header.changeLanguage': string
  'header.changeTheme': string
  'header.menu': string

  // Home Page - Hero Section
  'home.hero.title': string
  'home.hero.subtitle': string
  'home.hero.description': string
  'home.hero.searchPlaceholder': string
  'home.hero.availability': string
  'home.hero.floating.cniObtained': string
  'home.hero.floating.inSteps': string
  'home.hero.floating.questionResolved': string
  'home.hero.floating.inMinutes': string

  // Home Page - Quick Categories
  'home.quickCategories.procedures': string
  'home.quickCategories.proceduresDesc': string
  'home.quickCategories.legal': string
  'home.quickCategories.legalDesc': string
  'home.quickCategories.culture': string
  'home.quickCategories.cultureDesc': string

  // Home Page - How It Works
  'home.howItWorks.title': string
  'home.howItWorks.subtitle': string
  'home.howItWorks.step1.title': string
  'home.howItWorks.step1.description': string
  'home.howItWorks.step2.title': string
  'home.howItWorks.step2.description': string
  'home.howItWorks.step3.title': string
  'home.howItWorks.step3.description': string

  // Home Page - Domains Section
  'home.domains.title': string
  'home.domains.subtitle': string
  'home.domains.learnMore': string
  'home.domains.lawJustice.title': string
  'home.domains.lawJustice.description': string
  'home.domains.adminProcedures.title': string
  'home.domains.adminProcedures.description': string
  'home.domains.businessCommerce.title': string
  'home.domains.businessCommerce.description': string
  'home.domains.landProperty.title': string
  'home.domains.landProperty.description': string
  'home.domains.educationCulture.title': string
  'home.domains.educationCulture.description': string
  'home.domains.healthSocial.title': string
  'home.domains.healthSocial.description': string

  // Home Page - Popular Questions
  'home.popularQuestions.title': string
  'home.popularQuestions.subtitle': string
  'home.popularQuestions.askAssistant': string
  'home.popularQuestions.q1': string
  'home.popularQuestions.q1.answer': string
  'home.popularQuestions.q2': string
  'home.popularQuestions.q2.answer': string
  'home.popularQuestions.q3': string
  'home.popularQuestions.q3.answer': string
  'home.popularQuestions.q4': string
  'home.popularQuestions.q4.answer': string
  'home.popularQuestions.q5': string
  'home.popularQuestions.q5.answer': string
  'home.popularQuestions.q6': string
  'home.popularQuestions.q6.answer': string
  'home.popularQuestions.q7': string
  'home.popularQuestions.q7.answer': string
  'home.popularQuestions.q8': string
  'home.popularQuestions.q8.answer': string
  'home.popularQuestions.category.identity': string
  'home.popularQuestions.category.business': string
  'home.popularQuestions.category.civilStatus': string
  'home.popularQuestions.category.land': string
  'home.popularQuestions.category.work': string
  'home.popularQuestions.category.justice': string

  // Home Page - Stats Section
  'home.stats.documents': string
  'home.stats.questionsAnswered': string
  'home.stats.officialSources': string
  'home.stats.availability': string

  // Home Page - CTA Section
  'home.cta.badge': string
  'home.cta.title': string
  'home.cta.description': string
  'home.cta.talkToAssistant': string
  'home.cta.exploreProcedures': string
  'home.cta.features': string

  // Home Page - Features
  'home.features.assistant.title': string
  'home.features.assistant.desc': string
  'home.features.library.title': string
  'home.features.library.desc': string
  'home.features.procedures.title': string
  'home.features.procedures.desc': string
  'home.features.news.title': string
  'home.features.news.desc': string
  'home.features.quiz.title': string
  'home.features.quiz.desc': string

  // Assistant
  'assistant.welcome.title': string
  'assistant.welcome.subtitle': string
  'assistant.welcome.feature1': string
  'assistant.welcome.feature2': string
  'assistant.welcome.feature3': string
  'assistant.welcome.chooseCategory': string
  'assistant.welcome.back': string
  'assistant.sidebar.title': string
  'assistant.sidebar.newConversation': string
  'assistant.sidebar.myQuestions': string
  'assistant.sidebar.explorer': string
  'assistant.sidebar.noConversations': string
  'assistant.sidebar.startDiscussion': string
  'assistant.sidebar.chooseCategory': string
  'assistant.sidebar.backToCategories': string
  'assistant.sidebar.search': string
  'assistant.sidebar.noQuestionsFound': string
  'assistant.input.placeholder': string
  'assistant.input.send': string
  'assistant.typing': string

  // Categories
  'category.identity': string
  'category.business': string
  'category.legal': string
  'category.land': string
  'category.education': string

  // Library
  'library.title': string
  'library.subtitle': string
  'library.search': string
  'library.searchPlaceholder': string
  'library.noResults': string
  'library.readMore': string
  'library.filters.documentType': string
  'library.filters.category': string
  'library.filters.allCategories': string
  'library.filters.criminalLaw': string
  'library.filters.civilLaw': string
  'library.filters.laborLaw': string
  'library.filters.publicFinances': string
  'library.filters.dataProtection': string
  'library.filters.reset': string
  'library.documentsFound': string
  'library.consult': string
  'library.download': string
  'library.status.active': string
  'library.status.repealed': string
  'library.noReference': string
  'library.unknownDate': string

  // Procedures
  'procedures.title': string
  'procedures.subtitle': string
  'procedures.search': string
  'procedures.searchPlaceholder': string
  'procedures.noResults': string
  'procedures.viewDetails': string
  'procedures.steps': string
  'procedures.documents': string
  'procedures.duration': string
  'procedures.cost': string
  'procedures.available': string
  'procedures.category.all': string
  'procedures.category.identity': string
  'procedures.category.business': string
  'procedures.category.land': string
  'procedures.category.transport': string
  'procedures.category.education': string
  'procedures.category.justice': string
  'procedures.difficulty.easy': string
  'procedures.difficulty.medium': string
  'procedures.difficulty.hard': string

  // News
  'news.title': string
  'news.subtitle': string
  'news.search': string
  'news.noResults': string
  'news.readArticle': string
  'news.category.all': string
  'news.category.legal': string
  'news.category.administrative': string
  'news.category.business': string
  'news.category.land': string
  'news.category.social': string
  'news.featured': string
  'news.previous': string
  'news.next': string

  // Quiz
  'quiz.title': string
  'quiz.start': string
  'quiz.question': string
  'quiz.submit': string
  'quiz.next': string
  'quiz.nextQuestion': string
  'quiz.viewResults': string
  'quiz.result': string
  'quiz.score': string
  'quiz.correct': string
  'quiz.incorrect': string
  'quiz.completed': string
  'quiz.noQuestions': string
  'quiz.noQuestionsDesc': string
  'quiz.back': string
  'quiz.explanation': string
  'quiz.progress': string
  'quiz.of': string
  'quiz.correctAnswers': string
  'quiz.wrongAnswers': string
  'quiz.answersSummary': string
  'quiz.restart': string
  'quiz.shareScore': string
  'quiz.scoreMessage.excellent': string
  'quiz.scoreMessage.good': string
  'quiz.scoreMessage.average': string
  'quiz.scoreMessage.needsWork': string

  // Admin
  'admin.title': string
  'admin.login': string
  'admin.email': string
  'admin.password': string
  'admin.signIn': string
  'admin.logout': string
  'admin.dashboard': string
  'admin.messages': string
  'admin.conversations': string
  'admin.sessions': string
  'admin.avgResponseTime': string
  'admin.today': string
  'admin.dailyStats': string
  'admin.popularSearches': string
  'admin.recentEvents': string
  'admin.exportCSV': string
  'admin.loading': string

  // Footer
  'footer.brand': string
  'footer.description': string
  'footer.links': string
  'footer.about': string
  'footer.contact': string
  'footer.legal': string
  'footer.privacy': string
  'footer.followUs': string
  'footer.rights': string
  'footer.designedBy': string

  // Common
  'common.loading': string
  'common.error': string
  'common.retry': string
  'common.cancel': string
  'common.save': string
  'common.delete': string
  'common.edit': string
  'common.close': string
}

export const translations: Record<Language, Translations> = {
  fr: {
    // Header
    'header.home': 'Accueil',
    'header.assistant': 'Cami',
    'header.library': 'Bibliothèque',
    'header.procedures': 'Procédures',
    'header.news': 'Actualités',
    'header.quiz': 'Quiz',
    'header.infos': 'Infos',
    'header.changeLanguage': 'Changer de langue',
    'header.changeTheme': 'Changer de thème',
    'header.menu': 'Menu',

    // Home Page - Hero Section
    'home.hero.title': 'Votre guide intelligent pour naviguer au Cameroun',
    'home.hero.subtitle': 'Posez vos questions sur le droit, les procédures administratives et la vie au Cameroun',
    'home.hero.description': 'Droit, procédures administratives, culture - Toutes les réponses dont vous avez besoin, alimentées par l\'intelligence artificielle et des sources officielles vérifiées.',
    'home.hero.searchPlaceholder': 'Posez votre question ici...',
    'home.hero.availability': 'Disponible 24/7',
    'home.hero.floating.cniObtained': 'CNI obtenue',
    'home.hero.floating.inSteps': 'En 3 étapes',
    'home.hero.floating.questionResolved': 'Question résolue',
    'home.hero.floating.inMinutes': 'En 2 minutes',

    // Home Page - Quick Categories
    'home.quickCategories.procedures': 'Procédures',
    'home.quickCategories.proceduresDesc': 'CNI, Passeport, Actes...',
    'home.quickCategories.legal': 'Questions juridiques',
    'home.quickCategories.legalDesc': 'Droit, Justice, Travail...',
    'home.quickCategories.culture': 'Culture & Histoire',
    'home.quickCategories.cultureDesc': 'Patrimoine, Traditions...',

    // Home Page - How It Works
    'home.howItWorks.title': 'Comment ça marche ?',
    'home.howItWorks.subtitle': 'Trois étapes simples pour obtenir toutes vos réponses',
    'home.howItWorks.step1.title': 'Posez votre question',
    'home.howItWorks.step1.description': 'Exprimez-vous en français ou en anglais, notre assistant comprend les deux langues officielles.',
    'home.howItWorks.step2.title': 'L\'IA analyse et recherche',
    'home.howItWorks.step2.description': 'Notre intelligence artificielle parcourt des centaines de documents officiels pour trouver la réponse exacte.',
    'home.howItWorks.step3.title': 'Recevez une réponse claire',
    'home.howItWorks.step3.description': 'Obtenez une réponse détaillée avec les sources officielles citées et des étapes concrètes à suivre.',

    // Home Page - Domains Section
    'home.domains.title': 'Domaines couverts',
    'home.domains.subtitle': 'Une expertise complète sur tous les aspects de la vie au Cameroun',
    'home.domains.learnMore': 'En savoir plus',
    'home.domains.lawJustice.title': 'Droit & Justice',
    'home.domains.lawJustice.description': 'Droit pénal, civil, du travail et procédures judiciaires',
    'home.domains.adminProcedures.title': 'Procédures administratives',
    'home.domains.adminProcedures.description': 'CNI, passeport, actes de naissance et autres documents',
    'home.domains.businessCommerce.title': 'Entreprises & Commerce',
    'home.domains.businessCommerce.description': 'Création d\'entreprise, fiscalité et réglementation',
    'home.domains.landProperty.title': 'Foncier & Propriété',
    'home.domains.landProperty.description': 'Titres fonciers, baux et transactions immobilières',
    'home.domains.educationCulture.title': 'Éducation & Culture',
    'home.domains.educationCulture.description': 'Système éducatif, bourses et patrimoine culturel',
    'home.domains.healthSocial.title': 'Santé & Social',
    'home.domains.healthSocial.description': 'Système de santé, protection sociale et aide',

    // Home Page - Popular Questions
    'home.popularQuestions.title': 'Questions populaires',
    'home.popularQuestions.subtitle': 'Les questions les plus fréquemment posées par les citoyens',
    'home.popularQuestions.askAssistant': 'Poser à l\'assistant',
    'home.popularQuestions.q1': 'Comment obtenir ma carte nationale d\'identité ?',
    'home.popularQuestions.q1.answer': 'Pour obtenir votre carte nationale d\'identité, vous devez vous rendre au centre d\'enrôlement le plus proche avec un acte de naissance, deux photos d\'identité récentes, et un justificatif de domicile. Le processus prend généralement 2 à 4 semaines.',
    'home.popularQuestions.q2': 'Quels documents pour créer une entreprise au Cameroun ?',
    'home.popularQuestions.q2.answer': 'Pour créer une entreprise au Cameroun, vous aurez besoin d\'un certificat de domiciliation, d\'une copie de votre CNI, des statuts de l\'entreprise, et d\'un formulaire M0 dûment rempli. Le coût varie selon le type d\'entreprise.',
    'home.popularQuestions.q3': 'Comment obtenir un acte de naissance ?',
    'home.popularQuestions.q3.answer': 'L\'acte de naissance s\'obtient au centre d\'état civil de votre commune de naissance. Vous devez présenter une pièce d\'identité et payer les frais administratifs (environ 1000 FCFA).',
    'home.popularQuestions.q4': 'Quelle est la procédure pour obtenir un passeport ?',
    'home.popularQuestions.q4.answer': 'Pour obtenir un passeport, rendez-vous au centre de production des titres sécurisés avec votre CNI, un acte de naissance, deux photos, et un justificatif de paiement des frais (75 000 FCFA pour un passeport ordinaire).',
    'home.popularQuestions.q5': 'Comment faire une demande de titre foncier ?',
    'home.popularQuestions.q5.answer': 'La demande de titre foncier se fait auprès des services du cadastre. Vous devez fournir un plan de localisation, une attestation de propriété, et suivre une procédure d\'immatriculation qui peut prendre plusieurs mois.',
    'home.popularQuestions.q6': 'Quels sont mes droits en tant que travailleur ?',
    'home.popularQuestions.q6.answer': 'En tant que travailleur au Cameroun, vous avez droit à un salaire minimum garanti, des congés payés, une protection contre le licenciement abusif, et des conditions de travail décentes selon le Code du Travail.',
    'home.popularQuestions.q7': 'Comment porter plainte au commissariat ?',
    'home.popularQuestions.q7.answer': 'Pour porter plainte, rendez-vous au commissariat le plus proche avec votre pièce d\'identité. Expliquez les faits, l\'agent prendra votre déposition et vous remettra un récépissé de dépôt de plainte.',
    'home.popularQuestions.q8': 'Quelle est la procédure de divorce au Cameroun ?',
    'home.popularQuestions.q8.answer': 'La procédure de divorce au Cameroun peut être par consentement mutuel ou contentieuse. Elle nécessite l\'assistance d\'un avocat et se déroule devant le tribunal de première instance. La durée varie de 6 mois à plusieurs années.',
    'home.popularQuestions.category.identity': 'Identité',
    'home.popularQuestions.category.business': 'Entreprise',
    'home.popularQuestions.category.civilStatus': 'État civil',
    'home.popularQuestions.category.land': 'Foncier',
    'home.popularQuestions.category.work': 'Travail',
    'home.popularQuestions.category.justice': 'Justice',

    // Home Page - Stats Section
    'home.stats.documents': 'Documents juridiques',
    'home.stats.questionsAnswered': 'Questions répondues',
    'home.stats.officialSources': 'Sources officielles',
    'home.stats.availability': 'Disponibilité',

    // Home Page - CTA Section
    'home.cta.badge': 'Propulsé par l\'IA',
    'home.cta.title': 'Prêt à obtenir vos réponses ?',
    'home.cta.description': 'Rejoignez des milliers de Camerounais qui utilisent déjà notre assistant intelligent pour simplifier leurs démarches administratives et obtenir des informations fiables.',
    'home.cta.talkToAssistant': 'Parler à l\'assistant',
    'home.cta.exploreProcedures': 'Explorer les procédures',
    'home.cta.features': 'Gratuit • Rapide • Fiable • Sources officielles vérifiées',

    // Home Page - Features
    'home.features.assistant.title': 'Assistant IA',
    'home.features.assistant.desc': 'Posez vos questions et obtenez des réponses précises',
    'home.features.library.title': 'Bibliothèque',
    'home.features.library.desc': 'Accédez à des documents officiels',
    'home.features.procedures.title': 'Procédures',
    'home.features.procedures.desc': 'Guides étape par étape',
    'home.features.news.title': 'Actualités',
    'home.features.news.desc': 'Restez informé des dernières nouvelles',
    'home.features.quiz.title': 'Quiz',
    'home.features.quiz.desc': 'Testez vos connaissances',

    // Assistant
    'assistant.welcome.title': 'Bonjour ! Je suis Cami 👋',
    'assistant.welcome.subtitle': 'Votre assistant IA pour les procédures administratives, le droit camerounais, et tout ce qui concerne la vie au Cameroun.',
    'assistant.welcome.feature1': 'Instantané',
    'assistant.welcome.feature2': 'Sources officielles',
    'assistant.welcome.feature3': 'Bilingue',
    'assistant.welcome.chooseCategory': 'Choisissez une catégorie :',
    'assistant.welcome.back': '← Retour',
    'assistant.sidebar.title': 'Assistant',
    'assistant.sidebar.newConversation': 'Nouvelle conversation',
    'assistant.sidebar.myQuestions': 'Mes Questions',
    'assistant.sidebar.explorer': 'Explorer',
    'assistant.sidebar.noConversations': 'Aucune conversation',
    'assistant.sidebar.startDiscussion': 'Commencez une nouvelle discussion',
    'assistant.sidebar.chooseCategory': 'Choisissez une catégorie :',
    'assistant.sidebar.backToCategories': 'Retour aux catégories',
    'assistant.sidebar.search': 'Rechercher...',
    'assistant.sidebar.noQuestionsFound': 'Aucune question trouvée',
    'assistant.input.placeholder': 'Posez votre question...',
    'assistant.input.send': 'Envoyer',
    'assistant.typing': 'Cami est en train d\'écrire...',

    // Categories
    'category.identity': 'Identité & Documents',
    'category.business': 'Entreprise & Commerce',
    'category.legal': 'Juridique & Justice',
    'category.land': 'Foncier & Immobilier',
    'category.education': 'Éducation & Formation',

    // Library
    'library.title': 'Bibliothèque Juridique',
    'library.subtitle': 'Accédez à tous les documents juridiques officiels du Cameroun',
    'library.search': 'Rechercher des documents...',
    'library.searchPlaceholder': 'Rechercher un document...',
    'library.noResults': 'Aucun document trouvé',
    'library.readMore': 'Lire plus',
    'library.filters.documentType': 'Type de document',
    'library.filters.category': 'Catégorie',
    'library.filters.allCategories': 'Toutes les catégories',
    'library.filters.criminalLaw': 'Droit pénal',
    'library.filters.civilLaw': 'Droit civil',
    'library.filters.laborLaw': 'Droit du travail',
    'library.filters.publicFinances': 'Finances publiques',
    'library.filters.dataProtection': 'Protection des données',
    'library.filters.reset': 'Réinitialiser les filtres',
    'library.documentsFound': 'documents trouvés',
    'library.consult': 'Consulter',
    'library.download': 'Télécharger',
    'library.status.active': 'Actif',
    'library.status.repealed': 'Abrogé',
    'library.noReference': 'Sans référence',
    'library.unknownDate': 'Date inconnue',

    // Procedures
    'procedures.title': 'Guide des démarches administratives',
    'procedures.subtitle': 'Toutes les procédures expliquées étape par étape avec les documents requis et les coûts',
    'procedures.search': 'Rechercher des procédures...',
    'procedures.searchPlaceholder': 'Rechercher une procédure...',
    'procedures.noResults': 'Aucune procédure trouvée',
    'procedures.viewDetails': 'Voir les détails',
    'procedures.steps': 'Étapes',
    'procedures.documents': 'Documents requis',
    'procedures.duration': 'Durée',
    'procedures.cost': 'Coût',
    'procedures.available': 'disponibles',
    'procedures.category.all': 'Toutes',
    'procedures.category.identity': 'Identité & État civil',
    'procedures.category.business': 'Entreprise',
    'procedures.category.land': 'Foncier',
    'procedures.category.transport': 'Transport',
    'procedures.category.education': 'Éducation',
    'procedures.category.justice': 'Justice',
    'procedures.difficulty.easy': 'Facile',
    'procedures.difficulty.medium': 'Moyen',
    'procedures.difficulty.hard': 'Difficile',

    // News
    'news.title': 'Actualités',
    'news.subtitle': 'Restez informé des dernières nouvelles juridiques et administratives du Cameroun',
    'news.search': 'Rechercher des actualités...',
    'news.noResults': 'Aucune actualité trouvée',
    'news.readArticle': 'Lire l\'article',
    'news.category.all': 'Tous',
    'news.category.legal': 'Juridique',
    'news.category.administrative': 'Administratif',
    'news.category.business': 'Entreprise',
    'news.category.land': 'Foncier',
    'news.category.social': 'Social',
    'news.featured': 'À la une',
    'news.previous': 'Précédent',
    'news.next': 'Suivant',

    // Quiz
    'quiz.title': 'Quiz - Testez vos connaissances',
    'quiz.start': 'Commencer le quiz',
    'quiz.question': 'Question',
    'quiz.submit': 'Soumettre',
    'quiz.next': 'Suivant',
    'quiz.nextQuestion': 'Question suivante',
    'quiz.viewResults': 'Voir les résultats',
    'quiz.result': 'Résultat',
    'quiz.score': 'Score',
    'quiz.correct': 'Correct',
    'quiz.incorrect': 'Incorrect',
    'quiz.completed': 'Quiz terminé !',
    'quiz.noQuestions': 'Aucune question disponible',
    'quiz.noQuestionsDesc': 'Il n\'y a pas encore de questions pour cette catégorie et difficulté.',
    'quiz.back': 'Retour',
    'quiz.explanation': 'Explication :',
    'quiz.progress': 'Question',
    'quiz.of': 'sur',
    'quiz.correctAnswers': 'Bonnes réponses',
    'quiz.wrongAnswers': 'Mauvaises réponses',
    'quiz.answersSummary': 'Résumé des réponses :',
    'quiz.restart': 'Recommencer',
    'quiz.shareScore': 'Partager mon score',
    'quiz.scoreMessage.excellent': 'Excellent ! Vous maîtrisez parfaitement le sujet.',
    'quiz.scoreMessage.good': 'Bien joué ! Vous avez de bonnes connaissances.',
    'quiz.scoreMessage.average': 'Pas mal ! Continuez à apprendre.',
    'quiz.scoreMessage.needsWork': 'Continuez vos efforts ! La pratique rend parfait.',

    // Admin
    'admin.title': 'Dashboard Admin',
    'admin.login': 'Connexion Administration',
    'admin.email': 'Email',
    'admin.password': 'Mot de passe',
    'admin.signIn': 'Se connecter',
    'admin.logout': 'Déconnexion',
    'admin.dashboard': 'Tableau de bord',
    'admin.messages': 'Messages',
    'admin.conversations': 'Conversations',
    'admin.sessions': 'Sessions',
    'admin.avgResponseTime': 'Temps de réponse moy.',
    'admin.today': "Aujourd'hui",
    'admin.dailyStats': 'Statistiques quotidiennes',
    'admin.popularSearches': 'Recherches populaires',
    'admin.recentEvents': 'Événements récents',
    'admin.exportCSV': 'Exporter CSV',
    'admin.loading': 'Chargement...',

    // Footer
    'footer.brand': 'Cami - Assistant National du Cameroun',
    'footer.description': 'Votre guide intelligent pour naviguer au Cameroun. Droit, procédures administratives, culture - Toutes les réponses dont vous avez besoin.',
    'footer.links': 'Liens utiles',
    'footer.about': 'À propos',
    'footer.contact': 'Contact',
    'footer.legal': 'Mentions légales',
    'footer.privacy': 'Confidentialité',
    'footer.followUs': 'Suivez-nous',
    'footer.rights': 'Tous droits réservés.',
    'footer.designedBy': 'Conçu par',

    // Common
    'common.loading': 'Chargement...',
    'common.error': 'Une erreur est survenue',
    'common.retry': 'Réessayer',
    'common.cancel': 'Annuler',
    'common.save': 'Enregistrer',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.close': 'Fermer',
  },
  en: {
    // Header
    'header.home': 'Home',
    'header.assistant': 'Cami',
    'header.library': 'Library',
    'header.procedures': 'Procedures',
    'header.news': 'News',
    'header.quiz': 'Quiz',
    'header.infos': 'Info',
    'header.changeLanguage': 'Change language',
    'header.changeTheme': 'Change theme',
    'header.menu': 'Menu',

    // Home Page - Hero Section
    'home.hero.title': 'Your intelligent guide to navigate Cameroon',
    'home.hero.subtitle': 'Ask questions about law, administrative procedures and life in Cameroon',
    'home.hero.description': 'Law, administrative procedures, culture - All the answers you need, powered by artificial intelligence and verified official sources.',
    'home.hero.searchPlaceholder': 'Ask your question here...',
    'home.hero.availability': 'Available 24/7',
    'home.hero.floating.cniObtained': 'ID card obtained',
    'home.hero.floating.inSteps': 'In 3 steps',
    'home.hero.floating.questionResolved': 'Question resolved',
    'home.hero.floating.inMinutes': 'In 2 minutes',

    // Home Page - Quick Categories
    'home.quickCategories.procedures': 'Procedures',
    'home.quickCategories.proceduresDesc': 'ID, Passport, Certificates...',
    'home.quickCategories.legal': 'Legal questions',
    'home.quickCategories.legalDesc': 'Law, Justice, Labor...',
    'home.quickCategories.culture': 'Culture & History',
    'home.quickCategories.cultureDesc': 'Heritage, Traditions...',

    // Home Page - How It Works
    'home.howItWorks.title': 'How does it work?',
    'home.howItWorks.subtitle': 'Three simple steps to get all your answers',
    'home.howItWorks.step1.title': 'Ask your question',
    'home.howItWorks.step1.description': 'Express yourself in French or English, our assistant understands both official languages.',
    'home.howItWorks.step2.title': 'AI analyzes and searches',
    'home.howItWorks.step2.description': 'Our artificial intelligence searches through hundreds of official documents to find the exact answer.',
    'home.howItWorks.step3.title': 'Receive a clear answer',
    'home.howItWorks.step3.description': 'Get a detailed answer with cited official sources and concrete steps to follow.',

    // Home Page - Domains Section
    'home.domains.title': 'Covered domains',
    'home.domains.subtitle': 'Comprehensive expertise on all aspects of life in Cameroon',
    'home.domains.learnMore': 'Learn more',
    'home.domains.lawJustice.title': 'Law & Justice',
    'home.domains.lawJustice.description': 'Criminal, civil, labor law and judicial procedures',
    'home.domains.adminProcedures.title': 'Administrative procedures',
    'home.domains.adminProcedures.description': 'ID card, passport, birth certificates and other documents',
    'home.domains.businessCommerce.title': 'Business & Commerce',
    'home.domains.businessCommerce.description': 'Business creation, taxation and regulation',
    'home.domains.landProperty.title': 'Land & Property',
    'home.domains.landProperty.description': 'Land titles, leases and real estate transactions',
    'home.domains.educationCulture.title': 'Education & Culture',
    'home.domains.educationCulture.description': 'Education system, scholarships and cultural heritage',
    'home.domains.healthSocial.title': 'Health & Social',
    'home.domains.healthSocial.description': 'Healthcare system, social protection and assistance',

    // Home Page - Popular Questions
    'home.popularQuestions.title': 'Popular questions',
    'home.popularQuestions.subtitle': 'The most frequently asked questions by citizens',
    'home.popularQuestions.askAssistant': 'Ask the assistant',
    'home.popularQuestions.q1': 'How to get my national ID card?',
    'home.popularQuestions.q1.answer': 'To obtain your national ID card, you must go to the nearest enrollment center with a birth certificate, two recent ID photos, and proof of residence. The process usually takes 2 to 4 weeks.',
    'home.popularQuestions.q2': 'What documents to create a business in Cameroon?',
    'home.popularQuestions.q2.answer': 'To create a business in Cameroon, you will need a domiciliation certificate, a copy of your ID card, the company\'s articles of association, and a duly completed M0 form. The cost varies according to the type of business.',
    'home.popularQuestions.q3': 'How to obtain a birth certificate?',
    'home.popularQuestions.q3.answer': 'The birth certificate is obtained at the civil registry office of your birth municipality. You must present an ID document and pay the administrative fees (approximately 1000 FCFA).',
    'home.popularQuestions.q4': 'What is the procedure to obtain a passport?',
    'home.popularQuestions.q4.answer': 'To obtain a passport, go to the secure document production center with your ID card, a birth certificate, two photos, and proof of payment of fees (75,000 FCFA for an ordinary passport).',
    'home.popularQuestions.q5': 'How to apply for a land title?',
    'home.popularQuestions.q5.answer': 'The land title application is made with the cadastral services. You must provide a location plan, a certificate of ownership, and follow a registration procedure that can take several months.',
    'home.popularQuestions.q6': 'What are my rights as a worker?',
    'home.popularQuestions.q6.answer': 'As a worker in Cameroon, you are entitled to a guaranteed minimum wage, paid leave, protection against unfair dismissal, and decent working conditions according to the Labor Code.',
    'home.popularQuestions.q7': 'How to file a complaint at the police station?',
    'home.popularQuestions.q7.answer': 'To file a complaint, go to the nearest police station with your ID. Explain the facts, the officer will take your statement and give you a receipt for filing the complaint.',
    'home.popularQuestions.q8': 'What is the divorce procedure in Cameroon?',
    'home.popularQuestions.q8.answer': 'The divorce procedure in Cameroon can be by mutual consent or contentious. It requires the assistance of a lawyer and takes place before the court of first instance. The duration varies from 6 months to several years.',
    'home.popularQuestions.category.identity': 'Identity',
    'home.popularQuestions.category.business': 'Business',
    'home.popularQuestions.category.civilStatus': 'Civil status',
    'home.popularQuestions.category.land': 'Land',
    'home.popularQuestions.category.work': 'Labor',
    'home.popularQuestions.category.justice': 'Justice',

    // Home Page - Stats Section
    'home.stats.documents': 'Legal documents',
    'home.stats.questionsAnswered': 'Questions answered',
    'home.stats.officialSources': 'Official sources',
    'home.stats.availability': 'Availability',

    // Home Page - CTA Section
    'home.cta.badge': 'Powered by AI',
    'home.cta.title': 'Ready to get your answers?',
    'home.cta.description': 'Join thousands of Cameroonians already using our intelligent assistant to simplify their administrative procedures and obtain reliable information.',
    'home.cta.talkToAssistant': 'Talk to the assistant',
    'home.cta.exploreProcedures': 'Explore procedures',
    'home.cta.features': 'Free • Fast • Reliable • Verified official sources',

    // Home Page - Features
    'home.features.assistant.title': 'AI Assistant',
    'home.features.assistant.desc': 'Ask questions and get accurate answers',
    'home.features.library.title': 'Library',
    'home.features.library.desc': 'Access official documents',
    'home.features.procedures.title': 'Procedures',
    'home.features.procedures.desc': 'Step-by-step guides',
    'home.features.news.title': 'News',
    'home.features.news.desc': 'Stay informed with the latest news',
    'home.features.quiz.title': 'Quiz',
    'home.features.quiz.desc': 'Test your knowledge',

    // Assistant
    'assistant.welcome.title': 'Hello! I\'m Cami 👋',
    'assistant.welcome.subtitle': 'Your AI assistant for administrative procedures, Cameroonian law, and everything about life in Cameroon.',
    'assistant.welcome.feature1': 'Instant',
    'assistant.welcome.feature2': 'Official sources',
    'assistant.welcome.feature3': 'Bilingual',
    'assistant.welcome.chooseCategory': 'Choose a category:',
    'assistant.welcome.back': '← Back',
    'assistant.sidebar.title': 'Assistant',
    'assistant.sidebar.newConversation': 'New conversation',
    'assistant.sidebar.myQuestions': 'My Questions',
    'assistant.sidebar.explorer': 'Explore',
    'assistant.sidebar.noConversations': 'No conversations',
    'assistant.sidebar.startDiscussion': 'Start a new discussion',
    'assistant.sidebar.chooseCategory': 'Choose a category:',
    'assistant.sidebar.backToCategories': 'Back to categories',
    'assistant.sidebar.search': 'Search...',
    'assistant.sidebar.noQuestionsFound': 'No questions found',
    'assistant.input.placeholder': 'Ask your question...',
    'assistant.input.send': 'Send',
    'assistant.typing': 'Cami is typing...',

    // Categories
    'category.identity': 'Identity & Documents',
    'category.business': 'Business & Commerce',
    'category.legal': 'Legal & Justice',
    'category.land': 'Land & Real Estate',
    'category.education': 'Education & Training',

    // Library
    'library.title': 'Legal Library',
    'library.subtitle': 'Access all official legal documents of Cameroon',
    'library.search': 'Search documents...',
    'library.searchPlaceholder': 'Search for a document...',
    'library.noResults': 'No documents found',
    'library.readMore': 'Read more',
    'library.filters.documentType': 'Document type',
    'library.filters.category': 'Category',
    'library.filters.allCategories': 'All categories',
    'library.filters.criminalLaw': 'Criminal law',
    'library.filters.civilLaw': 'Civil law',
    'library.filters.laborLaw': 'Labor law',
    'library.filters.publicFinances': 'Public finances',
    'library.filters.dataProtection': 'Data protection',
    'library.filters.reset': 'Reset filters',
    'library.documentsFound': 'documents found',
    'library.consult': 'Consult',
    'library.download': 'Download',
    'library.status.active': 'Active',
    'library.status.repealed': 'Repealed',
    'library.noReference': 'No reference',
    'library.unknownDate': 'Unknown date',

    // Procedures
    'procedures.title': 'Guide to administrative procedures',
    'procedures.subtitle': 'All procedures explained step by step with required documents and costs',
    'procedures.search': 'Search procedures...',
    'procedures.searchPlaceholder': 'Search for a procedure...',
    'procedures.noResults': 'No procedures found',
    'procedures.viewDetails': 'View details',
    'procedures.steps': 'Steps',
    'procedures.documents': 'Required documents',
    'procedures.duration': 'Duration',
    'procedures.cost': 'Cost',
    'procedures.available': 'available',
    'procedures.category.all': 'All',
    'procedures.category.identity': 'Identity & Civil status',
    'procedures.category.business': 'Business',
    'procedures.category.land': 'Land',
    'procedures.category.transport': 'Transport',
    'procedures.category.education': 'Education',
    'procedures.category.justice': 'Justice',
    'procedures.difficulty.easy': 'Easy',
    'procedures.difficulty.medium': 'Medium',
    'procedures.difficulty.hard': 'Hard',

    // News
    'news.title': 'News',
    'news.subtitle': 'Stay informed about the latest legal and administrative news from Cameroon',
    'news.search': 'Search news...',
    'news.noResults': 'No news found',
    'news.readArticle': 'Read article',
    'news.category.all': 'All',
    'news.category.legal': 'Legal',
    'news.category.administrative': 'Administrative',
    'news.category.business': 'Business',
    'news.category.land': 'Land',
    'news.category.social': 'Social',
    'news.featured': 'Featured',
    'news.previous': 'Previous',
    'news.next': 'Next',

    // Quiz
    'quiz.title': 'Quiz - Test Your Knowledge',
    'quiz.start': 'Start quiz',
    'quiz.question': 'Question',
    'quiz.submit': 'Submit',
    'quiz.next': 'Next',
    'quiz.nextQuestion': 'Next question',
    'quiz.viewResults': 'View results',
    'quiz.result': 'Result',
    'quiz.score': 'Score',
    'quiz.correct': 'Correct',
    'quiz.incorrect': 'Incorrect',
    'quiz.completed': 'Quiz completed!',
    'quiz.noQuestions': 'No questions available',
    'quiz.noQuestionsDesc': 'There are no questions yet for this category and difficulty.',
    'quiz.back': 'Back',
    'quiz.explanation': 'Explanation:',
    'quiz.progress': 'Question',
    'quiz.of': 'of',
    'quiz.correctAnswers': 'Correct answers',
    'quiz.wrongAnswers': 'Wrong answers',
    'quiz.answersSummary': 'Answers summary:',
    'quiz.restart': 'Restart',
    'quiz.shareScore': 'Share my score',
    'quiz.scoreMessage.excellent': 'Excellent! You have mastered the subject perfectly.',
    'quiz.scoreMessage.good': 'Well done! You have good knowledge.',
    'quiz.scoreMessage.average': 'Not bad! Keep learning.',
    'quiz.scoreMessage.needsWork': 'Keep up your efforts! Practice makes perfect.',

    // Admin
    'admin.title': 'Admin Dashboard',
    'admin.login': 'Administration Login',
    'admin.email': 'Email',
    'admin.password': 'Password',
    'admin.signIn': 'Sign in',
    'admin.logout': 'Logout',
    'admin.dashboard': 'Dashboard',
    'admin.messages': 'Messages',
    'admin.conversations': 'Conversations',
    'admin.sessions': 'Sessions',
    'admin.avgResponseTime': 'Avg. response time',
    'admin.today': 'Today',
    'admin.dailyStats': 'Daily statistics',
    'admin.popularSearches': 'Popular searches',
    'admin.recentEvents': 'Recent events',
    'admin.exportCSV': 'Export CSV',
    'admin.loading': 'Loading...',

    // Footer
    'footer.brand': 'National Assistant of Cameroon',
    'footer.description': 'Your intelligent guide to navigate Cameroon. Law, administrative procedures, culture - All the answers you need.',
    'footer.links': 'Useful links',
    'footer.about': 'About',
    'footer.contact': 'Contact',
    'footer.legal': 'Legal notice',
    'footer.privacy': 'Privacy',
    'footer.followUs': 'Follow us',
    'footer.rights': 'All rights reserved.',
    'footer.designedBy': 'Designed by',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.retry': 'Retry',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.close': 'Close',
  },
}
