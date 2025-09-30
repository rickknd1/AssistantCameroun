-- Seed news articles
INSERT INTO news_articles (category, title, summary, content, image_url, source, published_at, read_time, is_featured) VALUES
(
  'Juridique',
  'Nouvelle loi sur la protection des données personnelles',
  'Le Cameroun adopte une nouvelle législation pour renforcer la protection des données personnelles des citoyens.',
  'Le gouvernement camerounais a récemment adopté une nouvelle loi visant à renforcer la protection des données personnelles. Cette législation s''inscrit dans le cadre des efforts du pays pour se conformer aux standards internationaux en matière de protection de la vie privée...',
  '/cameroon-government-building.jpg',
  'Ministère de la Justice',
  NOW() - INTERVAL ''2 days'',
  5,
  true
),
(
  'Administratif',
  'Digitalisation des procédures administratives',
  'Le gouvernement lance une plateforme en ligne pour faciliter les démarches administratives des citoyens.',
  'Dans le cadre de la modernisation de l''administration publique, le gouvernement camerounais a lancé une nouvelle plateforme numérique permettant aux citoyens d''effectuer certaines démarches administratives en ligne...',
  '/cameroon-id-card-digital.jpg',
  'Ministère de l''Administration Territoriale',
  NOW() - INTERVAL ''5 days'',
  4,
  false
),
(
  'Entreprise',
  'Réforme du Code du Travail en discussion',
  'Les partenaires sociaux discutent d''une réforme du Code du Travail pour l''adapter aux réalités actuelles.',
  'Les représentants des employeurs, des travailleurs et du gouvernement se sont réunis pour discuter d''une éventuelle réforme du Code du Travail camerounais. L''objectif est d''adapter la législation du travail aux nouvelles réalités économiques et sociales...',
  '/cameroon-workers-office.jpg',
  'Ministère du Travail',
  NOW() - INTERVAL ''1 week'',
  6,
  false
)
ON CONFLICT DO NOTHING;
