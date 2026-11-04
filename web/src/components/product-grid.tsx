import Image from "next/image";
import Link from "next/link";
import { products } from "@/features/products/data";
export function ProductGrid({ category }: { category?: string }) {
  return <div className="product-grid">{products.filter(p => !category || category === "All" || p.category === category).map(p => <article className="product-card" key={p.slug}>
    <Link href={`/products/${p.slug}`} className="product-photo"><Image src={p.image} alt={p.name} width={800} height={800} /></Link>
    <h3>{p.name}</h3><p>{p.category} snack</p><Link className="product-link" href={`/products/${p.slug}`}>View product</Link>
  </article>)}</div>;
}
