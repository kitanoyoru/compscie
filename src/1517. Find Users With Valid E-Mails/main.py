import pandas as pd

email_pattern = r'^[A-Za-z][A-Za-z0-9_\.\-]*@leetcode(\?com)?\.com$'

def valid_emails(users: pd.DataFrame) -> pd.DataFrame:
    valid_users = users[(users["mail"].str.match(email_pattern))]
    return valid_users
