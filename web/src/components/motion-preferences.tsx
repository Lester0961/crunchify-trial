"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";

const preferenceKey = "crunchify_motion";
const preferenceEvent = "crunchify:motion-change";
const reducedQuery = "(prefers-reduced-motion: reduce)";
const serverSnapshot = () => false;
let memoryPreference = false;

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (notify: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", notify);
      return () => media.removeEventListener("change", notify);
    },
    [query],
  );
  const snapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

function readPreference() {
  try {
    const stored = window.localStorage.getItem(preferenceKey);
    return stored ? stored === "reduce" : memoryPreference;
  } catch {
    return memoryPreference;
  }
}

function subscribe(notify: () => void) {
  const media = window.matchMedia(reducedQuery);
  media.addEventListener("change", notify);
  window.addEventListener(preferenceEvent, notify);
  window.addEventListener("storage", notify);
  return () => {
    media.removeEventListener("change", notify);
    window.removeEventListener(preferenceEvent, notify);
    window.removeEventListener("storage", notify);
  };
}

const snapshot = () =>
  window.matchMedia(reducedQuery).matches || readPreference();

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, snapshot, serverSnapshot);
}

export function MotionPreferenceSync() {
  const reduced = useReducedMotion();
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reduced);
  }, [reduced]);
  return null;
}

export function MotionToggle() {
  const reduced = useReducedMotion();
  const systemReduced = useMediaQuery(reducedQuery);
  return (
    <button
      className="motion-toggle"
      type="button"
      aria-pressed={reduced}
      disabled={systemReduced}
      title={
        systemReduced ? "Motion is reduced by your device settings." : undefined
      }
      onClick={() => {
        memoryPreference = !reduced;
        try {
          window.localStorage.setItem(
            preferenceKey,
            reduced ? "auto" : "reduce",
          );
        } catch {
          // Keep this page's choice when browser storage is unavailable.
        }
        window.dispatchEvent(new Event(preferenceEvent));
      }}
    >
      {reduced ? "Motion reduced" : "Reduce motion"}
    </button>
  );
}
