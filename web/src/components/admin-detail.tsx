import Link from "next/link";
import type { DisplayField } from "@/features/inquiries/display";
import {
  inquiryDate,
  kindLabel,
  statusLabel,
} from "@/features/inquiries/status";
import { StatusBadge } from "./admin-inbox";
import { CheckIcon } from "./icons";
import { FollowupForm } from "@/features/admin/followup-form";
import { RetryEmailsForm } from "@/features/admin/retry-emails-form";

export type InquiryHistory = {
  id: number;
  changed_at: string | Date;
  actor: string;
  old_status: string;
  new_status: string;
  old_note: string;
  new_note: string;
};
type DetailProps = {
  id: string;
  company: string;
  kind: string;
  createdAt: string | Date;
  fields: DisplayField[];
  senderEmailStatus: string;
  companyEmailStatus: string;
  status: string;
  note: string;
  history: InquiryHistory[];
  notice?: "saved" | "retried";
  backHref?: string;
};

function FieldValue({ field }: { field: DisplayField }) {
  if (field.key === "email")
    return (
      <a className="text-link" href={`mailto:${field.value}`}>
        {field.value}
      </a>
    );
  if (field.key === "phone")
    return (
      <a
        className="text-link"
        href={`tel:${field.value.replace(/[^+\d]/g, "")}`}
      >
        {field.value}
      </a>
    );
  return <>{field.value}</>;
}

export function AdminDetail({
  id,
  company,
  kind,
  createdAt,
  fields,
  senderEmailStatus,
  companyEmailStatus,
  status,
  note,
  history,
  notice,
  backHref = "/admin",
}: DetailProps) {
  const retry =
    senderEmailStatus !== "accepted" || companyEmailStatus !== "accepted";
  return (
    <main className="admin-page">
      <Link className="text-link admin-back" href={backHref}>
        Back to inquiries
      </Link>
      <header className="admin-heading admin-detail-heading flex items-center justify-between gap-6">
        <div>
          <div className="inquiry-meta">
            <span>{kindLabel(kind)}</span>
            <StatusBadge status={status} />
          </div>
          <h1>{company}</h1>
          <p>Received {inquiryDate(createdAt, true)}</p>
        </div>
      </header>
      {notice && (
        <p className="admin-save-notice" role="status">
          <CheckIcon />
          {notice === "saved"
            ? "Changes saved."
            : "Email retry completed. Review the email statuses below."}
        </p>
      )}
      <div className="admin-detail-layout grid">
        <div>
          <section
            className="admin-detail-card"
            aria-labelledby="inquiry-details-heading"
          >
            <h2 id="inquiry-details-heading">Inquiry details</h2>
            <dl className="detail-list">
              {fields.map((field) => (
                <div key={field.key}>
                  <dt>{field.label}</dt>
                  <dd>
                    <FieldValue field={field} />
                  </dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="admin-email-card" aria-labelledby="email-heading">
            <h2 id="email-heading">Email follow-up</h2>
            <dl className="email-status-list">
              <div>
                <dt>Confirmation to sender</dt>
                <dd
                  className={
                    senderEmailStatus === "accepted"
                      ? "email-accepted"
                      : "email-pending"
                  }
                >
                  {senderEmailStatus === "accepted"
                    ? "Accepted by provider"
                    : "Needs attention"}
                </dd>
              </div>
              <div>
                <dt>Team notification</dt>
                <dd
                  className={
                    companyEmailStatus === "accepted"
                      ? "email-accepted"
                      : "email-pending"
                  }
                >
                  {companyEmailStatus === "accepted"
                    ? "Accepted by provider"
                    : "Needs attention"}
                </dd>
              </div>
            </dl>
            <RetryEmailsForm
              action={`/api/admin/inquiries/${id}/retry?returnTo=${encodeURIComponent(backHref)}`}
              needed={retry}
            />
          </section>
        </div>
        <aside id="follow-up" className="admin-followup">
          <h2>Follow-up</h2>
          <p className="field-hint">Keep the next step clear for the team.</p>
          <FollowupForm
            key={id}
            id={id}
            status={status}
            note={note}
            action={`/api/admin/inquiries/${id}?returnTo=${encodeURIComponent(backHref)}`}
          />
        </aside>
      </div>
      <section className="change-history" aria-labelledby="change-history">
        <div>
          <h2 id="change-history">Change history</h2>
          <p>
            Most recent 100 changes. Staff currently use a shared admin account.
          </p>
        </div>
        {history.length === 0 ? (
          <p className="history-empty">No status or note changes yet.</p>
        ) : (
          <ol>
            {history.map((entry) => (
              <li key={entry.id}>
                <p className="history-meta">
                  <strong>{entry.actor}</strong>
                  <time dateTime={new Date(entry.changed_at).toISOString()}>
                    {inquiryDate(entry.changed_at, true)}
                  </time>
                </p>
                {entry.old_status !== entry.new_status && (
                  <p>
                    Status changed from {statusLabel(entry.old_status)} to{" "}
                    {statusLabel(entry.new_status)}.
                  </p>
                )}
                {entry.old_note !== entry.new_note && (
                  <div className="history-notes">
                    <p>
                      <span>Previous note</span>
                      {entry.old_note || "No note"}
                    </p>
                    <p>
                      <span>Updated note</span>
                      {entry.new_note || "No note"}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
