import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
export const metadata = { title: "Products" };
export default async function Products({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const category = (await searchParams).category;
  const selected = category === "Fruit" || category === "Vegetable" ? category : "All";
  return <main className="shell page-section"><p className="eyebrow">The Crunchify range</p><h1>Meet the crunch.</h1><p className="page-intro">Explore our fruit and vegetable snacks.</p><nav className="filters" aria-label="Product categories">{["All", "Fruit", "Vegetable"].map(item => <Link key={item} href={item === "All" ? "/products" : `/products?category=${item}`} aria-current={selected === item ? "page" : undefined}>{item}</Link>)}</nav><ProductGrid category={selected} headingLevel={2} /></main>;
}
