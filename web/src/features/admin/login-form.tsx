"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { submitAdminForm } from "./form-request";

export function LoginForm({
  initialError = false,
}: {
  initialError?: boolean;
}) {
  const router = useRouter();
  const id = useId();
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(
    initialError ? "Unable to sign in. Check your details and try again." : "",
  );
  const inFlight = useRef(false);
  const alert = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (error) alert.current?.focus({ preventScroll: true });
  }, [error]);

  async function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    inFlight.current = true;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const result = await submitAdminForm(
        "/api/admin/login",
        new URLSearchParams({
          username: String(form.get("username") || ""),
          password: String(form.get("password") || ""),
        }),
        "The connection was interrupted. Please try signing in again.",
      );
      if (result.signedIn !== true)
        throw new Error("We couldn’t confirm your sign-in. Please try again.");
      router.replace("/admin");
      router.refresh();
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to sign in. Please try again.",
      );
      setPending(false);
      inFlight.current = false;
    }
  }
  return (
    <form
      className="inquiry-form login-form flex min-w-0 flex-col gap-6"
      action="/api/admin/login"
      method="post"
      onSubmit={signIn}
      aria-busy={pending}
    >
      <fieldset className="form-fields" disabled={pending}>
        <legend className="sr-only">Staff sign-in</legend>
        <label>
          Username
          <input name="username" required autoComplete="username" />
        </label>
        <label>
          Password
          <span className="password-input">
            <input
              id={id}
              type={visible ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
            />
            <button
              type="button"
              className="password-toggle"
              aria-controls={id}
              aria-label={visible ? "Hide password" : "Show password"}
              aria-pressed={visible}
              onClick={() => setVisible(!visible)}
            >
              {visible ? "Hide" : "Show"}
            </button>
          </span>
        </label>
      </fieldset>
      {error && (
        <p
          className="form-error form-alert"
          role="alert"
          ref={alert}
          tabIndex={-1}
        >
          {error}
        </p>
      )}
      <span className="sr-only" role="status">
        {pending ? "Signing in…" : ""}
      </span>
      <button
        className="button button-primary"
        type="submit"
        disabled={pending}
      >
        {pending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
