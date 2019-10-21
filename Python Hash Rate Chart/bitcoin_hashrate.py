import pandas as pd
from datetime import datetime, timedelta
from matplotlib import pyplot as plt
from matplotlib import dates as mpl_dates

plt.style.use('fivethirtyeight')

data = pd.read_csv(
    '/Users/iMac/Projects/u3179194_11069_Project2_Visualisation/Python Hash Rate Chart/hash-rate.csv')

data['Date'] = pd.to_datetime(data['Date'])
data.sort_values('Date', inplace=True)

date = data['Date']
hashrate = data['Hashrate']

plt.plot_date(date, hashrate, linestyle='solid', linewidth=1, markersize=.5)

plt.gcf().autofmt_xdate()


plt.title('Bitcoin Hashrate')
# plt.xlabel('Date')
plt.ylabel('Hashrate (h/s)')

plt.tight_layout()

plt.show()

plt.savefig('fig1.png')
plt.savefig('fig1.svg')
