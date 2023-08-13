import pandas as pd


def calculate_special_bonus(employees: pd.DataFrame) -> pd.DataFrame:
    employees["bonus"] = 0
    employees.loc[(employees["employee_id"] % 2 == 1) & (~employees["name"].str.startswith("M")), "bonus"] = employees["salary"]

    result = employees[["employee_id", "bonus"]].sort_values(by="employee_id", ascending=True)

    return result
