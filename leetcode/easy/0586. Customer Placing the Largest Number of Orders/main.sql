/* Solved by @kitanoyoru */
/* https://leetcode.com/problems/customer-placing-the-largest-number-of-orders/ */

SELECT
  customer_number
FROM
  (
    SELECT
      customer_number,
      COUNT(customer_number) as orders
    FROM
      Orders
    GROUP BY
      customer_number
  ) AS sub
ORDER BY orders DESC
LIMIT 1;
