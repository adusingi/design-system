import type { ReactNode } from "react";

// An exhibit sits directly on the components field — a mono caption above the
// live component, no wrapper box. The exhibits themselves (Card, Dialog,
// Input…) keep their own borders: they are the content being documented.
export function ShowcasePanel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="mo-exhibit-label">{label}</p>
      {children}
    </div>
  );
}
