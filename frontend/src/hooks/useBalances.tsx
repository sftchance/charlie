const useBalances = (ethereum_address, tokens) => {
    const { isLoading, error, data } = useQuery({
        queryKey: ["balances", ethereum_address, tokens],
        queryFn: () =>
            fetch(
                `http://localhost:8000/balances/${ethereum_address}/${tokens}/`
            ).then((res) => res.json()),
    });

    return { isLoading, error, data };
}