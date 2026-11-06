"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import type { Product } from "@/features/products/data";
import { useMediaQuery, useReducedMotion } from "./motion-preferences";

type View = "pack" | "texture";

export function ProductGallery({ product }: { product: Product }) {
  const id = useId();
  const reduced = useReducedMotion();
  const finePointer = useMediaQuery("(hover: hover) and (pointer: fine)");
  const [requested, setRequested] = useState<View>("pack");
  const [warm, setWarm] = useState(false);
  const [textureReady, setTextureReady] = useState(false);
  const [textureError, setTextureError] = useState(false);
  const [packError, setPackError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const depth = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const start = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef(0);
  const active: View =
    requested === "texture" && textureReady ? "texture" : "pack";
  const loading = requested === "texture" && !textureReady && !textureError;

  function resetDepth() {
    cancelAnimationFrame(frame.current);
    frame.current = 0;
    depth.current?.style.removeProperty("--gallery-x");
    depth.current?.style.removeProperty("--gallery-y");
  }

  useEffect(() => {
    const element = depth.current;
    if (reduced || !finePointer) {
      element?.style.removeProperty("--gallery-x");
      element?.style.removeProperty("--gallery-y");
    }
    return () => cancelAnimationFrame(frame.current);
  }, [reduced, finePointer]);

  function choose(view: View) {
    setWarm(true);
    setRequested(view);
  }

  function move(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || reduced || !finePointer) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 3;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -3;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      depth.current?.style.setProperty("--gallery-x", `${y}deg`);
      depth.current?.style.setProperty("--gallery-y", `${x}deg`);
    });
  }

  return (
    <div className="product-gallery">
      <div
        id={id}
        className="gallery-stage"
        data-active={active}
        aria-busy={loading}
        onPointerEnter={() => setWarm(true)}
        onPointerMove={move}
        onPointerLeave={resetDepth}
        onPointerDown={(event) => {
          if (event.pointerType !== "mouse") {
            if (!event.isPrimary) {
              start.current = null;
              return;
            }
            start.current = { x: event.clientX, y: event.clientY };
            event.currentTarget.setPointerCapture(event.pointerId);
          }
        }}
        onPointerCancel={() => {
          start.current = null;
        }}
        onPointerUp={(event) => {
          const origin = start.current;
          start.current = null;
          if (!origin) return;
          const x = event.clientX - origin.x;
          const y = event.clientY - origin.y;
          if (Math.abs(x) > 44 && Math.abs(x) > Math.abs(y) * 1.25) {
            choose(requested === "pack" ? "texture" : "pack");
          }
        }}
      >
        <div className="gallery-depth" ref={depth}>
          <Image
            key={`pack-${attempt}`}
            className="gallery-image gallery-pack"
            src={product.image}
            alt={active === "pack" ? `${product.name} package and snack` : ""}
            aria-hidden={active !== "pack"}
            fill
            draggable={false}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 760px) 90vw, (max-width: 1440px) 47vw, 650px"
            onError={() => setPackError(true)}
          />
          {warm && (
            <Image
              key={`texture-${attempt}`}
              className="gallery-image gallery-texture"
              src={product.texture}
              alt={active === "texture" ? `${product.name} pieces` : ""}
              aria-hidden={active !== "texture"}
              fill
              draggable={false}
              sizes="(max-width: 760px) 90vw, (max-width: 1440px) 47vw, 650px"
              onLoad={() => {
                setTextureReady(true);
                setTextureError(false);
              }}
              onError={() => {
                setTextureReady(false);
                setTextureError(true);
              }}
            />
          )}
        </div>
        {packError && active === "pack" && (
          <div className="gallery-unavailable">
            The pack photo is unavailable.
          </div>
        )}
        <span className="gallery-caption">
          {active === "pack" ? "The pack" : "The crunch"}
        </span>
      </div>
      <div className="gallery-toolbar">
        <div
          className="gallery-choices"
          role="group"
          aria-label="Product images"
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
              return;
            event.preventDefault();
            const view =
              event.key === "Home"
                ? "pack"
                : event.key === "End"
                  ? "texture"
                  : requested === "pack"
                    ? "texture"
                    : "pack";
            choose(view);
            buttons.current[view === "pack" ? 0 : 1]?.focus();
          }}
        >
          {(["pack", "texture"] as const).map((view, index) => (
            <button
              ref={(element) => {
                buttons.current[index] = element;
              }}
              key={view}
              type="button"
              aria-controls={id}
              aria-pressed={requested === view}
              onFocus={() => setWarm(true)}
              onPointerEnter={() => setWarm(true)}
              onClick={() => choose(view)}
            >
              {view === "pack" ? "The pack" : "The crunch"}
            </button>
          ))}
        </div>
        <span className="gallery-hint">Tap or swipe to explore</span>
      </div>
      <p className="gallery-status field-hint" role="status">
        {loading
          ? "Loading the crunch photo…"
          : textureError && requested === "texture"
            ? "That photo couldn’t load. You can try again or view the pack."
            : ""}
      </p>
      {(packError || (textureError && requested === "texture")) && (
        <button
          className="text-link gallery-retry"
          type="button"
          onClick={() => {
            setPackError(false);
            setTextureError(false);
            setAttempt((value) => value + 1);
          }}
        >
          Try the photo again
        </button>
      )}
    </div>
  );
}
