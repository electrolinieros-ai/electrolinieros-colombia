import { describe, expect, it } from "vitest";

import {
  NAME_MAX_LENGTH,
  getPhoneKind,
  normalizePhone,
  validateContact,
  validateEmail,
  validateName,
  validatePhone,
} from "./validation";

describe("validateName", () => {
  it("acepta nombres válidos con tildes y ñ", () => {
    expect(validateName("Juan Sebastián Gómez Muñoz")).toBeNull();
    expect(validateName("María del Rosario")).toBeNull();
    expect(validateName("JOSÉ")).toBeNull();
  });

  it("acepta apóstrofes, puntos y guiones", () => {
    expect(validateName("Diana M. O'Neil")).toBeNull();
    expect(validateName("Ana-María Lago")).toBeNull();
  });

  it("rechaza nombres vacíos o de solo espacios", () => {
    expect(validateName("")).toBe("Escribe tu nombre.");
    expect(validateName("   ")).toBe("Escribe tu nombre.");
  });

  it("rechaza nombres demasiado largos", () => {
    expect(validateName("A".repeat(NAME_MAX_LENGTH + 1))).toMatch(
      /no puede superar/,
    );
    expect(validateName("A".repeat(NAME_MAX_LENGTH))).toBeNull();
  });

  it("bloquea scripts y payloads de XSS", () => {
    for (const payload of [
      "<script>alert(1)</script>",
      "<img src=x onerror=alert(1)>",
      "<svg onload=alert(1)>",
      '"><script>alert(1)</script>',
      "&lt;script&gt;alert(1)&lt;/script&gt;",
    ]) {
      expect(validateName(payload)).toBe(
        "El nombre solo puede contener letras, espacios y apóstrofes.",
      );
    }
  });

  it("bloquea payloads de inyección SQL", () => {
    for (const payload of [
      `"; DROP TABLE leads; --`,
      `' OR '1'='1`,
      `1; DELETE * FROM users`,
      `../etc/passwd`,
      `name\nexecute_shell("rm -rf /")`,
    ]) {
      expect(validateName(payload)).toBe(
        "El nombre solo puede contener letras, espacios y apóstrofes.",
      );
    }
  });

  it("rechaza símbolos peligrosos y números", () => {
    for (const payload of ["Juan; rm -rf /", "123456", "A<>B", "Juan&Ana"]) {
      expect(validateName(payload)).toBe(
        "El nombre solo puede contener letras, espacios y apóstrofes.",
      );
    }
  });
});

describe("normalizePhone", () => {
  it("deja solo los dígitos", () => {
    expect(normalizePhone("(606) 345-6789")).toBe("6063456789");
    expect(normalizePhone("311 222 33 44")).toBe("3112223344");
  });

  it("quita el indicativo internacional de Colombia", () => {
    expect(normalizePhone("+57 3142507000")).toBe("3142507000");
    expect(normalizePhone("573142507000")).toBe("3142507000");
  });
});

describe("getPhoneKind", () => {
  it("reconoce móviles colombianos de 10 dígitos que empiezan con 3", () => {
    expect(getPhoneKind("3142507000")).toBe("mobile");
    expect(getPhoneKind("+57 3201234567")).toBe("mobile");
    expect(getPhoneKind("573302345678")).toBe("mobile");
  });

  it("reconoce fijos locales de 7 dígitos", () => {
    expect(getPhoneKind("6601234")).toBe("landline");
    expect(getPhoneKind("2345678")).toBe("landline");
  });

  it("reconoce fijos con indicativo de 10 dígitos", () => {
    expect(getPhoneKind("6063456789")).toBe("landline");
    expect(getPhoneKind("6012345678")).toBe("landline");
  });

  it("rechaza teléfonos no válidos", () => {
    expect(getPhoneKind("")).toBe("invalid");
    expect(getPhoneKind("12345")).toBe("invalid");
    expect(getPhoneKind("314250700")).toBe("invalid");
    expect(getPhoneKind("03212345678")).toBe("invalid");
    expect(getPhoneKind("abc1234567")).toBe("invalid");
  });
});

describe("validatePhone", () => {
  it("permite vacío (opcional si hay correo)", () => {
    expect(validatePhone("")).toBeNull();
    expect(validatePhone("   ")).toBeNull();
  });

  it("acepta móvil y fijo", () => {
    expect(validatePhone("3142507000")).toBeNull();
    expect(validatePhone("6601234")).toBeNull();
    expect(validatePhone("6063456789")).toBeNull();
    expect(validatePhone("+57 314 250 7000")).toBeNull();
  });

  it("rechaza teléfonos inválidos con el mensaje colombiano", () => {
    expect(validatePhone("123456789")).toMatch(/teléfono colombiano/i);
    expect(validatePhone("314250700")).toMatch(/teléfono colombiano/i);
    expect(validatePhone("11")).toMatch(/teléfono colombiano/i);
  });

  it("bloquea payloads de inyección en el teléfono", () => {
    expect(validatePhone("); DROP TABLE leads; --")).toMatch(
      /teléfono colombiano/i,
    );
    expect(validatePhone("314<svg>")).toMatch(/teléfono colombiano/i);
  });
});

describe("validateEmail", () => {
  it("permite vacío (opcional si hay teléfono)", () => {
    expect(validateEmail("")).toBeNull();
    expect(validateEmail("  ")).toBeNull();
  });

  it("acepta correos válidos", () => {
    expect(validateEmail("ELECTROLINIEROS@gmail.com")).toBeNull();
    expect(validateEmail("juan.gomez+ventas@hotmail.co")).toBeNull();
    expect(validateEmail("info@ELECTROLINIEROS.com.co")).toBeNull();
  });

  it("rechaza correos inválidos", () => {
    expect(validateEmail("juan@@gmail.com")).toBe("Escribe un correo electrónico válido.");
    expect(validateEmail("juan gomez@gmail.com")).toBe("Escribe un correo electrónico válido.");
    expect(validateEmail("juan@sinpunto")).toBe("Escribe un correo electrónico válido.");
    expect(validateEmail("@gmail.com")).toBe("Escribe un correo electrónico válido.");
  });

  it("bloquea payloads de inyección en el correo", () => {
    for (const payload of [
      `juan@x.com<script>alert(1)</script>`,
      `" OR 1=1 -- @a.com`,
      `juan@x.com\nBCC: spam@x.com`,
    ]) {
      expect(validateEmail(payload)).toBe("Escribe un correo electrónico válido.");
    }
  });
});

describe("validateContact", () => {
  it("rechaza cuando no hay ni teléfono ni correo", () => {
    expect(validateContact("", "")).toBe(
      "Escribe al menos un teléfono o un correo electrónico.",
    );
  });

  it("acepta cuando hay teléfono o correo", () => {
    expect(validateContact("3142507000", "")).toBeNull();
    expect(validateContact("", "juan@gmail.com")).toBeNull();
    expect(validateContact("3142507000", "juan@gmail.com")).toBeNull();
  });
});