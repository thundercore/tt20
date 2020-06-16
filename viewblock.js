const https = require('https');

// 1. Goto https://viewblock.io/thundercore/verifyContract
// 2. Search for 'nightly' in Chrome DevTools
// 3. Extract JSON array from minimized Javascript bundle
const solcVersions = [
  "v0.5.9+commit.e560f70d",
  "v0.5.8+commit.23d335f2",
  "v0.5.7+commit.6da8b019",
  "v0.5.6+commit.b259423e",
  "v0.5.5+commit.47a71e8f",
  "v0.5.4+commit.9549d8ff",
  "v0.5.3+commit.10d17f24",
  "v0.5.2+commit.1df8f40c",
  "v0.5.1+commit.c8a2cb62",
  "v0.5.0+commit.1d4f565a",
  "v0.4.26+commit.4563c3fc",
  "v0.4.25+commit.59dbf8f1",
  "v0.4.24+commit.e67f0147",
  "v0.4.23+commit.124ca40d",
  "v0.4.22+commit.4cb486ee",
  "v0.4.21+commit.dfe3193c",
  "v0.4.20+commit.3155dd80",
  "v0.4.19+commit.c4cbbb05",
  "v0.4.18+commit.9cf6e910",
  "v0.4.17+commit.bdeb9e52",
  "v0.4.16+commit.d7661dd9",
  "v0.4.15+commit.bbb8e64f",
  "v0.4.14+commit.c2215d46",
  "v0.4.13+commit.fb4cb1a",
  "v0.4.12+commit.194ff033",
  "v0.4.11+commit.68ef5810",
];

// solcVersionMap('0.4.25') -> 'v0.4.25+commit.59dbf8f1'
function solcVersionMap(shortVersion) {
  if (shortVersion === 'native') { // special case for `github.com/thudnercore/hodl`
     shortVersion = '0.4.25';
  }
  for (let i=0; i<solcVersions.length; i++) {
    const v = solcVersions[i];
    if (v.slice(1).startsWith(shortVersion)) {
      return v;
    }
  }
  throw new Error(`invalid solc version "${shortVersion}"`);
}

// verifyContract(...) -> Promise().then([statusCode, response] => {...})
function verifyContract(apiKey, chain, code, address, name, solcVersion, optimized, runs, evmVersion, libraries) {
  const data = {
    chain: chain,
    code: code,
    address: address.toLowerCase(),
    name: name,
    version: solcVersion,
    optimized: optimized,
    runs: runs,
  };
  if (libraries !== undefined && libraries !== null) { // array of {name, address} pairs
    data['libraries'] = libraries;
  }
  if (evmVersion !== undefined && evmVersion !== null) { // 'byzantium'
    data['evmVersion'] = evmVersion;
  }
  const payload = JSON.stringify(data);
  const options = {
    hostname: 'verifier.viewblock.io',
    port: 443,
    path: '',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': payload.length,
      'X-APIKEY': apiKey,
    },
  };
  console.log('https://verifier.viewblock.io request headers:', options.headers);
  console.log('request:', data);
  // 'https://verifier.viewblock.io'
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      const statusMsg = `https://verifier.viewblock.io response statusCode: ${res.statusCode}`;
      console.log(statusMsg);
      const responseChunks = [];
      res.on('data', (chunk) => {
        responseChunks.push(chunk);
      });
      let responseData = null;
      res.on('end', function() {
        try {
          responseData = JSON.parse(Buffer.concat(responseChunks).toString());
        } catch(error) {
          reject(error);
        }
        console.log('https://verifier.viewblock.io response:', responseData);
        if (res.statusCode < 200 || res.statusCode >= 300) {
          if (res.statusCode == 400 && responseData.message === 'errors.alreadyVerified') {
            resolve([res.statusCode, responseData]);
          } else {
            reject(new Error(statusMsg));
          }
        } else {
          resolve([res.statusCode, responseData]);
        }
      });
    });
    req.on('error', (error) => {
      console.error(error);
      reject(error);
    });
    req.write(payload);
    req.end();
  });
}

// supportedNetworkName(name) -> bool, where `name` is a key in `require('truffle-config').networks`
function supportedNetworkName(networkName) {
  // https://viewblock.io/thundercore
  return networkName === 'thunder-mainnet';
}

module.exports = {
  supportedNetworkName: supportedNetworkName,
  solcVersionMap: solcVersionMap,
  verifyContract: verifyContract,
};
