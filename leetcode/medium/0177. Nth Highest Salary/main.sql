CREATE FUNCTION getNthHighestSalary(N INT) RETURNS INT -- noqa: CP03
BEGIN
  SET N = N - 1;
  RETURN (
    SELECT DISTINCT
      (salary)
    FROM
      Employee

    ORDER BY
      salary
      DESC

    LIMIT
      1
      OFFSET N
  );
END
