import test from "node:test";
import assert from "node:assert/strict";
import handler, { migrationResponse } from "../netlify/edge-functions/catalogue-redirect.js";

const responseFor = (path, method = "GET") => migrationResponse(new Request(`https://catalogue.saaspasse.com${path}`, { method }));

test("les catalogues équivalents redirigent HTTP sans fragment imposé", () => {
  for (const path of ["/", "/index.html", "/index.html/", "/catalogue-public-saaspasse-2026.html", "/produits%20SaaSpasse%202026.html", "/produits%20saaspasse%202026.html", "/INDEX.HTML"]) {
    for (const method of ["GET", "HEAD"]) {
      const response = responseFor(path, method);
      assert.equal(response.status, 301);
      assert.equal(response.headers.get("location"), "https://saaspasse.com/collaborer");
    }
  }
});

test("produit choisit sa fiche et impose une ancre valide", () => {
  for (const [product, slug] of [["annuels", "partenariat-certifie"], ["employeur", "employeur-premium"], ["conference", "commandite-conference"], ["founder-dinners", "founder-dinner"]]) {
    assert.equal(responseFor(`/?produit=${product}`).headers.get("location"), `https://saaspasse.com/collaborer/${slug}#offer-title`);
  }
});

test("les produits retirés, vides ou arbitraires reviennent aux offres du hub", () => {
  for (const product of ["host", "communaute", "spotlight", "infolettre", "", "inconnu", "constructor", "__proto__", "https://example.com"]) {
    assert.equal(responseFor(`/?produit=${encodeURIComponent(product)}`).headers.get("location"), "https://saaspasse.com/collaborer#offres");
  }
});

test("la première occurrence de produit prime même si elle est vide", () => {
  assert.equal(responseFor("/?produit=conference&produit=employeur").headers.get("location"), "https://saaspasse.com/collaborer/commandite-conference#offer-title");
  assert.equal(responseFor("/?produit=&produit=employeur").headers.get("location"), "https://saaspasse.com/collaborer#offres");
});

test("Unicode, valeurs répétées et clés héritées gardent leur valeur", () => {
  const source = "/?produit=annuels&utm_campaign=%C3%89t%C3%A9+2027&ref=%C3%A9quipe&ref=article&constructor=x&__proto__=safe&toString=a&toString=b&produit=host";
  const destination = new URL(responseFor(source).headers.get("location"));
  assert.equal(destination.searchParams.get("utm_campaign"), "Été 2027");
  assert.deepEqual(destination.searchParams.getAll("ref"), ["équipe", "article"]);
  assert.deepEqual(destination.searchParams.getAll("toString"), ["a", "b"]);
  assert.equal(destination.searchParams.get("constructor"), "x");
  assert.equal(destination.searchParams.get("__proto__"), "safe");
  assert.equal(destination.searchParams.has("produit"), false);
});

test("les anciens outils et documents retirés ont un statut 410, sans redirect artificiel", async () => {
  for (const path of ["/README.md", "/CLAUDE.md", "/saaspasse_bande_passante_2026.html", "/saaspasse_bande_passante_clean.html", "/saaspasse_repartition_forfaits.html", "/saaspasse_analytics.html", "/produits%20SaaSpasse%202026/05-employeur-premium.md"]) {
    assert.equal(responseFor(path).status, 410);
    assert.equal(responseFor(path).headers.get("location"), null);
    assert.equal(await responseFor(path, "HEAD").text(), "");
  }
});

test("les assets, chemins inconnus et encodages invalides restent des 404 natifs", () => {
  for (const path of ["/inconnu", "/assets/inconnu.png", "/robots.txt", "/%ZZ", "/constructor", "/__proto__"]) assert.equal(responseFor(path), undefined);
});

test("les aperçus portent noindex et les redirects de production restent explorables", () => {
  const request = new Request("https://catalogue-preview.netlify.app/");
  assert.equal(handler(request, { deploy: { context: "deploy-preview" } }).headers.get("x-robots-tag"), "noindex, nofollow");
  assert.equal(handler(request, { deploy: { context: "production" } }).headers.get("x-robots-tag"), null);
});
