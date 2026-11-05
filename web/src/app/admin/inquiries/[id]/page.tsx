import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isAdmin } from "@/server/security/admin";
import { database, databaseSchema } from "@/server/db";
import { isInquiryId } from "@/server/security/inquiry-id";
import { formatInquiryDetails } from "@/features/inquiries/display";
import { products } from "@/features/products/data";
export default async function InquiryDetail({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) redirect("/admin/login");
  const { id } = await params;
  if (!isInquiryId(id)) notFound();
  const result = await database().query(`SELECT * FROM ${databaseSchema()}.inquiries WHERE id=$1`, [id]);
  const inquiry = result.rows[0];
  if (!inquiry) notFound();
  const history = await database().query(`SELECT changed_at, actor, old_status, new_status, old_note, new_note FROM ${databaseSchema()}.inquiry_history WHERE inquiry_id=$1 ORDER BY changed_at DESC, id DESC LIMIT 100`, [id]);
  const d = inquiry.details as Record<string, unknown> | null;
  const company = typeof d?.company === "string" && d.company ? d.company : "Inquiry";
  const productNames = Object.fromEntries(products.map((product) => [product.slug, product.name]));
  const fields = formatInquiryDetails(d, inquiry.kind, productNames);
  return <main className="shell page-section narrow"><Link className="text-link" href="/admin">All inquiries</Link><h1 className="detail-title">{company}</h1><p className="page-intro">{inquiry.kind === "partner" ? "Brand and media" : "Wholesale"} inquiry · {new Date(inquiry.created_at).toLocaleString("en-GB")}</p><dl className="detail-list">{fields.map((field) => <div key={field.key}><dt>{field.label}</dt><dd>{field.value}</dd></div>)}</dl><p>Sender email: {inquiry.sender_email_status} · Company email: {inquiry.company_email_status}</p>{(inquiry.sender_email_status !== "accepted" || inquiry.company_email_status !== "accepted") && <form method="post" action={`/api/admin/inquiries/${id}/retry`} className="content-block"><p>Check the email provider’s delivery history before retrying. A timeout can leave delivery uncertain.</p><button className="button button-primary">Retry pending emails</button></form>}<form className="inquiry-form content-block" action={`/api/admin/inquiries/${id}`} method="post"><label>Status<select name="status" defaultValue={inquiry.status}><option value="new">New</option><option value="contacted">Contacted</option><option value="closed">Closed</option></select></label><label>Internal note<textarea name="note" defaultValue={inquiry.internal_note} maxLength={5000} rows={5} /></label><button className="button button-primary">Save changes</button></form><section className="content-block change-history" aria-labelledby="change-history"><h2 id="change-history">Change history</h2><p>Most recent 100 changes. All staff currently use a shared admin account.</p>{history.rows.length === 0 ? <p>No status or note changes yet.</p> : <ol>{history.rows.map((entry, index) => <li key={index}><p><strong>{entry.actor}</strong> · <time dateTime={new Date(entry.changed_at).toISOString()}>{new Date(entry.changed_at).toLocaleString("en-GB")}</time></p>{entry.old_status !== entry.new_status && <p>Status: {entry.old_status} → {entry.new_status}</p>}{entry.old_note !== entry.new_note && <><p>Previous note: {entry.old_note || "(empty)"}</p><p>Updated note: {entry.new_note || "(empty)"}</p></>}</li>)}</ol>}</section></main>;
}
