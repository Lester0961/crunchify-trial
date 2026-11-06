"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Attribution } from "./attribution";
import { BrandLogo } from "./brand-logo";
import { InboxIcon, OpenIcon } from "./icons";
import { SignoutForm } from "@/features/admin/signout-form";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") {
    return (
      <div className="staff-login-shell">
        <div className="staff-login-brand">
          <BrandLogo />
          <Link className="text-link" href="/">
            Back to website
          </Link>
        </div>
        <div id="main-content">{children}</div>
      </div>
    );
  }
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return (
      <div className="staff-shell">
        <aside className="staff-sidebar">
          <div>
            <div className="staff-brand-mark">
              <BrandLogo href="/admin" label="Admin inquiries" />
            </div>
            <p className="staff-caption">Partner workspace</p>
          </div>
          <nav aria-label="Staff navigation">
            <Link
              className="staff-active"
              href="/admin"
              aria-current={pathname === "/admin" ? "page" : undefined}
            >
              <InboxIcon />
              Inquiries
            </Link>
            <Link href="/">
              <OpenIcon />
              View website
            </Link>
          </nav>
          <SignoutForm />
        </aside>
        <div id="main-content" className="staff-content">
          {children}
        </div>
      </div>
    );
  }
  return (
    <>
      <Attribution />
      <SiteHeader key={pathname} />
      <div id="main-content">{children}</div>
      <SiteFooter />
    </>
  );
}
