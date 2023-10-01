import numpy as np
import pandas as pd
import warnings
import json
from statsmodels.tsa.arima.model import ARIMA
warnings.filterwarnings("ignore")
f = open('./data.json')
data=json.load(f)

p = 2
d = 1  
q = 3
predictions = {}


for company, prices in data.items():
    model = ARIMA(prices, order=(p, d, q))
    model_fit = model.fit()
    forecast = model_fit.forecast(steps=1)
    next_day_forecast = forecast[0]
    predictions[company] = next_day_forecast


best_company = max(predictions, key=lambda x: predictions[x] - data[x][-1])


expected_profit = predictions[best_company] - data[best_company][-1]


print(f"\nInvesting in {best_company} is expected to yield the most profit with an expected profit of {expected_profit:.2f}")