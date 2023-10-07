import { Button, Group } from "@mantine/core";
import Navbar from "../components/Navbar.jsx";
import PrimaryContainer from "../components/PrimaryContainer.jsx";
import Head from 'next/head'
import SecondaryContainer from "../components/SecondaryContainer.jsx";
import Divisor from "../components/Divider.jsx";

export default function IndexPage() {
  return (
    <>

      <Head>
        <title>Inicio</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
        <link rel="shortcut icon" href="/favicon.svg" />
      </Head>

      <nav>
        <Navbar />
      </nav>

      <main>
        <PrimaryContainer />
        <Divisor />
        <SecondaryContainer />
      </main>
    </>
  );
}
