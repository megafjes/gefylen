import pandas as pd

data = pd.read_csv("src/challenge/1/extract/finalselection.csv")

data['ly'] = data['dist']*3.262

data = data[['proper', 'ly', 'rad', 'absmag', 'ci', 'H_1', 'H_2']]

data.to_json("src\challenge\\1\data.json", orient='records')