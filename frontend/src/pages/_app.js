import "@/styles/globals.css";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  projectId: "331afab9d25e6a69aedae6619a61faf1",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }) {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setIsReady(!isReady);
  }, []);
  return (
    <>
      {isReady ? (
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            theme={darkTheme({
              accentColor: "black",
              accentColorForeground: "white",
              borderRadius: "large",
              fontStack: "system",
              overlayBlur: "small",
            })}
            coolMode
          >
            <div className="bg-black min-h-screen">
              <Navbar />
              <Component {...pageProps} />
            </div>
          </RainbowKitProvider>
        </WagmiConfig>
      ) : null}
    </>
  );
}
