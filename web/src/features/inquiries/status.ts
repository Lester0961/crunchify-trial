export type InquiryStatus = "new" | "contacted" | "closed";
export function isInquiryStatus(value: unknown): value is InquiryStatus {
  return value === "new" || value === "contacted" || value === "closed";
}
const labels: Record<string, string> = {
  new: "New",
  contacted: "In progress",
  closed: "Closed",
};
export const statusLabel = (value: string) => labels[value] || value;
export const kindLabel = (value: string) =>
  value === "partner" ? "Brand & media" : "Wholesale";
export function inquiryDate(value: string | Date, includeTime = false) {
  return new Date(value).toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
}
