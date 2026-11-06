"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { products } from "@/features/products/data";
import { CheckIcon } from "@/components/icons";

class SubmissionError extends Error {}
type Attribution = { source: string; utm: Record<string, string> };
function readAttribution(): Attribution {
  const fallback: Attribution = { source: window.location.pathname, utm: {} };
  try {
    const stored = JSON.parse(
      sessionStorage.getItem("crunchify_attribution") || "null",
    );
    if (!stored || typeof stored !== "object") return fallback;
    const source =
      typeof stored.source === "string"
        ? stored.source.slice(0, 500)
        : fallback.source;
    const utm: Record<string, string> = {};
    for (const key of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ]) {
      if (typeof stored.utm?.[key] === "string")
        utm[key] = stored.utm[key].slice(0, 200);
    }
    return { source, utm };
  } catch {
    return fallback;
  }
}

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
  const submissionId = useRef("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    const form = new FormData(event.currentTarget);
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
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) submissionId.current = crypto.randomUUID();
        if (typeof result.fields?.products?.[0] === "string")
          setProductError(result.fields.products[0]);
        const messages: Record<string, string> = {};
        for (const name of [
          "company",
          "contact",
          "email",
          "phone",
          "businessType",
          "territory",
          "volume",
          "message",
        ]) {
          const message = result.fields?.[name]?.[0];
          if (typeof message === "string") messages[name] = message;
        }
        setFieldErrors(messages);
        throw new SubmissionError(
          typeof result.error === "string"
            ? result.error
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
    }
  }

  const fieldProps = (name: string) => ({
    "aria-invalid": fieldErrors[name] ? true : undefined,
    "aria-describedby": fieldErrors[name] ? `${name}-error` : undefined,
  });
  const fieldError = (name: string) =>
    fieldErrors[name] ? (
      <span id={`${name}-error`} className="form-error">
        {fieldErrors[name]}
      </span>
    ) : null;

  if (state === "success")
    return (
      <div className="form-success" role="status">
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
      className="inquiry-form"
      method="post"
      action="/api/inquiries"
      onSubmit={submit}
      aria-busy={state === "sending"}
    >
      <noscript>
        <p className="form-error">
          Please enable JavaScript to send this inquiry, or contact us through
          our <a href="https://instagram.com/crunchify.eats">Instagram page</a>.
        </p>
        <style>{".inquiry-form .form-submit { display: none; }"}</style>
      </noscript>
      <fieldset className="form-fields" disabled={state === "sending"}>
        <legend className="sr-only">Inquiry details</legend>
        <div className="form-section-heading">
          <h2>
            {type === "partner"
              ? "Tell us about yourself."
              : "Tell us about your business."}
          </h2>
          <p>
            {type === "partner"
              ? "Required fields are marked below."
              : "All fields are required."}
          </p>
        </div>
        <div className="form-grid">
          <label>
            {type === "partner" ? "Organization (required)" : "Company name"}
            <input
              name="company"
              required
              maxLength={150}
              autoComplete="organization"
              {...fieldProps("company")}
            />
            {fieldError("company")}
          </label>
          <label>
            Contact person{type === "partner" && " (required)"}
            <input
              name="contact"
              required
              maxLength={120}
              autoComplete="name"
              {...fieldProps("contact")}
            />
            {fieldError("contact")}
          </label>
          <label>
            Email address{type === "partner" && " (required)"}
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              {...fieldProps("email")}
            />
            {fieldError("email")}
          </label>
          {type === "wholesale" ? (
            <>
              <label>
                Phone or WhatsApp
                <input
                  name="phone"
                  type="tel"
                  required
                  maxLength={50}
                  autoComplete="tel"
                  {...fieldProps("phone")}
                />
                {fieldError("phone")}
              </label>
              <label>
                Business type
                <select
                  name="businessType"
                  required
                  defaultValue=""
                  {...fieldProps("businessType")}
                >
                  <option value="" disabled>
                    Select business type
                  </option>
                  <option>Distributor</option>
                  <option>Reseller</option>
                  <option>Retailer</option>
                  <option>Other</option>
                </select>
                {fieldError("businessType")}
              </label>
              <label>
                Territory or location
                <input
                  name="territory"
                  required
                  maxLength={150}
                  {...fieldProps("territory")}
                />
                {fieldError("territory")}
              </label>
              <label className="field-full">
                Estimated monthly volume
                <input
                  name="volume"
                  required
                  maxLength={100}
                  placeholder="For example, 100 packs"
                  {...fieldProps("volume")}
                />
                {fieldError("volume")}
              </label>
            </>
          ) : (
            <label>
              Collaboration type (optional)
              <input
                name="businessType"
                maxLength={80}
                placeholder="For example, media or brand"
                {...fieldProps("businessType")}
              />
              {fieldError("businessType")}
            </label>
          )}
        </div>
        {type === "wholesale" && (
          <fieldset
            className="product-choices"
            aria-describedby={`products-hint${productError ? " products-error" : ""}`}
          >
            <legend>Products of interest</legend>
            <p id="products-hint" className="field-hint">
              Choose at least one.
            </p>
            <div className="checkboxes">
              {products.map((product) => (
                <label key={product.slug}>
                  <input
                    type="checkbox"
                    name="products"
                    value={product.slug}
                    defaultChecked={product.slug === initialProduct}
                    aria-invalid={productError ? true : undefined}
                  />
                  {product.name}
                </label>
              ))}
            </div>
            {productError && (
              <p id="products-error" className="form-error">
                {productError}
              </p>
            )}
          </fieldset>
        )}
        <label>
          Message{type === "partner" && " (required)"}
          <textarea
            name="message"
            required
            maxLength={5000}
            rows={5}
            placeholder={
              type === "partner"
                ? "Tell us about the collaboration you have in mind."
                : "Anything else you’d like us to know?"
            }
            {...fieldProps("message")}
          />
          {fieldError("message")}
        </label>
        <div className="honey" aria-hidden="true">
          <label>
            Leave this field empty
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </fieldset>
      <p className="form-privacy">
        We’ll use your details to respond to your inquiry. Read our{" "}
        <Link href="/privacy">Privacy notice</Link>.
      </p>
      {state === "error" && (
        <p role="alert" className="form-error form-alert">
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
