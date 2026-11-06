import Link from "next/link";
import { BrandLogo } from "./brand-logo";
import { MotionToggle } from "./motion-preferences";
export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="shell footer-main">
        <div className="footer-brand">
          <BrandLogo />
          <p>Made right. Tastes right.</p>
          <span>Fruit & vegetable snacks.</span>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <Link href="/products">Our products</Link>
          <Link href="/wholesale">Wholesale</Link>
          <Link href="/partners">Brand & media</Link>
        </div>
        <div className="footer-column">
          <h2>Let’s connect</h2>
          <Link href="/inquire">Send an inquiry</Link>
          <a href="https://crunchify.com.ph/">Crunchify website</a>
          <a href="https://instagram.com/crunchify.eats">Instagram</a>
          <a href="https://facebook.com/crunchify.eats">Facebook</a>
          <a href="https://tiktok.com/@crunchify.eats">TikTok</a>
        </div>
      </div>
      <div className="shell footer-bottom">
        <span>Crunchify</span>
        <div>
          <MotionToggle />
          <Link href="/privacy">Privacy</Link>
          <Link href="/admin/login">Admin login</Link>
        </div>
      </div>
    </footer>
  );
}
