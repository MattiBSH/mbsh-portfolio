// pages/_app.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/global.css";
import { toggleTheme, langForPath } from "../lib/theme";

// The theme needs no React state: it lives on <html data-theme> and is read
// straight from the DOM, so there is nothing here to get out of sync with the
// server-rendered markup. The lang attribute does need an effect, because the
// language switch is a client-side navigation and <html> is never re-rendered.
function MyApp({ Component, pageProps }) {
  const { pathname } = useRouter();

  useEffect(() => {
    document.documentElement.lang = langForPath(pathname);
  }, [pathname]);

  return <Component {...pageProps} toggleTheme={toggleTheme} />;
}

export default MyApp;
