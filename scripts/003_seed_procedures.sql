-- Seed procedures
INSERT INTO procedures (slug, category, name, duration, cost, difficulty, description, steps, documents_required, costs_detail, locations, tips, faqs) VALUES
(
  'carte-nationale-identite',
  'Identité & État civil',
  'Obtenir une Carte Nationale d''Identité (CNI)',
  '2-4 semaines',
  '5 000 FCFA',
  'Facile',
  'Procédure pour obtenir ou renouveler votre carte nationale d''identité camerounaise.',
  '[
    {"step": 1, "title": "Retrait du formulaire", "description": "Se rendre au centre d''enrôlement le plus proche pour retirer le formulaire de demande de CNI."},
    {"step": 2, "title": "Remplissage du formulaire", "description": "Remplir soigneusement le formulaire avec vos informations personnelles exactes."},
    {"step": 3, "title": "Constitution du dossier", "description": "Rassembler tous les documents requis (acte de naissance, certificat de nationalité, photos)."},
    {"step": 4, "title": "Dépôt du dossier", "description": "Déposer le dossier complet au centre d''enrôlement avec paiement des frais."},
    {"step": 5, "title": "Enrôlement biométrique", "description": "Passer l''enrôlement biométrique (photo, empreintes digitales)."},
    {"step": 6, "title": "Retrait de la CNI", "description": "Retirer votre CNI après notification (2-4 semaines)."}
  ]'::jsonb,
  '[
    "Acte de naissance (original + 2 copies)",
    "Certificat de nationalité (original + 2 copies)",
    "4 photos d''identité récentes (4x4 cm, fond blanc)",
    "Ancienne CNI (pour renouvellement)"
  ]'::jsonb,
  '[
    {"item": "Frais d''établissement", "amount": "5 000 FCFA"},
    {"item": "Photos d''identité", "amount": "1 000 FCFA (environ)"}
  ]'::jsonb,
  '[
    {"name": "Centre d''enrôlement de Yaoundé Centre", "address": "Avenue Kennedy, Yaoundé", "hours": "Lun-Ven: 8h-15h"},
    {"name": "Centre d''enrôlement de Douala Akwa", "address": "Boulevard de la Liberté, Douala", "hours": "Lun-Ven: 8h-15h"}
  ]'::jsonb,
  '[
    "Arrivez tôt le matin pour éviter les longues files d''attente",
    "Vérifiez que toutes vos copies sont certifiées conformes",
    "Portez une tenue correcte pour la photo biométrique",
    "Conservez votre récépissé de dépôt précieusement"
  ]'::jsonb,
  '[
    {"question": "Quelle est la durée de validité de la CNI ?", "answer": "La CNI camerounaise est valable 10 ans pour les adultes et 5 ans pour les mineurs."},
    {"question": "Puis-je faire ma CNI dans n''importe quel centre ?", "answer": "Oui, vous pouvez vous faire enrôler dans n''importe quel centre d''enrôlement sur le territoire national."},
    {"question": "Que faire si ma CNI est perdue ou volée ?", "answer": "Vous devez faire une déclaration de perte au commissariat, puis demander un duplicata avec cette déclaration."}
  ]'::jsonb
),
(
  'acte-naissance',
  'Identité & État civil',
  'Obtenir un Acte de Naissance',
  '1-2 semaines',
  '1 000 FCFA',
  'Facile',
  'Procédure pour obtenir un acte de naissance ou un extrait d''acte de naissance.',
  '[
    {"step": 1, "title": "Identification du centre d''état civil", "description": "Identifier le centre d''état civil du lieu de naissance."},
    {"step": 2, "title": "Demande écrite", "description": "Rédiger une demande manuscrite précisant vos informations (nom, prénom, date et lieu de naissance)."},
    {"step": 3, "title": "Paiement des frais", "description": "Payer les frais de délivrance au guichet."},
    {"step": 4, "title": "Retrait de l''acte", "description": "Retirer l''acte de naissance après le délai indiqué."}
  ]'::jsonb,
  '[
    "Demande manuscrite",
    "Pièce d''identité du demandeur",
    "Frais de timbre"
  ]'::jsonb,
  '[
    {"item": "Extrait d''acte de naissance", "amount": "1 000 FCFA"},
    {"item": "Copie intégrale", "amount": "1 500 FCFA"}
  ]'::jsonb,
  '[
    {"name": "Centre d''État Civil de Yaoundé", "address": "Hôtel de Ville, Yaoundé", "hours": "Lun-Ven: 7h30-15h30"},
    {"name": "Centre d''État Civil de Douala", "address": "Hôtel de Ville, Douala", "hours": "Lun-Ven: 7h30-15h30"}
  ]'::jsonb,
  '[
    "Pour une demande urgente, précisez-le dans votre demande",
    "Vous pouvez mandater quelqu''un avec une procuration",
    "Conservez toujours des copies certifiées de vos actes"
  ]'::jsonb,
  '[
    {"question": "Combien de temps faut-il pour obtenir un acte de naissance ?", "answer": "En général, comptez 1 à 2 semaines, mais cela peut être plus rapide pour les demandes urgentes."},
    {"question": "Puis-je obtenir l''acte de naissance d''une autre personne ?", "answer": "Oui, avec une procuration légalisée de la personne concernée."}
  ]'::jsonb
),
(
  'creation-entreprise',
  'Entreprise',
  'Créer une Entreprise (SARL)',
  '4-6 semaines',
  '150 000 - 300 000 FCFA',
  'Moyen',
  'Procédure complète pour créer une Société à Responsabilité Limitée (SARL) au Cameroun.',
  '[
    {"step": 1, "title": "Choix du nom commercial", "description": "Vérifier la disponibilité du nom au CFCE et réserver le nom."},
    {"step": 2, "title": "Rédaction des statuts", "description": "Rédiger les statuts de la société (seul ou avec un notaire)."},
    {"step": 3, "title": "Dépôt du capital social", "description": "Déposer le capital social minimum (100 000 FCFA) dans une banque."},
    {"step": 4, "title": "Enregistrement au CFCE", "description": "Déposer le dossier complet au Centre de Formalités de Création d''Entreprises."},
    {"step": 5, "title": "Publication au journal", "description": "Publier un avis de création dans un journal d''annonces légales."},
    {"step": 6, "title": "Obtention du RCCM", "description": "Recevoir le Registre du Commerce et du Crédit Mobilier."},
    {"step": 7, "title": "Immatriculation fiscale", "description": "S''immatriculer auprès des impôts pour obtenir le NIU."}
  ]'::jsonb,
  '[
    "Demande de création d''entreprise",
    "Statuts de la société (3 exemplaires originaux)",
    "Attestation de dépôt de capital social",
    "Pièces d''identité des associés et gérants",
    "Certificat de résidence ou bail commercial",
    "Casier judiciaire du gérant (moins de 3 mois)"
  ]'::jsonb,
  '[
    {"item": "Frais CFCE", "amount": "50 000 FCFA"},
    {"item": "Publication journal", "amount": "30 000 - 50 000 FCFA"},
    {"item": "Frais notaire (optionnel)", "amount": "100 000 - 200 000 FCFA"},
    {"item": "Autres frais administratifs", "amount": "20 000 - 50 000 FCFA"}
  ]'::jsonb,
  '[
    {"name": "CFCE Yaoundé", "address": "Immeuble CFCE, Quartier Bastos, Yaoundé", "hours": "Lun-Ven: 8h-16h"},
    {"name": "CFCE Douala", "address": "Boulevard de la Liberté, Douala", "hours": "Lun-Ven: 8h-16h"}
  ]'::jsonb,
  '[
    "Préparez tous vos documents avant de vous rendre au CFCE",
    "Le capital social minimum est de 100 000 FCFA mais peut être plus élevé selon vos besoins",
    "Faites-vous accompagner par un expert-comptable pour éviter les erreurs",
    "Prévoyez un budget supplémentaire pour les imprévus"
  ]'::jsonb,
  '[
    {"question": "Quel est le capital minimum pour créer une SARL ?", "answer": "Le capital social minimum est de 100 000 FCFA, mais il peut être fixé librement par les associés."},
    {"question": "Combien d''associés faut-il pour une SARL ?", "answer": "Une SARL peut être constituée par 1 à 50 associés."},
    {"question": "Puis-je créer mon entreprise seul ?", "answer": "Oui, vous pouvez créer une SARL unipersonnelle (SARLU) avec un seul associé."}
  ]'::jsonb
)
ON CONFLICT (slug) DO NOTHING;
