import Image from "next/image";
import Link from "next/link";
import { products } from "@/features/products/data";
import { OpenIcon } from "./icons";

export function ProductGrid({
  category,
  headingLevel = 3,
  excludeSlug,
}: {
  category?: string;
  headingLevel?: 2 | 3;
  excludeSlug?: string;
}) {
  const visible = products.filter(
    (p) =>
      (!category || category === "All" || p.category === category) &&
      p.slug !== excludeSlug,
  );
  return (
    <div
      className={`product-grid${excludeSlug ? " product-grid-related" : ""}`}
    >
      {visible.map((p) => (
        <article
          className={`product-card tone-${p.tone}`}
          key={p.slug}
          data-product={p.slug}
        >
          <Link href={`/products/${p.slug}`} className="product-photo">
            <Image
              src={p.image}
              alt={`${p.name} package and snack`}
              width={800}
              height={994}
              sizes={
                excludeSlug
                  ? "(max-width: 600px) 90vw, 30vw"
                  : "(max-width: 600px) 90vw, (max-width: 1440px) 46vw, 630px"
              }
            />
            <span className="product-photo-action">
              <OpenIcon />
            </span>
          </Link>
          <div className="product-card-copy">
            <div>
              <p className="product-category">{p.category} snack</p>
              {headingLevel === 2 ? (
                <h2>
                  <Link href={`/products/${p.slug}`}>{p.name}</Link>
                </h2>
              ) : (
                <h3>
                  <Link href={`/products/${p.slug}`}>{p.name}</Link>
                </h3>
              )}
            </div>
            <Link
              className="product-link"
              aria-label={`View product: ${p.name}`}
              href={`/products/${p.slug}`}
            >
              View product
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
