SELECT
    c.class
FROM
    Courses AS c
GROUP BY
    class
HAVING
    COUNT(*) >= 5;
