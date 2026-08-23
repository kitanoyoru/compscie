SELECT
    e1.name AS Employee
FROM
    Employee AS e1
LEFT JOIN Employee AS e2 ON e1.managerID = e2.id
WHERE e1.salary > e2.salary;
