/**
 * Returns the base URL for API calls.
 * - In production (deployed static build), points to the Render backend.
 * - In local dev, uses relative paths so Next.js API routes handle them.
 */
export function apiUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (base) {
    return `${base.replace(/\/$/, "")}${path}`;
  }
  return path;
}
