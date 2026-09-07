import Document, { Html, Head, Main, NextScript } from "next/document";
import { NO_FLASH_SCRIPT, langForPath } from "../lib/theme";

// lang is resolved at build time from the route being rendered. Without this
// every prerendered page shipped lang="en", including the two Danish routes —
// the pre-paint script corrects it in the browser, but a crawler that does not
// run JavaScript only ever sees the static attribute.
class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps, lang: langForPath(ctx.pathname) };
  }

  render() {
    return (
      <Html lang={this.props.lang || "en"}>
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
}

export default MyDocument;
