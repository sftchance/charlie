WITH {{chain}}_contracts AS
(
	SELECT  BLOCK_TIMESTAMP
	       ,CONTRACT_NAME
	       ,CONTRACT_ADDRESS
	       ,EVENT_INPUTS
	FROM {{chain}}.core.fact_event_logs
	WHERE TOPICS[0] = '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' 
), {{ chain }}_delegates AS (
SELECT  DISTINCT (EVENT_INPUTS:delegator) AS "Delegator"
FROM {{ chain }}_contracts
WHERE EVENT_INPUTS:toDelegate <> ORIGIN_FROM_ADDRESS
GROUP BY  1 )
SELECT  *
FROM {{chain}}_delegates
GROUP BY  "Delegator"