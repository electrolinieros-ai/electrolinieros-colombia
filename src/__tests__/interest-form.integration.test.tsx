import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { renderApp } from "../test-utils/renderApp";

const { rpcSpy } = vi.hoisted(() => ({
  rpcSpy: vi.fn(),
}));

vi.mock("../lib/supabase", () => ({
  supabase: {
    rpc: rpcSpy,
  },
}));

const INTEREST_URL =
  "/vehiculos/yuan-up/productos/yuan-up-porton-electrico/interes";

describe("página de interés (formulario)", () => {
  beforeEach(() => {
    rpcSpy.mockReset();
    rpcSpy.mockResolvedValue({ error: null });
    localStorage.setItem("ELECTROLINIEROS_visitor_id", "visitor-test");
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("muestra el producto seleccionado y sus campos", async () => {
    renderApp(INTEREST_URL);

    await screen.findByRole("heading", { name: /conocer el precio/i });

    expect(screen.getByText(/PORTON ELECTRICO/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tu nombre/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/número de teléfono/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /volver al producto/i }),
    ).toBeInTheDocument();
  });

  it("valida el envío vacío", async () => {
    const user = userEvent.setup();

    renderApp(INTEREST_URL);
    await screen.findByRole("heading", { name: /conocer el precio/i });

    await user.click(screen.getByRole("button", { name: /^enviar$/i }));

    expect(
      await screen.findByText(/escribe tu nombre/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/escribe al menos un teléfono o un correo/i),
    ).toBeInTheDocument();
    expect(rpcSpy).not.toHaveBeenCalled();
  });

  it("rechaza un teléfono que no es móvil ni fijo colombiano", async () => {
    const user = userEvent.setup();

    renderApp(INTEREST_URL);
    await screen.findByRole("heading", { name: /conocer el precio/i });

    await user.type(screen.getByLabelText(/tu nombre/i), "Juan Gomez");
    await user.type(
      screen.getByLabelText(/número de teléfono/i),
      "123456789",
    );
    await user.click(screen.getByRole("button", { name: /^enviar$/i }));

    expect(
      await screen.findByText(/ingresa un teléfono colombiano válido/i),
    ).toBeInTheDocument();
    expect(rpcSpy).not.toHaveBeenCalled();
  });

  it("rechaza nombres con intentos de XSS o inyección SQL", async () => {
    const user = userEvent.setup();

    renderApp(INTEREST_URL);
    await screen.findByRole("heading", { name: /conocer el precio/i });

    await user.type(
      screen.getByLabelText(/tu nombre/i),
      "<script>alert(1)</script>",
    );
    await user.click(screen.getByRole("button", { name: /^enviar$/i }));

    expect(
      await screen.findByText(/solo puede contener letras, espacios y apóstrofes/i),
    ).toBeInTheDocument();
    expect(rpcSpy).not.toHaveBeenCalled();
  });

  it("rechaza nombres demasiado largos", async () => {
    const user = userEvent.setup();

    renderApp(INTEREST_URL);
    await screen.findByRole("heading", { name: /conocer el precio/i });

    fireEvent.change(screen.getByLabelText(/tu nombre/i), {
      target: { value: "A".repeat(61) },
    });
    await user.click(screen.getByRole("button", { name: /^enviar$/i }));

    expect(
      await screen.findByText(/no puede superar los 60 caracteres/i),
    ).toBeInTheDocument();
    expect(rpcSpy).not.toHaveBeenCalled();
  });

  it("rechaza payloads inyectados en el teléfono y el correo", async () => {
    const user = userEvent.setup();

    renderApp(INTEREST_URL);
    await screen.findByRole("heading", { name: /conocer el precio/i });

    await user.type(screen.getByLabelText(/tu nombre/i), "Juan Gomez");
    await user.type(
      screen.getByLabelText(/número de teléfono/i),
      "'; DROP TABLE leads; --",
    );
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      'juan@x.com"><script>alert(1)</script>',
    );
    await user.click(screen.getByRole("button", { name: /^enviar$/i }));

    expect(
      await screen.findByText(/teléfono colombiano válido/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/escribe un correo electrónico válido/i),
    ).toBeInTheDocument();
    expect(rpcSpy).not.toHaveBeenCalled();
  });

  it("acepta un teléfono fijo colombiano de 7 dígitos", async () => {
    const user = userEvent.setup();

    renderApp(INTEREST_URL);
    await screen.findByRole("heading", { name: /conocer el precio/i });

    await user.type(screen.getByLabelText(/tu nombre/i), "Juan Gomez");
    await user.type(
      screen.getByLabelText(/número de teléfono/i),
      "6601234",
    );
    await user.click(screen.getByRole("button", { name: /^enviar$/i }));

    expect(rpcSpy).toHaveBeenCalledWith(
      "create_lead",
      expect.objectContaining({
        p_name: "Juan Gomez",
        p_phone: "6601234",
      }),
    );
    expect(
      await screen.findByRole("heading", { name: /enviado correctamente/i }),
    ).toBeInTheDocument();
  });

  it("rechaza un correo inválido", async () => {
    const user = userEvent.setup();

    renderApp(INTEREST_URL);
    await screen.findByRole("heading", { name: /conocer el precio/i });

    await user.type(screen.getByLabelText(/tu nombre/i), "Juan Gomez");
    await user.type(
      screen.getByLabelText(/correo electrónico/i),
      "correo-mal-sin-dominio",
    );
    await user.click(screen.getByRole("button", { name: /^enviar$/i }));

    expect(
      await screen.findByText(/escribe un correo electrónico válido/i),
    ).toBeInTheDocument();
    expect(rpcSpy).not.toHaveBeenCalled();
  });

  it("envía el lead y muestra la confirmación", async () => {
    const user = userEvent.setup();

    const { router } = renderApp(INTEREST_URL);
    await screen.findByRole("heading", { name: /conocer el precio/i });

    await user.type(screen.getByLabelText(/tu nombre/i), "Juan Gomez");
    await user.type(
      screen.getByLabelText(/número de teléfono/i),
      "3142507000",
    );
    await user.click(screen.getByRole("button", { name: /^enviar$/i }));

    expect(rpcSpy).toHaveBeenCalledTimes(1);
    expect(rpcSpy).toHaveBeenCalledWith(
      "create_lead",
      expect.objectContaining({
        p_visitor_id: "visitor-test",
        p_product_id: "yuan-up-porton-electrico",
        p_name: "Juan Gomez",
        p_phone: "3142507000",
        p_email: null,
      }),
    );

    expect(
      await screen.findByRole("heading", { name: /enviado correctamente/i }),
    ).toBeInTheDocument();

    await waitFor(
      () => expect(router.state.location.pathname).toBe("/vehiculos"),
      { timeout: 6000 },
    );
  });

  it("muestra un error si el envío falla", async () => {
    const user = userEvent.setup();

    renderApp(INTEREST_URL);
    await screen.findByRole("heading", { name: /conocer el precio/i });

    rpcSpy.mockResolvedValue({ error: new Error("db error") });

    await user.type(screen.getByLabelText(/tu nombre/i), "Juan Gomez");
    await user.type(
      screen.getByLabelText(/número de teléfono/i),
      "3142507000",
    );
    await user.click(screen.getByRole("button", { name: /^enviar$/i }));

    expect(
      await screen.findByText(/no pudimos enviar tus datos/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /conocer el precio/i }),
    ).toBeInTheDocument();
  });
});