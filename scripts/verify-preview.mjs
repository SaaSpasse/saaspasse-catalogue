import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { migrationResponse } from "../netlify/edge-functions/catalogue-redirect.js";

const origin = new URL(process.argv[2]);
if (!origin.hostname.endsWith("--saaspasse-catalogue.netlify.app")) throw new Error("Viser un aperçu de saaspasse-catalogue");
const inventory = JSON.parse(await readFile("docs/url-manifest.json", "utf8"));
const cases = [
  ...inventory.routes.map(({ path, expected_status_after_migration }) => [path, expected_status_after_migration]),
  ...[
    "/index.html/", "/INDEX.HTML", "/produits%20SaaSpasse%202026.html",
    "/?produit=annuels", "/?produit=employeur", "/?produit=conference", "/?produit=founder-dinners",
    "/?produit=host", "/?produit=communaute", "/?produit=spotlight", "/?produit=infolettre",
    "/?produit=&produit=annuels", "/?produit=conference&produit=employeur",
    "/?produit=constructor", "/?produit=__proto__", "/?produit=https%3A%2F%2Fevil.example",
    "/?produit=annuels&utm_campaign=%C3%89t%C3%A9+2027&ref=a&ref=b&constructor=x&__proto__=safe",
  ].map((path) => [path, 301]),
  ["/robots.txt", 200], ["/inconnu", 404], ["/assets/inconnu.png", 404],
];
const observed = [];
for (const [path, expectedStatus] of cases) {
  for (const method of ["GET", "HEAD"]) {
    const url = new URL(path, origin);
    const response = await fetch(url, { method, redirect: "manual", signal: AbortSignal.timeout(15000) });
    const expectedLocation = migrationResponse(new Request(url))?.headers.get("location") ?? null;
    const result = { path, method, status: response.status, location: response.headers.get("location"), robots: response.headers.get("x-robots-tag") };
    await response.body?.cancel();
    assert.equal(result.status, expectedStatus, `${method} ${path}`);
    assert.equal(result.location, expectedLocation, `${method} ${path}`);
    assert.match(result.robots ?? "", /noindex/, `${method} ${path}`);
    observed.push(result);
  }
}
const result = { preview_url: origin.origin, captured_at: new Date().toISOString(), tested_source_sha: process.argv[3] ?? null, checks_passed: observed.length, scope: "statuts, Location et noindex GET/HEAD; fragments navigateur et destinations publiques de l'app à valider séparément", observed };
await writeFile("docs/preview-validation.json", JSON.stringify(result, null, 2) + "\n");
console.log(`${observed.length} contrôles HTTP d'aperçu réussis`);
