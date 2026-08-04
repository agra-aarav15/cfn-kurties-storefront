/**
 * Newsletter signup — validated email, rate-limited API.
 */

"use client";

import { useState, type FormEvent } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error?.message || "Something went wrong");
      }
      setStatus("success");
      setMessage("Thank you — you’re on the list.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to subscribe");
    }
  };

  return (
    <section className="border-y border-brand-border bg-brand-cream py-20 md:py-24">
      <Container narrow className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">
          Stay in touch
        </p>
        <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-4xl">
          New drops & quiet offers
        </h2>
        <p className="mt-4 text-sm text-brand-gray-500">
          Join the CFN list for early access to new kurties. No spam — only the good things.
        </p>
        <form
          onSubmit={onSubmit}
          className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="h-12 flex-1 border border-brand-border bg-white px-4 text-sm outline-none transition-colors focus:border-brand-black"
            autoComplete="email"
          />
          <Button type="submit" size="md" loading={status === "loading"} className="h-12 sm:px-8">
            Subscribe
          </Button>
        </form>
        {message && (
          <p
            className={`mt-4 text-sm ${
              status === "success" ? "text-brand-success" : "text-brand-error"
            }`}
            role="status"
          >
            {message}
          </p>
        )}
      </Container>
    </section>
  );
}
