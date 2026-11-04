/** Preview must never fall back to the production database credential. */
export function selectDatabaseUrl(env: { VERCEL_ENV?: string; DATABASE_URL?: string; PREVIEW_DATABASE_URL?: string }) {
  const value = env.VERCEL_ENV === "preview" ? env.PREVIEW_DATABASE_URL : env.DATABASE_URL;
  if (!value) throw new Error(env.VERCEL_ENV === "preview" ? "Preview database is not configured" : "Database is not configured");
  return value;
}
