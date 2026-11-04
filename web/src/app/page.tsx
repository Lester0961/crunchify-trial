import Image from "next/image";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
export default function Home() {
  return <main>
    <section className="hero shell"><div className="hero-copy"><p className="eyebrow">For wholesale partners</p><h1>Made right.<br />Tastes right.</h1><p className="hero-intro">Snacks made with simple ingredients, ready to share with your customers.</p><Link className="button button-primary" href="/inquire">Become a Wholesale Partner</Link><Link className="text-link hero-secondary" href="/products">Explore the products</Link></div><div className="hero-photo"><Image src="/brand/banana.webp" alt="Crunchify banana snacks" fill priority sizes="(max-width: 700px) 90vw, 50vw" /></div></section>
    <section className="shell section"><div className="section-heading"><div><p className="eyebrow">The Crunchify range</p><h2>Good food, made simple.</h2></div><Link className="text-link" href="/products">View all products</Link></div><ProductGrid /></section>
    <section className="why shell section"><div className="why-intro"><p className="eyebrow">Made for sharing</p><h2>Why stock Crunchify?</h2><p>Simple snacks with a satisfying crunch.</p></div><div className="why-list"><article><h3>Simple ingredients</h3><p>Snacks made with simple ingredients.</p></article><article><h3>No artificial sweeteners</h3><p>Flavor without artificial sweeteners.</p></article><article><h3>A range to enjoy</h3><p>Banana, jackfruit, apple and broccoli offer a variety of flavors.</p></article></div></section>
    <section className="partner shell"><div><p className="eyebrow">Let’s work together</p><h2>Start with a conversation.</h2><p>Tell us about your business and the Crunchify products you are interested in.</p><Link className="button button-primary" href="/inquire">Become a Wholesale Partner</Link></div></section>
  </main>;
}
