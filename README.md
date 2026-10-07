# Electrolinieros

Sitio estático de Electrolinieros, construido con React, TypeScript y Vite.

## Desarrollo local

Requiere Node.js 22 y npm.

```sh
npm ci
npm run dev
```

Configura `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY` en `.env.local` para
habilitar las funciones que usan Supabase. La clave debe ser la publicable de
Supabase; nunca uses una clave `service_role` en una aplicación de navegador.

## Despliegue

El workflow de GitHub Actions en `.github/workflows/pages.yml` compila y
despliega el sitio a GitHub Pages cuando hay cambios en `main`. En la
configuración del repositorio, define las variables de Actions
`VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY` con la URL del proyecto y su clave
publicable. El workflow configura automáticamente la ruta base
`/<nombre-del-repositorio>/` para GitHub Pages.

El build genera `dist/` y una página `404.html` para resolver rutas de la
aplicación; estos archivos se publican como artefacto de Pages y no se suben
al repositorio.

## Validación

```sh
npm run lint
npm test
npm run build
```
