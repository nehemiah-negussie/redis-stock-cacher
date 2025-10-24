const express = require('express');
const finnhub = require('finnhub');
const redis = require('redis');
const { PORT, TTL } = require('./config');

require('dotenv').config();

const app = express();
const client = redis.createClient();
const finnhubClient = new finnhub.DefaultApi(process.env.STOCK_API_KEY)

app.get('/stock/:ticker', async (req, res) => {
    const ticker = req.params.ticker.toUpperCase()

    if (!/^[A-Z]{1,5}$/.test(ticker)) {
        return res.status(400).json({ error: 'Invalid ticker format' });
    }
    let cachedStockPrice = await client.hGet(`stock:${ticker}`, 'price')
    if (cachedStockPrice) {
        return res.json({ticker: ticker, price: cachedStockPrice, source: 'redis'})
    }

    finnhubClient.quote(ticker, async (error, data, response) => {
        if (error){
            return res.status(500).json({error: "API call failed to Finnhub (Stock API)"})
        } else {
            if (data.c == 0){
                return res.status(400).json({error: "Ticker could not be found"})
            }
            await client.hSet(`stock:${ticker}`, 'price', data.c)
            await client.EXPIRE(`stock:${ticker}`, TTL)
            return res.json({ price: data.c, ticker: ticker, source: 'api'})
        }

    })
    
})

client.on('error', err => console.log('Redis Client Error', err));

(async () => {
    try {
        await client.connect()
        console.log('Connected to Redis');
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        });
    } catch (error) {
        console.error('Failed to start server: ', error)
        process.exit(1);
    }
})();

process.on('SIGINT', async () => {
  await client.disconnect();
  process.exit(0);
});