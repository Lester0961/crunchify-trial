type DisplayField = { key: string; label: string; value: string };

function text(value: unknown): string {
  if (value == null || value === "") return "";
  return typeof value === "object" ? JSON.stringify(value) : String(value);
}

function readableName(key: string): string {
  const words = key.replace(/^utm_/, "").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[_-]+/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : "Other";
}

/** Formats saved data for staff without discarding unrecognized fields. */
export function formatInquiryDetails(value: unknown, kind: string, productNames: Record<string, string>): DisplayField[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) return [];
  const data = value as Record<string, unknown>;
  const fields: DisplayField[] = [];
  const known: [string, string][] = [
    ["contact", "Contact person"], ["email", "Email address"], ["phone", "Phone or WhatsApp"],
    ["businessType", kind === "partner" ? "Collaboration type" : "Business type"],
    ["territory", "Territory or location"], ["volume", "Estimated monthly volume"],
    ["products", "Products of interest"], ["message", "Message"], ["source", "First page visited"],
  ];
  for (const [key, label] of known) {
    const raw = data[key];
    const formatted = key === "products" && Array.isArray(raw)
      ? raw.map((item) => typeof item === "string" ? (Object.prototype.hasOwnProperty.call(productNames, item) ? productNames[item] : item) : text(item)).filter(Boolean).join(", ")
      : text(raw);
    if (formatted) fields.push({ key, label, value: formatted });
  }
  if (data.utm && typeof data.utm === "object" && !Array.isArray(data.utm)) {
    for (const [key, raw] of Object.entries(data.utm)) {
      const formatted = text(raw);
      if (formatted) fields.push({ key: `utm:${key}`, label: `UTM ${readableName(key).toLowerCase()}`, value: formatted });
    }
  } else if (text(data.utm)) {
    fields.push({ key: "utm", label: "UTM", value: text(data.utm) });
  }
  const handled = new Set([...known.map(([key]) => key), "company", "type", "utm", "website", "submissionId"]);
  for (const [key, raw] of Object.entries(data)) {
    const formatted = text(raw);
    if (!handled.has(key) && formatted) fields.push({ key: `other:${key}`, label: readableName(key), value: formatted });
  }
  return fields;
}
