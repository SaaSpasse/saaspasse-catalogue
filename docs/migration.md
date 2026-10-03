# Migration du catalogue historique — 2 octobre 2026

Le dépôt conserve les sources du catalogue 2026 dans Git. Netlify publiera
uniquement `dist/` : page 404, robots.txt et les trois images historiques sans
prix. L'Edge Function traite les anciennes entrées HTML connues avant la
sortie statique, puis laisse les fichiers et vrais chemins inconnus à Netlify.
Aucun changement DNS ou certificat n'est nécessaire.

## Contrat

- `/`, `/index.html`, `/catalogue-public-saaspasse-2026.html` et
  `/produits SaaSpasse 2026.html` : 301 vers `https://saaspasse.com/collaborer`.
- `produit=annuels`, `employeur`, `conference`, `founder-dinners` : fiche finale,
  avec `#offer-title`; autres produits, vide et inconnu : hub `#offres`.
- Première occurrence de `produit` prioritaire, même vide; toutes ses occurrences
  consommées; autres paramètres, répétitions et Unicode conservés.
- Sans `produit`, aucun fragment imposé : le navigateur peut transmettre l'ancien
  fragment au pont de compatibilité du hub. La validation des fragments reste
  une recette navigateur de l'app et ne se réduit pas aux tests HTTP ici.
- Anciens documents Markdown et outils internes sans équivalent : 410.
- Trois images connues : 200 conservés; chemins et assets inconnus : vrais 404.
- Casse et espaces encodés des noms de fichier historiques sont acceptés.
- Destinations fixes exclusivement sur saaspasse.com; aucun open redirect.

## Inventaire et preuves

`url-manifest.json` inventorie les 22 fichiers du déploiement Netlify actuellement
publié, plus la racine, avec les réponses réellement observées et les statuts
attendus. Les sources ont été lues via `listSiteFiles`, puis les 23 routes ont
été vérifiées en GET sans suivre les redirects. Toutes retournent actuellement
200. L'inventaire Search Console/backlinks n'est pas accessible dans cette
session et doit compléter cet inventaire avant la bascule.

Aperçu créé et vérifié sans production :
https://6ac06a50978355ec0d5f52a7--saaspasse-catalogue.netlify.app
(déploiement `6ac06a50978355ec0d5f52a7`, source
`a7acce069af6d73b100260d67f2c1da60742afdc`).
`preview-validation.json` conserve les 86 contrôles GET/HEAD réussis :
statut, Location et `X-Robots-Tag: noindex` sur les entrées historiques,
queries, documents retirés, chemins inconnus, assets et robots.txt.
Le déploiement de production demeure `6a6ff4e4471ef20008002682`.

Reproduire ces contrôles avec `node scripts/verify-preview.mjs URL SHA_SOURCE`.
La preuve porte sur les redirects de l'aperçu; la destination publique et les
fragments navigateur ne sont pas déclarés validés avant la publication A1.

`npm test` : huit groupes couvrent GET/HEAD, mapping, produits arbitraires,
répétitions, Unicode, priorité produit, retrait 410, passthrough et noindex des
aperçus. `npm run build` vérifie la sortie minimale. `netlify build --context
deploy-preview --offline` valide la configuration et le bundle Edge sans
publication. Aucun HTML ou Markdown 2026 ne doit apparaître dans `dist/`.

## Activation

Valider d'abord les sept destinations publiques et le pont navigateur de l'app.
Faire ensuite valider un aperçu Netlify avec GET et HEAD (sans suivre puis avec
suivi), URLs encodées, query multiples et unknown 404/410. Contrôler également le
noindex de l'aperçu. Le push `main` déclenche automatiquement la production;
il n'est pas une étape de préparation. Conserver le déploiement historique
`6a6ff4e4471ef20008002682` comme référence et prévoir le retour arrière compatible
avec les destinations de l'app. Aucun déploiement de production effectué par
ce lot préparatoire.

Références de configuration :
[API Edge Netlify](https://docs.netlify.com/build/edge-functions/api/) et
[règles de redirection](https://docs.netlify.com/manage/routing/redirects/redirect-options/).
