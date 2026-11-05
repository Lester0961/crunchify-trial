import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/features/products/data";
export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) notFound();
  return <main className="shell page-section product-detail-page"><nav className="breadcrumbs" aria-label="Breadcrumb"><Link className="text-link" href="/products">Products</Link><span aria-hidden="true">/</span><span aria-current="page">{product.name}</span></nav><div className="detail-grid"><div className="detail-photo"><Image src={product.image} alt={`${product.name} package and snack`} width={1000} height={1000} priority /></div><div><p className="eyebrow">{product.category} snack</p><h1>{product.name}</h1><p className="page-intro">{product.description}</p><dl className="product-facts"><div><dt>Ingredients</dt><dd>{product.ingredients}</dd></div>{product.sizes && <div><dt>Available sizes</dt><dd>{product.sizes}</dd></div>}<div><dt>Product</dt><dd>{product.name}</dd></div></dl><Link className="button button-primary" href={`/inquire?product=${product.slug}`}>Request a quote</Link><Link className="text-link detail-range-link" href="/products">See the full range</Link></div></div><section className="range-callout"><div><h2>Good food, made simple.</h2><p>Explore the rest of the Crunchify range.</p><Link className="text-link" href="/products">View all products</Link></div><div className="crunch-accent" aria-hidden="true"><Image src="/brand/banana-crumbs.webp" alt="" width={190} height={190} /></div></section></main>;
}
