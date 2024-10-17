import "@/styles/globals.css";
import { ThemeProvider } from "styled-components";
import { SessionProvider } from "next-auth/react";
import { theme } from "@/theme";

import Layout from "@/components/Layout";

export default function App({ Component, pageProps, session }) {
  return (
    <ThemeProvider theme={theme}>
      <SessionProvider session={session}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </SessionProvider>
    </ThemeProvider>
  );
}
