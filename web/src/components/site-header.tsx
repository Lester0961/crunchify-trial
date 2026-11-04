import Link from "next/link";
import Image from "next/image";
export function SiteHeader() {
  return <header className="site-header shell">
    <Link className="brand" href="/" aria-label="Crunchify home"><span className="brand-crop"><Image src="/brand/logo.webp" alt="" width={800} height={800} /></span></Link>
    <nav className="desktop-nav" aria-label="Main navigation"><Link href="/products">Products</Link><Link href="/wholesale">Wholesale</Link><Link href="/partners">Brand and media</Link></nav>
    <Link className="header-action" href="/inquire">Become a Wholesale Partner</Link>
    <details className="mobile-menu"><summary>Menu</summary><nav aria-label="Mobile navigation"><Link href="/products">Products</Link><Link href="/wholesale">Wholesale</Link><Link href="/partners">Brand and media</Link><Link href="/inquire">Become a Wholesale Partner</Link><Link href="/admin/login">Admin login</Link></nav></details>
  </header>;
}
