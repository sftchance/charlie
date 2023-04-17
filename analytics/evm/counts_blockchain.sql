WITH {{chain}}_contracts AS
(
	SELECT  DISTINCT CONTRACT_ADDRESS
	FROM {{chain}}.core.fact_event_logs
	WHERE TOPICS [0] IN ( '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' ) 
)
SELECT  COALESCE(BLOCKCHAIN,'All Blockchains') AS blockchain
       ,COUNT(DISTINCT address)                AS governance_tokens
FROM
(
	SELECT  '{{chain}}'                               AS BLOCKCHAIN
	       ,1                                         AS CHAIN_ID
	       ,address
	       ,REPLACE(REPLACE(symbol,chr(0),''),'$','') AS symbol
	       ,REPLACE(name,chr(0),'')                   AS name
	       ,decimals
	FROM {{chain}}.core.dim_contracts
	WHERE ADDRESS IN ( SELECT * FROM {{chain}}_contracts )
	AND LEN(REPLACE(name, chr(0), '')) > 1
	AND LEN(REPLACE(REPLACE(symbol, '$', ''), chr(0), '')) > 1
	AND decimals IS NOT NULL
	AND decimals <> 0 
)
GROUP BY  ROLLUP (BLOCKCHAIN)