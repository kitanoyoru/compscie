import pandas as pd


def nth_highest_salary(employee: pd.DataFrame, N: int) -> pd.DataFrame:
    unique_salaries = employee["salary"].drop_duplicates()
    sorted_salaries = unique_salaries.sort_values(ascending=False)

    if len(sorted_salaries) < N:
        return pd.DataFrame({"Nth Highest Salary": [None]})

    result = sorted_salaries.iloc[N - 1]

    return pd.DataFrame({"Nth Highest Salary": [result]})
