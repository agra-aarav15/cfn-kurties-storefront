/**
 * Global 404 page.
 */

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="bg-white pt-32 pb-24">
      <Container className="text-center">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-brand-gold">404</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight md:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 text-sm text-brand-gray-500">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button href="/" variant="primary">
            Go home
          </Button>
          <Button href="/shop" variant="outline">
            Shop collection
          </Button>
        </div>
      </Container>
    </div>
  );
}
