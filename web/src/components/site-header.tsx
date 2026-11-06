"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./brand-logo";
import { CloseIcon, MenuIcon } from "./icons";

const navigation = [
  { href: "/products", label: "Products" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/partners", label: "Brand & media" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const current = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  return (
    <header
      className="site-header"
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          setOpen(false);
          toggleRef.current?.focus();
        }
      }}
    >
      <div className="shell header-inner">
        <BrandLogo />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current(item.href) ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="button button-small header-action" href="/inquire">
          Become a Wholesale Partner
        </Link>
        <button
          className="menu-toggle"
          ref={toggleRef}
          type="button"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
          <span>{open ? "Close" : "Menu"}</span>
        </button>
      </div>
      <nav
        id="mobile-navigation"
        className="mobile-nav"
        aria-label="Mobile navigation"
        hidden={!open}
      >
        <div className="shell">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={current(item.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/inquire"
            className="button button-primary"
            onClick={() => setOpen(false)}
          >
            Become a Wholesale Partner
          </Link>
          <Link
            className="mobile-staff-link"
            href="/admin/login"
            onClick={() => setOpen(false)}
          >
            Admin login
          </Link>
        </div>
      </nav>
    </header>
  );
}
