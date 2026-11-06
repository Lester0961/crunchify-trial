"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition, type FormEvent } from "react";
import { submitAdminForm } from "./form-request";

export function RetryEmailsForm({
  action,
  needed,
}: {
  action: string;
  needed: boolean;
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [refreshing, refresh] = useTransition();
  const [feedback, setFeedback] = useState({ error: false, message: "" });
  const inFlight = useRef(false);
  async function retry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    setPending(true);
    setFeedback({ error: false, message: "" });
    try {
      const result = await submitAdminForm(
        action,
        undefined,
        "We couldn’t confirm the result. Check the email status before retrying.",
      );
      if (
        result.retried !== true ||
        typeof result.senderEmailStatus !== "string" ||
        typeof result.companyEmailStatus !== "string"
      )
        throw new Error(
          "The result is uncertain. Check the email status before retrying.",
        );
      const accepted =
        result.senderEmailStatus === "accepted" &&
        result.companyEmailStatus === "accepted";
      setFeedback({
        error: !accepted,
        message: accepted
          ? "Pending emails were accepted by the provider."
          : "Retry finished. Some emails still need attention.",
      });
      refresh(() => router.refresh());
    } catch (error) {
      setFeedback({
        error: true,
        message:
          error instanceof Error
            ? error.message
            : "We couldn’t complete the retry. Review the email status before trying again.",
      });
    } finally {
      inFlight.current = false;
      setPending(false);
    }
  }
  return (
    <>
      {needed ? (
        <form
          method="post"
          action={action}
          onSubmit={retry}
          aria-busy={pending || refreshing}
        >
          <p>
            Check the provider’s delivery history before retrying. A timeout can
            leave delivery uncertain.
          </p>
          <button
            className="button button-outline button-small"
            type="submit"
            disabled={pending || refreshing}
          >
            {pending ? "Retrying…" : "Retry pending emails"}
          </button>
        </form>
      ) : (
        <p className="field-hint">
          Provider acceptance is not a delivery receipt.
        </p>
      )}
      {feedback.message && (
        <p
          className={
            feedback.error ? "form-error form-alert" : "admin-save-notice"
          }
          role={feedback.error ? "alert" : "status"}
        >
          {feedback.message}
        </p>
      )}
      <span role="status" className="sr-only">
        {pending ? "Retrying pending emails…" : ""}
      </span>
    </>
  );
}
