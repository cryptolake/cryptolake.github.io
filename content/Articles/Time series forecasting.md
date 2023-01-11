# Time series forecasting: When to invest for Bitcoin

## Goals:

Our task in this project is to build a model with RNNs to predict bitcoin closing price the following hour given the previous 24 hours.

### Here Are some questions to consider:

- Are all of the data points useful?
- Are all of the data features useful?
- Should you rescale the data?
- Is the current time window relevant?
- How should you save this preprocessed data?


## Prerequisites:

- Pandas
- numpy
- tensorflow keras
- seaborn

## Reference: [Time series forecasting](https://www.tensorflow.org/tutorials/structured_data/time_series)


```python
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
import tensorflow as tf
```

# EDA

We start by exploring our data, in this project we have two csv files one from bitstamp and the other from coinbase,
first thing we first we load the coinbase csv using pandas.


```python
df = pd.read_csv('./data/coinbase.csv')
```

### Features

Each row in this dataframe represents bitcoin price in the given minute

- Timestamp: The unix time for each price
- Open: Opening price for each minute
- High: The Highest price for each minute
- Low: The lowest price for each minute
- Close: Closing price for each minute
- Volume_(BTC): the ammount of btc transacted in the given minute
- Volume_(Currency): the ammount of btc in USD transacted in the given minute


```python
df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Timestamp</th>
      <th>Open</th>
      <th>High</th>
      <th>Low</th>
      <th>Close</th>
      <th>Volume_(BTC)</th>
      <th>Volume_(Currency)</th>
      <th>Weighted_Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1417411980</td>
      <td>300.00</td>
      <td>300.00</td>
      <td>300.00</td>
      <td>300.00</td>
      <td>0.010000</td>
      <td>3.000000</td>
      <td>300.000000</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1417412040</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1417412100</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1417412160</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1417412220</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
      <td>NaN</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>2099755</th>
      <td>1546898520</td>
      <td>4006.01</td>
      <td>4006.57</td>
      <td>4006.00</td>
      <td>4006.01</td>
      <td>3.382954</td>
      <td>13553.433078</td>
      <td>4006.390309</td>
    </tr>
    <tr>
      <th>2099756</th>
      <td>1546898580</td>
      <td>4006.01</td>
      <td>4006.57</td>
      <td>4006.00</td>
      <td>4006.01</td>
      <td>0.902164</td>
      <td>3614.083168</td>
      <td>4006.017232</td>
    </tr>
    <tr>
      <th>2099757</th>
      <td>1546898640</td>
      <td>4006.01</td>
      <td>4006.01</td>
      <td>4006.00</td>
      <td>4006.01</td>
      <td>1.192123</td>
      <td>4775.647308</td>
      <td>4006.003635</td>
    </tr>
    <tr>
      <th>2099758</th>
      <td>1546898700</td>
      <td>4006.01</td>
      <td>4006.01</td>
      <td>4005.50</td>
      <td>4005.50</td>
      <td>2.699700</td>
      <td>10814.241898</td>
      <td>4005.719991</td>
    </tr>
    <tr>
      <th>2099759</th>
      <td>1546898760</td>
      <td>4005.51</td>
      <td>4006.01</td>
      <td>4005.51</td>
      <td>4005.99</td>
      <td>1.752778</td>
      <td>7021.183546</td>
      <td>4005.745614</td>
    </tr>
  </tbody>
</table>
<p>2099760 rows × 8 columns</p>
</div>




```python
df.isnull().sum()
```




    Timestamp                 0
    Open                 109069
    High                 109069
    Low                  109069
    Close                109069
    Volume_(BTC)         109069
    Volume_(Currency)    109069
    Weighted_Price       109069
    dtype: int64



### Missing values

We notice that that we have null values in come rows so we use the fillna method from pandas bfill strategy(filling by previous value) i've used it because our missing data is at the start.


```python
dfc=df.fillna(method="bfill")
```


```python
dfc.isnull().sum()
```




    Timestamp            0
    Open                 0
    High                 0
    Low                  0
    Close                0
    Volume_(BTC)         0
    Volume_(Currency)    0
    Weighted_Price       0
    dtype: int64



### Feature Selection

We notice that we have 4 columns that describe the price and 2 columns for the volum of coin, but do we need that many? As we can see the correlation between the price features is very high this indicates that we don't need only the closing price.


```python
dfcd = dfc.drop('Timestamp', axis=1)
dfcd.corr()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Open</th>
      <th>High</th>
      <th>Low</th>
      <th>Close</th>
      <th>Volume_(BTC)</th>
      <th>Volume_(Currency)</th>
      <th>Weighted_Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Open</th>
      <td>1.000000</td>
      <td>0.999998</td>
      <td>0.999997</td>
      <td>0.999997</td>
      <td>0.155421</td>
      <td>0.393050</td>
      <td>0.999999</td>
    </tr>
    <tr>
      <th>High</th>
      <td>0.999998</td>
      <td>1.000000</td>
      <td>0.999995</td>
      <td>0.999998</td>
      <td>0.156012</td>
      <td>0.393874</td>
      <td>0.999999</td>
    </tr>
    <tr>
      <th>Low</th>
      <td>0.999997</td>
      <td>0.999995</td>
      <td>1.000000</td>
      <td>0.999998</td>
      <td>0.154614</td>
      <td>0.391870</td>
      <td>0.999999</td>
    </tr>
    <tr>
      <th>Close</th>
      <td>0.999997</td>
      <td>0.999998</td>
      <td>0.999998</td>
      <td>1.000000</td>
      <td>0.155300</td>
      <td>0.392851</td>
      <td>0.999999</td>
    </tr>
    <tr>
      <th>Volume_(BTC)</th>
      <td>0.155421</td>
      <td>0.156012</td>
      <td>0.154614</td>
      <td>0.155300</td>
      <td>1.000000</td>
      <td>0.709897</td>
      <td>0.155303</td>
    </tr>
    <tr>
      <th>Volume_(Currency)</th>
      <td>0.393050</td>
      <td>0.393874</td>
      <td>0.391870</td>
      <td>0.392851</td>
      <td>0.709897</td>
      <td>1.000000</td>
      <td>0.392863</td>
    </tr>
    <tr>
      <th>Weighted_Price</th>
      <td>0.999999</td>
      <td>0.999999</td>
      <td>0.999999</td>
      <td>0.999999</td>
      <td>0.155303</td>
      <td>0.392863</td>
      <td>1.000000</td>
    </tr>
  </tbody>
</table>
</div>




```python
plt.rcParams["figure.figsize"] = [7.50, 3.50]
plt.rcParams["figure.autolayout"] = True
```

As we can see all the graphs for the prices correlate visually as well


```python
figure, axis = plt.subplots(2, 2)
axis[0, 0].plot(dfc['Timestamp'], dfc['Open'])
axis[0, 0].set_title('Open')
axis[0, 1].plot(dfc['Timestamp'], dfc['Weighted_Price'])
axis[0, 1].set_title('Weighted Price')
axis[1, 0].plot(dfc['Timestamp'], dfc['High'])
axis[1, 0].set_title('High')
axis[1, 1].plot(dfc['Timestamp'], dfc['Low'])
axis[1, 1].set_title('Low')
plt.show()
```


![png](Articles/output_17_0.png)



```python
plt.plot(dfc['Timestamp'], dfc['Close'])
```


![png](Articles/output_18_1.png)


### Normalization

Since the range of data goes from very low values to really high values especially with the case of the volume traded, that's why we will implement normalization.


```python
plt.scatter(dfc['Timestamp'], dfc['Volume_(BTC)'])
```


![png](Articles/output_20_1.png)


```python
plt.scatter(dfc['Timestamp'], (dfc['Volume_(BTC)']-dfc['Volume_(BTC)'].mean())/df['Volume_(BTC)'].std())
```


![png](Articles/output_21_1.png)



```python
dfc.hist()
```


![png](Articles/output_22_1.png)
    


Here we imported the bitstamp data and found that it has the the same range with more values we will apply the same techniques and use this data instead


```python
dfb = pd.read_csv('data/bitstampUSD_1-min_data_2012-01-01_to_2020-04-22.csv')
```


```python
dfb = dfb.fillna(method="bfill")
```


```python
dfb
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Timestamp</th>
      <th>Open</th>
      <th>High</th>
      <th>Low</th>
      <th>Close</th>
      <th>Volume_(BTC)</th>
      <th>Volume_(Currency)</th>
      <th>Weighted_Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>1325317920</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>0.455581</td>
      <td>2.000000</td>
      <td>4.390000</td>
    </tr>
    <tr>
      <th>1</th>
      <td>1325317980</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>48.000000</td>
      <td>210.720000</td>
      <td>4.390000</td>
    </tr>
    <tr>
      <th>2</th>
      <td>1325318040</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>48.000000</td>
      <td>210.720000</td>
      <td>4.390000</td>
    </tr>
    <tr>
      <th>3</th>
      <td>1325318100</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>48.000000</td>
      <td>210.720000</td>
      <td>4.390000</td>
    </tr>
    <tr>
      <th>4</th>
      <td>1325318160</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>4.39</td>
      <td>48.000000</td>
      <td>210.720000</td>
      <td>4.390000</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>4363452</th>
      <td>1587513360</td>
      <td>6847.97</td>
      <td>6856.35</td>
      <td>6847.97</td>
      <td>6856.35</td>
      <td>0.125174</td>
      <td>858.128697</td>
      <td>6855.498790</td>
    </tr>
    <tr>
      <th>4363453</th>
      <td>1587513420</td>
      <td>6850.23</td>
      <td>6856.13</td>
      <td>6850.23</td>
      <td>6850.89</td>
      <td>1.224777</td>
      <td>8396.781459</td>
      <td>6855.763449</td>
    </tr>
    <tr>
      <th>4363454</th>
      <td>1587513480</td>
      <td>6846.50</td>
      <td>6857.45</td>
      <td>6846.02</td>
      <td>6857.45</td>
      <td>7.089168</td>
      <td>48533.089069</td>
      <td>6846.090966</td>
    </tr>
    <tr>
      <th>4363455</th>
      <td>1587513540</td>
      <td>6854.18</td>
      <td>6854.98</td>
      <td>6854.18</td>
      <td>6854.98</td>
      <td>0.012231</td>
      <td>83.831604</td>
      <td>6854.195090</td>
    </tr>
    <tr>
      <th>4363456</th>
      <td>1587513600</td>
      <td>6850.60</td>
      <td>6850.60</td>
      <td>6850.60</td>
      <td>6850.60</td>
      <td>0.014436</td>
      <td>98.896906</td>
      <td>6850.600000</td>
    </tr>
  </tbody>
</table>
<p>4363457 rows × 8 columns</p>
</div>



### Selecting the appropriate time range

We notice in the range of time in the data that the low range is very irrelevant (BTC at the time wasn't as mainstream as it now) that's why i decided to remove it out and keep the window where the ranges are relevant.


```python
plt.plot(dfb['Timestamp'], dfb['Close'])
```



![png](Articles/output_28_1.png)


```python
sdfb = dfb[dfb['Timestamp'] >= 1.50*1e9]
```

Normalizing the new data


```python
def norm(df):
    return (df-df.mean())/df.std()
```


```python
plt.plot(sdfb['Timestamp'], sdfb['Close'])
```


![png](Articles/output_32_1.png)


```python
plt.plot(sdfb['Timestamp'], norm(sdfb['Close']))
```


![png](Articles/output_33_1.png)

```python
plt.scatter(sdfb['Timestamp'], sdfb['Volume_(BTC)'])
```

![png](Articles/output_34_1.png)


```python
plt.scatter(sdfb['Timestamp'], norm(sdfb['Volume_(BTC)']))
```

![png](Articles/output_35_1.png)
    



```python
plt.scatter(sdfb['Timestamp'], sdfb['Volume_(Currency)'])
```


![png](Articles/output_36_1.png)



```python
plt.scatter(sdfb['Timestamp'], norm(sdfb['Volume_(Currency)']))
```



![png](Articles/output_37_1.png)


Applying feature selection on the new data


```python
sdfb.corr()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Timestamp</th>
      <th>Open</th>
      <th>High</th>
      <th>Low</th>
      <th>Close</th>
      <th>Volume_(BTC)</th>
      <th>Volume_(Currency)</th>
      <th>Weighted_Price</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Timestamp</th>
      <td>1.000000</td>
      <td>0.106416</td>
      <td>0.105971</td>
      <td>0.107077</td>
      <td>0.106404</td>
      <td>-0.094584</td>
      <td>-0.082017</td>
      <td>0.106568</td>
    </tr>
    <tr>
      <th>Open</th>
      <td>0.106416</td>
      <td>1.000000</td>
      <td>0.999994</td>
      <td>0.999994</td>
      <td>0.999991</td>
      <td>0.021313</td>
      <td>0.202671</td>
      <td>0.999996</td>
    </tr>
    <tr>
      <th>High</th>
      <td>0.105971</td>
      <td>0.999994</td>
      <td>1.000000</td>
      <td>0.999989</td>
      <td>0.999994</td>
      <td>0.022329</td>
      <td>0.203772</td>
      <td>0.999996</td>
    </tr>
    <tr>
      <th>Low</th>
      <td>0.107077</td>
      <td>0.999994</td>
      <td>0.999989</td>
      <td>1.000000</td>
      <td>0.999994</td>
      <td>0.020111</td>
      <td>0.201358</td>
      <td>0.999997</td>
    </tr>
    <tr>
      <th>Close</th>
      <td>0.106404</td>
      <td>0.999991</td>
      <td>0.999994</td>
      <td>0.999994</td>
      <td>1.000000</td>
      <td>0.021202</td>
      <td>0.202541</td>
      <td>0.999996</td>
    </tr>
    <tr>
      <th>Volume_(BTC)</th>
      <td>-0.094584</td>
      <td>0.021313</td>
      <td>0.022329</td>
      <td>0.020111</td>
      <td>0.021202</td>
      <td>1.000000</td>
      <td>0.914575</td>
      <td>0.021153</td>
    </tr>
    <tr>
      <th>Volume_(Currency)</th>
      <td>-0.082017</td>
      <td>0.202671</td>
      <td>0.203772</td>
      <td>0.201358</td>
      <td>0.202541</td>
      <td>0.914575</td>
      <td>1.000000</td>
      <td>0.202488</td>
    </tr>
    <tr>
      <th>Weighted_Price</th>
      <td>0.106568</td>
      <td>0.999996</td>
      <td>0.999996</td>
      <td>0.999997</td>
      <td>0.999996</td>
      <td>0.021153</td>
      <td>0.202488</td>
      <td>1.000000</td>
    </tr>
  </tbody>
</table>
</div>




```python
nsdfb = sdfb.drop(['Open', 'High', 'Low', 'Weighted_Price', 'Timestamp'], axis=1)
```


```python
nsdfb.corr()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Close</th>
      <th>Volume_(BTC)</th>
      <th>Volume_(Currency)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Close</th>
      <td>1.000000</td>
      <td>0.021202</td>
      <td>0.202541</td>
    </tr>
    <tr>
      <th>Volume_(BTC)</th>
      <td>0.021202</td>
      <td>1.000000</td>
      <td>0.914575</td>
    </tr>
    <tr>
      <th>Volume_(Currency)</th>
      <td>0.202541</td>
      <td>0.914575</td>
      <td>1.000000</td>
    </tr>
  </tbody>
</table>
</div>




```python
df = nsdfb.drop(['Volume_(Currency)'], axis=1)
```


```python
df.corr()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Close</th>
      <th>Volume_(BTC)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Close</th>
      <td>1.000000</td>
      <td>0.021202</td>
    </tr>
    <tr>
      <th>Volume_(BTC)</th>
      <td>0.021202</td>
      <td>1.000000</td>
    </tr>
  </tbody>
</table>
</div>




```python
df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Close</th>
      <th>Volume_(BTC)</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>2904896</th>
      <td>2315.97</td>
      <td>1.569825</td>
    </tr>
    <tr>
      <th>2904897</th>
      <td>2315.94</td>
      <td>3.100000</td>
    </tr>
    <tr>
      <th>2904898</th>
      <td>2315.97</td>
      <td>1.592002</td>
    </tr>
    <tr>
      <th>2904899</th>
      <td>2315.99</td>
      <td>2.091700</td>
    </tr>
    <tr>
      <th>2904900</th>
      <td>2315.97</td>
      <td>0.582457</td>
    </tr>
    <tr>
      <th>...</th>
      <td>...</td>
      <td>...</td>
    </tr>
    <tr>
      <th>4363452</th>
      <td>6856.35</td>
      <td>0.125174</td>
    </tr>
    <tr>
      <th>4363453</th>
      <td>6850.89</td>
      <td>1.224777</td>
    </tr>
    <tr>
      <th>4363454</th>
      <td>6857.45</td>
      <td>7.089168</td>
    </tr>
    <tr>
      <th>4363455</th>
      <td>6854.98</td>
      <td>0.012231</td>
    </tr>
    <tr>
      <th>4363456</th>
      <td>6850.60</td>
      <td>0.014436</td>
    </tr>
  </tbody>
</table>
<p>1458561 rows × 2 columns</p>
</div>



### Data transformation

Since every row in our data represents a minute and we want our model to process the result from 24 hour data, we group the data by every 60 entry and we simplify the model.


```python
df = df.groupby(np.arange(len(df))//60).mean()
```


```python
df.hist()
```

![png](Articles/output_47_1.png)
    


### Splitting

We split our data into training, validation and testing sets for the model to train with and so we validate it


```python
column_indices = {name: i for i, name in enumerate(df.columns)}

n = len(df)
train_df = df[0:int(n*0.7)]
val_df = df[int(n*0.7):int(n*0.9)]
test_df = df[int(n*0.9):]

num_features = df.shape[1]
```


```python
train_mean = train_df.mean()
train_std = train_df.std()

train_df = (train_df - train_mean) / train_std
val_df = (val_df - train_mean) / train_std
test_df = (test_df - train_mean) / train_std
```


```python
df_std = (df - train_mean) / train_std
df_std = df_std.melt(var_name='Column', value_name='Normalized')
plt.figure(figsize=(12, 6))
ax = sns.violinplot(x='Column', y='Normalized', data=df_std)
_ = ax.set_xticklabels(df.keys(), rotation=90)
```

![png](Articles/output_51_0.png)
    


## Making dataset

Tensorflow offer a very convinient api for datasets we have a keras method to easily create a tf.data.dataset specifically for time series data with shape (batches, batch_size, sequence_length, features) after that we apply a window over the data which would split the sequence into a tuple of two sequences first element represents the past 24 hours and the other one represents the label or the next our.


```python
def split_window(batch):
    inputs = batch[:, :24, :]
    labels = batch[:, 24, 0]
    return inputs, labels
```


```python
def make_dataset(data):
    data = np.array(data, dtype=np.float32)
    ds = tf.keras.utils.timeseries_dataset_from_array(
      data=data,
      targets=None,
      sequence_length=25,
      sequence_stride=1,
      shuffle=False,
      batch_size=32)

    ds = ds.map(split_window)

    return ds
```


```python
train_dataset = make_dataset(train_df)
val_dataset = make_dataset(val_df)
test_dataset = make_dataset(test_df)
```

    2023-01-11 14:37:35.295207: W tensorflow/compiler/xla/stream_executor/platform/default/dso_loader.cc:64] Could not load dynamic library 'libcuda.so.1'; dlerror: libcuda.so.1: cannot open shared object file: No such file or directory
    2023-01-11 14:37:35.295229: W tensorflow/compiler/xla/stream_executor/cuda/cuda_driver.cc:265] failed call to cuInit: UNKNOWN ERROR (303)
    2023-01-11 14:37:35.295250: I tensorflow/compiler/xla/stream_executor/cuda/cuda_diagnostics.cc:156] kernel driver does not appear to be running on this host (archpc): /proc/driver/nvidia/version does not exist
    2023-01-11 14:37:35.295495: I tensorflow/core/platform/cpu_feature_guard.cc:193] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN) to use the following CPU instructions in performance-critical operations:  AVX2 FMA
    To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags.



```python
train_dataset.save('./datasets/train')
val_dataset.save('./datasets/val')
test_dataset.save('./datasets/test')
```

# Modeling,Training and Evaluation

For modeling we will be using tensorflow keras, but first we need to create a tensorflow.data.dataset object for our RNN to consume, we also perform splitting on the dataset to make it into a tuple of (inputs, prediction) with the input being 24 time sequences (24 hours) and prediction being 1 time sequence (1 hour).


```python
lstm_model = tf.keras.models.Sequential([
    # Shape [batch, time, features] => [batch, time, lstm_units]
    tf.keras.layers.LSTM(32, return_sequences=False),
    # Shape => [batch, time, features]
    tf.keras.layers.Dense(units=1)
])
```


```python
def compile_and_fit(model, train, val, epochs=20, patience=2):
    early_stopping = tf.keras.callbacks.EarlyStopping(monitor='val_loss',
                                                    patience=patience,
                                                    mode='min')

    model.compile(loss=tf.keras.losses.MeanSquaredError(),
                optimizer=tf.keras.optimizers.Adam(),
                metrics=[tf.keras.metrics.MeanAbsoluteError()])

    model.fit(train, epochs=epochs,
                      validation_data=val,
                      callbacks=[early_stopping])
```

As we can see early stopping stopped the training when it converged


```python
compile_and_fit(lstm_model, train_dataset, val_dataset)
```

    Epoch 1/20
    532/532 [==============================] - 8s 12ms/step - loss: 0.1017 - mean_absolute_error: 0.1463 - val_loss: 0.0140 - val_mean_absolute_error: 0.0674
    Epoch 2/20
    532/532 [==============================] - 6s 10ms/step - loss: 0.0434 - mean_absolute_error: 0.0883 - val_loss: 0.0122 - val_mean_absolute_error: 0.0646
    Epoch 3/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0426 - mean_absolute_error: 0.0872 - val_loss: 0.0094 - val_mean_absolute_error: 0.0546
    Epoch 4/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0328 - mean_absolute_error: 0.0758 - val_loss: 0.0060 - val_mean_absolute_error: 0.0443
    Epoch 5/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0244 - mean_absolute_error: 0.0668 - val_loss: 0.0056 - val_mean_absolute_error: 0.0410
    Epoch 6/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0202 - mean_absolute_error: 0.0602 - val_loss: 0.0047 - val_mean_absolute_error: 0.0383
    Epoch 7/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0165 - mean_absolute_error: 0.0541 - val_loss: 0.0040 - val_mean_absolute_error: 0.0342
    Epoch 8/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0136 - mean_absolute_error: 0.0492 - val_loss: 0.0034 - val_mean_absolute_error: 0.0316
    Epoch 9/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0110 - mean_absolute_error: 0.0448 - val_loss: 0.0028 - val_mean_absolute_error: 0.0280
    Epoch 10/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0087 - mean_absolute_error: 0.0403 - val_loss: 0.0020 - val_mean_absolute_error: 0.0236
    Epoch 11/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0068 - mean_absolute_error: 0.0368 - val_loss: 0.0018 - val_mean_absolute_error: 0.0219
    Epoch 12/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0056 - mean_absolute_error: 0.0341 - val_loss: 0.0015 - val_mean_absolute_error: 0.0204
    Epoch 13/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0043 - mean_absolute_error: 0.0304 - val_loss: 0.0013 - val_mean_absolute_error: 0.0186
    Epoch 14/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0033 - mean_absolute_error: 0.0276 - val_loss: 0.0012 - val_mean_absolute_error: 0.0178
    Epoch 15/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0025 - mean_absolute_error: 0.0250 - val_loss: 0.0011 - val_mean_absolute_error: 0.0171
    Epoch 16/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0019 - mean_absolute_error: 0.0226 - val_loss: 0.0011 - val_mean_absolute_error: 0.0175
    Epoch 17/20
    532/532 [==============================] - 6s 11ms/step - loss: 0.0018 - mean_absolute_error: 0.0221 - val_loss: 0.0013 - val_mean_absolute_error: 0.0193


## Evaluation

We will visually evaluate the mode by plotting some examples and their predictions.


```python
example_window = tf.stack([np.array(test_df[:25]),
                           np.array(test_df[100:100+25]),
                           np.array(test_df[200:200+25])])
example, _ = split_window(example_window)
```


```python
predictions = lstm_model.predict(example)
```

    1/1 [==============================] - 0s 414ms/step



```python
predictions
```

    array([[0.45651057],
           [0.64009064],
           [0.6150275 ]], dtype=float32)

```python
def unormalize_res(df):
    return df * train_std[0] + train_mean[0]
```


```python
pred = unormalize_res(predictions[0])
exp = unormalize_res(np.array(test_df[:25])[:, 0])
plt.scatter(list(range(25)), exp)
plt.scatter([24], pred)
```

![png](Articles/output_67_1.png)


```python
pred = unormalize_res(predictions[1])
exp = unormalize_res(np.array(test_df[100:100+25])[:, 0])
plt.scatter(list(range(25)), exp)
plt.scatter([24], pred)
```

![png](Articles/output_68_1.png)


```python
pred = unormalize_res(predictions[2])
exp = unormalize_res(np.array(test_df[200:200+25])[:, 0])
plt.scatter(list(range(25)), exp)
plt.scatter([24], pred)
```

![png](Articles/output_69_1.png)


# Conclusion

As we know bitcoin predictability is very low as it is very linked to other trends such as social media, inflation and overall news, but from our random examples we get overall good results, we can do use a smaller time frame or acquire more data and add more features such as bitcoin sentiment and inflation.
