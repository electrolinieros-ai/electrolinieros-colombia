import { createRouter } from "@tanstack/react-router";
import type { RouterHistory } from "@tanstack/react-router";

import { PendingPage } from "../components/pages/PendingPage";
import { RouteErrorPage } from "../components/pages/RouteErrorPage";
import { routeTree } from "../routeTree.gen";

export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    // Respeta el prefijo de Vite (import.meta.env.BASE_URL) para que la app
    // funcione también bajo una ruta de GitHub Pages (p. ej. /electrolinieros/).
    basepath: import.meta.env.BASE_URL,
    defaultPreload: "intent",
    defaultPendingComponent: PendingPage,
    defaultErrorComponent: RouteErrorPage,
    defaultPendingMs: 600,
    defaultPendingMinMs: 300,
  });
}
