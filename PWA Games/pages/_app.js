import Head from 'next/head';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="description" content="Nexus Gaming - The ultimate gaming destination. Play 25+ awesome games right in your browser!" />
        <meta name="theme-color" content="#7c3aed" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Nexus" />
        <meta name="application-name" content="Nexus Gaming" />
        <meta name="msapplication-TileColor" content="#7c3aed" />
        <link rel="icon" href="/app-icon.png.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/app-icon.png.jpeg" />
        <link rel="manifest" href="/manifest.json" />
        <title>Nexus Gaming - Play Awesome Games</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
