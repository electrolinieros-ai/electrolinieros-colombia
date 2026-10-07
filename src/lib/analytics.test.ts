import { beforeEach, describe, expect, it, vi } from "vitest";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

vi.mock("./supabase", () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

vi.mock("./visitor", () => ({
  getVisitorId: () => "visitor-analytics",
}));

import { supabase } from "./supabase";
import { trackEvent } from "./analytics";

describe("trackEvent", () => {
  beforeEach(() => {
    vi.mocked(supabase.rpc).mockReset();
  });

  it("registra el evento con visitante, producto y tipo via create_event", async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      error: null,
    } as unknown as PostgrestSingleResponse<never>);

    const ok = await trackEvent("price_requested", "yuan-up-porton-electrico");

    expect(ok).toBe(true);
    expect(supabase.rpc).toHaveBeenCalledWith("create_event", {
      p_visitor_id: "visitor-analytics",
      p_product_id: "yuan-up-porton-electrico",
      p_event_type: "price_requested",
    });
  });

  it("devuelve false y loguea el error si el envío falla", async () => {
    const boom = { message: "boom", details: "", hint: "", code: "500" };
    vi.mocked(supabase.rpc).mockResolvedValue({
      error: boom,
    } as unknown as PostgrestSingleResponse<never>);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const ok = await trackEvent("product_viewed", "model-3-power-frunk");

    expect(ok).toBe(false);
    expect(consoleError).toHaveBeenCalled();
  });

  it("no lanza si la red falla (rpc rechaza) y devuelve false", async () => {
    vi.mocked(supabase.rpc).mockRejectedValue(
      new TypeError("Failed to fetch"),
    );
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      trackEvent("product_viewed", "yuan-up-porton-electrico"),
    ).resolves.toBe(false);

    expect(consoleError).toHaveBeenCalled();
  });
});