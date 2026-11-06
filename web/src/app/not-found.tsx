import Link from "next/link";
export default function NotFound() {
  return (
    <main className="shell page-section not-found-page">
      <span className="error-number" aria-hidden="true">
        404
      </span>
      <h1>
        This crumb
        <br />
        went missing.
      </h1>
      <p className="page-intro">
        We couldn’t find that page. There’s still plenty of good crunch to
        explore.
      </p>
      <div className="action-row">
        <Link className="button button-primary" href="/">
          Back to home
        </Link>
        <Link className="button button-outline" href="/products">
          Explore products
        </Link>
      </div>
    </main>
  );
}
