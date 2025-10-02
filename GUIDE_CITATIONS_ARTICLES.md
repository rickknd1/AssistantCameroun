# Guide des Citations d'Articles avec Liens

## 🎯 Fonctionnalité Implémentée

L'assistant cite maintenant **systématiquement des articles juridiques** dans ses réponses avec des **liens hypertextes cliquables** vers les sections précises de la bibliothèque.

## ✅ Ce qui a été fait

### 1. **Amélioration du Prompt système** (`app/api/chat/route.ts`)

Le prompt a été renforcé avec :
- **Obligation de citer des articles** : L'assistant DOIT inclure au moins 1-2 liens par réponse juridique
- **Format strict** : `[Article X du Code Y](/bibliotheque/slug#article-x)`
- **Style de citation** : Utilisation de "Selon", "Conformément à", "Comme indiqué dans"
- **Placement inline** : Les liens sont intégrés naturellement dans le texte

### 2. **Stylisation des liens** (`components/assistant/chat-messages.tsx`)

Les liens sont maintenant :
- **Visuellement distincts** : Couleur primaire, soulignés, en gras
- **Hover effect** : Changement de couleur au survol
- **Cliquables** : Redirection vers la bibliothèque avec ancre vers la section précise

### 3. **URLs générées automatiquement**

Le système génère automatiquement des URLs de type :
```
/bibliotheque/{slug-du-document}#{ancre-de-la-section}
```

Exemples :
- `/bibliotheque/constitution-de-la-republique-du-cameroun#article-26`
- `/bibliotheque/code-penal-camerounais#article-1`
- `/bibliotheque/code-civil-camerounais#art-34`

## 📝 Exemples de Citations

### Format attendu dans les réponses :

**Exemple 1 :**
> Selon l'[Article 26 de la Constitution](/bibliotheque/constitution-de-la-republique-du-cameroun#article-26), tous les citoyens ont droit à l'égalité devant la loi.

**Exemple 2 :**
> Comme stipulé dans l'[Article 1 du Code Pénal](/bibliotheque/code-penal-camerounais#article-1), la loi pénale s'impose à tous.

**Exemple 3 :**
> Conformément à l'[Article 34 du Code Civil](/bibliotheque/code-civil-camerounais#art-34), les actes de l'état civil énonceront l'année, le jour et l'heure.

## 🧪 Comment Tester

### Test 1 : Question sur la CNI
**Question :** "Comment obtenir une CNI ?"

**Réponse attendue :** L'assistant devrait citer des articles du Décret N°2025059 avec des liens cliquables.

### Test 2 : Question juridique
**Question :** "Quels sont mes droits en tant que citoyen ?"

**Réponse attendue :** Citations d'articles de la Constitution avec liens.

### Test 3 : Question sur le travail
**Question :** "Quel est le salaire minimum au Cameroun ?"

**Réponse attendue :** Références au Code du Travail avec liens vers les articles spécifiques.

## 🔍 Vérification

Pour vérifier que tout fonctionne :

1. **Ouvrir le chat** sur l'application
2. **Poser une question juridique** (ex: "Qu'est-ce que l'article 1 du Code Pénal dit ?")
3. **Vérifier la présence de liens** : Les articles doivent apparaître en couleur et soulignés
4. **Cliquer sur un lien** : Doit rediriger vers `/bibliotheque/[document]#[section]`
5. **Vérifier l'ancre** : La page doit scroller automatiquement vers la section citée

## 📚 Documents avec Sections

Tous les documents suivants ont des sections et peuvent être cités :

1. ✅ Constitution de la République du Cameroun (80 sections)
2. ✅ Code Pénal Camerounais (351 articles)
3. ✅ Code Civil Camerounais (1000 sections avec 19 titres, 99 chapitres)
4. ✅ Code du Travail au Cameroun (191 sections)
5. ✅ Loi de Finances 2025 (16 sections)
6. ✅ Décret N°2025059 (52 sections)
7. ✅ Arrêté N° 1833 (1 section)

## 🎨 Style des Liens

Les liens apparaissent avec :
- **Couleur** : `text-primary` (couleur du thème)
- **Hover** : `text-primary/80` (légèrement plus clair)
- **Décoration** : `underline` (souligné)
- **Poids** : `font-medium` (texte en gras)
- **Transition** : Animation douce au survol

## 🚀 Prochaines Améliorations Possibles

1. Ajouter un tooltip au survol des liens montrant un aperçu de l'article
2. Mettre en surbrillance la section citée quand on arrive sur la page
3. Ajouter un bouton "Retour au chat" depuis la bibliothèque
4. Compteur de citations par document (statistiques)
