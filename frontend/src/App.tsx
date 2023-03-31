import { Routes, Route } from "react-router-dom";

import { Navbar, Footer } from "./components";
import { Home, Button, ButtonForm, Account, Discover } from "./pages";

import { WagmiConfig, configureChains, createClient } from "wagmi";
import { avalanche, mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { publicProvider } from 'wagmi/providers/public';

import { getDefaultWallets } from '@rainbow-me/rainbowkit';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";

const queryClient = new QueryClient();

const { chains, provider } = configureChains(
    [mainnet, polygon, avalanche, optimism, arbitrum],
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
                <div className="App">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/button/new/" element={<ButtonForm />} />
                        <Route path="/button/:buttonId/" element={<Button />} />
                        <Route path="/button/:buttonId/edit/" element={<ButtonForm isEdit={true} />} />
                        <Route path="/discover" element={<Discover />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/account/:address" element={<Account />} />
                    </Routes>
                </div>
            </WagmiConfig>
        </QueryClientProvider>
    );
}

export default App;
