import pandas as pd


def article_views(views: pd.DataFrame) -> pd.DataFrame:
    filtered_data = views[(views["author_id"] == views["viewer_id"])]
    ids = sorted(filtered_data["author_id"].unique())
    result = pd.DataFrame({"id": ids})

    return result
