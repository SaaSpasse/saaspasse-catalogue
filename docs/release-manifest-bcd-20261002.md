# Preuves des lots B/C/D — 2 octobre 2026

Préparation sur branches isolées. Des branches de PR ont été poussées pour
produire les aperçus Git, sans push des branches de production, changement DNS,
merge, publication de production, stage ou promotion Cloudflare.

| Lot | Code et preuve immuables | Résultat |
| --- | --- | --- |
| B — Worker legacy | Source `77e30775c9fe9df09fef3469c0404b797f4b0022`, candidate inactive `c11c9f26-4484-4bdf-8c69-500792db77c8` | Reçu avant/après identique; stable `087e8d4e` à 100 %, source legacy avec seulement les deux aliases catalogue |
| C — catalogue Netlify | Source `d94809c6459fb650a5a3efe584120f14ab5484bc`, aperçu `6ac06d6eb0ca1000087e59ab` | 86 contrôles GET/HEAD indépendants réussis sous Node 22.23.3 |
| D — Conf | Source `7a61024a157f9deb00a7d2110891010665f15b38`, aperçu `6ac06f575d139c00084d3239` | Build Node 22.23.3 réussi; 17 réponses HTTP et 3 nouveaux liens rendus vérifiés; navigateur à 390 et 1280 px |

## B — Worker

Les deux anciens chemins certification rejoignent directement
`https://saaspasse.com/certification#employeurs`, avec queries conservées.
La publication catalogue préparée utilise la source legacy historique
`4c736998bc0f1e1c52640919ee0c48d4a4899ef1` avec ces deux aliases seulement.
La correspondance historique `4c` → Version `087` est une attestation du
runbook; elle n'est pas une annotation Git native de cette Version.

La candidate inactive `c11c9f26-4484-4bdf-8c69-500792db77c8` porte en revanche
l'annotation native complète `git:77e30775c9fe9df09fef3469c0404b797f4b0022` et
l'etag `256866ad79537abd4e72edaa68e00fa27d6a87916da1659a045c95718aa01100`.
`worker-legacy-candidate-receipt.json` atteste le chargement inactif et l'état
avant/après identique : déploiement `6c134c72-6a60-403c-8924-b8aaa5f991e5`,
stable `087e8d4e-6e77-40b9-967e-84bf39987165` à 100 %, ancien candidat
`557906f1-0757-435c-9a7c-09ace09a26f4` à 0 %.

Un binding `SAASPASSE_WORKER_ORIGIN_SECRET` dormant a été hérité par la
candidate; aucune valeur n'a été lue, effacée ou changée. Le garde-fou du lot
Worker compare exactement la source hors aliases, les outils et la
configuration legacy; le proxy legacy ne lit pas ce binding. Les 101 tests,
types, bindings générés et audit de SHA77 sont attestés dans son lot distinct.

L'extension de workflow en revue est la
[PR #3 Worker](https://github.com/SaaSpasse/dynamic-metadata-with-cloudflare-worker/pull/3),
SHA `592a80051a6fb82a92816d7e3b9bae49152bc6f6`. Elle prépare un chemin contrôlé
pour le SHA legacy publié, depuis `master`, avec identité source/Version/etag
épinglée, garde-fou de parité, stage 100/0, canari GET/HEAD avant promotion,
verrou de mutation commun et rollback vers `087`. Le job conserve
l'environnement GitHub `production`, sa branche `master` et l'approbateur
humain. Aucun dispatch, approbation ou changement de trafic n'a été effectué.
Le workflow historique seul n'autorise pas cette candidate legacy; l'extension
doit être revue et publiée avant son usage.

Le merge de la PR du workflow peut déclencher l'ancien job d'upload advanced
inactif. Ce job ne fait pas partie de la publication catalogue; sa demande
d'approbation et son verrou commun doivent être traités séparément avant le
dispatch legacy. Aucun approbateur ne doit le confondre avec le stage catalogue.

La candidate advanced `009384da-a945-4560-ba4f-7706f2fd1e57` ne doit jamais être
promue pour ce lot catalogue : elle ajouterait origin-auth au routeur actif.
Son ancien reçu `worker-candidate-receipt.json` reste une preuve historique
de chargement inactif, pas la candidate retenue. Voir `worker-live-diff.md`.

## C — ancien catalogue

Site Netlify `b79b83a0-7552-4a78-86cc-1dad593fe1ee`, HTTPS conservé.
Production inchangée `6a6ff4e4471ef20008002682`. Base distante
`aeebd3a2ee07120540e168867a118ecad842d76b`.
Inventaire API exact : 22 fichiers publiés + racine; GET observés à 200.
`url-manifest.json` donne le statut attendu de chaque entrée.

Les sources 2026 sont archivées dans Git; `dist/` conserve seulement 404,
robots.txt et trois PNG sans prix. Les vieux HTML/Markdown/outils ne sont
plus publiés. Le mapping Edge traite les queries répétées, Unicode, premier
produit explicite même vide, 410 et vrais chemins inconnus. Les huit groupes
unitaires, le build minimal et le bundle Edge avaient été validés pour ce code.

Aperçu Git de la
[PR #3 catalogue](https://github.com/SaaSpasse/saaspasse-catalogue/pull/3) :
https://6ac06d6eb0ca1000087e59ab--saaspasse-catalogue.netlify.app

`preview-validation.json` conserve les 86 réponses réelles GET/HEAD conformes,
avec noindex, contrôlées le `2026-10-03T02:52:08.025Z` (2 octobre au Québec).
Cette preuve remplace celle de l'ancien aperçu draft `6ac06a50978355ec0d5f52a7`.
Le suivi jusqu'aux futures pages finales et les fragments navigateur doivent
encore être vérifiés après A1. Search Console/backlinks reste à compléter.

## D — conférence

Site Netlify `fddbe58e-b31a-4b64-a97a-1ae7c7767e0f`, base distante
`5debc410470b9e1d75df3248717cf69ae191c218`.
La [PR #1 Conf](https://github.com/SaaSpasse/conf26-site/pull/1) ajoute trois
liens rendus vers `https://saaspasse.com/collaborer/commandite-conference`,
sans fragment imposé : footer accueil, bloc 2027 et footer commanditaires.
L'ajout dans `InnerColophon.astro`, inutilisé, a été retiré en SHA `7a61024`.
Le nouveau bloc reste distinct des huit commanditaires et paliers 2026.

Aperçu Git final :
https://6ac06f575d139c00084d3239--conf-saaspasse-2026.netlify.app

`conf-preview-validation.json` atteste 12 GET/HEAD à 200/noindex sur `/`,
`/commanditaires/`, `/programmation/`, `/keynote-1/`, `/keynote-3/` et `/25/`,
puis cinq GET à 301/noindex pour la normalisation du slash. Les canoniques
Conf des pages 2026 restent publics. L'archive `/25/` est byte-identique au
fichier historique (elle n'a pas de canonical, comportement conservé).
Luma et ses paramètres sont identiques à `src/data/ticketing.ts`.

Le navigateur Chromium isolé a suivi accueil → commanditaires → retour,
vérifié les trois href et Luma sans les ouvrir, puis le rendu à 390 et
1280 px. Le bloc 2027 ne déborde pas; son CTA principal mesure 44 px de haut.
Aucune action de courriel, inscription, Auth, notes ou vote. Aucun déploiement
Netlify manuel ni push `main`; seul le push de branche produit l'aperçu Git.
Le parcours jusqu'à la fiche publique reste à valider après A1.

## Ordre de bascule restant

Valider d'abord les sept destinations publiques A1 et leur repli compatible.
Rejouer ensuite les recettes de suivi B/C/D contre ces destinations. Publier
les lots coordonnés avec checks et revues requis : le canari Worker et son
approbation humaine demeurent nécessaires. Compléter Search Console et le
contrôle des liens après publication. Ces preuves attestent préparation,
Version inactive et aperçus; elles n'attestent pas une bascule de production.
