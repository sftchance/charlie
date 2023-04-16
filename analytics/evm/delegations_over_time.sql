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
), arbitrum_contracts AS
(
	SELECT  block_timestamp
	       ,contract_name
	       ,contract_address
	       ,event_inputs
	FROM arbitrum.core.fact_event_logs
	WHERE current_date::Date - block_timestamp::Date < '{{historic_duration}}'
	AND TOPICS[0] = '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' 
), arbitrum_actions AS
(
	SELECT  'arbitrum'                                  AS blockchain
	       ,42161                                       AS chain_id
	       ,block_timestamp::Date                       AS day
	       ,contract_name
	       ,contract_address
	       ,COUNT(DISTINCT event_inputs:"delegator")    AS unique_delegators
	       ,COUNT(DISTINCT event_inputs:"fromDelegate") AS unique_fromDelegate
	       ,COUNT(DISTINCT event_inputs:"toDelegate")   AS unique_toDelegate
	       ,unique_delegators/unique_toDelegate         AS delegation_concentration
	       ,unique_toDelegate/unique_fromDelegate       AS delegation_change_concentration
	       ,unique_toDelegate-unique_fromDelegate       AS delegate_change
	FROM arbitrum_contracts
	GROUP BY  1
	         ,2
	         ,3
	         ,4
	         ,5
), arbitrum_delegators AS
(
	SELECT  COALESCE(dim_contracts.symbol,dim_contracts.name,contract_address) AS token
	       ,arbitrum_actions.*
	FROM arbitrum_actions
	LEFT JOIN arbitrum.core.dim_contracts
	ON arbitrum_actions.contract_address = dim_contracts.address
), ethereum_contracts AS
(
	SELECT  block_timestamp
	       ,contract_name
	       ,contract_address
	       ,event_inputs
	FROM ethereum.core.fact_event_logs
	WHERE current_date::Date - block_timestamp::Date < '{{historic_duration}}'
	AND TOPICS[0] = '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' 
), ethereum_actions AS
(
	SELECT  'eth'                                       AS blockchain
	       ,1                                           AS chain_id
	       ,block_timestamp::Date                       AS day
	       ,contract_name
	       ,contract_address
	       ,COUNT(DISTINCT event_inputs:"delegator")    AS unique_delegators
	       ,COUNT(DISTINCT event_inputs:"fromDelegate") AS unique_fromDelegate
	       ,COUNT(DISTINCT event_inputs:"toDelegate")   AS unique_toDelegate
	       ,unique_delegators/unique_toDelegate         AS delegation_concentration
	       ,unique_toDelegate/unique_fromDelegate       AS delegation_change_concentration
	       ,unique_toDelegate-unique_fromDelegate       AS delegate_change
	FROM ethereum_contracts
	GROUP BY  1
	         ,2
	         ,3
	         ,4
	         ,5
), ethereum_delegators AS
(
	SELECT  COALESCE(dim_contracts.symbol,dim_contracts.name,contract_address) AS token
	       ,ethereum_actions.*
	FROM ethereum_actions
	LEFT JOIN ethereum.core.dim_contracts
	ON ethereum_actions.contract_address = dim_contracts.address
), avalanche_contracts AS
(
	SELECT  block_timestamp
	       ,contract_name
	       ,contract_address
	       ,event_inputs
	FROM avalanche.core.fact_event_logs
	WHERE current_date::Date - block_timestamp::Date < '{{historic_duration}}'
	AND TOPICS[0] = '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' 
), avalanche_actions AS
(
	SELECT  'avalanche'                                 AS blockchain
	       ,42161                                       AS chain_id
	       ,block_timestamp::Date                       AS day
	       ,contract_name
	       ,contract_address
	       ,COUNT(DISTINCT event_inputs:"delegator")    AS unique_delegators
	       ,COUNT(DISTINCT event_inputs:"fromDelegate") AS unique_fromDelegate
	       ,COUNT(DISTINCT event_inputs:"toDelegate")   AS unique_toDelegate
	       ,unique_delegators/unique_toDelegate         AS delegation_concentration
	       ,unique_toDelegate/unique_fromDelegate       AS delegation_change_concentration
	       ,unique_toDelegate-unique_fromDelegate       AS delegate_change
	FROM avalanche_contracts
	GROUP BY  1
	         ,2
	         ,3
	         ,4
	         ,5
), avalanche_delegators AS
(
	SELECT  COALESCE(dim_contracts.symbol,dim_contracts.name,contract_address) AS token
	       ,avalanche_actions.*
	FROM avalanche_actions
	LEFT JOIN avalanche.core.dim_contracts
	ON avalanche_actions.contract_address = dim_contracts.address
), optimism_contracts AS
(
	SELECT  block_timestamp
	       ,contract_name
	       ,contract_address
	       ,event_inputs
	FROM optimism.core.fact_event_logs
	WHERE current_date::Date - block_timestamp::Date < '{{historic_duration}}'
	AND TOPICS[0] = '0x3134e8a2e6d97e929a7e54011ea5485d7d196dd5f0ba4d4ef95803e8e3fc257f' 
), optimism_actions AS
(
	SELECT  'optimism'                                  AS blockchain
	       ,10                                          AS chain_id
	       ,block_timestamp::Date                       AS day
	       ,contract_name
	       ,contract_address
	       ,COUNT(DISTINCT event_inputs:"delegator")    AS unique_delegators
	       ,COUNT(DISTINCT event_inputs:"fromDelegate") AS unique_fromDelegate
	       ,COUNT(DISTINCT event_inputs:"toDelegate")   AS unique_toDelegate
	       ,unique_delegators/unique_toDelegate         AS delegation_concentration
	       ,unique_toDelegate/unique_fromDelegate       AS delegation_change_concentration
	       ,unique_toDelegate-unique_fromDelegate       AS delegate_change
	FROM optimism_contracts
	GROUP BY  1
	         ,2
	         ,3
	         ,4
	         ,5
), optimism_delegators AS
(
	SELECT  COALESCE(dim_contracts.symbol,dim_contracts.name,contract_address) AS token
	       ,optimism_actions.*
	FROM optimism_actions
	LEFT JOIN optimism.core.dim_contracts
	ON optimism_actions.contract_address = dim_contracts.address
)
SELECT  *
FROM
(
	SELECT  *
	FROM polygon_delegators
	UNION ALL
	SELECT  *
	FROM arbitrum_delegators
	UNION ALL
	SELECT  *
	FROM ethereum_delegators
	UNION ALL
	SELECT  *
	FROM avalanche_delegators
	UNION ALL
	SELECT  *
	FROM optimism_delegators
) AS combined_delegators
ORDER BY 1 DESC