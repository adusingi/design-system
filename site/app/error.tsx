"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@mobayilo/ui";
import { ErrorState } from "../components/sections/error-state";
import { SiteHeader } from "../components/site-header";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <SiteHeader />
      <ErrorState
        eyebrow="@mobayilo/design-system — error"
        title={
          <>
            Something <em>smudged</em>.
          </>
        }
        description="An unexpected error interrupted the render. Try again, or head back to the specimen sheet."
        actions={
          <>
            <Button variant="primary" size="lg" onClick={reset}>
              Try again
            </Button>
            <Link href="/" className="mo-btn mo-btn-outline mo-btn-lg" style={{ textDecoration: "none" }}>
              Back home
            </Link>
          </>
        }
      />
    </>
  );
}
