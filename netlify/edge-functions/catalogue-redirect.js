const publicOrigin = "https://saaspasse.com";
const catalogues = new Set([
  "/",
  "/index.html",
  "/catalogue-public-saaspasse-2026.html",
  "/produits SaaSpasse 2026.html",
]);
const products = new Map([
  ["annuels", "/collaborer/partenariat-certifie"],
  ["employeur", "/collaborer/employeur-premium"],
  ["conference", "/collaborer/commandite-conference"],
  ["founder-dinners", "/collaborer/founder-dinner"],
]);
const retiredDocuments = new Set([
  "/README.md",
  "/CLAUDE.md",
  "/saaspasse_bande_passante_2026.html",
  "/saaspasse_bande_passante_clean.html",
  "/saaspasse_repartition_forfaits.html",
  "/saaspasse_analytics.html",
  ...[
    "00-gamme-complete-saaspasse-2026",
    "01-partenaires-annuels-certifies",
    "02-conference-annuelle",
    "03-communaute-privee",
    "04-partenaires-spotlight",
    "05-employeur-premium",
    "06-evenements-live",
    "07-job-board-premium",
    "08-founder-dinners",
    "09-infolettre-saaspal",
  ].map((name) => `/produits SaaSpasse 2026/${name}.md`),
]);

export function migrationResponse(request) {
  const source = new URL(request.url);
  let path;
  try {
    // Netlify publie les noms historiques sans distinction de casse.
    path = decodeURIComponent(source.pathname).toLowerCase();
  } catch {
    return undefined;
  }
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);

  const isRetired = [...retiredDocuments].some((document) => document.toLowerCase() === path);
  if (isRetired) {
    return new Response(request.method === "HEAD" ? null : "Ce document a été retiré.", {
      status: 410,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Robots-Tag": "noindex",
        "Cache-Control": "public, max-age=300",
      },
    });
  }
  if (![...catalogues].some((catalogue) => catalogue.toLowerCase() === path)) return undefined;

  // La première valeur, même vide, prime. Supprimer toutes les occurrences
  // avant de recopier les UTM/ref et autres paramètres répétés ou Unicode.
  const hasProduct = source.searchParams.has("produit");
  const product = source.searchParams.get("produit");
  const productPath = products.get(product);
  const destination = new URL(productPath ?? "/collaborer", publicOrigin);
  for (const [key, value] of source.searchParams) {
    if (key !== "produit") destination.searchParams.append(key, value);
  }
  // Sans produit, ne pas fournir de fragment : le navigateur transmet son
  // ancre historique au pont du hub. Un produit explicite impose sa cible.
  if (hasProduct) destination.hash = productPath ? "offer-title" : "offres";

  return new Response(null, {
    status: 301,
    headers: {
      Location: destination.toString(),
      "Cache-Control": "public, max-age=300",
    },
  });
}

export default function handler(request, context) {
  const response = migrationResponse(request);
  if (response && context.deploy?.context !== "production") {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return response;
}
