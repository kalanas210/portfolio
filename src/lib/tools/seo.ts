// Per-tool SEO content. Code-authored (not admin-managed) so each tool page is
// a substantive, keyword-targeted landing page. The visible Markdown description
// stays editable in /admin/tools; this adds intro copy, trust signals, how-to
// steps, FAQs, keywords, and related links on top.

export interface Faq {
  q: string;
  a: string;
}

export interface ToolSeo {
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  intro?: string;
  features?: string[];
  howTo?: string[];
  faqs?: Faq[];
  related?: string[]; // tool slugs
}

export interface ResolvedToolSeo {
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  intro: string;
  features: string[];
  howTo: string[];
  faqs: Faq[];
  related: string[];
}

/** Trust signals shown on every tool ("100% free", privacy, etc.). */
export const DEFAULT_FEATURES = [
  "100% free, forever",
  "No sign-up or login",
  "Runs entirely in your browser",
  "Your files never leave your device",
  "Unlimited use, no watermarks",
  "Works on desktop and mobile",
];

function standardFaqs(name: string): Faq[] {
  return [
    {
      q: `Is ${name} free to use?`,
      a: `Yes — ${name} is completely free, with no sign-up, no usage limits, and no watermarks.`,
    },
    {
      q: "Is my data private?",
      a: "Absolutely. Everything runs locally in your browser, so nothing you enter is uploaded to a server.",
    },
  ];
}

function defaultHowTo(name: string): string[] {
  return [
    `Open ${name} — it loads instantly in your browser.`,
    "Enter or upload your input and adjust any available options.",
    "Copy or download your result. Nothing is uploaded.",
  ];
}

const SEO: Record<string, ToolSeo> = {
  "background-remover": {
    seoTitle: "Free Background Remover — Remove Image Backgrounds Online",
    seoDescription:
      "Remove the background from any image for free, right in your browser. Get a transparent PNG in seconds — no sign-up, no watermark, 100% private.",
    keywords: [
      "background remover",
      "remove background from image",
      "free background remover",
      "transparent png maker",
      "remove bg online",
      "image background remover",
    ],
    intro:
      "Remove the background from any photo and download a clean, transparent PNG in seconds. This free background remover runs entirely in your browser with an on-device AI model, so your images are never uploaded — perfect for product photos, profile pictures, logos, and design assets.",
    howTo: [
      "Upload or drag-and-drop your image (PNG, JPG, or WEBP).",
      "Wait a moment while the AI removes the background — the first run downloads a small model.",
      "Download your transparent PNG. Everything stays on your device.",
    ],
    faqs: [
      {
        q: "Is this background remover really free?",
        a: "Yes — it's 100% free with no sign-up, no watermark, and no limit on the number of images.",
      },
      {
        q: "Are my images uploaded to a server?",
        a: "No. The AI model runs locally in your browser, so your images never leave your device.",
      },
      {
        q: "What image formats are supported?",
        a: "You can upload PNG, JPG, and WEBP images. The result is always a transparent PNG.",
      },
      {
        q: "Can I use it for product photos or e-commerce?",
        a: "Definitely — it's great for clean product shots, marketplace listings, profile pictures, and stickers.",
      },
    ],
    related: ["image-compressor", "image-converter", "image-resizer"],
  },

  "image-compressor": {
    seoTitle: "Free Image Compressor — Compress JPG, PNG & WebP Online",
    seoDescription:
      "Compress images online for free without heavy quality loss. Reduce JPG, PNG, and WebP file size right in your browser — no uploads, no sign-up.",
    keywords: [
      "image compressor",
      "compress image online",
      "reduce image size",
      "compress jpg",
      "compress png",
      "free image optimizer",
    ],
    intro:
      "Shrink image file sizes without uploading anything. Adjust the quality and instantly see how much smaller your JPG, PNG, or WebP becomes — ideal for faster websites, smaller email attachments, and saving storage.",
    howTo: [
      "Drop in a JPG, PNG, or WebP image.",
      "Drag the quality slider to balance file size and clarity.",
      "Download the compressed image — it never leaves your browser.",
    ],
    faqs: [
      {
        q: "Does compressing reduce image quality?",
        a: "You control it. Higher quality keeps more detail; lower quality means a smaller file. Use the slider to find the sweet spot.",
      },
      {
        q: "Is there a file size limit?",
        a: "No artificial limits — it's free and unlimited, and runs entirely on your device.",
      },
    ],
    related: ["image-converter", "image-resizer", "background-remover"],
  },

  "image-converter": {
    seoTitle: "Free Image Converter — PNG to JPG, WebP & More Online",
    seoDescription:
      "Convert images between PNG, JPG, and WebP for free in your browser. Fast, private, no uploads or sign-up.",
    keywords: [
      "image converter",
      "png to jpg",
      "jpg to png",
      "convert to webp",
      "webp converter",
      "image format converter",
    ],
    intro:
      "Convert images between PNG, JPG, and WebP in a click. Flatten a transparent PNG onto white for JPG, or shrink photos to modern WebP — all locally in your browser, with no uploads.",
    howTo: [
      "Upload your image.",
      "Choose the output format (PNG, JPG, or WebP) and quality.",
      "Download the converted image.",
    ],
    faqs: [
      {
        q: "Which formats can I convert between?",
        a: "PNG, JPG, and WebP, in any direction.",
      },
      {
        q: "Will converting upload my image anywhere?",
        a: "No — conversion happens entirely in your browser using the canvas API.",
      },
    ],
    related: ["image-compressor", "image-resizer", "background-remover"],
  },

  "qr-code-generator": {
    seoTitle: "Free QR Code Generator — Custom QR Codes (PNG & SVG)",
    seoDescription:
      "Create custom QR codes for free. Pick size and colors, then download as PNG or SVG. No sign-up, no expiry — generated in your browser.",
    keywords: [
      "qr code generator",
      "free qr code",
      "create qr code",
      "qr code maker",
      "qr code png svg",
      "custom qr code",
    ],
    intro:
      "Turn any link or text into a crisp, customizable QR code. Choose the size, colors, and error-correction level, then download a high-resolution PNG or a scalable SVG for print — generated entirely in your browser, with no tracking and no expiry.",
    howTo: [
      "Type or paste a URL or any text.",
      "Customize the size, colors, and error correction.",
      "Download your QR code as PNG or SVG.",
    ],
    faqs: [
      {
        q: "Do these QR codes expire?",
        a: "Never. They're static QR codes encoded directly from your text, so they work forever with no account or subscription.",
      },
      {
        q: "Can I use them commercially?",
        a: "Yes — use them on packaging, posters, business cards, anywhere.",
      },
      {
        q: "PNG or SVG — which should I choose?",
        a: "Use PNG for screens and quick sharing, and SVG for print or any size without quality loss.",
      },
    ],
    related: ["password-generator", "uuid-generator", "unix-timestamp"],
  },

  "json-formatter": {
    seoTitle: "Free JSON Formatter & Validator — Beautify or Minify JSON",
    seoDescription:
      "Format, validate, and minify JSON online for free. Instantly beautify messy JSON or compress it — runs in your browser, nothing uploaded.",
    keywords: [
      "json formatter",
      "json beautifier",
      "json validator",
      "format json online",
      "minify json",
      "json pretty print",
    ],
    intro:
      "Paste messy JSON to instantly beautify it with clean indentation, catch syntax errors, or minify it for production. A fast, private JSON formatter and validator that runs entirely in your browser.",
    howTo: [
      "Paste your JSON.",
      "Click Format to beautify, or Minify to compress it.",
      "Copy the result. Invalid JSON is flagged with the exact error.",
    ],
    faqs: [
      {
        q: "Does it validate JSON?",
        a: "Yes — if your JSON has a syntax error, you'll see exactly what's wrong.",
      },
      {
        q: "Is my data sent anywhere?",
        a: "No. Formatting and validation happen locally in your browser.",
      },
    ],
    related: ["json-yaml", "json-csv", "json-to-typescript"],
  },

  "unix-timestamp": {
    seoTitle: "Unix Timestamp Converter — Epoch to Date & Time",
    seoDescription:
      "Convert Unix timestamps to human dates and back, free. Supports seconds and milliseconds, with ISO, UTC, local, and relative time.",
    keywords: [
      "unix timestamp converter",
      "epoch converter",
      "timestamp to date",
      "unix time",
      "epoch to date",
      "convert timestamp",
    ],
    intro:
      "Convert a Unix timestamp (epoch) to a readable date — or turn a date into a timestamp. Handles both seconds and milliseconds and shows ISO 8601, UTC, your local time, and relative time.",
    howTo: [
      "Paste a Unix timestamp, or click Now for the current time.",
      "Read the date in ISO, UTC, local, and relative formats.",
      "Or pick a date to get its epoch in seconds and milliseconds.",
    ],
    faqs: [
      {
        q: "What is a Unix timestamp?",
        a: "It's the number of seconds since January 1, 1970 (UTC) — a common way software stores points in time.",
      },
      {
        q: "Seconds or milliseconds?",
        a: "The converter auto-detects: large values are treated as milliseconds, smaller ones as seconds.",
      },
    ],
    related: ["cron-explainer", "number-base", "hash-generator"],
  },

  "regex-tester": {
    seoTitle: "Free Regex Tester — Test Regular Expressions Online",
    seoDescription:
      "Test and debug regular expressions online with live match highlighting and capture groups. Free, private, runs in your browser.",
    keywords: [
      "regex tester",
      "regular expression tester",
      "regex online",
      "test regex",
      "regex debugger",
      "regex match",
    ],
    intro:
      "Write a regular expression and instantly see every match highlighted in your test string, along with capture groups. A fast regex tester and debugger that runs locally — great for validating patterns for email, dates, and more.",
    howTo: [
      "Enter your regex pattern and flags (like g, i, m).",
      "Paste a test string.",
      "See matches highlighted live, with capture groups listed.",
    ],
    faqs: [
      {
        q: "Which regex flavor is this?",
        a: "JavaScript (ECMAScript) regular expressions — the same engine that runs in browsers and Node.js.",
      },
      {
        q: "Is my text uploaded?",
        a: "No — matching happens entirely in your browser.",
      },
    ],
    related: ["diff-checker", "case-converter", "string-escape"],
  },

  "password-generator": {
    seoTitle: "Free Password Generator — Strong, Random Passwords",
    seoDescription:
      "Generate strong, random, secure passwords for free. Choose length and character sets, with a built-in strength meter. Private and browser-based.",
    keywords: [
      "password generator",
      "strong password generator",
      "random password",
      "secure password",
      "create password",
      "password maker",
    ],
    intro:
      "Create strong, random passwords using your browser's cryptographic generator. Tune the length and character sets and check the strength instantly — nothing is sent anywhere, so your passwords stay private.",
    howTo: [
      "Choose a length and which character types to include.",
      "A secure password is generated instantly.",
      "Copy it, or regenerate for another.",
    ],
    faqs: [
      {
        q: "Are these passwords safe?",
        a: "Yes — they're generated with the Web Crypto API (a cryptographically secure random generator) entirely on your device.",
      },
      {
        q: "Do you store the passwords?",
        a: "Never. Nothing is sent to, or stored on, any server.",
      },
    ],
    related: ["hash-generator", "bcrypt", "uuid-generator"],
  },

  "jwt-decoder": {
    seoTitle: "Free JWT Decoder — Decode JSON Web Tokens Online",
    seoDescription:
      "Decode and inspect a JWT (JSON Web Token) — header, payload, and expiry — online. Free and private; tokens are decoded in your browser, never uploaded.",
    keywords: [
      "jwt decoder",
      "decode jwt",
      "json web token decoder",
      "jwt parser",
      "jwt debugger",
      "decode json web token",
    ],
    intro:
      "Paste a JSON Web Token to instantly decode its header and payload and check the expiry. A private JWT decoder that runs in your browser — tokens are never sent to a server.",
    howTo: [
      "Paste your JWT.",
      "Read the decoded header and payload.",
      "Check the expiry and copy any part you need.",
    ],
    faqs: [
      {
        q: "Does this verify the signature?",
        a: "No — this is a decoder only. It reads the header and payload but does not validate the signature.",
      },
      {
        q: "Is it safe to paste a token here?",
        a: "Decoding happens entirely in your browser and nothing is transmitted — but avoid sharing production tokens publicly.",
      },
    ],
    related: ["base64", "hmac-generator", "hash-generator"],
  },

  base64: {
    seoTitle: "Free Base64 Encoder & Decoder — Encode/Decode Online",
    seoDescription:
      "Encode text to Base64 or decode Base64 to text, free and UTF-8 safe. Runs in your browser — nothing is uploaded.",
    keywords: [
      "base64 encode",
      "base64 decode",
      "base64 encoder",
      "base64 decoder",
      "base64 converter",
      "encode decode base64",
    ],
    intro:
      "Encode text to Base64 or decode it back, with full UTF-8 support (emoji and accents included). A fast, private Base64 encoder/decoder that works entirely in your browser.",
    howTo: ["Choose Encode or Decode.", "Paste your text or Base64 string.", "Copy the result."],
    faqs: [
      {
        q: "Is it UTF-8 safe?",
        a: "Yes — it correctly handles emoji and accented characters in both directions.",
      },
      {
        q: "Does my text get uploaded?",
        a: "No — encoding and decoding happen entirely in your browser.",
      },
    ],
    related: ["jwt-decoder", "url-encoder", "hash-generator"],
  },

  "hash-generator": {
    seoTitle: "Free Hash Generator — SHA-256, SHA-512 & More Online",
    seoDescription:
      "Generate SHA-1, SHA-256, SHA-384, and SHA-512 hashes from text, free. Computed locally with the Web Crypto API — nothing is uploaded.",
    keywords: [
      "hash generator",
      "sha256 generator",
      "sha512 hash",
      "generate hash online",
      "sha1 hash",
      "checksum generator",
    ],
    intro:
      "Generate cryptographic hashes (SHA-1, SHA-256, SHA-384, SHA-512) from any text. Computed instantly with the browser's Web Crypto API, so your input never leaves your device.",
    howTo: [
      "Type or paste your text.",
      "See SHA-1, SHA-256, SHA-384, and SHA-512 hashes update live.",
      "Copy the hash you need.",
    ],
    faqs: [
      {
        q: "Why is there no MD5?",
        a: "MD5 isn't offered by the browser's secure crypto API and is considered insecure. SHA-256 and above are recommended.",
      },
      {
        q: "Is my input uploaded?",
        a: "No — hashing happens locally with the Web Crypto API.",
      },
    ],
    related: ["hmac-generator", "password-generator", "bcrypt"],
  },

  "diff-checker": {
    seoTitle: "Free Diff Checker — Compare Text & Find Differences",
    seoDescription:
      "Compare two blocks of text and see the differences line by line, free. A private text diff tool that runs in your browser.",
    keywords: [
      "diff checker",
      "text compare",
      "compare text online",
      "text difference",
      "diff tool",
      "find differences",
    ],
    intro:
      "Paste two versions of any text to see exactly what changed — added and removed lines highlighted side by side. A private diff checker that runs entirely in your browser.",
    howTo: [
      "Paste the original text on the left.",
      "Paste the changed text on the right.",
      "Review the highlighted, line-by-line differences.",
    ],
    faqs: [
      {
        q: "What can I compare?",
        a: "Any text — code, config, prose, JSON, logs, and more.",
      },
      {
        q: "Is my text uploaded?",
        a: "No — the comparison runs locally in your browser.",
      },
    ],
    related: ["regex-tester", "case-converter", "text-utilities"],
  },
};

/** Resolve a tool's SEO content, filling sensible defaults for anything unset. */
export function getToolSeo(slug: string, name: string, tagline: string): ResolvedToolSeo {
  const entry = SEO[slug] ?? {};
  return {
    seoTitle: entry.seoTitle,
    seoDescription: entry.seoDescription,
    keywords: entry.keywords,
    intro: entry.intro ?? tagline,
    features: entry.features ?? DEFAULT_FEATURES,
    howTo: entry.howTo ?? defaultHowTo(name),
    faqs: entry.faqs ?? standardFaqs(name),
    related: entry.related ?? [],
  };
}
