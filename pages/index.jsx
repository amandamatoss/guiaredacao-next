import Navbar from "../components/Navbar.jsx";
import PrimaryContainer from "../components/PrimaryContainer.jsx";
import Head from 'next/head'
import SecondaryContainer from "../components/SecondaryContainer.jsx";
import TercearyContainer from "../components/TercearyContainer.jsx";
import QuartoContainer from "../components/QuartoContainer.jsx";
import Footer from "../components/Footer.jsx"

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
        <SecondaryContainer />
        <TercearyContainer />
        <QuartoContainer />
        <Footer />
      </main>
    </>
  );
}
