import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { describe, expect, it, vi } from "vitest";

import { getRouteErrorMessage } from "../../lib/route-errors";
import { PendingPage } from "./PendingPage";
import { RouteErrorPage } from "./RouteErrorPage";

function renderTestRouter({ showPending = false }: { showPending?: boolean } = {}) {
  const rootRoute = createRootRoute({
    component: () => (
      <main>
        <h1>Inicio</h1>
        <Outlet />
      </main>
    ),
  });

  const failRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/fail",
    loader: () => {
      throw new Error("fetch failed: red no disponible");
    },
    component: () => <p>No debería renderizarse</p>,
  });

  const boomRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/boom",
    loader: () => {
      throw new Error("oops");
    },
    component: () => <p>No debería renderizarse</p>,
  });

  const slowRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: "/slow",
    loader: () => new Promise<never>(() => undefined),
    component: () => <p>Página lenta cargada</p>,
  });

  const routeTree = rootRoute.addChildren([failRoute, boomRoute, slowRoute]);

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({ initialEntries: ["/"] }),
    defaultErrorComponent: RouteErrorPage,
    defaultPendingComponent: showPending ? PendingPage : undefined,
    defaultPendingMs: showPending ? 0 : 600,
    defaultPendingMinMs: 0,
  });

  const utils = render(<RouterProvider router={router} />);

  return { router, ...utils };
}

describe("getRouteErrorMessage", () => {
  it("detecta errores de red por mensaje", () => {
    expect(
      getRouteErrorMessage(new Error("Failed to fetch")),
    ).toBe("Hubo un problema de conexión. Revisa tu internet e inténtalo de nuevo.");
    expect(
      getRouteErrorMessage(new Error("NetworkError when attempting to fetch resource")),
    ).toBe("Hubo un problema de conexión. Revisa tu internet e inténtalo de nuevo.");
    expect(
      getRouteErrorMessage(new Error("Uncaught Server Error 503")),
    ).toMatch(/conexión/);
  });

  it("detecta errores de red por código", () => {
    expect(getRouteErrorMessage(undefined, "504")).toMatch(/conexión/);
    expect(getRouteErrorMessage(undefined, "OTHER")).toBe(
      "Ocurrió un error inesperado al cargar esta página.",
    );
  });

  it("usa el mensaje genérico para errores no relacionados con la red", () => {
    expect(getRouteErrorMessage(new Error("algo reventó"))).toBe(
      "Ocurrió un error inesperado al cargar esta página.",
    );
  });

  it("detecta otros mensajes de red habituales", () => {
    for (const message of [
      "load failed",
      "Gateway Timeout",
      "ETIMEDOUT",
      "Connection timed out",
      "ERR_CONNECTION_RESET",
    ]) {
      expect(getRouteErrorMessage(new Error(message))).toMatch(/conexión/);
    }
  });

  it("detecta la red por el código de estado del servidor", () => {
    expect(getRouteErrorMessage(undefined, "503")).toMatch(/conexión/);
    expect(getRouteErrorMessage(undefined, "Gateway Timeout")).toMatch(
      /conexión/,
    );
  });
});

describe("RouteErrorPage", () => {
  it("muestra el mensaje de red y las acciones cuando falla la conexión", async () => {
    const { router } = renderTestRouter();

    await screen.findByRole("heading", { name: "Inicio" });
    await router.navigate({ to: "/fail" } as never).catch(() => undefined);

    expect(
      await screen.findByRole("heading", { name: /no pudimos conectar/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Hubo un problema de conexión. Revisa tu internet e inténtalo de nuevo.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reintentar/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /volver al inicio/i }),
    ).toBeInTheDocument();
  });

  it("muestra el mensaje genérico cuando es un error inesperado", async () => {
    const { router } = renderTestRouter();

    await screen.findByRole("heading", { name: "Inicio" });
    await router.navigate({ to: "/boom" } as never).catch(() => undefined);

    expect(
      await screen.findByRole("heading", { name: /algo salió mal/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ocurrió un error inesperado al cargar esta página."),
    ).toBeInTheDocument();
  });

  it("Reintentar vuelve a intentar cargar la ruta (router.invalidate)", async () => {
    const { router } = renderTestRouter();

    await screen.findByRole("heading", { name: "Inicio" });
    await router.navigate({ to: "/boom" } as never).catch(() => undefined);

    expect(
      await screen.findByRole("heading", { name: /algo salió mal/i }),
    ).toBeInTheDocument();

    const invalidateSpy = vi.spyOn(router, "invalidate").mockResolvedValue();

    await userEvent.click(screen.getByRole("button", { name: /reintentar/i }));

    expect(invalidateSpy).toHaveBeenCalledTimes(1);
  });

  it("Volver al inicio navega a la raíz", async () => {
    const { router } = renderTestRouter();

    await screen.findByRole("heading", { name: "Inicio" });
    await router.navigate({ to: "/boom" } as never).catch(() => undefined);

    expect(
      await screen.findByRole("heading", { name: /algo salió mal/i }),
    ).toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: /volver al inicio/i }),
    );

    expect(router.state.location.pathname).toBe("/");
    expect(
      screen.getByRole("heading", { name: "Inicio" }),
    ).toBeInTheDocument();
  });
});

describe("PendingPage", () => {
  it("muestra el spinner mientras una ruta lenta carga", async () => {
    const { router } = renderTestRouter({ showPending: true });

    await screen.findByRole("heading", { name: "Inicio" });

    void router.navigate({ to: "/slow" } as never).catch(() => undefined);

    expect(await screen.findByText("Cargando…")).toBeInTheDocument();
    expect(
      document.querySelector(".MuiCircularProgress-root"),
    ).toBeInTheDocument();
  });
});