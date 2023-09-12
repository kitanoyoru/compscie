import pandas as pd


def invalid_tweets(tweets: pd.DataFrame) -> pd.DataFrame:
    result = tweets[["tweet_id"]].where(tweets["content"] > 15)
    return result
