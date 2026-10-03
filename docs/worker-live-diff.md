# Worker : écart entre la source préparée et la production active

La Version active legacy est `087e8d4e-6e77-40b9-967e-84bf39987165` à 100 %.
Son etag observé `d62c660d1a55c006d95e634dd71baeb8461d0cfb2a2ca5bb63d1f03bec79be78`
correspond exactement à `.github/worker-release-baselines.json` du dépôt
Worker. Cette Version n'a aucune annotation Git native et aucun binding.

Le journal partagé du 18 août, `saaspasse-app/memory/wrap_2026-08-18.md`,
section « Livraison et vérification », associe explicitement la publication
manuelle de cette Version à la fusion de la PR Worker #1, commit `4c73699`.
La résolution Git donne `4c736998bc0f1e1c52640919ee0c48d4a4899ef1`.
L'association SHA/Version est donc une preuve historique documentée;
l'attestation distante native est UUID+etag, pas une annotation Git inventée.

## Changements inclus dans la candidate `140466b`

Outre le mapping de certification et les normalisations de ses liens, la
candidate part du main distant `fbd1f8f`, qui inclut le durcissement origin-auth
de la PR #2. Son ancien candidat `557906f1-0757-435c-9a7c-09ace09a26f4` demeure
à 0 % dans le déploiement actif. La nouvelle candidate
`009384da-a945-4560-ba4f-7706f2fd1e57` n'appartient pas à ce déploiement.

| Comportement | Source legacy `4c73699` | Candidate `140466b` |
| --- | --- | --- |
| Headers réservés entrants | `x-saaspasse-origin-secret` et `x-saaspasse-public-host` transmis avec la requête clonée | Supprimés systématiquement sur GET/POST |
| Preuve d'origine sur POST | Aucune preuve reconstruite par le Worker | Secret et hôte reconstruits ensemble seulement si secret ASCII valide (32–256 caractères) et hôte public autorisé |
| Binding origin secret | Aucun binding dans la Version active | `SAASPASSE_WORKER_ORIGIN_SECRET` requis dans la configuration et présent comme `secret_text` dans la candidate |
| Sous-requête Vercel | `fetch(proxied)` avec la politique du Request cloné | `fetch(proxied, { redirect: "manual" })` impose explicitement l'absence de suivi automatique |
| Hôte forwarded | `url.host` | `url.hostname` (exclusion d'un port éventuel) |
| Redirections historiques hors certification | Hôtes www/app normalisés avant mapping, chemins bruts | Tous les mappings composés avant les hôtes, avec décodage des chemins et vérification own-property |

Le dernier changement dépasse les deux routes certification : les anciens
épisodes/profils encodés et liens www/app pourraient également perdre un saut
ou être reconnus différemment. Il est utile, mais n'est pas indispensable à la
sortie du catalogue. Pour un lot strict, appliquer la composition anticipée
et le décodage uniquement aux deux anciennes certifications, puis laisser le
reste du routeur actif intact.

## Recommandation

Ne pas promouvoir la candidate `009384da...` au titre du seul catalogue.
Préparer un portage limité des deux redirects à partir de la source active
historiquement documentée `4c73699`, conserver la politique de proxy et les
autres redirections de cette source, et laisser les bindings provisionnés
inchangés. Les outils et validations modernes peuvent être conservés, mais
leurs tests doivent exercer ce routeur effectivement proposé.

Autre voie : reconnaître origin-auth comme dépendance distincte, valider les
POST du domaine canonique et les protections de l'app avec la vraie Version,
puis le promouvoir séparément. Les tests simulés et la présence du nom de
binding ne prouvent ni la parité du secret avec Vercel ni le fonctionnement
réel des parcours de production. Le canari CAPTCHA impose son propre vrai
navigateur et sa sonde sans création de compte selon AGENTS.md.

Un PR Git sur `master` doit exposer explicitement cette différence de code
actif : fusionner le lot sur une branche distante récente ne signifie pas
que ses prérequis sont déjà en production. Aucune promotion, stage, rotation
de secret ou modification de route/DNS n'a été faite dans cette préparation.
