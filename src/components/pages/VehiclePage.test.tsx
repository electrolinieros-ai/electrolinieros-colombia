import { screen, waitFor, within } from "@testing-library/react";
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

const PRODUCT_VIEW = {
  p_product_id: "yuan-up-porton-electrico",
  p_event_type: "product_viewed",
};

const DETAILS_VIEW = {
  p_product_id: "yuan-up-porton-electrico",
  p_event_type: "details_viewed",
};

async function openPortonDialog() {
  renderApp("/vehiculos/yuan-up");
  const user = userEvent.setup();

  await screen.findByRole("heading", {
    name: /soluciones para tu yuan up/i,
  });

  await user.click(
    screen.getByRole("button", { name: /portón eléctrico/i }),
  );

  const dialog = await screen.findByRole("dialog");

  return { dialog, user };
}

describe("VehiclePage (diálogo de producto)", () => {
  beforeEach(() => {
    rpcMock.mockReset();
    rpcMock.mockResolvedValue({ error: null });
    localStorage.clear();
  });

  it("abre el diálogo con nombre, beneficio y especificaciones, y registra eventos", async () => {
    const { dialog } = await openPortonDialog();

    expect(
      within(dialog).getByRole("heading", { name: /portón eléctrico/i }),
    ).toBeInTheDocument();
    expect(
      within(dialog).getByText(
        /más comodidad en el acceso al baúl y en el uso cotidiano/i,
      ),
    ).toBeInTheDocument();

    expect(
      within(dialog).getByText("Voltaje de operación"),
    ).toBeInTheDocument();
    expect(within(dialog).getByText("11–15 V DC")).toBeInTheDocument();
    expect(within(dialog).getByText("Garantía")).toBeInTheDocument();
    expect(within(dialog).getByText("3 años")).toBeInTheDocument();

    expect(rpcMock).toHaveBeenCalledWith(
      "create_event",
      expect.objectContaining(PRODUCT_VIEW),
    );
    expect(rpcMock).toHaveBeenCalledWith(
      "create_event",
      expect.objectContaining(DETAILS_VIEW),
    );
  });

  it("cierra el diálogo con el botón Cerrar", async () => {
    const { dialog, user } = await openPortonDialog();

    expect(dialog).toBeInTheDocument();

    await user.click(within(dialog).getByRole("button", { name: "Cerrar" }));

    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("recorre la galería (siguiente, anterior y envolvente)", async () => {
    const { dialog, user } = await openPortonDialog();

    expect(
      within(dialog).getByAltText("Portón eléctrico - imagen 1"),
    ).toBeInTheDocument();

    await user.click(
      within(dialog).getByRole("button", { name: /imagen siguiente/i }),
    );
    expect(
      within(dialog).getByAltText("Portón eléctrico - imagen 2"),
    ).toBeInTheDocument();

    await user.click(
      within(dialog).getByRole("button", { name: /imagen anterior/i }),
    );
    expect(
      within(dialog).getByAltText("Portón eléctrico - imagen 1"),
    ).toBeInTheDocument();

    // Desde la última imagen, "siguiente" vuelve a la primera.
    for (let steps = 0; steps < 4; steps += 1) {
      await user.click(
        within(dialog).getByRole("button", { name: /imagen siguiente/i }),
      );
    }
    expect(
      within(dialog).getByAltText("Portón eléctrico - imagen 1"),
    ).toBeInTheDocument();
  });

  it("cambia de imagen desde los indicadores (dots)", async () => {
    const { dialog, user } = await openPortonDialog();

    expect(
      within(dialog).getAllByRole("button", { name: /^ver imagen \d+$/i }),
    ).toHaveLength(4);

    await user.click(
      within(dialog).getByRole("button", { name: /ver imagen 3/i }),
    );
    expect(
      within(dialog).getByAltText("Portón eléctrico - imagen 3"),
    ).toBeInTheDocument();
  });
});