WITH arbitrum AS
(
	SELECT  dayofweek(block_timestamp)                 AS day_of_week
	       ,HOUR(block_timestamp)                      AS hour_of_day
	       ,COUNT(tx_hash)                             AS tx_count
	       ,count (DISTINCT(event_inputs:delegator))   AS Delegator_count
	       ,count (DISTINCT (event_inputs:toDelegate)) AS Delegatee_count
	FROM arbitrum.core.fact_event_logs
	WHERE contract_address LIKE lower('0x912CE59144191C1204E64559FE8253a0e49E6548')
	AND TX_STATUS = 'SUCCESS'
	AND event_name = 'DelegateChanged'
	AND block_timestamp > current_date() - 12
	GROUP BY  1
	         ,2
), avalanche AS
(
	SELECT  dayofweek(block_timestamp)                 AS day_of_week
	       ,HOUR(block_timestamp)                      AS hour_of_day
	       ,COUNT(tx_hash)                             AS tx_count
	       ,count (DISTINCT(event_inputs:delegator))   AS Delegator_count
	       ,count (DISTINCT (event_inputs:toDelegate)) AS Delegatee_count
	FROM avalanche.core.fact_event_logs
	WHERE contract_address LIKE lower('0x912CE59144191C1204E64559FE8253a0e49E6548')
	AND TX_STATUS = 'SUCCESS'
	AND event_name = 'DelegateChanged'
	AND block_timestamp > current_date() - 12
	GROUP BY  1
	         ,2
), ethereum AS
(
	SELECT  dayofweek(block_timestamp)                 AS day_of_week
	       ,HOUR(block_timestamp)                      AS hour_of_day
	       ,COUNT(tx_hash)                             AS tx_count
	       ,count (DISTINCT(event_inputs:delegator))   AS Delegator_count
	       ,count (DISTINCT (event_inputs:toDelegate)) AS Delegatee_count
	FROM ethereum.core.fact_event_logs
	WHERE contract_address LIKE lower('0x912CE59144191C1204E64559FE8253a0e49E6548')
	AND TX_STATUS = 'SUCCESS'
	AND event_name = 'DelegateChanged'
	AND block_timestamp > current_date() - 12
	GROUP BY  1
	         ,2
), optimism AS
(
	SELECT  dayofweek(block_timestamp)                 AS day_of_week
	       ,HOUR(block_timestamp)                      AS hour_of_day
	       ,COUNT(tx_hash)                             AS tx_count
	       ,count (DISTINCT(event_inputs:delegator))   AS Delegator_count
	       ,count (DISTINCT (event_inputs:toDelegate)) AS Delegatee_count
	FROM optimism.core.fact_event_logs
	WHERE contract_address LIKE lower('0x912CE59144191C1204E64559FE8253a0e49E6548')
	AND TX_STATUS = 'SUCCESS'
	AND event_name = 'DelegateChanged'
	AND block_timestamp > current_date() - 12
	GROUP BY  1
	         ,2
), polygon AS
(
	SELECT  dayofweek(block_timestamp)                 AS day_of_week
	       ,HOUR(block_timestamp)                      AS hour_of_day
	       ,COUNT(tx_hash)                             AS tx_count
	       ,count (DISTINCT(event_inputs:delegator))   AS Delegator_count
	       ,count (DISTINCT (event_inputs:toDelegate)) AS Delegatee_count
	FROM polygon.core.fact_event_logs
	WHERE contract_address LIKE lower('0x912CE59144191C1204E64559FE8253a0e49E6548')
	AND TX_STATUS = 'SUCCESS'
	AND event_name = 'DelegateChanged'
	AND block_timestamp > current_date() - 12
	GROUP BY  1
	         ,2
)
SELECT  CASE WHEN day_of_week = 0 THEN '7_Sunday'
             WHEN day_of_week = 1 THEN '6_Monday'
             WHEN day_of_week = 2 THEN '5_Tuesday'
             WHEN day_of_week = 3 THEN '4_Wednesday'
             WHEN day_of_week = 4 THEN '3_Thursday'
             WHEN day_of_week = 5 THEN '2_Friday'
             WHEN day_of_week = 6 THEN '1_Saturday' END AS day_of_week
       ,hour_of_day
       ,(tx_count)/60                                   AS "Delegation per minute on hour of day (UTC)"
       ,(Delegator_count)/60/60                         AS "Delegator per minute on hour of day (UTC)"
       ,(Delegatee_count)/60/60                         AS "Delegatee per minute on hour of day (UTC)"
FROM
(
	SELECT  *
	FROM arbitrum
	UNION ALL
	SELECT  *
	FROM polygon
	UNION ALL
	SELECT  *
	FROM avalanche
	UNION ALL
	SELECT  *
	FROM ethereum
	UNION ALL
	SELECT  *
	FROM optimism
) AS t
ORDER BY 1, 2