export const NAME_MAX_LENGTH = 60;
export const EMAIL_MAX_LENGTH = 254;
export const PHONE_MAX_LENGTH = 20;

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü'’ .-]+$/u;

const PHONE_CHARS_REGEX = /^[\d\s().+-]+$/u;

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

export const PHONE_ERROR =
  "Ingresa un teléfono colombiano válido: móvil 3XXXXXXXXX o fijo (7 u 10 dígitos).";

export type PhoneKind = "mobile" | "landline" | "invalid";

/**
 * Devuelve solo los dígitos del teléfono, sin separadores ni indicativo
 * internacional de Colombia (+57 / 57).
 */
export function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  if (digits.length > 10 && digits.startsWith("57")) {
    return digits.slice(2);
  }

  return digits;
}

export function getPhoneKind(raw: string): PhoneKind {
  const trimmed = raw.trim();

  if (!trimmed || !PHONE_CHARS_REGEX.test(trimmed)) {
    return "invalid";
  }

  const digits = normalizePhone(trimmed);

  if (digits.length === 0) {
    return "invalid";
  }

  // Móvil colombiano: 10 dígitos que empiezan por 3.
  if (/^3\d{9}$/.test(digits)) {
    return "mobile";
  }

  // Fijo local: 7 dígitos.
  if (/^[1-9]\d{6}$/.test(digits)) {
    return "landline";
  }

  // Fijo con indicativo: 10 dígitos que no empiezan por 3.
  if (/^\d{10}$/.test(digits) && digits[0] !== "3") {
    return "landline";
  }

  return "invalid";
}

export function validateName(name: string): string | null {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Escribe tu nombre.";
  }

  if (trimmed.length > NAME_MAX_LENGTH) {
    return `El nombre no puede superar los ${NAME_MAX_LENGTH} caracteres.`;
  }

  if (!NAME_REGEX.test(trimmed)) {
    return "El nombre solo puede contener letras, espacios y apóstrofes.";
  }

  return null;
}

export function validatePhone(phone: string): string | null {
  const trimmed = phone.trim();

  if (!trimmed) {
    return null;
  }

  if (!PHONE_CHARS_REGEX.test(trimmed)) {
    return PHONE_ERROR;
  }

  if (trimmed.length > PHONE_MAX_LENGTH) {
    return `El teléfono no puede superar los ${PHONE_MAX_LENGTH} caracteres.`;
  }

  if (getPhoneKind(trimmed) === "invalid") {
    return PHONE_ERROR;
  }

  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();

  if (!trimmed) {
    return null;
  }

  if (trimmed.length > EMAIL_MAX_LENGTH) {
    return `El correo no puede superar los ${EMAIL_MAX_LENGTH} caracteres.`;
  }

  if (!EMAIL_REGEX.test(trimmed)) {
    return "Escribe un correo electrónico válido.";
  }

  return null;
}

export function validateContact(
  phone: string,
  email: string,
): string | null {
  if (!phone.trim() && !email.trim()) {
    return "Escribe al menos un teléfono o un correo electrónico.";
  }

  return null;
}