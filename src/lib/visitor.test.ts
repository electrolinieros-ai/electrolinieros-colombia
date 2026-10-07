import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PostgrestSingleResponse } from "@supabase/supabase-js";

vi.mock("./supabase", () => ({
  supabase: {
    rpc: vi.fn(),
  },
}));

import { supabase } from "./supabase";
import { getTrafficSource, getVisitorId, touchVisitor } from "./visitor";

const STORAGE_KEY = "ELECTROLINIEROS_visitor_id";

function setLocationSearch(search: string) {
  window.history.replaceState(null, "", `/index.html${search}`);
}

function setReferrer(referrer: string) {
  Object.defineProperty(window.document, "referrer", {
    configurable: true,
    value: referrer,
  });
}

describe("getVisitorId", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("crea un id y lo persiste en localStorage", () => {
    const id = getVisitorId();

    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
    );
    expect(localStorage.getItem(STORAGE_KEY)).toBe(id);
  });

  it("reutiliza el id almacenado", () => {
    localStorage.setItem(STORAGE_KEY, "visitor-existente");

    expect(getVisitorId()).toBe("visitor-existente");
  });
});

describe("getTrafficSource", () => {
  beforeEach(() => {
    setLocationSearch("");
    setReferrer("");
  });

  it("devuelve 'direct' cuando no hay fuente ni referrer", () => {
    expect(getTrafficSource()).toBe("direct");
  });

  it("lee el parámetro ?source=instagram", () => {
    setLocationSearch("?source=instagram");
    expect(getTrafficSource()).toBe("instagram");
  });

  it("lee el parámetro ?source=facebook_marketplace", () => {
    setLocationSearch("?source=facebook_marketplace");
    expect(getTrafficSource()).toBe("facebook_marketplace");
  });

  it("ignora un parámetro source no soportado", () => {
    setLocationSearch("?source=otra-cosa");
    expect(getTrafficSource()).toBe("direct");
  });

  it("detecta instagram por referrer", () => {
    setReferrer("https://www.instagram.com/p/xyz");
    expect(getTrafficSource()).toBe("instagram");
  });

  it("detecta facebook por referrer", () => {
    setReferrer("https://www.facebook.com/123");
    expect(getTrafficSource()).toBe("facebook_marketplace");
  });

  it("devuelve 'unknown' para un referrer desconocido", () => {
    setReferrer("https://www.google.com/");
    expect(getTrafficSource()).toBe("unknown");
  });
});

describe("touchVisitor", () => {
  beforeEach(() => {
    localStorage.clear();
    setLocationSearch("?source=instagram");
    vi.mocked(supabase.rpc).mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("registra al visitante con su id y fuente detectada", async () => {
    vi.mocked(supabase.rpc).mockResolvedValue({
      error: null,
    } as unknown as PostgrestSingleResponse<never>);

    const visitorId = await touchVisitor();

    expect(supabase.rpc).toHaveBeenCalledWith("touch_visitor", {
      p_visitor_id: visitorId,
      p_source: "instagram",
    });
    expect(visitorId).toBe(getVisitorId());
  });

  it("devuelve el id aunque el registro falle, sin lanzar", async () => {
    const boom = { message: "boom", details: "", hint: "", code: "500" };
    vi.mocked(supabase.rpc).mockResolvedValue({
      error: boom,
    } as unknown as PostgrestSingleResponse<never>);
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    const visitorId = await touchVisitor();

    expect(visitorId).toBeTruthy();
    expect(consoleError).toHaveBeenCalled();
  });

  it("no lanza cuando la red cae (rpc rechaza)", async () => {
    vi.mocked(supabase.rpc).mockRejectedValue(
      new TypeError("Failed to fetch"),
    );
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(touchVisitor()).resolves.toBe(getVisitorId());

    expect(consoleError).toHaveBeenCalled();
  });
});