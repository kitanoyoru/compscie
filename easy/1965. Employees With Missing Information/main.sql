/* Solved by @kitanoyoru */
/* 1965. Employees With Missing Information */

SELECT
  e.employee_id
FROM
  Employees as e
WHERE
  e.employee_id NOT IN (
    SELECT 
      s.employee_id
    FROM 
      Salaries AS s
  )

UNION ALL

SELECT
  s.employee_id
FROM
  Salaries AS s
WHERE
  s.employee_id NOT IN (
    SELECT 
      e.employee_id
    FROM 
      Employees AS e
  )
ORDER BY
  employee_id;
