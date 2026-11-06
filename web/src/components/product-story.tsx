"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { products } from "@/features/products/data";
import { useMediaQuery, useReducedMotion } from "./motion-preferences";

const motionQuery = "(min-width: 960px) and (min-height: 640px)";

export function ProductStory() {
  const rootRef = useRef<HTMLElement>(null);
  const wideEnough = useMediaQuery(motionQuery);
  const reduced = useReducedMotion();
  const enhanced = wideEnough && !reduced;

  useEffect(() => {
    const root = rootRef.current;
    if (!enhanced || !root) return;
    const chapters = Array.from(
      root.querySelectorAll<HTMLElement>(".story-chapter"),
    );
    const cards = Array.from(
      root.querySelectorAll<HTMLElement>(".story-depth-card"),
    );
    const links = Array.from(
      root.querySelectorAll<HTMLAnchorElement>(".story-index a"),
    );
    let frame = 0;
    let needsMeasure = true;
    let lastTime = 0;
    let targets = cards.map(() => 0);
    const offsets = cards.map(() => 0);
    const update = (time: number) => {
      frame = 0;
      if (document.hidden) return;
      if (needsMeasure) {
        needsMeasure = false;
        const bounds = root.getBoundingClientRect();
        if (bounds.bottom < 0 || bounds.top > window.innerHeight) {
          lastTime = 0;
          return;
        }
        const middle = window.innerHeight * 0.53;
        const positions = chapters.map((chapter) => {
          const rect = chapter.getBoundingClientRect();
          return (rect.top + rect.height / 2 - middle) / window.innerHeight;
        });
        const active = positions.reduce(
          (best, value, index) =>
            Math.abs(value) < Math.abs(positions[best]) ? index : best,
          0,
        );
        targets = positions.map((position) =>
          Math.max(-1, Math.min(1, position)),
        );
        root.dataset.active = String(active);
        cards.forEach((card, index) => {
          card.style.opacity = index === active ? "1" : "0";
        });
        links.forEach((link, index) => {
          if (index === active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      }
      const blend = lastTime
        ? 1 - Math.exp(-Math.min(time - lastTime, 32) / 65)
        : 1;
      lastTime = time;
      let moving = false;
      cards.forEach((card, index) => {
        offsets[index] += (targets[index] - offsets[index]) * blend;
        moving ||= Math.abs(targets[index] - offsets[index]) > 0.002;
        const offset = offsets[index];
        card.style.transform = `translate3d(0,${offset * 28}px,0) rotateX(${offset * -4}deg) rotateY(${offset * 6}deg) rotateZ(${index % 2 ? 3 : -3}deg)`;
      });
      if (moving) frame = requestAnimationFrame(update);
    };
    const schedule = () => {
      needsMeasure = true;
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [enhanced]);

  return (
    <section
      id="range"
      ref={rootRef}
      className="product-story shell"
      data-enhanced={enhanced}
      data-active="0"
      aria-labelledby="range-heading"
    >
      <div className="section-heading">
        <div>
          <p className="section-kicker">The Crunchify range</p>
          <h2 id="range-heading">
            Find your kind
            <br />
            of crunch.
          </h2>
        </div>
        <p>
          Four fruit and vegetable snacks.
          <br />
          Simple ingredients. Plenty of character.
        </p>
      </div>
      <div className="story-layout">
        {enhanced && (
          <div className="story-stage">
            <div className="story-depth" aria-hidden="true">
              {products.map((product, index) => (
                <div
                  className={`story-depth-card tone-${product.tone}`}
                  key={product.slug}
                  style={{ opacity: index === 0 ? 1 : 0 }}
                >
                  <div className="story-card-photo">
                    <Image
                      src={product.image}
                      alt=""
                      width={800}
                      height={994}
                      sizes="45vw"
                    />
                  </div>
                  <div className="story-card-caption">
                    <span>{product.name}</span>
                    <span>{product.category} snack</span>
                  </div>
                </div>
              ))}
            </div>
            <nav className="story-index" aria-label="Jump to a product">
              {products.map((product) => (
                <a
                  key={product.slug}
                  href={`#story-${product.slug}`}
                  aria-label={`Jump to ${product.name}`}
                >
                  {product.name.replace(" Crunch", "")}
                </a>
              ))}
            </nav>
          </div>
        )}
        <div className="story-chapters">
          {products.map((product) => (
            <article
              id={`story-${product.slug}`}
              className={`story-chapter tone-${product.tone}`}
              key={product.slug}
            >
              <div className="story-static-photo">
                <Image
                  src={product.image}
                  alt={`${product.name} package and snack`}
                  width={800}
                  height={994}
                  sizes="(max-width: 600px) 90vw, 45vw"
                />
              </div>
              <div className="story-chapter-copy">
                <p className="product-category">{product.category} snack</p>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <dl className="story-facts">
                  <div>
                    <dt>Made with</dt>
                    <dd>{product.ingredients}</dd>
                  </div>
                  {product.sizes && (
                    <div>
                      <dt>Available sizes</dt>
                      <dd>{product.sizes}</dd>
                    </div>
                  )}
                </dl>
                <Link
                  className="button button-outline"
                  href={`/products/${product.slug}`}
                >
                  Explore {product.name.replace(" Crunch", "")}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
