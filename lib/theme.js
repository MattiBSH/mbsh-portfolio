// The <html data-theme> attribute is the single source of truth for the theme.
// Because the class names in theme.module.css no longer change with the theme,
// the server and client always render identical markup — which is what lets the
// script below pick the theme before React ever loads.

export const STORAGE_KEY = "darkMode";

// The Danish page needs lang="da" for screen readers and search engines. There
// is only one <html> element for the whole app, so the value is derived from the
// path in two places: the pre-paint script below (first load) and an effect in
// _app.js (client-side navigation between the two languages).
export const DANISH_PATHS = [
  "/danish_index",
  "/danish_personal",
  "/danish_projects",
];

export function langForPath(pathname) {
  return DANISH_PATHS.includes(pathname) ? "da" : "en";
}

// Inlined into the document head by pages/_document.js. It has to be a string
// rather than a real function because it must run before first paint, ahead of
// the React bundle. Keep it small and defensive: localStorage throws in some
// privacy modes, and a failure here would block the page from rendering.
export const NO_FLASH_SCRIPT = `(function(){var d=document.documentElement;d.lang=${JSON.stringify(DANISH_PATHS)}.indexOf(location.pathname)>-1?"da":"en";try{var v=localStorage.getItem(${JSON.stringify(
  STORAGE_KEY
)});d.setAttribute("data-theme",v==="true"?"dark":"light")}catch(e){d.setAttribute("data-theme","light")}})();`;

export function isDark() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

export function toggleTheme() {
  const next = !isDark();
  document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
  try {
    window.localStorage.setItem(STORAGE_KEY, String(next));
  } catch (e) {
    // Ignore write failures; the toggle still works for this session.
  }
  return next;
}
