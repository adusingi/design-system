import type { ReactNode } from "react";

export function ShowcasePanel({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mo-panel">
      <p className="mo-panel-label">{label}</p>
      {children}
    </div>
  );
}
