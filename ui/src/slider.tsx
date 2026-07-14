import { forwardRef, type InputHTMLAttributes } from "react";
import { cx } from "./cx.js";

export type SliderProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type">;

export const Slider = forwardRef<HTMLInputElement, SliderProps>(({ className, ...props }, ref) => (
  <input ref={ref} type="range" className={cx("mo-slider", className)} {...props} />
));
Slider.displayName = "Slider";
