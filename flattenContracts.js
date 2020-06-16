// Concatenate Solidity source code of contracts and their transitive dependencies
// ./node_modules/.bin/truffle-flattener SOLIDITY_SOURCE > FLATTENDED_SOLIDITY_SOURCE

const path = require('path');
const fs = require('fs');
const child_process = require('child_process');
const mkdirp = require('mkdirp');

/* flatten: flatten every .sol file in contracts/ */
async function flatten() {
  const dirPath = path.join(__dirname, 'contracts');
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, function(err, dirContents) {
      if (err) {
        console.error(err);
        reject(err);
      }
      let i = 0;
      const promises = [];
      for (i = 0; i < dirContents.length; i++) {
        const n = dirContents[i];
        if (n === 'Migrations.sol' || !n.endsWith('.sol')) {
          continue;
        }
        const p = path.join(dirPath, n);
        promises.push(flattenFile(p));
      }
      Promise.all(promises).then(resolve, reject);
    });
  });
}

function flattenFile(filePath) {
  mkdirp.sync('flattened');
  const fout = fs.createWriteStream(path.join('flattened', path.basename(filePath)));
  const p = child_process.spawn('truffle-flattener', [filePath]);
  p.stdout.pipe(fout);
  return new Promise((resolve, reject) => {
    p.on('close', function(code) {
      if (code !== 0) {
        const msg = `truffle-flattener failed with exit status: ${code}`;
        console.log(msg);
        reject(new Error(msg));
      }
      resolve();
    });
    p.on('error', function(error) {
      console.error(error);
      reject(error);
    });
  });
}

module.exports = {
  flatten: flatten,
  flattenFile: flattenFile,
};
