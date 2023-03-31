import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi'

import { copy, formatAddress, formatBalance, getBalances } from '../utils'
import { Balance } from '../types'

import "./Account.css"

const tabs = {
    'activity': 'Activity',
    'portfolio': 'Portfolio'
}

const Account = () => {
    const { address: paramAddress } = useParams<{ address: `0x${string}` }>();
    const { address: connectedAddress } = useAccount()

    if (paramAddress && paramAddress === connectedAddress) window.location.href = '/account';

    const address = paramAddress || connectedAddress;

    const { data: ensName } = useEnsName({ address })
    const { data: avatar } = useEnsAvatar({ address })

    const [balances, setBalances] = useState<Balance[] | null>(null);
    const [selected, setSelected] = useState<Balance[]>([]);

    const [delegateAddress, setDelegateAddress] = useState<String | null>(null);

    const [tab, setTab] = useState<'activity' | 'delegate' | 'portfolio'>('portfolio');

    const mine = !paramAddress || paramAddress === connectedAddress;
    const avatarURL = avatar || "https://via.placeholder.com/150";

    const percentDelegated = balances?.reduce((acc, balance) => {
        if (balance.balance === '0.0') return acc;
        return 0;
    }, 0) || 0;

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

    const onDelegateAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDelegateAddress(e.target.value);
    }

    const delegate = () => {
        console.log(selected);
    }

    if (!address) return (<div className="App Account container">Loading...</div>)

    return (
        <div className="App container">
            <div className="Account">
                <div className="content">
                    <div className="account">
                        <div className="avatar">
                            <img src={avatarURL} alt={`Avatar for ${ensName || formatAddress(address)}`} />
                            <img src={avatar || "https://via.placeholder.com/150"} alt={`Background avatar blur for ${ensName || formatAddress(address)}`} className="blur" />
                        </div>
                        <div className="address">
                            <h3>
                                <button className="link" onClick={() => { copy(address) }}>{ensName || formatAddress(address)}</button>
                            </h3>
                            <p>{percentDelegated}% Delegated</p>
                        </div>
                        <div className="actions">
                            {!mine && <button className="primary">
                                <span className="content">Delegate</span>
                            </button>}
                        </div>
                    </div>

                    <div>
                        {/* <div className="tabs">
                            {Object.entries(tabs).map(([key, value]) => (
                                <h4 key={key} className={`${key === tab ? 'active' : ''}`}
                                    onClick={() => { setTab(key as 'activity' | 'delegate' | 'portfolio') }}>
                                    {value}
                                </h4>
                            ))}
                        </div> */}

                        <div
                            className="activity"
                            style={{ display: tab === 'activity' ? 'block' : 'none' }}>
                            <p>No activity found.</p>
                        </div>

                        <div className="delegate"
                            style={{ display: tab === 'delegate' ? 'block' : 'none' }}>
                            <p>No delegate power found.</p>
                        </div>

                        <div className={`tokens ${mine ? 'mine' : ''}`}
                            style={{ display: tab === 'portfolio' ? 'block' : 'none' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>
                                            <input type="checkbox"
                                                checked={selected.length > 0 && selected.length === balances?.length}
                                                onChange={toggleAll}
                                            />
                                        </th>
                                        <th>Chain</th>
                                        <th>Token</th>
                                        <th>Delegate</th>
                                        <th>Balance</th>
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
                                                <td>{balance.chainId}</td>
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
                                {mine && <>
                                    {<p>{selected.length} selected</p>}

                                    <input placeholder="Delegate to" onChange={onDelegateAddressChange} />

                                    <button
                                        className="primary delegate"
                                        onClick={delegate}
                                        disabled={selected.length === 0}
                                    ><span className="content">Delegate</span></button>
                                </>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="sidebar">
                    <div className="card">
                        <div className="card-header">
                            <h4>Information</h4>
                        </div>

                        <div className="card-body">
                            <p>Delegate for:</p>
                            <p>Proposals created:</p>
                            <p>Delegating to:</p>
                        </div>
                    </div>

                    <div className="card">
                        <div className="card-header">
                            <h4>Vote Power</h4>
                        </div>

                        <div className="card-body">
                            <p>0.00</p>
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export { Account }