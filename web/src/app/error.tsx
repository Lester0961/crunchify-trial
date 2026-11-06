"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const staff = usePathname().startsWith("/admin");
  return (
    <main className="shell page-section route-error-page">
      <p className="section-kicker">Something went wrong</p>
      <h1>Let’s try that again.</h1>
      <p className="page-intro">
        We couldn’t load this page right now. Please try again.
      </p>
      <div className="action-row">
        <button className="button button-primary" type="button" onClick={retry}>
          Try again
        </button>
        <Link
          className="button button-outline"
          href={staff ? "/admin" : "/products"}
        >
          {staff ? "Back to inquiries" : "Explore products"}
        </Link>
      </div>
    </main>
  );
}
