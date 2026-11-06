import Link from "next/link";
import { InboxIcon, OpenIcon } from "./icons";
import { InboxFilters } from "@/features/admin/inbox-filters";
import {
  inquiryDate,
  kindLabel,
  statusLabel,
} from "@/features/inquiries/status";

export type InboxRow = {
  id: string;
  kind: string;
  status: string;
  created_at: Date | string;
  sender_email_status: string;
  company_email_status: string;
  company: string;
  contact: string;
};
export type InboxTotals = {
  new: number;
  contacted: number;
  total: number;
  email_attention: number;
};
type InboxProps = {
  rows: InboxRow[];
  totals: InboxTotals;
  q: string;
  status: string;
  type: string;
  page: number;
  pageCount: number;
  matchCount: number;
  offset: number;
  previousHref?: string;
  nextHref?: string;
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`status-badge status-${status}`}>
      <span aria-hidden="true" />
      {statusLabel(status)}
    </span>
  );
}
const needsEmail = (row: InboxRow) =>
  row.sender_email_status !== "accepted" ||
  row.company_email_status !== "accepted";

export function AdminInbox({
  rows,
  totals,
  q,
  status,
  type,
  page,
  pageCount,
  matchCount,
  offset,
  previousHref,
  nextHref,
}: InboxProps) {
  const filtered = Boolean(q || status || type);
  const query = new URLSearchParams();
  if (q) query.set("q", q);
  if (status) query.set("status", status);
  if (type) query.set("type", type);
  if (page > 1) query.set("page", String(page));
  const returnTo = `/admin${query.size ? "?" + query : ""}`;
  const detailHref = (id: string) =>
    `/admin/inquiries/${id}${query.size ? "?returnTo=" + encodeURIComponent(returnTo) : ""}`;
  return (
    <main className="admin-page">
      <header className="admin-heading flex items-center justify-between gap-6">
        <div>
          <p className="section-kicker">Partner workspace</p>
          <h1>Inquiries</h1>
          <p>Good conversations, all in one place.</p>
        </div>
        <span className="staff-label">Staff access</span>
      </header>
      <dl className="admin-summary grid">
        <div>
          <dt>New inquiries</dt>
          <dd>{totals.new}</dd>
        </div>
        <div>
          <dt>In progress</dt>
          <dd>{totals.contacted}</dd>
        </div>
        <div>
          <dt>All inquiries</dt>
          <dd>{totals.total}</dd>
        </div>
      </dl>
      {totals.email_attention > 0 && (
        <p className="admin-alert" role="status">
          {totals.email_attention}{" "}
          {totals.email_attention === 1 ? "inquiry needs" : "inquiries need"}{" "}
          email follow-up. Open an inquiry to review its email status.
        </p>
      )}
      <section className="inbox-surface" aria-labelledby="inbox-heading">
        <div className="inbox-heading">
          <h2 id="inbox-heading">
            {filtered ? "Matching inquiries" : "All inquiries"}
          </h2>
          <span>
            {matchCount} {matchCount === 1 ? "inquiry" : "inquiries"}
          </span>
        </div>
        <InboxFilters
          key={`${q}:${status}:${type}`}
          q={q}
          status={status}
          type={type}
        />
        {rows.length === 0 ? (
          <div className="admin-empty">
            <InboxIcon />
            <h3>
              {filtered
                ? "No matching inquiries."
                : "Ready for the first hello."}
            </h3>
            <p>
              {filtered
                ? "Try a different search or clear the filters."
                : "Wholesale and brand inquiries will appear here when they arrive."}
            </p>
            {filtered && (
              <Link
                className="button button-outline button-small"
                href="/admin"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="inbox-desktop">
              <table className="inquiry-table">
                <thead>
                  <tr>
                    <th scope="col">Company / contact</th>
                    <th scope="col">Type</th>
                    <th scope="col">Status</th>
                    <th scope="col">Received</th>
                    <th scope="col">
                      <span className="sr-only">Open inquiry</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <Link
                          className="inquiry-company"
                          href={detailHref(row.id)}
                        >
                          {row.company}
                        </Link>
                        <span className="table-secondary">{row.contact}</span>
                        {needsEmail(row) && (
                          <span className="email-attention">
                            Email follow-up needed
                          </span>
                        )}
                      </td>
                      <td>{kindLabel(row.kind)}</td>
                      <td>
                        <StatusBadge status={row.status} />
                      </td>
                      <td>
                        <time dateTime={new Date(row.created_at).toISOString()}>
                          {inquiryDate(row.created_at)}
                        </time>
                      </td>
                      <td>
                        <Link
                          className="open-inquiry"
                          aria-label={`Open inquiry from ${row.company}`}
                          href={detailHref(row.id)}
                        >
                          <OpenIcon />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <ul className="inbox-mobile">
              {rows.map((row) => (
                <li key={row.id}>
                  <div className="inbox-card-top">
                    <span>{kindLabel(row.kind)}</span>
                    <StatusBadge status={row.status} />
                  </div>
                  <h3>
                    <Link href={detailHref(row.id)}>{row.company}</Link>
                  </h3>
                  <p>{row.contact}</p>
                  {needsEmail(row) && (
                    <span className="email-attention">
                      Email follow-up needed
                    </span>
                  )}
                  <div className="inbox-card-bottom">
                    <time dateTime={new Date(row.created_at).toISOString()}>
                      {inquiryDate(row.created_at)}
                    </time>
                    <Link href={detailHref(row.id)}>
                      Open inquiry
                      <OpenIcon />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        {matchCount > 0 && (
          <nav className="admin-pagination" aria-label="Inquiry pages">
            <p>
              Showing {offset + 1}–{offset + rows.length} of {matchCount}
            </p>
            <div>
              {previousHref && (
                <Link className="text-link" href={previousHref}>
                  Previous
                </Link>
              )}
              <span>
                Page {page} of {pageCount}
              </span>
              {nextHref && (
                <Link className="text-link" href={nextHref}>
                  Next
                </Link>
              )}
            </div>
          </nav>
        )}
      </section>
    </main>
  );
}
