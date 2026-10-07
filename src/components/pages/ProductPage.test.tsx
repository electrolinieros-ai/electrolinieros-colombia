import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderApp } from "../../test-utils/renderApp";

const { rpcMock } = vi.hoisted(() => ({
  rpcMock: vi.fn(),
}));

vi.mock("../../lib/supabase", () => ({
  supabase: {
    rpc: rpcMock,
  },
}));

describe("ProductPage (ruta /vehiculos/$slug/productos/$productId)", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    rpcMock.mockResolvedValue({ error: null });
    localStorage.clear();
  });

  it("muestra el producto, la galería y las especificaciones", async () => {
    renderApp("/vehiculos/yuan-up/productos/yuan-up-porton-electrico");

    expect(
      await screen.findByRole("heading", { name: /portón eléctrico/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/convierte el portón trasero de tu yuan up/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /déjanos tus datos y te enviaremos información/i,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByAltText("Portón eléctrico - imagen 1"),
    ).toBeInTheDocument();
    expect(screen.getByText("Voltaje de operación")).toBeInTheDocument();
    expect(screen.getByText("11–15 V DC")).toBeInTheDocument();

    expect(rpcMock).toHaveBeenCalledWith(
      "create_event",
      expect.objectContaining({
        p_product_id: "yuan-up-porton-electrico",
        p_event_type: "product_viewed",
      }),
    );
    expect(rpcMock).toHaveBeenCalledWith(
      "create_event",
      expect.objectContaining({
        p_product_id: "yuan-up-porton-electrico",
        p_event_type: "details_viewed",
      }),
    );
  });

  it("recorre la galería del producto", async () => {
    const user = userEvent.setup();
    renderApp("/vehiculos/yuan-up/productos/yuan-up-porton-electrico");

    await screen.findByAltText("Portón eléctrico - imagen 1");

    await user.click(
      screen.getByRole("button", { name: /imagen siguiente/i }),
    );
    expect(
      screen.getByAltText("Portón eléctrico - imagen 2"),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /ver imagen 4/i }),
    );
    expect(
      screen.getByAltText("Portón eléctrico - imagen 4"),
    ).toBeInTheDocument();
  });

  it('el CTA "Me interesa" lleva a la página de interés', async () => {
    const { router } = renderApp(
      "/vehiculos/yuan-up/productos/yuan-up-porton-electrico",
    );
    const user = userEvent.setup();

    await screen.findByRole("heading", { name: /portón eléctrico/i });

    await user.click(
      screen.getByRole("button", {
        name: /me interesa — quiero conocer el precio/i,
      }),
    );

    await waitFor(() =>
      expect(router.state.location.pathname).toBe(
        "/vehiculos/yuan-up/productos/yuan-up-porton-electrico/interes",
      ),
    );

    expect(
      screen.getByRole("heading", { name: /conocer el precio/i }),
    ).toBeInTheDocument();
  });

  it("muestra 'Producto no encontrado' cuando el producto o el vehículo no existen", async () => {
    const first = renderApp("/vehiculos/yuan-up/productos/producto-inexistente");
    expect(
      await screen.findByRole("heading", {
        name: /producto no encontrado/i,
      }),
    ).toBeInTheDocument();

    first.unmount();

    renderApp("/vehiculos/no-existe/productos/cualquiera");
    expect(
      await screen.findByRole("heading", {
        name: /producto no encontrado/i,
      }),
    ).toBeInTheDocument();
  });

  it("el botón 'Volver' navega al vehículo", async () => {
    const { router } = renderApp(
      "/vehiculos/yuan-up/productos/yuan-up-porton-electrico",
    );
    const user = userEvent.setup();

    await screen.findByRole("heading", { name: /portón eléctrico/i });

    await user.click(
      screen.getByRole("button", { name: /volver a yuan up/i }),
    );

    await waitFor(() =>
      expect(router.state.location.pathname).toBe("/vehiculos/yuan-up"),
    );
  });
});