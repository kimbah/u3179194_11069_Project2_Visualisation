from matplotlib import pyplot as plt

plt.style.use("fivethirtyeight")

year = [2012, 2013, 2014, 2015, 2016, 2017, 2018]

lows = [4, 75, 200, 185, 365, 780, 3200]

plt.bar(year, lows)

plt.tight_layout(pad=2.5, w_pad=12, h_pad=20)
# plt.autoscale()

xlocs, xlabs = plt.xticks()
plt.tick_params(axis='x', pad=10)

plt.title("Bitcoin Yearly Low Price")
# plt.xlabel('Year')
plt.ylabel('Yearly Lows (USD)')

for i, v in enumerate(lows):
    plt.text(xlocs[i] + .65, v + 15, str(v))

plt.show()
