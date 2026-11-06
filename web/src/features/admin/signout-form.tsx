"use client";

import { useState } from "react";

export function SignoutForm() {
  const [pending, setPending] = useState(false);
  return (
    <form
      className="staff-signout"
      action="/api/admin/logout"
      method="post"
      aria-busy={pending}
      onSubmit={() => setPending(true)}
    >
      <button type="submit" disabled={pending}>
        {pending ? "Signing out…" : "Sign out"}
      </button>
    </form>
  );
}
