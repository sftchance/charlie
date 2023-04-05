import { Routes, Route } from "react-router-dom";

import { WagmiConfig, configureChains, createClient } from "wagmi";
import { avalanche, mainnet, polygon, optimism, arbitrum, optimismGoerli } from "wagmi/chains";
import { publicProvider } from 'wagmi/providers/public';
import { alchemyProvider } from 'wagmi/providers/alchemy';

import { getDefaultWallets } from '@rainbow-me/rainbowkit';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Hosted, Static } from "./pages";

import "./App.css";

const queryClient = new QueryClient();

const { chains, provider } = configureChains(
    [mainnet, polygon, avalanche, optimism, arbitrum, optimismGoerli],
    [publicProvider()],
);

const { connectors } = getDefaultWallets({
    appName: 'Charlie',
    chains
});

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiConfig client={wagmiClient}>
                <Routes>
                    <Route path="/hosted/*" element={<Hosted />} />
                    <Route path="*" element={<Static />} />
                </Routes>
            </WagmiConfig>
        </QueryClientProvider >
    );
}

export default App;
