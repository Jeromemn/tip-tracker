import "@/styles/globals.css";
import { ThemeProvider } from "styled-components";
import { theme } from "@/theme";

import Layout from "@/components/Layout";

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
