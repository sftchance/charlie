WITH {{chain}}_contracts AS
(
	SELECT  DISTINCT CONTRACT_ADDRESS
	FROM {{chain}}.core.fact_event_logs
	WHERE TOPICS[0] IN ('0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f') 
), {{chain}}_balances AS (
SELECT  t.CONTRACT_ADDRESS
       ,t.TO_ADDRESS
       ,(
SELECT  SUM(RAW_AMOUNT)
FROM {{chain}}.core.ez_token_transfers
WHERE CONTRACT_ADDRESS = t.CONTRACT_ADDRESS
AND TO_ADDRESS = t.TO_ADDRESS ) AS "In", (
SELECT  COALESCE(SUM(RAW_AMOUNT),0)
FROM {{chain}}.core.ez_token_transfers
WHERE CONTRACT_ADDRESS = t.CONTRACT_ADDRESS
AND FROM_ADDRESS = t.TO_ADDRESS ) AS "Out", ("In" - "Out") AS balance
FROM {{chain}}.core.ez_token_transfers t
JOIN {{chain}}_contracts ec
ON t.CONTRACT_ADDRESS = ec.CONTRACT_ADDRESS
HAVING balance > 0 ORDER BY balance DESC ), {{chain}}_holders AS (
SELECT  ec.CONTRACT_ADDRESS
       ,COUNT(DISTINCT eb.TO_ADDRESS) AS "holders"
FROM {{chain}}_balances eb
JOIN {{chain}}_contracts ec
ON eb.CONTRACT_ADDRESS = ec.CONTRACT_ADDRESS
GROUP BY  ec.CONTRACT_ADDRESS )
         ,{{chain}}_contract_dim AS (
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
AND decimals <> 0 )
SELECT  *
FROM {{chain}}_holders;