/* Solved by @kitanoyoru */
/* https://leetcode.com/problems/the-latest-login-in-2020/ */

SELECT
  user_id,
  last_tamp
FROM (
  SELECT
    user_id,
    time_stamp,
    RANK() OVER (PARTITION BY user_id ORDER BY time_stamp DESC) as rnk
  FROM
    Logins
  WHERE
    YEAR(time_stamp) = 2020
) AS sub
WHERE
  rnk = 1;
