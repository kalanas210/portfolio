"use client";

import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { Loader2 } from "lucide-react";

function EmbedLoading() {
  return (
    <div className="flex h-72 items-center justify-center rounded-3xl border border-black/10 dark:border-white/10">
      <Loader2 className="animate-spin text-ink-400" />
    </div>
  );
}

// Functional tools are loaded client-side only (ssr: false) and code-split, so
// none of their heavy deps touch the server render or the initial bundle.
// Note: next/dynamic options must be an inline object literal at each call.
const REGISTRY: Record<string, ComponentType> = {
  "background-remover": dynamic(() => import("./BackgroundRemover").then((m) => m.BackgroundRemover), { ssr: false, loading: EmbedLoading }),
  "image-compressor": dynamic(() => import("./ImageCompressor").then((m) => m.ImageCompressor), { ssr: false, loading: EmbedLoading }),
  "image-converter": dynamic(() => import("./ImageConverter").then((m) => m.ImageConverter), { ssr: false, loading: EmbedLoading }),
  "image-resizer": dynamic(() => import("./ImageResizer").then((m) => m.ImageResizer), { ssr: false, loading: EmbedLoading }),
  "qr-code-generator": dynamic(() => import("./QrGenerator").then((m) => m.QrGenerator), { ssr: false, loading: EmbedLoading }),
  "json-formatter": dynamic(() => import("./JsonFormatter").then((m) => m.JsonFormatter), { ssr: false, loading: EmbedLoading }),
  "jwt-decoder": dynamic(() => import("./JwtDecoder").then((m) => m.JwtDecoder), { ssr: false, loading: EmbedLoading }),
  base64: dynamic(() => import("./Base64Tool").then((m) => m.Base64Tool), { ssr: false, loading: EmbedLoading }),
  "hash-generator": dynamic(() => import("./HashGenerator").then((m) => m.HashGenerator), { ssr: false, loading: EmbedLoading }),
  "url-encoder": dynamic(() => import("./UrlTool").then((m) => m.UrlTool), { ssr: false, loading: EmbedLoading }),
  ocr: dynamic(() => import("./OcrTool").then((m) => m.OcrTool), { ssr: false, loading: EmbedLoading }),
  "json-yaml": dynamic(() => import("./JsonYaml").then((m) => m.JsonYaml), { ssr: false, loading: EmbedLoading }),
  "json-csv": dynamic(() => import("./JsonCsv").then((m) => m.JsonCsv), { ssr: false, loading: EmbedLoading }),
  "json-to-typescript": dynamic(() => import("./JsonToTypescript").then((m) => m.JsonToTypescript), { ssr: false, loading: EmbedLoading }),
  "sql-formatter": dynamic(() => import("./SqlFormatterTool").then((m) => m.SqlFormatterTool), { ssr: false, loading: EmbedLoading }),
  "xml-formatter": dynamic(() => import("./XmlFormatter").then((m) => m.XmlFormatter), { ssr: false, loading: EmbedLoading }),
  "curl-to-code": dynamic(() => import("./CurlToCode").then((m) => m.CurlToCode), { ssr: false, loading: EmbedLoading }),
  "uuid-generator": dynamic(() => import("./UuidGenerator").then((m) => m.UuidGenerator), { ssr: false, loading: EmbedLoading }),
  "password-generator": dynamic(() => import("./PasswordGenerator").then((m) => m.PasswordGenerator), { ssr: false, loading: EmbedLoading }),
  bcrypt: dynamic(() => import("./BcryptTool").then((m) => m.BcryptTool), { ssr: false, loading: EmbedLoading }),
  "hmac-generator": dynamic(() => import("./HmacGenerator").then((m) => m.HmacGenerator), { ssr: false, loading: EmbedLoading }),
  "gitignore-generator": dynamic(() => import("./GitignoreGenerator").then((m) => m.GitignoreGenerator), { ssr: false, loading: EmbedLoading }),
  "fake-data": dynamic(() => import("./FakeData").then((m) => m.FakeData), { ssr: false, loading: EmbedLoading }),
  "unix-timestamp": dynamic(() => import("./UnixTimestamp").then((m) => m.UnixTimestamp), { ssr: false, loading: EmbedLoading }),
  "cron-explainer": dynamic(() => import("./CronExplainer").then((m) => m.CronExplainer), { ssr: false, loading: EmbedLoading }),
  "number-base": dynamic(() => import("./NumberBase").then((m) => m.NumberBase), { ssr: false, loading: EmbedLoading }),
  "subnet-calculator": dynamic(() => import("./SubnetCalculator").then((m) => m.SubnetCalculator), { ssr: false, loading: EmbedLoading }),
  "contrast-checker": dynamic(() => import("./ContrastChecker").then((m) => m.ContrastChecker), { ssr: false, loading: EmbedLoading }),
  "regex-tester": dynamic(() => import("./RegexTester").then((m) => m.RegexTester), { ssr: false, loading: EmbedLoading }),
  "diff-checker": dynamic(() => import("./DiffChecker").then((m) => m.DiffChecker), { ssr: false, loading: EmbedLoading }),
  "case-converter": dynamic(() => import("./CaseConverter").then((m) => m.CaseConverter), { ssr: false, loading: EmbedLoading }),
  "string-escape": dynamic(() => import("./StringEscape").then((m) => m.StringEscape), { ssr: false, loading: EmbedLoading }),
  "text-utilities": dynamic(() => import("./TextUtilities").then((m) => m.TextUtilities), { ssr: false, loading: EmbedLoading }),
  "markdown-preview": dynamic(() => import("./MarkdownPreview").then((m) => m.MarkdownPreview), { ssr: false, loading: EmbedLoading }),
};

export function ToolEmbed({ componentKey }: { componentKey: string }) {
  const Component = REGISTRY[componentKey];
  if (!Component) {
    return (
      <div className="rounded-3xl border border-dashed border-black/15 p-10 text-center text-sm text-ink-400 dark:border-white/15">
        This tool isn&apos;t available yet.
      </div>
    );
  }
  return <Component />;
}
