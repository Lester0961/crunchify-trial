import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/features/products/data";
import { ProductGrid } from "@/components/product-grid";
import type { Metadata } from "next";
export function generateStaticParams() {
  return products.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  return product
    ? { title: product.name, description: product.description }
    : { title: "Product not found" };
}
export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();
  return (
    <main
      className={`shell page-section product-detail-page tone-${product.tone}`}
    >
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/products">All products</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{product.name}</span>
      </nav>
      <div className="detail-grid">
        <div className="detail-photo">
          <Image
            src={product.image}
            alt={`${product.name} package and snack`}
            width={1000}
            height={1242}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 760px) 90vw, 47vw"
          />
        </div>
        <div className="detail-copy">
          <p className="product-category">{product.category} snack</p>
          <h1>{product.name}</h1>
          <p className="page-intro">{product.description}</p>
          <dl className="product-facts">
            <div>
              <dt>Ingredients</dt>
              <dd>{product.ingredients}</dd>
            </div>
            {product.sizes && (
              <div>
                <dt>Available sizes</dt>
                <dd>{product.sizes}</dd>
              </div>
            )}
          </dl>
          <p className="detail-wholesale-note">
            Interested in stocking {product.name}? Tell us about your business.
          </p>
          <Link
            className="button button-primary"
            href={`/inquire?product=${product.slug}`}
          >
            Request a quote
          </Link>
        </div>
      </div>
      <section className="related-range">
        <div className="section-heading">
          <h2>A little more to explore.</h2>
          <Link className="text-link" href="/products">
            View the full range
          </Link>
        </div>
        <ProductGrid excludeSlug={product.slug} />
      </section>
    </main>
  );
}
