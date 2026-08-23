/* Solved by @kitanoyoru */
/* https://leetcode.com/problems/sales-person/ */

SELECT
  s.name
FROM
  SalesPerson AS s
WHERE
  s.sales_id NOT IN (
    SELECT
      s.sales_id
    FROM
      Orders AS o
        INNER JOIN
      SalesPerson AS s ON o.sales_id = s.sales_id
        INNER JOIN
      Company AS c ON o.com_id = c.com_id
    WHERE
      c.name = 'RED'
);
 
