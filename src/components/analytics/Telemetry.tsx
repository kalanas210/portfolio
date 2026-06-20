"use client";

import { useEffect } from "react";
import { notifyCv, notifyVisit } from "@/lib/notify-client";

const SESSION_KEY = "tg_visit_sent";

/**
 * Mounted once in the root layout. Does two things, both best-effort:
 *   1. Fires a single "visit" notification per browser session (sessionStorage
 *      flag), so client-side navigations and refreshes within a session don't
 *      re-notify.
 *   2. Listens (via event delegation) for clicks on any CV trigger - elements
 *      marked data-track="cv" - and fires a "cv" notification.
 * Admin pages (/eta887) are excluded so your own visits stay quiet.
 */
export function Telemetry() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.pathname.startsWith("/eta887")) return;

    // 1) Once-per-session visit.
    try {
      if (!sessionStorage.getItem(SESSION_KEY)) {
        sessionStorage.setItem(SESSION_KEY, "1");
        notifyVisit();
      }
    } catch {
      // Private mode / storage blocked: still notify, just without dedupe.
      notifyVisit();
    }

    // 2) Delegated CV-click tracking.
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (target?.closest('[data-track="cv"]')) {
        notifyCv();
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
