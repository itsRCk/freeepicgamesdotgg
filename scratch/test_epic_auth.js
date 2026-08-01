const https = require('https');

const clients = [
  {
    name: 'EpicGamesLauncher (34a0...)',
    auth: 'Basic MzRhMDJjZjhmNDQxNGUyOWIxNTkyMTg3NmRhMzZmOWE6ZGFhZmJjY2M3MzZmYzUyMjVkNmVmZDNhMDFlMDA4ZDU=',
    clientId: '34a02cf8f4414e29b15921876da36f9a'
  },
  {
    name: 'Fortnite PCClient',
    auth: 'Basic ZWM2ODRiOGM2ODdmNDc5ZmFkZWEzY2IyYWQ4M2Y1YzY6ZTFmMzFjMjExZjI4NDEzMTg2MjYyZDM3YTEzZGM4ODQ=',
    clientId: 'ec684b8c687f479fadea3cb2ad83f5c6'
  },
  {
    name: 'UnrealEngineLauncher',
    auth: 'Basic eDM4YTMzZTZmNTI4OGE1ZmVhYTAyZTJlMzhmMmUyNTE6NTdGREEzNjNGODcwNEZDMkE4MEZFOEEzMkVCRENCOEY=',
    clientId: 'x38a33e6f5288a5feaa02e2e38f2e251'
  }
];

async function testClient(client) {
  return new Promise((resolve) => {
    const postData = 'grant_type=client_credentials';
    const req = https.request('https://account-public-service-prod03.ol.epicgames.com/account/api/oauth/token', {
      method: 'POST',
      headers: {
        'Authorization': client.auth,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`[${client.name}] -> Status: ${res.statusCode}, Body: ${data}`);
        resolve();
      });
    });
    req.on('error', (e) => {
      console.log(`[${client.name}] -> Error: ${e.message}`);
      resolve();
    });
    req.write(postData);
    req.end();
  });
}

async function run() {
  for (const c of clients) {
    await testClient(c);
  }
}

run();
