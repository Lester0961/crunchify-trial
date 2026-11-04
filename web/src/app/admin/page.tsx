import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/server/security/admin";
import { database, databaseSchema } from "@/server/db";
export const metadata = { title: "Inquiries" };
export default async function Admin({ searchParams }: { searchParams: Promise<{ q?: string; status?: string; type?: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const params = await searchParams;
  const q = (params.q || "").trim().slice(0, 120);
  const status = ["new", "contacted", "closed"].includes(params.status || "") ? params.status : "";
  const type = ["wholesale", "partner"].includes(params.type || "") ? params.type : "";
  const db = database();
  const schema = databaseSchema();
  const [result, totals] = await Promise.all([
    db.query(`SELECT id, kind, status, created_at, sender_email_status, company_email_status, details->>'company' AS company, details->>'contact' AS contact
      FROM ${schema}.inquiries
      WHERE ($1::text = '' OR position(lower($1) in lower(coalesce(details->>'company','') || ' ' || coalesce(details->>'contact',''))) > 0)
        AND ($2::text = '' OR status = $2) AND ($3::text = '' OR kind = $3)
      ORDER BY created_at DESC LIMIT 200`, [q, status, type]),
    db.query(`SELECT count(*)::int AS total, count(*) FILTER (WHERE status='new')::int AS new, count(*) FILTER (WHERE status='contacted')::int AS contacted, count(*) FILTER (WHERE sender_email_status <> 'accepted' OR company_email_status <> 'accepted')::int AS email_attention FROM ${schema}.inquiries`),
  ]);
  const count = totals.rows[0];
  return <main className="shell page-section"><div className="admin-heading"><div><p className="eyebrow">Staff workspace</p><h1>Partnership inquiries</h1><p className="page-intro">A simple space to follow up.</p></div><form method="post" action="/api/admin/logout"><button className="header-action">Sign out</button></form></div>
    <div className="admin-summary" aria-label="Inquiry summary"><div><span>New</span><strong>{count.new}</strong></div><div><span>Contacted</span><strong>{count.contacted}</strong></div><div><span>Total</span><strong>{count.total}</strong></div></div>
    {count.email_attention > 0 && <p className="admin-alert" role="status">{count.email_attention} {count.email_attention === 1 ? "inquiry needs" : "inquiries need"} email follow-up. Open the inquiry to review its delivery status.</p>}
    <form className="admin-filters" action="/admin"><label>Search company or contact<input name="q" type="search" defaultValue={q} maxLength={120} /></label><label>Status<select name="status" defaultValue={status}><option value="">All statuses</option><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></label><label>Type<select name="type" defaultValue={type}><option value="">All inquiries</option><option value="wholesale">Wholesale</option><option value="partner">Brand and media</option></select></label><button className="button button-primary">Apply filters</button></form>
    {result.rows.length === 0 ? <p className="page-intro">{q || status || type ? "No inquiries match these filters." : "No inquiries yet."}</p> : <div className="admin-list">{result.rows.map(row => <Link href={`/admin/inquiries/${row.id}`} className="admin-row" key={row.id}><span><strong>{row.company}</strong><br />{row.contact}</span><span>{row.kind === "partner" ? "Brand and media" : "Wholesale"} · {row.status}{(row.sender_email_status !== "accepted" || row.company_email_status !== "accepted") && <><br /><span className="admin-alert-label">Email follow-up needed</span></>}</span><span>{new Date(row.created_at).toLocaleDateString("en-GB")}</span></Link>)}</div>}
  </main>;
}
