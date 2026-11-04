/** Validate browser Origin against Host; a TLS proxy must overwrite X-Forwarded-Proto. */
export function sameOriginUrl(request: Request): URL | null {
  const host = request.headers.get("host");
  const origin = request.headers.get("origin");
  if (!host || !origin || /[\s/@\\?#]/.test(host)) return null;

  const forwarded = request.headers.get("x-forwarded-proto");
  const protocol = forwarded ?? new URL(request.url).protocol.slice(0, -1);
  if (protocol !== "http" && protocol !== "https") return null;
  try {
    const expected = new URL(`${protocol}://${host}`);
    return origin === expected.origin ? expected : null;
  } catch {
    return null;
  }
}
