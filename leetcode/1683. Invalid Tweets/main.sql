SELECT
    t.tweet_id
FROM
    Tweets as t
WHERE
    LENGTH(t.content) > 15; 

