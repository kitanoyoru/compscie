WITH top_in_department_by_salary AS (
    SELECT
        d.name AS Department,
        e.name AS Employee,
        e.salary AS Salary,
        DENSE_RANK() OVER (PARTITION BY d.name ORDER BY Salary DESC) AS rnk
    FROM
        Employee AS e
    LEFT JOIN Department AS d ON e.departmentId = d.id
)
SELECT
    Department, Employee, Salary
FROM
    top_in_department_by_salary
WHERE
    rnk <= 3;
