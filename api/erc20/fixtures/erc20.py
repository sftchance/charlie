import django
import json

from shroomdk import ShroomDK

from django.conf import settings

from erc20.models import ERC20

SHROOM = ShroomDK(settings.SHROOMDK_API_KEY)

DELEGATION_TOPICS = [
    "'0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f'"
]


def network_query(network):
    return f"""
    {network[0]}_contracts AS
        (
            SELECT  DISTINCT CONTRACT_ADDRESS
            FROM {network[0]}.core.fact_event_logs
            WHERE TOPICS[0] IN ({", ".join(DELEGATION_TOPICS)})
        )"""


NETWORK_QUERIES = [network_query(network) for network in ERC20.NETWORKS]


def network_union(network):
    return f"""
    SELECT  '{network[0]}' AS BLOCKCHAIN
           ,{network[1]} AS CHAIN_ID
           ,address
           ,REPLACE(REPLACE(symbol, chr(0), ''), '$', '') AS symbol
           ,REPLACE(name, chr(0), '') AS name
           ,decimals
    FROM {network[0]}.core.dim_contracts 
    WHERE ADDRESS IN ( SELECT * FROM {network[0]}_contracts )
    AND LEN(REPLACE(name, chr(0), '')) > 1
    AND LEN(REPLACE(REPLACE(symbol, '$', ''), chr(0), '')) > 1
    AND decimals IS NOT NULL
    AND decimals <> 0
"""


NETWORK_UNIONS = [network_union(network) for network in ERC20.NETWORKS]

QUERY = f"""
WITH {", ".join(NETWORK_QUERIES)}
SELECT * FROM ({ " UNION ALL ".join(NETWORK_UNIONS) })
"""

FILENAME = "erc20/fixtures/erc20"
TAG = """-- !!! DO NOT EDIT DIRECTLY !!!

-- This query has been auto-generated following established guildelines 
-- by and for Charlie. No one is to make changes to the criteria without 
-- first consulting the Charlie team, no exceptions will be made.

-- Streamlining the processes that governance tokens are managed with, 
-- Charlie aims to bring a more efficient approach to Delegates amassing 
-- social voting power by providing a more effective consumer-framework to delegate.
"""


def load_query():
    with open(f"{FILENAME}.sql", "w") as f:
        f.write(TAG)
        f.write(QUERY)


def delete_table():
    ERC20.objects.all().delete()


def load_fixture():
    data_set = SHROOM.query(QUERY)

    with open(f"{FILENAME}.auto.json", "w") as f:
        fixture = []

        f.write("[\n")

        for i, row in enumerate(data_set.records):
            fixture.append(
                {
                    "ethereum_address": row["address"],
                    "blockchain": row["blockchain"],
                    "chain_id": row["chain_id"],
                    "symbol": row["symbol"],
                    "name": row["name"],
                    "decimals": row["decimals"],
                }
            )

        f.write(", \n".join([json.dumps(item, indent=2) for item in fixture]))
        f.write("]")


def load_db():
    with open(f"{FILENAME}.auto.json", "r") as f:
        with open(f"{FILENAME}.manual.json", "r") as mf:
            with django.db.transaction.atomic():
                fixture = json.load(f) + json.load(mf)

                ERC20.objects.bulk_create(
                    [
                        ERC20(**item)
                        for item in fixture
                        if not ERC20.objects.filter(
                            ethereum_address=item["ethereum_address"],
                            chain_id=item["chain_id"],
                        ).exists()
                    ]
                )
