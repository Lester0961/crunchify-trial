import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/features/products/data";
export function generateStaticParams() { return products.map(({ slug }) => ({ slug })); }
export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find(p => p.slug === slug);
  if (!product) notFound();
  return <main className="shell page-section"><Link className="text-link" href="/products">All products</Link><div className="detail-grid"><div className="detail-photo"><Image src={product.image} alt={product.name} width={1000} height={1000} /></div><div><p className="eyebrow">{product.category} snack</p><h1>{product.name}</h1><p className="page-intro">{product.description}</p><dl className="product-facts"><div><dt>Ingredients</dt><dd>{product.ingredients}</dd></div>{product.sizes && <div><dt>Available sizes</dt><dd>{product.sizes}</dd></div>}</dl><Link className="button button-primary" href={`/inquire?product=${product.slug}`}>Request wholesale information</Link></div></div></main>;
}
