export const THEME_STORAGE_KEY = "cofrinancas-theme";

export type ThemePref = "light" | "dark" | "system";

export const THEME_PREFS: ThemePref[] = ["light", "dark", "system"];

export function isThemePref(v: unknown): v is ThemePref {
  return v === "light" || v === "dark" || v === "system";
}

export function resolveTheme(pref: ThemePref, systemDark: boolean): "light" | "dark" {
  if (pref === "system") return systemDark ? "dark" : "light";
  return pref;
}

/** Aplica o tema no <html>. Só client-side. */
export function applyTheme(pref: ThemePref) {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.setAttribute("data-theme", resolveTheme(pref, systemDark));
}
