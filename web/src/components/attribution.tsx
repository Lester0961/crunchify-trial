"use client";
import { useEffect } from "react";
export function Attribution() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("crunchify_attribution")) return;
      const params = new URLSearchParams(window.location.search);
      const utm: Record<string, string> = {};
      for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
        const value = params.get(key);
        if (value) utm[key] = value.slice(0, 200);
      }
      sessionStorage.setItem("crunchify_attribution", JSON.stringify({ source: window.location.pathname, utm }));
    } catch { /* Storage can be disabled; the form can still be used. */ }
  }, []);
  return null;
}
