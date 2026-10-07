import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PendingPage } from "../components/pages/PendingPage";
import { RouteErrorPage } from "../components/pages/RouteErrorPage";
import { renderApp } from "../test-utils/renderApp";

const { rpcMock } = vi.hoisted(() => ({
  rpcMock: vi.fn(),
}));

vi.mock("../lib/supabase", () => ({
  supabase: {
    rpc: rpcMock,
  },
}));

describe("integración de rutas (router real)", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    rpcMock.mockResolvedValue({ error: null });
    localStorage.clear();
  });

  it("conecta la página de error y el spinner por defecto del router", () => {
    const { router } = renderApp("/");

    expect(router.options.defaultErrorComponent).toBe(RouteErrorPage);
    expect(router.options.defaultPendingComponent).toBe(PendingPage);
    expect(router.options.defaultPendingMs).toBe(600);
    expect(router.options.defaultPendingMinMs).toBe(300);
  });

  it("renderiza la home en /", async () => {
    renderApp("/");

    expect(
      await screen.findByRole("heading", { name: /haz que tu eléctrico/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /elegir mi vehículo/i }),
    ).toBeInTheDocument();
  });

  it("muestra el catálogo en /vehiculos con 5 vehículos y navega a uno", async () => {
    const { router } = renderApp("/vehiculos");
    const user = userEvent.setup();

    await screen.findByRole("heading", { name: /cuál es tu vehículo/i });

    const vehicleLinks = screen.getAllByRole("link", {
      name: /yuan up|seagull|dolphin|model 3|model y/i,
    });
    expect(vehicleLinks).toHaveLength(5);

    await user.click(screen.getByRole("link", { name: /yuan up/i }));

    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/vehiculos/yuan-up"),
    );
    await screen.findByRole("heading", {
      name: /soluciones para tu yuan up/i,
    });
  });

  it("muestra la página de vehículo con sus productos", async () => {
    renderApp("/vehiculos/yuan-up");

    await screen.findByRole("heading", {
      name: /soluciones para tu yuan up/i,
    });
    expect(
      screen.getByText(/mejorar la experiencia de tu yuan up/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /caja de almacenamiento/i }),
    ).toBeInTheDocument();
  });

  it("flujo completo: abrir modal y 'Me interesa' llega a la página de interés", async () => {
    const { router } = renderApp("/vehiculos/yuan-up");
    const user = userEvent.setup();

    await screen.findByRole("heading", {
      name: /soluciones para tu yuan up/i,
    });

    await user.click(
      await screen.findByRole("button", { name: /portón eléctrico/i }),
    );
    await user.click(
      await screen.findByRole("button", {
        name: /me interesa — quiero conocer el precio/i,
      }),
    );

    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        "/vehiculos/yuan-up/productos/yuan-up-porton-electrico/interes",
      ),
    );
    await screen.findByRole("heading", { name: /conocer el precio/i });
    expect(screen.getByText(/PORTON ELECTRICO/i)).toBeInTheDocument();

    expect(rpcMock).toHaveBeenCalledWith(
      "create_event",
      expect.objectContaining({
        p_product_id: "yuan-up-porton-electrico",
        p_event_type: "price_requested",
      }),
    );
  });

  it("muestra la página de producto", async () => {
    renderApp("/vehiculos/yuan-up/productos/yuan-up-porton-electrico");

    await screen.findByRole("heading", { name: /portón eléctrico/i });
    expect(
      screen.getByText(/déjanos tus datos y te enviaremos información/i),
    ).toBeInTheDocument();
  });

  it("muestra la página de interés al acceder directamente", async () => {
    renderApp(
      "/vehiculos/yuan-up/productos/yuan-up-porton-electrico/interes",
    );

    await screen.findByRole("heading", { name: /conocer el precio/i });
    expect(screen.getByText(/PORTON ELECTRICO/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /volver al producto/i }),
    ).toBeInTheDocument();
  });

  it("muestra 'Vehículo no encontrado' para un slug inválido", async () => {
    renderApp("/vehiculos/no-existe");

    expect(
      await screen.findByRole("heading", {
        name: /vehículo no encontrado/i,
      }),
    ).toBeInTheDocument();
  });

  it("muestra 'Producto no encontrado' para un producto inválido", async () => {
    renderApp("/vehiculos/yuan-up/productos/producto-inexistente");

    expect(
      await screen.findByRole("heading", {
        name: /producto no encontrado/i,
      }),
    ).toBeInTheDocument();
  });
});