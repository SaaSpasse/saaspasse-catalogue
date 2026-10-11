# Catalogue SaaSpasse — archive et compatibilité

Le catalogue public fait partie de `saaspasse-app`.
Le projet actif pour ses textes, offres, composants et design est
`/Users/francoislanthiernadeau/work/saaspasse-app`; le chemin historique
`/Users/francoislanthiernadeau/claude-code/saaspasse-app` reste valide.

## Pour modifier le catalogue actuel

- Travailler dans `saaspasse-app`, en suivant son `AGENTS.md` et son `README.md`.
- Lire `docs/catalogue-workflow.md` et les sections catalogue de `docs/GUIDE.md`.
- Le hub public est `https://saaspasse.com/collaborer`.
- Les cinq fiches, leurs textes et leurs preuves se trouvent dans
  `web/app/collaborer/`; la méthode commune est dans `web/app/certification/`.
- Partir de la version actuelle de `main`, dans une branche descriptive propre.

## Rôle de ce dépôt

- Conserver les anciens HTML, fiches produits 2026 et documents comme historique.
- `index.html` est l'ancien catalogue; il n'est plus la source du site public.
- Conserver l'ancien domaine `catalogue.saaspasse.com` et ses redirections.
- L'implémentation Netlify de compatibilité est conservée dans la branche
  `codex/catalogue-migration-release-20261002` : `netlify.toml`,
  `netlify/edge-functions/catalogue-redirect.js`, `migration-public/` et les
  manifests/tests de migration. Ce chantier est distinct du contenu de l'app.
- Ne pas réutiliser l'ancien workflow « modifier index.html puis pousser main
  pour publier le catalogue ». Toute intervention sur Netlify doit préserver
  les redirections vers l'app, les paramètres de campagne et les anciennes URLs.

Les repères de reprise des anciens travaux figurent dans la mémoire partagée
de l'app. La mémoire et les sauvegardes privées ne doivent pas être committées.
