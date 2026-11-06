import { ProductCollection } from "@/components/product-collection";
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
        <ProductCollection category={selected} />
      </div>
      <WholesaleCallout />
    </main>
  );
}
