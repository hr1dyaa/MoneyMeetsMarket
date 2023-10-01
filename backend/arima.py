import numpy as np
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import sys

temp=sys.argv[1].split(",")
data=[]
for i in temp:
    data.append(float(i))
stock_prices = data
 # Insert your list of stock prices here

# Create a date range for the index
start_date = '2023-01-01'
end_date = pd.to_datetime(start_date) + pd.DateOffset(days=len(stock_prices) - 1)
index = pd.date_range(start=start_date, end=end_date, freq='D')

# Create a pandas Series with the stock prices and the date index
data = pd.Series(stock_prices, index=index)

# Manually specify ARIMA order (p, d, q)
p = 2  # You can adjust these values
d = 1
q = 4

# Fit the ARIMA model with the specified parameters
model = ARIMA(data, order=(p, d, q))
model_fit = model.fit()

# Make a 7-day forecast
forecast = model_fit.forecast(steps=7)

# Print only the predicted stock prices for the next 7 days
for value in forecast:
    print(f"{value:.2f}")