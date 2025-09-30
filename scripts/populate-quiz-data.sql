-- Script pour remplir la base de données avec 40 quiz bilingues
-- Couvre toutes les catégories et tous les niveaux de difficulté

-- ============================================
-- CATÉGORIE: IDENTITÉ (Documents d'identité)
-- ============================================

-- Niveau Facile (5 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Quelle est la durée de validité d''une carte nationale d''identité au Cameroun ?',
  'What is the validity period of a national ID card in Cameroon?',
  '["5 ans", "10 ans", "15 ans", "À vie"]'::jsonb,
  ARRAY['5 years', '10 years', '15 years', 'Lifetime'],
  '1',
  'La carte nationale d''identité camerounaise est valable 10 ans pour les adultes et 5 ans pour les mineurs.',
  'The Cameroonian national ID card is valid for 10 years for adults and 5 years for minors.',
  'identite',
  'FACILE'
),
(
  'Combien de temps faut-il pour obtenir une CNI au Cameroun ?',
  'How long does it take to get a national ID card in Cameroon?',
  '["1 semaine", "2-4 semaines", "2-3 mois", "6 mois"]'::jsonb,
  ARRAY['1 week', '2-4 weeks', '2-3 months', '6 months'],
  '1',
  'Le délai moyen est de 2 à 4 semaines après l''enrôlement biométrique.',
  'The average timeframe is 2 to 4 weeks after biometric enrollment.',
  'identite',
  'FACILE'
),
(
  'Quel est le coût d''obtention d''un passeport ordinaire au Cameroun ?',
  'What is the cost of obtaining an ordinary passport in Cameroon?',
  '["50,000 FCFA", "75,000 FCFA", "100,000 FCFA", "125,000 FCFA"]'::jsonb,
  ARRAY['50,000 FCFA', '75,000 FCFA', '100,000 FCFA', '125,000 FCFA'],
  '1',
  'Le coût d''un passeport ordinaire est de 75,000 FCFA pour les nationaux camerounais.',
  'The cost of an ordinary passport is 75,000 FCFA for Cameroonian nationals.',
  'identite',
  'FACILE'
),
(
  'Quel document est nécessaire pour obtenir un acte de naissance ?',
  'What document is needed to obtain a birth certificate?',
  '["Passeport", "Carte d''identité", "Permis de conduire", "Certificat de nationalité"]'::jsonb,
  ARRAY['Passport', 'ID card', 'Driver license', 'Nationality certificate'],
  '1',
  'Une carte d''identité valide est requise pour obtenir un acte de naissance.',
  'A valid ID card is required to obtain a birth certificate.',
  'identite',
  'FACILE'
),
(
  'À partir de quel âge peut-on obtenir une CNI au Cameroun ?',
  'From what age can you get a national ID card in Cameroon?',
  '["12 ans", "14 ans", "16 ans", "18 ans"]'::jsonb,
  ARRAY['12 years', '14 years', '16 years', '18 years'],
  '2',
  'On peut obtenir une carte nationale d''identité dès l''âge de 14 ans au Cameroun.',
  'You can get a national ID card from the age of 14 in Cameroon.',
  'identite',
  'FACILE'
);

-- Niveau Moyen (3 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Combien de photos d''identité faut-il pour faire une demande de CNI ?',
  'How many ID photos are needed for a national ID card application?',
  '["2 photos", "4 photos", "6 photos", "8 photos"]'::jsonb,
  ARRAY['2 photos', '4 photos', '6 photos', '8 photos'],
  '1',
  'Il faut généralement 4 photos d''identité récentes de format 4x4 cm pour constituer un dossier de CNI.',
  'You generally need 4 recent 4x4 cm ID photos to complete a national ID card application.',
  'identite',
  'MOYEN'
),
(
  'Quel est le délai de validité d''un passeport camerounais ordinaire ?',
  'What is the validity period of a Cameroonian ordinary passport?',
  '["3 ans", "5 ans", "7 ans", "10 ans"]'::jsonb,
  ARRAY['3 years', '5 years', '7 years', '10 years'],
  '1',
  'Le passeport ordinaire camerounais a une validité de 5 ans.',
  'The Cameroonian ordinary passport has a validity of 5 years.',
  'identite',
  'MOYEN'
),
(
  'Où doit-on déclarer une naissance au Cameroun ?',
  'Where should a birth be declared in Cameroon?',
  '["À la mairie", "Au centre de santé", "Au commissariat", "À la préfecture"]'::jsonb,
  ARRAY['At the town hall', 'At the health center', 'At the police station', 'At the prefecture'],
  '0',
  'Une naissance doit être déclarée à la mairie du lieu de naissance dans les 30 jours suivant l''accouchement.',
  'A birth must be declared at the town hall of the place of birth within 30 days of delivery.',
  'identite',
  'MOYEN'
);

-- Niveau Difficile (2 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Quel est le délai légal pour déclarer une naissance au Cameroun ?',
  'What is the legal timeframe to declare a birth in Cameroon?',
  '["15 jours", "30 jours", "45 jours", "60 jours"]'::jsonb,
  ARRAY['15 days', '30 days', '45 days', '60 days'],
  '1',
  'Selon la loi camerounaise, toute naissance doit être déclarée dans un délai de 30 jours.',
  'According to Cameroonian law, every birth must be declared within 30 days.',
  'identite',
  'DIFFICILE'
),
(
  'Combien coûte le renouvellement d''une CNI expirée au Cameroun ?',
  'How much does it cost to renew an expired national ID card in Cameroon?',
  '["Gratuit", "5,000 FCFA", "10,000 FCFA", "15,000 FCFA"]'::jsonb,
  ARRAY['Free', '5,000 FCFA', '10,000 FCFA', '15,000 FCFA'],
  '0',
  'Le renouvellement d''une CNI expirée est gratuit au Cameroun, seules les photos sont à la charge du demandeur.',
  'Renewing an expired national ID card is free in Cameroon, only photos are at the applicant''s expense.',
  'identite',
  'DIFFICILE'
);

-- ============================================
-- CATÉGORIE: ENTREPRISE
-- ============================================

-- Niveau Facile (5 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Quel est le capital minimum pour créer une SARL au Cameroun ?',
  'What is the minimum capital to create an LLC in Cameroon?',
  '["100,000 FCFA", "500,000 FCFA", "1,000,000 FCFA", "Aucun minimum"]'::jsonb,
  ARRAY['100,000 FCFA', '500,000 FCFA', '1,000,000 FCFA', 'No minimum'],
  '3',
  'Il n''y a pas de capital minimum obligatoire pour créer une SARL au Cameroun depuis 2017.',
  'There is no mandatory minimum capital to create an LLC in Cameroon since 2017.',
  'entreprise',
  'FACILE'
),
(
  'Combien de temps faut-il pour créer une entreprise au Cameroun ?',
  'How long does it take to create a business in Cameroon?',
  '["1 jour", "3-5 jours", "2 semaines", "1 mois"]'::jsonb,
  ARRAY['1 day', '3-5 days', '2 weeks', '1 month'],
  '1',
  'Avec le guichet unique, la création d''entreprise peut se faire en 3 à 5 jours.',
  'With the one-stop shop, business creation can be done in 3 to 5 days.',
  'entreprise',
  'FACILE'
),
(
  'Quel est le coût approximatif pour créer une entreprise individuelle au Cameroun ?',
  'What is the approximate cost to create a sole proprietorship in Cameroon?',
  '["15,000 FCFA", "50,000 FCFA", "100,000 FCFA", "200,000 FCFA"]'::jsonb,
  ARRAY['15,000 FCFA', '50,000 FCFA', '100,000 FCFA', '200,000 FCFA'],
  '1',
  'Le coût pour créer une entreprise individuelle est d''environ 50,000 FCFA au Cameroun.',
  'The cost to create a sole proprietorship is approximately 50,000 FCFA in Cameroon.',
  'entreprise',
  'FACILE'
),
(
  'Quel document est obligatoire pour créer une entreprise au Cameroun ?',
  'What document is mandatory to create a business in Cameroon?',
  '["Passeport", "CNI", "Permis de conduire", "Acte de naissance"]'::jsonb,
  ARRAY['Passport', 'National ID card', 'Driver license', 'Birth certificate'],
  '1',
  'La carte nationale d''identité est obligatoire pour toute création d''entreprise au Cameroun.',
  'The national ID card is mandatory for any business creation in Cameroon.',
  'entreprise',
  'FACILE'
),
(
  'Combien d''associés minimum faut-il pour créer une SARL ?',
  'How many partners minimum are needed to create an LLC?',
  '["1 associé", "2 associés", "3 associés", "5 associés"]'::jsonb,
  ARRAY['1 partner', '2 partners', '3 partners', '5 partners'],
  '0',
  'Une SARL peut être créée avec un seul associé (SARL unipersonnelle) au Cameroun.',
  'An LLC can be created with a single partner (single-person LLC) in Cameroon.',
  'entreprise',
  'FACILE'
);

-- Niveau Moyen (3 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Quelle est la durée minimale du bail commercial au Cameroun ?',
  'What is the minimum duration of a commercial lease in Cameroon?',
  '["1 an", "2 ans", "3 ans", "5 ans"]'::jsonb,
  ARRAY['1 year', '2 years', '3 years', '5 years'],
  '2',
  'La durée minimale d''un bail commercial est de 3 ans selon la législation camerounaise.',
  'The minimum duration of a commercial lease is 3 years according to Cameroonian legislation.',
  'entreprise',
  'MOYEN'
),
(
  'Quel est le taux de TVA standard au Cameroun ?',
  'What is the standard VAT rate in Cameroon?',
  '["15.5%", "17.5%", "19.25%", "21%"]'::jsonb,
  ARRAY['15.5%', '17.5%', '19.25%', '21%'],
  '2',
  'Le taux de TVA standard au Cameroun est de 19,25%.',
  'The standard VAT rate in Cameroon is 19.25%.',
  'entreprise',
  'MOYEN'
),
(
  'Combien d''employés faut-il pour être obligé de créer un comité d''entreprise ?',
  'How many employees are required to create a works council?',
  '["10 employés", "20 employés", "50 employés", "100 employés"]'::jsonb,
  ARRAY['10 employees', '20 employees', '50 employees', '100 employees'],
  '2',
  'Un comité d''entreprise doit être créé dès que l''entreprise emploie au moins 50 salariés.',
  'A works council must be created as soon as the company employs at least 50 employees.',
  'entreprise',
  'MOYEN'
);

-- Niveau Difficile (2 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Quel est le délai de dépôt de la déclaration fiscale annuelle pour les entreprises ?',
  'What is the deadline for filing the annual tax return for businesses?',
  '["31 janvier", "15 mars", "30 avril", "31 mai"]'::jsonb,
  ARRAY['January 31', 'March 15', 'April 30', 'May 31'],
  '1',
  'Les entreprises doivent déposer leur déclaration fiscale annuelle au plus tard le 15 mars de chaque année.',
  'Companies must file their annual tax return by March 15 of each year at the latest.',
  'entreprise',
  'DIFFICILE'
),
(
  'Quel est le taux de l''impôt sur les sociétés au Cameroun ?',
  'What is the corporate tax rate in Cameroon?',
  '["25%", "30%", "33%", "35%"]'::jsonb,
  ARRAY['25%', '30%', '33%', '35%'],
  '2',
  'Le taux de l''impôt sur les sociétés au Cameroun est de 33% pour les entreprises standard.',
  'The corporate tax rate in Cameroon is 33% for standard companies.',
  'entreprise',
  'DIFFICILE'
);

-- ============================================
-- CATÉGORIE: JURIDIQUE (Droit du travail)
-- ============================================

-- Niveau Facile (5 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Quel est le salaire minimum au Cameroun ?',
  'What is the minimum wage in Cameroon?',
  '["28,000 FCFA", "36,270 FCFA", "50,000 FCFA", "75,000 FCFA"]'::jsonb,
  ARRAY['28,000 FCFA', '36,270 FCFA', '50,000 FCFA', '75,000 FCFA'],
  '1',
  'Le SMIG (Salaire Minimum Interprofessionnel Garanti) est de 36,270 FCFA par mois.',
  'The SMIG (Guaranteed Interprofessional Minimum Wage) is 36,270 FCFA per month.',
  'juridique',
  'FACILE'
),
(
  'Combien de jours de congé payé par an a un travailleur au Cameroun ?',
  'How many days of paid leave per year does a worker in Cameroon have?',
  '["15 jours", "18 jours", "21 jours", "30 jours"]'::jsonb,
  ARRAY['15 days', '18 days', '21 days', '30 days'],
  '2',
  'Selon le Code du Travail, un travailleur a droit à 18 jours ouvrables de congé payé par an minimum.',
  'According to the Labor Code, a worker is entitled to 18 working days of paid leave per year minimum.',
  'juridique',
  'FACILE'
),
(
  'Quelle est la durée légale du travail par semaine au Cameroun ?',
  'What is the legal working time per week in Cameroon?',
  '["35 heures", "40 heures", "45 heures", "48 heures"]'::jsonb,
  ARRAY['35 hours', '40 hours', '45 hours', '48 hours'],
  '1',
  'La durée légale du travail est de 40 heures par semaine au Cameroun.',
  'The legal working time is 40 hours per week in Cameroon.',
  'juridique',
  'FACILE'
),
(
  'Quel est le préavis minimum pour une démission au Cameroun ?',
  'What is the minimum notice period for resignation in Cameroon?',
  '["15 jours", "1 mois", "2 mois", "3 mois"]'::jsonb,
  ARRAY['15 days', '1 month', '2 months', '3 months'],
  '1',
  'Le préavis minimum pour une démission est généralement d''un mois pour les employés.',
  'The minimum notice period for resignation is generally one month for employees.',
  'juridique',
  'FACILE'
),
(
  'À partir de combien de mois de grossesse une femme enceinte peut-elle prendre son congé maternité ?',
  'From how many months of pregnancy can a pregnant woman take maternity leave?',
  '["6 mois", "7 mois", "8 mois", "9 mois"]'::jsonb,
  ARRAY['6 months', '7 months', '8 months', '9 months'],
  '2',
  'Une femme enceinte peut prendre son congé de maternité à partir du 8ème mois de grossesse.',
  'A pregnant woman can take maternity leave from the 8th month of pregnancy.',
  'juridique',
  'FACILE'
);

-- Niveau Moyen (3 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Quelle est la durée totale du congé de maternité au Cameroun ?',
  'What is the total duration of maternity leave in Cameroon?',
  '["8 semaines", "10 semaines", "12 semaines", "14 semaines"]'::jsonb,
  ARRAY['8 weeks', '10 weeks', '12 weeks', '14 weeks'],
  '3',
  'Le congé de maternité est de 14 semaines au total (6 semaines avant l''accouchement et 8 semaines après).',
  'Maternity leave is 14 weeks in total (6 weeks before delivery and 8 weeks after).',
  'juridique',
  'MOYEN'
),
(
  'Combien d''heures supplémentaires maximum peut-on effectuer par semaine ?',
  'How many overtime hours maximum can be worked per week?',
  '["10 heures", "15 heures", "20 heures", "25 heures"]'::jsonb,
  ARRAY['10 hours', '15 hours', '20 hours', '25 hours'],
  '2',
  'Le nombre d''heures supplémentaires ne peut excéder 20 heures par semaine.',
  'The number of overtime hours cannot exceed 20 hours per week.',
  'juridique',
  'MOYEN'
),
(
  'Quel est le taux de majoration des heures supplémentaires de jour ?',
  'What is the overtime rate for daytime hours?',
  '["20%", "30%", "40%", "50%"]'::jsonb,
  ARRAY['20%', '30%', '40%', '50%'],
  '2',
  'Les heures supplémentaires de jour sont majorées de 40% du taux horaire normal.',
  'Daytime overtime hours are increased by 40% of the normal hourly rate.',
  'juridique',
  'MOYEN'
);

-- Niveau Difficile (2 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Quelle est la durée maximale d''un CDD au Cameroun ?',
  'What is the maximum duration of a fixed-term contract in Cameroon?',
  '["1 an", "2 ans", "3 ans", "5 ans"]'::jsonb,
  ARRAY['1 year', '2 years', '3 years', '5 years'],
  '1',
  'Un contrat à durée déterminée (CDD) ne peut excéder 2 ans, renouvellements inclus.',
  'A fixed-term contract (CDD) cannot exceed 2 years, including renewals.',
  'juridique',
  'DIFFICILE'
),
(
  'Combien de fois peut-on renouveler un CDD au Cameroun ?',
  'How many times can a fixed-term contract be renewed in Cameroon?',
  '["1 fois", "2 fois", "3 fois", "Illimité"]'::jsonb,
  ARRAY['1 time', '2 times', '3 times', 'Unlimited'],
  '1',
  'Un CDD peut être renouvelé 2 fois maximum. Au-delà, il devient automatiquement un CDI.',
  'A fixed-term contract can be renewed a maximum of 2 times. Beyond that, it automatically becomes a permanent contract.',
  'juridique',
  'DIFFICILE'
);

-- ============================================
-- CATÉGORIE: FONCIER (Propriété et terrain)
-- ============================================

-- Niveau Facile (3 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Quel document prouve la propriété d''un terrain au Cameroun ?',
  'What document proves land ownership in Cameroon?',
  '["Acte de vente", "Titre foncier", "Permis d''habiter", "Certificat d''urbanisme"]'::jsonb,
  ARRAY['Sale deed', 'Land title', 'Residence permit', 'Urban planning certificate'],
  '1',
  'Le titre foncier est le seul document qui prouve de manière incontestable la propriété d''un terrain.',
  'The land title is the only document that indisputably proves land ownership.',
  'foncier',
  'FACILE'
),
(
  'Combien coûte approximativement l''obtention d''un titre foncier au Cameroun ?',
  'What is the approximate cost of obtaining a land title in Cameroon?',
  '["50,000 FCFA", "150,000-500,000 FCFA", "1,000,000 FCFA", "5,000,000 FCFA"]'::jsonb,
  ARRAY['50,000 FCFA', '150,000-500,000 FCFA', '1,000,000 FCFA', '5,000,000 FCFA'],
  '1',
  'Le coût varie entre 150,000 et 500,000 FCFA selon la superficie et la localisation.',
  'The cost varies between 150,000 and 500,000 FCFA depending on the size and location.',
  'foncier',
  'FACILE'
),
(
  'Quelle est la durée de validité d''un permis de construire au Cameroun ?',
  'What is the validity period of a building permit in Cameroon?',
  '["6 mois", "1 an", "2 ans", "5 ans"]'::jsonb,
  ARRAY['6 months', '1 year', '2 years', '5 years'],
  '2',
  'Un permis de construire est valable 2 ans à partir de sa délivrance.',
  'A building permit is valid for 2 years from its issuance.',
  'foncier',
  'FACILE'
);

-- Niveau Moyen (2 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Combien de temps faut-il pour obtenir un titre foncier au Cameroun ?',
  'How long does it take to obtain a land title in Cameroon?',
  '["1-3 mois", "6-12 mois", "1-2 ans", "3-5 ans"]'::jsonb,
  ARRAY['1-3 months', '6-12 months', '1-2 years', '3-5 years'],
  '2',
  'L''obtention d''un titre foncier prend généralement entre 6 mois et 2 ans selon les régions.',
  'Obtaining a land title generally takes between 6 months and 2 years depending on the region.',
  'foncier',
  'MOYEN'
),
(
  'Quelle est la superficie minimale pour morceler un terrain au Cameroun ?',
  'What is the minimum area to subdivide land in Cameroon?',
  '["200 m²", "300 m²", "500 m²", "1000 m²"]'::jsonb,
  ARRAY['200 m²', '300 m²', '500 m²', '1000 m²'],
  '2',
  'La superficie minimale pour un morcellement varie selon les zones, mais est généralement de 300 m² en zone urbaine.',
  'The minimum area for subdivision varies by zone, but is generally 300 m² in urban areas.',
  'foncier',
  'MOYEN'
);

-- Niveau Difficile (2 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Quel pourcentage du terrain doit être réservé aux espaces verts en zone résidentielle ?',
  'What percentage of land must be reserved for green spaces in residential areas?',
  '["5%", "10%", "15%", "20%"]'::jsonb,
  ARRAY['5%', '10%', '15%', '20%'],
  '1',
  'En zone résidentielle, au moins 10% de la superficie doit être réservée aux espaces verts.',
  'In residential areas, at least 10% of the area must be reserved for green spaces.',
  'foncier',
  'DIFFICILE'
),
(
  'Quelle est la taxe foncière annuelle moyenne au Cameroun ?',
  'What is the average annual property tax in Cameroon?',
  '["0.1% de la valeur", "0.5% de la valeur", "1% de la valeur", "2% de la valeur"]'::jsonb,
  ARRAY['0.1% of value', '0.5% of value', '1% of value', '2% of value'],
  '0',
  'La taxe foncière représente environ 0.1% de la valeur vénale du bien immobilier.',
  'Property tax represents approximately 0.1% of the market value of the property.',
  'foncier',
  'DIFFICILE'
);

-- ============================================
-- CATÉGORIE: ÉDUCATION
-- ============================================

-- Niveau Facile (3 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'À quel âge commence l''école primaire au Cameroun ?',
  'At what age does primary school start in Cameroon?',
  '["4 ans", "5 ans", "6 ans", "7 ans"]'::jsonb,
  ARRAY['4 years', '5 years', '6 years', '7 years'],
  '2',
  'L''école primaire commence généralement à 6 ans au Cameroun.',
  'Primary school generally starts at age 6 in Cameroon.',
  'education',
  'FACILE'
),
(
  'Combien d''années dure le cycle primaire au Cameroun ?',
  'How many years does primary school last in Cameroon?',
  '["4 ans", "5 ans", "6 ans", "7 ans"]'::jsonb,
  ARRAY['4 years', '5 years', '6 years', '7 years'],
  '2',
  'Le cycle primaire dure 6 ans, de la classe de SIL (Cours d''Initiation au Langage) au CM2.',
  'Primary school lasts 6 years, from SIL (Language Initiation Course) to CM2.',
  'education',
  'FACILE'
),
(
  'Quel examen marque la fin du cycle primaire au Cameroun ?',
  'What exam marks the end of primary school in Cameroon?',
  '["BEPC", "CEP", "Baccalauréat", "Probatoire"]'::jsonb,
  ARRAY['BEPC', 'CEP', 'Baccalaureate', 'Probatoire'],
  '1',
  'Le Certificat d''Études Primaires (CEP) est l''examen de fin du cycle primaire.',
  'The Primary Education Certificate (CEP) is the end-of-primary-school exam.',
  'education',
  'FACILE'
);

-- Niveau Moyen (2 questions)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Combien d''années dure le premier cycle du secondaire au Cameroun ?',
  'How many years does the first cycle of secondary school last in Cameroon?',
  '["3 ans", "4 ans", "5 ans", "7 ans"]'::jsonb,
  ARRAY['3 years', '4 years', '5 years', '7 years'],
  '1',
  'Le premier cycle du secondaire dure 4 ans, de la 6ème à la 3ème.',
  'The first cycle of secondary school lasts 4 years, from 6th to 9th grade.',
  'education',
  'MOYEN'
),
(
  'Quel est le coût moyen des frais de scolarité dans une école primaire publique ?',
  'What is the average cost of tuition in a public primary school?',
  '["Gratuit", "5,000 FCFA", "15,000 FCFA", "50,000 FCFA"]'::jsonb,
  ARRAY['Free', '5,000 FCFA', '15,000 FCFA', '50,000 FCFA'],
  '0',
  'L''enseignement primaire public est officiellement gratuit au Cameroun depuis 2000.',
  'Public primary education has been officially free in Cameroon since 2000.',
  'education',
  'MOYEN'
);

-- Niveau Difficile (1 question)
INSERT INTO "QuizQuestion" (question, "questionEn", options, "optionsEn", answer, explanation, "explanationEn", category, difficulty) VALUES
(
  'Combien d''universités d''État compte le Cameroun ?',
  'How many state universities does Cameroon have?',
  '["4 universités", "6 universités", "8 universités", "10 universités"]'::jsonb,
  ARRAY['4 universities', '6 universities', '8 universities', '10 universities'],
  '2',
  'Le Cameroun compte 8 universités d''État réparties dans différentes régions du pays.',
  'Cameroon has 8 state universities spread across different regions of the country.',
  'education',
  'DIFFICILE'
);

-- Fin du script
-- Total: 40 questions (10 Identité, 10 Entreprise, 10 Juridique, 7 Foncier, 6 Éducation)
-- Répartition par difficulté: ~20 Facile, ~13 Moyen, ~10 Difficile
