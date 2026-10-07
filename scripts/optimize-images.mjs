/**
 * Convierte TODAS las fotos del catálogo a WebP de máxima calidad,
 * normalizándolas para que se vean bien en la galería:
 *
 *  - aplica la orientación EXIF y elimina metadatos
 *  - escala hacia arriba las fotos pequeñas (lanczos3) para que no se
 *    vean pixeladas en la tarjeta (≈760px CSS) ni en la galería (≈940px)
 *  - enmascara la falta de detalle con un enfoque suave según el caso
 *  - codifica en WebP con la máxima fidelidad razonable
 *
 * `scripts/image-baseline.json` guarda la resolución original de cada foto
 * para que volver a ejecutar el script sea idempotente (no re-amplía ya
 * ampliadas) y para saber siempre cuánto ganamos de verdad.
 *
 * Uso: npm run images
 */
import { readdir, readFile, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const ROOT = path.resolve("src/assets/products");
const BASELINE = path.resolve("scripts/image-baseline.json");
const EXTENSIONS = new Set([".avif", ".jpeg", ".jpg", ".png", ".webp", ".gif", ".tiff"]);

/**
 * Rango de ancho útil en pantalla:
 *  - tarjeta del catálogo ≈370px CSS (760px @2x)
 *  - galería del diálogo  ≈940px CSS (1880px @2x)
 * 800px cubre la tarjeta y 1200px deja margen en la galería sin inflar el peso.
 */
const MIN_WIDTH = 800;
const MAX_WIDTH = 1200;
/** Calidad WebP: visualmente indistinguible de q95 para fotos en pantalla. */
const QUALITY = 88;

async function listImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listImages(fullPath)));
      continue;
    }

    if (entry.name.startsWith(".")) continue;
    if (!EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;

    files.push(fullPath);
  }

  return files;
}

async function readBaseline() {
  try {
    return JSON.parse(await readFile(BASELINE, "utf8"));
  } catch {
    return {};
  }
}

function displaySize(metadata) {
  const orientation = metadata.orientation ?? 1;
  // Las orientaciones 5-8 rotan la imagen: el ancho "visible" es el alto.
  return orientation >= 5
    ? { width: metadata.height, height: metadata.width }
    : { width: metadata.width, height: metadata.height };
}

function targetWidth(width) {
  if (width >= MAX_WIDTH) return MAX_WIDTH;
  if (width <= MIN_WIDTH) return MIN_WIDTH;
  return width;
}

async function optimize(filePath, baseline) {
  const metadata = await sharp(filePath).metadata();
  const current = displaySize(metadata);

  if (!current.width || !current.height) {
    throw new Error("sin dimensiones");
  }

  const key = path.relative(ROOT, filePath);
  const originalWidth = baseline[key]?.width ?? current.width;
  const target = targetWidth(originalWidth);
  const needsResize = current.width !== target;
  const enlarged = target > originalWidth;

  const pipeline = sharp(filePath, { failOn: "none" }).rotate();

  if (needsResize) {
    pipeline.resize({
      width: target,
      kernel: "lanczos3",
      fit: "inside",
      withoutEnlargement: false,
    });
  }

  pipeline.sharpen(
    enlarged
      ? { sigma: 1.1, flat: 0.5, jagged: 1.5 }
      : needsResize
        ? { sigma: 0.6, flat: 1, jagged: 1 }
        : { sigma: 0.8, flat: 1, jagged: 1 },
  );

  const before = (await stat(filePath)).size;
  const ext = path.extname(filePath);
  const outputPath = `${filePath.slice(0, -ext.length)}.webp`;

  // Sharp no puede leer y escribir el mismo archivo a la vez.
  const tempPath = outputPath === filePath ? `${outputPath}.tmp` : outputPath;

  await pipeline
    .webp({
      quality: QUALITY,
      effort: 6,
      smartSubsample: true,
      alphaQuality: 100,
    })
    .toFile(tempPath);

  if (tempPath !== outputPath) {
    await unlink(outputPath);
    await rename(tempPath, outputPath);
  }

  if (outputPath !== filePath) {
    await unlink(filePath);
  }

  const after = (await stat(outputPath)).size;

  return {
    key: path.relative(ROOT, outputPath),
    originalWidth,
    width: current.width,
    height: current.height,
    target,
    enlarged,
    reduced: needsResize && !enlarged,
    before,
    after,
  };
}

const files = await listImages(ROOT);
const baseline = await readBaseline();
const results = [];

for (const file of files) {
  try {
    results.push(await optimize(file, baseline));
  } catch (error) {
    console.error(`✗ ${path.relative(ROOT, file)}: ${error.message}`);
    process.exitCode = 1;
  }
}

const nextBaseline = {};
for (const result of results) {
  nextBaseline[result.key] = { width: result.originalWidth };
}
await writeFile(BASELINE, `${JSON.stringify(nextBaseline, null, 2)}\n`);

const pad = (value, size) => String(value).padEnd(size);
  const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

  console.log("");
  console.log(
    `${pad("imagen", 52)} ${pad("origen", 20)} ${pad("salida", 20)}`,
  );
  console.log("-".repeat(96));

  for (const result of results.sort((a, b) => a.key.localeCompare(b.key))) {
    const from = `${kb(result.before)} (${result.originalWidth}px)`;
    const change = result.enlarged ? " ↑" : result.reduced ? " ↓" : "";
    const to = `${kb(result.after)} (${result.target}px${change})`;

    console.log(`${pad(result.key, 52)} ${pad(from, 20)} ${pad(to, 20)}`);
  }

  const totalBefore = results.reduce((sum, item) => sum + item.before, 0);
  const totalAfter = results.reduce((sum, item) => sum + item.after, 0);
  const enlargedCount = results.filter((item) => item.enlarged).length;
  const reducedCount = results.filter((item) => item.reduced).length;

  console.log("-".repeat(96));
  console.log(
    `${results.length} imágenes · ampliadas: ${enlargedCount} · reducidas: ${reducedCount} · ` +
      `${kb(totalBefore)} → ${kb(totalAfter)} (${(((totalAfter - totalBefore) / totalBefore) * 100).toFixed(1)}%)`,
  );
