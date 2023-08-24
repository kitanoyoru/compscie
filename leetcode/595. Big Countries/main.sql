SELECT
    w.name,
    w.population,
    w.area
FROM
    World AS w
WHERE
    w.population >= 25000000
        OR
    w.area >= 3000000;

