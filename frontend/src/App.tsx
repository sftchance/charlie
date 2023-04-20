import { Routes, Route } from "react-router-dom";

import { WagmiConfig, configureChains, createClient } from "wagmi";
import { avalanche, mainnet, polygon, optimism, arbitrum } from "wagmi/chains";
import { publicProvider } from 'wagmi/providers/public';

import {
    connectorsForWallets,
    RainbowKitProvider,
    DisclaimerComponent,
} from '@rainbow-me/rainbowkit';
import {
    injectedWallet,
    rainbowWallet,
    metaMaskWallet,
    coinbaseWallet,
    walletConnectWallet,
    ledgerWallet,
    trustWallet,
    dawnWallet,
    safeWallet
} from '@rainbow-me/rainbowkit/wallets';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Home, Hosted, Static } from "./pages";

import '@rainbow-me/rainbowkit/styles.css';

import "./App.css";

const queryClient = new QueryClient();

const { chains, provider } = configureChains(
    [mainnet, polygon, avalanche, optimism, arbitrum],
    [publicProvider()],
);

const connectors = connectorsForWallets([
    {
        groupName: "Recommended",
        wallets: [
            metaMaskWallet({ chains, shimDisconnect: true }),
            walletConnectWallet({ chains }),
            rainbowWallet({ chains }),
            coinbaseWallet({ appName: "Charlie", chains }),
        ]
    }, {
        groupName: "Other",
        wallets: [
            injectedWallet({ chains, shimDisconnect: true }),
            ledgerWallet({ chains }),
            trustWallet({ chains }),
            dawnWallet({ chains }),
            safeWallet({ chains }),
        ]
    }
]);

const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider
})

const Disclaimer: DisclaimerComponent = ({ Text, Link }) => (
    <Text>
        By connecting your wallet, you agree to the{' '}
        <Link href="https://termsofservice.xyz">Terms of Service</Link> and
        acknowledge you have read and understand the protocol{' '}
        <Link href="https://disclaimer.xyz">Disclaimer</Link>
    </Text>
);

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <WagmiConfig client={wagmiClient}>
                <RainbowKitProvider
                    appInfo={{
                        appName: "Charlie",
                        disclaimer: Disclaimer,
                    }}
                    modalSize="compact"
                    chains={chains}
                    children={<Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/hosted/*" element={<Hosted />} />
                        <Route path="*" element={<Static />} />
                    </Routes>} />
            </WagmiConfig>
        </QueryClientProvider >
    );
}

export default App;
