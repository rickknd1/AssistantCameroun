-- Seed documents
INSERT INTO documents (type, category, title, reference, date, description, status) VALUES
('CODE', 'DROIT_PENAL', 'Code Pénal Camerounais', 'Loi N° 2016/007 du 12 juillet 2016', '2016-07-12', 'Code pénal de la République du Cameroun portant sur les infractions et les peines.', 'Actif'),
('CODE', 'DROIT_CIVIL', 'Code Civil Camerounais', 'Loi N° 2011/008 du 06 mai 2011', '2011-05-06', 'Code civil régissant les relations entre personnes privées au Cameroun.', 'Actif'),
('LOI', 'DROIT_TRAVAIL', 'Code du Travail', 'Loi N° 92/007 du 14 août 1992', '1992-08-14', 'Loi portant Code du travail au Cameroun.', 'Actif'),
('DECRET', 'ADMINISTRATION', 'Décret sur la Carte Nationale d''Identité', 'Décret N° 2016/375 du 04 août 2016', '2016-08-04', 'Décret fixant les modalités d''établissement de la carte nationale d''identité.', 'Actif'),
('LOI', 'COMMERCE', 'Loi sur les Sociétés Commerciales', 'Loi N° 2017/010 du 12 juillet 2017', '2017-07-12', 'Loi régissant les sociétés commerciales au Cameroun.', 'Actif'),
('CODE', 'DROIT_FONCIER', 'Ordonnance sur le Régime Foncier', 'Ordonnance N° 74-1 du 06 juillet 1974', '1974-07-06', 'Ordonnance fixant le régime foncier au Cameroun.', 'Actif')
ON CONFLICT DO NOTHING;
