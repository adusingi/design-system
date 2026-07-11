import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx.js";

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
};

// Implicit label association (input nested in <label>) avoids needing a
// generated id, so this stays hook-free and safe to import from a Server
// Component tree.
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    const input = <input ref={ref} type="checkbox" className={cx("mo-checkbox", className)} {...props} />;
    if (!label) return input;
    return (
      <label className="mo-checkbox-label">
        {input}
        <span>{label}</span>
      </label>
    );
  },
);
Checkbox.displayName = "Checkbox";

export type RadioProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
};

export const Radio = forwardRef<HTMLInputElement, RadioProps>(({ className, label, ...props }, ref) => {
  const input = <input ref={ref} type="radio" className={cx("mo-radio", className)} {...props} />;
  if (!label) return input;
  return (
    <label className="mo-radio-label">
      {input}
      <span>{label}</span>
    </label>
  );
});
Radio.displayName = "Radio";
