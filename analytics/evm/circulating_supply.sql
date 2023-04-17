WITH contracts AS
(
	SELECT  DISTINCT CONTRACT_ADDRESS
	FROM {{chain}}.core.fact_event_logs
	WHERE TOPICS[0] IN ('0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f') 
), mints AS
(
	SELECT  contracts.CONTRACT_ADDRESS
	       ,SUM(ez_token_transfers.RAW_AMOUNT / POWER(10,ez_token_transfers.DECIMALS)) AS minted
	FROM {{chain}}.core.ez_token_transfers AS ez_token_transfers
	INNER JOIN contracts
	ON ez_token_transfers.CONTRACT_ADDRESS = contracts.CONTRACT_ADDRESS
	WHERE ez_token_transfers.FROM_ADDRESS = lower('0x0000000000000000000000000000000000000000')
	GROUP BY  contracts.CONTRACT_ADDRESS
), burns AS
(
	SELECT  contracts.CONTRACT_ADDRESS
	       ,SUM(ez_token_transfers.RAW_AMOUNT / POWER(10,ez_token_transfers.DECIMALS)) AS burned
	FROM {{chain}}.core.ez_token_transfers AS ez_token_transfers
	INNER JOIN contracts
	ON ez_token_transfers.CONTRACT_ADDRESS = contracts.CONTRACT_ADDRESS
	WHERE ez_token_transfers.TO_ADDRESS = lower('0x0000000000000000000000000000000000000000')
	GROUP BY  contracts.CONTRACT_ADDRESS
), supply AS
(
	SELECT  mints.CONTRACT_ADDRESS
	       ,(IFNULL(minted,0) - IFNULL(burned,0)) AS total_supply
	FROM mints
	LEFT JOIN burns
	ON mints.CONTRACT_ADDRESS = burns.CONTRACT_ADDRESS
), prices AS
(
	SELECT  TOKEN_ADDRESS AS CONTRACT_ADDRESS
	       ,PRICE
	       ,HOUR
	FROM
	(
		SELECT  TOKEN_ADDRESS
		       ,PRICE
		       ,HOUR
		       ,RANK() OVER (PARTITION BY TOKEN_ADDRESS ORDER BY HOUR DESC) AS rank
		FROM {{chain}}.core.fact_hourly_token_prices
	) AS ranked_prices
	WHERE rank = 1
	AND TOKEN_ADDRESS IN ( SELECT CONTRACT_ADDRESS FROM contracts ) 
), mcap AS
(
	SELECT  supply.CONTRACT_ADDRESS
	       ,supply.total_supply
	       ,prices.PRICE
	       ,supply.total_supply * prices.price AS "Market Cap"
	       ,prices.HOUR
	FROM supply
	INNER JOIN prices
	ON supply.CONTRACT_ADDRESS = prices.CONTRACT_ADDRESS
	WHERE supply.total_supply > 0
	ORDER BY "Market Cap" 
), total_market_cap AS
(
	SELECT  NULL              AS CONTRACT_ADDRESS
	       ,NULL              AS total_supply
	       ,NULL              AS PRICE
	       ,SUM("Market Cap") AS "Market Cap"
	       ,NULL              AS HOUR
	FROM mcap
)
SELECT  *
FROM mcap
UNION ALL
SELECT  *
FROM total_market_cap
ORDER BY "Market Cap" DESC;