WITH ethereum_contracts AS
(
	SELECT  DISTINCT CONTRACT_ADDRESS
	FROM ethereum.core.fact_event_logs
	WHERE TOPICS [0] IN ( '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' ) 
), avalanche_contracts AS
(
	SELECT  DISTINCT CONTRACT_ADDRESS
	FROM avalanche.core.fact_event_logs
	WHERE TOPICS [0] IN ( '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' ) 
), polygon_contracts AS
(
	SELECT  DISTINCT CONTRACT_ADDRESS
	FROM polygon.core.fact_event_logs
	WHERE TOPICS [0] IN ( '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' ) 
), arbitrum_contracts AS
(
	SELECT  DISTINCT CONTRACT_ADDRESS
	FROM arbitrum.core.fact_event_logs
	WHERE TOPICS [0] IN ( '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' ) 
), optimism_contracts AS
(
	SELECT  DISTINCT CONTRACT_ADDRESS
	FROM optimism.core.fact_event_logs
	WHERE TOPICS [0] IN ( '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' ) 
)
SELECT  COALESCE(BLOCKCHAIN,'All Blockchains') AS blockchain
       ,COUNT(DISTINCT address)                AS governance_tokens
FROM
(
	SELECT  'ethereum'                                AS BLOCKCHAIN
	       ,1                                         AS CHAIN_ID
	       ,address
	       ,REPLACE(REPLACE(symbol,chr(0),''),'$','') AS symbol
	       ,REPLACE(name,chr(0),'')                   AS name
	       ,decimals
	FROM ethereum.core.dim_contracts
	WHERE ADDRESS IN ( SELECT * FROM ethereum_contracts )
	AND LEN(REPLACE(name, chr(0), '')) > 1
	AND LEN(REPLACE(REPLACE(symbol, '$', ''), chr(0), '')) > 1
	AND decimals IS NOT NULL
	AND decimals <> 0 
	UNION ALL
	SELECT  'avalanche'                               AS BLOCKCHAIN
	       ,43114                                     AS CHAIN_ID
	       ,address
	       ,REPLACE(REPLACE(symbol,chr(0),''),'$','') AS symbol
	       ,REPLACE(name,chr(0),'')                   AS name
	       ,decimals
	FROM avalanche.core.dim_contracts
	WHERE ADDRESS IN ( SELECT * FROM avalanche_contracts )
	AND LEN(REPLACE(name, chr(0), '')) > 1
	AND LEN(REPLACE(REPLACE(symbol, '$', ''), chr(0), '')) > 1
	AND decimals IS NOT NULL
	AND decimals <> 0 
	UNION ALL
	SELECT  'polygon'                                 AS BLOCKCHAIN
	       ,137                                       AS CHAIN_ID
	       ,address
	       ,REPLACE(REPLACE(symbol,chr(0),''),'$','') AS symbol
	       ,REPLACE(name,chr(0),'')                   AS name
	       ,decimals
	FROM polygon.core.dim_contracts
	WHERE ADDRESS IN ( SELECT * FROM polygon_contracts )
	AND LEN(REPLACE(name, chr(0), '')) > 1
	AND LEN(REPLACE(REPLACE(symbol, '$', ''), chr(0), '')) > 1
	AND decimals IS NOT NULL
	AND decimals <> 0 
	UNION ALL
	SELECT  'arbitrum'                                AS BLOCKCHAIN
	       ,42161                                     AS CHAIN_ID
	       ,address
	       ,REPLACE(REPLACE(symbol,chr(0),''),'$','') AS symbol
	       ,REPLACE(name,chr(0),'')                   AS name
	       ,decimals
	FROM arbitrum.core.dim_contracts
	WHERE ADDRESS IN ( SELECT * FROM arbitrum_contracts )
	AND LEN(REPLACE(name, chr(0), '')) > 1
	AND LEN(REPLACE(REPLACE(symbol, '$', ''), chr(0), '')) > 1
	AND decimals IS NOT NULL
	AND decimals <> 0 
	UNION ALL
	SELECT  'optimism'                                AS BLOCKCHAIN
	       ,10                                        AS CHAIN_ID
	       ,address
	       ,REPLACE(REPLACE(symbol,chr(0),''),'$','') AS symbol
	       ,REPLACE(name,chr(0),'')                   AS name
	       ,decimals
	FROM optimism.core.dim_contracts
	WHERE ADDRESS IN ( SELECT * FROM optimism_contracts )
	AND LEN(REPLACE(name, chr(0), '')) > 1
	AND LEN(REPLACE(REPLACE(symbol, '$', ''), chr(0), '')) > 1
	AND decimals IS NOT NULL
	AND decimals <> 0 
)
GROUP BY  ROLLUP (BLOCKCHAIN)