import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Attribution } from "@/components/attribution";
import "./globals.css";
export const metadata: Metadata = { title: { default: "Crunchify | Wholesale", template: "%s | Crunchify" }, description: "Explore Crunchify snacks and inquire about wholesale partnership.", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a href="#main-content" className="skip-link">Skip to content</a><Attribution /><SiteHeader /><div id="main-content">{children}</div><SiteFooter /></body></html>;
}
