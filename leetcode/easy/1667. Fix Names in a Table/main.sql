/* Solved by @kitanoyoru */
/* https://leetcode.com/problems/fix-names-in-a-table/ */

SELECT
  user_id,
  CONCAT(UPPER_SUBSTRING(name, 1, 1), LOWER_SUBSTRING(name, 2)) AS name
FROM
  Users
ORDER BY
  user_id;
