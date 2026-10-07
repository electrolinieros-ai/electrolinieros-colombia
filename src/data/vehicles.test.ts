import { describe, expect, it } from "vitest";

import { getProductById, getVehicleBySlug, vehicles } from "./vehicles";

describe("catalog data (vehicles)", () => {
  it("expone un catálogo no vacío", () => {
    expect(vehicles.length).toBeGreaterThan(0);
  });

  it("tiene slugs únicos y válidos", () => {
    const slugs = vehicles.map((vehicle) => vehicle.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(slug).toMatch(/^[a-z0-9-]+$/);
    }
  });

  it("define marcas conocidas", () => {
    const brands = new Set(vehicles.map((vehicle) => vehicle.brand));
    expect(brands.size).toBeGreaterThan(0);
    for (const brand of brands) {
      expect(["BYD", "Tesla"]).toContain(brand);
    }
  });

  it("cada vehículo tiene nombre, descripción y al menos un producto", () => {
    for (const vehicle of vehicles) {
      expect(vehicle.name).toBeTruthy();
      expect(vehicle.description).toBeTruthy();
      expect(vehicle.products.length).toBeGreaterThan(0);
    }
  });

  it("los productos tienen ids únicos, nombre, descripción corta y beneficio", () => {
    for (const vehicle of vehicles) {
      const ids = vehicle.products.map((product) => product.id);
      expect(new Set(ids).size).toBe(ids.length);

      for (const product of vehicle.products) {
        expect(product.id).toBeTruthy();
        expect(product.name).toBeTruthy();
        expect(product.shortDescription).toBeTruthy();
        expect(product.benefit).toBeTruthy();
      }
    }
  });

  it("getVehicleBySlug devuelve el vehículo correcto", () => {
    const yuanUp = vehicles.find((vehicle) => vehicle.slug === "yuan-up");
    expect(getVehicleBySlug("yuan-up")).toEqual(yuanUp);
  });

  it("getVehicleBySlug devuelve undefined para un slug inexistente", () => {
    expect(getVehicleBySlug("no-existe")).toBeUndefined();
    expect(getVehicleBySlug("")).toBeUndefined();
  });
});

describe("integridad del catálogo", () => {
  it("los ids de producto son únicos a nivel global (viajan a Supabase y a las URLs)", () => {
    const ids = vehicles.flatMap((vehicle) =>
      vehicle.products.map((product) => product.id),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada id de producto deriva del slug del vehículo", () => {
    for (const vehicle of vehicles) {
      for (const product of vehicle.products) {
        expect(product.id).toMatch(
          new RegExp(`^${vehicle.slug}(?:-[a-z0-9]+)+$`),
        );
      }
    }
  });

  it("todo producto tiene al menos una imagen en WebP, sin duplicados", () => {
    for (const vehicle of vehicles) {
      for (const product of vehicle.products) {
        expect(product.images?.length).toBeGreaterThan(0);
        expect(
          new Set(product.images).size,
          `${product.id} repite imágenes`,
        ).toBe(product.images!.length);

        for (const image of product.images!) {
          expect(image).toMatch(/\.webp$/);
        }
      }
    }
  });

  it("todo producto tiene compatibilidad y especificaciones técnicas", () => {
    for (const vehicle of vehicles) {
      for (const product of vehicle.products) {
        expect(product.compatibility).toBeTruthy();
        expect(product.technicalDetails?.length).toBeGreaterThan(0);
      }
    }
  });

  it("ordena las imágenes de cada producto de forma estable (1, 2, 3…)", () => {
    for (const vehicle of vehicles) {
      for (const product of vehicle.products) {
        const numbers = product.images!.map((image) => {
          const match = image.match(/(\d+)(?:-?[a-z]*)?\.webp$/);
          return match ? Number(match[1]) : NaN;
        });

        expect(numbers.every((value) => !Number.isNaN(value))).toBe(true);
        expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
      }
    }
  });

  it("getProductById devuelve el producto correcto y undefined si no existe", () => {
    const yuanUp = getVehicleBySlug("yuan-up");
    const porton = yuanUp!.products.find(
      (product) => product.id === "yuan-up-porton-electrico",
    );

    expect(getProductById("yuan-up", "yuan-up-porton-electrico")).toEqual(
      porton,
    );

    expect(getProductById("yuan-up", "no-existe")).toBeUndefined();
    expect(getProductById("no-existe", "cualquiera")).toBeUndefined();
    expect(
      getProductById("yuan-up", "seagull-porton-electrico"),
    ).toBeUndefined();
  });
});