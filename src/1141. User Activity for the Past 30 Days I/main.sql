/* Solved by @kitanoyoru */
/* https://leetcode.com/problems/user-activity-for-the-past-30-days-i/ */

SELECT
  activity_date AS day,
  COUNT(DISTINCT user_id) AS active_users
FROM
  Activity
GROUP BY
  activity_date
HAVING
  activity_date > date_add('2019-07-27', INTERVAL -30 DAY) 
    AND 
  activity_date <= '2019-07-27';
