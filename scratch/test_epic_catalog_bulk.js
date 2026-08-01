const https = require('https');

// Test with Fortnite namespace "fn" or Luto namespace
// Let's test calling Epic catalog bulk API for Luto or Lumnes
const url = 'https://catalog-public-service-prod06.ol.epicgames.com/catalog/api/shared/namespace/fn/bulk/items?id=4fe75bbc5a674f4f9b356b5c90567da5&country=US&locale=en-US';

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', data.slice(0, 500));
  });
}).on('error', (e) => {
  console.log('Error:', e.message);
});
