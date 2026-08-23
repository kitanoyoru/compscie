SELECT
    e.name, b.bonus
FROM
    Employee AS e
LEFT JOIN Bonus AS b ON b.empId = e.empId 
WHERE b.bonus < 1000 OR b.bonus IS NULL;
