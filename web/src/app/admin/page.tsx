import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/server/security/admin";
import { database } from "@/server/db";
export const metadata = { title: "Inquiries" };
export default async function Admin() {
  if (!(await isAdmin())) redirect("/admin/login");
  const result = await database().query("SELECT id, kind, status, created_at, details->>'company' AS company, details->>'contact' AS contact FROM crunchify_private.inquiries ORDER BY created_at DESC LIMIT 200");
  return <main className="shell page-section"><div className="admin-heading"><div><p className="eyebrow">Staff workspace</p><h1>Inquiries</h1></div><form method="post" action="/api/admin/logout"><button className="header-action">Sign out</button></form></div>{result.rows.length === 0 ? <p className="page-intro">No inquiries yet.</p> : <div className="admin-list">{result.rows.map(row => <Link href={`/admin/inquiries/${row.id}`} className="admin-row" key={row.id}><span><strong>{row.company}</strong><br />{row.contact}</span><span>{row.kind} · {row.status}</span><span>{new Date(row.created_at).toLocaleDateString("en-GB")}</span></Link>)}</div>}</main>;
}
