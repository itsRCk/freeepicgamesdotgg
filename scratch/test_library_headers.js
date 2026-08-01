const https = require('https');

const libraryUrl = 'https://library-service.live.use1a.on.epicgames.com/library/api/public/items?includeMetadata=true';

const req = https.request(libraryUrl, {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer eg1~dummy_token_test',
    'Accept': 'application/json',
    'User-Agent': 'Legendary/0.20.34'
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    console.log('Body:', data);
  });
});

req.on('error', (e) => {
  console.log('Error:', e.message);
});
req.end();
