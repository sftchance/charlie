import { useEffect, useState } from "react";

import { useAccount, useEnsName } from 'wagmi'

import { DisconnectButton } from '../components'
import { getBalances } from '../utils'

import { Balance } from '../types'

import charlie from "../assets/charlie.svg";

import "./Dashboard.css"

const rightAlign = {
    alignText: 'right'
}

const formatAddress = (address: `0x${string}`) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatBalance = (balance: string) => {
    const number = Number(balance);

    if (number < 1000)
        return number.toFixed(1);
    else if (number < 1000000)
        return `${(number / 1000).toFixed(1)}k`;
    else if (number < 1000000000)
        return `${(number / 1000000).toFixed(1)}m`;
    else if (number < 1000000000000)
        return `${(number / 1000000000).toFixed(1)}b`;
    return `${(number / 1000000000000).toFixed(1)}t`;
}

const Dashboard = () => {
    const { address } = useAccount()
    const { data: ensName } = useEnsName({ address })

    const [balances, setBalances] = useState<Balance[] | null>(null);
    const [selected, setSelected] = useState<Balance[]>([]);

    const hasTokens = balances?.some(balance => balance.balance !== '0.0');

    const toggleAll = () => {
        if (!balances || selected.length === balances.length) {
            setSelected([]);
            return
        }

        setSelected(balances);
    }

    const toggle = (balance: Balance) => {
        if (selected.includes(balance)) {
            setSelected(selected.filter(item => item !== balance));
            return;
        }

        setSelected([...selected, balance]);
    }

    const delegate = () => {
        console.log(selected);
    }

    useEffect(() => {
        if (!address) return;

        getBalances(address).then(balances => setBalances(balances.results));
    }, [address])

    if (!address) return (<div className="App Dashboard container">Loading...</div>)

    return (
        <div className="App container">
            <nav>
                <img src={charlie} alt="Charlie" />
                <DisconnectButton />
            </nav>

            <div className="Dashboard">
                <div className="account">
                    <img src="https://avatars.dicebear.com/api/avataaars/:seed.svg" alt="avatar" />
                    <div>
                        <h3>{ensName || formatAddress(address)}</h3>
                        <p>50% Delegated</p>
                    </div>
                </div>

                <div className="stats">
                    <div>
                        <h3>12</h3>
                        <p>Delegates</p>
                    </div>
                    <div>
                        <h3>0 / $0.00</h3>
                        <p>Delegated</p>
                    </div>
                    <div>
                        <h3>218 / $3.50</h3>
                        <p>Loose</p>
                    </div>
                </div>

                {/* {hasTokens === false && <p>This address does not hold any governance tokens.</p>} */}

                <div className="tokens">
                    {/* Instead of using a list, use a table that has a checkbox to select multiple items at once */}
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox"
                                        checked={selected.length > 0 && selected.length === balances?.length}
                                        onChange={toggleAll}
                                    />
                                </th>
                                <th>Token</th>
                                <th>Delegate</th>
                                <th style={{ textAlign: "right" }}>Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {balances
                                ? balances?.map((balance, i) => (
                                    <tr key={balance.address}>
                                        <td className="checkbox">
                                            <input type="checkbox"
                                                checked={selected.includes(balance)}
                                                onChange={() => toggle(balance)}
                                            />
                                        </td>
                                        <td>{balance.name} ({balance.symbol})</td>
                                        <td>{balance?.delegate ? balance.delegate : '-'}</td>
                                        <td style={{ textAlign: "right" }}>
                                            {balance.delegate ? formatBalance(balance.balance) : '0.0'} / {formatBalance(balance.balance)}
                                        </td>
                                    </tr>
                                )) :
                                <tr>
                                    <td colSpan={4}>Loading...</td>
                                </tr>
                            }
                        </tbody>
                    </table>

                    <button
                        className="delegate"
                        onClick={delegate}
                        disabled={selected.length === 0}
                    >Delegate</button>
                </div>
            </div>
        </div>
    )
}

export { Dashboard }