import { redirect } from "next/navigation";
import { isAdmin } from "@/server/security/admin";
import { database, databaseSchema } from "@/server/db";
import {
  AdminInbox,
  type InboxRow,
  type InboxTotals,
} from "@/components/admin-inbox";
export const metadata = { title: "Inquiries" };
type QueryValue = string | string[] | undefined;
const scalar = (value: QueryValue) => (typeof value === "string" ? value : "");
const pageSize = 50;
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<{
    q?: QueryValue;
    status?: QueryValue;
    type?: QueryValue;
    page?: QueryValue;
  }>;
}) {
  if (!(await isAdmin())) redirect("/admin/login");
  const params = await searchParams;
  const q = scalar(params.q).trim().slice(0, 120);
  const status = ["new", "contacted", "closed"].includes(scalar(params.status))
    ? scalar(params.status)
    : "";
  const type = ["wholesale", "partner"].includes(scalar(params.type))
    ? scalar(params.type)
    : "";
  const pageParam = scalar(params.page);
  const requestedPage = /^\d{1,7}$/.test(pageParam)
    ? Math.max(1, Number(pageParam))
    : 1;
  const db = database();
  const schema = databaseSchema();
  const filter = `WHERE ($1::text = '' OR position(lower($1) in lower(coalesce(details->>'company','') || ' ' || coalesce(details->>'contact',''))) > 0)
        AND ($2::text = '' OR status = $2) AND ($3::text = '' OR kind = $3)`;
  const [matched, totals] = await Promise.all([
    db.query(
      `SELECT count(*)::int AS count FROM ${schema}.inquiries ${filter}`,
      [q, status, type],
    ),
    db.query<InboxTotals>(
      `SELECT count(*)::int AS total, count(*) FILTER (WHERE status='new')::int AS new, count(*) FILTER (WHERE status='contacted')::int AS contacted, count(*) FILTER (WHERE sender_email_status <> 'accepted' OR company_email_status <> 'accepted')::int AS email_attention FROM ${schema}.inquiries`,
    ),
  ]);
  const matchCount = Number(matched.rows[0].count);
  const pageCount = Math.max(1, Math.ceil(matchCount / pageSize));
  const page = Math.min(requestedPage, pageCount);
  const offset = (page - 1) * pageSize;
  const result = await db.query<InboxRow>(
    `SELECT id, kind, status, created_at, sender_email_status, company_email_status, details->>'company' AS company, details->>'contact' AS contact
      FROM ${schema}.inquiries ${filter}
      ORDER BY created_at DESC, id DESC LIMIT $4 OFFSET $5`,
    [q, status, type, pageSize, offset],
  );
  const pageLink = (number: number) => {
    const query = new URLSearchParams();
    if (q) query.set("q", q);
    if (status) query.set("status", status);
    if (type) query.set("type", type);
    if (number > 1) query.set("page", String(number));
    const suffix = query.toString();
    return suffix ? `/admin?${suffix}` : "/admin";
  };
  return (
    <AdminInbox
      rows={result.rows}
      totals={totals.rows[0]}
      q={q}
      status={status}
      type={type}
      page={page}
      pageCount={pageCount}
      matchCount={matchCount}
      offset={offset}
      previousHref={page > 1 ? pageLink(page - 1) : undefined}
      nextHref={page < pageCount ? pageLink(page + 1) : undefined}
    />
  );
}
