import type { Metadata } from "next";
import Link from "next/link";
import { ErrorState } from "../components/sections/error-state";
import { SiteHeader } from "../components/site-header";

export const metadata: Metadata = {
  title: "404 — Mobayilo Design System",
};

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <ErrorState
        eyebrow="@mobayilo/design-system — 404"
        title={
          <>
            Nothing has been <em>poured</em> here.
          </>
        }
        description="The page you are looking for does not exist, or the ink has already dried. Head back to the specimen sheet."
        actions={
          <Link href="/" className="mo-btn mo-btn-primary mo-btn-lg" style={{ textDecoration: "none" }}>
            Back to the specimen sheet
          </Link>
        }
      />
    </>
  );
}
