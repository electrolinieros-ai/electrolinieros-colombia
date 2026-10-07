const NETWORK_ERROR_PATTERN =
  /network|fetch|failed to fetch|load failed|etimedout|timeout|abort|connection|offline|gateway|504|503/i;

export function getRouteErrorMessage(error: unknown, code?: string | null): string {
  if (error instanceof Error && NETWORK_ERROR_PATTERN.test(error.message)) {
    return "Hubo un problema de conexión. Revisa tu internet e inténtalo de nuevo.";
  }

  if (code && NETWORK_ERROR_PATTERN.test(code)) {
    return "Hubo un problema de conexión. Revisa tu internet e inténtalo de nuevo.";
  }

  return "Ocurrió un error inesperado al cargar esta página.";
}