import { GoogleAnalytics } from '@reactivers/next-ga';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { preventZoom } from 'utils/functions';
import '../styles/globals.css';

const APP_NAME = 'Snake Game';
const APP_DESCRIPTION = 'A classic snake game';

function MyApp({ Component, pageProps }: AppProps) {

  useEffect(() => {
    preventZoom();
  }, []);

  return (
    <>
      <Head>
        <title>{APP_NAME}</title>
        <meta
          name="viewport"
          content={`user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width, height=device-height, viewport-fit=cover`}
        />
        <meta name="application-name" content={APP_NAME} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={APP_NAME} />
        <meta name="description" content={APP_DESCRIPTION} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
      </Head>
      <Component {...pageProps} />
      <GoogleAnalytics gaId="G-YGDK6V5F4F" />
    </>
  )
}

export default MyApp
