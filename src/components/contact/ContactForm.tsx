"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Turnstile } from "./Turnstile";

type Status = "idle" | "submitting" | "success" | "error";

interface FieldState {
  value: string;
  touched: boolean;
  error: string | null;
}

const empty: FieldState = { value: "", touched: false, error: null };

function validateField(name: string, value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    if (name === "subject") return null; // subject optional
    return "This field is required.";
  }
  if (name === "email") {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return "Enter a valid email address.";
  }
  if (name === "message" && trimmed.length < 10) {
    return "Tell me a little more - at least 10 characters.";
  }
  return null;
}

export function ContactForm() {
  const [name, setName] = useState<FieldState>(empty);
  const [email, setEmail] = useState<FieldState>(empty);
  const [subject, setSubject] = useState<FieldState>(empty);
  const [message, setMessage] = useState<FieldState>(empty);
  const [status, setStatus] = useState<Status>("idle");
  const [company, setCompany] = useState(""); // honeypot — must stay empty
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  function bind(
    field: FieldState,
    setField: (s: FieldState) => void,
    name: string,
  ) {
    return {
      value: field.value,
      onBlur: () => setField({ ...field, touched: true, error: validateField(name, field.value) }),
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.value;
        setField({
          value,
          touched: field.touched,
          error: field.touched ? validateField(name, value) : null,
        });
      },
    };
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fields = [
      { name: "name", state: name, set: setName },
      { name: "email", state: email, set: setEmail },
      { name: "subject", state: subject, set: setSubject },
      { name: "message", state: message, set: setMessage },
    ];

    let hasError = false;
    for (const f of fields) {
      const err = validateField(f.name, f.state.value);
      f.set({ ...f.state, touched: true, error: err });
      if (err) hasError = true;
    }
    if (hasError) return;

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setErrorMsg("Please complete the captcha below.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4500);
      return;
    }

    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.value,
          email: email.value,
          subject: subject.value,
          message: message.value,
          company,
          turnstileToken,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!res.ok || !data.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        window.turnstile?.reset();
        setTurnstileToken(null);
        setTimeout(() => setStatus("idle"), 5000);
        return;
      }

      setStatus("success");
      setName(empty);
      setEmail(empty);
      setSubject(empty);
      setMessage(empty);
      setCompany("");
      window.turnstile?.reset();
      setTurnstileToken(null);
      setTimeout(() => setStatus("idle"), 4500);
    } catch {
      setErrorMsg("Network error - please try again.");
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="relative rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-ink-900 p-6 sm:p-8"
    >
      <div className="grid gap-5">
        <Field label="Your name" htmlFor="name" error={name.error}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Jane Doe"
            aria-invalid={!!name.error}
            aria-describedby={name.error ? "name-error" : undefined}
            {...bind(name, setName, "name")}
            className={inputClasses(name.error)}
          />
        </Field>

        <Field label="Email" htmlFor="email" error={email.error}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@domain.com"
            aria-invalid={!!email.error}
            aria-describedby={email.error ? "email-error" : undefined}
            {...bind(email, setEmail, "email")}
            className={inputClasses(email.error)}
          />
        </Field>

        <Field label="Subject (optional)" htmlFor="subject" error={subject.error}>
          <input
            id="subject"
            type="text"
            placeholder="Quick hello, role inquiry, project idea…"
            aria-invalid={!!subject.error}
            aria-describedby={subject.error ? "subject-error" : undefined}
            {...bind(subject, setSubject, "subject")}
            className={inputClasses(subject.error)}
          />
        </Field>

        <Field label="Message" htmlFor="message" error={message.error}>
          <textarea
            id="message"
            rows={5}
            placeholder="Tell me what you're working on…"
            aria-invalid={!!message.error}
            aria-describedby={message.error ? "message-error" : undefined}
            {...bind(message, setMessage, "message")}
            className={cn(inputClasses(message.error), "min-h-[140px] resize-y")}
          />
        </Field>

        {/* Honeypot — off-screen; real users never see or fill it. */}
        <div aria-hidden className="absolute left-[-9999px] top-0 h-0 w-0 overflow-hidden">
          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </div>

        {TURNSTILE_SITE_KEY && (
          <Turnstile siteKey={TURNSTILE_SITE_KEY} onToken={setTurnstileToken} />
        )}

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-ink-400">
            Submitting sends a friendly email - no marketing, no spam.
          </p>
          <button
            type="submit"
            disabled={status === "submitting"}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-full bg-ink-950 dark:bg-white px-5 text-sm font-medium text-white dark:text-ink-950",
              "transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0",
              "shadow-[0_8px_24px_-12px_rgba(0,0,0,0.5)]",
            )}
          >
            {status === "submitting" ? (
              <>
                <Loader2 size={15} className="animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send message
                <Send size={14} />
              </>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {(status === "success" || status === "error") && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "mt-5 flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm",
              status === "success"
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                : "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
            )}
          >
            {status === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
            {status === "success"
              ? "Message sent. I'll reply within a day."
              : (errorMsg ?? "Something went wrong. Please try again.")}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
}

function inputClasses(error: string | null) {
  return cn(
    "h-11 w-full rounded-xl border bg-white dark:bg-ink-800 px-4 text-sm",
    "border-black/10 dark:border-white/10",
    "placeholder:text-ink-400",
    "focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/60",
    "transition-colors",
    error && "border-rose-400/60 focus:ring-rose-400/40",
  );
}

function Field({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error: string | null;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="mb-1.5 block text-xs font-medium uppercase tracking-[0.14em] text-ink-400"
      >
        {label}
      </label>
      {children}
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${htmlFor}-error`}
            role="alert"
            initial={{ opacity: 0, y: -4, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -4, height: 0 }}
            transition={{ duration: 0.2 }}
            className="mt-1.5 inline-flex items-center gap-1 text-xs text-rose-500"
          >
            <AlertCircle size={11} />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
