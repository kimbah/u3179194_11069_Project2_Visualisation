import pandas as pd
from datetime import datetime, timedelta
from matplotlib import pyplot as plt
from matplotlib import dates as mpl_dates

plt.style.use('fivethirtyeight')

data = pd.read_csv(
    '/Users/iMac/Projects/u3179194_11069_Project2_Visualisation/Python Bitcoin300MA/Coinbase_BTCUSD_cleaned_300MA.csv')

data['Date'] = pd.to_datetime(data['Date'])
data.sort_values('Date', inplace=True)

price_date = data['Date']
price_close = data['High']
price_300ma = data['300 MA']

plt.plot_date(price_date, price_close, linestyle='solid',
              linewidth=1, markersize=.2)
plt.plot_date(price_date, price_300ma, linestyle='solid',
              linewidth=1, markersize=.5, color="#6d904f")

plt.xticks(rotation='-70', ha='center')
# horizontal alignment does not seem to work?

plt.gcf().autofmt_xdate()

plt.legend(loc='upper left')

plt.title('Bitcoin Price with 300MA')
# plt.xlabel('Date')
plt.ylabel('Closing Price (USD)')

plt.tight_layout()

plt.show()
