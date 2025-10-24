const { TTL, PORT } = require('./config');

const tickers = ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'];
const hostname = `http://localhost:${PORT}`

async function testTicker(ticker) {
  const start = Date.now();
  const response = await fetch(`${hostname}/stock/${ticker}`);
  const data = await response.json();
  const duration = Date.now() - start;
  
  console.log(`${ticker}: ${duration}ms (${data.source})`);
  return duration;
}

async function runTest() {
  console.log('\n=== FIRST RUN (Cache Miss) ===');
  let total1 = 0;
  for (const ticker of tickers) {
    total1 += await testTicker(ticker);
  }
  console.log(`Total: ${total1}ms\n`);
  
  console.log(`Waiting ${TTL+1} seconds...\n`);
  await new Promise(resolve => setTimeout(resolve, (TTL+1)*1000));
  
  console.log('=== SECOND RUN (Cache Hit) ===');
  let total2 = 0;
  for (const ticker of tickers) {
    total2 += await testTicker(ticker);
  }
  console.log(`Total: ${total2}ms\n`);
  
  console.log(`🚀 Speedup: ${(total1 / total2).toFixed(1)}x faster with cache!`);
}

runTest();
