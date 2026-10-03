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

La réauthentification OAuth via Chrome a rétabli l'accès au compte SaaSpasse,
avec scopes workers/scripts/routes write et account/user/zone read, sans droit
DNS. Version candidate non active chargée :
`009384da-a945-4560-ba4f-7706f2fd1e57`, annotation exacte
`git:140466bd896e410c3485d6abfa6da338630dd29b`, créée le
`2026-10-03T02:42:17.95439Z` (2 octobre au Québec). Le binding
`SAASPASSE_WORKER_ORIGIN_SECRET` est présent avec type `secret_text`;
aucune valeur n'a été lue, affichée ou changée.

Les snapshots JSON avant/après upload sont identiques : déploiement actif
`6c134c72-6a60-403c-8924-b8aaa5f991e5`, stable legacy
`087e8d4e-6e77-40b9-967e-84bf39987165` à 100 % et ancien candidat
origin-auth `557906f1-0757-435c-9a7c-09ace09a26f4` à 0 %.
`worker-candidate-receipt.json` conserve le reçu, sans données de secret.

**Cette candidate ne doit pas être promue pour le seul catalogue.** Le code de
la branche distante récente inclut origin-auth, jamais activé en production.
Voir `worker-live-diff.md` : headers réservés, secret POST et politique de
suivi des redirects de l'origine changeraient également. La parité de ces
comportements avec la production n'est pas attestée par l'upload ou les tests
locaux. Recommandation : porter uniquement les deux redirects sur la source
active historiquement associée à `4c736998bc0f1e1c52640919ee0c48d4a4899ef1`,
en préservant ses autres comportements et les bindings déjà provisionnés,
ou valider origin-auth dans un lot distinct explicitement reconnu.

Le workflow existant autorise l'upload uniquement sur push `master`;
workflow_dispatch propose stage/promote/rollback, uniquement sur `master`.
L'environnement GitHub `production` exige reviewer `SaaSpasse` et branche
`master`. Il ne fournit pas de chemin d'upload candidate d'une branche de
travail. La présente candidate a été chargée avec le CLI authentifié, sans
nouveau déploiement actif.

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
présentes preuves sont de préparation, de Version inactive et d'aperçu,
pas de validation d'une bascule de production.
