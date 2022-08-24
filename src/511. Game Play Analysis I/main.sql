/* Solved by @kitanoyoru */
/* https://leetcode.com/problems/game-play-analysis-i/ */

SELECT
  player_id,
  event_date AS first_login
FROM (
  SELECT
    player_id,
    event_date,
    RANK() OVER (PARTITION BY player_id ORDER BY event_date) AS rnk
  FROM
    Activity
) AS sub
WHERE
  rnk = 1;
  
