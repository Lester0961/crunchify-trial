import { InquiryForm } from "@/features/inquiries/inquiry-form";
import { products } from "@/features/products/data";
import Image from "next/image";
import Link from "next/link";
export const metadata = {
  title: "Wholesale inquiry",
  description:
    "Tell us about your business and which Crunchify snacks interest you. Start a wholesale inquiry.",
};
export default async function Inquire({
  searchParams,
}: {
  searchParams: Promise<{ product?: string }>;
}) {
  const { product } = await searchParams;
  const selected = products.find((item) => item.slug === product);
  return (
    <main className="shell page-section form-page">
      <div className="form-intro">
        <p className="section-kicker">Wholesale inquiry</p>
        <h1>
          Let’s grow
          <br />
          something good.
        </h1>
        <p className="page-intro">
          Tell us about your business and the products you’d like to share with
          your customers.
        </p>
        {selected ? (
          <div className="selected-product">
            <Image
              src={selected.image}
              alt={selected.name}
              width={120}
              height={149}
            />
            <div>
              <span>You’re inquiring about</span>
              <p>{selected.name}</p>
              <Link className="text-link" href={`/products/${selected.slug}`}>
                Product details
              </Link>
            </div>
          </div>
        ) : (
          <div className="inquiry-intro-photo">
            <Image
              src="/brand/banana-crumbs.webp"
              alt="Banana Crunch pieces"
              width={500}
              height={500}
              sizes="(max-width: 900px) 40vw, 28vw"
            />
          </div>
        )}
      </div>
      <div className="form-surface">
        <InquiryForm type="wholesale" initialProduct={selected?.slug} />
      </div>
    </main>
  );
}
