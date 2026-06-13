import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Outfit } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SiteFrame } from "@/components/layout/SiteFrame";
import { SettingsProvider } from "@/components/providers/SettingsProvider";
import { getSettings } from "@/lib/queries";
import { SITE } from "@/lib/utils";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: "Kalana Sandakelum - Full-Stack & Java Developer | Sri Lanka",
    template: `%s - ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "Kalana Sandakelum",
    "Kalana",
    "Kalana Sandakelum portfolio",
    "Java developer Sri Lanka",
    "Java Spring Boot developer Sri Lanka",
    "Spring Boot developer Sri Lanka",
    "full stack developer Sri Lanka",
    "software engineer Sri Lanka",
    "University of Moratuwa",
    "University of Moratuwa software engineer",
    "Next.js developer Sri Lanka",
    "React developer Sri Lanka",
  ],
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE.url,
    title: "Kalana Sandakelum - Full-Stack & Java Developer",
    description: SITE.description,
    siteName: SITE.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Kalana Sandakelum - Full-Stack & Java Developer",
    description: SITE.description,
  },
  icons: {
    icon: "/favicon.ico",
  },
  // Optional: set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to verify in Search Console.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#050505" },
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSettings();

  // ── JSON-LD structured data — lets Google understand exactly who this site is
  //    about. Strong signal for ranking the name and a shot at a knowledge panel.
  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: settings.name,
    url: SITE.url,
    image: `${SITE.url}/opengraph-image`,
    jobTitle: "Full-Stack & Java (Spring Boot) Developer",
    description: SITE.description,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: settings.university,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Moratuwa",
      addressCountry: "LK",
    },
    knowsAbout: [
      "Java",
      "Spring Boot",
      "Full-Stack Web Development",
      "Next.js",
      "React",
      "TypeScript",
      "PostgreSQL",
      "Microservices",
      "Docker",
      "AWS",
    ],
    sameAs: [
      settings.social.github,
      settings.social.linkedin,
      settings.social.facebook,
      settings.social.instagram,
    ].filter(Boolean),
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.name,
    url: SITE.url,
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${outfit.variable} font-sans selection:bg-accent/30`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SettingsProvider value={settings}>
            <SiteFrame settings={settings}>{children}</SiteFrame>
          </SettingsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
