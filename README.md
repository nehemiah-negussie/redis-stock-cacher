
# redis-stock-cacher

## Description
A small project to test out Redis functionality by comparing API calls for stock tickers to Redis cached values.

## Prerequisites
- Node.js (v14 or higher)
- Redis server running locally
- Finnhub API key (free at https://finnhub.io/)

## Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Add a `.env` file with your free API key from Finnhub: `STOCK_API_KEY=YOUR_API_KEY`
4. Set the port and TTL for Redis cache in `config.js`

## Configuration
Create a `.env` file in the root directory:
```
STOCK_API_KEY=your_finnhub_api_key_here
```

Adjust settings in `config.js`:
```javascript
PORT: 3000,  // Server port
TTL: 30      // Cache expiration in seconds
```

## Usage
1. Start your Redis server
2. Run the application: `node index.js`
3. Server will start on the configured port (default: 3000)

## API Endpoints

### GET /stock/:ticker
Retrieves the current stock price for a given ticker symbol.

**Parameters:**
- `ticker` (path parameter): 1-5 uppercase letters (e.g., AAPL, GOOGL)

**Response:**
```json
{
  "ticker": "AAPL",
  "price": 150.25,
  "source": "redis" // or "api"
}
```

**Error Responses:**
- `400`: Invalid ticker format
- `400`: Ticker not found
- `500`: API call failed

## Performance
Comparison of API calls vs Redis cache:

**First Run (API calls):**
- AAPL: 308ms
- GOOGL: 69ms
- MSFT: 85ms
- TSLA: 72ms
- AMZN: 74ms
- **Total: 608ms**

**Second Run (Redis cache):**
- AAPL: 8ms
- GOOGL: 5ms
- MSFT: 2ms
- TSLA: 7ms
- AMZN: 3ms
- **Total: 25ms**

**🚀 Result: 24.3x faster with cache!**

## Testing
Run the performance test script:
```bash
node test-cache.js
```

This script tests 5 popular stock tickers twice to demonstrate cache performance improvement.

## Project Structure
```
.
├── index.js          # Main Express server
├── config.js         # Configuration constants
├── test-cache.js     # Performance testing script
├── package.json      # Dependencies
└── .env             # Environment variables (not committed)
```

## License
MIT
