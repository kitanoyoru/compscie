import pandas as pd


def department_highest_salary(
    employee: pd.DataFrame, department: pd.DataFrame
) -> pd.DataFrame:
    merged = employee.merge(
        department,
        left_on="departmentId",
        right_on="id",
        suffixes=("_employee", "_department"),
    )

    highest_salaries = merged.groupby("departmentId").apply(
        lambda x: x[x["salary"] == x["salary"].max()]
    )

    result = highest_salaries[["name_department", "name_employee", "salary"]]
    result.columns = ["Department", "Employee", "Salary"]

    return result
