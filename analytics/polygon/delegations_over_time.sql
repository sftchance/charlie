WITH polygon_contracts AS
(
	SELECT  block_timestamp
	       ,contract_name
	       ,contract_address
	       ,event_inputs
	FROM polygon.core.fact_event_logs
	WHERE current_date::Date - block_timestamp::Date < '{{historic_duration}}'
	AND TOPICS[0] = '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' 
), polygon_actions AS
(
	SELECT  'polygon'                                   AS blockchain
	       ,137                                         AS chain_id
	       ,block_timestamp::Date                       AS day
	       ,contract_name
	       ,contract_address
	       ,COUNT(DISTINCT event_inputs:"delegator")    AS unique_delegators
	       ,COUNT(DISTINCT event_inputs:"fromDelegate") AS unique_fromDelegate
	       ,COUNT(DISTINCT event_inputs:"toDelegate")   AS unique_toDelegate
	       ,unique_delegators/unique_toDelegate         AS delegation_concentration
	       ,unique_toDelegate/unique_fromDelegate       AS delegation_change_concentration
	       ,unique_toDelegate-unique_fromDelegate       AS delegate_change
	FROM polygon_contracts
	GROUP BY  1
	         ,2
	         ,3
	         ,4
	         ,5
), polygon_delegators AS
(
	SELECT  COALESCE(dim_contracts.symbol,dim_contracts.name,contract_address) AS token
	       ,polygon_actions.*
	FROM polygon_actions
	LEFT JOIN polygon.core.dim_contracts
	ON polygon_actions.contract_address = dim_contracts.address
)
SELECT  *
FROM polygon_delegators