import Image from "next/image";
import Link from "next/link";
import { products } from "@/features/products/data";
export function ProductGrid({ category, headingLevel = 3 }: { category?: string; headingLevel?: 2 | 3 }) {
  return <div className="product-grid">{products.filter(p => !category || category === "All" || p.category === category).map(p => <article className="product-card" key={p.slug}>
    <Link href={`/products/${p.slug}`} className="product-photo"><Image src={p.image} alt={p.name} width={800} height={800} sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 700px) 560px, (max-width: 1368px) calc((100vw - 126px) / 4), 311px" /></Link>
    {headingLevel === 2 ? <h2>{p.name}</h2> : <h3>{p.name}</h3>}<p>{p.category} snack</p><Link className="product-link" href={`/products/${p.slug}`}>View product</Link>
  </article>)}</div>;
}
