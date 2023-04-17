-- forked from 🔯 // avalanche Delegators over Time @ https://flipsidecrypto.xyz/edit/queries/9f4fafdd-5cd7-4212-b7d1-1272106a2bd1

 WITH avalanche_contracts AS
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
	SELECT  'avalanche'                                  AS blockchain
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
)
SELECT  *
FROM avalanche_delegators 

