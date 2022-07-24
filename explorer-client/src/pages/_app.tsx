import * as React from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
// import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '@/config/theme';
import createEmotionCache from '@/config/createEmotionCache';
import Layout from '@/layout';
import Context from '@/context';
import dynamic from 'next/dynamic'
const DynamicHeader = dynamic<any>(() => import('@mui/material/styles').then(e=>e.ThemeProvider), {
  ssr: false,
})

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <DynamicHeader theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Context>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Context>

      </DynamicHeader>
    </CacheProvider>
  );
}