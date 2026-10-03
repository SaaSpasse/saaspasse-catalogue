import { cp, mkdir, readdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
await rm(`${root}dist`, { recursive: true, force: true });
await mkdir(`${root}dist`, { recursive: true });
await cp(`${root}migration-public`, `${root}dist`, { recursive: true });
// Conserver ces images historiques sans prix pour les liens entrants existants.
await mkdir(`${root}dist/assets`, { recursive: true });
for (const name of ["logo-saaspasse.png", "saaspaladin-opt.png", "saaspaladin.png"]) {
  await cp(`${root}assets/${name}`, `${root}dist/assets/${name}`);
}
const files = (await readdir(`${root}dist`)).sort();
if (JSON.stringify(files) !== JSON.stringify(["404.html", "assets", "robots.txt"])) {
  throw new Error(`Sortie publique inattendue : ${files.join(", ")}`);
}
console.log(`Sortie minimale : ${files.join(", ")}`);
