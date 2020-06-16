// Synopsis
//
// Issue tokens to address:
//
// $ truffle exec --network thunder-testnet issue.js address amount
//
// OPTIONS:
// (The --network option is from `truffle exec`)
//
// This is a Truffle external script:
// See: https://truffleframework.com/docs/truffle/getting-started/writing-external-scripts

const process = require('process');
const fs = require('fs');
const path = require('path');
const JSON5 = require('json5');
const program = require('commander');
const pprint = require('./pprint');

module.exports = function(done) {
  program.usage('[options]')
         .option('--network <network>', 'used by truffle only')
         .parse(process.argv);
  (async () => {
    try {
      const contractName = program.contract;
      const networkId = await web3.eth.net.getId();
      const contractDataStr = fs.readFileSync(path.join('contracts-deployed-to-production',
                                                        networkId + '-Token.json'),
                                              { encoding: 'utf8' });
      const contractData = JSON5.parse(contractDataStr);
      const deployedNetwork = contractData.networks[networkId];
      if (!deployedNetwork || !deployedNetwork.address) {
        console.log(`No record of contract "${contractName}" being deployed on chain with network_id: ${networkId}`);
        process.exit(1);
      }
      const contractAddress = deployedNetwork.address;
      const accounts = await web3.eth.getAccounts();
      const fromAccount = accounts[0];
      const contract = new web3.eth.Contract(contractData.abi, contractAddress, {
        from: fromAccount
      });
      const address = process.argv[process.argv.length-2];
      let amount = process.argv[process.argv.length-1];
      const decimal = new web3.utils.BN(await contract.methods.decimals().call())
      let t = new web3.utils.BN(amount)
      let e = new web3.utils.BN(10)
      e = e.pow(decimal)
      t = t.mul(e)

      console.log(`Issue ${t} to ${address}`)
      let receipt = await contract.methods.issue(t.toString(10, 0), address).send();
      console.log('receipt:', pretty.format(receipt));
      let b = await contract.methods.balanceOf(address).call();
      console.log(`balance of ${address}:`, address, b);
      done();
    } catch(err) {
      console.log('Exception:', err);
      process.exit(1);
      done();
    }
  })();
}
