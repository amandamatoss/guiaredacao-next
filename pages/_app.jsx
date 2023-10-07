import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";


export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
      <MantineProvider>
        <Component {...pageProps} />
      </MantineProvider>
  );
}
