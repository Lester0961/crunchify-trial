/** Only these fixed identifiers may be interpolated into SQL. */
export function selectDatabaseSchema(env: {
  DATABASE_SCHEMA?: string;
  VERCEL_ENV?: string;
}) {
  const schema =
    env.DATABASE_SCHEMA ||
    (env.VERCEL_ENV === "preview" ? "crunchify_preview" : "crunchify_private");
  if (schema !== "crunchify_private" && schema !== "crunchify_preview") {
    throw new Error("Invalid database schema");
  }
  if (env.VERCEL_ENV === "preview" && schema !== "crunchify_preview") {
    throw new Error("Preview must use the preview schema");
  }
  if (env.VERCEL_ENV === "production" && schema !== "crunchify_private") {
    throw new Error("Production must use the production schema");
  }
  return schema;
}
