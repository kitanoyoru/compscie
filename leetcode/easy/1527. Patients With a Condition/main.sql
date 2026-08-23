/* Solved by @kitanoyoru */
/* https://leetcode.com/problems/patients-with-a-condition/ */

SELECT
  *
FROM
  Patients
WHERE
  conditions LIKE 'DIAB1%'
    OR
  conditions LIKE '% DIAB1%';
