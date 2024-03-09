SELECT
    *,
    CASE
        WHEN x < y + z AND y < x + z AND z < y + x THEN 'Yes'
        ELSE 'No'
    END AS triangle
FROM
    Triangle;
