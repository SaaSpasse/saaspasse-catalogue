# Preuves des lots B/C/D — 2 octobre 2026

Préparation isolée sur bases distantes actualisées, sans modification des
checkouts historiques. Aucun push Git, changement DNS, publication de
production ou promotion Cloudflare n'a été effectué.

| Lot | Base distante | Commit de code préparé | Preuve |
| --- | --- | --- | --- |
| B — Worker | `fbd1f8f8e5c15ccdcb17a9e35ff3918c2df1da03` | `140466bd896e410c3485d6abfa6da338630dd29b` | `npm run check` réussi : 108 tests, TypeScript, bindings générés et audit à zéro |
| C — catalogue Netlify | `aeebd3a2ee07120540e168867a118ecad842d76b` | `a7acce069af6d73b100260d67f2c1da60742afdc` | Huit groupes de tests, build minimal et bundle Edge réussis; aperçu `6ac06a50978355ec0d5f52a7`, 86 contrôles GET/HEAD réussis |
| D — Conf | `5debc410470b9e1d75df3248717cf69ae191c218` | `a33fa51ff01b624e78c68cc6f377a788175efcbf` | Build Astro et garde ressources réussis; HTML de quatre parcours contient les liens finaux, sans localhost et avec canoniques Conf conservés |

## B — Worker

Les deux anciennes routes certification rejoignent directement
`https://saaspasse.com/certification#employeurs`, avec queries conservées.
La matrice supplémentaire de 96 cas couvre les deux routes, GET/HEAD,
HTTP/HTTPS, hôtes saaspasse/www/app, slash final et chemins encodés. Les
redirects historiques sont composés avant la normalisation des hôtes.

Le check obligatoire bloquait initialement sur cinq vulnérabilités des outils
préexistants. Overrides patch ciblés `sharp 0.35.4` et `undici 7.29.1` les
corrigent sans changement de major ni suppression du contrôle d'audit.

Le CLI Cloudflare n'est plus authentifié : OAuth expiré. Aucun UUID de
candidate n'est déclaré. Le workflow existant autorise l'upload uniquement
sur push `master`; son workflow_dispatch propose stage/promote/rollback,
uniquement sur `master`. L'environnement GitHub `production` a un reviewer
`SaaSpasse` et une politique de branche. Le lancement sur une branche de
travail ne fournit donc pas un chemin d'upload candidate existant.

Après authentification dans Chrome avec `npx wrangler login --browser=false`,
vérifier le compte, le déploiement actif et le checkout propre exact, puis
charger seulement la Version non active :

```sh
npx wrangler versions upload --message git:140466bd896e410c3485d6abfa6da338630dd29b
```

Le canari canonique Version Override demande ensuite le stage explicite
(stable 100 %, candidate 0 %). Aucune étape stage/promote/secret/DNS n'est
autorisée par cette préparation. Les tests locaux n'attestent pas la Version
de production ou les secrets distants.

## C — ancien catalogue

Site Netlify `b79b83a0-7552-4a78-86cc-1dad593fe1ee`, HTTPS conservé.
Référence de production inchangée `6a6ff4e4471ef20008002682`.
Inventaire API exact : 22 fichiers publiés + racine; GET observés à 200.
`url-manifest.json` donne le statut de migration attendu de chaque entrée.
Les sources 2026 demeurent archivées dans Git; `dist/` ne conserve que 404,
robots.txt et trois PNG sans prix. Les vieux HTML/Markdown/outils ne sont
plus dans la sortie publique. Le mapping Edge fixe gère les query répétées,
Unicode, le produit explicite prioritaire, les 410 et les chemins inconnus.

Aperçu : https://6ac06a50978355ec0d5f52a7--saaspasse-catalogue.netlify.app

`preview-validation.json` atteste 86 réponses GET/HEAD conformes et noindex.
Le suivi jusqu'aux futures pages finales et les fragments navigateur restent
à valider avec A1. L'inventaire Search Console/backlinks reste à compléter.

## D — conférence

Site Netlify `fddbe58e-b31a-4b64-a97a-1ae7c7767e0f`. CTA dans les deux
footers et la page commanditaires, vers
`https://saaspasse.com/collaborer/commandite-conference`. Le nouveau bloc
2027 est distinct des huit commanditaires et paliers 2026. Luma, billets,
archives, ressources et canoniques 2026 sont conservés.

Le HTML de production a été contrôlé sur `/`, `/commanditaires`, `/aqc` et
`/r/guillaume-jacquet`. Le dépôt interdit `netlify deploy` manuel : aucun
aperçu distant D n'a été créé. Le build local est valide; l'aperçu Git et
le parcours jusqu'à la fiche publique seront contrôlés après coordination.

## Ordre de bascule restant

Valider d'abord les destinations publiques A1 et leur repli compatible.
Puis traiter les publications B/C/D coordonnées, preuves canari et parcours
navigateur; Search Console et contrôle des liens après publication. Les
présentes preuves sont de préparation et d'aperçu, pas de production.
