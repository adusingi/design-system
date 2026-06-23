"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { buildThemeStyles, getThemeById, type ThemeDefinition } from "./themes.js";
import type { ThemeConfig } from "./config.js";

type ThemeContextValue = {
  config: ThemeConfig;
  currentThemeId: string;
  /** Persist + apply a theme. */
  setTheme: (id: string) => void;
  /** Apply without persisting (hover preview). */
  previewTheme: (id: string) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyDocumentTheme(id: string) {
  if (typeof document !== "undefined") document.documentElement.dataset.theme = id;
}

function readInitialThemeId(config: ThemeConfig): string {
  if (typeof window === "undefined") return config.defaultThemeId;
  const stored = window.localStorage.getItem(config.storageKey);
  const fromDoc = document.documentElement.dataset.theme;
  return getThemeById(stored || fromDoc || config.defaultThemeId, config.themes).id;
}

export function ThemeProvider({
  config,
  children,
}: {
  config: ThemeConfig;
  children: ReactNode;
}) {
  const [currentThemeId, setCurrentThemeId] = useState(config.defaultThemeId);

  // Sync to the persisted value on mount (the bootstrap script already applied
  // it to <html>, this aligns React state).
  useEffect(() => {
    setCurrentThemeId(readInitialThemeId(config));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const previewTheme = useCallback((id: string) => {
    applyDocumentTheme(getThemeById(id, config.themes).id);
  }, [config.themes]);

  const setTheme = useCallback(
    (id: string) => {
      const resolved = getThemeById(id, config.themes).id;
      applyDocumentTheme(resolved);
      try {
        window.localStorage.setItem(config.storageKey, resolved);
      } catch {
        /* storage unavailable */
      }
      setCurrentThemeId(resolved);
    },
    [config.storageKey, config.themes],
  );

  const value = useMemo<ThemeContextValue>(
    () => ({ config, currentThemeId, setTheme, previewTheme }),
    [config, currentThemeId, setTheme, previewTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a <ThemeProvider>");
  return ctx;
}

// Renders the theme CSS-variable blocks as a <style> tag. Include it once near
// the root so every theme's variables exist; switching only flips data-theme.
export function ThemeStyles({ themes: list }: { themes?: ThemeDefinition[] } = {}) {
  const ctx = useContext(ThemeContext);
  const themeList = list ?? ctx?.config.themes;
  const css = useMemo(() => buildThemeStyles(themeList), [themeList]);
  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}

// Drop-in theme picker (curator-board pattern): a trigger button + an overlay
// dialog with dark/light groups, hover-preview, and ↑↓/↵/esc keyboard nav.
// Styling comes from "@mobayilo/themes/styles.css".
export function ThemeSwitcher({ hint = "[/]" }: { hint?: string } = {}) {
  const { config, currentThemeId, setTheme, previewTheme } = useTheme();
  const list = config.themes;
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);

  const indexOf = useCallback(
    (id: string) => Math.max(0, list.findIndex((t) => t.id === id)),
    [list],
  );

  const grouped = useMemo(
    () => [
      { label: "dark", items: list.filter((t) => t.group === "dark") },
      { label: "light", items: list.filter((t) => t.group === "light") },
    ],
    [list],
  );

  // Open with `/`; arrow/enter/esc handled while open.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) {
        if (e.key === "/" && !/input|textarea/i.test((e.target as HTMLElement)?.tagName ?? "")) {
          e.preventDefault();
          setHighlighted(indexOf(currentThemeId));
          setOpen(true);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        previewTheme(currentThemeId);
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlighted((p) => {
          const n = (p + 1) % list.length;
          previewTheme(list[n].id);
          return n;
        });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlighted((p) => {
          const n = (p - 1 + list.length) % list.length;
          previewTheme(list[n].id);
          return n;
        });
      } else if (e.key === "Enter") {
        e.preventDefault();
        setTheme(list[highlighted].id);
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, highlighted, currentThemeId, list, indexOf, previewTheme, setTheme]);

  function toggle() {
    setHighlighted(indexOf(currentThemeId));
    if (open) previewTheme(currentThemeId);
    setOpen((v) => !v);
  }

  function choose(id: string) {
    setTheme(id);
    setOpen(false);
  }

  const current = getThemeById(currentThemeId, list);

  return (
    <>
      <button type="button" className="theme-trigger" onClick={toggle}>
        <span className="theme-trigger-dot" />
        <span suppressHydrationWarning>{current.label}</span>
        <span className="theme-trigger-hint">{hint}</span>
      </button>

      {open && (
        <div
          className="theme-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Theme switcher"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              previewTheme(currentThemeId);
              setOpen(false);
            }
          }}
        >
          <div className="theme-panel" onMouseLeave={() => previewTheme(currentThemeId)}>
            <div className="theme-panel-header">
              <div className="theme-panel-title">settings</div>
              <div className="theme-panel-tab">theme</div>
            </div>

            <div className="theme-group">
              {grouped.map((group) => (
                <div key={group.label} className="theme-group-block">
                  <div className="theme-separator">
                    <span>{group.label}</span>
                  </div>
                  <div className="theme-options" role="listbox" aria-label={`${group.label} themes`}>
                    {group.items.map((theme) => {
                      const index = indexOf(theme.id);
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          role="option"
                          aria-selected={theme.id === currentThemeId}
                          className="theme-option"
                          data-highlighted={highlighted === index}
                          onMouseEnter={() => {
                            previewTheme(theme.id);
                            setHighlighted(index);
                          }}
                          onClick={() => choose(theme.id)}
                        >
                          <span>{theme.label}</span>
                          {theme.id === currentThemeId ? <span>✓</span> : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="theme-footer">
              <span>↑↓ select</span>
              <span>↵ apply</span>
              <button
                type="button"
                className="theme-close"
                onClick={() => {
                  previewTheme(currentThemeId);
                  setOpen(false);
                }}
              >
                esc close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
