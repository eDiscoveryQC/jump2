// pages/_document.tsx

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps> {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);

      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html lang="en" className="no-js">
        <Head>
          {/* Preconnect and preload Google Fonts */}
          <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&display=swap"
            rel="stylesheet"
          />

          {/* Meta for PWA, SEO, icons */}
          <meta name="theme-color" content="#0a3d62" />
          <meta name="description" content="Jump2 - Share content with precision." />
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Jump2" />
          <meta property="og:description" content="Create smart deep links to exact parts of articles or videos." />
          <meta property="og:url" content="https://jump2.app" />
          <meta property="og:image" content="/jump2-og-image.png" />
        </Head>
        <body>
          <Main />
          <NextScript />
          {/* Analytics or tag scripts can go here */}
        </body>
      </Html>
    );
  }
}
