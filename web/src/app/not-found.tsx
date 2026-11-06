import Link from "next/link";
import Image from "next/image";
export default function NotFound() {
  return (
    <main className="shell page-section not-found-page">
      <Image
        className="not-found-photo"
        src="/brand/banana-crumbs.webp"
        alt="Banana Crunch pieces"
        width={160}
        height={160}
      />
      <p className="section-kicker">Page not found</p>
      <h1>A little off the path.</h1>
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
