import Link from "next/link";
import Image from "next/image";
export function SiteFooter() {
  return <footer className="footer"><div className="shell footer-main">
    <div className="footer-brand"><Link className="brand" href="/" aria-label="Crunchify home"><span className="brand-crop"><Image src="/brand/logo.webp" alt="" width={800} height={800} /></span></Link><p>Made right. Tastes right.</p></div>
    <div className="footer-column"><h2>Explore</h2><Link href="/products">Products</Link><Link href="/wholesale">Wholesale</Link><Link href="/partners">Brand and media</Link></div>
    <div className="footer-column"><h2>Get in touch</h2><Link href="/inquire">Send an inquiry</Link><a href="https://crunchify.com.ph/">Crunchify website</a><a href="https://instagram.com/crunchify.eats">Instagram</a><a href="https://facebook.com/crunchify.eats">Facebook</a><a href="https://tiktok.com/@crunchify.eats">TikTok</a></div>
  </div><div className="shell footer-bottom"><span>Crunchify</span><div><Link href="/privacy">Privacy</Link><Link href="/admin/login">Admin login</Link></div></div></footer>;
}
