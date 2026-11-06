import Link from "next/link";

export function WholesaleCallout() {
  return (
    <section className="wholesale-callout shell">
      <div>
        <p className="section-kicker">For your shelves</p>
        <h2>Let’s share something good.</h2>
        <p>
          Tell us about your business and the Crunchify products you’d like to
          bring to your customers.
        </p>
      </div>
      <Link className="button button-sun" href="/inquire">
        Become a Wholesale Partner
      </Link>
    </section>
  );
}
