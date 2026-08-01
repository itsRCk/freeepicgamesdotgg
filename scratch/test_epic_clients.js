const https = require('https');

const client = {
  name: 'Real Legendary EGL Client',
  id: '34a02cf8f4414e29b15921876da36f9a',
  secret: 'daafbccc737745039dffe53d94fc76cf'
};

const basicAuth = 'Basic ' + Buffer.from(`${client.id}:${client.secret}`).toString('base64');
console.log('Basic Auth base64:', basicAuth);

const postData = 'grant_type=exchange_code&exchange_code=00000000000000000000000000000000';
const req = https.request('https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token', {
  method: 'POST',
  headers: {
    'Authorization': basicAuth,
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': Buffer.byteLength(postData)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Response: ${data}`);
  });
});
req.on('error', (e) => {
  console.log(`Error: ${e.message}`);
});
req.write(postData);
req.end();
