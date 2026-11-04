"use client";
import { useEffect, useRef, useState } from "react";
import { products } from "@/features/products/data";

export function InquiryForm({ type, initialProduct = "" }: { type: "wholesale" | "partner"; initialProduct?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [notificationPending, setNotificationPending] = useState(false);
  const id = useRef("");
  useEffect(() => { id.current = crypto.randomUUID(); }, []);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    const form = new FormData(event.currentTarget);
    let attribution = { source: window.location.pathname, utm: {} };
    try { attribution = JSON.parse(sessionStorage.getItem("crunchify_attribution") || "null") || attribution; } catch { /* Optional attribution. */ }
    const data = { type, company: form.get("company"), contact: form.get("contact"), email: form.get("email"), phone: form.get("phone") || "", businessType: form.get("businessType") || "", territory: form.get("territory") || "", volume: form.get("volume") || "", products: form.getAll("products"), message: form.get("message"), website: form.get("website") || "", ...attribution, submissionId: id.current };
    try {
      const response = await fetch("/api/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 409) id.current = crypto.randomUUID();
        throw new Error(result.error || "Please try again.");
      }
      setNotificationPending(Boolean(result.notificationPending));
      setState("success");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Please try again."); setState("error"); }
  }
  if (state === "success") return <div className="success" role="status"><h2>Thank you for getting in touch.</h2><p>Your inquiry has been saved.</p>{notificationPending && <p>We couldn’t send an email confirmation right now. For urgent follow-up, please contact us through our <a className="text-link" href="https://instagram.com/crunchify.eats">Instagram page</a>.</p>}</div>;
  return <form className="inquiry-form" onSubmit={submit}>
    <div className="form-grid">
      <label>Company name<input name="company" required maxLength={150} autoComplete="organization" /></label>
      <label>Contact person<input name="contact" required maxLength={120} autoComplete="name" /></label>
      <label>Email address<input name="email" type="email" required maxLength={254} autoComplete="email" /></label>
      {type === "wholesale" ? <>
        <label>Phone or WhatsApp<input name="phone" type="tel" required maxLength={50} autoComplete="tel" /></label>
        <label>Business type<select name="businessType" required defaultValue=""><option value="" disabled>Select business type</option><option>Distributor</option><option>Reseller</option><option>Retailer</option><option>Other</option></select></label>
        <label>Territory or location<input name="territory" required maxLength={150} /></label>
        <label>Estimated monthly volume<input name="volume" required maxLength={100} placeholder="For example, 100 packs" /></label>
      </> : <label>Collaboration type<input name="businessType" maxLength={80} placeholder="For example, media or brand partnership" /></label>}
    </div>
    {type === "wholesale" && <fieldset><legend>Products of interest</legend><div className="checkboxes">{products.map(p => <label key={p.slug}><input type="checkbox" name="products" value={p.slug} defaultChecked={p.slug === initialProduct} />{p.name}</label>)}</div></fieldset>}
    <label>Message<textarea name="message" required maxLength={5000} rows={6} /></label>
    <div className="honey" aria-hidden="true"><label>Leave this field empty<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    {state === "error" && <p role="alert" className="form-error">{error}</p>}
    <button className="button button-primary" type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send inquiry"}</button>
  </form>;
}
