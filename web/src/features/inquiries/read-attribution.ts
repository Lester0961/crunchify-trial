type Attribution = { source: string; utm: Record<string, string> };

export function readAttribution(): Attribution {
  const fallback: Attribution = { source: window.location.pathname, utm: {} };
  try {
    const stored = JSON.parse(
      sessionStorage.getItem("crunchify_attribution") || "null",
    );
    if (!stored || typeof stored !== "object") return fallback;
    const source =
      typeof stored.source === "string"
        ? stored.source.slice(0, 500)
        : fallback.source;
    const utm: Record<string, string> = {};
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ]) {
      if (typeof stored.utm?.[key] === "string")
        utm[key] = stored.utm[key].slice(0, 200);
    }
    return { source, utm };
  } catch {
    return fallback;
  }
}
