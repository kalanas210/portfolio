"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { CustomCursor } from "@/components/ui/CustomCursor";
import { PageTransition } from "@/components/ui/PageTransition";
import { CommandPalette } from "@/components/ui/CommandPalette";
import { RouteProgress } from "@/components/ui/RouteProgress";
import { SmoothScroll } from "@/components/ui/SmoothScroll";
import type { SiteSettings } from "@/lib/types";

/**
 * Renders the public marketing chrome (nav, footer, cursor, command palette,
 * page transitions). On /admin it renders children bare so the dashboard has
 * its own shell — and none of this client machinery mounts there.
 */
export function SiteFrame({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <>
      <SmoothScroll />
      <RouteProgress />
      <CustomCursor />
      <Navbar />
      <CommandPalette />
      <PageTransition>
        <main className="relative">{children}</main>
      </PageTransition>
      <Footer settings={settings} />
    </>
  );
}
