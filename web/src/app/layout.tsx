import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import "./globals.css";
export const metadata: Metadata = {
  title: { default: "Crunchify | Wholesale", template: "%s | Crunchify" },
  description:
    "Explore Crunchify snacks and inquire about wholesale partnership.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
