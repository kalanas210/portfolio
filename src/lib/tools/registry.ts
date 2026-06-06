// Built-in functional tools that an "embedded" Tool row can render via its
// `component_key`. This file is plain metadata (no React / no next-dynamic) so
// it's safe to import from both server pages and the admin form.
//
// To add a new tool:
//   1. Build its client component under src/components/tools/.
//   2. Register the component in src/components/tools/ToolEmbed.tsx.
//   3. Add an entry below so it appears in the admin "component" dropdown.

export interface ToolComponentMeta {
  key: string;
  label: string;
  description: string;
}

export const TOOL_COMPONENTS: ToolComponentMeta[] = [
  {
    key: "background-remover",
    label: "Background Remover",
    description: "In-browser AI background removal that outputs a transparent PNG.",
  },
  {
    key: "image-compressor",
    label: "Image Compressor",
    description: "Shrink JPG/PNG/WebP file size with an adjustable quality slider.",
  },
  {
    key: "image-converter",
    label: "Image Converter",
    description: "Convert images between PNG, JPG, and WebP.",
  },
  {
    key: "image-resizer",
    label: "Image Resizer",
    description: "Resize images to exact dimensions with optional aspect lock.",
  },
  {
    key: "qr-code-generator",
    label: "QR Code Generator",
    description: "Generate a customizable QR code and download it as PNG or SVG.",
  },
  {
    key: "json-formatter",
    label: "JSON Formatter",
    description: "Pretty-print, validate, and minify JSON.",
  },
  {
    key: "jwt-decoder",
    label: "JWT Decoder",
    description: "Decode a JWT's header and payload (no verification).",
  },
  {
    key: "base64",
    label: "Base64 Encoder / Decoder",
    description: "Encode text to Base64 or decode it back (UTF-8 safe).",
  },
  {
    key: "hash-generator",
    label: "Hash Generator",
    description: "Compute SHA-1/256/384/512 hashes via the Web Crypto API.",
  },
  {
    key: "url-encoder",
    label: "URL Encoder / Decoder",
    description: "Percent-encode or decode text for URLs.",
  },
  {
    key: "ocr",
    label: "Image to Text (OCR)",
    description: "Extract text from an image in the browser with Tesseract.js.",
  },
  { key: "json-yaml", label: "JSON ↔ YAML", description: "Convert between JSON and YAML in both directions." },
  { key: "json-csv", label: "JSON ↔ CSV", description: "Convert JSON arrays to CSV and back." },
  { key: "json-to-typescript", label: "JSON → TypeScript", description: "Generate TypeScript interfaces from JSON." },
  { key: "sql-formatter", label: "SQL Formatter", description: "Format and beautify SQL for many dialects." },
  { key: "xml-formatter", label: "XML / HTML Formatter", description: "Beautify or minify XML and HTML." },
  { key: "curl-to-code", label: "cURL → Code", description: "Turn a curl command into fetch or axios code." },
  { key: "uuid-generator", label: "UUID Generator", description: "Generate UUID v4 and v7 in bulk." },
  { key: "password-generator", label: "Password Generator", description: "Create strong, random passwords in the browser." },
  { key: "bcrypt", label: "Bcrypt Hash & Verify", description: "Hash a password with bcrypt or verify one." },
  { key: "hmac-generator", label: "HMAC Generator", description: "Generate an HMAC signature with the Web Crypto API." },
  { key: "gitignore-generator", label: ".gitignore Generator", description: "Build a .gitignore for your stack." },
  { key: "fake-data", label: "Fake Data Generator", description: "Generate mock JSON or CSV test data." },
  { key: "unix-timestamp", label: "Unix Timestamp Converter", description: "Convert between Unix time and human dates." },
  { key: "cron-explainer", label: "Cron Explainer", description: "Translate cron expressions to English and list next runs." },
  { key: "number-base", label: "Number Base Converter", description: "Convert between binary, octal, decimal, and hex." },
  { key: "subnet-calculator", label: "Subnet Calculator", description: "Compute network, broadcast, mask, and host range from CIDR." },
  { key: "contrast-checker", label: "Contrast Checker", description: "Check WCAG color contrast between two colors." },
  { key: "regex-tester", label: "Regex Tester", description: "Test regular expressions with live match highlighting." },
  { key: "diff-checker", label: "Diff Checker", description: "Compare two texts and see the differences." },
  { key: "case-converter", label: "Case Converter", description: "Convert text between camelCase, snake_case, and more." },
  { key: "string-escape", label: "String Escape / Unescape", description: "Escape or unescape JSON, JS, HTML, and SQL strings." },
  { key: "text-utilities", label: "Text Utilities", description: "Slugify, count, sort, dedupe, and clean up text." },
  { key: "markdown-preview", label: "Markdown Previewer", description: "Write Markdown and preview the rendered result live." },
];

export function isToolComponentKey(key: string | null | undefined): boolean {
  return !!key && TOOL_COMPONENTS.some((c) => c.key === key);
}
