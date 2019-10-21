import pandas as pd
from matplotlib import pyplot as plt

plt.style.use("fivethirtyeight")


data = pd.read_csv(
    '/Users/iMac/Projects/u3179194_11069_Project2_Visualisation/Python Market Cap Chart/coin-dance-market-cap-historical.csv')

data['Date'] = pd.to_datetime(data['Label'])
data.sort_values('Date', inplace=True)

marketCap_date = data['Date']
Bitcoin_Market_Cap = data['Bitcoin']
Altcoin_Market_Cap = data['Altcoins']

labels = ['Altcoins', 'Bitcoin']
colors = ['#e5ae37', '#6d904f']

plt.stackplot(marketCap_date, Altcoin_Market_Cap, Bitcoin_Market_Cap,
              labels=labels, colors=colors)

plt.gcf().autofmt_xdate()

plt.legend(loc='upper left')
plt.ylabel('Market Cap (USD)')
plt.xticks(rotation='-70', ha='left')
plt.ticklabel_format(axis='y', style="sci")  # or style = "plain"

plt.title("Bitcoin Dominance")
plt.tight_layout()
plt.show()

# Colors:
# Blue = #008fd5
# Red = #fc4f30
# Yellow = #e5ae37
# Green = #6d904f
