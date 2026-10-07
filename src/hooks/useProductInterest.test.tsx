import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useProductInterest } from "./useProductInterest";

const { navigateMock, trackEventMock } = vi.hoisted(() => ({
  navigateMock: vi.fn(),
  trackEventMock: vi.fn(() => Promise.resolve(true)),
}));

vi.mock("@tanstack/react-router", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("@tanstack/react-router")>();
  return { ...actual, useNavigate: () => navigateMock };
});

vi.mock("../lib/analytics", () => ({
  trackEvent: trackEventMock,
}));

function InterestButtonHarness() {
  const { goToInterest } = useProductInterest({ slug: "yuan-up" });

  return (
    <button
      type="button"
      onClick={() => void goToInterest("yuan-up-porton-electrico")}
    >
      Ir a interés
    </button>
  );
}

function EmptyProductIdHarness() {
  const { goToInterest } = useProductInterest({ slug: "yuan-up" });

  return (
    <button type="button" onClick={() => void goToInterest("")}>
      Ir sin producto
    </button>
  );
}

describe("useProductInterest", () => {
  beforeEach(() => {
    navigateMock.mockReset();
    trackEventMock.mockReset();
  });

  it("navega a la página de interés con slug y productId", async () => {
    const user = userEvent.setup();

    render(<InterestButtonHarness />);

    await user.click(screen.getByRole("button", { name: /ir a interés/i }));

    expect(navigateMock).toHaveBeenCalledWith({
      to: "/vehiculos/$slug/productos/$productId/interes",
      params: {
        slug: "yuan-up",
        productId: "yuan-up-porton-electrico",
      },
    });
  });

  it("registra el evento price_requested del producto", async () => {
    const user = userEvent.setup();

    render(<InterestButtonHarness />);

    await user.click(screen.getByRole("button", { name: /ir a interés/i }));

    expect(trackEventMock).toHaveBeenCalledWith(
      "price_requested",
      "yuan-up-porton-electrico",
    );
  });

  it("no navega ni registra evento si el productId está vacío", async () => {
    const user = userEvent.setup();
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    render(<EmptyProductIdHarness />);

    await user.click(screen.getByRole("button", { name: /ir sin producto/i }));

    expect(warn).toHaveBeenCalled();
    expect(navigateMock).not.toHaveBeenCalled();
    expect(trackEventMock).not.toHaveBeenCalled();
  });
});