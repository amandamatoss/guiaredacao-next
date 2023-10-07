import "@mantine/core/styles.css";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { RecoilRoot } from "recoil";
import '@mantine/tiptap/styles.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <RecoilRoot>
        <MantineProvider>
          <Component {...pageProps} />
        </MantineProvider>
      </RecoilRoot>
    </SessionProvider>
  );
}
