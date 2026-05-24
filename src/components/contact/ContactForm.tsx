"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, Check, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
    return "Tell me a little more — at least 10 characters.";
  }
  return null;
}

export function ContactForm() {
  const [name, setName] = useState<FieldState>(empty);
  const [email, setEmail] = useState<FieldState>(empty);
  const [subject, setSubject] = useState<FieldState>(empty);
  const [message, setMessage] = useState<FieldState>(empty);
  const [status, setStatus] = useState<Status>("idle");

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

    setStatus("submitting");
    await new Promise((r) => setTimeout(r, 1100));
    setStatus("success");
    setName(empty);
    setEmail(empty);
    setSubject(empty);
    setMessage(empty);
    setTimeout(() => setStatus("idle"), 4500);
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
            {...bind(email, setEmail, "email")}
            className={inputClasses(email.error)}
          />
        </Field>

        <Field label="Subject (optional)" htmlFor="subject" error={subject.error}>
          <input
            id="subject"
            type="text"
            placeholder="Quick hello, role inquiry, project idea…"
            {...bind(subject, setSubject, "subject")}
            className={inputClasses(subject.error)}
          />
        </Field>

        <Field label="Message" htmlFor="message" error={message.error}>
          <textarea
            id="message"
            rows={5}
            placeholder="Tell me what you're working on…"
            {...bind(message, setMessage, "message")}
            className={cn(inputClasses(message.error), "min-h-[140px] resize-y")}
          />
        </Field>

        <div className="flex items-center justify-between gap-4">
          <p className="text-xs text-ink-400">
            Submitting sends a friendly email — no marketing, no spam.
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
              : "Something went wrong. Please try again."}
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
