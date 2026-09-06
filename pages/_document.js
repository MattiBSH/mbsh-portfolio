import { Html, Head, Main, NextScript } from "next/document";
import { NO_FLASH_SCRIPT } from "../lib/theme";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Must stay in <head> and stay inline: it sets the theme before the
            first paint, which is what prevents a light flash for visitors who
            previously chose dark mode. */}
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
