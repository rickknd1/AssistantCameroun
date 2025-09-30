-- Seed quiz questions
INSERT INTO quiz_questions (category, difficulty, question, options, correct_answer, explanation) VALUES
(
  'Droit Civil',
  'Facile',
  'À partir de quel âge est-on majeur au Cameroun ?',
  '["16 ans", "18 ans", "21 ans", "25 ans"]'::jsonb,
  '18 ans',
  'Au Cameroun, la majorité civile est fixée à 18 ans selon le Code Civil. À cet âge, une personne acquiert la pleine capacité juridique.'
),
(
  'Droit Civil',
  'Moyen',
  'Quelle est la durée légale du congé de maternité au Cameroun ?',
  '["8 semaines", "12 semaines", "14 semaines", "16 semaines"]'::jsonb,
  '14 semaines',
  'Selon le Code du Travail camerounais, le congé de maternité est de 14 semaines, dont 8 semaines après l''accouchement.'
),
(
  'Procédures',
  'Facile',
  'Quelle est la durée de validité d''une CNI pour un adulte ?',
  '["5 ans", "7 ans", "10 ans", "15 ans"]'::jsonb,
  '10 ans',
  'La Carte Nationale d''Identité camerounaise est valable 10 ans pour les adultes et 5 ans pour les mineurs.'
),
(
  'Droit Pénal',
  'Difficile',
  'Quel est l''âge de la responsabilité pénale au Cameroun ?',
  '["10 ans", "12 ans", "14 ans", "16 ans"]'::jsonb,
  '10 ans',
  'Au Cameroun, l''âge de la responsabilité pénale est fixé à 10 ans. En dessous de cet âge, un enfant ne peut pas être poursuivi pénalement.'
),
(
  'Entreprise',
  'Moyen',
  'Quel est le capital social minimum pour créer une SARL au Cameroun ?',
  '["50 000 FCFA", "100 000 FCFA", "500 000 FCFA", "1 000 000 FCFA"]'::jsonb,
  '100 000 FCFA',
  'Le capital social minimum pour créer une SARL au Cameroun est de 100 000 FCFA, bien qu''il puisse être fixé librement par les associés.'
),
(
  'Culture',
  'Facile',
  'Combien de langues officielles le Cameroun a-t-il ?',
  '["1", "2", "3", "4"]'::jsonb,
  '2',
  'Le Cameroun a deux langues officielles : le français et l''anglais, héritage de son passé colonial.'
)
ON CONFLICT DO NOTHING;
