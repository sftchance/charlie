const formatAddress = (address: `0x${string}` | undefined) => {
    if (!address) return address;

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

export { formatAddress, formatBalance }