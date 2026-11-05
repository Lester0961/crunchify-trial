"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Attribution } from "./attribution";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const login = pathname === "/admin/login";
    return <div className="staff-shell"><aside className="staff-sidebar"><Link className="brand" href={login ? "/" : "/admin"} aria-label={login ? "Crunchify home" : "Admin inquiries"}><span className="brand-crop"><Image src="/brand/logo.webp" alt="" width={800} height={800} /></span></Link>{!login && <><nav aria-label="Staff navigation"><span>Workspace</span><Link href="/admin" aria-current="page">Inquiries</Link><Link href="/">View website</Link></nav><form className="staff-signout" action="/api/admin/logout" method="post"><button className="text-link">Sign out</button></form></>}</aside><div id="main-content" className="staff-content">{children}</div></div>;
  }
  return <><Attribution /><SiteHeader /><div id="main-content">{children}</div><SiteFooter /></>;
}
