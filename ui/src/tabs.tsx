"use client";

import { createContext, useContext, useState, type HTMLAttributes, type ReactNode } from "react";
import { cx } from "./cx.js";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export type TabsProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
};

// Works uncontrolled (defaultValue) or controlled (value + onValueChange),
// matching the Input/Select convention. Doubles as a segmented control when
// styled inline (see .mo-tabs-list--segmented in styles.css).
export function Tabs({ defaultValue = "", value: controlledValue, onValueChange, children, className }: TabsProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultValue);
  const value = controlledValue ?? uncontrolled;
  const setValue = (next: string) => (onValueChange ? onValueChange(next) : setUncontrolled(next));

  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cx("mo-tabs", className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList(props: HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" className={cx("mo-tabs-list", props.className)} {...props} />;
}

export type TabsTriggerProps = HTMLAttributes<HTMLButtonElement> & { value: string };

export function TabsTrigger({ value, className, ...props }: TabsTriggerProps) {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("TabsTrigger must be used within <Tabs>");
  const active = ctx.value === value;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      data-active={active}
      className={cx("mo-tabs-trigger", className)}
      onClick={() => ctx.setValue(value)}
      {...props}
    />
  );
}

export type TabsContentProps = HTMLAttributes<HTMLDivElement> & { value: string };

export function TabsContent({ value, className, ...props }: TabsContentProps) {
  const ctx = useContext(TabsContext);
  if (!ctx || ctx.value !== value) return null;
  return <div role="tabpanel" className={cx("mo-tabs-panel", className)} {...props} />;
}
