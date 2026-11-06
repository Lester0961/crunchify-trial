"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { CheckIcon } from "@/components/icons";
import { InquiryFields } from "./inquiry-fields";
import { readAttribution } from "./read-attribution";
import { readSubmissionResult } from "./submission-result";

class SubmissionError extends Error {}
const requiredFields = [
  "company",
  "contact",
  "email",
  "phone",
  "businessType",
  "territory",
  "volume",
  "message",
];

export function InquiryForm({
  type,
  initialProduct = "",
}: {
  type: "wholesale" | "partner";
  initialProduct?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [productError, setProductError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [notificationPending, setNotificationPending] = useState(false);
  const [completed, setCompleted] = useState(initialProduct ? 1 : 0);
  const formRef = useRef<HTMLFormElement>(null);
  const outcomeRef = useRef<HTMLDivElement>(null);
  const alertRef = useRef<HTMLParagraphElement>(null);
  const submissionId = useRef("");
  const inFlight = useRef(false);

  useEffect(() => {
    if (state === "success") outcomeRef.current?.focus();
    if (state === "error") {
      const invalid = formRef.current?.querySelector<HTMLElement>(
        '[aria-invalid="true"]',
      );
      if (invalid) invalid.focus();
      else alertRef.current?.focus({ preventScroll: true });
    }
  }, [state]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    const form = new FormData(event.currentTarget);
    if (type === "wholesale" && !form.getAll("products").length) {
      setProductError("Choose at least one product.");
      formRef.current
        ?.querySelector<HTMLInputElement>('[name="products"]')
        ?.focus();
      return;
    }
    inFlight.current = true;
    submissionId.current ||= crypto.randomUUID();
    setState("sending");
    setProductError("");
    setFieldErrors({});
    const data = {
      type,
      company: form.get("company"),
      contact: form.get("contact"),
      email: form.get("email"),
      phone: form.get("phone") || "",
      businessType: form.get("businessType") || "",
      territory: form.get("territory") || "",
      volume: form.get("volume") || "",
      products: form.getAll("products"),
      message: form.get("message"),
      website: form.get("website") || "",
      ...readAttribution(),
      submissionId: submissionId.current,
    };
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        signal: AbortSignal.timeout(25000),
      });
      const result = readSubmissionResult(await response.json());
      if (!response.ok || !result.ok) {
        if (response.status === 409) submissionId.current = crypto.randomUUID();
        if (typeof result.fields?.products?.[0] === "string")
          setProductError(result.fields.products[0]);
        const messages: Record<string, string> = {};
        for (const name of requiredFields) {
          const message = result.fields?.[name]?.[0];
          if (typeof message === "string") messages[name] = message;
        }
        setFieldErrors(messages);
        throw new SubmissionError(
          typeof result.error === "string"
            ? result.error
            : response.ok
              ? "We couldn’t confirm your inquiry. Your details are still here. Please try again."
              : "We couldn’t complete your inquiry. Please try again.",
        );
      }
      setNotificationPending(Boolean(result.notificationPending));
      setState("success");
    } catch (cause) {
      setError(
        cause instanceof SubmissionError
          ? cause.message
          : "The connection was interrupted. Your details are still here. Try again to complete your inquiry.",
      );
      setState("error");
    } finally {
      inFlight.current = false;
    }
  }

  if (state === "success")
    return (
      <div
        className="form-success"
        role="status"
        ref={outcomeRef}
        tabIndex={-1}
      >
        <span className="success-mark">
          <CheckIcon />
        </span>
        <h2>
          Good things
          <br />
          start here.
        </h2>
        <p>Thank you for getting in touch. Your inquiry has been saved.</p>
        {notificationPending ? (
          <p>
            Some email notifications are still pending. For urgent follow-up,
            contact us through our{" "}
            <a
              className="text-link"
              href="https://instagram.com/crunchify.eats"
            >
              Instagram page
            </a>
            .
          </p>
        ) : (
          <p>We’ve sent a confirmation to the email address you provided.</p>
        )}
        <Link className="button button-primary" href="/products">
          Explore the range
        </Link>
      </div>
    );

  return (
    <form
      className="inquiry-form flex min-w-0 flex-col gap-6"
      method="post"
      action="/api/inquiries"
      ref={formRef}
      onSubmit={submit}
      aria-busy={state === "sending"}
      onChange={(event) => {
        const form = new FormData(event.currentTarget);
        setCompleted(
          requiredFields.filter((name) => String(form.get(name) || "").trim())
            .length + Number(form.getAll("products").length > 0),
        );
        if (form.getAll("products").length) setProductError("");
        const target = event.target;
        if (
          (target instanceof HTMLInputElement ||
            target instanceof HTMLSelectElement ||
            target instanceof HTMLTextAreaElement) &&
          fieldErrors[target.name]
        )
          setFieldErrors((current) => {
            const next = { ...current };
            delete next[target.name];
            return next;
          });
      }}
    >
      <noscript>
        <p className="form-error">
          Please enable JavaScript to send this inquiry, or contact us through
          our <a href="https://instagram.com/crunchify.eats">Instagram page</a>.
        </p>
        <style>{".inquiry-form .form-submit { display: none; }"}</style>
      </noscript>
      {type === "wholesale" ? (
        <div className="form-completion">
          <p>
            {completed} of 9 details filled in
            <span>All nine are required.</span>
          </p>
          <div className="completion-track" aria-hidden="true">
            <span style={{ width: `${(completed / 9) * 100}%` }} />
          </div>
        </div>
      ) : (
        <p className="field-hint">Required fields are marked below.</p>
      )}
      <fieldset className="form-fields" disabled={state === "sending"}>
        <legend className="sr-only">Inquiry details</legend>
        <InquiryFields
          type={type}
          initialProduct={initialProduct}
          errors={fieldErrors}
          productError={productError}
        />
      </fieldset>
      <p className="form-privacy">
        We’ll use your details to respond to your inquiry. Read our{" "}
        <Link href="/privacy">Privacy notice</Link>.
      </p>
      {state === "error" && (
        <p
          role="alert"
          ref={alertRef}
          tabIndex={-1}
          className="form-error form-alert"
        >
          {error}
        </p>
      )}
      <p className="sr-only" role="status" aria-live="polite">
        {state === "sending" ? "Sending your inquiry. Please wait." : ""}
      </p>
      <button
        className="button button-primary form-submit"
        type="submit"
        disabled={state === "sending"}
      >
        {state === "sending"
          ? "Sending…"
          : state === "error"
            ? "Try again"
            : "Send inquiry"}
      </button>
    </form>
  );
}
