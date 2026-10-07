/**
 * GitHub Pages sirve un 404.html como fallback para rutas desconocidas.
 * Copiamos el index.html generado para que las URLs profundas (deep links)
 * de la SPA carguen el mismo bundle y TanStack Router funcione.
 */
import { copyFile, stat } from "node:fs/promises";

const source = "dist/index.html";
const target = "dist/404.html";

await stat(source);
await copyFile(source, target);

console.log(`✓ 404 fallback: ${source} → ${target}`);