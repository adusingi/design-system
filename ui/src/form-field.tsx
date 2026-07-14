import type { ReactNode } from "react";
import { cx } from "./cx.js";

export type FormFieldProps = {
  label?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  children: ReactNode;
  className?: string;
};

// Wraps a label, a form control (Input/Textarea/Select/...), and helper or
// error text with consistent spacing. The control is passed as `children` so
// this stays agnostic to which control it wraps.
export function FormField({ label, htmlFor, hint, error, children, className }: FormFieldProps) {
  return (
    <div className={cx("mo-field", className)}>
      {label && (
        <label className="mo-field-label" htmlFor={htmlFor}>
          {label}
        </label>
      )}
      {children}
      {error ? <p className="mo-field-error">{error}</p> : hint ? <p className="mo-field-hint">{hint}</p> : null}
    </div>
  );
}
