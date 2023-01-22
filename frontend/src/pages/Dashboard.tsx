import { useMemo } from "react";

import { useAccount } from 'wagmi'

import { DisconnectButton } from '../components'
import { getBalances } from '../utils'

const Dashboard = () => {
    const { address } = useAccount()

    const balances = useMemo(async () => {
        if (!address) return [];

        return await getBalances(address);
    }, [address])

    return (
        <div className="App">
            <DisconnectButton />

            <h3>Tokens for {address}</h3>

            <ul>
                {/* TODO: Show balances here */}
            </ul>
        </div>
    )
}

export { Dashboard }