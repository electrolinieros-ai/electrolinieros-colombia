import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig({
  // Para GitHub Pages de proyecto: VITE_BASE_PATH=/nombre-del-repo/
  base: process.env.VITE_BASE_PATH ?? "/",
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    ViteImageOptimizer({
      // El catálogo ya vive en WebP optimizado (scripts/optimize-images.mjs).
      // No volver a transcodificar webp: degrada sin reducir mucho el peso.
      // Esto queda como red de seguridad para futuras fotos raster (jpg/png).
      test: /\.(jpe?g|png|gif|tiff|avif|svg)$/i,
      jpeg: { quality: 90 },
      jpg: { quality: 90 },
      png: { quality: 90 },
      avif: { quality: 85 },
    }),
  ],
});
