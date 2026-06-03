/**
 * Normalize an API path: ensure it starts with "/" and remove double slashes.
 */
export function normalizeApiPath(path: string): string {
  const normalized = path.replace(/\/+/g, '/');
  return normalized.startsWith('/') ? normalized : `/${normalized}`;
}

/**
 * Join a base URL and a path, ensuring no double slashes.
 */
export function joinApiUrl(baseUrl: string, path: string): string {
  const base = baseUrl.trim().replace(/\/+$/, '');
  const normalized = normalizeApiPath(path);
  return `${base}${normalized}`;
}
