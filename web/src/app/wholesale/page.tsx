import Link from "next/link";
import Image from "next/image";
import { StockBenefits } from "@/components/stock-benefits";
import { WholesaleCallout } from "@/components/wholesale-callout";
import { InquiryPreparation } from "@/components/inquiry-preparation";
export const metadata = {
  title: "Wholesale",
  description:
    "Bring Crunchify fruit and vegetable snacks to your customers. Start a wholesale conversation as a distributor, reseller or retailer.",
};
export default function Wholesale() {
  return (
    <main>
      <section className="shell page-section wholesale-hero">
        <div>
          <p className="section-kicker">For wholesale partners</p>
          <h1>
            Good things
            <br />
            belong together.
          </h1>
          <p className="page-intro">
            Bring Crunchify’s fruit and vegetable snacks to your customers. We
            welcome inquiries from distributors, resellers and retailers.
          </p>
          <Link className="button button-primary" href="/inquire">
            Become a Wholesale Partner
          </Link>
        </div>
        <div className="wholesale-photo">
          <Image
            src="/brand/banana-pack.webp"
            alt="Crunchify Banana Crunch package with banana snacks"
            width={900}
            height={1118}
            loading="eager"
            sizes="(max-width: 760px) 90vw, 45vw"
          />
        </div>
      </section>
      <StockBenefits />
      <section className="shell wholesale-preparation">
        <h2>
          A good conversation
          <br />
          starts here.
        </h2>
        <div>
          <InquiryPreparation />
          <Link className="text-link" href="/products">
            Explore all four products
          </Link>
        </div>
      </section>
      <WholesaleCallout />
    </main>
  );
}
