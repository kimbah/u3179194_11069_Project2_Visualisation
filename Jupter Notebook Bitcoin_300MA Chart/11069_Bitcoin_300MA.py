# To add a new cell, type '#%%'
# To add a new markdown cell, type '#%% [markdown]'
# %% Change working directory from the workspace root to the ipynb file location. Turn this addition off with the DataScience.changeDirOnImportExport setting
# ms-python.python added
import matplotlib.pyplot as plt
import os
try:
    os.chdir(os.path.join(os.getcwd(), 'Jupter Notebook Bitcoin_300MA Chart'))
    print(os.getcwd())
except:
    pass
# %%
from IPython import get_ipython

# %%
import pandas as pd


# %%
btc = pd.read_csv('Coinbase_BTCUSD_cleaned_300MA.csv')
btc['Date'] = pd.to_datetime(btc["Date"])
btc.set_index("Date", inplace=True)
btc.tail()


# %%
get_ipython().run_line_magic('matplotlib', 'inline')


# %%
btc.plot(figsize=(10, 5))
plt.savefig('btc_ma.png')
plt.savefig('btc_ma.svg')


# %%


# %%
