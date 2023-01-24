import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

import { getBalances } from '../utils'
import { Balance } from '../types'

import "./Dashboard.css"

const formatAddress = (address: `0x${string}`) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const formatBalance = (balance: string) => {
    const number = Number(balance);

    const sigFigs = `${number.toFixed(18)}`.split('.')[1];
    const fixed = 1 + sigFigs?.split('').findIndex(char => char !== '0') || 0;

    if (number < 1000)
        return number.toFixed(fixed);
    else if (number < 1000000)
        return `${(number / 1000).toFixed(1)}k`;
    else if (number < 1000000000)
        return `${(number / 1000000).toFixed(1)}m`;
    else if (number < 1000000000000)
        return `${(number / 1000000000).toFixed(1)}b`;
    return `${(number / 1000000000000).toFixed(1)}t`;
}

const Dashboard = () => {
    const { address: paramAddress } = useParams<{ address: `0x${string}` }>();
    const { address: connectedAddress } = useAccount()

    if (paramAddress && paramAddress === connectedAddress) window.location.href = '/account';

    const address = paramAddress || connectedAddress;

    const { data: ensName } = useEnsName({ address })
    const { data: avatar } = useEnsAvatar({ address })

    const [balances, setBalances] = useState<Balance[] | null>(null);
    const [selected, setSelected] = useState<Balance[]>([]);

    const avatarURL = avatar || "https://via.placeholder.com/150";

    const percentDelegated = balances?.reduce((acc, balance) => {
        if (balance.balance === '0.0') return acc;

        return 0;
    }, 0) || 0;

    const copy = () => {
        if (!address) return;

        navigator.clipboard.writeText(address);
    }

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
            <div className="Dashboard">
                <div className="account">
                    <div className="avatar">
                        <img src={avatarURL} alt={`Avatar for ${ensName || formatAddress(address)}`} />
                        <img src={avatar || "https://via.placeholder.com/150"} alt={`Background avatar blur for ${ensName || formatAddress(address)}`} className="blur" />
                    </div>
                    <div>
                        <h3>
                            <button className="link" onClick={copy}>{ensName || formatAddress(address)}</button>
                        </h3>
                        <p>{percentDelegated}% Delegated</p>
                    </div>
                </div>

                <div className="stats">
                    <div>
                        <h3>12</h3>
                        <p>Delegates</p>
                    </div>
                    <div>
                        <h3>$0.00</h3>
                        <p>Delegated</p>
                    </div>
                    <div>
                        <h3>$3.50</h3>
                        <p>Loose</p>
                    </div>
                </div>

                <div className="tokens">
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
                                ? balances.length > 0 ? balances?.map((balance, i) => (
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
                                            {formatBalance(balance.balance)}
                                        </td>
                                    </tr>
                                )) :
                                    <tr>
                                        <td className="none">No tokens found.</td>
                                    </tr> :
                                <tr>
                                    <td colSpan={4}>Loading...</td>
                                </tr>
                            }
                        </tbody>
                    </table>

                    <div className="controls">
                        {<p>{selected.length} selected</p>}

                        <button
                            className="primary delegate"
                            onClick={delegate}
                            disabled={selected.length === 0}
                        ><span className="content">Delegate</span></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { Dashboard }