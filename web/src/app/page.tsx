import Image from "next/image";
import Link from "next/link";
import { ProductStory } from "@/components/product-story";
import { StockBenefits } from "@/components/stock-benefits";
import { WholesaleCallout } from "@/components/wholesale-callout";
import { DownIcon } from "@/components/icons";
export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="section-kicker">Fruit & vegetable snacks</p>
            <h1>
              Made right.
              <br />
              Tastes right.
            </h1>
            <p className="hero-intro">
              A little good food. A whole lot of crunch. Snacks made with simple
              ingredients, ready to share with your customers.
            </p>
            <Link className="button button-primary" href="/inquire">
              Become a Wholesale Partner
            </Link>
            <a className="hero-scroll" href="#range">
              <DownIcon />
              Discover the range
            </a>
          </div>
          <div className="hero-art">
            <div className="hero-texture" aria-hidden="true">
              <Image
                src="/brand/banana.webp"
                alt=""
                width={260}
                height={260}
                sizes="20vw"
              />
            </div>
            <div className="hero-photo">
              <Image
                src="/brand/banana-pack.webp"
                alt="Crunchify Banana Crunch package with a bowl of banana snacks"
                width={800}
                height={994}
                loading="eager"
                fetchPriority="high"
                sizes="(max-width: 700px) 90vw, 43vw"
              />
            </div>
            <span className="hero-photo-label">Banana Crunch</span>
          </div>
        </div>
      </section>
      <ProductStory />
      <StockBenefits />
      <WholesaleCallout />
    </main>
  );
}
