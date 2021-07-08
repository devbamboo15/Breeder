import { UseWalletProvider }  from "use-wallet";
import Head                   from "next/head";
import { ChakraProvider }     from "@chakra-ui/core";
import Layout                 from "../components/Layout";
import theme                  from "../theme";
import "../styles/globals.css";

const fakeStorageManager = {
  get: () => "dark",
  set: (value) => {},
  type: "cookie",
};

const App = ({ Component, pageProps }) => {
  return (
    <UseWalletProvider
      chainId={1}
      connectors={{
        walletconnect: { rpcUrl: "https://mainnet.eth.aragon.network/" },
      }}
    >
      <div>
        <Head>
          <meta name="msapplication-TileColor" content="#ffffff"/>
          <meta name="msapplication-TileImage" content="%PUBLIC_URL%/ms-icon-144x144.png"/>
          <meta name="theme-color" content="#ffffff"/>
          <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Kuma Breeder"
          />

          <meta property="og:site_name" content="Kuma Breeder" />

          <meta property="og:type" content="website" />

          <meta name="title" content="kumatoken.com" />

          <meta property="og:title" content="kumatoken.com" />

          <meta property="twitter:title" content="kumatoken.com" />

          <meta name="twitter:site" content="@KumaInuOfficial" />

          <meta name="description" content="Lock your funds to Kuma Breeder and generate rewards for your contribution. Kuma Breeder may be a profitable business as long as you know the risks. Please use at your own risk." />

          {/* <meta property="og:description" content="It gives us the potential to grow the economy of the world through modern value transfer systems" /> */}

          <meta property="twitter:description" content="Lock your funds to Kuma Breeder and generate rewards for your contribution. Kuma Breeder may be a profitable business as long as you know the risks. Please use at your own risk." />

          <meta property="og:url" content="https://app.kumatoken.com" />

          <meta property="al:web:url" content="https://app.kumatoken.com" />

          <meta property="og:image" content="https://app.kumatoken.com/images/toplogo.png" />

          <meta name="twitter:image:src" content="https://app.kumatoken.com/images/toplogo.png" />

          <meta name="twitter:card" content="summary_large_image" />

          <meta name="robots" content="noindex,follow,max-image-preview:large" />
          <title>Kuma Breeder</title>
        </Head>
      </div>
      <ChakraProvider theme={theme} colorModeManager={fakeStorageManager}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ChakraProvider>
    </UseWalletProvider>
  )
};

export default App;
