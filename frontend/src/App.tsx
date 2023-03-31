import { Routes, Route } from "react-router-dom";

import { Navbar, Footer } from "./components";
import { Home, Button, ButtonForm, Buttons } from "./pages";

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
                        <Route path="/buttons/" element={<Buttons />} />
                        <Route path="/buttons/new/" element={<ButtonForm />} />
                        <Route path="/buttons/:buttonId/" element={<Button />} />
                        <Route path="/buttons/:buttonId/edit/" element={<ButtonForm isEdit={true} />} />
                    </Routes>
                </div>
            </WagmiConfig>
        </QueryClientProvider>
    );
}

export default App;
