import { spawnSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { migrationResponse } from "../netlify/edge-functions/catalogue-redirect.js";

const siteId = "b79b83a0-7552-4a78-86cc-1dad593fe1ee";
const command = spawnSync("netlify", ["api", "listSiteFiles", "--data", JSON.stringify({ site_id: siteId })], { encoding: "utf8" });
if (command.status !== 0) throw new Error("Impossible de lire l'inventaire Netlify");
const files = JSON.parse(command.stdout).map(({ path, mime_type, size }) => ({ path, mime_type, size }));
const paths = ["/", ...files.map(({ path }) => path)];
const results = [];
const retainedAssets = new Set(["/assets/logo-saaspasse.png", "/assets/saaspaladin-opt.png", "/assets/saaspaladin.png"]);
for (const path of paths) {
  const url = new URL(path, "https://catalogue.saaspasse.com").toString();
  const current = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000) });
  await current.body?.cancel();
  const candidate = migrationResponse(new Request(url));
  results.push({
    path,
    url,
    observed_status_before_migration: current.status,
    observed_location_before_migration: current.headers.get("location"),
    expected_status_after_migration: candidate?.status ?? (retainedAssets.has(path) ? 200 : 404),
    expected_location_after_migration: candidate?.headers.get("location") ?? null,
    owner: "Netlify catalogue",
  });
}
const revision = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).stdout.trim();
await mkdir("docs", { recursive: true });
await writeFile("docs/url-manifest.json", JSON.stringify({ captured_at: new Date().toISOString(), baseline_sha: revision, site_id: siteId, inventory_source: "API Netlify listSiteFiles du déploiement actuellement publié + racine", search_console_and_backlink_inventory: "non disponible dans cette session, à compléter avant bascule", published_files: files, routes: results }, null, 2) + "\n");
console.log(`Inventaire : ${files.length} fichiers publiés et ${results.length} routes documentées`);
