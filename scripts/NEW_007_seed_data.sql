-- ============================================
-- SEED DATA - Données initiales
-- À exécuter après la création des tables
-- ============================================

-- ============================================
-- 1. SEED DOCUMENTS (Exemples de documents juridiques)
-- ============================================
INSERT INTO "Document" (slug, title, type, category, source, content, summary, reference, "dateEnacted", status) VALUES
(
  'code-penal-cameroun',
  'Code Pénal Camerounais',
  'CODE',
  'Droit pénal',
  'Ministère de la Justice',
  'Le Code Pénal camerounais définit les infractions et les peines applicables...',
  'Code pénal définissant les infractions et sanctions au Cameroun',
  'Loi N° 2016/007 du 12 juillet 2016',
  '2016-07-12',
  'ACTIVE'
),
(
  'code-travail-cameroun',
  'Code du Travail',
  'CODE',
  'Droit du travail',
  'Ministère du Travail',
  'Le Code du Travail régit les relations de travail au Cameroun...',
  'Réglementation des relations de travail au Cameroun',
  'Loi N° 92/007 du 14 août 1992',
  '1992-08-14',
  'ACTIVE'
),
(
  'code-civil-cameroun',
  'Code Civil',
  'CODE',
  'Droit civil',
  'Ministère de la Justice',
  'Code civil camerounais régissant les personnes, les biens et les obligations...',
  'Code civil régissant les personnes, biens et obligations',
  'Loi N° 81/02 du 29 juin 1981',
  '1981-06-29',
  'ACTIVE'
),
(
  'loi-protection-donnees',
  'Loi sur la protection des données personnelles',
  'LOI',
  'Protection des données',
  'Ministère des Postes et Télécommunications',
  'Cette loi régit la protection des données à caractère personnel...',
  'Protection des données personnelles et de la vie privée',
  'Loi N° 2019/020 du 24 décembre 2019',
  '2019-12-24',
  'ACTIVE'
),
(
  'loi-regime-financier-etat',
  'Loi portant régime financier de l''État',
  'LOI',
  'Finances publiques',
  'Ministère des Finances',
  'Loi définissant le régime financier de l''État et des collectivités territoriales...',
  'Régime financier de l''État et des collectivités territoriales',
  'Loi N° 2018/012 du 11 juillet 2018',
  '2018-07-11',
  'ACTIVE'
),
(
  'decret-organisation-justice',
  'Décret portant organisation du Ministère de la Justice',
  'DÉCRET',
  'Organisation administrative',
  'Présidence de la République',
  'Ce décret organise le Ministère de la Justice et définit ses missions...',
  'Organisation et fonctionnement du Ministère de la Justice',
  'Décret N° 2011/408 du 09 décembre 2011',
  '2011-12-09',
  'ACTIVE'
);

-- ============================================
-- 2. SEED PROCEDURES (Procédures administratives)
-- ============================================
INSERT INTO "Procedure" (
  slug, name, category, difficulty, description,
  steps, documents, costs, duration, locations, tips, faqs
) VALUES
(
  'cni',
  'Carte Nationale d''Identité (CNI)',
  'identite',
  'Facile',
  'La carte nationale d''identité est un document officiel qui permet d''attester de votre identité et de votre nationalité camerounaise.',
  '[
    {"step": 1, "title": "Rassembler les documents requis", "description": "Préparez tous les documents nécessaires avant de vous rendre au centre d''enrôlement."},
    {"step": 2, "title": "Se rendre au centre d''enrôlement", "description": "Rendez-vous au centre d''enrôlement le plus proche avec tous vos documents."},
    {"step": 3, "title": "Enrôlement biométrique", "description": "Prise de vos empreintes digitales et photo."},
    {"step": 4, "title": "Paiement des frais", "description": "Payez les frais d''établissement (6 000 FCFA)."},
    {"step": 5, "title": "Récupération du récépissé", "description": "Conservez précieusement votre récépissé avec numéro de suivi."},
    {"step": 6, "title": "Retrait de la CNI", "description": "Après 2-4 semaines, retournez au centre pour récupérer votre CNI."}
  ]'::JSONB,
  '["Acte de naissance (original et photocopie)", "2 photos d''identité récentes (4x4 cm, fond blanc)", "Justificatif de domicile", "Ancienne CNI (si renouvellement)", "Certificat de nationalité (première demande)"]'::JSONB,
  '[{"item": "Frais d''établissement", "amount": "6 000 FCFA"}, {"item": "Photos d''identité", "amount": "500 - 1 000 FCFA"}]'::JSONB,
  '2-4 semaines',
  '[{"name": "Centre d''enrôlement de Yaoundé", "address": "Quartier Bastos", "hours": "8h-15h"}, {"name": "Centre d''enrôlement de Douala", "address": "Akwa", "hours": "8h-15h"}]'::JSONB,
  '["Arrivez tôt le matin", "Vérifiez que vos photos respectent les normes", "Conservez votre récépissé", "Notez le numéro de suivi"]'::JSONB,
  '[{"question": "Quelle est la durée de validité ?", "answer": "10 ans pour les adultes, 5 ans pour les mineurs."}, {"question": "Que faire en cas de perte ?", "answer": "Déclarez la perte au commissariat puis demandez un duplicata."}]'::JSONB
),
(
  'passeport',
  'Passeport ordinaire',
  'identite',
  'Moyen',
  'Document de voyage officiel permettant de voyager à l''international.',
  '[
    {"step": 1, "title": "Obtenir la CNI", "description": "Vous devez avoir une carte nationale d''identité valide."},
    {"step": 2, "title": "Prendre rendez-vous", "description": "Prenez rendez-vous sur le site de la DGSN ou par téléphone."},
    {"step": 3, "title": "Rassembler les documents", "description": "CNI, acte de naissance, photos, justificatif de domicile."},
    {"step": 4, "title": "Se présenter au rendez-vous", "description": "Présentez-vous avec tous les documents au centre."},
    {"step": 5, "title": "Enrôlement et paiement", "description": "Enrôlement biométrique et paiement de 75 000 FCFA."},
    {"step": 6, "title": "Retrait du passeport", "description": "Après 3-6 semaines, retirez votre passeport."}
  ]'::JSONB,
  '["CNI valide", "Acte de naissance", "4 photos d''identité", "Justificatif de domicile", "Ancien passeport (renouvellement)"]'::JSONB,
  '[{"item": "Passeport ordinaire", "amount": "75 000 FCFA"}, {"item": "Photos", "amount": "1 000 - 2 000 FCFA"}]'::JSONB,
  '3-6 semaines',
  '[{"name": "DGSN Yaoundé", "address": "Quartier Administratif", "hours": "8h-15h"}, {"name": "DGSN Douala", "address": "Bonanjo", "hours": "8h-15h"}]'::JSONB,
  '["Prenez rendez-vous à l''avance", "Vérifiez la validité de votre CNI", "Préparez l''appoint pour le paiement", "Prévoyez un délai supplémentaire en haute saison"]'::JSONB,
  '[{"question": "Durée de validité ?", "answer": "5 ans pour tous."}, {"question": "Peut-on voyager pendant le traitement ?", "answer": "Non, votre ancien passeport sera retenu."}]'::JSONB
),
(
  'acte-naissance',
  'Acte de naissance',
  'identite',
  'Facile',
  'Document d''état civil attestant de votre naissance et filiation.',
  '[
    {"step": 1, "title": "Identifier le centre d''état civil", "description": "Trouvez le centre d''état civil de votre lieu de naissance."},
    {"step": 2, "title": "Remplir le formulaire", "description": "Complétez le formulaire de demande d''acte de naissance."},
    {"step": 3, "title": "Fournir les informations", "description": "Nom, prénom, date et lieu de naissance des parents."},
    {"step": 4, "title": "Payer les frais", "description": "Payez 1 000 FCFA pour l''établissement."},
    {"step": 5, "title": "Retirer l''acte", "description": "Retirez votre acte de naissance (1-2 jours)."}
  ]'::JSONB,
  '["Pièce d''identité du demandeur", "Informations sur les parents"]'::JSONB,
  '[{"item": "Acte de naissance", "amount": "1 000 FCFA"}]'::JSONB,
  '1-2 jours',
  '[{"name": "Centre d''état civil", "address": "Votre lieu de naissance", "hours": "8h-15h"}]'::JSONB,
  '["Connaissez les noms complets de vos parents", "Ayez la date exacte de naissance", "Préparez l''appoint"]'::JSONB,
  '[{"question": "Validité de l''acte ?", "answer": "Pas de durée de validité, mais une copie récente est souvent demandée (moins de 3 mois)."}, {"question": "Acte perdu ?", "answer": "Vous pouvez obtenir une copie au même centre d''état civil."}]'::JSONB
);

-- ============================================
-- 3. SEED NEWS ARTICLES (Actualités exemples)
-- ============================================
INSERT INTO "NewsArticle" (
  title, summary, content, url, source, category, "isRelevant", "readTime", "isFeatured", "publishedAt"
) VALUES
(
  'Nouvelle loi sur la protection des données personnelles entre en vigueur',
  'Le gouvernement camerounais a annoncé l''entrée en vigueur de la nouvelle loi sur la protection des données personnelles.',
  'La nouvelle loi renforce les droits des citoyens en matière de vie privée et impose des obligations aux entreprises...',
  'https://example.com/news/protection-donnees-2024',
  'Ministère de la Justice',
  'Juridique',
  true,
  5,
  true,
  NOW() - INTERVAL '2 days'
),
(
  'Simplification des procédures d''obtention de la CNI',
  'Les centres d''enrôlement annoncent une réduction des délais de traitement grâce à la digitalisation.',
  'Le processus d''obtention de la carte nationale d''identité a été simplifié...',
  'https://example.com/news/cni-simplification',
  'DGSN',
  'Administratif',
  true,
  3,
  false,
  NOW() - INTERVAL '5 days'
),
(
  'Lancement du guichet unique pour la création d''entreprises',
  'Un nouveau guichet unique permet de créer son entreprise en une seule journée.',
  'Le Centre de Formalités de Création d''Entreprises (CFCE) lance un nouveau service...',
  'https://example.com/news/guichet-unique-entreprise',
  'APME',
  'Entreprise',
  true,
  4,
  false,
  NOW() - INTERVAL '7 days'
);

-- ============================================
-- 4. SEED QUIZ QUESTIONS (Questions exemples)
-- ============================================
INSERT INTO "QuizQuestion" (
  question, options, answer, explanation, category, difficulty
) VALUES
(
  'Quelle est la durée de validité d''une carte nationale d''identité au Cameroun ?',
  '["5 ans", "10 ans", "15 ans", "À vie"]'::JSONB,
  '1',
  'La CNI camerounaise est valable 10 ans pour les adultes et 5 ans pour les mineurs.',
  'procedures-admin',
  'Facile'
),
(
  'Quel est le coût d''établissement d''une CNI au Cameroun ?',
  '["3 000 FCFA", "6 000 FCFA", "10 000 FCFA", "15 000 FCFA"]'::JSONB,
  '1',
  'Le coût officiel d''établissement d''une CNI est de 6 000 FCFA.',
  'procedures-admin',
  'Facile'
),
(
  'Quel Code régit les relations de travail au Cameroun ?',
  '["Code Pénal", "Code Civil", "Code du Travail", "Code de Commerce"]'::JSONB,
  '2',
  'Le Code du Travail (Loi N° 92/007 du 14 août 1992) régit les relations de travail au Cameroun.',
  'droit-travail',
  'Moyen'
),
(
  'Combien de régions compte le Cameroun actuellement ?',
  '["8", "10", "12", "14"]'::JSONB,
  '1',
  'Le Cameroun compte 10 régions depuis la création des régions du Nord-Ouest et du Sud-Ouest.',
  'culture',
  'Facile'
);

-- ============================================
-- 5. SEED SYSTEM CONFIG (optionnel)
-- ============================================
-- Pour tracking de la version du schema
INSERT INTO "Analytics" (event, "sessionId", data, language, "userAgent")
VALUES (
  'PAGE_VIEW',
  'system-seed-' || gen_random_uuid()::TEXT,
  '{"page": "/", "action": "database_seeded", "version": "1.0.0"}'::JSONB,
  'FR',
  'Database Seed Script'
);