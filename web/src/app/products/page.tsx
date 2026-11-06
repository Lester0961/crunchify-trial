import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { products } from "@/features/products/data";
import { WholesaleCallout } from "@/components/wholesale-callout";
export const metadata = {
  title: "Our products",
  description:
    "Meet Banana, Jackfruit, Apple and Broccoli Crunch. Explore the Crunchify fruit and vegetable snack range.",
};
export default async function Products({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const category = (await searchParams).category;
  const selected =
    category === "Fruit" || category === "Vegetable" ? category : "All";
  return (
    <main>
      <div className="shell page-section collection-page">
        <div className="page-heading">
          <h1>Meet the crunch.</h1>
          <p>
            Fruit, vegetables and a satisfying crunch.
            <br />
            Find a little something good for your shelves.
          </p>
        </div>
        <nav className="filters" aria-label="Product categories">
          {["All", "Fruit", "Vegetable"].map((item) => (
            <Link
              key={item}
              href={item === "All" ? "/products" : `/products?category=${item}`}
              aria-current={selected === item ? "page" : undefined}
            >
              {item}
              <span>
                {item === "All"
                  ? products.length
                  : products.filter((product) => product.category === item)
                      .length}
              </span>
            </Link>
          ))}
        </nav>
        <ProductGrid category={selected} headingLevel={2} />
      </div>
      <WholesaleCallout />
    </main>
  );
}
