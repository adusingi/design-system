import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx.js";

export type SwitchProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label?: ReactNode;
};

// A native checkbox styled as a track + thumb via the `:checked + .mo-switch-track`
// sibling selector in styles.css — no JS state needed, works uncontrolled or
// controlled exactly like a checkbox.
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(({ className, label, ...props }, ref) => (
  <label className={cx("mo-switch", className)}>
    <input ref={ref} type="checkbox" className="mo-switch-input" {...props} />
    <span className="mo-switch-track">
      <span className="mo-switch-thumb" />
    </span>
    {label && <span className="mo-switch-label">{label}</span>}
  </label>
));
Switch.displayName = "Switch";
