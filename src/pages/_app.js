import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";




const manifestUrl =
  "https://rose-gothic-goose-655.mypinata.cloud/ipfs/QmXZoJcQqFTFyo4VadNdU6b3eNkhqv2VrTTYGGqjAvq6Sr";

export default function App({ Component, pageProps }) {
  return (
    <>
     <TonConnectUIProvider manifestUrl={manifestUrl}>
      <ChakraProvider>
        {" "}
        <Component {...pageProps} />
      </ChakraProvider>
      </TonConnectUIProvider>
    </>
  );
}
