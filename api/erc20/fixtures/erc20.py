DELEGATION_TOPICS = [
    "'0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f'"
]

NETWORKS = ["ethereum", "avalanche", "optimism", "arbitrum", "polygon"]


def network_query(network):
    return f"""
    {network}_contracts AS
        (
            SELECT  DISTINCT CONTRACT_ADDRESS
            FROM {network}.core.fact_event_logs
            WHERE TOPICS[0] IN ({", ".join(DELEGATION_TOPICS)})
        )"""


NETWORK_QUERIES = [network_query(network) for network in NETWORKS]


def network_union(network):
    return f"""
    SELECT  '{network}' AS BLOCKCHAIN
            ,address
            ,REPLACE(symbol, chr(0), '') AS symbol
            ,REPLACE(name, chr(0), '') AS name
            ,decimals
    FROM {network}.core.dim_contracts 
    WHERE ADDRESS IN ( SELECT * FROM {network}_contracts )
    AND REPLACE(name, chr(0), '') IS NOT NULL
    AND REPLACE(name, chr(0), '') != ''
    AND REPLACE(symbol, chr(0), '') IS NOT NULL
    AND decimals IS NOT NULL
"""


NETWORK_UNIONS = [network_union(network) for network in NETWORKS]

QUERY = f"""
WITH {", ".join(NETWORK_QUERIES)}
SELECT * FROM ({ " UNION ALL ".join(NETWORK_UNIONS) })
"""

FILENAME = "erc20/fixtures/erc20.sql"
TAG = """
-- !!! DO NOT EDIT DIRECTLY !!!

-- This query has been auto-generated following established guildelines 
-- by and for Charlie. No one is to make changes to the criteria without 
-- first consulting the Charlie team, no exceptions will be made.

-- Streamlining the processes that governance tokens are managed with, 
-- Charlie aims to bring a more efficient approach to Delegates amassing 
-- social voting power by providing a more effective consumer-framework to delegate.
"""


def write_query():
    with open(FILENAME, "w") as f:
        f.write(TAG)
        f.write(QUERY)
