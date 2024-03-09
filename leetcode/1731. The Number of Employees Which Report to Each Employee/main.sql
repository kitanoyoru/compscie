WITH employee_info AS (
    SELECT
        reports_to, COUNT(*) AS reports_count, ROUND(AVG(age)) AS average_age
    FROM
        Employees
    WHERE
        reports_to IS NOT NULL
    GROUP BY
        reports_to
)
SELECT
    m.employee_id, m.name, ei.reports_count, ei.average_age
FROM
    Employees AS m
INNER JOIN employee_info AS ei ON m.employee_id = ei.reports_to;
