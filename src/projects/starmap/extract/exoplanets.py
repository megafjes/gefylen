import pandas as pd

innafor = 100 / 3.262

exoplanets = pd.read_csv("src\challenge\\1\phl_exoplanet_catalog.csv")
exoplanets = exoplanets[["S_NAME", "P_HABITABLE", "S_DISTANCE", "S_ALT_NAMES", "P_STATUS"]]
exoplanets = exoplanets.loc[(exoplanets["P_HABITABLE"] > 0) & (exoplanets["S_DISTANCE"] < innafor)]

stars = pd.read_csv("src\challenge\\1\hygdata_v3.csv")
stars = stars[["id", "proper", "dist", "absmag", "ci", "rarad", "decrad"]]
stars = stars.loc[stars["dist"] < innafor]
stars = stars.rename(columns={"id":"ID"}).astype({"ID":"int32"})

cleaned = pd.read_csv("src\challenge\\1\cleaned.csv").astype({"ID":"int32"})
cleaned = cleaned[["ID", "S_NAME", "H_1", "H_2"]]

data = stars.merge(cleaned, how="outer", on="ID")


data.to_csv("src\challenge\\1\out.csv")
print(data)