import pandas as pd


def big_countries(world: pd.DataFrame) -> pd.DataFrame:
    filtered = world[(world["area"] >= 3000000) | (world["population"] >= 25000000)]
    result = filtered[["name", "population", "area"]]
    return result
