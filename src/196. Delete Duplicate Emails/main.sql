/* Solved by @kitanoyoru */
/* https://leetcode.com/problems/delete-duplicate-emails/ */

DELETE 
  p1
FROM Person AS p1
  INNER JOIN Person as p2
  ON p1.email = p2.email
WHERE p1.id > p2.id;
