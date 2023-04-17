WITH {{chain}}_contracts AS
(
	SELECT  block_timestamp
	       ,contract_name
	       ,contract_address
	       ,event_inputs
	FROM {{chain}}.core.fact_event_logs
	WHERE TOPICS[0] = '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' 
), {{ chain }}_delegates AS (
SELECT  DISTINCT(EVENT_INPUTS:toDelegate) AS "Delegate"
FROM {{ chain }}_contracts
GROUP BY  1 )
SELECT  *
FROM {{chain}}_delegates
GROUP BY  "Delegate"