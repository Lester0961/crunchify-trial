"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  useTransition,
  type FormEvent,
} from "react";
import { AdminRequestError, submitAdminForm } from "./form-request";
import {
  isInquiryStatus,
  type InquiryStatus,
} from "@/features/inquiries/status";

type Values = { status: InquiryStatus; note: string };
type Feedback = {
  kind: "idle" | "saved" | "error";
  message: string;
  signedOut?: boolean;
};

export function FollowupForm({
  id,
  status,
  note,
  action,
}: {
  id: string;
  status: string;
  note: string;
  action: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Values>({
    status: isInquiryStatus(status) ? status : "new",
    note,
  });
  const [baseline, setBaseline] = useState(values);
  const inFlight = useRef(false);
  const [saving, setSaving] = useState(false);
  const [refreshing, refresh] = useTransition();
  const [feedback, setFeedback] = useState<Feedback>({
    kind: "idle",
    message: "",
  });
  const storageKey = `crunchify_draft:${id}`;
  const dirty =
    values.status !== baseline.status || values.note !== baseline.note;

  useEffect(() => {
    try {
      const draft: unknown = JSON.parse(
        sessionStorage.getItem(storageKey) || "null",
      );
      if (
        !draft ||
        typeof draft !== "object" ||
        !("status" in draft) ||
        !("note" in draft)
      )
        return;
      if (
        isInquiryStatus(draft.status) &&
        typeof draft.note === "string" &&
        draft.note.length <= 5000
      ) {
        // Restore this tab's browser-only draft after the server form hydrates.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setValues({ status: draft.status, note: draft.note });
      }
    } catch {
      /* Storage may be unavailable; editing still works. */
    }
  }, [storageKey]);

  function change(next: Values) {
    setValues(next);
    setFeedback({ kind: "idle", message: "" });
    try {
      if (next.status === baseline.status && next.note === baseline.note)
        sessionStorage.removeItem(storageKey);
      else sessionStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* The current draft remains in the form. */
    }
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    setFeedback({ kind: "idle", message: "" });
    try {
      const result = await submitAdminForm(action, new URLSearchParams(values));
      if (
        result.saved !== true ||
        result.id !== id ||
        !isInquiryStatus(result.status) ||
        typeof result.note !== "string"
      ) {
        throw new AdminRequestError(
          "We couldn’t confirm the save. Your changes are still here.",
        );
      }
      const confirmed = { status: result.status, note: result.note };
      setBaseline(confirmed);
      setValues(confirmed);
      try {
        sessionStorage.removeItem(storageKey);
      } catch {
        /* Already saved on the server. */
      }
      setFeedback({ kind: "saved", message: "Changes saved." });
      refresh(() => router.refresh());
    } catch (error) {
      setFeedback({
        kind: "error",
        message:
          error instanceof Error
            ? error.message
            : "We couldn’t save your changes. Please try again.",
        signedOut: error instanceof AdminRequestError && error.status === 403,
      });
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  }

  return (
    <form
      className="inquiry-form followup-form"
      action={action}
      method="post"
      onSubmit={save}
      aria-busy={saving || refreshing}
    >
      <fieldset className="form-fields" disabled={saving || refreshing}>
        <legend className="sr-only">Follow-up details</legend>
        <label>
          Status
          <select
            name="status"
            value={values.status}
            onChange={(event) =>
              change({ ...values, status: event.target.value as InquiryStatus })
            }
          >
            <option value="new">New</option>
            <option value="contacted">In progress</option>
            <option value="closed">Closed</option>
          </select>
        </label>
        <label>
          Internal note
          <textarea
            name="note"
            value={values.note}
            maxLength={5000}
            rows={7}
            placeholder="Add context or the next step."
            onChange={(event) =>
              change({ ...values, note: event.target.value })
            }
          />
        </label>
      </fieldset>
      {dirty && feedback.kind === "idle" && !saving && (
        <p className="field-hint draft-notice">
          Unsaved changes · kept in this tab
        </p>
      )}
      {feedback.message && (
        <p
          role={feedback.kind === "error" ? "alert" : "status"}
          className={
            feedback.kind === "error"
              ? "form-error form-alert"
              : "admin-save-notice"
          }
        >
          {feedback.message}
          {feedback.signedOut && (
            <>
              {" "}
              <Link className="text-link" href="/admin/login">
                Sign in
              </Link>
            </>
          )}
        </p>
      )}
      <span className="sr-only" role="status">
        {saving ? "Saving your changes…" : ""}
      </span>
      <button
        className="button button-primary"
        type="submit"
        disabled={saving || refreshing}
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
