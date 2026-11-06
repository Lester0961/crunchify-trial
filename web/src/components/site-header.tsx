"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
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
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const current = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);
  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 961px)");
    const resize = () => {
      if (!desktop.matches) return;
      const active = document.activeElement;
      const inMenu =
        active instanceof Element &&
        (active.closest(".mobile-nav") || active === toggleRef.current);
      setOpen(false);
      if (inMenu)
        headerRef.current
          ?.querySelector<HTMLElement>(
            ".desktop-nav a[aria-current], .desktop-nav a",
          )
          ?.focus({ preventScroll: true });
    };
    window.addEventListener("keydown", escape);
    desktop.addEventListener("change", resize);
    return () => {
      window.removeEventListener("keydown", escape);
      desktop.removeEventListener("change", resize);
    };
  }, [open]);
  return (
    <header className="site-header" ref={headerRef}>
      <div className="shell header-inner flex items-center gap-8">
        <BrandLogo />
        <nav
          className="desktop-nav mx-auto flex gap-8"
          aria-label="Main navigation"
        >
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
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="mobile-nav-viewport">
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
        </div>
      </nav>
    </header>
  );
}
