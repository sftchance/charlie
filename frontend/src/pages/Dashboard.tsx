import { useEffect, useState } from "react";

import { useAccount } from 'wagmi'

import { DisconnectButton } from '../components'
import { getBalances } from '../utils'

import { Balance } from '../types'

const Dashboard = () => {
    const { address } = useAccount()

    const [balances, setBalances] = useState<Balance[]>([]);

    useEffect(() => {
        if (!address) return;

        getBalances(address).then(balances => setBalances(balances.results));
    }, [address])

    console.log('balances', balances);

    return (
        <div className="App">
            <DisconnectButton />

            <h3>Tokens for {address}</h3>

            <ul>
                {balances.map(balance => (
                    <li key={balance.address}>
                        {balance.chainId} | {balance.name} ({balance.symbol}): {balance.balance}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export { Dashboard }