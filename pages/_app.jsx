import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from "recoil";
import '@mantine/tiptap/styles.css';
import '../styles/global.css'

export default function App({
  Component,
  pageProps: { session, ...pageProps }
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
