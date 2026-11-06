"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useTransition,
} from "react";
import { products } from "@/features/products/data";
import { ProductGrid } from "./product-grid";
import { useReducedMotion } from "./motion-preferences";

type Category = "All" | "Fruit" | "Vegetable";
type Position = { left: number; top: number };
const categories: Category[] = ["All", "Fruit", "Vegetable"];

export function ProductCollection({ category }: { category: Category }) {
  const router = useRouter();
  const reduced = useReducedMotion();
  const [pending, startTransition] = useTransition();
  const root = useRef<HTMLDivElement>(null);
  const positions = useRef(new Map<string, Position>());
  const previousCategory = useRef(category);
  const animations = useRef<Animation[]>([]);

  const capturePositions = useCallback(() => {
    positions.current = new Map(
      Array.from(
        root.current?.querySelectorAll<HTMLElement>("[data-product]") || [],
      ).map((card) => {
        const rect = card.getBoundingClientRect();
        return [
          card.dataset.product!,
          { left: rect.left + scrollX, top: rect.top + scrollY },
        ];
      }),
    );
  }, []);

  useLayoutEffect(() => {
    const element = root.current;
    if (!element) return;
    const changed = previousCategory.current !== category;
    previousCategory.current = category;
    animations.current.forEach((animation) => animation.cancel());
    animations.current = [];
    if (changed && !reduced) {
      element
        .querySelectorAll<HTMLElement>("[data-product]")
        .forEach((card) => {
          const before = positions.current.get(card.dataset.product!);
          const rect = card.getBoundingClientRect();
          const from = before
            ? {
                transform: `translate(${before.left - rect.left - scrollX}px, ${before.top - rect.top - scrollY}px)`,
              }
            : { opacity: 0, transform: "translateY(8px)" };
          animations.current.push(
            card.animate([from, { opacity: 1, transform: "translate(0, 0)" }], {
              duration: 300,
              easing: "cubic-bezier(.2,.8,.2,1)",
            }),
          );
        });
    }
    capturePositions();
  }, [category, reduced, capturePositions]);

  useEffect(() => {
    const element = root.current;
    const nav = element?.querySelector<HTMLElement>(".filters");
    const marker = nav?.querySelector<HTMLElement>(".filter-indicator");
    if (!nav || !marker) return;
    const align = () => {
      const selected = nav.querySelector<HTMLElement>("[aria-current]");
      if (!selected) return;
      marker.style.width = `${selected.offsetWidth}px`;
      marker.style.transform = `translateX(${selected.offsetLeft - 5}px)`;
      nav.dataset.ready = "true";
    };
    const observer = new ResizeObserver(align);
    observer.observe(nav);
    nav.querySelectorAll("a").forEach((link) => observer.observe(link));
    align();
    window.addEventListener("popstate", capturePositions);
    return () => {
      observer.disconnect();
      window.removeEventListener("popstate", capturePositions);
    };
  }, [category, capturePositions]);

  useEffect(
    () => () => animations.current.forEach((animation) => animation.cancel()),
    [],
  );

  const count = products.filter(
    (product) => category === "All" || product.category === category,
  ).length;
  return (
    <div ref={root} className="product-collection" aria-busy={pending}>
      <nav className="filters" aria-label="Product categories">
        <span className="filter-indicator" aria-hidden="true" />
        {categories.map((item) => {
          const href =
            item === "All" ? "/products" : `/products?category=${item}`;
          return (
            <Link
              key={item}
              href={href}
              scroll={false}
              aria-current={category === item ? "page" : undefined}
              onClick={(event) => {
                if (
                  event.button !== 0 ||
                  event.metaKey ||
                  event.ctrlKey ||
                  event.shiftKey ||
                  event.altKey
                )
                  return;
                event.preventDefault();
                capturePositions();
                startTransition(() => router.push(href, { scroll: false }));
              }}
            >
              {item}
              <span>
                {
                  products.filter(
                    (product) => item === "All" || product.category === item,
                  ).length
                }
              </span>
            </Link>
          );
        })}
      </nav>
      <p className="sr-only" role="status">
        {pending
          ? "Updating products…"
          : `${count} ${category === "All" ? "products" : category.toLowerCase() + " products"}`}
      </p>
      <ProductGrid category={category} headingLevel={2} />
    </div>
  );
}
