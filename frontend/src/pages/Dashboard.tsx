import { useEffect, useState } from "react";

import { useAccount } from 'wagmi'

import { DisconnectButton } from '../components'
import { getBalances } from '../utils'

import { Balance } from '../types'

const Dashboard = () => {
    const { address } = useAccount()

    const [balances, setBalances] = useState<Balance[] | null>(null);

    // Determine if any tokens have a balance
    const hasTokens = balances?.some(balance => balance.balance !== '0.0');

    useEffect(() => {
        if (!address) return;

        getBalances(address).then(balances => setBalances(balances.results));
    }, [address])

    console.log('balances', balances);

    return (
        <div className="App">
            <DisconnectButton />

            {hasTokens === false && <p>This address does not hold any governance tokens.</p>}

            <hr />

            <ul>
                {balances === null
                    ? <li>Loading balances...</li>
                    : balances.map(balance => (
                        <li key={balance.address}>
                            {balance.chainId} | {balance.name} ({balance.symbol}): {balance.balance}
                        </li>
                    ))}
            </ul>
        </div>
    )
}

export { Dashboard }