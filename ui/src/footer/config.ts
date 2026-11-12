export type FooterText = string | { text: string; i18n: string };

export type FooterLogo = { svg: string } | { src: string; alt: FooterText };
export type FooterConfig = {
  variant?: "compact" | "full";
  brand: { name: FooterText; href: string; logo: FooterLogo; description: FooterText };
  copyright: FooterText;
  columns: Array<{ title: FooterText; links: Array<{ label: FooterText; href: string; external?: boolean }> }>;
  social?: Array<{ kind: "facebook" | "linkedin" | "x" | "github" | "instagram"; href: string; label: FooterText }>;
  bottom?: { left?: FooterText; right?: FooterText };
};

export function validateFooterConfig(value: unknown): string[] {
  const errors: string[] = [];
  const obj = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);
  const text = (v: unknown, path: string) => {
    if (typeof v === "string") return;
    if (obj(v) && typeof v.text === "string" && typeof v.i18n === "string" && v.i18n.length > 0) return;
    errors.push(`${path} must be a string or { text: string, i18n: non-empty string }`);
  };
  if (!obj(value)) return ["config must be an object"];
  if (value.variant !== undefined && value.variant !== "compact" && value.variant !== "full") errors.push("variant must be 'compact' or 'full'");
  if (!obj(value.brand)) errors.push("brand must be an object");
  else {
    text(value.brand.name, "brand.name");
    if (typeof value.brand.href !== "string" || !value.brand.href) errors.push("brand.href must be a non-empty string");
    text(value.brand.description, "brand.description");
    if (!obj(value.brand.logo)) errors.push("brand.logo must be an object");
    else if (typeof value.brand.logo.svg === "string") { /* trusted inline SVG */ }
    else {
      if (typeof value.brand.logo.src !== "string" || !value.brand.logo.src) errors.push("brand.logo.src must be a non-empty string");
      text(value.brand.logo.alt, "brand.logo.alt");
    }
  }
  text(value.copyright, "copyright");
  if (!Array.isArray(value.columns)) errors.push("columns must be an array");
  else value.columns.forEach((column, i) => {
    if (!obj(column)) { errors.push(`columns[${i}] must be an object`); return; }
    text(column.title, `columns[${i}].title`);
    if (!Array.isArray(column.links)) errors.push(`columns[${i}].links must be an array`);
    else column.links.forEach((link, j) => {
      const p = `columns[${i}].links[${j}]`;
      if (!obj(link)) { errors.push(`${p} must be an object`); return; }
      text(link.label, `${p}.label`);
      if (typeof link.href !== "string" || !link.href) errors.push(`${p}.href must be a non-empty string`);
      if (link.external !== undefined && typeof link.external !== "boolean") errors.push(`${p}.external must be a boolean`);
    });
  });
  if (value.social !== undefined) {
    const kinds = ["facebook", "linkedin", "x", "github", "instagram"];
    if (!Array.isArray(value.social)) errors.push("social must be an array");
    else value.social.forEach((entry, i) => {
      const p = `social[${i}]`;
      if (!obj(entry)) { errors.push(`${p} must be an object`); return; }
      if (!kinds.includes(String(entry.kind))) errors.push(`${p}.kind must be facebook, linkedin, x, github, or instagram`);
      if (typeof entry.href !== "string" || !entry.href) errors.push(`${p}.href must be a non-empty string`);
      text(entry.label, `${p}.label`);
    });
  }
  if (value.bottom !== undefined) {
    if (!obj(value.bottom)) errors.push("bottom must be an object");
    else {
      if (value.bottom.left !== undefined) text(value.bottom.left, "bottom.left");
      if (value.bottom.right !== undefined) text(value.bottom.right, "bottom.right");
    }
  }
  return errors;
}

export function assertFooterConfig(value: unknown): asserts value is FooterConfig {
  const errors = validateFooterConfig(value);
  if (errors.length) throw new Error(`Invalid footer config:\n${errors.map((error) => `- ${error}`).join("\n")}`);
}
