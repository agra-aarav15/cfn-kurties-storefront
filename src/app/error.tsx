/**
 * Global Error Boundary Component — Client-facing.
 * Catches unhandled errors, logs full details server-side, and renders a safe, generic message.
 * Prevents leaks of internal file paths, stack traces, database schema details, or raw exceptions.
 */

"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log full error details server-side / analytics without exposing to UI
    console.error("[GlobalError Boundary Caught]", {
      name: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <div className="min-h-[60vh] bg-white pt-32 pb-24 flex items-center justify-center">
      <Container className="text-center max-w-lg mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-gold">
          System Notice
        </p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-brand-black md:text-4xl">
          An unexpected error occurred
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-brand-gray-500">
          We encountered an issue processing your request. Please try again or return to our homepage.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Button type="button" onClick={() => reset()} variant="primary">
            Try Again
          </Button>
          <Button href="/" variant="outline">
            Return Home
          </Button>
        </div>
      </Container>
    </div>
  );
}
